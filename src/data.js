export const STORAGE_KEY = "meeting-shiori-bookmarks-v2";
export const LEGACY_STORAGE_KEY = "meeting-shiori-bookmarks-v1";
export const SELECTED_PERSON_KEY = "meeting-shiori-selected-person-v1";

export const STATUS_LABELS = {
  unopened: "未開封",
  checked: "確認済み",
  talked: "話した",
  paused: "保留",
};

export const statusOptions = [
  { id: "unopened", label: STATUS_LABELS.unopened },
  { id: "checked", label: STATUS_LABELS.checked },
  { id: "talked", label: STATUS_LABELS.talked },
  { id: "paused", label: STATUS_LABELS.paused },
];

export const destinationOptions = [
  {
    id: "specific",
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
    shortLabel: "笑って",
    openingLine: "これちょっと笑ってしまったんやけど、聞いて",
    question: "気軽に話せるときに開く",
  },
  聞いてほしい: {
    category: "talk",
    shortLabel: "聞いて",
    openingLine: "大したことじゃないんやけど、ちょっと聞いてほしくて",
    question: "少しだけ話したいときに開く",
  },
  相談したい: {
    category: "face",
    shortLabel: "相談",
    openingLine: "ちょっと相談したいことがあるんやけど、今度話してもいい？",
    question: "相手の考えを聞けそうなときに開く",
  },
  共感してほしい: {
    category: "talk",
    shortLabel: "共感",
    openingLine: "これ、なんか分かってほしくて残してた",
    question: "気持ちを共有したいときに開く",
  },
  誘いたい: {
    category: "together",
    shortLabel: "お誘い",
    openingLine: "今度一緒に行きたいところがあって",
    question: "予定の話ができそうなときに開く",
  },
  報告: {
    category: "talk",
    shortLabel: "報告",
    openingLine: "これ、ちょっと報告したくて残してた",
    question: "近況を話せそうなときに開く",
  },
  なんとなく: {
    category: "talk",
    shortLabel: "なんとなく",
    openingLine: "なんかこれ、ふと思い出して話したくなった",
    question: "会話のすきまに開く",
  },
  あとで考えたい: {
    category: "face",
    shortLabel: "後で考える",
    openingLine: "まだまとまってないけど、あとで考えたいことがあって",
    question: "急がず見返したいときに開く",
  },
  家で思い出したい: {
    category: "face",
    shortLabel: "家で思い出す",
    openingLine: "家に帰ったら、もう一回思い出したいことがあって",
    question: "ひとりで落ち着けるときに開く",
  },
  その他: {
    category: "talk",
    shortLabel: "その他",
    openingLine: "これ、あとで話せたらいいなと思って残してた",
    question: "なんとなく気になったときに開く",
  },
};

export const emotionOptions = Object.keys(emotionTemplates);

export const bookmarkCategories = [
  {
    id: "talk",
    title: "話す",
    emotions: [
      "笑ってほしい",
      "聞いてほしい",
      "共感してほしい",
      "報告",
      "なんとなく",
      "その他",
    ],
  },
  {
    id: "face",
    title: "向き合う",
    emotions: ["相談したい", "あとで考えたい", "家で思い出したい"],
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

export function getEmotionShortLabel(emotion) {
  return getTemplate(emotion).shortLabel || emotion;
}

export function getCategoryForEmotion(emotion) {
  const template = getTemplate(emotion);
  return bookmarkCategories.find((category) => category.id === template.category) || bookmarkCategories[0];
}

export function createSampleBookmarks() {
  return [
    {
      id: "sample-saki-cafe",
      destinationType: "specific",
      person: "さき",
      emotion: "誘いたい",
      memo: "駅の近くに良さそうなカフェがあった",
      openingLine: "今度一緒に行きたいところがあって",
      question: "予定の話ができそうなときに開く",
      createdAt: "2026-06-30",
      status: "unopened",
    },
    {
      id: "sample-miyu-work",
      destinationType: "specific",
      person: "みゆ",
      emotion: "相談したい",
      memo: "バイトでちょっと悩んだことがあった",
      openingLine: "ちょっと相談したいことがあるんやけど、今度話してもいい？",
      question: "相手の考えを聞けそうなときに開く",
      createdAt: "2026-06-29",
      status: "checked",
    },
    {
      id: "sample-mom-cooking",
      destinationType: "specific",
      person: "お母さん",
      emotion: "聞いてほしい",
      memo: "最近ちゃんと自炊できた",
      openingLine: "大したことじゃないんやけど、ちょっと聞いてほしくて",
      question: "少しだけ話したいときに開く",
      createdAt: "2026-06-28",
      status: "talked",
    },
    {
      id: "sample-someone-train",
      destinationType: "someone",
      person: "誰か",
      emotion: "笑ってほしい",
      memo: "電車で見かけた広告の言い方がじわじわ面白かった",
      openingLine: "これちょっと笑ってしまったんやけど、聞いて",
      question: "気軽に話せるときに開く",
      createdAt: "2026-06-27",
      status: "unopened",
    },
    {
      id: "sample-self-night",
      destinationType: "self",
      person: "自分",
      emotion: "家で思い出したい",
      memo: "帰ったら今日うれしかったことをもう一回考えたい",
      openingLine: "家に帰ったら、もう一回思い出したいことがあって",
      question: "ひとりで落ち着けるときに開く",
      createdAt: "2026-06-26",
      status: "paused",
    },
  ];
}
