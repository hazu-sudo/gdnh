import {
  createSampleBookmarks,
  generateOpenHint,
  LEGACY_STORAGE_KEYS,
  SELECTED_TARGET_KEY,
  STORAGE_KEY,
} from "./data.js";

const validStatuses = new Set(["unopened", "checked", "talked", "pending"]);

function normalizeBookmark(bookmark) {
  const rawName = String(bookmark.targetName || bookmark.person || "").trim();
  const targetType =
    bookmark.targetType === "self" || rawName === "自分"
      ? "self"
      : bookmark.targetType === "someone" || rawName === "誰か"
        ? "someone"
        : "person";
  const targetName = targetType === "self" ? "自分" : targetType === "someone" ? "誰か" : rawName;
  const emotion = String(bookmark.emotion || "その他").trim();
  const status =
    bookmark.status === "unsent"
      ? "unopened"
      : ["dismissed", "paused"].includes(bookmark.status)
        ? "pending"
        : bookmark.status || "unopened";

  return {
    id: String(bookmark.id || globalThis.crypto?.randomUUID?.() || Date.now()),
    targetType,
    targetName,
    emotion,
    memo: String(bookmark.memo || "").trim(),
    openHint:
      String(bookmark.openHint || bookmark.openingLine || "").trim() ||
      generateOpenHint({ targetType, emotion }),
    status: validStatuses.has(status) ? status : "unopened",
    createdAt: String(bookmark.createdAt || new Date().toLocaleDateString("sv-SE")),
  };
}

export function loadBookmarks() {
  const raw = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]
    .map((key) => localStorage.getItem(key))
    .find(Boolean);

  if (!raw) {
    const samples = createSampleBookmarks();
    saveBookmarks(samples);
    return samples;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = Array.isArray(parsed)
      ? parsed.map(normalizeBookmark).filter((item) => item.targetName && item.memo)
      : [];
    saveBookmarks(normalized);
    return normalized;
  } catch {
    const samples = createSampleBookmarks();
    saveBookmarks(samples);
    return samples;
  }
}

export function saveBookmarks(bookmarks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function loadSelectedTarget() {
  return localStorage.getItem(SELECTED_TARGET_KEY) || "";
}

export function saveSelectedTarget(targetName) {
  if (targetName) localStorage.setItem(SELECTED_TARGET_KEY, targetName);
  else localStorage.removeItem(SELECTED_TARGET_KEY);
}
