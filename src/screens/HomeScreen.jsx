import BookmarkCard from "../components/BookmarkCard";
import { APP_NAME } from "../data";
import { sortNewest } from "../utils";

function pickTodayBookmark(bookmarks) {
  const unopened = sortNewest(bookmarks.filter((bookmark) => bookmark.status === "unopened"));
  return unopened[0] || null;
}

export default function HomeScreen({ bookmarks, onOpenTab }) {
  const todayBookmark = pickTodayBookmark(bookmarks);
  const recentBookmarks = sortNewest(bookmarks).slice(0, 4);

  return (
    <main className="screen home-screen">
      <section className="intro-panel hero-panel">
        <p className="app-name">{APP_NAME}</p>
        <h1>今すぐ言えない気持ちを、あとで開けるように。</h1>
        <p>
          言葉になる前の気持ちに、あとで開ける居場所をつくる。
        </p>
      </section>

      <section className="concept-note" aria-label="アプリの考え方">
        <p>
          送る場所でも、やることを管理する場所でもなく、誰かとの会話や自分との振り返りになりかけたものを置いておく場所です。
        </p>
      </section>

      <section className="today-section" aria-label="今日開くならこれ">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">今日開くならこれ</p>
            <h2>未開封の気持ちを、1枚だけ。</h2>
          </div>
          <button className="secondary-button tiny-button" onClick={onOpenTab} type="button">
            ひらく
          </button>
        </div>
        {todayBookmark ? (
          <BookmarkCard bookmark={todayBookmark} showTarget />
        ) : (
          <p className="empty">今は未開封のしおりがありません。</p>
        )}
      </section>

      <section className="recent-section" aria-label="最近のしおり">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">最近のしおり</p>
            <h2>そっと置いた気持ち。</h2>
          </div>
        </div>

        {recentBookmarks.length === 0 ? (
          <p className="empty">
            まだしおりがありません。宛先、気持ちタグ、ひとことだけ置いてみましょう。
          </p>
        ) : (
          <div className="card-list">
            {recentBookmarks.map((bookmark) => (
              <BookmarkCard bookmark={bookmark} key={bookmark.id} showTarget />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
