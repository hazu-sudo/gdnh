import { uniqueId } from "./utils.js";
import { getAppColor } from "./appColors.js";

const CUSTOM_THEME_KEY = "later-open-shiori-share-backgrounds-v1";

export const DECORATION_OPTIONS = [
  ["none", "なし"],
  ["clover", "クローバー"],
  ["flower", "花"],
  ["heart", "ハート"],
  ["bookmark", "しおり"],
  ["envelope", "封筒"],
  ["snow", "雪"],
];

export const POSITION_OPTIONS = [
  ["top", "上に飾る"],
  ["bottom", "下に飾る"],
  ["corners", "四隅に飾る"],
  ["top-left", "左上だけに飾る"],
];

const VALID_DECORATIONS = new Set(DECORATION_OPTIONS.map(([value]) => value));

export const SHARE_THEMES = [
  { id: "simple", label: "シンプル", background: "#f4eadc", paper: "#fffdf8", accent: "#c97a61", ink: "#453832", muted: "#846f65", decoration: "none", position: "top-left", frame: true, bookmarkColor: "#d17f68", dearStyle: "standard" },
  { id: "gentle", label: "やさしい", background: "#e1eddf", paper: "#fcfdf9", accent: "#66886c", ink: "#354339", muted: "#6e7f70", decoration: "clover", position: "corners", frame: true, bookmarkColor: "#7c9b79", dearStyle: "soft" },
  { id: "thanks", label: "ありがとう", background: "#f3dfe6", paper: "#fffafb", accent: "#b96981", ink: "#49383e", muted: "#846b74", decoration: "heart", position: "corners", frame: true, bookmarkColor: "#ce7f94", dearStyle: "soft", wordmark: "Thank you" },
  { id: "spring", label: "春", background: "#f5e1e5", paper: "#fffafa", accent: "#ca7b8b", ink: "#49383c", muted: "#896d72", decoration: "sakura", position: "corners", frame: true, bookmarkColor: "#dc8f9b", dearStyle: "soft" },
  { id: "summer", label: "夏", background: "#f7e8ae", paper: "#fffdf6", accent: "#c58d18", ink: "#4a402d", muted: "#81745d", decoration: "sunflower", position: "corners", frame: true, bookmarkColor: "#d7a126", dearStyle: "standard" },
  { id: "autumn", label: "秋", background: "#e4d1ba", paper: "#fff9f0", accent: "#8f5d39", ink: "#49382f", muted: "#836b5c", decoration: "ginkgo", position: "corners", frame: true, bookmarkColor: "#a36c43", dearStyle: "standard" },
  { id: "winter", label: "冬", background: "#dfe9f0", paper: "#fbfdff", accent: "#64859c", ink: "#35444d", muted: "#6d808a", decoration: "snow", position: "corners", frame: true, bookmarkColor: "#7899ad", dearStyle: "minimal" },
];

export const DEFAULT_CUSTOM_THEME = {
  id: "custom",
  label: "オリジナル背景",
  background: "#f3e7dc",
  paper: "#fffaf5",
  accent: "#c87e68",
  ink: "#463832",
  muted: "#826f67",
  decoration: "flower",
  position: "corners",
  frame: true,
  bookmarkColor: "#d18470",
  dearStyle: "standard",
};

export function applyAppTheme(theme, backgroundColorId, themeColorId) {
  if (theme.id !== "simple") return theme;
  const backgroundColor = getAppColor(backgroundColorId);
  const themeColor = getAppColor(themeColorId);
  return {
    ...theme,
    background: backgroundColor.background.canvas,
    paper: backgroundColor.background.paper,
    ink: backgroundColor.background.ink,
    muted: backgroundColor.background.muted,
    accent: themeColor.accent.main,
    bookmarkColor: themeColor.accent.main,
  };
}

function normalizeTheme(theme) {
  if (!theme || typeof theme !== "object") return null;
  return {
    ...DEFAULT_CUSTOM_THEME,
    ...theme,
    id: String(theme.id || `custom-${uniqueId()}`),
    label: String(theme.label || "マイ背景"),
    decoration: VALID_DECORATIONS.has(theme.decoration) ? theme.decoration : "none",
  };
}

export function loadCustomThemes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_THEME_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.map(normalizeTheme).filter(Boolean).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function saveCustomTheme(theme) {
  const saved = {
    ...normalizeTheme(theme),
    id: `custom-${uniqueId()}`,
  };
  const themes = [...loadCustomThemes(), saved].slice(-20);
  localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(themes));
  window.dispatchEvent(new CustomEvent("shiori-local-setting", {
    detail: { customThemes: themes },
  }));
  return { saved, themes };
}
