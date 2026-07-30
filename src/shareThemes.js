import { uniqueId } from "./utils.js";

const CUSTOM_THEME_KEY = "later-open-shiori-share-backgrounds-v1";

export const DECORATION_OPTIONS = [
  ["none", "なし"],
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

export const SHARE_THEMES = [
  { id: "simple", label: "シンプル", background: "#f4eadc", paper: "#fffdf8", accent: "#c97a61", ink: "#453832", muted: "#846f65", decoration: "bookmark", position: "top-left", frame: false, bookmarkColor: "#d17f68", dearStyle: "standard" },
  { id: "gentle", label: "やさしい", background: "#f7e9e3", paper: "#fffaf6", accent: "#cf8590", ink: "#49393a", muted: "#8c6d70", decoration: "heart", position: "corners", frame: true, bookmarkColor: "#d99096", dearStyle: "soft" },
  { id: "blue", label: "青いしおり", background: "#dfecef", paper: "#f9fcfc", accent: "#678da0", ink: "#31444b", muted: "#698089", decoration: "bookmark", position: "top", frame: true, bookmarkColor: "#6f98aa", dearStyle: "minimal" },
  { id: "warm", label: "あたたかい", background: "#f2dfc7", paper: "#fff8ed", accent: "#b96d4f", ink: "#4d372f", muted: "#8b6a5b", decoration: "ribbon", position: "bottom", frame: true, bookmarkColor: "#c8785c", dearStyle: "standard" },
  { id: "birthday", label: "誕生日", background: "#f8e5da", paper: "#fffaf5", accent: "#d27982", ink: "#49373a", muted: "#8e6b70", decoration: "cake", position: "corners", frame: true, bookmarkColor: "#d88d6d", dearStyle: "soft" },
  { id: "celebration", label: "お祝い", background: "#f6ead1", paper: "#fffcf5", accent: "#bd8460", ink: "#473b34", muted: "#887569", decoration: "star", position: "corners", frame: true, bookmarkColor: "#cf8e68", dearStyle: "standard" },
  { id: "gratitude", label: "感謝", background: "#e7eee2", paper: "#fbfdf8", accent: "#78906c", ink: "#384234", muted: "#74806e", decoration: "flower", position: "bottom", frame: true, bookmarkColor: "#8b9e72", dearStyle: "soft" },
  { id: "spring", label: "春", background: "#f6e4e5", paper: "#fffafa", accent: "#ce818d", ink: "#49383c", muted: "#896d72", decoration: "flower", position: "corners", frame: false, bookmarkColor: "#dd919a", dearStyle: "soft" },
  { id: "summer", label: "夏", background: "#dceef0", paper: "#f8fdfd", accent: "#5f98a5", ink: "#2f464b", muted: "#68868c", decoration: "star", position: "top", frame: true, bookmarkColor: "#6fa7b1", dearStyle: "minimal" },
  { id: "autumn", label: "秋", background: "#eee0cc", paper: "#fff9f0", accent: "#a66d4e", ink: "#49382f", muted: "#836b5c", decoration: "leaf", position: "corners", frame: true, bookmarkColor: "#b77552", dearStyle: "standard" },
  { id: "winter", label: "冬", background: "#e3ebef", paper: "#fbfdff", accent: "#718da0", ink: "#35444d", muted: "#6d808a", decoration: "snow", position: "corners", frame: false, bookmarkColor: "#86a4b4", dearStyle: "minimal" },
  { id: "christmas", label: "クリスマス", background: "#e4ece5", paper: "#fffdf8", accent: "#5f806b", ink: "#34443a", muted: "#6b7d71", decoration: "gift", position: "corners", frame: true, bookmarkColor: "#ad6f66", dearStyle: "standard" },
  { id: "halloween", label: "ハロウィン", background: "#e9dfeb", paper: "#fcf8fd", accent: "#7d6687", ink: "#403544", muted: "#786c7c", decoration: "pumpkin", position: "bottom", frame: true, bookmarkColor: "#bd7953", dearStyle: "standard" },
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
