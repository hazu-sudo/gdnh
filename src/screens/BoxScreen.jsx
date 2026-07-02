import { useMemo, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import { bookmarkCategories, statusOptions } from "../data";
import { sortByDate } from "../utils";

const filters = [{ id: "all", label: "すべて" }, ...statusOptions];

function GroupedPausedList({ bookmarks, onDelete, onUpdateStatus }) {
  const groups = bookmarkCategories.map((category) => ({
    ...category,
    bookmarks: bookmarks.filter((bookmark) => category.emotions.includes(bookmark.emotion)),
  }));

  return (
    <div className="grouped-list">
      {groups.map((group) => (
        <section className="box-group" key={group.id}>
          <div className="section-title-row compact-row">
            <div>
              <p className="eyebrow">保留中</p>
              <h2>{group.title}</h2>
            </div>
            <span className="count-badge">{group.bookmarks.length}</span>
          </div>
          {group.bookmarks.length === 0 ? (
            <p className="empty compact-empty">この分類のしおりはありません。</p>
          ) : (
            <div className="card-list">
              {group.bookmarks.map((bookmark) => (
                <BookmarkCard
                  bookmark={bookmark}
                  key={bookmark.id}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                  showActions
                  showDelete
                  showPerson
                  showQuestion
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export default function BoxScreen({ bookmarks, onDelete, onUpdateStatus }) {
  const [activeFilter, setActiveFilter] = useState("unopened");
  const [sortDirection, setSortDirection] = useState("new");

  const filteredBookmarks = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? bookmarks
        : bookmarks.filter((bookmark) => bookmark.status === activeFilter);
    return sortByDate(filtered, sortDirection);
  }, [activeFilter, bookmarks, sortDirection]);

  return (
    <main className="screen">
      <section className="section-heading">
        <p className="app-name">しおり箱</p>
        <h1>未開封、確認済み、話した、保留をまとめて見る。</h1>
      </section>

      <div className="chip-scroll" aria-label="しおりの状態">
        {filters.map((filter) => (
          <button
            className={activeFilter === filter.id ? "filter-button active" : "filter-button"}
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="list-tools">
        <p>{filteredBookmarks.length}件</p>
        <div className="segmented" aria-label="並び順">
          <button
            className={sortDirection === "new" ? "segment-button active" : "segment-button"}
            onClick={() => setSortDirection("new")}
            type="button"
          >
            新しい順
          </button>
          <button
            className={sortDirection === "old" ? "segment-button active" : "segment-button"}
            onClick={() => setSortDirection("old")}
            type="button"
          >
            古い順
          </button>
        </div>
      </div>

      {activeFilter === "paused" ? (
        <GroupedPausedList
          bookmarks={filteredBookmarks}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      ) : filteredBookmarks.length === 0 ? (
        <p className="empty">この状態のしおりはまだありません。</p>
      ) : (
        <section className="card-list" aria-label="しおり一覧">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              bookmark={bookmark}
              key={bookmark.id}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
              showActions
              showDelete
              showPerson
              showQuestion
            />
          ))}
        </section>
      )}
    </main>
  );
}
