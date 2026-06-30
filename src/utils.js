export function formatToday() {
  return new Date().toLocaleDateString("sv-SE");
}

export function uniqueId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function pickRandom(items, currentId = "") {
  if (items.length <= 1) {
    return items[0] || null;
  }

  const candidates = items.filter((item) => item.id !== currentId);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function sortNewest(bookmarks) {
  return [...bookmarks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
