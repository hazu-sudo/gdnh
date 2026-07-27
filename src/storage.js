import { createSampleBookmarks, LEGACY_STORAGE_KEYS, STORAGE_KEY } from "./data.js";

const statusMigration = {
  unopened: "unresolved",
  checked: "unresolved",
  talked: "resolved",
  pending: "pending",
  unresolved: "unresolved",
  resolved: "resolved",
};

function normalizeBookmark(bookmark) {
  return {
    id: String(bookmark.id || globalThis.crypto?.randomUUID?.() || Date.now()),
    targetName: String(bookmark.targetName || bookmark.person || "").trim(),
    memo: String(bookmark.memo || "").trim(),
    status: statusMigration[bookmark.status] || "unresolved",
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
