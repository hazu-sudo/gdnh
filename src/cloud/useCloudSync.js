import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAllAttachments,
  getLocalAttachment,
} from "../attachmentStore.js";
import {
  loadBookmarks,
  loadSettingsSnapshot,
  saveBookmarks,
  saveSettingsSnapshot,
} from "../storage.js";
import {
  deleteCloudAttachment,
  uploadCloudAttachment,
} from "./cloudAttachments.js";
import { cloudConfigured, supabase } from "./supabaseClient.js";

const QUEUE_PREFIX = "later-open-shiori-sync-queue-v1:";
const CACHE_PREFIX = "later-open-shiori-cloud-cache-v1:";

const isSample = (bookmark) => String(bookmark.id).startsWith("sample-");

function mergeSettings(localSettings, storedSettings = {}) {
  const legacyColor = storedSettings.theme;
  return {
    ...localSettings,
    ...storedSettings,
    backgroundColor: storedSettings.backgroundColor || legacyColor || localSettings.backgroundColor || "orange",
    themeColor: storedSettings.themeColor || legacyColor || localSettings.themeColor || "orange",
  };
}

function toCloudBookmark(bookmark, userId) {
  const now = bookmark.updatedAt || new Date().toISOString();
  return {
    id: bookmark.id,
    user_id: userId,
    target_name: bookmark.targetName || "",
    memo: bookmark.memo || "",
    status: bookmark.status || "unresolved",
    bookmark_date: bookmark.createdAt,
    attachment_id: bookmark.attachmentId || null,
    created_at: bookmark.cloudCreatedAt || now,
    updated_at: now,
    deleted_at: bookmark.deletedAt || null,
  };
}

function fromCloudBookmark(row) {
  return {
    id: row.id,
    targetName: row.target_name || "",
    memo: row.memo || "",
    status: row.status || "unresolved",
    createdAt: row.bookmark_date,
    attachmentId: row.attachment_id || "",
    cloudCreatedAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "") || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useCloudSync() {
  const localBookmarks = useRef(loadBookmarks());
  const localSettings = useRef(loadSettingsSnapshot());
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!cloudConfigured);
  const [bookmarks, setBookmarks] = useState(localBookmarks.current);
  const [settings, setSettings] = useState(localSettings.current);
  const [syncStatus, setSyncStatus] = useState(cloudConfigured ? "loading" : "local");
  const [lastSyncAt, setLastSyncAt] = useState("");
  const [migrationPending, setMigrationPending] = useState(false);
  const pullInProgress = useRef(false);

  const user = session?.user || null;

  const cacheLocal = useCallback((nextBookmarks, nextSettings = settings) => {
    saveBookmarks(nextBookmarks);
    saveSettingsSnapshot(nextSettings);
    if (user) {
      writeJson(`${CACHE_PREFIX}${user.id}`, {
        bookmarks: nextBookmarks,
        settings: nextSettings,
      });
    }
  }, [settings, user]);

  const queueOperation = useCallback((operation) => {
    if (!user) return;
    const key = `${QUEUE_PREFIX}${user.id}`;
    writeJson(key, [...readJson(key, []), operation].slice(-200));
    setSyncStatus(navigator.onLine ? "syncing" : "waiting");
  }, [user]);

  const runOperation = useCallback(async (operation) => {
    if (!user) return;
    if (operation.type === "settings") {
      const { error } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        settings: operation.settings,
        updated_at: operation.updatedAt,
      });
      if (error) throw error;
      return;
    }

    if (operation.type === "delete") {
      if (operation.attachmentId) {
        await deleteCloudAttachment(operation.attachmentId).catch(() => {});
      }
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", operation.id);
      if (error) throw error;
      return;
    }

    const record = operation.bookmark;
    const cloudRecord = toCloudBookmark(record, user.id);
    const stagedRecord = record.attachmentId
      ? { ...cloudRecord, attachment_id: operation.oldAttachmentId || null }
      : cloudRecord;
    const { error: stageError } = await supabase
      .from("bookmarks")
      .upsert(stagedRecord);
    if (stageError) throw stageError;

    if (record.attachmentId) {
      const localAttachment = await getLocalAttachment(record.attachmentId);
      if (localAttachment) await uploadCloudAttachment(localAttachment, user.id);
    }
    const { error: finalError } = await supabase
      .from("bookmarks")
      .upsert(cloudRecord);
    if (finalError) throw finalError;
    if (operation.oldAttachmentId && operation.oldAttachmentId !== record.attachmentId) {
      await deleteCloudAttachment(operation.oldAttachmentId).catch(() => {});
    }
  }, [user]);

  const flushQueue = useCallback(async () => {
    if (!cloudConfigured || !user || !navigator.onLine) {
      if (user) setSyncStatus("waiting");
      return;
    }
    const key = `${QUEUE_PREFIX}${user.id}`;
    const queued = readJson(key, []);
    if (!queued.length) return;
    setSyncStatus("syncing");
    const remaining = [...queued];
    try {
      while (remaining.length) {
        await runOperation(remaining[0]);
        remaining.shift();
        writeJson(key, remaining);
      }
      setLastSyncAt(new Date().toISOString());
      setSyncStatus("synced");
    } catch {
      writeJson(key, remaining);
      setSyncStatus(navigator.onLine ? "error" : "waiting");
    }
  }, [runOperation, user]);

  const pullCloud = useCallback(async ({ allowMigration = true } = {}) => {
    if (!cloudConfigured || !user || pullInProgress.current) return;
    pullInProgress.current = true;
    setSyncStatus("syncing");
    try {
      const [{ data: bookmarkRows, error: bookmarkError }, { data: settingRow, error: settingError }] = await Promise.all([
        supabase
          .from("bookmarks")
          .select("*")
          .is("deleted_at", null)
          .order("bookmark_date", { ascending: false })
          .order("updated_at", { ascending: false }),
        supabase
          .from("user_settings")
          .select("settings,updated_at")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);
      if (bookmarkError) throw bookmarkError;
      if (settingError) throw settingError;

      const remoteBookmarks = (bookmarkRows || []).map(fromCloudBookmark);
      const migratable = localBookmarks.current.filter((item) => !isSample(item));
      if (allowMigration && !remoteBookmarks.length && migratable.length) {
        setBookmarks(migratable);
        setMigrationPending(true);
      } else {
        const nextSettings = settingRow?.settings
          ? mergeSettings(localSettings.current, settingRow.settings)
          : localSettings.current;
        setBookmarks(remoteBookmarks);
        setSettings(nextSettings);
        cacheLocal(remoteBookmarks, nextSettings);
      }
      setLastSyncAt(new Date().toISOString());
      setSyncStatus("synced");
    } catch {
      const cached = readJson(`${CACHE_PREFIX}${user.id}`, null);
      if (cached) {
        setBookmarks(cached.bookmarks || []);
        setSettings(mergeSettings(localSettings.current, cached.settings));
      }
      setSyncStatus(navigator.onLine ? "error" : "waiting");
    } finally {
      pullInProgress.current = false;
    }
  }, [cacheLocal, user]);

  useEffect(() => {
    if (!cloudConfigured) return undefined;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    const cached = readJson(`${CACHE_PREFIX}${user.id}`, null);
    if (cached) {
      setBookmarks(cached.bookmarks || []);
      setSettings(mergeSettings(localSettings.current, cached.settings));
    }
    pullCloud();
    flushQueue();
    const channel = supabase
      .channel(`shiori-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${user.id}` },
        () => pullCloud({ allowMigration: false }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_settings", filter: `user_id=eq.${user.id}` },
        () => pullCloud({ allowMigration: false }),
      )
      .subscribe();
    const handleOnline = () => flushQueue().then(() => pullCloud({ allowMigration: false }));
    const handleFocus = () => pullCloud({ allowMigration: false });
    window.addEventListener("online", handleOnline);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [flushQueue, pullCloud, user]);

  const perform = useCallback(async (operation) => {
    if (!cloudConfigured || !user) return;
    queueOperation(operation);
    await flushQueue();
  }, [flushQueue, queueOperation, user]);

  const addBookmark = useCallback((bookmark) => {
    const nextBookmark = {
      ...bookmark,
      cloudCreatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBookmarks((current) => {
      const next = [nextBookmark, ...current];
      cacheLocal(next);
      return next;
    });
    perform({ type: "upsert", bookmark: nextBookmark });
  }, [cacheLocal, perform]);

  const updateBookmark = useCallback((id, changes) => {
    const previous = bookmarks.find((item) => item.id === id);
    if (!previous) return;
    const updated = { ...previous, ...changes, updatedAt: new Date().toISOString() };
    const next = bookmarks.map((item) => item.id === id ? updated : item);
    setBookmarks(next);
    cacheLocal(next);
    perform({
      type: "upsert",
      bookmark: updated,
      oldAttachmentId: previous.attachmentId || "",
    });
  }, [bookmarks, cacheLocal, perform]);

  const updateStatus = useCallback((id, status) => {
    updateBookmark(id, { status });
  }, [updateBookmark]);

  const deleteBookmark = useCallback((id) => {
    const previous = bookmarks.find((item) => item.id === id);
    const next = bookmarks.filter((item) => item.id !== id);
    setBookmarks(next);
    cacheLocal(next);
    perform({
      type: "delete",
      id,
      attachmentId: previous?.attachmentId || "",
    });
  }, [bookmarks, cacheLocal, perform]);

  const updateSettings = useCallback((changes) => {
    const next = { ...settings, ...changes };
    setSettings(next);
    cacheLocal(bookmarks, next);
    perform({ type: "settings", settings: next, updatedAt: new Date().toISOString() });
  }, [bookmarks, cacheLocal, perform, settings]);

  useEffect(() => {
    const handleLocalSetting = (event) => {
      if (event.detail && typeof event.detail === "object") {
        updateSettings(event.detail);
      }
    };
    window.addEventListener("shiori-local-setting", handleLocalSetting);
    return () => window.removeEventListener("shiori-local-setting", handleLocalSetting);
  }, [updateSettings]);

  const migrateLocalData = useCallback(async () => {
    if (!user) return;
    setSyncStatus("syncing");
    try {
      const local = localBookmarks.current.filter((item) => !isSample(item));
      const now = new Date().toISOString();
      const prepared = local.map((item) => ({
        ...item,
        cloudCreatedAt: item.cloudCreatedAt || now,
        updatedAt: item.updatedAt || now,
      }));
      if (prepared.length) {
        const { error } = await supabase
          .from("bookmarks")
          .upsert(prepared.map((item) => toCloudBookmark(item, user.id)));
        if (error) throw error;
      }
      const attachments = await getAllAttachments();
      for (const attachment of attachments) {
        await uploadCloudAttachment(attachment, user.id);
      }
      await runOperation({
        type: "settings",
        settings: localSettings.current,
        updatedAt: now,
      });
      setMigrationPending(false);
      await pullCloud({ allowMigration: false });
    } catch {
      setSyncStatus("error");
    }
  }, [pullCloud, runOperation, user]);

  const skipMigration = useCallback(() => {
    setMigrationPending(false);
    pullCloud({ allowMigration: false });
  }, [pullCloud]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const migratable = localBookmarks.current.filter((item) => !isSample(item));
    if (migratable.length) {
      writeJson("later-open-shiori-legacy-backup-v1", migratable);
    }
    localBookmarks.current = [];
    saveBookmarks([]);
    setBookmarks([]);
    setSession(null);
    await supabase.auth.signOut();
  }, []);

  return {
    authReady,
    bookmarks,
    cloudConfigured,
    lastSyncAt,
    migrationPending,
    session,
    settings,
    syncStatus,
    user,
    addBookmark,
    deleteBookmark,
    migrateLocalData,
    pullCloud,
    signOut,
    skipMigration,
    updateBookmark,
    updateSettings,
    updateStatus,
  };
}
