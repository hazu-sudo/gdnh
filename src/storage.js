import { createSampleBookmarks, LEGACY_STORAGE_KEYS, STORAGE_KEY } from "./data.js";

const statusMigration = {
  unopened: "unresolved",
  checked: "unresolved",
  talked: "resolved",
  pending: "pending",
  unresolved: "unresolved",
  resolved: "resolved",
};
const FONT_SIZE_KEY = "later-open-shiori-font-size-v1";
const THEME_KEY = "later-open-shiori-theme-v1";
const REFLECTION_KEY = "later-open-shiori-reflection-v1";
const validFontSizes = new Set(["small", "standard", "large"]);
const validThemes = new Set(["orange", "pink", "blue", "green", "purple", "mono"]);

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

export function loadFontSize() {
  const stored = localStorage.getItem(FONT_SIZE_KEY);
  return validFontSizes.has(stored) ? stored : "standard";
}

export function saveFontSize(size) {
  if (validFontSizes.has(size)) {
    localStorage.setItem(FONT_SIZE_KEY, size);
  }
}

export function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return validThemes.has(stored) ? stored : "orange";
}

export function saveTheme(theme) {
  if (validThemes.has(theme)) {
    localStorage.setItem(THEME_KEY, theme);
  }
}

export function loadReflectionVisibility() {
  return localStorage.getItem(REFLECTION_KEY) !== "off";
}

export function saveReflectionVisibility(visible) {
  localStorage.setItem(REFLECTION_KEY, visible ? "on" : "off");
}
