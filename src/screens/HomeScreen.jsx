import BookmarkCard from "../components/BookmarkCard";
import { sortNewest } from "../utils";

function pickDailyBookmark(bookmarks) {
  const candidates = bookmarks.filter((bookmark) => bookmark.status !== "talked");

  if (candidates.length === 0) {
    return null;
  }

  const todayKey = new Date().toLocaleDateString("sv-SE");
  const index = [...todayKey].reduce((total, char) => total + char.charCodeAt(0), 0) % candidates.length;
  return sortNewest(candidates)[index];
}

export default function HomeScreen({ bookmarks, onOpenTab }) {
  const dailyBookmark = pickDailyBookmark(bookmarks);
  const recentBookmarks = sortNewest(bookmarks).slice(0, 3);

  return (
    <main className="screen home-screen">
      <section className="intro-panel">
        <p className="app-name">会う前のしおり</p>
        <h1>話したかったことを、次に会う前までそっと置いておく。</h1>
        <p>写真に残らなかった小さな気持ちを、会話のきっかけに戻します。</p>
      </section>

      <section className="today-section" aria-label="今日のしおり">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">今日の1枚</p>
            <h2>迷ったらここから。</h2>
          </div>
          <button className="secondary-button tiny-button" onClick={onOpenTab} type="button">
            1枚ひらく
          </button>
        </div>
        {dailyBookmark ? (
          <BookmarkCard bookmark={dailyBookmark} showPerson showQuestion />
        ) : (
          <p className="empty">まだ開けるしおりがありません。</p>
        )}
      </section>

      <section className="recent-section" aria-label="最近のしおり">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">最近のしおり</p>
            <h2>近くに置いた気持ち。</h2>
          </div>
        </div>

        {recentBookmarks.length === 0 ? (
          <p className="empty">
            まだしおりがありません。誰かに話したかったことを、ひとことだけ残してみましょう。
          </p>
        ) : (
          <div className="card-list">
            {recentBookmarks.map((bookmark) => (
              <BookmarkCard bookmark={bookmark} key={bookmark.id} showPerson />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
