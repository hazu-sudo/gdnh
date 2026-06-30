import { useMemo, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import { sortNewest } from "../utils";

const filters = [
  { id: "unsent", label: "未送信" },
  { id: "talked", label: "話した" },
  { id: "dismissed", label: "もう話さなくていい" },
  { id: "all", label: "すべて" },
];

export default function UnsentScreen({ bookmarks, onUpdateStatus }) {
  const [activeFilter, setActiveFilter] = useState("unsent");

  const filteredBookmarks = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? bookmarks
        : bookmarks.filter((bookmark) => bookmark.status === activeFilter);
    return sortNewest(filtered);
  }, [activeFilter, bookmarks]);

  return (
    <main className="screen">
      <section className="section-heading unsent-heading">
        <p className="app-name">会う前のしおり</p>
        <h1>すぐに送らなかったからこそ、会ったときに話せることがある。</h1>
        <p>未送信のまま残した話題を、ここで静かに見直せます。</p>
      </section>

      <div className="filter-bar" aria-label="しおりの状態で絞り込み">
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

      {filteredBookmarks.length === 0 ? (
        <p className="empty">この状態のしおりはまだありません。</p>
      ) : (
        <section className="unsent-list" aria-label="しおり一覧">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              bookmark={bookmark}
              key={bookmark.id}
              onUpdateStatus={onUpdateStatus}
              showActions
              showPerson
            />
          ))}
        </section>
      )}
    </main>
  );
}
