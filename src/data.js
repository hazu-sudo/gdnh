export const STORAGE_KEY = "meeting-shiori-bookmarks-v1";
export const SELECTED_PERSON_KEY = "meeting-shiori-selected-person-v1";

export const STATUS_LABELS = {
  unsent: "未送信",
  talked: "話した",
  dismissed: "もう話さなくていい",
};

export const emotionTemplates = {
  笑ってほしい: {
    openingLine: "これちょっと笑ってしまったんやけど、聞いて",
    question: "こういうの好き？",
  },
  聞いてほしい: {
    openingLine: "大したことじゃないんやけど、ちょっと聞いてほしくて",
    question: "少しだけ話してもいい？",
  },
  相談したい: {
    openingLine: "ちょっと相談したいことがあるんやけど、今度話してもいい？",
    question: "〇〇ならどうする？",
  },
  共感してほしい: {
    openingLine: "これ、なんか分かってほしくて残してた",
    question: "こういう気持ちになることある？",
  },
  誘いたい: {
    openingLine: "今度一緒に行きたいところがあって",
    question: "こういうの興味ある？",
  },
  ありがとうを言いたい: {
    openingLine: "この前のこと、ちゃんとありがとうって言いたくて",
    question: "また今度ちゃんと話してもいい？",
  },
  謝りたい: {
    openingLine: "ちょっと言いそびれてたことがあって",
    question: "少しだけ聞いてもらえる？",
  },
  なんとなく話したい: {
    openingLine: "なんかこれ、ふと思い出して話したくなった",
    question: "こういうことってない？",
  },
};

export const emotionOptions = Object.keys(emotionTemplates);

export const beforeMeetCategories = [
  {
    id: "light",
    title: "軽く話せるしおり",
    emotions: [
      "笑ってほしい",
      "聞いてほしい",
      "共感してほしい",
      "なんとなく話したい",
    ],
  },
  {
    id: "important",
    title: "ちゃんと話したいしおり",
    emotions: ["相談したい", "ありがとうを言いたい", "謝りたい"],
  },
  {
    id: "together",
    title: "一緒にしたいしおり",
    emotions: ["誘いたい"],
  },
];

export function createSampleBookmarks() {
  return [
    {
      id: "sample-saki-cafe",
      person: "さき",
      emotion: "誘いたい",
      memo: "駅の近くに良さそうなカフェがあった",
      openingLine: "今度一緒に行きたいところがあって",
      question: "こういうの興味ある？",
      createdAt: "2026-06-30",
      status: "unsent",
    },
    {
      id: "sample-miyu-work",
      person: "みゆ",
      emotion: "相談したい",
      memo: "バイトでちょっと悩んだことがあった",
      openingLine: "ちょっと相談したいことがあるんやけど、今度話してもいい？",
      question: "みゆならどうする？",
      createdAt: "2026-06-30",
      status: "unsent",
    },
    {
      id: "sample-mom-cooking",
      person: "お母さん",
      emotion: "聞いてほしい",
      memo: "最近ちゃんと自炊できた",
      openingLine: "大したことじゃないんやけど、ちょっと聞いてほしくて",
      question: "これ作ったって言ったらびっくりする？",
      createdAt: "2026-06-30",
      status: "unsent",
    },
    {
      id: "sample-saki-class",
      person: "さき",
      emotion: "笑ってほしい",
      memo: "授業中にちょっと面白いことがあった",
      openingLine: "これちょっと笑ってしまったんやけど、聞いて",
      question: "こういうの好き？",
      createdAt: "2026-06-30",
      status: "unsent",
    },
    {
      id: "sample-seminar-thanks",
      person: "ゼミの子",
      emotion: "ありがとうを言いたい",
      memo: "この前資料を手伝ってくれて助かった",
      openingLine: "この前のこと、ちゃんとありがとうって言いたくて",
      question: "また今度ちゃんと話してもいい？",
      createdAt: "2026-06-30",
      status: "unsent",
    },
  ];
}
