import { getEmotionShortLabel, STATUS_LABELS } from "../data";

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
  showPerson = false,
  showQuestion = false,
}) {
  return (
    <article className={`bookmark-card ${bookmark.status}`}>
      <div className="bookmark-notch" aria-hidden="true" />
      <div className="bookmark-card-head">
        <div>
          {showPerson && <h2>{bookmark.person}</h2>}
          <span className="tag">{getEmotionShortLabel(bookmark.emotion)}</span>
        </div>
        <StatusBadge status={bookmark.status} />
      </div>

      <p className="memo">{bookmark.memo}</p>
      {showQuestion && (
        <div className="talk-box hint-box">
          <span>開くヒント</span>
          <p>{bookmark.question}</p>
        </div>
      )}
      <div className="talk-box">
        <span>話し出しの一言</span>
        <p>{bookmark.openingLine}</p>
      </div>

      <div className="card-foot">
        <time dateTime={bookmark.createdAt}>{bookmark.createdAt}</time>
        {showDelete && (
          <button
            aria-label={`${bookmark.person}のしおりを削除`}
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
            disabled={bookmark.status === "paused"}
            onClick={() => onUpdateStatus(bookmark.id, "paused")}
            type="button"
          >
            保留
          </button>
        </div>
      )}
    </article>
  );
}
