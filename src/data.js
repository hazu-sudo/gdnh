export const APP_NAME = "あとで開くしおり";
export const STORAGE_KEY = "later-open-shiori-bookmarks-v3";
export const LEGACY_STORAGE_KEYS = [
  "later-open-shiori-bookmarks-v2",
  "later-open-shiori-bookmarks-v1",
  "meeting-shiori-bookmarks-v2",
  "meeting-shiori-bookmarks-v1",
];

export const STATUS_LABELS = {
  unresolved: "未選択",
  pending: "保留",
  resolved: "話した",
  sent: "送った",
};

export function createSampleBookmarks() {
  return [
    {
      id: "sample-tanaka",
      targetName: "田中さん",
      memo: "今日の授業で面白いことがあった。次に会ったときに話したい。",
      status: "unresolved",
      createdAt: "2026-07-27",
    },
    {
      id: "sample-self",
      targetName: "未来の自分",
      memo: "帰ったら、今日うれしかったことをもう一度思い出す。",
      status: "pending",
      createdAt: "2026-07-25",
    },
    {
      id: "sample-yamada",
      targetName: "山田さん",
      memo: "この前助けてもらったことのお礼を伝えたい。",
      status: "resolved",
      createdAt: "2026-07-22",
    },
  ];
}
