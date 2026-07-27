import { useMemo, useState } from "react";
import { emotionOptions, generateOpenHint, targetOptions } from "../data";
import { formatToday, uniqueId } from "../utils";

const emptyForm = {
  targetType: "person",
  targetName: "",
  emotion: "",
  customEmotion: "",
  memo: "",
};

export default function SaveScreen({ onSave, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const targetName =
    form.targetType === "someone" ? "誰か" : form.targetType === "self" ? "自分" : form.targetName.trim();
  const custom = form.emotion === "その他";
  const savedEmotion = custom ? form.customEmotion.trim() : form.emotion;
  const hint = form.emotion
    ? generateOpenHint({ targetType: form.targetType, emotion: form.emotion })
    : "";
  const canSave = useMemo(
    () => Boolean(targetName && savedEmotion && form.memo.trim()),
    [targetName, savedEmotion, form.memo],
  );

  function update(name, value) {
    setSaved(false);
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!canSave) return;
    onSave({
      id: uniqueId(),
      targetType: form.targetType,
      targetName,
      emotion: savedEmotion,
      memo: form.memo.trim(),
      openHint: hint,
      status: "unopened",
      createdAt: formatToday(),
    });
    setForm(emptyForm);
    setSaved(true);
  }

  return (
    <main className="screen">
      <section className="screen-heading">
        <p className="eyebrow">NEW SHIORI</p>
        <h1>気持ちを、そっと挟む。</h1>
        <p>きれいな言葉にしなくて大丈夫。3つだけ選んで残せます。</p>
      </section>
      <form className="form-paper" onSubmit={submit}>
        <div className="form-step">
          <span className="step-number">01</span>
          <fieldset>
            <legend>宛先</legend>
            <div className="destination-options">
              {targetOptions.map((option) => (
                <button
                  className={form.targetType === option.id ? "choice active" : "choice"}
                  key={option.id}
                  onClick={() => update("targetType", option.id)}
                  type="button"
                >
                  <span>{option.label}</span><small>{option.helper}</small>
                </button>
              ))}
            </div>
            {form.targetType === "person" && (
              <input
                aria-label="相手の名前"
                onChange={(event) => update("targetName", event.target.value)}
                placeholder="名前を入力　例：さき"
                value={form.targetName}
              />
            )}
          </fieldset>
        </div>

        <div className="form-step">
          <span className="step-number">02</span>
          <fieldset>
            <legend>気持ちタグ</legend>
            <div className="tag-options">
              {emotionOptions.map((emotion) => (
                <button
                  className={form.emotion === emotion ? "tag-choice active" : "tag-choice"}
                  key={emotion}
                  onClick={() => update("emotion", emotion)}
                  type="button"
                >
                  {emotion}
                </button>
              ))}
            </div>
            {custom && (
              <input
                aria-label="その他の気持ち"
                onChange={(event) => update("customEmotion", event.target.value)}
                placeholder="この気持ちに名前をつけるなら"
                value={form.customEmotion}
              />
            )}
          </fieldset>
        </div>

        <div className="form-step">
          <span className="step-number">03</span>
          <label>
            <span className="field-label">ひとことメモ</span>
            <textarea
              onChange={(event) => update("memo", event.target.value)}
              placeholder="まだ言葉にならないままで、短く残してみる"
              rows="4"
              value={form.memo}
            />
          </label>
        </div>

        {hint && (
          <div className="ai-hint">
            <div className="ai-hint-title"><span className="spark">✦</span> 開くヒントを添えます</div>
            <p>「{hint}」</p>
            <small>しおりを開くとき、会話や振り返りの入り口になります。</small>
          </div>
        )}
        {saved && <p className="form-message">しおりを挟みました。開くタイミングは、あとで決められます。</p>}
        <button className="primary-button save-button" disabled={!canSave} type="submit">
          しおりを挟む
        </button>
        {saved && <button className="text-button centered" onClick={onSaved} type="button">ホームで見る</button>}
      </form>
    </main>
  );
}
