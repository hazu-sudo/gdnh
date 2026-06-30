import {
  createSampleBookmarks,
  SELECTED_PERSON_KEY,
  STORAGE_KEY,
} from "./data";

const validStatuses = new Set(["unsent", "talked", "dismissed"]);

function normalizeBookmark(bookmark) {
  return {
    id: String(bookmark.id || globalThis.crypto?.randomUUID?.() || Date.now()),
    person: String(bookmark.person || "").trim(),
    emotion: String(bookmark.emotion || ""),
    memo: String(bookmark.memo || "").trim(),
    openingLine: String(bookmark.openingLine || "").trim(),
    question: String(bookmark.question || "").trim(),
    createdAt: String(bookmark.createdAt || new Date().toLocaleDateString("sv-SE")),
    status: validStatuses.has(bookmark.status)
      ? bookmark.status
      : bookmark.talked
        ? "talked"
        : "unsent",
  };
}

function normalizeBookmarks(bookmarks) {
  return bookmarks
    .map(normalizeBookmark)
    .filter(
      (bookmark) =>
        bookmark.person &&
        bookmark.emotion &&
        bookmark.memo &&
        bookmark.openingLine &&
        bookmark.question,
    );
}

export function loadBookmarks() {
  const stored = localStorage.getItem(STORAGE_KEY);

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
