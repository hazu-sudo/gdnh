import { useEffect, useMemo, useState } from "react";
import { BUILT_IN_HINTS, CONVERSATION_RELATIONS, RELATION_HINTS } from "../hints.js";
import { loadHintCache, saveHintCache } from "../storage.js";

const SCENE_SUGGESTIONS = [
  "大学の授業で隣になった",
  "イベントで会った",
  "仕事の休憩中",
  "一緒に食事をしている",
  "移動中に会った",
  "オンラインで話す",
];

const politeRelations = new Set([
  "first-meeting",
  "coworker",
  "boss",
  "parttime-part",
  "teacher",
]);

function chooseUnseen(items, seenIds) {
  if (!items.length) return null;
  const unseen = items.filter((item) => !seenIds.includes(item.id));
  const choices = unseen.length ? unseen : items;
  return choices[Math.floor(Math.random() * choices.length)];
}

function previewMemo(text, limit = 28) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  return value.length > limit ? `${value.slice(0, limit)}…` : value;
}

function sceneHint(scene, polite) {
  if (/授業|大学|学校|ゼミ/.test(scene)) {
    return polite
      ? { prompt: "この授業、前にも受けたことありますか？", followUp: "他にどんな授業を取っているんですか？", talkContent: "授業や大学生活について軽く聞いてみる" }
      : { prompt: "この授業、前にも受けたことある？", followUp: "他にどんな授業を取ってる？", talkContent: "授業や学校での過ごし方について軽く聞いてみる" };
  }
  if (/仕事|職場|休憩|会社/.test(scene)) {
    return polite
      ? { prompt: "休憩するとき、何をして過ごすことが多いですか？", followUp: "気分転換の定番ってありますか？", talkContent: "仕事の合間の過ごし方や気分転換について聞いてみる" }
      : { prompt: "休憩するとき、何して過ごすことが多い？", followUp: "気分転換の定番ってある？", talkContent: "仕事の合間の過ごし方について聞いてみる" };
  }
  if (/イベント|会場|集まり/.test(scene)) {
    return polite
      ? { prompt: "このイベントは、どうやって知ったんですか？", followUp: "今日、楽しみにしていたことはありますか？", talkContent: "イベントを知ったきっかけや楽しみにしていることを聞いてみる" }
      : { prompt: "このイベント、どうやって知った？", followUp: "今日、楽しみにしてたことある？", talkContent: "イベントのきっかけや楽しみについて聞いてみる" };
  }
  if (/食事|ごはん|ランチ|カフェ|店/.test(scene)) {
    return polite
      ? { prompt: "こういうお店には、よく来られるんですか？", followUp: "最近食べておいしかったものはありますか？", talkContent: "お店や最近おいしかったものについて聞いてみる" }
      : { prompt: "こういうお店、よく来る？", followUp: "最近食べておいしかったものある？", talkContent: "お店や好きな食べ物について話してみる" };
  }
  if (/移動|電車|駅|待ち|来た/.test(scene)) {
    return polite
      ? { prompt: "今日はここまで、どうやって来たんですか？", followUp: "この辺にはよく来られるんですか？", talkContent: "ここまでの道のりや、この辺に来ることがあるか聞いてみる" }
      : { prompt: "今日はここまで、どうやって来た？", followUp: "この辺にはよく来る？", talkContent: "ここまでの道のりや、この辺のことについて話してみる" };
  }
  if (/オンライン|通話|ビデオ/.test(scene)) {
    return polite
      ? { prompt: "今日はどこから参加されているんですか？", followUp: "オンラインで話す機会は多いですか？", talkContent: "今日いる場所やオンラインでの過ごし方を軽く聞いてみる" }
      : { prompt: "今日はどこから参加してる？", followUp: "オンラインで話すことって多い？", talkContent: "今日いる場所やオンラインでの過ごし方を聞いてみる" };
  }
  return null;
}

function contextualizeHint(base, { relationId, scene, supplement, pastBookmark, usePast }) {
  const polite = politeRelations.has(relationId);
  const trimmedScene = previewMemo(scene, 64);
  const trimmedSupplement = previewMemo(supplement, 64);
  const contextual = sceneHint(trimmedScene, polite);
  const result = {
    ...base,
    ...contextual,
    id: `${base.id}-${Date.now()}`,
    talkContent: contextual?.talkContent || base.memo,
    contextSource: trimmedScene || trimmedSupplement ? "context" : "relation",
  };

  if (trimmedSupplement) {
    result.talkContent = `${trimmedSupplement}について、相手が答えやすい聞き方で話してみる`;
    if (!contextual) {
      result.prompt = polite
        ? `そういえば、${trimmedSupplement}について少し聞いてもいいですか？`
        : `そういえば、${trimmedSupplement}って最近どう？`;
    }
  }

  if (usePast && pastBookmark?.memo) {
    const pastSubject = previewMemo(pastBookmark.memo);
    result.usedPast = true;
    if (!trimmedScene && !trimmedSupplement) {
      result.prompt = polite
        ? `そういえば「${pastSubject}」、その後どうでしたか？`
        : `そういえば「${pastSubject}」、その後どうだった？`;
      result.followUp = polite ? "最近はどんな感じですか？" : "最近はどんな感じ？";
      result.talkContent = `前に話していた「${pastSubject}」の続きを聞いてみる`;
    } else {
      result.pastSuggestion = polite
        ? `会話が落ち着いたら、「${pastSubject}」のその後も聞いてみる`
        : `会話が落ち着いたら、「${pastSubject}」の続きも聞いてみる`;
    }
  }

  result.memo = result.talkContent;
  return result;
}

export default function HintScreen({ bookmarks = [], onUseHint }) {
  const [triviaHints, setTriviaHints] = useState(BUILT_IN_HINTS);
  const [selectedRelation, setSelectedRelation] = useState("");
  const [current, setCurrent] = useState(null);
  const [seenByRelation, setSeenByRelation] = useState({});
  const [scene, setScene] = useState("");
  const [supplement, setSupplement] = useState("");
  const [targetName, setTargetName] = useState("");
  const [usePast, setUsePast] = useState(true);
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
    return [...byName.values()].slice(0, 6);
  }, [bookmarks]);

  const matchingPastBookmark = useMemo(() => {
    const name = targetName.trim();
    if (!name) return null;
    return [...bookmarks]
      .filter((bookmark) => bookmark.targetName === name && bookmark.memo)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
  }, [bookmarks, targetName]);

  const relation = CONVERSATION_RELATIONS.find((item) => item.id === selectedRelation);
  const isTrivia = selectedRelation === "trivia";
  const isContextStep = selectedRelation && !isTrivia && !current;

  function rememberAndChoose(relationId, items) {
    const seen = seenByRelation[relationId] || [];
    const next = chooseUnseen(items, seen);
    if (!next) return null;
    setSeenByRelation((now) => ({
      ...now,
      [relationId]: seen.length >= items.length - 1 ? [next.id] : [...seen, next.id],
    }));
    return next;
  }

  function drawFromRelation(relationId) {
    if (relationId === "trivia") {
      setCurrent(rememberAndChoose(relationId, triviaHints));
      return;
    }
    const base = rememberAndChoose(relationId, RELATION_HINTS[relationId] || []);
    if (!base) return;
    setCurrent(contextualizeHint(base, {
      relationId,
      scene,
      supplement,
      pastBookmark: matchingPastBookmark,
      usePast,
    }));
  }

  function selectRelation(relationId) {
    setSelectedRelation(relationId);
    setCurrent(null);
    setScene("");
    setSupplement("");
    setTargetName("");
    setUsePast(true);
    if (relationId === "trivia") {
      window.requestAnimationFrame(() => drawFromRelation(relationId));
    }
  }

  function returnToRelations() {
    setSelectedRelation("");
    setCurrent(null);
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

          {isContextStep && (
            <form className="hint-context-form" onSubmit={(event) => { event.preventDefault(); drawFromRelation(selectedRelation); }}>
              <div className="context-relation-summary">
                <span>相手との関係</span>
                <strong>{relation?.label}</strong>
              </div>

              <label className="simple-field">
                <span>今の場面 <small>任意</small></span>
                <input
                  maxLength="80"
                  onChange={(event) => setScene(event.target.value)}
                  placeholder="例：大学の授業で隣になった"
                  value={scene}
                />
              </label>
              <div className="scene-suggestions" aria-label="場面の候補">
                {SCENE_SUGGESTIONS.map((item) => (
                  <button className={scene === item ? "active" : ""} key={item} onClick={() => setScene(item)} type="button">
                    {item}
                  </button>
                ))}
              </div>

              <label className="simple-field">
                <span>補足 <small>任意</small></span>
                <textarea
                  maxLength="120"
                  onChange={(event) => setSupplement(event.target.value)}
                  placeholder="話題にしたいことや、気になっていること"
                  rows="2"
                  value={supplement}
                />
              </label>

              <label className="simple-field">
                <span>話す相手の名前 <small>任意</small></span>
                <input
                  list="hint-recipient-history"
                  maxLength="40"
                  onChange={(event) => { setTargetName(event.target.value); setUsePast(true); }}
                  placeholder="栞がなくても空欄のまま使えます"
                  value={targetName}
                />
                <datalist id="hint-recipient-history">
                  {recentPeople.map((bookmark) => <option key={bookmark.id} value={bookmark.targetName} />)}
                </datalist>
              </label>

              {recentPeople.length > 0 && (
                <div className="hint-recipient-chips">
                  {recentPeople.map((bookmark) => (
                    <button key={bookmark.id} onClick={() => { setTargetName(bookmark.targetName); setUsePast(true); }} type="button">
                      {bookmark.targetName}
                    </button>
                  ))}
                </div>
              )}

              {matchingPastBookmark && (
                <label className="use-past-toggle">
                  <input checked={usePast} onChange={(event) => setUsePast(event.target.checked)} type="checkbox" />
                  <span><strong>以前のしおりも参考にする</strong><small>「{previewMemo(matchingPastBookmark.memo)}」</small></span>
                </label>
              )}

              <p className="context-hint-note">過去のしおりがなくても、関係性と場面をもとにヒントを考えます。</p>
              <button className="primary-button" type="submit">ヒントを見る</button>
            </form>
          )}

          {current && (
            <>
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
                      <small>話しかけ方</small>
                      <p className="hint-text">「{current.prompt}」</p>
                    </div>
                    <div className="hint-content-block conversation-line">
                      <small>話す内容</small>
                      <p className="hint-talk-content">{current.talkContent}</p>
                    </div>
                    <div className="hint-content-block conversation-line">
                      <small>会話を広げるなら</small>
                      <p className="hint-question">「{current.followUp}」</p>
                    </div>
                    {current.pastSuggestion && (
                      <div className="hint-content-block hint-past-suggestion">
                        <small>以前のしおりも使うなら</small>
                        <p>{current.pastSuggestion}</p>
                      </div>
                    )}
                    <p className="hint-kind-note">
                      {current.usedPast ? "関係性・場面と、以前のしおりを参考にしました。" : "関係性と場面をもとにヒントを考えました。"}
                    </p>
                  </>
                )}
              </div>

              {!isTrivia && (
                <button className="hint-edit-context" onClick={() => setCurrent(null)} type="button">
                  場面や補足を変える
                </button>
              )}
              {isTrivia && offline && <p className="offline-note">保存済みの雑学を表示しています。</p>}
              <div className="hint-actions">
                <button className="secondary-button" onClick={() => drawFromRelation(selectedRelation)} type="button">もう一度見る</button>
                <button className="primary-button hint-talk-button" onClick={() => onUseHint(current.memo || current.question)} type="button">話す</button>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
