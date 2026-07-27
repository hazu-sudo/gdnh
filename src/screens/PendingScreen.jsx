import { useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import { pendingCategories } from "../data";
import { sortNewest } from "../utils";

export default function PendingScreen({ bookmarks, onUpdateStatus }) {
  const [activeCategory, setActiveCategory] = useState("talk");
  const pending = bookmarks.filter((item) => item.status === "pending");
  const category = pendingCategories.find((item) => item.id === activeCategory);
  const items = sortNewest(
    pending.filter((item) =>
      category.emotions.includes(item.emotion) ||
      (category.id === "talk" && !pendingCategories.some((group) => group.emotions.includes(item.emotion))),
    ),
  );

  return (
    <main className="screen pending-screen">
      <section className="screen-heading">
        <p className="eyebrow">KEEP FOR LATER</p>
        <h1>まだ、開かなくていい。</h1>
        <p>置いておくことも、ひとつの選び方。準備ができた気持ちから戻せます。</p>
      </section>
      <div className="category-tabs" role="tablist" aria-label="保留の分類">
        {pendingCategories.map((item) => {
          const count = pending.filter((bookmark) =>
            item.emotions.includes(bookmark.emotion) ||
            (item.id === "talk" && !pendingCategories.some((group) => group.emotions.includes(bookmark.emotion))),
          ).length;
          return (
            <button
              aria-selected={activeCategory === item.id}
              className={activeCategory === item.id ? "category-tab active" : "category-tab"}
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              role="tab"
              type="button"
            >
              <span>{item.title}</span><small>{count}</small>
            </button>
          );
        })}
      </div>
      <section className="pending-group">
        <header className="section-title-row">
          <div><h2>{category.title}</h2><p>{category.description}</p></div>
          <span className="soft-count">{items.length} 枚</span>
        </header>
        {items.length ? (
          <div className="card-list">
            {items.map((bookmark) => (
              <BookmarkCard bookmark={bookmark} key={bookmark.id} onUpdateStatus={onUpdateStatus} showActions />
            ))}
          </div>
        ) : <p className="empty">ここで待っているしおりはありません。</p>}
      </section>
    </main>
  );
}
