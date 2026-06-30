import { useMemo, useState } from "react";
import { emotionOptions, emotionTemplates } from "../data";
import { formatToday, uniqueId } from "../utils";

const initialForm = {
  person: "",
  emotion: "",
  memo: "",
  openingLine: "",
  question: "",
};

export default function SaveScreen({ onSave }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState("success");

  const canSave = useMemo(
    () =>
      form.person.trim() &&
      form.emotion &&
      form.memo.trim() &&
      form.openingLine.trim() &&
      form.question.trim(),
    [form],
  );

  function updateField(name, value) {
    setMessage("");
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleEmotionChange(emotion) {
    const template = emotionTemplates[emotion];
    setMessage("");
    setForm((current) => ({
      ...current,
      emotion,
      openingLine: template.openingLine,
      question: template.question,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSave) {
      setMessageKind("error");
      setMessage(
        "話したい相手、気持ち、メモ、最初の一言、聞いてみたいことをそろえると保存できます。",
      );
      return;
    }

    onSave({
      id: uniqueId(),
      person: form.person.trim(),
      emotion: form.emotion,
      memo: form.memo.trim(),
      openingLine: form.openingLine.trim(),
      question: form.question.trim(),
      createdAt: formatToday(),
      status: "unsent",
    });
    setForm(initialForm);
    setMessageKind("success");
    setMessage("しおりを挟みました。会う前に、またここで思い出せます。");
  }

  return (
    <main className="screen">
      <section className="section-heading">
        <p className="app-name">会う前のしおり</p>
        <h1>話したかったことに、しおりを挟む。</h1>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>誰に話したい？</span>
          <input
            onChange={(event) => updateField("person", event.target.value)}
            placeholder="さき"
            type="text"
            value={form.person}
          />
        </label>

        <fieldset className="tag-field">
          <legend>どんな気持ち？</legend>
          <div className="tag-options">
            {emotionOptions.map((emotion) => (
              <button
                className={form.emotion === emotion ? "tag-choice active" : "tag-choice"}
                key={emotion}
                onClick={() => handleEmotionChange(emotion)}
                type="button"
              >
                {emotion}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>何を話したかった？</span>
          <textarea
            onChange={(event) => updateField("memo", event.target.value)}
            placeholder="駅の近くに良さそうなカフェがあった"
            rows="4"
            value={form.memo}
          />
        </label>

        <label className="field">
          <span>話し出しの一言</span>
          <textarea
            onChange={(event) => updateField("openingLine", event.target.value)}
            rows="3"
            value={form.openingLine}
          />
        </label>

        <label className="field">
          <span>聞いてみたいこと</span>
          <input
            onChange={(event) => updateField("question", event.target.value)}
            type="text"
            value={form.question}
          />
        </label>

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
