import { useEffect, useMemo, useState } from "react";
import { BUILT_IN_HINTS, CONVERSATION_RELATIONS, RELATION_HINTS } from "../hints.js";
import { loadHintCache, saveHintCache } from "../storage.js";

function chooseUnseen(items, seenIds) {
  if (!items.length) return null;
  const unseen = items.filter((item) => !seenIds.includes(item.id));
  const choices = unseen.length ? unseen : items;
  return choices[Math.floor(Math.random() * choices.length)];
}

function previewMemo(text) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  return value.length > 24 ? `${value.slice(0, 24)}…` : value;
}

export default function HintScreen({ bookmarks = [], onUseHint }) {
  const [triviaHints, setTriviaHints] = useState(BUILT_IN_HINTS);
  const [selectedRelation, setSelectedRelation] = useState("");
  const [current, setCurrent] = useState(null);
  const [seenByRelation, setSeenByRelation] = useState({});
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const cached = loadHintCache([]);
    const builtInById = new Map(BUILT_IN_HINTS.map((hint) => [hint.id, hint]));
    const refreshed = cached.length
      ? cached.map((hint) => ({ ...hint, ...builtInById.get(hint.id) })).filter((hint) => hint.text)
      : BUILT_IN_HINTS;
    const nextHints = refreshed.length ? refreshed : BUILT_IN_HINTS;
    saveHintCache(nextHints);
    setTriviaHints(nextHints);
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  const recentPeople = useMemo(() => {
    const byName = new Map();
    [...bookmarks]
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .forEach((bookmark) => {
        if (bookmark.targetName && bookmark.memo && !byName.has(bookmark.targetName)) {
          byName.set(bookmark.targetName, bookmark);
        }
      });
    return [...byName.values()].slice(0, 5);
  }, [bookmarks]);

  const relation = CONVERSATION_RELATIONS.find((item) => item.id === selectedRelation);
  const isTrivia = selectedRelation === "trivia";

  function drawFromRelation(relationId) {
    const items = relationId === "trivia" ? triviaHints : RELATION_HINTS[relationId] || [];
    const seen = seenByRelation[relationId] || [];
    const next = chooseUnseen(items, seen);
    if (!next) return;
    setSeenByRelation((now) => ({
      ...now,
      [relationId]: seen.length >= items.length - 1 ? [next.id] : [...seen, next.id],
    }));
    setCurrent(next);
  }

  function selectRelation(relationId) {
    setSelectedRelation(relationId);
    setCurrent(null);
    window.requestAnimationFrame(() => drawFromRelation(relationId));
  }

  function returnToRelations() {
    setSelectedRelation("");
    setCurrent(null);
  }

  function usePastBookmark(bookmark) {
    const subject = previewMemo(bookmark.memo);
    setCurrent({
      id: `past-${bookmark.id}`,
      prompt: `前に話していた「${subject}」、その後どうなった？`,
      followUp: "最近はどんな感じ？",
      opener: "そういえば、前に話していたことを思い出して…",
      memo: `${bookmark.targetName}に、前に話していた「${subject}」の続きを聞いてみたい`,
    });
  }

  return (
    <main className="screen hint-screen">
      <header className="hint-heading">
        <p className="eyebrow">CONVERSATION HINT</p>
        <h1>{selectedRelation ? relation?.label : "今日は、誰と話す？"}</h1>
        <p>
          {selectedRelation
            ? "正解を決めるのではなく、最初の一言を考えるための小さなきっかけです。"
            : "相手との関係に合いそうな、やさしい会話の入口を選びます。"}
        </p>
      </header>

      {!selectedRelation ? (
        <section className="relation-picker" aria-label="話す相手との関係">
          {CONVERSATION_RELATIONS.map((item, index) => (
            <button className={`relation-option relation-${item.id}`} key={item.id} onClick={() => selectRelation(item.id)} type="button">
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
              <i aria-hidden="true">›</i>
            </button>
          ))}
        </section>
      ) : (
        <section className="hint-result">
          <button className="hint-relation-back" onClick={returnToRelations} type="button">
            <span aria-hidden="true">‹</span> 相手を選び直す
          </button>

          {current && (
            <div className="hint-paper relation-hint-paper" key={`${selectedRelation}-${current.id}`}>
              <span className="hint-category">{relation?.label}</span>
              <span className="hint-paper-ribbon" aria-hidden="true" />

              {isTrivia ? (
                <>
                  <div className="hint-content-block">
                    <small>ちょっとした雑学</small>
                    <p className="hint-text">{current.text}</p>
                  </div>
                  <div className="hint-content-block conversation-line">
                    <small>話してみる</small>
                    <p className="hint-question">{current.question}</p>
                  </div>
                  <footer>
                    <span>出典：{current.source}</span>
                    <span>{current.checkedAt}確認</span>
                    <a href={current.url} rel="noreferrer" target="_blank">詳しく見る ↗</a>
                  </footer>
                </>
              ) : (
                <>
                  <div className="hint-content-block">
                    <small>話してみる</small>
                    <p className="hint-text">「{current.prompt}」</p>
                  </div>
                  <div className="hint-content-block conversation-line">
                    <small>広げるなら</small>
                    <p className="hint-question">「{current.followUp}」</p>
                  </div>
                  {current.opener && (
                    <div className="hint-content-block hint-opener">
                      <small>こんな入り方でもOK</small>
                      <p>「{current.opener}」</p>
                    </div>
                  )}
                  <p className="hint-kind-note">相手が答えにくそうなら、別の話題に変えて大丈夫です。</p>
                </>
              )}
            </div>
          )}

          {selectedRelation === "reunion" && recentPeople.length > 0 && (
            <section className="past-shiori-hints">
              <div>
                <strong>以前のしおりから思い出す</strong>
                <small>保存した内容は、この端末内だけで使います</small>
              </div>
              <div>
                {recentPeople.map((bookmark) => (
                  <button key={bookmark.id} onClick={() => usePastBookmark(bookmark)} type="button">
                    {bookmark.targetName}
                  </button>
                ))}
              </div>
            </section>
          )}

          {isTrivia && offline && <p className="offline-note">保存済みの雑学を表示しています。</p>}
          <div className="hint-actions">
            <button className="secondary-button" disabled={!current} onClick={() => drawFromRelation(selectedRelation)} type="button">
              もう一度見る
            </button>
            <button className="primary-button hint-talk-button" disabled={!current} onClick={() => onUseHint(current.memo || current.question)} type="button">
              話す
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
