import BookmarkCard from "../components/BookmarkCard";
import { getCategoryForEmotion, pendingCategories } from "../data";
import { sortNewest } from "../utils";

function PendingGroup({ bookmarks, category, onDelete, onUpdateStatus }) {
  const categoryBookmarks = sortNewest(
    bookmarks.filter((bookmark) => getCategoryForEmotion(bookmark.emotion).id === category.id),
  );

  return (
    <section className="box-group">
      <div className="section-title-row compact-row">
        <div>
          <p className="eyebrow">保留中</p>
          <h2>{category.title}</h2>
        </div>
        <span className="count-badge">{categoryBookmarks.length}</span>
      </div>

      {categoryBookmarks.length === 0 ? (
        <p className="empty compact-empty">この分類のしおりはありません。</p>
      ) : (
        <div className="card-list">
          {categoryBookmarks.map((bookmark) => (
            <BookmarkCard
              bookmark={bookmark}
              key={bookmark.id}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
              showActions
              showDelete
              showTarget
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function PendingScreen({ bookmarks, onDelete, onUpdateStatus }) {
  const pendingBookmarks = bookmarks.filter((bookmark) => bookmark.status === "pending");

  return (
    <main className="screen">
      <section className="section-heading">
        <p className="app-name">保留</p>
        <h1>まだ話さない気持ちを、無理に動かさず置いておく。</h1>
        <p>保留中のしおりを、話す、向き合う、一緒にの3つで見返せます。</p>
      </section>

      {pendingBookmarks.length === 0 ? (
        <p className="empty">保留中のしおりはまだありません。</p>
      ) : (
        <div className="grouped-list">
          {pendingCategories.map((category) => (
            <PendingGroup
              bookmarks={pendingBookmarks}
              category={category}
              key={category.id}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </main>
  );
}
