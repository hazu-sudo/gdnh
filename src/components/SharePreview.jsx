import { useEffect, useMemo, useState } from "react";
import { formatJapaneseDate } from "./BookmarkCard.jsx";
import AttachmentEditor from "./AttachmentEditor.jsx";
import { getAttachment } from "../attachmentStore.js";
import {
  DECORATION_OPTIONS,
  DEFAULT_CUSTOM_THEME,
  loadCustomThemes,
  POSITION_OPTIONS,
  saveCustomTheme,
  SHARE_THEMES,
} from "../shareThemes.js";

const DECORATION_MARKS = {
  none: "",
  flower: "✿",
  star: "✦",
  heart: "♡",
  bookmark: "▮",
  envelope: "✉",
  ribbon: "◇",
  snow: "❄",
  leaf: "◒",
  pumpkin: "○",
  gift: "□",
  cake: "▱",
};

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

function hexToRgba(hex, alpha) {
  const value = String(hex || "#000000").replace("#", "");
  const expanded = value.length === 3 ? [...value].map((part) => part + part).join("") : value;
  const number = Number.parseInt(expanded, 16);
  return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
}

function decorationAnchors(position) {
  if (position === "top") return [[155, 145], [260, 122], [365, 150]];
  if (position === "bottom") return [[690, 1160], [800, 1132], [900, 1160]];
  if (position === "top-left") return [[150, 150], [228, 120]];
  return [[145, 150], [930, 150], [145, 1180], [930, 1180]];
}

function drawDecoration(context, type, x, y, color, scale = 1) {
  if (type === "none") return;
  context.save();
  context.translate(x, y);
  context.strokeStyle = color;
  context.fillStyle = hexToRgba(color, 0.2);
  context.lineWidth = 7 * scale;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (type === "flower") {
    for (let index = 0; index < 5; index += 1) {
      const angle = (Math.PI * 2 * index) / 5;
      context.beginPath();
      context.arc(Math.cos(angle) * 22 * scale, Math.sin(angle) * 22 * scale, 15 * scale, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }
    context.beginPath();
    context.arc(0, 0, 9 * scale, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
  } else if (type === "heart") {
    context.beginPath();
    context.moveTo(0, 30 * scale);
    context.bezierCurveTo(-55 * scale, 0, -32 * scale, -40 * scale, 0, -12 * scale);
    context.bezierCurveTo(32 * scale, -40 * scale, 55 * scale, 0, 0, 30 * scale);
    context.fill();
    context.stroke();
  } else if (type === "star" || type === "snow") {
    const points = type === "star" ? 5 : 8;
    context.beginPath();
    for (let index = 0; index < points * 2; index += 1) {
      const radius = (index % 2 ? 13 : 37) * scale;
      const angle = -Math.PI / 2 + (Math.PI * index) / points;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.closePath();
    context.fill();
    context.stroke();
  } else if (type === "leaf") {
    context.rotate(-0.55);
    context.beginPath();
    context.ellipse(0, 0, 38 * scale, 18 * scale, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-30 * scale, 0);
    context.lineTo(34 * scale, 0);
    context.stroke();
  } else if (type === "envelope") {
    context.strokeRect(-38 * scale, -25 * scale, 76 * scale, 52 * scale);
    context.beginPath();
    context.moveTo(-38 * scale, -25 * scale);
    context.lineTo(0, 5 * scale);
    context.lineTo(38 * scale, -25 * scale);
    context.stroke();
  } else if (type === "gift") {
    context.fillRect(-34 * scale, -23 * scale, 68 * scale, 55 * scale);
    context.strokeRect(-34 * scale, -23 * scale, 68 * scale, 55 * scale);
    context.beginPath();
    context.moveTo(0, -23 * scale);
    context.lineTo(0, 32 * scale);
    context.moveTo(-38 * scale, -23 * scale);
    context.lineTo(38 * scale, -23 * scale);
    context.stroke();
  } else if (type === "cake") {
    context.fillRect(-38 * scale, -3 * scale, 76 * scale, 35 * scale);
    context.strokeRect(-38 * scale, -3 * scale, 76 * scale, 35 * scale);
    context.beginPath();
    context.moveTo(0, -5 * scale);
    context.lineTo(0, -34 * scale);
    context.stroke();
    context.beginPath();
    context.arc(0, -41 * scale, 6 * scale, 0, Math.PI * 2);
    context.fill();
  } else if (type === "pumpkin") {
    [-17, 0, 17].forEach((offset) => {
      context.beginPath();
      context.ellipse(offset * scale, 0, 23 * scale, 32 * scale, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });
  } else if (type === "bookmark") {
    context.beginPath();
    context.moveTo(-22 * scale, -38 * scale);
    context.lineTo(22 * scale, -38 * scale);
    context.lineTo(22 * scale, 36 * scale);
    context.lineTo(0, 22 * scale);
    context.lineTo(-22 * scale, 36 * scale);
    context.closePath();
    context.fill();
    context.stroke();
  } else {
    context.beginPath();
    context.ellipse(-18 * scale, 0, 22 * scale, 14 * scale, -0.45, 0, Math.PI * 2);
    context.ellipse(18 * scale, 0, 22 * scale, 14 * scale, 0.45, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  context.restore();
}

function renderCard({ createdAt, memo, senderName, showDear, showFrom, targetName, theme }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");

  context.fillStyle = theme.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = theme.paper;
  context.beginPath();
  context.roundRect(72, 72, 936, 1206, 42);
  context.fill();
  if (theme.frame) {
    context.strokeStyle = hexToRgba(theme.accent, 0.55);
    context.lineWidth = 5;
    context.stroke();
  }

  decorationAnchors(theme.position).forEach(([x, y], index) => {
    drawDecoration(context, theme.decoration, x, y, theme.accent, index % 2 ? 0.72 : 0.9);
  });

  context.fillStyle = theme.bookmarkColor;
  context.beginPath();
  context.moveTo(850, 72);
  context.lineTo(950, 72);
  context.lineTo(950, 238);
  context.lineTo(900, 208);
  context.lineTo(850, 238);
  context.closePath();
  context.fill();

  context.textBaseline = "top";
  let y = 225;
  if (showDear) {
    context.fillStyle = theme.accent;
    context.font = theme.dearStyle === "minimal"
      ? '500 31px "Noto Sans JP", sans-serif'
      : '600 38px "Noto Sans JP", sans-serif';
    context.fillText(`Dear ${targetName || "あなたへ"}`, 150, y);
    y += 115;
  }

  context.fillStyle = theme.ink;
  context.font = '500 48px "Noto Sans JP", sans-serif';
  const lines = wrapCanvasText(context, memo, 760);
  lines.forEach((line) => {
    context.fillText(line, 150, y);
    y += 78;
  });

  context.fillStyle = hexToRgba(theme.accent, 0.45);
  context.fillRect(150, 1050, 760, 2);
  context.fillStyle = theme.muted;
  context.font = '500 32px "Noto Sans JP", sans-serif';
  context.fillText(formatJapaneseDate(createdAt), 150, 1100);
  if (showFrom) {
    context.textAlign = "right";
    context.fillStyle = theme.accent;
    context.fillText(`From ${senderName || "名前なし"}`, 910, 1160);
  }

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

function themeStyle(theme) {
  return {
    "--share-bg": theme.background,
    "--share-paper": theme.paper,
    "--share-accent": theme.accent,
    "--share-ink": theme.ink,
    "--share-muted": theme.muted,
    "--share-bookmark": theme.bookmarkColor,
  };
}

function ThemeDecoration({ theme }) {
  if (theme.decoration === "none") return null;
  return (
    <div className={`share-decoration decor-${theme.position}`} aria-hidden="true">
      {[0, 1, 2, 3].map((item) => <span key={item}>{DECORATION_MARKS[theme.decoration]}</span>)}
    </div>
  );
}

export default function SharePreview({ bookmark, defaultSenderName, onClose }) {
  const [targetName, setTargetName] = useState(bookmark.targetName);
  const [memo, setMemo] = useState(bookmark.memo);
  const [senderName, setSenderName] = useState(defaultSenderName);
  const [showDear, setShowDear] = useState(true);
  const [showFrom, setShowFrom] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [includeAttachment, setIncludeAttachment] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("simple");
  const [customThemes, setCustomThemes] = useState(loadCustomThemes);
  const [customDraft, setCustomDraft] = useState(DEFAULT_CUSTOM_THEME);
  const [customName, setCustomName] = useState("");

  const availableThemes = useMemo(() => [...SHARE_THEMES, ...customThemes], [customThemes]);
  const activeTheme = selectedThemeId === "custom"
    ? customDraft
    : availableThemes.find((theme) => theme.id === selectedThemeId) || SHARE_THEMES[0];

  useEffect(() => {
    let active = true;
    getAttachment(bookmark.attachmentId)
      .then((item) => { if (active) setAttachment(item); })
      .catch(() => {});
    return () => { active = false; };
  }, [bookmark.attachmentId]);

  function updateCustomTheme(key, value) {
    setCustomDraft((current) => ({ ...current, [key]: value }));
  }

  function storeCustomTheme() {
    const { saved, themes } = saveCustomTheme({
      ...customDraft,
      label: customName.trim() || `マイ背景${customThemes.length + 1}`,
    });
    setCustomThemes(themes);
    setSelectedThemeId(saved.id);
    setCustomName("");
    setMessage(`「${saved.label}」を保存しました`);
  }

  async function shareCard() {
    const blob = await renderCard({
      createdAt: bookmark.createdAt,
      memo,
      senderName,
      showDear,
      showFrom,
      targetName,
      theme: activeTheme,
    });
    if (!blob) return;
    const cardFile = new File([blob], "ato-de-hiraku-shiori.png", { type: "image/png" });
    const files = [cardFile];
    if (includeAttachment && attachment?.blob) {
      files.push(new File([attachment.blob], attachment.name, { type: attachment.type }));
    }

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files }))) {
        await navigator.share({ files, title: "あとで開くしおり" });
        setMessage("共有メニューを開きました");
        return;
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = cardFile.name;
    anchor.click();
    URL.revokeObjectURL(url);
    if (includeAttachment && attachment?.blob) {
      const attachmentUrl = URL.createObjectURL(attachment.blob);
      const attachmentAnchor = document.createElement("a");
      attachmentAnchor.href = attachmentUrl;
      attachmentAnchor.download = attachment.name;
      attachmentAnchor.click();
      URL.revokeObjectURL(attachmentUrl);
    }
    setMessage("共有カードを画像として保存しました");
  }

  return (
    <main className="screen share-screen">
      <header className="detail-header">
        <button className="back-button" onClick={onClose} type="button" aria-label="共有をキャンセル">‹</button>
        <p>共有前の確認</p>
        <span className="header-spacer" />
      </header>

      <section
        className={`share-card-preview share-theme-card dear-${activeTheme.dearStyle} ${activeTheme.frame ? "has-share-frame" : ""}`}
        style={themeStyle(activeTheme)}
      >
        <ThemeDecoration theme={activeTheme} />
        <span className="share-card-ribbon" aria-hidden="true" />
        {showDear && <p className="share-dear">Dear {targetName || "あなたへ"}</p>}
        <p className={memo ? "share-message" : "share-message empty-value"}>{memo || "メモなし"}</p>
        <footer>
          <time>{formatJapaneseDate(bookmark.createdAt)}</time>
          {showFrom && <p>From {senderName || "名前なし"}</p>}
        </footer>
      </section>

      <section className="share-background-picker">
        <div className="section-title-row">
          <div>
            <p className="section-kicker">MESSAGE CARD</p>
            <h2>背景を選ぶ</h2>
          </div>
        </div>
        <div className="share-theme-grid" aria-label="共有カードの背景">
          {availableThemes.map((theme) => (
            <button
              aria-pressed={selectedThemeId === theme.id}
              className="share-theme-option"
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              style={themeStyle(theme)}
              type="button"
            >
              <span className="theme-mini-preview">
                <span className="theme-mini-mark" />
                <span>{DECORATION_MARKS[theme.decoration]}</span>
              </span>
              <strong>{theme.label}</strong>
            </button>
          ))}
          <button
            aria-pressed={selectedThemeId === "custom"}
            className="share-theme-option custom-theme-option"
            onClick={() => setSelectedThemeId("custom")}
            style={themeStyle(customDraft)}
            type="button"
          >
            <span className="theme-mini-preview"><span className="custom-plus">＋</span></span>
            <strong>自分で作る</strong>
          </button>
        </div>

        {selectedThemeId === "custom" && (
          <div className="custom-background-builder">
            <label className="simple-field">
              <span>背景の名前</span>
              <input
                maxLength="18"
                onChange={(event) => setCustomName(event.target.value)}
                placeholder={`マイ背景${customThemes.length + 1}`}
                value={customName}
              />
            </label>
            <div className="custom-color-row">
              <label><span>背景色</span><input type="color" value={customDraft.background} onChange={(event) => updateCustomTheme("background", event.target.value)} /></label>
              <label><span>アクセント色</span><input type="color" value={customDraft.accent} onChange={(event) => updateCustomTheme("accent", event.target.value)} /></label>
              <label><span>しおりの色</span><input type="color" value={customDraft.bookmarkColor} onChange={(event) => updateCustomTheme("bookmarkColor", event.target.value)} /></label>
            </div>
            <div className="custom-select-grid">
              <label>
                <span>飾り</span>
                <select value={customDraft.decoration} onChange={(event) => updateCustomTheme("decoration", event.target.value)}>
                  {DECORATION_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label>
                <span>飾りの位置</span>
                <select value={customDraft.position} onChange={(event) => updateCustomTheme("position", event.target.value)}>
                  {POSITION_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label>
                <span>Dear / From</span>
                <select value={customDraft.dearStyle} onChange={(event) => updateCustomTheme("dearStyle", event.target.value)}>
                  <option value="standard">しっかり</option>
                  <option value="soft">やわらかく</option>
                  <option value="minimal">ひかえめ</option>
                </select>
              </label>
            </div>
            <label className="custom-frame-toggle">
              <input checked={customDraft.frame} onChange={(event) => updateCustomTheme("frame", event.target.checked)} type="checkbox" />
              フレームを付ける
            </label>
            <button className="save-custom-theme-button" onClick={storeCustomTheme} type="button">
              この背景を保存
            </button>
          </div>
        )}
      </section>

      <section className="share-editor">
        <label className="simple-field">
          <span>宛先</span>
          <input onChange={(event) => setTargetName(event.target.value)} value={targetName} />
        </label>
        <label className="simple-field">
          <span>文面</span>
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
        {attachment && (
          <div className="share-attachment-option">
            <AttachmentEditor attachment={attachment} readOnly />
            <label>
              <input checked={includeAttachment} onChange={(event) => setIncludeAttachment(event.target.checked)} type="checkbox" />
              この写真・資料も共有する
            </label>
            <small>選択した場合だけ、共有先へ添付します。</small>
          </div>
        )}
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
