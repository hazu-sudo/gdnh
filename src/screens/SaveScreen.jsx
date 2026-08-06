import { useEffect, useMemo, useRef, useState } from "react";
import { APP_NAME } from "../data.js";
import { formatJapaneseDate } from "../components/BookmarkCard.jsx";
import AttachmentEditor from "../components/AttachmentEditor.jsx";
import {
  attachmentErrorMessage,
  deleteAttachment,
  saveAttachment,
} from "../attachmentStore.js";
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

export function DateWheel({ date, onCancel, onConfirm }) {
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

export default function SaveScreen({
  bookmarks,
  cloudConfigured,
  initialMemo,
  onAttachmentsChanged,
  onInitialMemoConsumed,
  onSave,
  onShowBookmarks,
}) {
  const [date, setDate] = useState(formatToday());
  const [targetName, setTargetName] = useState("");
  const [memo, setMemo] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [saving, setSaving] = useState(false);
  const [inserting, setInserting] = useState(false);
  const insertTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(insertTimer.current), []);

  useEffect(() => {
    if (!initialMemo) return;
    setMemo(initialMemo);
    setSaved(false);
    onInitialMemoConsumed?.();
  }, [initialMemo, onInitialMemoConsumed]);

  const recipientStats = useMemo(() => {
    const counts = new Map();
    bookmarks.forEach((item) => {
      if (item.targetName) counts.set(item.targetName, (counts.get(item.targetName) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
  }, [bookmarks]);
  const suggestions = recipientStats.filter((item) => item.count > 1).slice(0, 5);
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const id = uniqueId();
    let storedAttachment = null;
    setAttachmentError("");
    setSaving(true);

    try {
      if (pendingFile) storedAttachment = await saveAttachment(pendingFile, id);
      onSave({
        id,
        targetName: targetName.trim(),
        memo: memo.trim(),
        status: "unresolved",
        createdAt: date,
        attachmentId: storedAttachment?.id || "",
      });
      setTargetName("");
      setMemo("");
      setPendingFile(null);
      setDate(formatToday());
      setSaved(false);
      setInserting(true);
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      window.clearTimeout(insertTimer.current);
      insertTimer.current = window.setTimeout(() => {
        setInserting(false);
        setSaved(true);
      }, reducedMotion ? 60 : 980);
      if (storedAttachment) onAttachmentsChanged?.();
    } catch (error) {
      if (storedAttachment?.id) await deleteAttachment(storedAttachment.id).catch(() => {});
      setAttachmentError(attachmentErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="screen save-screen">
      <header className="minimal-header">
        <div className="brand-lockup compact-brand">
          <span className="brand-mark blank-mark" aria-hidden="true" />
          <p>{APP_NAME}</p>
        </div>
      </header>

      <section className="save-intro">
        <p className="eyebrow">NEW SHIORI</p>
        <h1>あとで話したいことを<br />「しおり」に挟む</h1>
        <p>話したいことを忘れないように。思いを自由にしおりに残す。</p>
      </section>

      <form
        aria-busy={saving || inserting}
        className={inserting ? "quick-form bookmark-composer is-inserting" : "quick-form bookmark-composer"}
        onSubmit={submit}
      >
        <span className="composer-ribbon" aria-hidden="true" />
        <span className="composer-hole" aria-hidden="true" />
        <div className="simple-field">
          <span>日付</span>
          <button className="date-trigger form-date-trigger" onClick={() => setDateOpen(true)} type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 3v5M16 3v5M4 10h16" /></svg>
            <span>{formatJapaneseDate(date)}</span>
            <span aria-hidden="true">›</span>
          </button>
        </div>
        <label className="simple-field">
          <span>誰に話す <small>任意</small></span>
          <input
            list="recipient-history"
            onChange={(event) => { setTargetName(event.target.value); setSaved(false); }}
            placeholder="だれに話すか入力"
            value={targetName}
          />
          <datalist id="recipient-history">
            {recipientStats.map((item) => <option key={item.name} value={item.name} />)}
          </datalist>
        </label>

        {suggestions.length > 0 && (
          <div className="recipient-suggestions">
            <p>よく登録する人</p>
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
          <span>ひとことメモ <small>任意</small></span>
          <textarea
            maxLength="180"
            onChange={(event) => { setMemo(event.target.value); setSaved(false); }}
            placeholder="あとで話したいことを、ひとこと残す"
            rows="3"
            value={memo}
          />
          <small className="character-count">{memo.length} / 180</small>
        </label>

        <section className="attachment-field">
          <header>
            <div>
              <strong>写真・資料</strong>
              <small>任意</small>
            </div>
            <span>{cloudConfigured ? "アカウントに保存" : "端末内に保存"}</span>
          </header>
          <AttachmentEditor
            disabled={saving}
            onChoose={(file) => {
              setPendingFile(file);
              setAttachmentError("");
              setSaved(false);
            }}
            onRequestRemove={() => {
              setPendingFile(null);
              setAttachmentError("");
            }}
            pendingFile={pendingFile}
          />
          {pendingFile && (
            <p className="attachment-privacy-note">
              しおりに挟んだ写真や資料は、元のデータを削除しても確認できるように、アプリ内に保存されます。
            </p>
          )}
          {attachmentError && (
            <div className="attachment-error" role="alert">
              <p>{attachmentError}</p>
              {pendingFile && <button onClick={() => setPendingFile(null)} type="button">添付を外す</button>}
            </div>
          )}
        </section>

        {saved && (
          <div className="saved-note" aria-live="polite">
            <span aria-hidden="true">✓</span>
            <p><strong>しおりを挟みました</strong><small>あとで、日付か話す相手から開けます。</small></p>
          </div>
        )}
        <button className="primary-button quick-save" disabled={saving || inserting} type="submit">
          <span className="mini-ribbon" aria-hidden="true" />
          {saving
            ? (pendingFile?.type.startsWith("image/") ? "写真をしおりに挟んでいます" : "資料を保存しています")
            : "挟む"}
        </button>
        {saved && <button className="text-button centered" onClick={onShowBookmarks} type="button">挟んだしおりを見る</button>}
        {inserting && (
          <div className="insert-book-animation" role="status">
            <span className="moving-bookmark" aria-hidden="true" />
            <span className="receiving-book" aria-hidden="true"><i /><i /></span>
            <strong>しおりを本に挟んでいます</strong>
          </div>
        )}
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
