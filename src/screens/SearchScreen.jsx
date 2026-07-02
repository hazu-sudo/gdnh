import { useMemo, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import {
  classifiedStatusOptions,
  emotionOptions,
  getEmotionShortLabel,
} from "../data";
import { sortByDate } from "../utils";

const modeOptions = [
  { id: "date", label: "日付で探す" },
  { id: "person", label: "宛先で探す" },
  { id: "tag", label: "タグで探す" },
  { id: "status", label: "状態で探す" },
];

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

function toDateKey(date) {
  return date.toLocaleDateString("sv-SE");
}

function toMonthKey(date) {
  return toDateKey(date).slice(0, 7);
}

function buildMonthDays(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const days = Array.from({ length: firstDay.getDay() }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month - 1, day);
    days.push({
      day,
      iso: toDateKey(date),
    });
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function shiftMonth(monthKey, amount) {
  const [year, month] = monthKey.split("-").map(Number);
  return toMonthKey(new Date(year, month - 1 + amount, 1));
}

function getMarkType(bookmarks) {
  if (!bookmarks?.length) {
    return "";
  }

  if (bookmarks.some((bookmark) => bookmark.status === "paused")) {
    return "bookmark";
  }

  if (bookmarks.some((bookmark) => bookmark.status === "unopened")) {
    return "strong";
  }

  return "dot";
}

function ResultList({ bookmarks, onUpdateStatus }) {
  if (bookmarks.length === 0) {
    return <p className="empty">この条件のしおりはまだありません。</p>;
  }

  return (
    <section className="card-list" aria-label="検索結果">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          bookmark={bookmark}
          key={bookmark.id}
          onUpdateStatus={onUpdateStatus}
          showActions
          showPerson
          showQuestion
        />
      ))}
    </section>
  );
}

export default function SearchScreen({
  bookmarks,
  onSelectPerson,
  onUpdateStatus,
  people,
  selectedPerson,
}) {
  const today = toDateKey(new Date());
  const [mode, setMode] = useState("date");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [monthKey, setMonthKey] = useState(toMonthKey(new Date()));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTag, setSelectedTag] = useState(emotionOptions[0]);
  const [selectedStatus, setSelectedStatus] = useState("checked");
  const [sortDirection, setSortDirection] = useState("new");

  const bookmarksByDate = useMemo(() => {
    return bookmarks.reduce((map, bookmark) => {
      const group = map.get(bookmark.createdAt) || [];
      group.push(bookmark);
      map.set(bookmark.createdAt, group);
      return map;
    }, new Map());
  }, [bookmarks]);

  const activePerson = selectedPerson || people[0] || "";
  const days = buildMonthDays(monthKey);
  const monthLabel = monthKey.replace("-", "年") + "月";

  const results = useMemo(() => {
    if (mode === "date") {
      return sortByDate(bookmarks.filter((bookmark) => bookmark.createdAt === selectedDate), sortDirection);
    }

    if (mode === "person") {
      return sortByDate(bookmarks.filter((bookmark) => bookmark.person === activePerson), sortDirection);
    }

    if (mode === "tag") {
      return sortByDate(bookmarks.filter((bookmark) => bookmark.emotion === selectedTag), sortDirection);
    }

    return sortByDate(bookmarks.filter((bookmark) => bookmark.status === selectedStatus), sortDirection);
  }, [activePerson, bookmarks, mode, selectedDate, selectedStatus, selectedTag, sortDirection]);

  function chooseMode(nextMode) {
    setMode(nextMode);
    setSheetOpen(false);
  }

  return (
    <main className="screen search-screen">
      <section className="section-heading">
        <p className="app-name">探す</p>
        <h1>しおりを探す。</h1>
        <p>日付、宛先、タグ、状態から、残していた話題を見つけます。</p>
      </section>

      <section className="calendar-tool" aria-label="しおりカレンダー">
        <div className="calendar-head">
          <button
            aria-label="前の月"
            className="round-icon-button"
            onClick={() => setMonthKey(shiftMonth(monthKey, -1))}
            type="button"
          >
            ‹
          </button>
          <h2>{monthLabel}</h2>
          <button
            aria-label="次の月"
            className="round-icon-button"
            onClick={() => setMonthKey(shiftMonth(monthKey, 1))}
            type="button"
          >
            ›
          </button>
        </div>

        <div className="calendar-weekdays" aria-hidden="true">
          {weekdays.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day, index) =>
            day ? (
              <button
                aria-label={`${day.iso}のしおり`}
                className={selectedDate === day.iso ? "day-button active" : "day-button"}
                key={day.iso}
                onClick={() => {
                  setSelectedDate(day.iso);
                  setMode("date");
                }}
                type="button"
              >
                <span>{day.day}</span>
                <i
                  aria-hidden="true"
                  className={`day-mark ${getMarkType(bookmarksByDate.get(day.iso))}`}
                />
              </button>
            ) : (
              <span className="day-spacer" key={`blank-${index}`} />
            ),
          )}
        </div>
      </section>

      <section className="search-panel" aria-label="探し方">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">{modeOptions.find((item) => item.id === mode)?.label}</p>
            <h2>{results.length}件のしおり</h2>
          </div>
          <div className="segmented" aria-label="並び順">
            <button
              className={sortDirection === "new" ? "segment-button active" : "segment-button"}
              onClick={() => setSortDirection("new")}
              type="button"
            >
              新しい順
            </button>
            <button
              className={sortDirection === "old" ? "segment-button active" : "segment-button"}
              onClick={() => setSortDirection("old")}
              type="button"
            >
              古い順
            </button>
          </div>
        </div>

        {mode === "date" && (
          <div className="selected-pill" aria-label="選択中の日付">
            {selectedDate}
          </div>
        )}

        {mode === "person" && (
          <div className="chip-scroll" aria-label="宛先">
            {people.map((person) => (
              <button
                className={activePerson === person ? "person-button active" : "person-button"}
                key={person}
                onClick={() => onSelectPerson(person)}
                type="button"
              >
                {person}
              </button>
            ))}
          </div>
        )}

        {mode === "tag" && (
          <div className="chip-scroll" aria-label="気持ちタグ">
            {emotionOptions.map((emotion) => (
              <button
                className={selectedTag === emotion ? "tag-choice active" : "tag-choice"}
                key={emotion}
                onClick={() => setSelectedTag(emotion)}
                type="button"
              >
                {getEmotionShortLabel(emotion)}
              </button>
            ))}
          </div>
        )}

        {mode === "status" && (
          <div className="chip-scroll" aria-label="状態">
            {classifiedStatusOptions.map((status) => (
              <button
                className={selectedStatus === status.id ? "filter-button active" : "filter-button"}
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                type="button"
              >
                {status.label}
              </button>
            ))}
          </div>
        )}

        <ResultList bookmarks={results} onUpdateStatus={onUpdateStatus} />
      </section>

      <button className="search-fab" onClick={() => setSheetOpen(true)} type="button">
        探し方を変える
      </button>

      {sheetOpen && (
        <div className="sheet-backdrop" onClick={() => setSheetOpen(false)}>
          <section
            aria-label="探し方を選ぶ"
            className="bottom-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sheet-handle" aria-hidden="true" />
            <h2>しおりを探す</h2>
            <div className="sheet-menu">
              {modeOptions.map((option) => (
                <button
                  className={mode === option.id ? "sheet-option active" : "sheet-option"}
                  key={option.id}
                  onClick={() => chooseMode(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
