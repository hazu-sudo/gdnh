import BookmarkCard from "../components/BookmarkCard";
import { APP_NAME } from "../data";
import { sortNewest } from "../utils";

export default function HomeScreen({ bookmarks, onOpenTab, onSaveTab }) {
  const recent = sortNewest(bookmarks).slice(0, 3);
  const today = sortNewest(bookmarks.filter((item) => item.status === "unopened"))[0];

  return (
    <main className="screen home-screen">
      <section className="home-hero">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">栞</span>
          <p>{APP_NAME}</p>
        </div>
        <p className="hero-kicker">言葉になる前の気持ちのために</p>
        <h1>今すぐ言えない気持ちを、<br />あとで開けるように。</h1>
        <p className="hero-copy">
          送るほどではないけれど、忘れたくない。そんな気持ちを、会話や振り返りになる前のまま置いておけます。
        </p>
        <button className="primary-button hero-action" onClick={onSaveTab} type="button">
          <span>しおりを挟む</span><span aria-hidden="true">＋</span>
        </button>
      </section>

      <section className="today-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">TODAY'S SHIORI</p>
            <h2>今日開くならこれ</h2>
          </div>
          <button className="text-button" onClick={onOpenTab} type="button">迷ったらひらく</button>
        </div>
        {today ? (
          <BookmarkCard bookmark={today} featured />
        ) : (
          <p className="empty">未開封のしおりはありません。いまは、余白の時間です。</p>
        )}
      </section>

      <section className="recent-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">RECENT</p>
            <h2>最近挟んだしおり</h2>
          </div>
          <span className="soft-count">{bookmarks.length} 枚</span>
        </div>
        <div className="card-list">
          {recent.map((bookmark) => <BookmarkCard bookmark={bookmark} key={bookmark.id} />)}
        </div>
      </section>
    </main>
  );
}
