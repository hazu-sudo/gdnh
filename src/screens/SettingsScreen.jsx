import { useState } from "react";
import { APP_NAME } from "../data.js";

const sizes = [
  { id: "small", label: "小", sample: "Aa", description: "コンパクト" },
  { id: "standard", label: "標準", sample: "Aa", description: "おすすめ" },
  { id: "large", label: "大", sample: "Aa", description: "ゆったり" },
];

const themes = [
  { id: "orange", label: "オレンジ", colors: ["#fff8ec", "#e47f65"] },
  { id: "pink", label: "ピンク", colors: ["#fff5f6", "#d9778d"] },
  { id: "blue", label: "ブルー", colors: ["#f3f8fa", "#628da5"] },
  { id: "green", label: "グリーン", colors: ["#f4f9f4", "#669277"] },
  { id: "purple", label: "パープル", colors: ["#f8f5fa", "#8d78a5"] },
  { id: "mono", label: "白黒", colors: ["#f7f7f5", "#565656"] },
];

function ToggleSetting({ checked, description, label, onChange }) {
  return (
    <div className="toggle-setting">
      <div>
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <button
        aria-checked={checked}
        className={checked ? "switch-control active" : "switch-control"}
        onClick={() => onChange(!checked)}
        role="switch"
        type="button"
      >
        <span aria-hidden="true"><i /></span>
        <strong>{checked ? "ON" : "OFF"}</strong>
      </button>
    </div>
  );
}

export default function SettingsScreen({
  fontSize,
  hintIntroSeen,
  onFontSizeChange,
  onHintIntroSeen,
  onHintVisibilityChange,
  onReflectionChange,
  onSenderNameChange,
  onThemeChange,
  senderName,
  showHints,
  showReflection,
  theme,
}) {
  const [showHintDialog, setShowHintDialog] = useState(false);

  function requestHintChange(next) {
    if (next && !hintIntroSeen) {
      setShowHintDialog(true);
      return;
    }
    onHintVisibilityChange(next);
  }

  function decideHints(show) {
    onHintIntroSeen();
    onHintVisibilityChange(show);
    setShowHintDialog(false);
  }

  return (
    <main className="screen settings-screen">
      <header className="settings-heading">
        <div className="brand-lockup compact-brand">
          <span className="brand-mark blank-mark" aria-hidden="true" />
          <p>{APP_NAME}</p>
        </div>
        <p className="eyebrow">SETTINGS</p>
        <h1>使い心地を、<br />自分に合わせる。</h1>
        <p>毎日気持ちよく使えるように、自分の好みに設定できます。</p>
      </header>

      <section className="settings-group">
        <header><span>01</span><h2>文字と表示</h2></header>
        <div className="settings-panel">
          <div className="settings-title">
            <span className="settings-icon color-icon" aria-hidden="true"><i /><i /><i /></span>
            <div><h3>背景とテーマカラー</h3><p>気分になじむ色を選べます</p></div>
          </div>
          <div className="theme-options" role="radiogroup" aria-label="背景とテーマカラー">
            {themes.map((item) => (
              <button
                aria-checked={theme === item.id}
                className={theme === item.id ? "theme-option active" : "theme-option"}
                key={item.id}
                onClick={() => onThemeChange(item.id)}
                role="radio"
                type="button"
              >
                <span className="theme-swatch" style={{ "--swatch-bg": item.colors[0], "--swatch-accent": item.colors[1] }} aria-hidden="true"><i /></span>
                <strong>{item.label}</strong>
                <small aria-hidden="true">{theme === item.id ? "✓" : ""}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-panel">
          <div className="settings-title">
            <span className="settings-icon" aria-hidden="true">あ</span>
            <div><h3>文字の大きさ</h3><p>アプリ全体の文字と余白が変わります</p></div>
          </div>
          <div className="font-size-options" role="radiogroup" aria-label="文字の大きさ">
            {sizes.map((size) => (
              <button
                aria-checked={fontSize === size.id}
                className={fontSize === size.id ? `font-option ${size.id} active` : `font-option ${size.id}`}
                key={size.id}
                onClick={() => onFontSizeChange(size.id)}
                role="radio"
                type="button"
              >
                <span>{size.sample}</span><strong>{size.label}</strong><small>{size.description}</small>
                <i aria-hidden="true">{fontSize === size.id ? "✓" : ""}</i>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-group">
        <header><span>02</span><h2>表示する機能</h2></header>
        <div className="feature-setting-list">
          <ToggleSetting
            checked={showHints}
            description="話題に迷ったとき、会話につながるヒントを引けます"
            label="会話のヒント"
            onChange={requestHintChange}
          />
          <ToggleSetting
            checked={showReflection}
            description="登録したしおりと、話したしおりを週ごと・月ごとに振り返ります"
            label="しおりの振り返り"
            onChange={onReflectionChange}
          />
        </div>
        <p className="feature-setting-helper">OFFにしても、これまでのしおりや設定は消えません。</p>
      </section>

      <section className="settings-group">
        <header><span>03</span><h2>共有設定</h2></header>
        <div className="settings-panel">
          <label className="simple-field">
            <span>共有時の差出人名</span>
            <input
              onChange={(event) => onSenderNameChange(event.target.value)}
              placeholder="例：はるき"
              value={senderName}
            />
          </label>
          <p className="setting-helper">共有プレビューで、毎回変更することもできます。</p>
        </div>
      </section>

      <p className="settings-note">選んだ設定は、この端末に保存されます。</p>

      {showHintDialog && (
        <div className="modal-backdrop">
          <section aria-modal="true" className="confirm-dialog" role="dialog">
            <span className="dialog-bookmark" aria-hidden="true" />
            <h2>会話のヒント</h2>
            <p>会話に迷ったとき、ランダムな話のヒントを使えます。表示しますか？</p>
            <div>
              <button className="secondary-button" onClick={() => decideHints(false)} type="button">今は表示しない</button>
              <button className="primary-button" onClick={() => decideHints(true)} type="button">表示する</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
