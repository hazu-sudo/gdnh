import { getEmotionLabel, STATUS_LABELS } from "../data";

export function StatusBadge({ status }) {
  return (
    <span className={`status-label ${status}`}>
      {STATUS_LABELS[status] || STATUS_LABELS.unopened}
    </span>
  );
}

export default function BookmarkCard({
  bookmark,
  onDelete,
  onUpdateStatus,
  showActions = false,
  showDelete = false,
  showTarget = false,
}) {
  return (
    <article className={`bookmark-card ${bookmark.status}`}>
      <div className="bookmark-notch" aria-hidden="true" />
      <div className="bookmark-card-head">
        <div>
          {showTarget && <h2>{bookmark.targetName}</h2>}
          <span className="tag">{getEmotionLabel(bookmark.emotion)}</span>
        </div>
        <StatusBadge status={bookmark.status} />
      </div>

      <p className="memo">{bookmark.memo}</p>
      <div className="talk-box hint-box">
        <span>開くヒント</span>
        <p>{bookmark.openHint}</p>
      </div>

      <div className="card-foot">
        <time dateTime={bookmark.createdAt}>{bookmark.createdAt}</time>
        {showDelete && (
          <button
            aria-label={`${bookmark.targetName}のしおりを削除`}
            className="icon-button"
            onClick={() => onDelete(bookmark.id)}
            type="button"
          >
            削除
          </button>
        )}
      </div>

      {showActions && onUpdateStatus && (
        <div className="action-row">
          <button
            className="secondary-button small-action"
            disabled={bookmark.status === "checked"}
            onClick={() => onUpdateStatus(bookmark.id, "checked")}
            type="button"
          >
            確認済みにする
          </button>
          <button
            className="primary-button small-action"
            disabled={bookmark.status === "talked"}
            onClick={() => onUpdateStatus(bookmark.id, "talked")}
            type="button"
          >
            話した
          </button>
          <button
            className="ghost-button small-action"
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
