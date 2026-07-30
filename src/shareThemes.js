import { uniqueId } from "./utils.js";

const CUSTOM_THEME_KEY = "later-open-shiori-share-backgrounds-v1";

export const DECORATION_OPTIONS = [
  ["none", "なし"],
  ["clover", "クローバー"],
  ["flower", "花"],
  ["star", "星"],
  ["heart", "ハート"],
  ["bookmark", "しおり"],
  ["envelope", "封筒"],
  ["ribbon", "リボン"],
  ["snow", "雪"],
  ["leaf", "葉っぱ"],
  ["pumpkin", "かぼちゃ"],
  ["gift", "プレゼント"],
  ["cake", "ケーキ"],
];

export const POSITION_OPTIONS = [
  ["top", "上に飾る"],
  ["bottom", "下に飾る"],
  ["corners", "四隅に飾る"],
  ["top-left", "左上だけに飾る"],
];

export const APP_THEME_PALETTES = {
  orange: { background: "#f3e3d2", accent: "#c86f55", bookmarkColor: "#dc7c61", muted: "#876d62" },
  pink: { background: "#f3e1e6", accent: "#b96f83", bookmarkColor: "#cf8296", muted: "#846b73" },
  blue: { background: "#dfeaf0", accent: "#60869a", bookmarkColor: "#7197aa", muted: "#697e89" },
  green: { background: "#e2ece1", accent: "#66866a", bookmarkColor: "#78957a", muted: "#6e7f70" },
  purple: { background: "#e9e2ef", accent: "#806d93", bookmarkColor: "#9580a8", muted: "#776e80" },
  mono: { background: "#e9e9e7", accent: "#555555", bookmarkColor: "#707070", muted: "#737373" },
};

export const CELEBRATION_COLORS = [
  { id: "red", label: "赤", accent: "#b95f5b", background: "#f2dfdc", bookmarkColor: "#c96b65" },
  { id: "blue", label: "青", accent: "#5f7f9d", background: "#dfe9f1", bookmarkColor: "#6f90ad" },
  { id: "yellow", label: "黄", accent: "#b98b38", background: "#f5ebc9", bookmarkColor: "#d0a548" },
  { id: "green", label: "緑", accent: "#66866a", background: "#e1ebdd", bookmarkColor: "#799779" },
  { id: "purple", label: "紫", accent: "#806893", background: "#e9e0ef", bookmarkColor: "#9277a5" },
  { id: "orange", label: "オレンジ", accent: "#bd704c", background: "#f3dfcf", bookmarkColor: "#d17c55" },
  { id: "pink", label: "ピンク", accent: "#be7185", background: "#f3dfe5", bookmarkColor: "#d18195" },
  { id: "white", label: "白", accent: "#77736c", background: "#f7f5f0", bookmarkColor: "#aaa49a" },
  { id: "black", label: "黒", accent: "#3f3f42", background: "#dededf", bookmarkColor: "#54545a" },
  { id: "lightblue", label: "水色", accent: "#5f96a9", background: "#dceff2", bookmarkColor: "#71a9b8" },
  { id: "lime", label: "黄緑", accent: "#79924e", background: "#e9efd5", bookmarkColor: "#8ea65e" },
];

export const SHARE_THEMES = [
  { id: "simple", label: "シンプル", background: "#f4eadc", paper: "#fffdf8", accent: "#c97a61", ink: "#453832", muted: "#846f65", decoration: "bookmark", position: "top-left", frame: true, bookmarkColor: "#d17f68", dearStyle: "standard" },
  { id: "gentle", label: "やさしい", background: "#e1eddf", paper: "#fcfdf9", accent: "#66886c", ink: "#354339", muted: "#6e7f70", decoration: "clover", position: "corners", frame: true, bookmarkColor: "#7c9b79", dearStyle: "soft" },
  { id: "thanks", label: "ありがとう", background: "#f3dfe6", paper: "#fffafb", accent: "#b96981", ink: "#49383e", muted: "#846b74", decoration: "heart", position: "corners", frame: true, bookmarkColor: "#ce7f94", dearStyle: "soft", wordmark: "Thank you" },
  { id: "birthday", label: "誕生日", background: "#f3dfe5", paper: "#fffaf6", accent: "#be7185", ink: "#49373a", muted: "#8e6b70", decoration: "cake", position: "corners", frame: true, bookmarkColor: "#d18195", dearStyle: "soft", wordmark: "Happy Birthday" },
  { id: "celebration", label: "お祝い", background: "#f3dfcf", paper: "#fffcf5", accent: "#bd704c", ink: "#473b34", muted: "#887569", decoration: "star", position: "corners", frame: true, bookmarkColor: "#d17c55", dearStyle: "standard", wordmark: "Anniversary" },
  { id: "spring", label: "春", background: "#f5e1e5", paper: "#fffafa", accent: "#ca7b8b", ink: "#49383c", muted: "#896d72", decoration: "flower", position: "corners", frame: true, bookmarkColor: "#dc8f9b", dearStyle: "soft" },
  { id: "summer", label: "夏", background: "#dceef2", paper: "#f8fdfd", accent: "#5894a8", ink: "#2f464b", muted: "#68868c", decoration: "wave", position: "top", frame: true, bookmarkColor: "#68a6b7", dearStyle: "minimal" },
  { id: "autumn", label: "秋", background: "#ead9c3", paper: "#fff9f0", accent: "#9f6245", ink: "#49382f", muted: "#836b5c", decoration: "leaf", position: "corners", frame: true, bookmarkColor: "#b36e4b", dearStyle: "standard" },
  { id: "winter", label: "冬", background: "#dfe9f0", paper: "#fbfdff", accent: "#64859c", ink: "#35444d", muted: "#6d808a", decoration: "snow", position: "corners", frame: true, bookmarkColor: "#7899ad", dearStyle: "minimal" },
  { id: "halloween", label: "ハロウィン", background: "#f0dccb", paper: "#fff9f4", accent: "#ad673f", ink: "#49382f", muted: "#826f65", decoration: "pumpkin", position: "corners", frame: true, bookmarkColor: "#7d658d", dearStyle: "standard" },
  { id: "christmas", label: "クリスマス", background: "#e3ebe3", paper: "#fffdf8", accent: "#587b65", ink: "#34443a", muted: "#6b7d71", decoration: "gift", position: "corners", frame: true, bookmarkColor: "#aa6963", dearStyle: "standard" },
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

export function applyCelebrationColor(theme, colorId) {
  const color = CELEBRATION_COLORS.find((item) => item.id === colorId) || CELEBRATION_COLORS[6];
  return { ...theme, background: color.background, accent: color.accent, bookmarkColor: color.bookmarkColor };
}

export function applyAppTheme(theme, appTheme) {
  return theme.id === "simple"
    ? { ...theme, ...(APP_THEME_PALETTES[appTheme] || APP_THEME_PALETTES.orange) }
    : theme;
}

function normalizeTheme(theme) {
  if (!theme || typeof theme !== "object") return null;
  return {
    ...DEFAULT_CUSTOM_THEME,
    ...theme,
    id: String(theme.id || `custom-${uniqueId()}`),
    label: String(theme.label || "マイ背景"),
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
  return { saved, themes };
}
