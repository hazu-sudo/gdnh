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
  { id: "red", label: "赤", accent: "#d84444", background: "#f8dede", bookmarkColor: "#e05151" },
  { id: "blue", label: "青", accent: "#3578d4", background: "#dfeafb", bookmarkColor: "#4285df" },
  { id: "lightblue", label: "水色", accent: "#29a9d6", background: "#daf3fb", bookmarkColor: "#3bb7df" },
  { id: "yellow", label: "黄", accent: "#e0a900", background: "#fff2bd", bookmarkColor: "#efba16" },
  { id: "orange", label: "オレンジ", accent: "#e56c28", background: "#fae2d2", bookmarkColor: "#ef7935" },
  { id: "green", label: "緑", accent: "#31945b", background: "#dbf1e3", bookmarkColor: "#41a66a" },
  { id: "lime", label: "黄緑", accent: "#78a91f", background: "#eaf4cf", bookmarkColor: "#88ba2d" },
  { id: "purple", label: "紫", accent: "#8557bd", background: "#eadff6", bookmarkColor: "#9568cb" },
  { id: "black", label: "黒", accent: "#292a2d", background: "#dedfe1", bookmarkColor: "#3a3b3f" },
  { id: "white", label: "白", accent: "#737373", background: "#fafafa", bookmarkColor: "#a1a1a1" },
];

export const SHARE_THEMES = [
  { id: "simple", label: "シンプル", background: "#f4eadc", paper: "#fffdf8", accent: "#c97a61", ink: "#453832", muted: "#846f65", decoration: "none", position: "top-left", frame: true, bookmarkColor: "#d17f68", dearStyle: "standard" },
  { id: "gentle", label: "やさしい", background: "#e1eddf", paper: "#fcfdf9", accent: "#66886c", ink: "#354339", muted: "#6e7f70", decoration: "clover", position: "corners", frame: true, bookmarkColor: "#7c9b79", dearStyle: "soft" },
  { id: "thanks", label: "ありがとう", background: "#f3dfe6", paper: "#fffafb", accent: "#b96981", ink: "#49383e", muted: "#846b74", decoration: "heart", position: "corners", frame: true, bookmarkColor: "#ce7f94", dearStyle: "soft", wordmark: "Thank you" },
  { id: "birthday", label: "誕生日", background: "#f8dede", paper: "#fffdf9", accent: "#d84444", ink: "#49373a", muted: "#7f6d70", decoration: "none", position: "corners", frame: true, bookmarkColor: "#e05151", dearStyle: "soft", wordmark: "Happy Birthday" },
  { id: "celebration", label: "お祝い", background: "#fae2d2", paper: "#fffdf9", accent: "#e56c28", ink: "#473b34", muted: "#807269", decoration: "none", position: "corners", frame: true, bookmarkColor: "#ef7935", dearStyle: "standard", wordmark: "Anniversary" },
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

export function applyCelebrationColor(theme, colorId) {
  const color = CELEBRATION_COLORS.find((item) => item.id === colorId) || CELEBRATION_COLORS[0];
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
