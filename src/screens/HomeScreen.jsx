import BookmarkCard from "../components/BookmarkCard";
import { sortNewest } from "../utils";

export default function HomeScreen({ bookmarks }) {
  const recentBookmarks = sortNewest(bookmarks);

  return (
    <main className="screen">
      <section className="intro-panel">
        <p className="app-name">会う前のしおり</p>
        <h1>写真に残らなかったことも、誰かと話せば思い出になる。</h1>
        <p>
          すぐに送らなかった小さな気持ちを、次に会う日の会話へそっと残します。
        </p>
      </section>

      {recentBookmarks.length === 0 ? (
        <p className="empty">
          まだしおりがありません。誰かに話したかったことを、ひとことだけ残してみましょう。
        </p>
      ) : (
        <section className="card-list" aria-label="最近のしおり">
          {recentBookmarks.map((bookmark) => (
            <BookmarkCard
              bookmark={bookmark}
              key={bookmark.id}
              showPerson
            />
          ))}
        </section>
      )}
    </main>
  );
}
