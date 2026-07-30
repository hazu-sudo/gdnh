import { uniqueId } from "./utils.js";
import { downloadCloudAttachment } from "./cloud/cloudAttachments.js";

const DB_NAME = "later-open-shiori-attachments-v1";
const STORE_NAME = "attachments";
const DB_VERSION = 1;
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;
const MAX_IMAGE_EDGE = 2400;

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error("ATTACHMENT_STORAGE_UNAVAILABLE"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("bookmarkId", "bookmarkId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("ATTACHMENT_STORAGE_UNAVAILABLE"));
  });
}

function useStore(mode, operation) {
  return openDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    let result;

    try {
      result = operation(store);
    } catch (error) {
      database.close();
      reject(error);
      return;
    }

    transaction.oncomplete = () => {
      database.close();
      resolve(result?.result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error("ATTACHMENT_STORAGE_FAILED"));
    };
    transaction.onabort = transaction.onerror;
  }));
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("IMAGE_READ_FAILED"));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("IMAGE_OPTIMIZE_FAILED")),
      type,
      quality,
    );
  });
}

async function optimizeImage(file) {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  if (scale === 1 && file.size <= 4 * 1024 * 1024) {
    return { blob: file, height, width };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("IMAGE_OPTIMIZE_FAILED");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const blob = await canvasToBlob(canvas, "image/jpeg", 0.88);
  return { blob, height, width };
}

async function assertStorageSpace(requiredBytes) {
  if (!navigator.storage?.estimate) return;
  const { quota = 0, usage = 0 } = await navigator.storage.estimate();
  if (quota && quota - usage < requiredBytes * 1.15) {
    const error = new Error("ATTACHMENT_QUOTA_EXCEEDED");
    error.code = "quota";
    throw error;
  }
}

export async function saveAttachment(file, bookmarkId) {
  if (!(file instanceof Blob)) throw new Error("INVALID_ATTACHMENT");
  if (!file.type.startsWith("image/") && file.size > MAX_DOCUMENT_SIZE) {
    const error = new Error("ATTACHMENT_TOO_LARGE");
    error.code = "too-large";
    throw error;
  }

  let prepared = { blob: file, height: null, width: null };
  if (file.type.startsWith("image/")) {
    prepared = await optimizeImage(file).catch(() => prepared);
  }
  if (navigator.storage?.persist) {
    await navigator.storage.persist().catch(() => false);
  }
  await assertStorageSpace(prepared.blob.size);

  const convertedToJpeg = prepared.blob.type === "image/jpeg" && file.type !== "image/jpeg";
  const originalName = file.name || `attachment-${Date.now()}`;
  const name = convertedToJpeg
    ? `${originalName.replace(/\.[^.]+$/, "") || "photo"}.jpg`
    : originalName;
  const record = {
    id: uniqueId(),
    bookmarkId,
    blob: prepared.blob,
    type: prepared.blob.type || file.type || "application/octet-stream",
    name,
    size: prepared.blob.size,
    width: prepared.width,
    height: prepared.height,
    attachedAt: new Date().toISOString(),
  };

  await useStore("readwrite", (store) => store.put(record));
  return record;
}

export async function getLocalAttachment(id) {
  if (!id) return null;
  return useStore("readonly", (store) => store.get(id));
}

export async function cacheAttachment(record) {
  if (!record?.id) return null;
  await useStore("readwrite", (store) => store.put(record));
  return record;
}

export async function getAttachment(id) {
  const local = await getLocalAttachment(id);
  if (local || !id || !navigator.onLine) return local;
  const downloaded = await downloadCloudAttachment(id).catch(() => null);
  if (downloaded) await cacheAttachment(downloaded).catch(() => {});
  return downloaded;
}

export async function deleteAttachment(id) {
  if (!id) return;
  await useStore("readwrite", (store) => store.delete(id));
}

export async function deleteAttachmentsForBookmark(bookmarkId) {
  if (!bookmarkId) return;
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const index = transaction.objectStore(STORE_NAME).index("bookmarkId");
    const cursorRequest = index.openCursor(IDBKeyRange.only(bookmarkId));
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) return;
      cursor.delete();
      cursor.continue();
    };
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

export async function getAttachmentUsage() {
  const records = await useStore("readonly", (store) => store.getAll()) || [];
  return {
    bytes: records.reduce((total, item) => total + Number(item.size || item.blob?.size || 0), 0),
    bookmarkCount: new Set(records.map((item) => item.bookmarkId)).size,
    fileCount: records.length,
  };
}

export async function getAllAttachments() {
  return useStore("readonly", (store) => store.getAll()) || [];
}

export function attachmentErrorMessage(error) {
  if (error?.code === "quota" || error?.name === "QuotaExceededError") {
    return "端末の空き容量が不足しているため、写真・資料を保存できません";
  }
  if (error?.code === "too-large") {
    return "資料のサイズが大きすぎます。20MB以下のファイルを選んでください";
  }
  return "写真・資料を保存できませんでした。もう一度お試しください";
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)}MB`;
}
