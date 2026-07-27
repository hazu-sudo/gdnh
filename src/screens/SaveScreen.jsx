import { useEffect, useMemo, useRef, useState } from "react";
import { APP_NAME } from "../data.js";
import { formatJapaneseDate } from "../components/BookmarkCard.jsx";
import { formatToday, uniqueId } from "../utils.js";

const ITEM_HEIGHT = 44;

function getDateParts(date) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function toDateKey({ year, month, day }) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function WheelColumn({ label, options, value, onChange, suffix }) {
  const ref = useRef(null);
  const timeout = useRef(null);

  useEffect(() => {
    const index = options.indexOf(value);
    if (index >= 0 && ref.current) {
      ref.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: "instant" });
    }
  }, [options, value]);

  function handleScroll(event) {
    clearTimeout(timeout.current);
    const element = event.currentTarget;
    timeout.current = setTimeout(() => {
      const index = Math.max(0, Math.min(options.length - 1, Math.round(element.scrollTop / ITEM_HEIGHT)));
      onChange(options[index]);
      element.scrollTo({ top: index * ITEM_HEIGHT, behavior: "smooth" });
    }, 90);
  }

  return (
    <div className="wheel-column">
      <span className="sr-only">{label}</span>
      <div className="wheel-list" onScroll={handleScroll} ref={ref}>
        {options.map((option) => (
          <button
            className={option === value ? "wheel-option active" : "wheel-option"}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option}<small>{suffix}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateWheel({ date, onCancel, onConfirm }) {
  const [draft, setDraft] = useState(getDateParts(date));
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 12 }, (_, index) => currentYear - 7 + index),
    [currentYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const days = useMemo(
    () => Array.from({ length: daysInMonth(draft.year, draft.month) }, (_, index) => index + 1),
    [draft.month, draft.year],
  );

  useEffect(() => {
    if (draft.day > days.length) setDraft((current) => ({ ...current, day: days.length }));
  }, [days.length, draft.day]);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <section
        aria-label="日付を選ぶ"
        aria-modal="true"
        className="date-sheet"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="sheet-handle" />
        <header className="date-sheet-head">
          <button className="text-button" onClick={onCancel} type="button">キャンセル</button>
          <h2>日付を選ぶ</h2>
          <button className="text-button strong" onClick={() => onConfirm(toDateKey(draft))} type="button">決定</button>
        </header>
        <div className="wheel-picker">
          <div className="wheel-highlight" aria-hidden="true" />
          <WheelColumn
            label="年"
            onChange={(year) => setDraft((current) => ({ ...current, year }))}
            options={years}
            suffix="年"
            value={draft.year}
          />
          <WheelColumn
            label="月"
            onChange={(month) => setDraft((current) => ({ ...current, month }))}
            options={months}
            suffix="月"
            value={draft.month}
          />
          <WheelColumn
            label="日"
            onChange={(day) => setDraft((current) => ({ ...current, day }))}
            options={days}
            suffix="日"
            value={draft.day}
          />
        </div>
      </section>
    </div>
  );
}

export default function SaveScreen({ bookmarks, onSave, onShowBookmarks }) {
  const [date, setDate] = useState(formatToday());
  const [targetName, setTargetName] = useState("");
  const [memo, setMemo] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const recipientStats = useMemo(() => {
    const counts = new Map();
    bookmarks.forEach((item) => counts.set(item.targetName, (counts.get(item.targetName) || 0) + 1));
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
  }, [bookmarks]);
  const suggestions = recipientStats.slice(0, 5);
  const hasFrequent = suggestions.some((item) => item.count > 1);
  const canSave = Boolean(targetName.trim() && memo.trim());

  function submit(event) {
    event.preventDefault();
    if (!canSave) return;
    onSave({
      id: uniqueId(),
      targetName: targetName.trim(),
      memo: memo.trim(),
      status: "unresolved",
      createdAt: date,
    });
    setTargetName("");
    setMemo("");
    setDate(formatToday());
    setSaved(true);
  }

  return (
    <main className="screen save-screen">
      <header className="minimal-header">
        <div className="brand-lockup compact-brand">
          <span className="brand-mark" aria-hidden="true">栞</span>
          <p>{APP_NAME}</p>
        </div>
        <button className="date-trigger" onClick={() => setDateOpen(true)} type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 3v5M16 3v5M4 10h16" /></svg>
          <span>{formatJapaneseDate(date)}</span>
          <span aria-hidden="true">›</span>
        </button>
      </header>

      <section className="save-intro">
        <p className="eyebrow">NEW SHIORI</p>
        <h1>あとで話したいことを、<br />ひとこと挟む。</h1>
        <p>今は話せなくても、忘れないように。きれいに書かなくて大丈夫です。</p>
      </section>

      <form className="quick-form" onSubmit={submit}>
        <label className="simple-field">
          <span>宛先</span>
          <input
            list="recipient-history"
            onChange={(event) => { setTargetName(event.target.value); setSaved(false); }}
            placeholder="宛先を入力"
            value={targetName}
          />
          <datalist id="recipient-history">
            {recipientStats.map((item) => <option key={item.name} value={item.name} />)}
          </datalist>
        </label>

        {suggestions.length > 0 && (
          <div className="recipient-suggestions">
            <p>{hasFrequent ? "よく使う宛先" : "過去の宛先"}</p>
            <div className="recipient-chips">
              {suggestions.map((item) => (
                <button key={item.name} onClick={() => setTargetName(item.name)} type="button">
                  {item.name}{item.count > 1 && <small>{item.count}</small>}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="simple-field">
          <span>ひとことメモ</span>
          <textarea
            maxLength="180"
            onChange={(event) => { setMemo(event.target.value); setSaved(false); }}
            placeholder="あとで話したいことを、ひとこと残す"
            rows="3"
            value={memo}
          />
          <small className="character-count">{memo.length} / 180</small>
        </label>

        {saved && (
          <div className="saved-note" aria-live="polite">
            <span aria-hidden="true">✓</span>
            <p><strong>しおりを挟みました</strong><small>あとで、日付か宛先から開けます。</small></p>
          </div>
        )}
        <button className="primary-button quick-save" disabled={!canSave} type="submit">
          <span className="mini-ribbon" aria-hidden="true" />
          しおりを挟む
        </button>
        {saved && <button className="text-button centered" onClick={onShowBookmarks} type="button">挟んだしおりを見る</button>}
      </form>

      {dateOpen && (
        <DateWheel
          date={date}
          onCancel={() => setDateOpen(false)}
          onConfirm={(nextDate) => { setDate(nextDate); setDateOpen(false); setSaved(false); }}
        />
      )}
    </main>
  );
}
