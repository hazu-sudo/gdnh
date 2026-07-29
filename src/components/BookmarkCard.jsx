import { STATUS_LABELS } from "../data.js";

export function formatJapaneseDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export default function BookmarkCard({ bookmark, onOpen }) {
  const target = bookmark.targetName || "宛先なし";
  const memo = bookmark.memo || "メモなし";
  return (
    <button
      className={`bookmark-card simple-card ${bookmark.status}`}
      onClick={() => onOpen(bookmark)}
      type="button"
    >
      <span className="bookmark-ribbon" aria-hidden="true" />
      <span className="simple-card-head">
        <strong>{target}{bookmark.targetName ? "へ" : ""}</strong>
      </span>
      <span className={bookmark.memo ? "simple-card-memo" : "simple-card-memo empty-value"}>{memo}</span>
      <span className="simple-card-foot">
        <time dateTime={bookmark.createdAt}>{formatJapaneseDate(bookmark.createdAt)}</time>
        {bookmark.attachmentId && (
          <span className="attachment-badge">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 12 5.2-5.2a3 3 0 0 1 4.2 4.2l-7.3 7.3a5 5 0 0 1-7.1-7.1l7.1-7.1" /></svg>
            添付
          </span>
        )}
        <span className={`status-label ${bookmark.status}`}>{STATUS_LABELS[bookmark.status]}</span>
      </span>
      <span className="card-chevron" aria-hidden="true">›</span>
    </button>
  );
}
