import { useEffect, useMemo, useState } from "react";
import BookmarkCard, { formatJapaneseDate } from "../components/BookmarkCard.jsx";
import SharePreview from "../components/SharePreview.jsx";
import { sortNewest } from "../utils.js";
import { DateWheel } from "./SaveScreen.jsx";

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

function memoPreview(memo) {
  const firstLine = memo.split(/\r?\n/)[0].trim();
  if (!firstLine) return "メモなし";
  return firstLine.length > 18 ? `${firstLine.slice(0, 18)}…` : firstLine;
}

function DetailView({ bookmark, onBack, onUpdateBookmark, onUpdateStatus, senderName }) {
  const [editing, setEditing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [targetName, setTargetName] = useState(bookmark.targetName);
  const [memo, setMemo] = useState(bookmark.memo);
  const [createdAt, setCreatedAt] = useState(bookmark.createdAt);
  const [status, setStatus] = useState(bookmark.status);
  const [dateOpen, setDateOpen] = useState(false);
  useEffect(() => {
    if (!editing) setStatus(bookmark.status);
  }, [bookmark.status, editing]);

  if (sharing) {
    return (
      <SharePreview
        bookmark={bookmark}
        defaultSenderName={senderName}
        onClose={() => setSharing(false)}
      />
    );
  }

  function cancelEdit() {
    setTargetName(bookmark.targetName);
    setMemo(bookmark.memo);
    setCreatedAt(bookmark.createdAt);
    setStatus(bookmark.status);
    setEditing(false);
  }

  function saveEdit() {
    onUpdateBookmark(bookmark.id, {
      targetName: targetName.trim(),
      memo: memo.trim(),
      createdAt,
      status,
    });
    setEditing(false);
  }

  function changeStatus(nextStatus) {
    if (editing) {
      setStatus(nextStatus);
    } else {
      setStatus(nextStatus);
      onUpdateStatus(bookmark.id, nextStatus);
    }
  }

  const currentStatus = editing ? status : bookmark.status;

  return (
    <main className="screen detail-screen">
      <header className="detail-header">
        <button className="back-button" onClick={onBack} type="button" aria-label="一覧へ戻る">‹</button>
        <p>しおりを開く</p>
        <div className="detail-header-actions">
          {!editing && (
            <button aria-label="しおりを共有" className="detail-share-button" onClick={() => setSharing(true)} type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M8 8l4-4 4 4M5 12v7h14v-7" /></svg>
            </button>
          )}
          <button
            className={editing ? "detail-edit-button active" : "detail-edit-button"}
            onClick={() => editing ? cancelEdit() : setEditing(true)}
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-.7 3.7L8 19l9.6-9.6-3-3L5 16Z" /><path d="m13.5 7.5 3 3" /></svg>
            {editing ? "取消" : "編集"}
          </button>
        </div>
      </header>
      <section className={`detail-paper ${currentStatus}`}>
        <span className="detail-ribbon" aria-hidden="true" />
        {editing ? (
          <button className="detail-date-edit" onClick={() => setDateOpen(true)} type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 3v5M16 3v5M4 10h16" /></svg>
            <span>{formatJapaneseDate(createdAt)}</span>
            <i aria-hidden="true">›</i>
          </button>
        ) : <time dateTime={bookmark.createdAt}>{formatJapaneseDate(bookmark.createdAt)}</time>}
        <p className="detail-label">だれに話す</p>
        {editing ? (
          <input
            aria-label="だれに話すかを編集"
            className="detail-edit-input"
            onChange={(event) => setTargetName(event.target.value)}
            value={targetName}
          />
        ) : <h1>{bookmark.targetName ? `${bookmark.targetName}へ` : "宛先なし"}</h1>}
        <div className="detail-divider" />
        <p className="detail-label">ひとことメモ</p>
        {editing ? (
          <textarea
            aria-label="ひとことメモを編集"
            className="detail-edit-memo"
            maxLength="180"
            onChange={(event) => setMemo(event.target.value)}
            rows="4"
            value={memo}
          />
        ) : <p className={bookmark.memo ? "detail-memo" : "detail-memo empty-value"}>{bookmark.memo || "メモなし"}</p>}
        <div className="detail-status">
          <span>状態</span>
          <div className="status-choice-buttons" role="group" aria-label="しおりの状態">
            <button
              aria-pressed={currentStatus === "pending"}
              className={currentStatus === "pending" ? "status-choice pending active" : "status-choice pending"}
              onClick={() => changeStatus("pending")}
              type="button"
            >
              保留
            </button>
            <button
              aria-pressed={currentStatus === "resolved"}
              className={currentStatus === "resolved" ? "status-choice resolved active" : "status-choice resolved"}
              onClick={() => changeStatus("resolved")}
              type="button"
            >
              話した
            </button>
            <button
              aria-pressed={currentStatus === "unresolved"}
              className={currentStatus === "unresolved" ? "status-choice unresolved active" : "status-choice unresolved"}
              onClick={() => changeStatus("unresolved")}
              type="button"
            >
              選択解除
            </button>
          </div>
        </div>
      </section>
      {editing ? (
        <section className="edit-actions">
          <button className="edit-cancel" onClick={cancelEdit} type="button">キャンセル</button>
          <button className="edit-save" onClick={saveEdit} type="button">変更を保存</button>
        </section>
      ) : null}
      {dateOpen && (
        <DateWheel
          date={createdAt}
          onCancel={() => setDateOpen(false)}
          onConfirm={(nextDate) => {
            setCreatedAt(nextDate);
            setDateOpen(false);
          }}
        />
      )}
    </main>
  );
}

export default function SearchScreen({ bookmarks, onUpdateBookmark, onUpdateStatus, senderName }) {
  const [mode, setMode] = useState("");
  const [chooserOpen, setChooserOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(monthKey(new Date()));
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const today = dateKey(new Date());
  const days = useMemo(() => buildMonth(calendarMonth), [calendarMonth]);
  const selectedBookmark = bookmarks.find((item) => item.id === selectedId);
  const floatingBookmarks = useMemo(() => sortNewest(bookmarks).slice(0, 7), [bookmarks]);

  const dayCounts = useMemo(() => {
    const counts = {};
    bookmarks.forEach((item) => { counts[item.createdAt] = (counts[item.createdAt] || 0) + 1; });
    return counts;
  }, [bookmarks]);

  const recipients = useMemo(() => {
    const groups = new Map();
    bookmarks.filter((item) => item.targetName).forEach((item) => {
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
        onUpdateBookmark={onUpdateBookmark}
        onUpdateStatus={onUpdateStatus}
        senderName={senderName}
      />
    );
  }

  function chooseSearchMode(nextMode) {
    setMode(nextMode);
    setChooserOpen(false);
    setSelectedDate("");
    setSelectedTarget("");
  }

  function returnToPortal() {
    setMode("");
    setChooserOpen(false);
    setSelectedDate("");
    setSelectedTarget("");
  }

  if (!mode) {
    return (
      <main className="screen search-portal-screen">
        <section className={chooserOpen ? "search-portal chooser-open" : "search-portal"}>
          <button
            aria-label="探し方を選ぶ"
            className="portal-tap-layer"
            onClick={() => setChooserOpen(true)}
            type="button"
          />

          <header className="portal-heading">
            <p className="eyebrow">FIND A SHIORI</p>
            <h1>しおりを探す</h1>
            <p>これまで挟んだ気持ちが、ここで静かに待っています。</p>
          </header>

          <div className="floating-bookmarks" aria-hidden="true">
            {floatingBookmarks.length > 0 ? floatingBookmarks.map((bookmark, index) => (
              <div className={`floating-shiori bubble-${index + 1}`} key={bookmark.id}>
                <span className="floating-ribbon" />
                <strong>{bookmark.targetName || "宛先なし"}</strong>
                <p>{memoPreview(bookmark.memo)}</p>
              </div>
            )) : (
              <>
                <div className="floating-shiori bubble-1 placeholder-bubble"><span className="floating-ribbon" /><strong>未来の自分</strong><p>話したいことを、ここに…</p></div>
                <div className="floating-shiori bubble-3 placeholder-bubble"><span className="floating-ribbon" /><strong>だれかへ</strong><p>しおりが静かに待ちます</p></div>
                <div className="floating-shiori bubble-6 placeholder-bubble"><span className="floating-ribbon" /><strong>あとで</strong><p>開ける場所をつくる</p></div>
              </>
            )}
          </div>

          <div className="portal-prompt" aria-hidden="true">
            <span>
              <svg viewBox="0 0 24 24"><path d="M12 4v12M8 12l4 4 4-4" /></svg>
            </span>
            <p>画面をタップして、<br />探し方をえらぶ</p>
          </div>

          {chooserOpen && (
            <div
              aria-label="しおりの探し方"
              aria-modal="true"
              className="search-choice-overlay"
              onClick={() => setChooserOpen(false)}
              role="dialog"
            >
              <div className="search-choice-dialog" onClick={(event) => event.stopPropagation()}>
                <header>
                  <div>
                    <p className="eyebrow">HOW TO FIND</p>
                    <h2>どちらで探す？</h2>
                  </div>
                  <button
                    aria-label="探し方を閉じる"
                    className="choice-close-button"
                    onClick={() => setChooserOpen(false)}
                    type="button"
                  >
                    ×
                  </button>
                </header>
                <div className="search-choice-buttons">
                  <button className="search-choice calendar-choice" onClick={() => chooseSearchMode("calendar")} type="button">
                    <span className="choice-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 3v5M16 3v5M4 10h16M8 14h3M13 14h3" /></svg>
                    </span>
                    <strong>カレンダー</strong>
                  </button>
                  <button className="search-choice person-choice" onClick={() => chooseSearchMode("recipient")} type="button">
                    <span className="choice-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7.5h17v11h-17z" /><path d="m4 8 8 6 8-6" /><path d="m4 18 5.5-5M20 18l-5.5-5" /></svg>
                    </span>
                    <strong>話す相手</strong>
                  </button>
                </div>
                <button className="choice-back-text" onClick={() => setChooserOpen(false)} type="button">
                  とじる
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="screen search-screen">
      <header className="search-heading">
        <button className="portal-back-button" onClick={returnToPortal} type="button">
          <span aria-hidden="true">‹</span> 探し方へ戻る
        </button>
        <p className="eyebrow">{mode === "calendar" ? "BY DATE" : "BY PERSON"}</p>
        <h1>{mode === "calendar" ? "カレンダーから探す" : "話したい相手から探す"}</h1>
        <p>{mode === "calendar" ? "日付を押すと、その日に挟んだしおりが開きます。" : "相手を選ぶと、その人へ残したしおりを新しい順に見られます。"}</p>
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
          話す相手から探す
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
                className={[
                  "day-button",
                  selectedDate === item.iso ? "active" : "",
                  today === item.iso ? "today" : "",
                ].filter(Boolean).join(" ")}
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
            <h2>これまでに入力した相手</h2><span>{recipients.length}人</span>
          </div>
          {recipients.map((item) => (
            <button key={item.name} onClick={() => setSelectedTarget(item.name)} type="button">
              <span className="recipient-initial">{item.name.slice(0, 1)}</span>
              <span><strong>{item.name}</strong><small>最近のしおり　{formatJapaneseDate(item.latest)}</small></span>
              <b>{item.count}件</b>
              <i aria-hidden="true">›</i>
            </button>
          ))}
          {!recipients.length && <p className="empty">まだ話す相手が登録されていません。</p>}
        </section>
      )}

      {(selectedDate || selectedTarget) && (
        <section className="bookmark-results">
          <header className="list-caption">
            <div>
              {selectedTarget && (
                <button className="inline-back" onClick={() => setSelectedTarget("")} type="button">‹ 相手の一覧</button>
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
