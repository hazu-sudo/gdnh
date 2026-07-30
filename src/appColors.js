export const APP_COLOR_OPTIONS = [
  {
    id: "red",
    label: "赤",
    background: { canvas: "#fff3f1", paper: "#fffdfc", line: "#ecd9d5", ink: "#493a37", muted: "#806f6b" },
    accent: { main: "#c85f58", deep: "#9d403a", soft: "#f7dfdc", text: "#ffffff" },
  },
  {
    id: "pink",
    label: "ピンク",
    background: { canvas: "#fff4f7", paper: "#fffdfd", line: "#ead9df", ink: "#493a40", muted: "#806d74" },
    accent: { main: "#cb6687", deep: "#9e4564", soft: "#f7dfe8", text: "#ffffff" },
  },
  {
    id: "blue",
    label: "青",
    background: { canvas: "#f1f7fb", paper: "#fcfeff", line: "#d7e2e9", ink: "#36454d", muted: "#687b85" },
    accent: { main: "#4f82a2", deep: "#35647f", soft: "#dcebf3", text: "#ffffff" },
  },
  {
    id: "yellow",
    label: "黄",
    background: { canvas: "#fff9df", paper: "#fffef8", line: "#e9e0bd", ink: "#493f2f", muted: "#7f735b" },
    accent: { main: "#e2b63d", deep: "#9b7210", soft: "#fff0bd", text: "#3f341d" },
  },
  {
    id: "orange",
    label: "オレンジ",
    background: { canvas: "#fff7eb", paper: "#fffdfa", line: "#eadccf", ink: "#443a35", muted: "#806f66" },
    accent: { main: "#df795d", deep: "#ae513d", soft: "#fbe2d8", text: "#ffffff" },
  },
  {
    id: "brown",
    label: "茶色",
    background: { canvas: "#f8f3ed", paper: "#fffdf9", line: "#e3d8cc", ink: "#433a34", muted: "#786b62" },
    accent: { main: "#8c6a55", deep: "#664838", soft: "#eaded4", text: "#ffffff" },
  },
  {
    id: "green",
    label: "緑",
    background: { canvas: "#f2f8f2", paper: "#fcfffc", line: "#d7e4d8", ink: "#37453b", muted: "#687a6c" },
    accent: { main: "#5d8d6c", deep: "#3f6d4d", soft: "#dcecdf", text: "#ffffff" },
  },
  {
    id: "purple",
    label: "紫",
    background: { canvas: "#f7f3fa", paper: "#fffdfd", line: "#e1d9e7", ink: "#433b48", muted: "#756c7b" },
    accent: { main: "#856fa1", deep: "#654f80", soft: "#e9e0f0", text: "#ffffff" },
  },
  {
    id: "mono",
    label: "白黒",
    background: { canvas: "#f6f6f4", paper: "#ffffff", line: "#d9d9d5", ink: "#292929", muted: "#666666" },
    accent: { main: "#404040", deep: "#202020", soft: "#e5e5e2", text: "#ffffff" },
  },
];

export const APP_COLOR_IDS = new Set(APP_COLOR_OPTIONS.map((color) => color.id));

export function getAppColor(id) {
  return APP_COLOR_OPTIONS.find((color) => color.id === id)
    || APP_COLOR_OPTIONS.find((color) => color.id === "orange");
}
