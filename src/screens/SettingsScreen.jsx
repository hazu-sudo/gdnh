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

export default function SettingsScreen({
  fontSize,
  onFontSizeChange,
  onReflectionChange,
  onThemeChange,
  showReflection,
  theme,
}) {
  return (
    <main className="screen settings-screen">
      <header className="settings-heading">
        <div className="brand-lockup compact-brand">
          <span className="brand-mark" aria-hidden="true">栞</span>
          <p>{APP_NAME}</p>
        </div>
        <p className="eyebrow">SETTINGS</p>
        <h1>読みやすさを、<br />自分に合わせる。</h1>
        <p>毎日気持ちよく使えるように、文字の大きさを選べます。</p>
      </header>

      <section className="settings-panel">
        <div className="settings-title">
          <span className="settings-icon color-icon" aria-hidden="true">
            <i /><i /><i />
          </span>
          <div>
            <h2>背景とテーマカラー</h2>
            <p>気分になじむ色を選べます</p>
          </div>
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
              <span
                className="theme-swatch"
                style={{ "--swatch-bg": item.colors[0], "--swatch-accent": item.colors[1] }}
                aria-hidden="true"
              >
                <i />
              </span>
              <strong>{item.label}</strong>
              <small aria-hidden="true">{theme === item.id ? "✓" : ""}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="settings-panel">
        <div className="settings-title">
          <span className="settings-icon" aria-hidden="true">あ</span>
          <div>
            <h2>文字の大きさ</h2>
            <p>アプリ全体の文字と余白が変わります</p>
          </div>
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
              <span>{size.sample}</span>
              <strong>{size.label}</strong>
              <small>{size.description}</small>
              <i aria-hidden="true">{fontSize === size.id ? "✓" : ""}</i>
            </button>
          ))}
        </div>
        <div className="font-preview">
          <span className="preview-ribbon" aria-hidden="true" />
          <p>表示の見本</p>
          <strong>田中さんへ</strong>
          <span>今日の授業で面白いことがあった。</span>
        </div>
      </section>

      <section className="settings-panel reflection-setting">
        <div className="settings-title">
          <span className="settings-icon reflection-icon" aria-hidden="true">
            <i /><i /><i />
          </span>
          <div>
            <h2>しおりの振り返りを表示する</h2>
            <p>挟んだしおりと話せたしおりを、棒グラフで振り返ります</p>
          </div>
        </div>
        <button
          aria-checked={showReflection}
          className={showReflection ? "switch-control active" : "switch-control"}
          onClick={() => onReflectionChange(!showReflection)}
          role="switch"
          type="button"
        >
          <span aria-hidden="true"><i /></span>
          <strong>{showReflection ? "ON" : "OFF"}</strong>
        </button>
        <p className="setting-helper">
          OFFにしても、これまでのしおりや状態は消えません。
        </p>
      </section>

      <p className="settings-note">選んだ設定は、この端末に保存されます。</p>
    </main>
  );
}
