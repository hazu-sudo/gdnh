import { useMemo, useState } from "react";
import {
  destinationOptions,
  emotionOptions,
  getEmotionShortLabel,
  getTemplate,
} from "../data";
import { formatToday, uniqueId } from "../utils";

const initialForm = {
  destinationType: "specific",
  personName: "",
  emotion: "",
  memo: "",
};

function getPerson(form) {
  if (form.destinationType === "someone") {
    return "誰か";
  }

  if (form.destinationType === "self") {
    return "自分";
  }

  return form.personName.trim();
}

export default function SaveScreen({ onSave }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState("success");
  const template = form.emotion ? getTemplate(form.emotion) : null;

  const canSave = useMemo(
    () => getPerson(form) && form.emotion && form.memo.trim(),
    [form],
  );

  function updateField(name, value) {
    setMessage("");
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleDestinationChange(destinationType) {
    setMessage("");
    setForm((current) => ({ ...current, destinationType }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSave || !template) {
      setMessageKind("error");
      setMessage("宛先、気持ちタグ、ひとことメモを入れると保存できます。");
      return;
    }

    onSave({
      id: uniqueId(),
      destinationType: form.destinationType,
      person: getPerson(form),
      emotion: form.emotion,
      memo: form.memo.trim(),
      openingLine: template.openingLine,
      question: template.question,
      createdAt: formatToday(),
      status: "unopened",
    });
    setForm(initialForm);
    setMessageKind("success");
    setMessage("しおりを挟みました。あとで開きやすい言葉も添えておきました。");
  }

  return (
    <main className="screen">
      <section className="section-heading">
        <p className="app-name">挟む</p>
        <h1>気持ちをひとこと置くだけ。</h1>
        <p>開くヒントと話し出しの一言は、気持ちタグからそっと添えます。</p>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <fieldset className="tag-field">
          <legend>宛先</legend>
          <div className="destination-options">
            {destinationOptions.map((option) => (
              <button
                className={
                  form.destinationType === option.id
                    ? "destination-choice active"
                    : "destination-choice"
                }
                key={option.id}
                onClick={() => handleDestinationChange(option.id)}
                type="button"
              >
                <span>{option.label}</span>
                <small>{option.helper}</small>
              </button>
            ))}
          </div>
        </fieldset>

        {form.destinationType === "specific" && (
          <label className="field">
            <span>名前</span>
            <input
              onChange={(event) => updateField("personName", event.target.value)}
              placeholder="さき"
              type="text"
              value={form.personName}
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
                onClick={() => updateField("emotion", emotion)}
                type="button"
              >
                {getEmotionShortLabel(emotion)}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>ひとことメモ</span>
          <textarea
            onChange={(event) => updateField("memo", event.target.value)}
            placeholder="駅の近くに良さそうなカフェがあった"
            rows="4"
            value={form.memo}
          />
        </label>

        {template && (
          <section className="auto-preview" aria-label="自動で添える言葉">
            <div>
              <span>開くヒント</span>
              <p>{template.question}</p>
            </div>
            <div>
              <span>話し出しの一言</span>
              <p>{template.openingLine}</p>
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
