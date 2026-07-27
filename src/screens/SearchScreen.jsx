import { useMemo, useState } from "react";
import BookmarkCard, { formatJapaneseDate } from "../components/BookmarkCard.jsx";
import { STATUS_LABELS } from "../data.js";
import { sortNewest } from "../utils.js";

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

function dateKey(date) {
  return date.toLocaleDateString("sv-SE");
}

function monthKey(date) {
  return dateKey(date).slice(0, 7);
}

function buildMonth(key) {
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

function DetailView({ bookmark, onBack, onUpdateStatus }) {
  return (
    <main className="screen detail-screen">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} type="button" aria-label="一覧へ戻る">‹</button>
        <p>しおりを開く</p>
        <span />
      </header>
      <section className={`detail-paper ${bookmark.status}`}>
        <span className="detail-ribbon" aria-hidden="true" />
        <time dateTime={bookmark.createdAt}>{formatJapaneseDate(bookmark.createdAt)}</time>
        <p className="detail-label">宛先</p>
        <h1>{bookmark.targetName}へ</h1>
        <div className="detail-divider" />
        <p className="detail-label">ひとことメモ</p>
        <p className="detail-memo">{bookmark.memo}</p>
        <div className="detail-status">
          <span>現在の状態</span>
          <strong className={`status-label ${bookmark.status}`}>{STATUS_LABELS[bookmark.status]}</strong>
        </div>
      </section>
      <section className="detail-actions">
        <p>このしおりは、どうなりましたか？</p>
        <div>
          <button
            className="hold-button"
            disabled={bookmark.status === "pending"}
            onClick={() => onUpdateStatus(bookmark.id, "pending")}
            type="button"
          >
            <span aria-hidden="true">Ⅱ</span>
            <strong>保留にする</strong>
            <small>またあとで開く</small>
          </button>
          <button
            className="resolve-button"
            disabled={bookmark.status === "resolved"}
            onClick={() => onUpdateStatus(bookmark.id, "resolved")}
            type="button"
          >
            <span aria-hidden="true">✓</span>
            <strong>話せた</strong>
            <small>解消済みにする</small>
          </button>
        </div>
      </section>
    </main>
  );
}

export default function SearchScreen({ bookmarks, onUpdateStatus }) {
  const [mode, setMode] = useState("calendar");
  const [calendarMonth, setCalendarMonth] = useState(monthKey(new Date()));
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const days = useMemo(() => buildMonth(calendarMonth), [calendarMonth]);
  const selectedBookmark = bookmarks.find((item) => item.id === selectedId);

  const dayCounts = useMemo(() => {
    const counts = {};
    bookmarks.forEach((item) => { counts[item.createdAt] = (counts[item.createdAt] || 0) + 1; });
    return counts;
  }, [bookmarks]);

  const recipients = useMemo(() => {
    const groups = new Map();
    bookmarks.forEach((item) => {
      const current = groups.get(item.targetName) || [];
      groups.set(item.targetName, [...current, item]);
    });
    return [...groups.entries()]
      .map(([name, items]) => ({ name, count: items.length, latest: sortNewest(items)[0]?.createdAt }))
      .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest));
  }, [bookmarks]);

  const results = useMemo(() => {
    if (mode === "calendar" && selectedDate) {
      return sortNewest(bookmarks.filter((item) => item.createdAt === selectedDate));
    }
    if (mode === "recipient" && selectedTarget) {
      return sortNewest(bookmarks.filter((item) => item.targetName === selectedTarget));
    }
    return [];
  }, [bookmarks, mode, selectedDate, selectedTarget]);

  if (selectedBookmark) {
    return (
      <DetailView
        bookmark={selectedBookmark}
        onBack={() => setSelectedId("")}
        onUpdateStatus={onUpdateStatus}
      />
    );
  }

  return (
    <main className="screen search-screen">
      <header className="search-heading">
        <p className="eyebrow">OPEN SHIORI</p>
        <h1>しおりを探す</h1>
        <p>あの日から、あの人から。話したかったことをたどります。</p>
      </header>

      <div className="search-tabs" role="tablist" aria-label="しおりの探し方">
        <button
          aria-selected={mode === "calendar"}
          className={mode === "calendar" ? "active" : ""}
          onClick={() => { setMode("calendar"); setSelectedTarget(""); }}
          role="tab"
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 3v5M16 3v5M4 10h16" /></svg>
          カレンダー
        </button>
        <button
          aria-selected={mode === "recipient"}
          className={mode === "recipient" ? "active" : ""}
          onClick={() => { setMode("recipient"); setSelectedDate(""); }}
          role="tab"
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.5-4 2.6-6 6.5-6s6 2 6.5 6" /></svg>
          宛先から探す
        </button>
      </div>

      {mode === "calendar" && (
        <section className="calendar-paper simple-calendar">
          <header className="calendar-head">
            <button aria-label="前の月" className="circle-button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, -1))} type="button">‹</button>
            <h2>{calendarMonth.replace("-", "年")}月</h2>
            <button aria-label="次の月" className="circle-button" onClick={() => setCalendarMonth(shiftMonth(calendarMonth, 1))} type="button">›</button>
          </header>
          <div className="calendar-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {days.map((item, index) => item ? (
              <button
                aria-label={`${item.iso}${dayCounts[item.iso] ? `、しおり${dayCounts[item.iso]}件` : ""}`}
                className={selectedDate === item.iso ? "day-button active" : "day-button"}
                key={item.iso}
                onClick={() => setSelectedDate(item.iso)}
                type="button"
              >
                <span>{item.day}</span>
                {dayCounts[item.iso] && (
                  <span className="date-bookmark-mark" aria-hidden="true">
                    <i />{dayCounts[item.iso] > 1 && <small>{dayCounts[item.iso]}</small>}
                  </span>
                )}
              </button>
            ) : <span className="day-spacer" key={`space-${index}`} />)}
          </div>
        </section>
      )}

      {mode === "recipient" && !selectedTarget && (
        <section className="recipient-list">
          <div className="list-caption">
            <h2>これまでの宛先</h2><span>{recipients.length}人</span>
          </div>
          {recipients.map((item) => (
            <button key={item.name} onClick={() => setSelectedTarget(item.name)} type="button">
              <span className="recipient-initial">{item.name.slice(0, 1)}</span>
              <span><strong>{item.name}</strong><small>最近のしおり　{formatJapaneseDate(item.latest)}</small></span>
              <b>{item.count}件</b>
              <i aria-hidden="true">›</i>
            </button>
          ))}
          {!recipients.length && <p className="empty">まだ宛先がありません。</p>}
        </section>
      )}

      {(selectedDate || selectedTarget) && (
        <section className="bookmark-results">
          <header className="list-caption">
            <div>
              {selectedTarget && (
                <button className="inline-back" onClick={() => setSelectedTarget("")} type="button">‹ 宛先一覧</button>
              )}
              <h2>{selectedTarget ? `${selectedTarget}へのしおり` : formatJapaneseDate(selectedDate)}</h2>
            </div>
            <span>{results.length}件</span>
          </header>
          <div className="card-list">
            {results.map((bookmark) => (
              <BookmarkCard bookmark={bookmark} key={bookmark.id} onOpen={() => setSelectedId(bookmark.id)} />
            ))}
          </div>
          {!results.length && <p className="empty">この日に挟んだしおりはありません。</p>}
        </section>
      )}
    </main>
  );
}
