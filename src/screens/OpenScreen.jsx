import { useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import { bookmarkCategories } from "../data";
import { pickRandom } from "../utils";

function getOpenPool(bookmarks, category) {
  const scoped = category
    ? bookmarks.filter((bookmark) => category.emotions.includes(bookmark.emotion))
    : bookmarks;
  const unopened = scoped.filter((bookmark) => bookmark.status === "unopened");
  const checked = scoped.filter((bookmark) => bookmark.status === "checked");
  return unopened.length > 0 ? unopened : checked;
}

export default function OpenScreen({ bookmarks, onUpdateStatus }) {
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [message, setMessage] = useState("");

  function updateSelectedStatus(id, status) {
    onUpdateStatus(id, status);
    setSelectedBookmark((current) =>
      current?.id === id ? { ...current, status } : current,
    );
  }

  function openOne(category = null) {
    const pool = getOpenPool(bookmarks, category);
    const picked = pickRandom(pool, selectedBookmark?.id || "");

    if (!picked) {
      setMessage("今ひらけるしおりはありません。");
      setSelectedBookmark(null);
      return;
    }

    const openedBookmark =
      picked.status === "unopened" ? { ...picked, status: "checked" } : picked;

    if (picked.status === "unopened") {
      onUpdateStatus(picked.id, "checked");
    }

    setMessage(category ? `${category.title}のしおりを1枚ひらきました。` : "しおりを1枚ひらきました。");
    setSelectedBookmark(openedBookmark);
  }

  return (
    <main className="screen open-screen">
      <section className="section-heading">
        <p className="app-name">ひらく</p>
        <h1>迷ったときに、まだ話していない1枚をひらく。</h1>
        <p>未開封のしおりを優先して、なければ確認済みのしおりから選びます。</p>
      </section>

      <section className="open-stage" aria-label="1枚ひらく">
        <button className="big-open-button" onClick={() => openOne()} type="button">
          <span>1枚ひらく</span>
          <small>未開封を優先</small>
        </button>

        <div className="category-open-grid">
          {bookmarkCategories.map((category) => (
            <button
              className="category-open-button"
              key={category.id}
              onClick={() => openOne(category)}
              type="button"
            >
              {category.title}
            </button>
          ))}
        </div>
      </section>

      {message && <p className="form-message">{message}</p>}

      {selectedBookmark ? (
        <BookmarkCard
          bookmark={selectedBookmark}
          onUpdateStatus={updateSelectedStatus}
          showActions
          showPerson
          showQuestion
        />
      ) : (
        <p className="empty">まだ選ばれていません。</p>
      )}
    </main>
  );
}
