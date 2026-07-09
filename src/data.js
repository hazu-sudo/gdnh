export const APP_NAME = "あとで開くしおり";
export const STORAGE_KEY = "later-open-shiori-bookmarks-v1";
export const LEGACY_STORAGE_KEYS = [
  "meeting-shiori-bookmarks-v2",
  "meeting-shiori-bookmarks-v1",
];
export const SELECTED_TARGET_KEY = "later-open-shiori-selected-target-v1";
export const LEGACY_SELECTED_PERSON_KEY = "meeting-shiori-selected-person-v1";

export const STATUS_LABELS = {
  unopened: "未開封",
  checked: "確認済み",
  talked: "話した",
  pending: "保留",
};

export const statusOptions = [
  { id: "unopened", label: STATUS_LABELS.unopened },
  { id: "checked", label: STATUS_LABELS.checked },
  { id: "talked", label: STATUS_LABELS.talked },
  { id: "pending", label: STATUS_LABELS.pending },
];

export const targetOptions = [
  {
    id: "person",
    label: "特定の人へ",
    helper: "さき、お母さん、ゼミの子など",
  },
  {
    id: "someone",
    label: "誰かへ",
    helper: "名前を決めずに置いておく",
  },
  {
    id: "self",
    label: "未来の自分へ",
    helper: "あとで見返す自分に残す",
  },
];

export const emotionTemplates = {
  笑ってほしい: {
    category: "talk",
    openHint: "これちょっと笑ってしまったんやけど、聞いて",
    selfHint: "何が少しおもしろかったのか、もう一度思い出してみる",
  },
  聞いてほしい: {
    category: "talk",
    openHint: "大したことじゃないんやけど、ちょっと聞いてほしくて",
    selfHint: "今の自分はどう感じているか、もう一度見てみる",
  },
  相談したい: {
    category: "face",
    openHint: "ちょっと相談したいことがあるんやけど、話してもいい？",
    selfHint: "これは何が気になっていたのか、少し考えてみる",
  },
  共感してほしい: {
    category: "talk",
    openHint: "これ、なんか分かってほしくて残してた",
    selfHint: "どこに分かってほしさがあったのか、少し眺めてみる",
  },
  誘いたい: {
    category: "together",
    openHint: "今度一緒に行きたいところがあって",
    selfHint: "これは誰と、どんな時間にしたかったのか考えてみる",
  },
  ありがとう: {
    category: "face",
    openHint: "この前のこと、ちゃんとありがとうって言いたくて",
    selfHint: "何に助けられたのか、言葉にする前に少し見てみる",
  },
  ごめんね: {
    category: "face",
    openHint: "ちょっと言いそびれてたことがあって",
    selfHint: "何を引っかけたままにしているのか、少しだけ見てみる",
  },
  なんとなく: {
    category: "talk",
    openHint: "なんかこれ、ふと思い出して話したくなった",
    selfHint: "まだ言葉にならない感じを、そのまま少し置いてみる",
  },
  あとで考えたい: {
    category: "face",
    openHint: "何が引っかかったのか、少しだけ考えてみる",
    selfHint: "これは何が気になっていたのか、少し考えてみる",
  },
  家で思い出したい: {
    category: "face",
    openHint: "家に帰ったら、この気持ちをもう一度開く",
    selfHint: "家に帰ったら、この続きを少しだけ開く",
  },
  その他: {
    category: "talk",
    openHint: "これ、あとで開けるように少しだけ残してた",
    selfHint: "今の自分はどう感じているか、もう一度見てみる",
  },
};

export const emotionOptions = Object.keys(emotionTemplates);

export const pendingCategories = [
  {
    id: "talk",
    title: "話す",
    emotions: ["笑ってほしい", "聞いてほしい", "共感してほしい", "なんとなく"],
  },
  {
    id: "face",
    title: "向き合う",
    emotions: ["相談したい", "ありがとう", "ごめんね", "あとで考えたい", "家で思い出したい"],
  },
  {
    id: "together",
    title: "一緒に",
    emotions: ["誘いたい"],
  },
];

export function getTemplate(emotion) {
  return emotionTemplates[emotion] || emotionTemplates.その他;
}

export function getEmotionLabel(emotion) {
  return emotion || "その他";
}

export function generateOpenHint({ targetType, emotion }) {
  const template = getTemplate(emotion);
  return targetType === "self" ? template.selfHint : template.openHint;
}

export function getCategoryForEmotion(emotion) {
  const template = emotionTemplates[emotion];
  const categoryId = template?.category || "talk";
  return pendingCategories.find((category) => category.id === categoryId) || pendingCategories[0];
}

export function createSampleBookmarks() {
  return [
    {
      id: "sample-saki-cafe",
      targetType: "person",
      targetName: "さき",
      emotion: "誘いたい",
      memo: "駅の近くに良さそうなカフェがあった",
      openHint: "今度一緒に行きたいところがあって",
      status: "unopened",
      createdAt: "2026-07-09",
    },
    {
      id: "sample-miyu-work",
      targetType: "person",
      targetName: "みゆ",
      emotion: "相談したい",
      memo: "バイトでちょっとモヤモヤした",
      openHint: "ちょっと相談したいことがあるんやけど、話してもいい？",
      status: "checked",
      createdAt: "2026-07-08",
    },
    {
      id: "sample-mom-thanks",
      targetType: "person",
      targetName: "お母さん",
      emotion: "ありがとう",
      memo: "この前さりげなく気にかけてくれたのがうれしかった",
      openHint: "この前のこと、ちゃんとありがとうって言いたくて",
      status: "talked",
      createdAt: "2026-07-07",
    },
    {
      id: "sample-someone-train",
      targetType: "someone",
      targetName: "誰か",
      emotion: "笑ってほしい",
      memo: "電車で見かけた広告の言い方がじわじわ面白かった",
      openHint: "これちょっと笑ってしまったんやけど、聞いて",
      status: "unopened",
      createdAt: "2026-07-06",
    },
    {
      id: "sample-self-night",
      targetType: "self",
      targetName: "自分",
      emotion: "家で思い出したい",
      memo: "帰ったら今日うれしかったことをもう一回考えたい",
      openHint: "家に帰ったら、この続きを少しだけ開く",
      status: "pending",
      createdAt: "2026-07-05",
    },
  ];
}
