import { useEffect, useMemo, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import { pickRandom } from "../utils";

export default function OpenScreen({ bookmarks, onUpdateStatus }) {
  const candidates = useMemo(
    () => bookmarks.filter((item) => item.status === "unopened" || item.status === "checked"),
    [bookmarks],
  );
  const [selectedId, setSelectedId] = useState("");
  const selected = candidates.find((item) => item.id === selectedId) || candidates[0] || null;

  useEffect(() => {
    if (!selectedId && candidates.length) setSelectedId(pickRandom(candidates)?.id || "");
    if (selectedId && !candidates.some((item) => item.id === selectedId)) {
      setSelectedId(pickRandom(candidates)?.id || "");
    }
  }, [candidates, selectedId]);

  function openAnother() {
    setSelectedId(pickRandom(candidates, selected?.id)?.id || "");
  }

  return (
    <main className="screen open-screen">
      <section className="open-heading">
        <span className="open-symbol" aria-hidden="true">栞</span>
        <p className="eyebrow">OPEN ONE</p>
        <h1>迷ったら、<br />1枚だけ開いてみる。</h1>
        <p>何を話そうか、何から考えようか。決めなくても、しおりが選んでくれます。</p>
      </section>
      {selected ? (
        <section className="random-stage">
          <BookmarkCard bookmark={selected} onUpdateStatus={onUpdateStatus} showActions featured />
          <button className="shuffle-button" onClick={openAnother} type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3c5 0 5 10 10 10h3" /><path d="m17 14 3 3-3 3M4 17h3c2 0 3.2-1.5 4.3-3M15 7h5M17 4l3 3-3 3" /></svg>
            もう1枚開く
          </button>
        </section>
      ) : (
        <p className="empty">いま開けるしおりはありません。話したしおりは、静かにしまってあります。</p>
      )}
    </main>
  );
}
