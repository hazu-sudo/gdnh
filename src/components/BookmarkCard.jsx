import { STATUS_LABELS } from "../data";

export function StatusBadge({ status }) {
  return <span className={`status-label ${status}`}>{STATUS_LABELS[status]}</span>;
}

export default function BookmarkCard({
  bookmark,
  onUpdateStatus,
  showActions = false,
  showTarget = true,
  featured = false,
}) {
  return (
    <article className={`bookmark-card ${bookmark.status} ${featured ? "featured" : ""}`}>
      <span className="bookmark-ribbon" aria-hidden="true" />
      <header className="bookmark-card-head">
        <div>
          {showTarget && <p className="target-name">{bookmark.targetName}へ</p>}
          <span className="tag">{bookmark.emotion}</span>
        </div>
        <StatusBadge status={bookmark.status} />
      </header>
      <p className="memo">{bookmark.memo}</p>
      <div className="hint-box">
        <span>開くヒント</span>
        <p>「{bookmark.openHint}」</p>
      </div>
      <footer className="card-foot">
        <time dateTime={bookmark.createdAt}>{bookmark.createdAt.replaceAll("-", ".")}</time>
      </footer>
      {showActions && onUpdateStatus && (
        <div className="action-row">
          <button
            className="action-button check"
            disabled={bookmark.status === "checked"}
            onClick={() => onUpdateStatus(bookmark.id, "checked")}
            type="button"
          >
            確認済みにする
          </button>
          <button
            className="action-button talked"
            disabled={bookmark.status === "talked"}
            onClick={() => onUpdateStatus(bookmark.id, "talked")}
            type="button"
          >
            話した
          </button>
          <button
            className="action-button pending"
            disabled={bookmark.status === "pending"}
            onClick={() => onUpdateStatus(bookmark.id, "pending")}
            type="button"
          >
            保留にする
          </button>
        </div>
      )}
    </article>
  );
}
