import { useMemo } from "react";
import { beforeMeetCategories } from "../data";
import { pickRandom } from "../utils";

function pickForCategory(bookmarks, emotions) {
  const matches = bookmarks.filter((bookmark) => emotions.includes(bookmark.emotion));
  const unsent = matches.filter((bookmark) => bookmark.status === "unsent");
  return pickRandom(unsent.length > 0 ? unsent : matches);
}

function PrepCard({ bookmark, onUpdateStatus }) {
  return (
    <article className="prep-card">
      <div className="bookmark-notch" aria-hidden="true" />
      <div className="prep-body">
        <div className="bookmark-card-head">
          <span className="tag">{bookmark.emotion}</span>
        </div>
        <p className="memo">{bookmark.memo}</p>
        <div className="talk-box">
          <span>話し出し</span>
          <p>{bookmark.openingLine}</p>
        </div>
        <div className="talk-box question-box">
          <span>聞いてみたいこと</span>
          <p>{bookmark.question}</p>
        </div>
        <div className="action-row">
          <button
            className="secondary-button small-action"
            disabled={bookmark.status === "talked"}
            onClick={() => onUpdateStatus(bookmark.id, "talked")}
            type="button"
          >
            話したことにする
          </button>
          <button
            className="ghost-button small-action"
            disabled={bookmark.status === "dismissed"}
            onClick={() => onUpdateStatus(bookmark.id, "dismissed")}
            type="button"
          >
            もう話さなくていい
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BeforeMeetScreen({
  bookmarks,
  onSelect,
  onUpdateStatus,
  people,
  selectedPerson,
}) {
  const personBookmarks = useMemo(
    () => bookmarks.filter((bookmark) => bookmark.person === selectedPerson),
    [bookmarks, selectedPerson],
  );

  const categoryBookmarks = useMemo(
    () =>
      beforeMeetCategories.map((category) => ({
        ...category,
        bookmark: pickForCategory(personBookmarks, category.emotions),
      })),
    [personBookmarks],
  );

  return (
    <main className="screen">
      <section className="section-heading before-heading">
        <p className="app-name">会う前のしおり</p>
        <h1>会う前に、少しだけ思い出す。</h1>
        <p>次に会う人を選ぶと、その人に渡さず残していた言葉がそっと戻ってきます。</p>
      </section>

      {people.length > 0 && (
        <div className="people-grid" aria-label="登録されている相手">
          {people.map((person) => (
            <button
              className={selectedPerson === person ? "person-button active" : "person-button"}
              key={person}
              onClick={() => onSelect(person)}
              type="button"
            >
              {person}
            </button>
          ))}
        </div>
      )}

      {people.length === 0 && (
        <p className="empty">
          まだしおりがありません。誰かに話したかったことを、ひとことだけ残してみましょう。
        </p>
      )}

      {people.length > 0 && !selectedPerson && (
        <p className="empty">次に会う人を選んでください。</p>
      )}

      {selectedPerson && (
        <section className="prep-list" aria-label={`${selectedPerson}に話すしおり`}>
          {categoryBookmarks.map((category) => (
            <section className="prep-section" key={category.id}>
              <h2>{category.title}</h2>
              {category.bookmark ? (
                <PrepCard
                  bookmark={category.bookmark}
                  onUpdateStatus={onUpdateStatus}
                />
              ) : (
                <p className="empty compact-empty">まだこの種類のしおりはありません。</p>
              )}
            </section>
          ))}
        </section>
      )}
    </main>
  );
}
