import { useState } from "react";
import { formatJapaneseDate } from "./BookmarkCard.jsx";

function wrapCanvasText(context, text, maxWidth) {
  const lines = [];
  String(text || "メモなし").split(/\r?\n/).forEach((paragraph) => {
    let line = "";
    [...paragraph].forEach((character) => {
      const next = line + character;
      if (context.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = character;
      } else {
        line = next;
      }
    });
    lines.push(line || " ");
  });
  return lines.slice(0, 10);
}

function renderCard({ createdAt, memo, senderName, showDear, showFrom, targetName }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");

  context.fillStyle = "#f4e7d3";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fffaf1";
  context.beginPath();
  context.roundRect(72, 72, 936, 1206, 42);
  context.fill();

  context.fillStyle = "#d97d65";
  context.beginPath();
  context.moveTo(850, 72);
  context.lineTo(950, 72);
  context.lineTo(950, 238);
  context.lineTo(900, 208);
  context.lineTo(850, 238);
  context.closePath();
  context.fill();

  context.fillStyle = "#6e554b";
  context.textBaseline = "top";
  context.font = '600 38px "Noto Sans JP", sans-serif';
  let y = 170;
  if (showDear) {
    context.fillText(`Dear ${targetName || "あなたへ"}`, 150, y);
    y += 120;
  }

  context.fillStyle = "#3f342f";
  context.font = '500 48px "Noto Sans JP", sans-serif';
  const lines = wrapCanvasText(context, memo, 760);
  lines.forEach((line) => {
    context.fillText(line, 150, y);
    y += 78;
  });

  context.fillStyle = "#9d8a7d";
  context.fillRect(150, 1050, 760, 2);
  context.font = '500 32px "Noto Sans JP", sans-serif';
  context.fillText(formatJapaneseDate(createdAt), 150, 1100);
  if (showFrom) {
    context.textAlign = "right";
    context.fillStyle = "#6e554b";
    context.fillText(`From ${senderName || "名前なし"}`, 910, 1160);
  }

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export default function SharePreview({ bookmark, defaultSenderName, onClose }) {
  const [targetName, setTargetName] = useState(bookmark.targetName);
  const [memo, setMemo] = useState(bookmark.memo);
  const [senderName, setSenderName] = useState(defaultSenderName);
  const [showDear, setShowDear] = useState(true);
  const [showFrom, setShowFrom] = useState(true);
  const [message, setMessage] = useState("");

  async function shareCard() {
    const blob = await renderCard({
      createdAt: bookmark.createdAt,
      memo,
      senderName,
      showDear,
      showFrom,
      targetName,
    });
    if (!blob) return;
    const file = new File([blob], "ato-de-hiraku-shiori.png", { type: "image/png" });

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ files: [file], title: "あとで開くしおり" });
        setMessage("共有メニューを開きました");
        return;
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("画像として保存しました");
  }

  return (
    <main className="screen share-screen">
      <header className="detail-header">
        <button className="back-button" onClick={onClose} type="button" aria-label="共有をキャンセル">‹</button>
        <p>共有前の確認</p>
        <span className="header-spacer" />
      </header>

      <section className="share-card-preview">
        <span className="share-card-ribbon" aria-hidden="true" />
        {showDear && <p className="share-dear">Dear {targetName || "あなたへ"}</p>}
        <p className={memo ? "share-message" : "share-message empty-value"}>{memo || "メモなし"}</p>
        <footer>
          <time>{formatJapaneseDate(bookmark.createdAt)}</time>
          {showFrom && <p>From {senderName || "名前なし"}</p>}
        </footer>
      </section>

      <section className="share-editor">
        <label className="simple-field">
          <span>宛先</span>
          <input onChange={(event) => setTargetName(event.target.value)} value={targetName} />
        </label>
        <label className="simple-field">
          <span>文章</span>
          <textarea maxLength="180" onChange={(event) => setMemo(event.target.value)} rows="4" value={memo} />
        </label>
        <label className="simple-field">
          <span>差出人名</span>
          <input onChange={(event) => setSenderName(event.target.value)} value={senderName} />
        </label>
        <div className="share-display-options">
          <label><input checked={showDear} onChange={(event) => setShowDear(event.target.checked)} type="checkbox" />Dearを表示</label>
          <label><input checked={showFrom} onChange={(event) => setShowFrom(event.target.checked)} type="checkbox" />Fromを表示</label>
        </div>
      </section>

      {message && <p className="share-message-note" aria-live="polite">{message}</p>}
      <div className="share-actions">
        <button className="secondary-button" onClick={onClose} type="button">キャンセル</button>
        <button className="primary-button" onClick={shareCard} type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M8 8l4-4 4 4M5 12v7h14v-7" /></svg>
          端末で共有
        </button>
      </div>
    </main>
  );
}
