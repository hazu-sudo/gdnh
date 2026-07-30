import { createSampleBookmarks, LEGACY_STORAGE_KEYS, STORAGE_KEY } from "./data.js";

const statusMigration = {
  unopened: "unresolved",
  checked: "unresolved",
  talked: "resolved",
  pending: "pending",
  unresolved: "unresolved",
  resolved: "resolved",
  sent: "sent",
};
const FONT_SIZE_KEY = "later-open-shiori-font-size-v1";
const THEME_KEY = "later-open-shiori-theme-v1";
const BACKGROUND_COLOR_KEY = "later-open-shiori-background-color-v1";
const THEME_COLOR_KEY = "later-open-shiori-theme-color-v1";
const REFLECTION_KEY = "later-open-shiori-reflection-v1";
const HINTS_KEY = "later-open-shiori-hints-visible-v1";
const HINTS_INTRO_KEY = "later-open-shiori-hints-intro-v1";
const SENDER_NAME_KEY = "later-open-shiori-sender-name-v1";
const HINT_CACHE_KEY = "later-open-shiori-hint-cache-v1";
const CUSTOM_THEMES_KEY = "later-open-shiori-share-backgrounds-v1";
const validFontSizes = new Set(["small", "standard", "large"]);
const validThemes = new Set(["red", "pink", "blue", "yellow", "orange", "brown", "green", "purple", "mono"]);

function normalizeBookmark(bookmark) {
  return {
    id: String(bookmark.id || globalThis.crypto?.randomUUID?.() || Date.now()),
    targetName: String(bookmark.targetName || bookmark.person || "").trim(),
    memo: String(bookmark.memo || "").trim(),
    status: statusMigration[bookmark.status] || "unresolved",
    createdAt: String(bookmark.createdAt || new Date().toLocaleDateString("sv-SE")),
    attachmentId: String(bookmark.attachmentId || ""),
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
    const normalized = Array.isArray(parsed) ? parsed.map(normalizeBookmark) : [];
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

export function loadBackgroundColor() {
  const stored = localStorage.getItem(BACKGROUND_COLOR_KEY);
  return validThemes.has(stored) ? stored : loadTheme();
}

export function saveBackgroundColor(color) {
  if (validThemes.has(color)) localStorage.setItem(BACKGROUND_COLOR_KEY, color);
}

export function loadThemeColor() {
  const stored = localStorage.getItem(THEME_COLOR_KEY);
  return validThemes.has(stored) ? stored : loadTheme();
}

export function saveThemeColor(color) {
  if (validThemes.has(color)) localStorage.setItem(THEME_COLOR_KEY, color);
}

export function loadReflectionVisibility() {
  return localStorage.getItem(REFLECTION_KEY) !== "off";
}

export function saveReflectionVisibility(visible) {
  localStorage.setItem(REFLECTION_KEY, visible ? "on" : "off");
}

export function loadHintVisibility() {
  return localStorage.getItem(HINTS_KEY) === "on";
}

export function saveHintVisibility(visible) {
  localStorage.setItem(HINTS_KEY, visible ? "on" : "off");
}

export function loadHintIntroSeen() {
  return localStorage.getItem(HINTS_INTRO_KEY) === "seen";
}

export function saveHintIntroSeen() {
  localStorage.setItem(HINTS_INTRO_KEY, "seen");
}

export function loadSenderName() {
  return localStorage.getItem(SENDER_NAME_KEY) || "";
}

export function saveSenderName(name) {
  localStorage.setItem(SENDER_NAME_KEY, name);
}

export function loadHintCache(fallback = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(HINT_CACHE_KEY) || "[]");
    return Array.isArray(parsed) && parsed.length ? parsed.slice(0, 30) : fallback;
  } catch {
    return fallback;
  }
}

export function saveHintCache(hints, notify = true) {
  const next = hints.slice(0, 30);
  localStorage.setItem(HINT_CACHE_KEY, JSON.stringify(next));
  if (notify) {
    window.dispatchEvent(new CustomEvent("shiori-local-setting", {
      detail: { hintCache: next },
    }));
  }
}

export function loadSettingsSnapshot() {
  return {
    fontSize: loadFontSize(),
    backgroundColor: loadBackgroundColor(),
    themeColor: loadThemeColor(),
    showReflection: loadReflectionVisibility(),
    showHints: loadHintVisibility(),
    hintIntroSeen: loadHintIntroSeen(),
    senderName: loadSenderName(),
    hintCache: loadHintCache([]),
    customThemes: readArray(CUSTOM_THEMES_KEY),
  };
}

export function saveSettingsSnapshot(settings) {
  saveFontSize(settings.fontSize);
  saveBackgroundColor(settings.backgroundColor);
  saveThemeColor(settings.themeColor);
  saveReflectionVisibility(settings.showReflection);
  saveHintVisibility(settings.showHints);
  if (settings.hintIntroSeen) saveHintIntroSeen();
  saveSenderName(settings.senderName || "");
  if (Array.isArray(settings.hintCache)) saveHintCache(settings.hintCache, false);
  if (Array.isArray(settings.customThemes)) {
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(settings.customThemes.slice(0, 20)));
  }
}

function readArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
