import { useEffect, useMemo, useState } from "react";
import { BUILT_IN_HINTS } from "../hints.js";
import { loadHintCache, saveHintCache } from "../storage.js";
import { pickRandom } from "../utils.js";

export default function HintScreen({ onUseHint }) {
  const [hints, setHints] = useState(BUILT_IN_HINTS);
  const [current, setCurrent] = useState(null);
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const cached = loadHintCache([]);
    const builtInById = new Map(BUILT_IN_HINTS.map((hint) => [hint.id, hint]));
    const refreshed = cached.length
      ? cached.map((hint) => ({ ...hint, ...builtInById.get(hint.id) })).filter((hint) => hint.text)
      : BUILT_IN_HINTS;
    const nextHints = refreshed.length ? refreshed : BUILT_IN_HINTS;
    saveHintCache(nextHints);
    setHints(nextHints);
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const categories = useMemo(() => [...new Set(hints.map((hint) => hint.category))], [hints]);

  function drawHint() {
    setCurrent((now) => pickRandom(hints, now?.id));
  }

  return (
    <main className="screen hint-screen">
      <header className="hint-heading">
        <p className="eyebrow">CONVERSATION HINT</p>
        <h1>話のヒントを引く</h1>
        <p>話題に迷ったときだけ、短いきっかけを一枚。</p>
      </header>

      {!current ? (
        <section className="hint-draw-stage">
          <div className="omikuji-box" aria-hidden="true">
            <span className="omikuji-slip" />
            <i />
            <i />
            <i />
          </div>
          <p>{categories.slice(0, 5).join("・")}などから、ひとつ選びます。</p>
          <button className="primary-button hint-draw-button" disabled={!hints.length} onClick={drawHint} type="button">
            話のヒントを引く
          </button>
          {!hints.length && offline && (
            <p className="offline-note">新しいヒントを受け取るには、インターネットに接続してください</p>
          )}
        </section>
      ) : (
        <section className="hint-result">
          <div className="hint-paper" key={current.id}>
            <span className="hint-category">{current.category}</span>
            <span className="hint-paper-ribbon" aria-hidden="true" />
            <div className="hint-content-block">
              <small>雑学</small>
              <p className="hint-text">{current.text}</p>
            </div>
            {current.question && (
              <div className="hint-content-block conversation-line">
                <small>会話につなげる一言</small>
                <p className="hint-question">{current.question}</p>
              </div>
            )}
            <footer>
              <span>出典：{current.source}</span>
              <span>{current.checkedAt}確認</span>
              <a href={current.url} rel="noreferrer" target="_blank">詳しく見る ↗</a>
            </footer>
          </div>
          <p className="hint-source-note">信頼できる情報源をもとに、会話向けに短く要約しています。</p>
          {offline && <p className="offline-note">保存済みのヒントを表示しています。</p>}
          <div className="hint-actions">
            <button className="secondary-button" onClick={drawHint} type="button">もう一度引く</button>
            <button className="primary-button hint-talk-button" onClick={() => onUseHint(current.memo || current.question)} type="button">
              話す
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
