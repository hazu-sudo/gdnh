import { useMemo, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import { statusOptions } from "../data";
import { sortNewest } from "../utils";

const modes = [
  { id: "target", label: "宛先で探す", icon: "人" },
  { id: "tag", label: "タグで探す", icon: "#" },
  { id: "status", label: "状態で探す", icon: "○" },
];
const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

function dateKey(date) {
  return date.toLocaleDateString("sv-SE");
}

function monthKey(date) {
  return dateKey(date).slice(0, 7);
}

function monthDays(key) {
  const [year, month] = key.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const days = Array.from({ length: first.getDay() }, () => null);
  for (let day = 1; day <= last.getDate(); day += 1) {
    days.push({ day, iso: dateKey(new Date(year, month - 1, day)) });
  }
  while (days.length % 7) days.push(null);
  return days;
}

function shiftMonth(key, amount) {
  const [year, month] = key.split("-").map(Number);
  return monthKey(new Date(year, month - 1 + amount, 1));
}

export default function SearchScreen({ bookmarks, onUpdateStatus }) {
  const initialMonth = bookmarks[0]?.createdAt?.slice(0, 7) || monthKey(new Date());
  const [calendarMonth, setCalendarMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState("");
  const [mode, setMode] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const dates = useMemo(() => monthDays(calendarMonth), [calendarMonth]);
  const dayCounts = useMemo(() => {
    const counts = {};
    bookmarks.forEach((item) => { counts[item.createdAt] = (counts[item.createdAt] || 0) + 1; });
    return counts;
  }, [bookmarks]);
  const options = useMemo(() => {
    if (mode === "target") return [...new Set(bookmarks.map((item) => item.targetName))];
    if (mode === "tag") return [...new Set(bookmarks.map((item) => item.emotion))];
    if (mode === "status") return statusOptions.map((item) => item.id);
    return [];
  }, [bookmarks, mode]);
  const results = useMemo(() => {
    const filtered = selectedDate
      ? bookmarks.filter((item) => item.createdAt === selectedDate)
      : mode === "target"
        ? bookmarks.filter((item) => item.targetName === selectedValue)
        : mode === "tag"
          ? bookmarks.filter((item) => item.emotion === selectedValue)
          : mode === "status"
            ? bookmarks.filter((item) => item.status === selectedValue)
            : [];
    return sortNewest(filtered);
  }, [bookmarks, mode, selectedDate, selectedValue]);
  const statusLabel = Object.fromEntries(statusOptions.map((item) => [item.id, item.label]));

  function chooseMode(nextMode) {
    setMode(nextMode);
    setSelectedDate("");
    const nextOptions =
      nextMode === "target"
        ? [...new Set(bookmarks.map((item) => item.targetName))]
        : nextMode === "tag"
          ? [...new Set(bookmarks.map((item) => item.emotion))]
          : statusOptions.map((item) => item.id);
    setSelectedValue(nextOptions[0] || "");
    setSheetOpen(false);
  }

  return (
    <main className="screen search-screen">
      <section className="screen-heading compact-heading">
        <p className="eyebrow">FIND A SHIORI</p>
        <h1>しおりを探す</h1>
        <p>日付から、あの日の気持ちをたどれます。</p>
      </section>

      <section className="calendar-paper" aria-label="しおりのカレンダー">
        <header className="calendar-head">
          <button aria-label="前の月" className="circle-button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, -1))} type="button">‹</button>
          <h2>{calendarMonth.replace("-", " / ")}</h2>
          <button aria-label="次の月" className="circle-button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, 1))} type="button">›</button>
        </header>
        <div className="calendar-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">
          {dates.map((item, index) =>
            item ? (
              <button
                aria-label={`${item.iso}${dayCounts[item.iso] ? `、しおり${dayCounts[item.iso]}枚` : ""}`}
                className={selectedDate === item.iso ? "day-button active" : "day-button"}
                key={item.iso}
                onClick={() => { setSelectedDate(item.iso); setMode(""); }}
                type="button"
              >
                {item.day}
                {dayCounts[item.iso] && <span className="calendar-mark" aria-hidden="true" />}
              </button>
            ) : <span className="day-spacer" key={`space-${index}`} />
          )}
        </div>
      </section>

      {(mode || selectedDate) && (
        <section className="search-results">
          <header className="section-title-row">
            <div>
              <p className="eyebrow">{selectedDate ? "BY DATE" : `BY ${mode.toUpperCase()}`}</p>
              <h2>{selectedDate || modes.find((item) => item.id === mode)?.label}</h2>
            </div>
            <span className="soft-count">{results.length} 枚</span>
          </header>
          {mode && (
            <div className="chip-scroll filter-chips">
              {options.map((value) => (
                <button
                  className={selectedValue === value ? "filter-chip active" : "filter-chip"}
                  key={value}
                  onClick={() => setSelectedValue(value)}
                  type="button"
                >
                  {mode === "status" ? statusLabel[value] : value}
                </button>
              ))}
            </div>
          )}
          {results.length ? (
            <div className="card-list">
              {results.map((bookmark) => (
                <BookmarkCard bookmark={bookmark} key={bookmark.id} onUpdateStatus={onUpdateStatus} showActions />
              ))}
            </div>
          ) : <p className="empty">ここには、まだしおりがありません。</p>}
        </section>
      )}

      <button aria-label="探し方を選ぶ" className="search-fab icon-fab" onClick={() => setSheetOpen(true)} type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4M10.5 8v5M8 10.5h5" /></svg>
      </button>
      {sheetOpen && (
        <div className="sheet-backdrop" onClick={() => setSheetOpen(false)}>
          <section className="bottom-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-handle" />
            <p className="eyebrow">SEARCH BY</p>
            <h2>どこから、たどりますか？</h2>
            <div className="sheet-menu">
              {modes.map((item) => (
                <button className="sheet-option" key={item.id} onClick={() => chooseMode(item.id)} type="button">
                  <span className="sheet-icon">{item.icon}</span>{item.label}<span aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
