import { STATUS_LABELS } from "../data.js";

export function formatJapaneseDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export default function BookmarkCard({ bookmark, onOpen }) {
  return (
    <button
      className={`bookmark-card simple-card ${bookmark.status}`}
      onClick={() => onOpen(bookmark)}
      type="button"
    >
      <span className="bookmark-ribbon" aria-hidden="true" />
      <span className="simple-card-head">
        <strong>{bookmark.targetName}へ</strong>
        <span className={`status-label ${bookmark.status}`}>{STATUS_LABELS[bookmark.status]}</span>
      </span>
      <span className="simple-card-memo">{bookmark.memo}</span>
      <time dateTime={bookmark.createdAt}>{formatJapaneseDate(bookmark.createdAt)}</time>
      <span className="card-chevron" aria-hidden="true">›</span>
    </button>
  );
}
