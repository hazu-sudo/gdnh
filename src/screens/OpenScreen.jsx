import { useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import { pickRandom } from "../utils";

function getOpenPool(bookmarks) {
  const unopened = bookmarks.filter((bookmark) => bookmark.status === "unopened");
  const checked = bookmarks.filter((bookmark) => bookmark.status === "checked");
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

  function openOne() {
    const pool = getOpenPool(bookmarks);
    const picked = pickRandom(pool, selectedBookmark?.id || "");

    if (!picked) {
      setMessage("今ひらけるしおりはありません。");
      setSelectedBookmark(null);
      return;
    }

    setMessage("しおりを1枚ひらきました。");
    setSelectedBookmark(picked);
  }

  return (
    <main className="screen open-screen">
      <section className="section-heading">
        <p className="app-name">ひらく</p>
        <h1>迷ったら、1枚だけ開いてみる。</h1>
        <p>未開封か確認済みのしおりから、今ひらけるものを1枚だけ選びます。</p>
      </section>

      <section className="open-stage" aria-label="1枚ひらく">
        <button className="big-open-button" onClick={openOne} type="button">
          <span>{selectedBookmark ? "もう1枚開く" : "1枚開く"}</span>
          <small>話したしおりは選びません</small>
        </button>
      </section>

      {message && <p className="form-message">{message}</p>}

      {selectedBookmark ? (
        <BookmarkCard
          bookmark={selectedBookmark}
          onUpdateStatus={updateSelectedStatus}
          showActions
          showTarget
        />
      ) : (
        <p className="empty">まだ選ばれていません。</p>
      )}
    </main>
  );
}
