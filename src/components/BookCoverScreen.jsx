import { useMemo, useRef, useState } from "react";
import { APP_NAME } from "../data.js";

const statusMarks = {
  pending: "•",
  resolved: "✓",
  sent: "✉",
};

function tabCount(total) {
  if (total <= 3) return total;
  if (total <= 10) return Math.min(6, Math.max(4, Math.ceil(total * 0.65)));
  return 8;
}

export default function BookCoverScreen({ bookmarks, onOpen }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef(null);
  const tabs = useMemo(() => {
    const count = tabCount(bookmarks.length);
    return [...bookmarks]
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, count);
  }, [bookmarks]);

  function openBook() {
    if (opening) return;
    setOpening(true);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(onOpen, reducedMotion ? 80 : 760);
  }

  return (
    <main className={opening ? "book-entry-screen is-opening" : "book-entry-screen"}>
      <div className="book-entry-heading">
        <p className="eyebrow">YOUR SHIORI BOOK</p>
        <h1>あとで開ける気持ちを、<br />一冊に。</h1>
      </div>

      <button
        aria-label="本を開いて、あとで開くしおりを始める"
        className="closed-book-button"
        onClick={openBook}
        type="button"
      >
        <span className="closed-book-stage" aria-hidden="true">
          <span className="closed-book-pages" />
          <span className="closed-book-tabs">
            {tabs.map((bookmark, index) => (
              <span
                className={`closed-book-tab status-${bookmark.status || "unresolved"}`}
                key={bookmark.id}
                style={{ "--tab-index": index, "--tab-total": Math.max(tabs.length, 1) }}
              >
                {statusMarks[bookmark.status] && <i>{statusMarks[bookmark.status]}</i>}
              </span>
            ))}
          </span>
          <span className="closed-book-cover">
            <span className="book-spine-line" />
            <span className="cover-bookmark-mark" />
            <strong>{APP_NAME}</strong>
            <small>言葉になる前の気持ちに、<br />あとで開ける居場所を。</small>
          </span>
        </span>
      </button>

      <div className="book-entry-footer">
        {bookmarks.length > 0
          ? <p><strong>{bookmarks.length}枚</strong>のしおりが挟まれています</p>
          : <p>話したいことを、最初のしおりに挟んでみましょう</p>}
        <span className="book-open-copy mobile-open-copy">本をタップして開く</span>
        <span className="book-open-copy desktop-open-copy">クリックして開く</span>
      </div>
    </main>
  );
}
