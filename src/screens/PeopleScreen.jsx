import BookmarkCard from "../components/BookmarkCard";
import { sortNewest } from "../utils";

export default function PeopleScreen({
  bookmarks,
  onDelete,
  onSelect,
  people,
  selectedPerson,
}) {
  const personBookmarks = selectedPerson
    ? sortNewest(bookmarks.filter((bookmark) => bookmark.person === selectedPerson))
    : [];

  return (
    <main className="screen">
      <section className="section-heading">
        <p className="app-name">会う前のしおり</p>
        <h1>人ごとに、話したかったことを見返す。</h1>
      </section>

      {people.length === 0 ? (
        <p className="empty">
          まだしおりがありません。誰かに話したかったことを、ひとことだけ残してみましょう。
        </p>
      ) : (
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

      {people.length > 0 && !selectedPerson && (
        <p className="empty">見返したい相手を選んでください。</p>
      )}

      {selectedPerson && (
        <section className="selected-section">
          <h2>{selectedPerson}に話したかったこと</h2>
          {personBookmarks.length === 0 ? (
            <p className="empty">この人へのしおりはまだありません。</p>
          ) : (
            <div className="card-list">
              {personBookmarks.map((bookmark) => (
                <BookmarkCard
                  bookmark={bookmark}
                  key={bookmark.id}
                  onDelete={onDelete}
                  showDelete
                  showQuestion
                />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
