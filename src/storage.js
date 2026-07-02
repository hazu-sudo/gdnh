import {
  createSampleBookmarks,
  getTemplate,
  LEGACY_STORAGE_KEY,
  SELECTED_PERSON_KEY,
  STORAGE_KEY,
} from "./data";

const validStatuses = new Set(["unopened", "checked", "talked", "paused"]);
const statusMigration = {
  unsent: "unopened",
  dismissed: "paused",
  talked: "talked",
};

const emotionMigration = {
  "ありがとうを言いたい": "その他",
  ありがとう: "その他",
  謝りたい: "その他",
  ごめんね: "その他",
  なんとなく話したい: "なんとなく",
};

function resolveDestinationType(bookmark, person) {
  if (bookmark.destinationType === "someone" || person === "誰か") {
    return "someone";
  }

  if (bookmark.destinationType === "self" || person === "自分") {
    return "self";
  }

  return "specific";
}

function normalizeBookmark(bookmark) {
  const rawPerson = String(bookmark.person || "").trim();
  const person = rawPerson || "誰か";
  const emotion = emotionMigration[bookmark.emotion] || bookmark.emotion || "その他";
  const template = getTemplate(emotion);
  const migratedStatus = statusMigration[bookmark.status] || bookmark.status;

  return {
    id: String(bookmark.id || globalThis.crypto?.randomUUID?.() || Date.now()),
    destinationType: resolveDestinationType(bookmark, person),
    person,
    emotion,
    memo: String(bookmark.memo || "").trim(),
    openingLine: String(bookmark.openingLine || template.openingLine).trim(),
    question: String(bookmark.question || template.question).trim(),
    createdAt: String(bookmark.createdAt || new Date().toLocaleDateString("sv-SE")),
    status: validStatuses.has(migratedStatus) ? migratedStatus : "unopened",
  };
}

function normalizeBookmarks(bookmarks) {
  return bookmarks
    .map(normalizeBookmark)
    .filter((bookmark) => bookmark.person && bookmark.emotion && bookmark.memo);
}

function readStoredBookmarks() {
  return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
}

export function loadBookmarks() {
  const stored = readStoredBookmarks();

  if (!stored) {
    const samples = normalizeBookmarks(createSampleBookmarks());
    saveBookmarks(samples);
    return samples;
  }

  try {
    const parsed = JSON.parse(stored);
    const bookmarks = Array.isArray(parsed) ? normalizeBookmarks(parsed) : [];
    saveBookmarks(bookmarks);
    return bookmarks;
  } catch {
    const samples = normalizeBookmarks(createSampleBookmarks());
    saveBookmarks(samples);
    return samples;
  }
}

export function saveBookmarks(bookmarks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function loadSelectedPerson() {
  return localStorage.getItem(SELECTED_PERSON_KEY) || "";
}

export function saveSelectedPerson(person) {
  if (person) {
    localStorage.setItem(SELECTED_PERSON_KEY, person);
  } else {
    localStorage.removeItem(SELECTED_PERSON_KEY);
  }
}
