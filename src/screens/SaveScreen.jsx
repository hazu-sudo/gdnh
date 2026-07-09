import { useMemo, useState } from "react";
import {
  APP_NAME,
  emotionOptions,
  generateOpenHint,
  getEmotionLabel,
  targetOptions,
} from "../data";
import { formatToday, uniqueId } from "../utils";

const initialForm = {
  targetType: "person",
  targetName: "",
  emotion: "",
  customEmotion: "",
  memo: "",
  openHint: "",
  isEditingOpenHint: false,
};

function getTargetName(form) {
  if (form.targetType === "someone") {
    return "誰か";
  }

  if (form.targetType === "self") {
    return "自分";
  }

  return form.targetName.trim();
}

function getSavedEmotion(form) {
  if (form.emotion === "その他") {
    return form.customEmotion.trim() || "その他";
  }

  return form.emotion;
}

export default function SaveScreen({ onSave }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState("success");
  const targetName = getTargetName(form);
  const needsCustomEmotion = form.emotion === "その他";
  const previewHint = form.emotion
    ? generateOpenHint({ targetType: form.targetType, emotion: form.emotion })
    : "";
  const savedOpenHint =
    form.isEditingOpenHint && form.openHint.trim()
      ? form.openHint.trim()
      : previewHint;

  const canSave = useMemo(
    () =>
      targetName &&
      form.emotion &&
      (!needsCustomEmotion || form.customEmotion.trim()) &&
      form.memo.trim(),
    [form, needsCustomEmotion, targetName],
  );

  function updateField(name, value) {
    setMessage("");
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleTargetChange(targetType) {
    setMessage("");
    setForm((current) => ({
      ...current,
      targetType,
      openHint: "",
      isEditingOpenHint: false,
    }));
  }

  function handleEmotionChange(emotion) {
    setMessage("");
    setForm((current) => ({
      ...current,
      emotion,
      openHint: "",
      isEditingOpenHint: false,
    }));
  }

  function toggleOpenHintEdit() {
    setMessage("");
    setForm((current) => ({
      ...current,
      isEditingOpenHint: !current.isEditingOpenHint,
      openHint:
        current.isEditingOpenHint || current.openHint
          ? current.openHint
          : generateOpenHint({ targetType: current.targetType, emotion: current.emotion }),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSave) {
      setMessageKind("error");
      setMessage("宛先、気持ちタグ、ひとことメモを入れると保存できます。");
      return;
    }

    const emotion = getSavedEmotion(form);

    onSave({
      id: uniqueId(),
      targetType: form.targetType,
      targetName,
      emotion,
      memo: form.memo.trim(),
      openHint: savedOpenHint,
      status: "unopened",
      createdAt: formatToday(),
    });
    setForm(initialForm);
    setMessageKind("success");
    setMessage("しおりを挟みました。あとで開ける言葉も、そっと添えました。");
  }

  return (
    <main className="screen">
      <section className="section-heading">
        <p className="app-name">{APP_NAME}</p>
        <h1>言葉になる前の気持ちに、しおりを挟む。</h1>
        <p>入力するのは、宛先、気持ちタグ、ひとことメモだけです。</p>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <fieldset className="tag-field">
          <legend>宛先</legend>
          <div className="destination-options">
            {targetOptions.map((option) => (
              <button
                className={
                  form.targetType === option.id
                    ? "destination-choice active"
                    : "destination-choice"
                }
                key={option.id}
                onClick={() => handleTargetChange(option.id)}
                type="button"
              >
                <span>{option.label}</span>
                <small>{option.helper}</small>
              </button>
            ))}
          </div>
        </fieldset>

        {form.targetType === "person" && (
          <label className="field">
            <span>名前</span>
            <input
              onChange={(event) => updateField("targetName", event.target.value)}
              placeholder="さき"
              type="text"
              value={form.targetName}
            />
          </label>
        )}

        <fieldset className="tag-field">
          <legend>気持ちタグ</legend>
          <div className="tag-options">
            {emotionOptions.map((emotion) => (
              <button
                className={form.emotion === emotion ? "tag-choice active" : "tag-choice"}
                key={emotion}
                onClick={() => handleEmotionChange(emotion)}
                type="button"
              >
                {getEmotionLabel(emotion)}
              </button>
            ))}
          </div>
        </fieldset>

        {needsCustomEmotion && (
          <label className="field">
            <span>その他の気持ち</span>
            <input
              onChange={(event) => updateField("customEmotion", event.target.value)}
              placeholder="まだ名前がつかない感じ"
              type="text"
              value={form.customEmotion}
            />
          </label>
        )}

        <label className="field">
          <span>ひとことメモ</span>
          <textarea
            onChange={(event) => updateField("memo", event.target.value)}
            placeholder="今すぐ送るほどではないけれど、忘れたくないこと"
            rows="4"
            value={form.memo}
          />
        </label>

        {previewHint && (
          <section className="auto-preview" aria-label="自動で添える開くヒント">
            <div className="open-hint-preview">
              <div>
                <span>開くヒント</span>
                {form.isEditingOpenHint ? (
                  <textarea
                    onChange={(event) => updateField("openHint", event.target.value)}
                    rows="3"
                    value={form.openHint}
                  />
                ) : (
                  <p>{previewHint}</p>
                )}
              </div>
              <button
                className="hint-edit-button"
                onClick={toggleOpenHintEdit}
                type="button"
              >
                {form.isEditingOpenHint ? "自動に戻す" : "編集する"}
              </button>
            </div>
          </section>
        )}

        {message && (
          <p
            aria-live="polite"
            className={`form-message ${messageKind === "error" ? "error" : ""}`}
          >
            {message}
          </p>
        )}

        <button className="primary-button" type="submit">
          しおりを挟む
        </button>
      </form>
    </main>
  );
}
