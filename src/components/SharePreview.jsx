import { useEffect, useMemo, useState } from "react";
import { formatJapaneseDate } from "./BookmarkCard.jsx";
import AttachmentEditor from "./AttachmentEditor.jsx";
import { drawThemeMotifLayer, ThemeMotifLayer } from "./ThemeMotifs.jsx";
import { getAttachment } from "../attachmentStore.js";
import {
  applyAppTheme,
  applyCelebrationColor,
  CELEBRATION_COLORS,
  DECORATION_OPTIONS,
  DEFAULT_CUSTOM_THEME,
  loadCustomThemes,
  POSITION_OPTIONS,
  saveCustomTheme,
  SHARE_THEMES,
} from "../shareThemes.js";

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

function loadCanvasImage(blob) {
  if (!blob) return Promise.resolve(null);
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    image.src = url;
  });
}

async function renderCard({
  attachment,
  createdAt,
  includeAttachment,
  memo,
  senderName,
  showDear,
  showFrom,
  targetName,
  theme,
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");

  context.fillStyle = theme.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = theme.paper;
  context.beginPath();
  context.roundRect(92, 96, 896, 1158, 36);
  context.fill();
  if (theme.frame) {
    context.strokeStyle = hexToRgba(theme.accent, 0.55);
    context.lineWidth = 5;
    context.stroke();
  }

  drawThemeMotifLayer(context, theme);

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
  if (theme.wordmark) {
    context.fillStyle = hexToRgba(theme.accent, 0.72);
    context.font = 'italic 600 48px "Segoe Script", "Brush Script MT", cursive';
    context.textAlign = "right";
    context.fillText(theme.wordmark, 815, 132);
    context.textAlign = "left";
  }
  let y = 205;
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
  const imageAttachment = includeAttachment && attachment?.type?.startsWith("image/")
    ? await loadCanvasImage(attachment.blob)
    : null;
  const lines = wrapCanvasText(context, memo, 760).slice(0, imageAttachment ? 5 : 10);
  lines.forEach((line) => {
    context.fillText(line, 150, y);
    y += 78;
  });

  if (imageAttachment) {
    const maxWidth = 760;
    const maxHeight = Math.max(210, Math.min(330, 1020 - y));
    const scale = Math.min(maxWidth / imageAttachment.width, maxHeight / imageAttachment.height);
    const drawWidth = imageAttachment.width * scale;
    const drawHeight = imageAttachment.height * scale;
    const drawX = 150 + (maxWidth - drawWidth) / 2;
    const drawY = y + 24;
    context.fillStyle = theme.background;
    context.beginPath();
    context.roundRect(drawX - 12, drawY - 12, drawWidth + 24, drawHeight + 24, 22);
    context.fill();
    context.save();
    context.beginPath();
    context.roundRect(drawX, drawY, drawWidth, drawHeight, 14);
    context.clip();
    context.drawImage(imageAttachment, drawX, drawY, drawWidth, drawHeight);
    context.restore();
  }

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

export default function SharePreview({ appTheme, bookmark, defaultSenderName, onClose }) {
  const [targetName, setTargetName] = useState(bookmark.targetName);
  const [memo, setMemo] = useState(bookmark.memo);
  const [senderName, setSenderName] = useState(defaultSenderName);
  const [showDear, setShowDear] = useState(true);
  const [showFrom, setShowFrom] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState("");
  const [includeAttachment, setIncludeAttachment] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState("simple");
  const [customThemes, setCustomThemes] = useState(loadCustomThemes);
  const [customDraft, setCustomDraft] = useState(DEFAULT_CUSTOM_THEME);
  const [customName, setCustomName] = useState("");
  const [eventColors, setEventColors] = useState({
    birthday: "red",
    celebration: "orange",
  });

  const availableThemes = useMemo(
    () => SHARE_THEMES.map((theme) => applyAppTheme(theme, appTheme)),
    [appTheme],
  );
  const activeTheme = selectedThemeId === "custom"
    ? customDraft
    : (() => {
      const selected = availableThemes.find((theme) => theme.id === selectedThemeId)
        || customThemes.find((theme) => theme.id === selectedThemeId)
        || availableThemes[0];
      return selected.id === "birthday" || selected.id === "celebration"
        ? applyCelebrationColor(selected, eventColors[selected.id])
        : selected;
    })();

  useEffect(() => {
    let active = true;
    getAttachment(bookmark.attachmentId)
      .then((item) => { if (active) setAttachment(item); })
      .catch(() => {});
    return () => { active = false; };
  }, [bookmark.attachmentId]);

  useEffect(() => {
    if (!attachment?.blob || !attachment.type?.startsWith("image/")) {
      setAttachmentPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(attachment.blob);
    setAttachmentPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [attachment]);

  function updateCustomTheme(key, value) {
    setCustomDraft((current) => ({ ...current, [key]: value }));
  }

  function updateEventColor(colorId) {
    setEventColors((current) => ({ ...current, [selectedThemeId]: colorId }));
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
      attachment,
      createdAt: bookmark.createdAt,
      includeAttachment,
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
    if (includeAttachment && attachment?.blob && !attachment.type?.startsWith("image/")) {
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
    if (includeAttachment && attachment?.blob && !attachment.type?.startsWith("image/")) {
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
        className={`share-card-preview share-theme-card theme-${activeTheme.id} dear-${activeTheme.dearStyle} ${activeTheme.frame ? "has-share-frame" : ""}`}
        style={themeStyle(activeTheme)}
      >
        <ThemeMotifLayer key={activeTheme.id} theme={activeTheme} />
        <span className="share-card-ribbon" aria-hidden="true" />
        <div className="share-card-content">
          {activeTheme.wordmark && <p className="share-theme-wordmark">{activeTheme.wordmark}</p>}
          {showDear && <p className="share-dear">Dear {targetName || "あなたへ"}</p>}
          <p className={memo ? "share-message" : "share-message empty-value"}>{memo || "メモなし"}</p>
          {includeAttachment && attachmentPreviewUrl && (
            <figure className="share-card-photo">
              <img alt="" src={attachmentPreviewUrl} />
            </figure>
          )}
          <footer>
            <time>{formatJapaneseDate(bookmark.createdAt)}</time>
            {showFrom && <p>From {senderName || "名前なし"}</p>}
          </footer>
        </div>
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
              className={`share-theme-option theme-${theme.id}`}
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              style={themeStyle(theme)}
              type="button"
            >
              <span className="theme-mini-preview">
                <span className="theme-mini-mark" />
                <ThemeMotifLayer compact theme={theme} />
              </span>
              <strong>{theme.label}</strong>
              <span className="theme-selected-mark" aria-hidden="true">✓</span>
            </button>
          ))}
          <button
            aria-pressed={selectedThemeId === "custom"}
            className="share-theme-option custom-theme-option theme-custom"
            onClick={() => setSelectedThemeId("custom")}
            style={themeStyle(customDraft)}
            type="button"
          >
            <span className="theme-mini-preview"><span className="custom-plus">＋</span></span>
            <strong>自分で作る</strong>
            <span className="theme-selected-mark" aria-hidden="true">✓</span>
          </button>
        </div>

        {(selectedThemeId === "birthday" || selectedThemeId === "celebration") && (
          <div className="event-color-picker">
            <strong>背景・アクセントの色</strong>
            <div aria-label={`${activeTheme.label}の色`} role="group">
              {CELEBRATION_COLORS.map((color) => (
                <button
                  aria-label={color.label}
                  aria-pressed={eventColors[selectedThemeId] === color.id}
                  key={color.id}
                  onClick={() => updateEventColor(color.id)}
                  style={{ "--swatch-color": color.accent }}
                  title={color.label}
                  type="button"
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}

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
              <label><span>日付の色</span><input type="color" value={customDraft.muted} onChange={(event) => updateCustomTheme("muted", event.target.value)} /></label>
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

        {customThemes.length > 0 && (
          <div className="saved-theme-picker">
            <strong>保存した背景</strong>
            <div>
              {customThemes.map((theme) => (
                <button
                  aria-pressed={selectedThemeId === theme.id}
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  style={themeStyle(theme)}
                  type="button"
                >
                  <span className="saved-theme-color" />
                  {theme.label}
                </button>
              ))}
            </div>
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
              {attachment.type?.startsWith("image/") ? "写真をカードに含める" : "この資料も共有する"}
            </label>
            <small>
              {attachment.type?.startsWith("image/")
                ? "写真の周囲に選んだテーマを残して、カード画像に入れます。"
                : "選択した場合だけ、共有先へ添付します。"}
            </small>
          </div>
        )}
      </section>

      {message && <p className="share-message-note" aria-live="polite">{message}</p>}
      <div className="share-actions">
        <button className="secondary-button" onClick={onClose} type="button">キャンセル</button>
        <button className="primary-button" onClick={shareCard} type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M8 8l4-4 4 4M5 12v7h14v-7" /></svg>
          共有する
        </button>
      </div>
    </main>
  );
}
