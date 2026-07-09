import {
  createSampleBookmarks,
  generateOpenHint,
  LEGACY_SELECTED_PERSON_KEY,
  LEGACY_STORAGE_KEYS,
  SELECTED_TARGET_KEY,
  STORAGE_KEY,
} from "./data";

const validStatuses = new Set(["unopened", "checked", "talked", "pending"]);
const statusMigration = {
  unsent: "unopened",
  dismissed: "pending",
  paused: "pending",
};

const emotionMigration = {
  "ありがとうを言いたい": "ありがとう",
  謝りたい: "ごめんね",
  報告: "その他",
  なんとなく話したい: "なんとなく",
};

const targetTypeMigration = {
  specific: "person",
  person: "person",
  someone: "someone",
  self: "self",
};

function resolveTargetType(bookmark, targetName) {
  const rawType = bookmark.targetType || bookmark.destinationType;

  if (targetName === "誰か") {
    return "someone";
  }

  if (targetName === "自分") {
    return "self";
  }

  return targetTypeMigration[rawType] || "person";
}

function normalizeBookmark(bookmark) {
  const targetName = String(bookmark.targetName || bookmark.person || "").trim() || "誰か";
  const targetType = resolveTargetType(bookmark, targetName);
  const emotion = emotionMigration[bookmark.emotion] || bookmark.emotion || "その他";
  const status = statusMigration[bookmark.status] || bookmark.status || "unopened";
  const openHint =
    String(bookmark.openHint || bookmark.openingLine || bookmark.question || "").trim() ||
    generateOpenHint({ targetType, emotion });

  return {
    id: String(bookmark.id || globalThis.crypto?.randomUUID?.() || Date.now()),
    targetType,
    targetName,
    emotion: String(emotion).trim() || "その他",
    memo: String(bookmark.memo || "").trim(),
    openHint,
    status: validStatuses.has(status) ? status : "unopened",
    createdAt: String(bookmark.createdAt || new Date().toLocaleDateString("sv-SE")),
  };
}

function normalizeBookmarks(bookmarks) {
  return bookmarks
    .map(normalizeBookmark)
    .filter((bookmark) => bookmark.targetName && bookmark.emotion && bookmark.memo);
}

function readStoredBookmarks() {
  const current = localStorage.getItem(STORAGE_KEY);

  if (current) {
    return current;
  }

  for (const key of LEGACY_STORAGE_KEYS) {
    const legacy = localStorage.getItem(key);

    if (legacy) {
      return legacy;
    }
  }

  return "";
}

export function loadBookmarks() {
  const stored = readStoredBookmarks();

  if (!stored) {
    const samples = normalizeBookmarks(createSampleBookmarks());
    saveBookmarks(samples);
    return samples;
  }

  try {
    const parsed = JSON.parse(stored);
    const bookmarks = Array.isArray(parsed) ? normalizeBookmarks(parsed) : [];
    saveBookmarks(bookmarks);
    return bookmarks;
  } catch {
    const samples = normalizeBookmarks(createSampleBookmarks());
    saveBookmarks(samples);
    return samples;
  }
}

export function saveBookmarks(bookmarks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function loadSelectedTarget() {
  return (
    localStorage.getItem(SELECTED_TARGET_KEY) ||
    localStorage.getItem(LEGACY_SELECTED_PERSON_KEY) ||
    ""
  );
}

export function saveSelectedTarget(targetName) {
  if (targetName) {
    localStorage.setItem(SELECTED_TARGET_KEY, targetName);
  } else {
    localStorage.removeItem(SELECTED_TARGET_KEY);
  }
}
