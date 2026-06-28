(function () {
  const rootElement = document.querySelector("#root");

  if (!rootElement) {
    return;
  }

  if (!window.React || !window.ReactDOM) {
    rootElement.innerHTML = `
      <main class="fallback">
        <section class="fallback-box">
          <p class="eyebrow">はなすアルバム</p>
          <h1>Reactを読み込めませんでした</h1>
          <p>vendorフォルダのReactファイルを確認して、もう一度開いてください。</p>
        </section>
      </main>
    `;
    return;
  }

  const h = React.createElement;
  const { useEffect, useMemo, useRef, useState } = React;

  const RECORDS_KEY = "hanasu-album.records.v2";
  const CONTACTS_KEY = "hanasu-album.contacts.v2";

  const defaultContacts = [
    { id: "friend", name: "友達" },
    { id: "seminar", name: "ゼミの人" },
    { id: "family", name: "家族" }
  ];

  const sampleRecords = [
    {
      id: "sample-cafe",
      date: "2026-06-11",
      photo: "assets/conversation-sample.png",
      memo: "カフェで偶然話が長く続いた。最後に、同じ飲み物を頼んでいたことに気づいて少し笑った。",
      recipients: ["friend", "seminar"],
      tag: "偶然",
      done: false,
      createdAt: "2026-06-11T10:00:00.000Z"
    },
    {
      id: "sample-seminar",
      date: "2026-06-03",
      photo: "assets/conversation-sample.png",
      memo: "ゼミ発表のあとに緊張がほどけた。話のオチは、準備した言葉より終わった後の一言のほうが自然だったこと。",
      recipients: ["seminar"],
      tag: "発表",
      done: true,
      doneAt: "2026-06-04T10:00:00.000Z",
      createdAt: "2026-06-03T10:00:00.000Z"
    }
  ];

  function App() {
    const [screen, setScreen] = useState("home");
    const [records, setRecords] = useState(() => normalizeRecords(readJSON(RECORDS_KEY, sampleRecords)));
    const [contacts, setContacts] = useState(() => normalizeContacts(readJSON(CONTACTS_KEY, defaultContacts)));
    const [lastSavedId, setLastSavedId] = useState("");
    const [activeRecordId, setActiveRecordId] = useState("");
    const [detailBackScreen, setDetailBackScreen] = useState("find");

    useEffect(() => {
      writeJSON(RECORDS_KEY, records);
    }, [records]);

    useEffect(() => {
      writeJSON(CONTACTS_KEY, contacts);
    }, [contacts]);

    const contactMap = useMemo(() => {
      return contacts.reduce((map, contact) => {
        map[contact.id] = contact;
        return map;
      }, {});
    }, [contacts]);

    const activeRecord = records.find((record) => record.id === activeRecordId) || null;
    const lastSavedRecord = records.find((record) => record.id === lastSavedId) || null;

    function addContact(name) {
      const trimmed = name.trim();
      if (!trimmed) {
        return "";
      }

      const existing = contacts.find((contact) => contact.name === trimmed);
      if (existing) {
        return existing.id;
      }

      const contact = { id: uid("person"), name: trimmed };
      setContacts((current) => [...current, contact]);
      return contact.id;
    }

    function saveRecord(data) {
      const record = {
        id: uid("memory"),
        date: data.date,
        photo: data.photo,
        memo: data.memo.trim(),
        recipients: data.recipients,
        tag: suggestTag(data.memo),
        done: false,
        createdAt: new Date().toISOString()
      };

      setRecords((current) => [record, ...current]);
      setLastSavedId(record.id);
      setActiveRecordId(record.id);
      setScreen("saved");
    }

    function markDone(recordId) {
      setRecords((current) =>
        current.map((record) =>
          record.id === recordId ? { ...record, done: true, doneAt: new Date().toISOString() } : record
        )
      );
    }

    function openRecord(recordId, backScreen) {
      setActiveRecordId(recordId);
      setDetailBackScreen(backScreen || "find");
      setScreen("detail");
    }

    function renderScreen() {
      if (screen === "save") {
        return h(SaveScreen, {
          contacts,
          onAddContact: addContact,
          onBack: () => setScreen("home"),
          onSave: saveRecord
        });
      }

      if (screen === "saved") {
        return h(SavedScreen, {
          contactMap,
          record: lastSavedRecord,
          onHome: () => setScreen("home"),
          onFind: () => setScreen("find")
        });
      }

      if (screen === "find") {
        return h(FindScreen, {
          contacts,
          contactMap,
          records,
          onAddContact: addContact,
          onBack: () => setScreen("home"),
          onOpenRecord: (recordId) => openRecord(recordId, "find"),
          onSaveFirst: () => setScreen("save")
        });
      }

      if (screen === "detail" && activeRecord) {
        return h(DetailScreen, {
          contactMap,
          record: activeRecord,
          onBack: () => setScreen(detailBackScreen),
          onDone: () => markDone(activeRecord.id)
        });
      }

      if (screen === "calendar") {
        return h(CalendarScreen, {
          contactMap,
          records,
          onBack: () => setScreen("home"),
          onOpenRecord: (recordId) => openRecord(recordId, "calendar")
        });
      }

      return h(HomeScreen, {
        savedCount: records.length,
        doneCount: records.filter((record) => record.done).length,
        onFind: () => setScreen("find"),
        onSave: () => setScreen("save")
      });
    }

    return h(
      React.Fragment,
      null,
      h("button", {
        className: "floating-heart" + (screen === "calendar" ? " is-active" : ""),
        type: "button",
        onClick: () => setScreen("calendar"),
        title: "登録した写真を見る",
        "aria-label": "登録した写真を見る"
      }, "♥"),
      renderScreen()
    );
  }

  function HomeScreen({ doneCount, onFind, onSave, savedCount }) {
    return h(
      "main",
      { className: "app-shell home-shell" },
      h("section", { className: "home-panel" },
        h("p", { className: "eyebrow" }, "はなすアルバム"),
        h("h1", null, "写真を、あとで話せる記録にする。"),
        h("p", { className: "lead" }, "残すときは、誰に話したいかまで一緒に保存。探すときは、相手に合わせて一枚を選びます。"),
        h("div", { className: "home-actions" },
          h("button", { className: "choice-button save", type: "button", onClick: onSave },
            h("span", { className: "choice-icon" }, "+"),
            h("span", null, "記録を残す")
          ),
          h("button", { className: "choice-button find", type: "button", onClick: onFind },
            h("span", { className: "choice-icon" }, "?"),
            h("span", null, "記録を探す")
          )
        ),
        h("div", { className: "mini-stats" },
          h("span", null, `${savedCount}件の記録`),
          h("span", null, `${doneCount}件 済`)
        )
      )
    );
  }

  function SaveScreen({ contacts, onAddContact, onBack, onSave }) {
    const [date, setDate] = useState(todayKey());
    const [photo, setPhoto] = useState("");
    const [memo, setMemo] = useState("");
    const [selected, setSelected] = useState(() => contacts[0] ? [contacts[0].id] : []);
    const [contactName, setContactName] = useState("");
    const [loadingPhoto, setLoadingPhoto] = useState(false);
    const pictureInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    useEffect(() => {
      setSelected((current) => current.filter((id) => contacts.some((contact) => contact.id === id)));
    }, [contacts]);

    const canSave = Boolean(date && photo && memo.trim() && selected.length > 0);

    async function handleFile(file) {
      if (!file) {
        return;
      }

      setLoadingPhoto(true);
      try {
        const dataUrl = await fileToPhoto(file);
        setPhoto(dataUrl);
      } finally {
        setLoadingPhoto(false);
      }
    }

    function addAndSelect() {
      const id = onAddContact(contactName);
      if (id) {
        setSelected((current) => (current.includes(id) ? current : [...current, id]));
        setContactName("");
      }
    }

    return h(
      "main",
      { className: "app-shell" },
      h(TopBar, { title: "記録を残す", onBack }),
      h("section", { className: "form-stack" },
        h(FieldBlock, { label: "日付" },
          h("input", {
            className: "text-input",
            type: "date",
            value: date,
            onChange: (event) => setDate(event.target.value)
          })
        ),
        h(FieldBlock, { label: "写真登録" },
          h("div", { className: "photo-tools" },
            h("button", { className: "tool-button", type: "button", onClick: () => pictureInputRef.current.click() }, "Picture"),
            h("button", { className: "tool-button", type: "button", onClick: () => cameraInputRef.current.click() }, "Camera")
          ),
          h("input", {
            ref: pictureInputRef,
            className: "visually-hidden",
            type: "file",
            accept: "image/*",
            onChange: (event) => handleFile(event.target.files && event.target.files[0])
          }),
          h("input", {
            ref: cameraInputRef,
            className: "visually-hidden",
            type: "file",
            accept: "image/*",
            capture: "environment",
            onChange: (event) => handleFile(event.target.files && event.target.files[0])
          }),
          loadingPhoto
            ? h("div", { className: "photo-loading" }, "写真を読み込み中")
            : photo
              ? h("figure", { className: "photo-preview" }, h("img", { src: photo, alt: "登録する写真" }))
              : h("div", { className: "photo-empty" }, "写真を選ぶとここに表示されます")
        ),
        h(FieldBlock, { label: "メモ" },
          h("textarea", {
            className: "memo-input",
            value: memo,
            onChange: (event) => setMemo(event.target.value),
            placeholder: "この写真を使って話すときのオチ、最後に言いたいこと、相手に聞きたいことなど"
          }),
          h("p", { className: "assist-line" }, suggestTag(memo) ? `オチタグ候補: ${suggestTag(memo)}` : "メモからオチタグを自動で作ります")
        ),
        h(FieldBlock, { label: "誰に向けてか" },
          h(ContactChips, {
            contacts,
            selectedIds: selected,
            onToggle: (id) => {
              setSelected((current) =>
                current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
              );
            }
          }),
          h("div", { className: "add-person" },
            h("input", {
              className: "text-input",
              value: contactName,
              onChange: (event) => setContactName(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addAndSelect();
                }
              },
              placeholder: "相手を追加"
            }),
            h("button", { className: "sub-button", type: "button", onClick: addAndSelect }, "登録")
          )
        ),
        h("button", {
          className: "primary-button",
          type: "button",
          disabled: !canSave,
          onClick: () => onSave({ date, photo, memo, recipients: selected })
        }, "保存する")
      )
    );
  }

  function SavedScreen({ contactMap, onFind, onHome, record }) {
    return h(
      "main",
      { className: "app-shell saved-shell" },
      h("section", { className: "saved-animation" },
        h("div", { className: "saved-burst" },
          h("span", null, "保存しました")
        ),
        record
          ? h("div", { className: "saved-summary" },
              h("img", { src: record.photo, alt: "保存した写真" }),
              h("div", null,
                h("p", { className: "eyebrow" }, formatDate(record.date)),
                h("h2", null, record.tag),
                h("p", null, `話したい相手: ${contactNames(record, contactMap)}`)
              )
            )
          : null,
        h("div", { className: "action-row" },
          h("button", { className: "secondary-button", type: "button", onClick: onHome }, "ホーム"),
          h("button", { className: "primary-button", type: "button", onClick: onFind }, "探しに行く")
        )
      )
    );
  }

  function FindScreen({ contacts, contactMap, records, onAddContact, onBack, onOpenRecord, onSaveFirst }) {
    const [contactId, setContactId] = useState(() => contacts[0] ? contacts[0].id : "");
    const [filter, setFilter] = useState("all");
    const [contactName, setContactName] = useState("");
    const [currentId, setCurrentId] = useState("");
    const [passedIds, setPassedIds] = useState([]);

    useEffect(() => {
      if (!contactId && contacts[0]) {
        setContactId(contacts[0].id);
      }
    }, [contacts, contactId]);

    const tags = useMemo(() => {
      const unique = new Set();
      records.forEach((record) => {
        if (record.recipients.includes(contactId) && record.tag) {
          unique.add(record.tag);
        }
      });
      return Array.from(unique);
    }, [records, contactId]);

    const eligible = useMemo(() => {
      return records.filter((record) => {
        if (!record.recipients.includes(contactId)) {
          return false;
        }
        if (filter === "notdone") {
          return !record.done;
        }
        if (filter === "punchline") {
          return Boolean(record.memo.trim());
        }
        if (filter.startsWith("tag:")) {
          return record.tag === filter.slice(4);
        }
        return true;
      });
    }, [records, contactId, filter]);

    useEffect(() => {
      setPassedIds([]);
      setCurrentId(pickRandom(eligible)?.id || "");
    }, [contactId, filter, eligible.length]);

    const currentRecord = eligible.find((record) => record.id === currentId) || eligible[0] || null;

    function addPerson() {
      const id = onAddContact(contactName);
      if (id) {
        setContactId(id);
        setContactName("");
      }
    }

    function passRecord() {
      if (!currentRecord) {
        return;
      }

      const nextPassed = [...passedIds, currentRecord.id];
      const pool = eligible.filter((record) => !nextPassed.includes(record.id));
      if (pool.length === 0) {
        setPassedIds([]);
        setCurrentId(pickRandom(eligible.filter((record) => record.id !== currentRecord.id))?.id || currentRecord.id);
        return;
      }
      setPassedIds(nextPassed);
      setCurrentId(pickRandom(pool).id);
    }

    return h(
      "main",
      { className: "app-shell" },
      h(TopBar, { title: "記録を探す", onBack }),
      h("section", { className: "find-stack" },
        h(FieldBlock, { label: "誰に話す？" },
          h(ContactChips, {
            contacts,
            selectedIds: contactId ? [contactId] : [],
            onToggle: (id) => setContactId(id),
            single: true
          }),
          h("div", { className: "add-person" },
            h("input", {
              className: "text-input",
              value: contactName,
              onChange: (event) => setContactName(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addPerson();
                }
              },
              placeholder: "相手を追加"
            }),
            h("button", { className: "sub-button", type: "button", onClick: addPerson }, "登録")
          )
        ),
        h("div", { className: "filter-row" },
          h(FilterChip, { active: filter === "all", onClick: () => setFilter("all") }, "全部"),
          h(FilterChip, { active: filter === "notdone", onClick: () => setFilter("notdone") }, "未済"),
          h(FilterChip, { active: filter === "punchline", onClick: () => setFilter("punchline") }, "オチあり"),
          tags.map((tag) => h(FilterChip, {
            key: tag,
            active: filter === `tag:${tag}`,
            onClick: () => setFilter(`tag:${tag}`)
          }, tag))
        ),
        currentRecord
          ? h(RandomRecord, {
              contactName: contactMap[contactId]?.name || "その人",
              record: currentRecord,
              onPass: passRecord,
              onSelect: () => onOpenRecord(currentRecord.id)
            })
          : h("div", { className: "empty-state" },
              h("p", null, "この相手に向けた記録がまだありません。"),
              h("button", { className: "primary-button", type: "button", onClick: onSaveFirst }, "記録を残す")
            )
      )
    );
  }

  function RandomRecord({ contactName, onPass, onSelect, record }) {
    return h("article", { className: "random-card" },
      h("div", { className: "random-photo-wrap" },
        h("img", { src: record.photo, alt: "選ばれた写真" }),
        record.done ? h("span", { className: "done-stamp" }, "済") : null
      ),
      h("div", { className: "random-copy" },
        h("p", { className: "eyebrow" }, `${contactName}に話したい一枚`),
        h("h2", null, record.tag),
        h("p", null, formatDate(record.date))
      ),
      h("div", { className: "action-row" },
        h("button", { className: "secondary-button", type: "button", onClick: onPass }, "PASS"),
        h("button", { className: "primary-button", type: "button", onClick: onSelect }, "それにする！")
      )
    );
  }

  function DetailScreen({ contactMap, onBack, onDone, record }) {
    const [showHints, setShowHints] = useState(false);
    const hints = useMemo(() => buildHints(record, contactMap), [record, contactMap]);

    return h(
      "main",
      { className: "app-shell" },
      h(TopBar, { title: "話す記録", onBack }),
      h("section", { className: "detail-stack" },
        h("article", { className: "detail-card" },
          h("div", { className: "detail-photo-wrap" },
            h("img", { src: record.photo, alt: "記録した写真" }),
            record.done ? h("span", { className: "done-stamp large" }, "済") : null
          ),
          h("div", { className: "detail-body" },
            h("p", { className: "eyebrow" }, `${formatDate(record.date)} / ${contactNames(record, contactMap)}`),
            h("h2", null, record.tag),
            h("p", { className: "memo-text" }, record.memo)
          )
        ),
        h("div", { className: "action-row" },
          h("button", { className: "secondary-button", type: "button", onClick: () => setShowHints((value) => !value) }, "ヒント"),
          h("button", { className: "primary-button", type: "button", onClick: onDone, disabled: record.done }, record.done ? "済にしました" : "話し終えた")
        ),
        showHints ? h(HintPanel, { hints }) : null
      )
    );
  }

  function HintPanel({ hints }) {
    return h("section", { className: "hint-panel" },
      h("h3", null, "話題を広げるヒント"),
      h("div", { className: "hint-grid" },
        h("div", { className: "hint-box" },
          h("p", { className: "hint-label" }, "最初の一言"),
          h("p", null, hints.opener)
        ),
        h("div", { className: "hint-box" },
          h("p", { className: "hint-label" }, "オチ案"),
          h("p", null, hints.punchline)
        )
      ),
      h("ul", { className: "question-list" }, hints.questions.map((question) => h("li", { key: question }, question)))
    );
  }

  function CalendarScreen({ contactMap, records, onBack, onOpenRecord }) {
    const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
    const days = useMemo(() => calendarDays(cursor), [cursor]);
    const recordsByDate = useMemo(() => {
      return records.reduce((map, record) => {
        if (!map[record.date]) {
          map[record.date] = [];
        }
        map[record.date].push(record);
        return map;
      }, {});
    }, [records]);

    return h(
      "main",
      { className: "app-shell calendar-shell" },
      h(TopBar, { title: "カレンダー", onBack }),
      h("section", { className: "calendar-panel" },
        h("div", { className: "month-nav" },
          h("button", { className: "icon-button", type: "button", onClick: () => setCursor(addMonths(cursor, -1)), "aria-label": "前の月" }, "‹"),
          h("h2", null, `${cursor.getFullYear()}年 ${cursor.getMonth() + 1}月`),
          h("button", { className: "icon-button", type: "button", onClick: () => setCursor(addMonths(cursor, 1)), "aria-label": "次の月" }, "›")
        ),
        h("div", { className: "week-row" }, ["日", "月", "火", "水", "木", "金", "土"].map((day) => h("span", { key: day }, day))),
        h("div", { className: "calendar-grid" },
          days.map((day) => {
            const key = dateKey(day);
            const dayRecords = recordsByDate[key] || [];
            return h("div", { key, className: "calendar-cell" + (day.getMonth() === cursor.getMonth() ? "" : " is-muted") },
              h("span", { className: "day-number" }, day.getDate()),
              h("div", { className: "day-photos" },
                dayRecords.slice(0, 3).map((record) => h("button", {
                  key: record.id,
                  className: "day-photo",
                  type: "button",
                  onClick: () => onOpenRecord(record.id),
                  title: `${formatDate(record.date)} ${contactNames(record, contactMap)}`
                },
                  h("img", { src: record.photo, alt: "登録写真" }),
                  record.done ? h("span", { className: "mini-done" }, "済") : null
                ))
              )
            );
          })
        )
      )
    );
  }

  function TopBar({ onBack, title }) {
    return h("header", { className: "top-bar" },
      h("button", { className: "back-button", type: "button", onClick: onBack, "aria-label": "戻る" }, "‹"),
      h("p", null, title),
      h("span", { className: "top-spacer" })
    );
  }

  function FieldBlock({ children, label }) {
    return h("div", { className: "field-block" }, h("span", { className: "field-label" }, label), children);
  }

  function ContactChips({ contacts, onToggle, selectedIds, single }) {
    return h("div", { className: "contact-grid" },
      contacts.map((contact) => {
        const active = selectedIds.includes(contact.id);
        return h("button", {
          key: contact.id,
          className: "contact-chip" + (active ? " is-active" : ""),
          type: "button",
          onClick: () => {
            if (single && active) {
              return;
            }
            onToggle(contact.id);
          }
        }, contact.name);
      })
    );
  }

  function FilterChip({ active, children, onClick }) {
    return h("button", { className: "filter-chip" + (active ? " is-active" : ""), type: "button", onClick }, children);
  }

  function buildHints(record, contactMap) {
    const names = contactNames(record, contactMap);
    const memo = record.memo.trim();
    const shortMemo = truncate(memo, 26);
    const tag = record.tag || "この話";

    return {
      opener: `${names}に見せるなら、「${formatDate(record.date)}の写真なんだけど」と日付から入ると自然です。`,
      punchline: makePunchline(memo, tag),
      questions: [
        `この写真の前後で、いちばん気持ちが動いたところはどこ？`,
        `相手にも聞ける形にすると「${tag}っぽいこと最近あった？」と言えそうです。`,
        shortMemo ? `メモの「${shortMemo}」を、最後の一言に回すと話がまとまりやすいです。` : "写真を見て最初に思い出す音や匂いを一つ足すと、話が広がります。"
      ]
    };
  }

  function makePunchline(memo, tag) {
    if (!memo.trim()) {
      return `最後は「だから${tag}として残しておきたかった」で締める。`;
    }

    if (memo.includes("緊張")) {
      return "緊張していたけど、終わった後のほうが自然に話せた、という流れで締める。";
    }
    if (memo.includes("久しぶり")) {
      return "久しぶりで少しぎこちなかったけど、写真を見ると距離が戻った感じがする、で締める。";
    }
    if (memo.includes("笑") || memo.includes("おもしろ")) {
      return "最後に笑えた一言を先に決めておいて、そこへ向かって短く話す。";
    }
    if (memo.includes("おいし") || memo.includes("飲み物") || memo.includes("食べ")) {
      return "食べ物や飲み物の話から入り、最後にその場の空気の話へつなげる。";
    }
    return `「${truncate(memo, 34)}」を最後に置いて、この写真を残した理由にする。`;
  }

  function suggestTag(text) {
    const memo = text.trim();
    if (!memo) {
      return "";
    }

    const rules = [
      ["緊張", "緊張"],
      ["発表", "発表"],
      ["久しぶり", "久しぶり"],
      ["偶然", "偶然"],
      ["笑", "笑った"],
      ["失敗", "失敗談"],
      ["おいし", "食べ物"],
      ["カフェ", "カフェ"],
      ["旅行", "旅行"],
      ["家族", "家族"],
      ["友達", "友達"],
      ["写真", "写真"],
      ["花火", "花火"]
    ];

    const found = rules.find(([keyword]) => memo.includes(keyword));
    if (found) {
      return found[1];
    }

    return truncate(memo.replace(/[、。\s]/g, ""), 8) || "記録";
  }

  function fileToPhoto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("写真を読み込めませんでした"));
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const maxSize = 1200;
          const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.84));
        };
        image.onerror = () => resolve(reader.result);
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function normalizeContacts(value) {
    if (!Array.isArray(value) || value.length === 0) {
      return defaultContacts;
    }
    return value.filter((contact) => contact && contact.id && contact.name);
  }

  function normalizeRecords(value) {
    if (!Array.isArray(value) || value.length === 0) {
      return sampleRecords;
    }
    return value
      .filter((record) => record && record.id && record.date)
      .map((record) => ({
        id: record.id,
        date: record.date,
        photo: record.photo || "assets/conversation-sample.png",
        memo: record.memo || "",
        recipients: Array.isArray(record.recipients) ? record.recipients : [],
        tag: record.tag || suggestTag(record.memo || ""),
        done: Boolean(record.done),
        doneAt: record.doneAt || "",
        createdAt: record.createdAt || new Date().toISOString()
      }));
  }

  function contactNames(record, contactMap) {
    const names = record.recipients.map((id) => contactMap[id]?.name).filter(Boolean);
    return names.length > 0 ? names.join("・") : "未設定";
  }

  function pickRandom(items) {
    if (!items.length) {
      return null;
    }
    return items[Math.floor(Math.random() * items.length)];
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDate(dateText) {
    const date = new Date(`${dateText}T00:00:00`);
    return new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(date);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  function calendarDays(cursor) {
    const first = startOfMonth(cursor);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }

  function truncate(text, length) {
    if (!text) {
      return "";
    }
    return text.length > length ? `${text.slice(0, length)}…` : text;
  }

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function readJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("保存できませんでした", error);
    }
  }

  const root = window.ReactDOM.createRoot ? window.ReactDOM.createRoot(rootElement) : null;
  if (root) {
    root.render(h(App));
  } else {
    window.ReactDOM.render(h(App), rootElement);
  }
})();



