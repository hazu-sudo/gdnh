import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
//#region src/components/BottomNav.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var tabs = [
	{
		id: "save",
		label: "挟む",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 4h12v16l-6-3-6 3V4Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 8h6M12 5v6" })] })
	},
	{
		id: "search",
		label: "探す",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "10.5",
			cy: "10.5",
			r: "5.5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m15 15 4 4" })] })
	},
	{
		id: "hints",
		label: "ヒント",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 18h6M10 21h4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8.2 14.5A6 6 0 1 1 15.8 14.5C14.6 15.4 14 16.2 14 17h-4c0-.8-.6-1.6-1.8-2.5Z" })] })
	},
	{
		id: "reflection",
		label: "振り返り",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 19V11M12 19V5M19 19v-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 19h18" })] })
	},
	{
		id: "settings",
		label: "設定",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" })] })
	}
];
function BottomNav({ activeTab, onChange, showHints, showReflection }) {
	const visibleTabs = tabs.filter((tab) => {
		if (tab.id === "reflection") return showReflection;
		if (tab.id === "hints") return showHints;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: `bottom-nav simple-nav tabs-${visibleTabs.length}`,
		"aria-label": "メインメニュー",
		children: visibleTabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			"aria-current": activeTab === tab.id ? "page" : void 0,
			className: activeTab === tab.id ? "nav-button active" : "nav-button",
			onClick: () => onChange(tab.id),
			type: "button",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				"aria-hidden": "true",
				children: tab.icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
		}, tab.id))
	});
}
//#endregion
//#region src/data.js
var APP_NAME = "あとで開くしおり";
var STORAGE_KEY = "later-open-shiori-bookmarks-v3";
var LEGACY_STORAGE_KEYS = [
	"later-open-shiori-bookmarks-v2",
	"later-open-shiori-bookmarks-v1",
	"meeting-shiori-bookmarks-v2",
	"meeting-shiori-bookmarks-v1"
];
var STATUS_LABELS = {
	unresolved: "未選択",
	pending: "保留",
	resolved: "話した"
};
function createSampleBookmarks() {
	return [
		{
			id: "sample-tanaka",
			targetName: "田中さん",
			memo: "今日の授業で面白いことがあった。次に会ったときに話したい。",
			status: "unresolved",
			createdAt: "2026-07-27"
		},
		{
			id: "sample-self",
			targetName: "未来の自分",
			memo: "帰ったら、今日うれしかったことをもう一度思い出す。",
			status: "pending",
			createdAt: "2026-07-25"
		},
		{
			id: "sample-yamada",
			targetName: "山田さん",
			memo: "この前助けてもらったことのお礼を伝えたい。",
			status: "resolved",
			createdAt: "2026-07-22"
		}
	];
}
//#endregion
//#region src/components/BookmarkCard.jsx
function formatJapaneseDate(date) {
	const [year, month, day] = date.split("-").map(Number);
	return `${year}年${month}月${day}日`;
}
function BookmarkCard({ bookmark, onOpen }) {
	const target = bookmark.targetName || "宛先なし";
	const memo = bookmark.memo || "メモなし";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: `bookmark-card simple-card ${bookmark.status}`,
		onClick: () => onOpen(bookmark),
		type: "button",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "bookmark-ribbon",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "simple-card-head",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [target, bookmark.targetName ? "へ" : ""] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: bookmark.memo ? "simple-card-memo" : "simple-card-memo empty-value",
				children: memo
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "simple-card-foot",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
					dateTime: bookmark.createdAt,
					children: formatJapaneseDate(bookmark.createdAt)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `status-label ${bookmark.status}`,
					children: STATUS_LABELS[bookmark.status]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "card-chevron",
				"aria-hidden": "true",
				children: "›"
			})
		]
	});
}
//#endregion
//#region src/utils.js
function formatToday() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE");
}
function uniqueId() {
	if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function pickRandom(items, currentId = "") {
	if (items.length <= 1) return items[0] || null;
	const candidates = items.filter((item) => item.id !== currentId);
	return candidates[Math.floor(Math.random() * candidates.length)];
}
function sortNewest(bookmarks) {
	return [...bookmarks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
//#endregion
//#region src/screens/SaveScreen.jsx
var ITEM_HEIGHT = 44;
function getDateParts(date) {
	const [year, month, day] = date.split("-").map(Number);
	return {
		year,
		month,
		day
	};
}
function toDateKey({ year, month, day }) {
	return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function daysInMonth(year, month) {
	return new Date(year, month, 0).getDate();
}
function WheelColumn({ label, options, value, onChange, suffix }) {
	const ref = (0, import_react.useRef)(null);
	const timeout = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const index = options.indexOf(value);
		if (index >= 0 && ref.current) ref.current.scrollTo({
			top: index * ITEM_HEIGHT,
			behavior: "instant"
		});
	}, [options, value]);
	function handleScroll(event) {
		clearTimeout(timeout.current);
		const element = event.currentTarget;
		timeout.current = setTimeout(() => {
			const index = Math.max(0, Math.min(options.length - 1, Math.round(element.scrollTop / ITEM_HEIGHT)));
			onChange(options[index]);
			element.scrollTo({
				top: index * ITEM_HEIGHT,
				behavior: "smooth"
			});
		}, 90);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wheel-column",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "wheel-list",
			onScroll: handleScroll,
			ref,
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: option === value ? "wheel-option active" : "wheel-option",
				onClick: () => onChange(option),
				type: "button",
				children: [option, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: suffix })]
			}, option))
		})]
	});
}
function DateWheel({ date, onCancel, onConfirm }) {
	const [draft, setDraft] = (0, import_react.useState)(getDateParts(date));
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const years = (0, import_react.useMemo)(() => Array.from({ length: 12 }, (_, index) => currentYear - 7 + index), [currentYear]);
	const months = (0, import_react.useMemo)(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
	const days = (0, import_react.useMemo)(() => Array.from({ length: daysInMonth(draft.year, draft.month) }, (_, index) => index + 1), [draft.month, draft.year]);
	(0, import_react.useEffect)(() => {
		if (draft.day > days.length) setDraft((current) => ({
			...current,
			day: days.length
		}));
	}, [days.length, draft.day]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "modal-backdrop",
		onClick: onCancel,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": "日付を選ぶ",
			"aria-modal": "true",
			className: "date-sheet",
			onClick: (event) => event.stopPropagation(),
			role: "dialog",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sheet-handle" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "date-sheet-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-button",
							onClick: onCancel,
							type: "button",
							children: "キャンセル"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "日付を選ぶ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-button strong",
							onClick: () => onConfirm(toDateKey(draft)),
							type: "button",
							children: "決定"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "wheel-picker",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "wheel-highlight",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelColumn, {
							label: "年",
							onChange: (year) => setDraft((current) => ({
								...current,
								year
							})),
							options: years,
							suffix: "年",
							value: draft.year
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelColumn, {
							label: "月",
							onChange: (month) => setDraft((current) => ({
								...current,
								month
							})),
							options: months,
							suffix: "月",
							value: draft.month
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelColumn, {
							label: "日",
							onChange: (day) => setDraft((current) => ({
								...current,
								day
							})),
							options: days,
							suffix: "日",
							value: draft.day
						})
					]
				})
			]
		})
	});
}
function SaveScreen({ bookmarks, initialMemo, onInitialMemoConsumed, onSave, onShowBookmarks }) {
	const [date, setDate] = (0, import_react.useState)(formatToday());
	const [targetName, setTargetName] = (0, import_react.useState)("");
	const [memo, setMemo] = (0, import_react.useState)("");
	const [dateOpen, setDateOpen] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!initialMemo) return;
		setMemo(initialMemo);
		setSaved(false);
		onInitialMemoConsumed?.();
	}, [initialMemo, onInitialMemoConsumed]);
	const recipientStats = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		bookmarks.forEach((item) => {
			if (item.targetName) counts.set(item.targetName, (counts.get(item.targetName) || 0) + 1);
		});
		return [...counts.entries()].map(([name, count]) => ({
			name,
			count
		})).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
	}, [bookmarks]);
	const suggestions = recipientStats.filter((item) => item.count > 1).slice(0, 5);
	function submit(event) {
		event.preventDefault();
		onSave({
			id: uniqueId(),
			targetName: targetName.trim(),
			memo: memo.trim(),
			status: "unresolved",
			createdAt: date
		});
		setTargetName("");
		setMemo("");
		setDate(formatToday());
		setSaved(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "screen save-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "minimal-header",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand-lockup compact-brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "brand-mark blank-mark",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: APP_NAME })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "save-intro",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "NEW SHIORI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"あとで話したいことを",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"「しおり」に挟む"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "話したいことを忘れないように。思いを自由にしおりに残す。" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "quick-form",
				onSubmit: submit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "simple-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "日付" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "date-trigger form-date-trigger",
							onClick: () => setDateOpen(true),
							type: "button",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 24 24",
									"aria-hidden": "true",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "4",
										y: "6",
										width: "16",
										height: "14",
										rx: "2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 3v5M16 3v5M4 10h16" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatJapaneseDate(date) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "›"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "simple-field",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["誰に話す ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "任意" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								list: "recipient-history",
								onChange: (event) => {
									setTargetName(event.target.value);
									setSaved(false);
								},
								placeholder: "だれに話すか入力",
								value: targetName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
								id: "recipient-history",
								children: recipientStats.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: item.name }, item.name))
							})
						]
					}),
					suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "recipient-suggestions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "よく登録する人" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "recipient-chips",
							children: suggestions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setTargetName(item.name),
								type: "button",
								children: [item.name, item.count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.count })]
							}, item.name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "simple-field",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ひとことメモ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "任意" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								maxLength: "180",
								onChange: (event) => {
									setMemo(event.target.value);
									setSaved(false);
								},
								placeholder: "あとで話したいことを、ひとこと残す",
								rows: "3",
								value: memo
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
								className: "character-count",
								children: [memo.length, " / 180"]
							})
						]
					}),
					saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "saved-note",
						"aria-live": "polite",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "✓"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "しおりを挟みました" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "あとで、日付か話す相手から開けます。" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "primary-button quick-save",
						type: "submit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mini-ribbon",
							"aria-hidden": "true"
						}), "挟む"]
					}),
					saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-button centered",
						onClick: onShowBookmarks,
						type: "button",
						children: "挟んだしおりを見る"
					})
				]
			}),
			dateOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateWheel, {
				date,
				onCancel: () => setDateOpen(false),
				onConfirm: (nextDate) => {
					setDate(nextDate);
					setDateOpen(false);
					setSaved(false);
				}
			})
		]
	});
}
//#endregion
//#region src/components/SharePreview.jsx
function wrapCanvasText(context, text, maxWidth) {
	const lines = [];
	String(text || "メモなし").split(/\r?\n/).forEach((paragraph) => {
		let line = "";
		[...paragraph].forEach((character) => {
			const next = line + character;
			if (context.measureText(next).width > maxWidth && line) {
				lines.push(line);
				line = character;
			} else line = next;
		});
		lines.push(line || " ");
	});
	return lines.slice(0, 10);
}
function renderCard({ createdAt, memo, senderName, showDear, showFrom, targetName }) {
	const canvas = document.createElement("canvas");
	canvas.width = 1080;
	canvas.height = 1350;
	const context = canvas.getContext("2d");
	context.fillStyle = "#f4e7d3";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#fffaf1";
	context.beginPath();
	context.roundRect(72, 72, 936, 1206, 42);
	context.fill();
	context.fillStyle = "#d97d65";
	context.beginPath();
	context.moveTo(850, 72);
	context.lineTo(950, 72);
	context.lineTo(950, 238);
	context.lineTo(900, 208);
	context.lineTo(850, 238);
	context.closePath();
	context.fill();
	context.fillStyle = "#6e554b";
	context.textBaseline = "top";
	context.font = "600 38px \"Noto Sans JP\", sans-serif";
	let y = 170;
	if (showDear) {
		context.fillText(`Dear ${targetName || "あなたへ"}`, 150, y);
		y += 120;
	}
	context.fillStyle = "#3f342f";
	context.font = "500 48px \"Noto Sans JP\", sans-serif";
	wrapCanvasText(context, memo, 760).forEach((line) => {
		context.fillText(line, 150, y);
		y += 78;
	});
	context.fillStyle = "#9d8a7d";
	context.fillRect(150, 1050, 760, 2);
	context.font = "500 32px \"Noto Sans JP\", sans-serif";
	context.fillText(formatJapaneseDate(createdAt), 150, 1100);
	if (showFrom) {
		context.textAlign = "right";
		context.fillStyle = "#6e554b";
		context.fillText(`From ${senderName || "名前なし"}`, 910, 1160);
	}
	return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
function SharePreview({ bookmark, defaultSenderName, onClose }) {
	const [targetName, setTargetName] = (0, import_react.useState)(bookmark.targetName);
	const [memo, setMemo] = (0, import_react.useState)(bookmark.memo);
	const [senderName, setSenderName] = (0, import_react.useState)(defaultSenderName);
	const [showDear, setShowDear] = (0, import_react.useState)(true);
	const [showFrom, setShowFrom] = (0, import_react.useState)(true);
	const [message, setMessage] = (0, import_react.useState)("");
	async function shareCard() {
		const blob = await renderCard({
			createdAt: bookmark.createdAt,
			memo,
			senderName,
			showDear,
			showFrom,
			targetName
		});
		if (!blob) return;
		const file = new File([blob], "ato-de-hiraku-shiori.png", { type: "image/png" });
		try {
			if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
				await navigator.share({
					files: [file],
					title: "あとで開くしおり"
				});
				setMessage("共有メニューを開きました");
				return;
			}
		} catch (error) {
			if (error?.name === "AbortError") return;
		}
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = file.name;
		anchor.click();
		URL.revokeObjectURL(url);
		setMessage("画像として保存しました");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "screen share-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "detail-header",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back-button",
						onClick: onClose,
						type: "button",
						"aria-label": "共有をキャンセル",
						children: "‹"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "共有前の確認" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "header-spacer" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "share-card-preview",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "share-card-ribbon",
						"aria-hidden": "true"
					}),
					showDear && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "share-dear",
						children: ["Dear ", targetName || "あなたへ"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: memo ? "share-message" : "share-message empty-value",
						children: memo || "メモなし"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: formatJapaneseDate(bookmark.createdAt) }), showFrom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["From ", senderName || "名前なし"] })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "share-editor",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "simple-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "宛先" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							onChange: (event) => setTargetName(event.target.value),
							value: targetName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "simple-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "文章" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							maxLength: "180",
							onChange: (event) => setMemo(event.target.value),
							rows: "4",
							value: memo
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "simple-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "差出人名" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							onChange: (event) => setSenderName(event.target.value),
							value: senderName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "share-display-options",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							checked: showDear,
							onChange: (event) => setShowDear(event.target.checked),
							type: "checkbox"
						}), "Dearを表示"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							checked: showFrom,
							onChange: (event) => setShowFrom(event.target.checked),
							type: "checkbox"
						}), "Fromを表示"] })]
					})
				]
			}),
			message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "share-message-note",
				"aria-live": "polite",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "share-actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "secondary-button",
					onClick: onClose,
					type: "button",
					children: "キャンセル"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "primary-button",
					onClick: shareCard,
					type: "button",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 24 24",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 16V4M8 8l4-4 4 4M5 12v7h14v-7" })
					}), "端末で共有"]
				})]
			})
		]
	});
}
//#endregion
//#region src/screens/SearchScreen.jsx
var weekdays$1 = [
	"日",
	"月",
	"火",
	"水",
	"木",
	"金",
	"土"
];
function dateKey$1(date) {
	return date.toLocaleDateString("sv-SE");
}
function monthKey$1(date) {
	return dateKey$1(date).slice(0, 7);
}
function buildMonth(key) {
	const [year, month] = key.split("-").map(Number);
	const first = new Date(year, month - 1, 1);
	const last = new Date(year, month, 0);
	const days = Array.from({ length: first.getDay() }, () => null);
	for (let day = 1; day <= last.getDate(); day += 1) days.push({
		day,
		iso: dateKey$1(new Date(year, month - 1, day))
	});
	while (days.length % 7) days.push(null);
	return days;
}
function shiftMonth(key, amount) {
	const [year, month] = key.split("-").map(Number);
	return monthKey$1(new Date(year, month - 1 + amount, 1));
}
function memoPreview(memo) {
	const firstLine = memo.split(/\r?\n/)[0].trim();
	if (!firstLine) return "メモなし";
	return firstLine.length > 18 ? `${firstLine.slice(0, 18)}…` : firstLine;
}
function DetailView({ bookmark, onBack, onUpdateBookmark, onUpdateStatus, senderName }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const [targetName, setTargetName] = (0, import_react.useState)(bookmark.targetName);
	const [memo, setMemo] = (0, import_react.useState)(bookmark.memo);
	const [createdAt, setCreatedAt] = (0, import_react.useState)(bookmark.createdAt);
	const [status, setStatus] = (0, import_react.useState)(bookmark.status);
	const [dateOpen, setDateOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!editing) setStatus(bookmark.status);
	}, [bookmark.status, editing]);
	if (sharing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SharePreview, {
		bookmark,
		defaultSenderName: senderName,
		onClose: () => setSharing(false)
	});
	function cancelEdit() {
		setTargetName(bookmark.targetName);
		setMemo(bookmark.memo);
		setCreatedAt(bookmark.createdAt);
		setStatus(bookmark.status);
		setEditing(false);
	}
	function saveEdit() {
		onUpdateBookmark(bookmark.id, {
			targetName: targetName.trim(),
			memo: memo.trim(),
			createdAt,
			status
		});
		setEditing(false);
	}
	function changeStatus(nextStatus) {
		if (editing) setStatus(nextStatus);
		else {
			setStatus(nextStatus);
			onUpdateStatus(bookmark.id, nextStatus);
		}
	}
	const currentStatus = editing ? status : bookmark.status;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "screen detail-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "detail-header",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "back-button",
						onClick: onBack,
						type: "button",
						"aria-label": "一覧へ戻る",
						children: "‹"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "しおりを開く" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "detail-header-actions",
						children: [!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "しおりを共有",
							className: "detail-share-button",
							onClick: () => setSharing(true),
							type: "button",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 16V4M8 8l4-4 4 4M5 12v7h14v-7" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: editing ? "detail-edit-button active" : "detail-edit-button",
							onClick: () => editing ? cancelEdit() : setEditing(true),
							type: "button",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 24 24",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m5 16-.7 3.7L8 19l9.6-9.6-3-3L5 16Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m13.5 7.5 3 3" })]
							}), editing ? "取消" : "編集"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: `detail-paper ${currentStatus}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "detail-ribbon",
						"aria-hidden": "true"
					}),
					editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "detail-date-edit",
						onClick: () => setDateOpen(true),
						type: "button",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 24 24",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "4",
									y: "6",
									width: "16",
									height: "14",
									rx: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 3v5M16 3v5M4 10h16" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatJapaneseDate(createdAt) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								"aria-hidden": "true",
								children: "›"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						dateTime: bookmark.createdAt,
						children: formatJapaneseDate(bookmark.createdAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "detail-label",
						children: "だれに話す"
					}),
					editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "だれに話すかを編集",
						className: "detail-edit-input",
						onChange: (event) => setTargetName(event.target.value),
						value: targetName
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: bookmark.targetName ? `${bookmark.targetName}へ` : "宛先なし" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "detail-divider" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "detail-label",
						children: "ひとことメモ"
					}),
					editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						"aria-label": "ひとことメモを編集",
						className: "detail-edit-memo",
						maxLength: "180",
						onChange: (event) => setMemo(event.target.value),
						rows: "4",
						value: memo
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: bookmark.memo ? "detail-memo" : "detail-memo empty-value",
						children: bookmark.memo || "メモなし"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "detail-status",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "状態" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "status-choice-buttons",
							role: "group",
							"aria-label": "しおりの状態",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-pressed": currentStatus === "pending",
									className: currentStatus === "pending" ? "status-choice pending active" : "status-choice pending",
									onClick: () => changeStatus("pending"),
									type: "button",
									children: "保留"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-pressed": currentStatus === "resolved",
									className: currentStatus === "resolved" ? "status-choice resolved active" : "status-choice resolved",
									onClick: () => changeStatus("resolved"),
									type: "button",
									children: "話した"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-pressed": currentStatus === "unresolved",
									className: currentStatus === "unresolved" ? "status-choice unresolved active" : "status-choice unresolved",
									onClick: () => changeStatus("unresolved"),
									type: "button",
									children: "選択解除"
								})
							]
						})]
					})
				]
			}),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "edit-actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "edit-cancel",
					onClick: cancelEdit,
					type: "button",
					children: "キャンセル"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "edit-save",
					onClick: saveEdit,
					type: "button",
					children: "変更を保存"
				})]
			}) : null,
			dateOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateWheel, {
				date: createdAt,
				onCancel: () => setDateOpen(false),
				onConfirm: (nextDate) => {
					setCreatedAt(nextDate);
					setDateOpen(false);
				}
			})
		]
	});
}
function SearchScreen({ bookmarks, onUpdateBookmark, onUpdateStatus, senderName }) {
	const [mode, setMode] = (0, import_react.useState)("");
	const [chooserOpen, setChooserOpen] = (0, import_react.useState)(false);
	const [calendarMonth, setCalendarMonth] = (0, import_react.useState)(monthKey$1(/* @__PURE__ */ new Date()));
	const [selectedDate, setSelectedDate] = (0, import_react.useState)("");
	const [selectedTarget, setSelectedTarget] = (0, import_react.useState)("");
	const [selectedId, setSelectedId] = (0, import_react.useState)("");
	const today = dateKey$1(/* @__PURE__ */ new Date());
	const days = (0, import_react.useMemo)(() => buildMonth(calendarMonth), [calendarMonth]);
	const selectedBookmark = bookmarks.find((item) => item.id === selectedId);
	const floatingBookmarks = (0, import_react.useMemo)(() => sortNewest(bookmarks).slice(0, 7), [bookmarks]);
	const dayCounts = (0, import_react.useMemo)(() => {
		const counts = {};
		bookmarks.forEach((item) => {
			counts[item.createdAt] = (counts[item.createdAt] || 0) + 1;
		});
		return counts;
	}, [bookmarks]);
	const recipients = (0, import_react.useMemo)(() => {
		const groups = /* @__PURE__ */ new Map();
		bookmarks.filter((item) => item.targetName).forEach((item) => {
			const current = groups.get(item.targetName) || [];
			groups.set(item.targetName, [...current, item]);
		});
		return [...groups.entries()].map(([name, items]) => ({
			name,
			count: items.length,
			latest: sortNewest(items)[0]?.createdAt
		})).sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest));
	}, [bookmarks]);
	const results = (0, import_react.useMemo)(() => {
		if (mode === "calendar" && selectedDate) return sortNewest(bookmarks.filter((item) => item.createdAt === selectedDate));
		if (mode === "recipient" && selectedTarget) return sortNewest(bookmarks.filter((item) => item.targetName === selectedTarget));
		return [];
	}, [
		bookmarks,
		mode,
		selectedDate,
		selectedTarget
	]);
	if (selectedBookmark) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailView, {
		bookmark: selectedBookmark,
		onBack: () => setSelectedId(""),
		onUpdateBookmark,
		onUpdateStatus,
		senderName
	});
	function chooseSearchMode(nextMode) {
		setMode(nextMode);
		setChooserOpen(false);
		setSelectedDate("");
		setSelectedTarget("");
	}
	function returnToPortal() {
		setMode("");
		setChooserOpen(false);
		setSelectedDate("");
		setSelectedTarget("");
	}
	if (!mode) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "screen search-portal-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: chooserOpen ? "search-portal chooser-open" : "search-portal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "探し方を選ぶ",
					className: "portal-tap-layer",
					onClick: () => setChooserOpen(true),
					type: "button"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "portal-heading",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "FIND A SHIORI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "しおりを探す" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "これまで挟んだ気持ちが、ここで静かに待っています。" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "floating-bookmarks",
					"aria-hidden": "true",
					children: floatingBookmarks.length > 0 ? floatingBookmarks.map((bookmark, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `floating-shiori bubble-${index + 1}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "floating-ribbon" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bookmark.targetName || "宛先なし" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: memoPreview(bookmark.memo) })
						]
					}, bookmark.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "floating-shiori bubble-1 placeholder-bubble",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "floating-ribbon" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "未来の自分" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "話したいことを、ここに…" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "floating-shiori bubble-3 placeholder-bubble",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "floating-ribbon" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "だれかへ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "しおりが静かに待ちます" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "floating-shiori bubble-6 placeholder-bubble",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "floating-ribbon" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "あとで" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "開ける場所をつくる" })
							]
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "portal-prompt",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 4v12M8 12l4 4 4-4" })
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"画面をタップして、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"探し方をえらぶ"
					] })]
				}),
				chooserOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-label": "しおりの探し方",
					"aria-modal": "true",
					className: "search-choice-overlay",
					onClick: () => setChooserOpen(false),
					role: "dialog",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "search-choice-dialog",
						onClick: (event) => event.stopPropagation(),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "HOW TO FIND"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "どちらで探す？" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "探し方を閉じる",
								className: "choice-close-button",
								onClick: () => setChooserOpen(false),
								type: "button",
								children: "×"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "search-choice-buttons",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "search-choice calendar-choice",
									onClick: () => chooseSearchMode("calendar"),
									type: "button",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "choice-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 24 24",
											"aria-hidden": "true",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
												x: "4",
												y: "6",
												width: "16",
												height: "14",
												rx: "2"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 3v5M16 3v5M4 10h16M8 14h3M13 14h3" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "カレンダー" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "search-choice person-choice",
									onClick: () => chooseSearchMode("recipient"),
									type: "button",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "choice-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 24 24",
											"aria-hidden": "true",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.5 7.5h17v11h-17z" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m4 8 8 6 8-6" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m4 18 5.5-5M20 18l-5.5-5" })
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "話す相手" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "choice-back-text",
								onClick: () => setChooserOpen(false),
								type: "button",
								children: "とじる"
							})
						]
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "screen search-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "search-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "portal-back-button",
						onClick: returnToPortal,
						type: "button",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "‹"
						}), " 探し方へ戻る"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: mode === "calendar" ? "BY DATE" : "BY PERSON"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: mode === "calendar" ? "カレンダーから探す" : "話したい相手から探す" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: mode === "calendar" ? "日付を押すと、その日に挟んだしおりが開きます。" : "相手を選ぶと、その人へ残したしおりを新しい順に見られます。" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "search-tabs",
				role: "tablist",
				"aria-label": "しおりの探し方",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					"aria-selected": mode === "calendar",
					className: mode === "calendar" ? "active" : "",
					onClick: () => {
						setMode("calendar");
						setSelectedTarget("");
					},
					role: "tab",
					type: "button",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: "4",
							y: "6",
							width: "16",
							height: "14",
							rx: "2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 3v5M16 3v5M4 10h16" })]
					}), "カレンダー"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					"aria-selected": mode === "recipient",
					className: mode === "recipient" ? "active" : "",
					onClick: () => {
						setMode("recipient");
						setSelectedDate("");
					},
					role: "tab",
					type: "button",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "12",
							cy: "8",
							r: "3.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.5 20c.5-4 2.6-6 6.5-6s6 2 6.5 6" })]
					}), "話す相手から探す"]
				})]
			}),
			mode === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "calendar-paper simple-calendar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "calendar-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "前の月",
								className: "circle-button",
								onClick: () => setCalendarMonth(shiftMonth(calendarMonth, -1)),
								type: "button",
								children: "‹"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [calendarMonth.replace("-", "年"), "月"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "次の月",
								className: "circle-button",
								onClick: () => setCalendarMonth(shiftMonth(calendarMonth, 1)),
								type: "button",
								children: "›"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "calendar-weekdays",
						children: weekdays$1.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: day }, day))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "calendar-grid",
						children: days.map((item, index) => item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							"aria-label": `${item.iso}${dayCounts[item.iso] ? `、しおり${dayCounts[item.iso]}件` : ""}`,
							className: [
								"day-button",
								selectedDate === item.iso ? "active" : "",
								today === item.iso ? "today" : ""
							].filter(Boolean).join(" "),
							onClick: () => setSelectedDate(item.iso),
							type: "button",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.day }), dayCounts[item.iso] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "date-bookmark-mark",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), dayCounts[item.iso] > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: dayCounts[item.iso] })]
							})]
						}, item.iso) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "day-spacer" }, `space-${index}`))
					})
				]
			}),
			mode === "recipient" && !selectedTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "recipient-list",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "list-caption",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "これまでに入力した相手" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [recipients.length, "人"] })]
					}),
					recipients.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelectedTarget(item.name),
						type: "button",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "recipient-initial",
								children: item.name.slice(0, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["最近のしおり　", formatJapaneseDate(item.latest)] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [item.count, "件"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								"aria-hidden": "true",
								children: "›"
							})
						]
					}, item.name)),
					!recipients.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty",
						children: "まだ話す相手が登録されていません。"
					})
				]
			}),
			(selectedDate || selectedTarget) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bookmark-results",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "list-caption",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [selectedTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "inline-back",
							onClick: () => setSelectedTarget(""),
							type: "button",
							children: "‹ 相手の一覧"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: selectedTarget ? `${selectedTarget}へのしおり` : formatJapaneseDate(selectedDate) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [results.length, "件"] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-list",
						children: results.map((bookmark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCard, {
							bookmark,
							onOpen: () => setSelectedId(bookmark.id)
						}, bookmark.id))
					}),
					!results.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty",
						children: "この日に挟んだしおりはありません。"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/screens/SettingsScreen.jsx
var sizes = [
	{
		id: "small",
		label: "小",
		sample: "Aa",
		description: "コンパクト"
	},
	{
		id: "standard",
		label: "標準",
		sample: "Aa",
		description: "おすすめ"
	},
	{
		id: "large",
		label: "大",
		sample: "Aa",
		description: "ゆったり"
	}
];
var themes = [
	{
		id: "orange",
		label: "オレンジ",
		colors: ["#fff8ec", "#e47f65"]
	},
	{
		id: "pink",
		label: "ピンク",
		colors: ["#fff5f6", "#d9778d"]
	},
	{
		id: "blue",
		label: "ブルー",
		colors: ["#f3f8fa", "#628da5"]
	},
	{
		id: "green",
		label: "グリーン",
		colors: ["#f4f9f4", "#669277"]
	},
	{
		id: "purple",
		label: "パープル",
		colors: ["#f8f5fa", "#8d78a5"]
	},
	{
		id: "mono",
		label: "白黒",
		colors: ["#f7f7f5", "#565656"]
	}
];
function ToggleSetting({ checked, description, label, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "toggle-setting",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			"aria-checked": checked,
			className: checked ? "switch-control active" : "switch-control",
			onClick: () => onChange(!checked),
			role: "switch",
			type: "button",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: checked ? "ON" : "OFF" })]
		})]
	});
}
function SettingsScreen({ fontSize, hintIntroSeen, onFontSizeChange, onHintIntroSeen, onHintVisibilityChange, onReflectionChange, onSenderNameChange, onThemeChange, senderName, showHints, showReflection, theme }) {
	const [showHintDialog, setShowHintDialog] = (0, import_react.useState)(false);
	function requestHintChange(next) {
		if (next && !hintIntroSeen) {
			setShowHintDialog(true);
			return;
		}
		onHintVisibilityChange(next);
	}
	function decideHints(show) {
		onHintIntroSeen();
		onHintVisibilityChange(show);
		setShowHintDialog(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "screen settings-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "settings-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand-lockup compact-brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-mark blank-mark",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: APP_NAME })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "SETTINGS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"使い心地を、",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"自分に合わせる。"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "毎日気持ちよく使えるように、自分の好みに設定できます。" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "settings-group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "文字と表示" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "settings-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "settings-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "settings-icon color-icon",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "背景とテーマカラー" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "気分になじむ色を選べます" })] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "theme-options",
							role: "radiogroup",
							"aria-label": "背景とテーマカラー",
							children: themes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								"aria-checked": theme === item.id,
								className: theme === item.id ? "theme-option active" : "theme-option",
								onClick: () => onThemeChange(item.id),
								role: "radio",
								type: "button",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "theme-swatch",
										style: {
											"--swatch-bg": item.colors[0],
											"--swatch-accent": item.colors[1]
										},
										"aria-hidden": "true",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.label }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										"aria-hidden": "true",
										children: theme === item.id ? "✓" : ""
									})
								]
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "settings-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "settings-title",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "settings-icon",
								"aria-hidden": "true",
								children: "あ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "文字の大きさ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "アプリ全体の文字と余白が変わります" })] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-size-options",
							role: "radiogroup",
							"aria-label": "文字の大きさ",
							children: sizes.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								"aria-checked": fontSize === size.id,
								className: fontSize === size.id ? `font-option ${size.id} active` : `font-option ${size.id}`,
								onClick: () => onFontSizeChange(size.id),
								role: "radio",
								type: "button",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: size.sample }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: size.label }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: size.description }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
										"aria-hidden": "true",
										children: fontSize === size.id ? "✓" : ""
									})
								]
							}, size.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "settings-group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "表示する機能" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "settings-panel setting-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleSetting, {
							checked: showReflection,
							description: "登録したしおりと、話したしおりを週ごと・月ごとに振り返ります",
							label: "しおりの振り返りを表示する",
							onChange: onReflectionChange
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleSetting, {
							checked: showHints,
							description: "話題に迷ったとき、ランダムな雑学を引けます",
							label: "会話のヒントを表示する",
							onChange: requestHintChange
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "setting-helper",
							children: "OFFにしても、これまでのしおりや設定は消えません。"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "settings-group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "共有設定" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "settings-panel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "simple-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "共有時の差出人名" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							onChange: (event) => onSenderNameChange(event.target.value),
							placeholder: "例：はるき",
							value: senderName
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "setting-helper",
						children: "共有プレビューで、毎回変更することもできます。"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "settings-note",
				children: "選んだ設定は、この端末に保存されます。"
			}),
			showHintDialog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-modal": "true",
					className: "confirm-dialog",
					role: "dialog",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "dialog-bookmark",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "会話のヒント" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "会話に迷ったとき、ランダムな話のヒントを使えます。表示しますか？" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "secondary-button",
							onClick: () => decideHints(false),
							type: "button",
							children: "今は表示しない"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary-button",
							onClick: () => decideHints(true),
							type: "button",
							children: "表示する"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
//#region src/screens/ReflectionScreen.jsx
var weekdays = [
	"月",
	"火",
	"水",
	"木",
	"金",
	"土",
	"日"
];
function dateKey(date) {
	return date.toLocaleDateString("sv-SE");
}
function monthKey(date) {
	return dateKey(date).slice(0, 7);
}
function addDays(date, amount) {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
}
function startOfCurrentWeek() {
	const today = /* @__PURE__ */ new Date();
	return addDays(today, -((today.getDay() + 6) % 7));
}
function getStats(bookmarks) {
	return {
		total: bookmarks.length,
		resolved: bookmarks.filter((item) => item.status === "resolved").length,
		pending: bookmarks.filter((item) => item.status === "pending").length,
		unresolved: bookmarks.filter((item) => item.status === "unresolved").length
	};
}
function buildWeeklyData(bookmarks) {
	const monday = startOfCurrentWeek();
	return weekdays.map((label, index) => {
		const date = addDays(monday, index);
		const key = dateKey(date);
		const items = bookmarks.filter((item) => item.createdAt === key);
		return {
			key,
			label,
			sublabel: `${date.getMonth() + 1}/${date.getDate()}`,
			...getStats(items)
		};
	});
}
function buildMonthlyData(bookmarks) {
	const today = /* @__PURE__ */ new Date();
	return Array.from({ length: 6 }, (_, index) => {
		const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
		const key = monthKey(date);
		const items = bookmarks.filter((item) => item.createdAt.startsWith(key));
		return {
			key,
			label: `${date.getMonth() + 1}月`,
			year: date.getFullYear(),
			...getStats(items)
		};
	});
}
function StackedBarChart({ data, onSelect, selectedKey }) {
	const maximum = Math.max(1, ...data.map((item) => item.total));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "chart-scroll",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "chart-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chart-y-axis",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: maximum }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chart-area",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chart-guide top" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chart-guide middle" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "chart-guide bottom" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "chart-columns",
						children: data.map((item) => {
							const height = `${item.total / maximum * 100}%`;
							const resolvedHeight = item.total ? `${item.resolved / item.total * 100}%` : "0%";
							const remainingHeight = item.total ? `${(item.total - item.resolved) / item.total * 100}%` : "0%";
							const column = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bar-value",
									children: item.total || ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bar-track",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "bar-stack",
										style: { height },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: "bar-remaining",
											style: { height: remainingHeight }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
											className: "bar-resolved",
											style: { height: resolvedHeight }
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.label }),
								item.sublabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.sublabel })
							] });
							return onSelect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": `${item.label}、挟んだしおり${item.total}枚、話せたしおり${item.resolved}枚`,
								className: selectedKey === item.key ? "chart-column active" : "chart-column",
								onClick: () => onSelect(item.key),
								type: "button",
								children: column
							}, item.key) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								"aria-label": `${item.label}、挟んだしおり${item.total}枚、話せたしおり${item.resolved}枚`,
								className: "chart-column",
								children: column
							}, item.key);
						})
					})
				]
			})]
		})
	});
}
function GentleSummary({ period, stats }) {
	if (stats.total === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gentle-summary empty-summary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: "栞"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [period, "は、まだしおりがありません"] }), "話したいことが見つかったときに、そっと挟んでみましょう。"] })]
	});
	if (stats.resolved === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gentle-summary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: "栞"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
				period,
				"は",
				stats.total,
				"枚のしおりを挟みました"
			] }),
			"あとで開けるしおりが",
			stats.total,
			"枚あります。"
		] })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gentle-summary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: "栞"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
				period,
				"は",
				stats.total,
				"枚のしおりを挟みました"
			] }),
			"そのうち",
			stats.resolved,
			"枚を話すことができました。"
		] })]
	});
}
function ReflectionScreen({ bookmarks }) {
	const [mode, setMode] = (0, import_react.useState)("week");
	const weeklyData = (0, import_react.useMemo)(() => buildWeeklyData(bookmarks), [bookmarks]);
	const monthlyData = (0, import_react.useMemo)(() => buildMonthlyData(bookmarks), [bookmarks]);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(monthlyData.at(-1)?.key || "");
	const weekStats = (0, import_react.useMemo)(() => getStats(weeklyData.flatMap((day) => bookmarks.filter((item) => item.createdAt === day.key))), [bookmarks, weeklyData]);
	const selectedMonthData = monthlyData.find((item) => item.key === selectedMonth) || monthlyData.at(-1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "screen reflection-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "reflection-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "LOOK BACK"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "しおりの振り返り" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "残した気持ちと、会話につながったしおりを、ゆっくり眺めます。" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "period-switch",
				role: "tablist",
				"aria-label": "振り返る期間",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-selected": mode === "week",
					className: mode === "week" ? "active" : "",
					onClick: () => setMode("week"),
					role: "tab",
					type: "button",
					children: "週ごと"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-selected": mode === "month",
					className: mode === "month" ? "active" : "",
					onClick: () => setMode("month"),
					role: "tab",
					type: "button",
					children: "月ごと"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "reflection-panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "chart-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: mode === "week" ? "今週" : "過去6か月" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: mode === "week" ? "月曜日から日曜日まで" : "しおりを挟んだ月" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "単位：枚" })]
					}),
					mode === "week" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackedBarChart, { data: weeklyData }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackedBarChart, {
						data: monthlyData,
						onSelect: setSelectedMonth,
						selectedKey: selectedMonth
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chart-legend",
						"aria-label": "グラフの凡例",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "legend-resolved" }), "話せた"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "legend-remaining" }), "まだ話していない・保留中"] })]
					})
				]
			}),
			mode === "week" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GentleSummary, {
				period: "今週",
				stats: weekStats
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "month-detail",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedMonthData.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [selectedMonthData.year, "年"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "month-detail-ribbon",
					"aria-hidden": "true"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "挟んだしおり" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [selectedMonthData.total, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "枚" })] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "話せたしおり" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [selectedMonthData.resolved, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "枚" })] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "保留中" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [selectedMonthData.pending, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "枚" })] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "まだ選択していない" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [selectedMonthData.unresolved, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "枚" })] })] })
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GentleSummary, {
				period: "この月",
				stats: selectedMonthData
			})] })
		]
	});
}
//#endregion
//#region src/hints.js
var BUILT_IN_HINTS = [
	{
		id: "otter-kelp",
		category: "動物",
		text: "ラッコは休むとき、流されにくいよう海藻に体を巻き付けることがあります。",
		question: "水族館で、つい長く見てしまう生き物は？",
		source: "Monterey Bay Aquarium",
		url: "https://www.montereybayaquarium.org/animals/animals-a-to-z/sea-otter",
		checkedAt: "2026年7月"
	},
	{
		id: "octopus-hearts",
		category: "動物",
		text: "タコには心臓が3つあります。2つはえらへ、1つは全身へ血液を送ります。",
		question: "不思議だと思う海の生き物は？",
		source: "Smithsonian Ocean",
		url: "https://ocean.si.edu/ocean-life/invertebrates/octopuses-and-squids",
		checkedAt: "2026年7月"
	},
	{
		id: "banana-berry",
		category: "食べ物",
		text: "植物学の分類では、バナナはベリーの仲間。名前の印象とは少し違います。",
		question: "名前と実物の印象が違った食べ物はある？",
		source: "Encyclopaedia Britannica",
		url: "https://www.britannica.com/science/berry-plant-reproductive-body",
		checkedAt: "2026年7月"
	},
	{
		id: "apple-float",
		category: "食べ物",
		text: "りんごは中に空気を多く含むため、水に浮きやすい果物です。",
		question: "秋になると食べたくなるものは？",
		source: "USDA",
		url: "https://snaped.fns.usda.gov/resources/nutrition-education-materials/seasonal-produce-guide/apples",
		checkedAt: "2026年7月"
	},
	{
		id: "rain-smell",
		category: "科学",
		text: "雨上がりの土のにおいは「ペトリコール」と呼ばれます。",
		question: "好きな天気のにおいはある？",
		source: "CSIRO",
		url: "https://www.csiro.au/en/news/all/articles/2015/march/what-is-petrichor",
		checkedAt: "2026年7月"
	},
	{
		id: "moon-footprints",
		category: "科学",
		text: "月には風や雨がほとんどないため、宇宙飛行士の足跡は長く残ります。",
		question: "一度行ってみたい場所は地球のどこ？",
		source: "NASA",
		url: "https://science.nasa.gov/moon/",
		checkedAt: "2026年7月"
	},
	{
		id: "snow-crystals",
		category: "季節",
		text: "雪の結晶は基本的に六角形。育つときの温度や湿度で形が変わります。",
		question: "冬にだけ楽しみにしていることは？",
		source: "NOAA",
		url: "https://www.noaa.gov/jetstream/snow",
		checkedAt: "2026年7月"
	},
	{
		id: "cherry-weather",
		category: "季節",
		text: "桜の開花予想には、冬から春にかけての気温の変化が使われます。",
		question: "春を感じる小さな合図は？",
		source: "気象庁",
		url: "https://www.jma.go.jp/jma/kishou/know/kurashi/sakura.html",
		checkedAt: "2026年7月"
	},
	{
		id: "pencil-graphite",
		category: "身近なもの",
		text: "鉛筆の芯に鉛は使われておらず、主に黒鉛と粘土でできています。",
		question: "つい集めたくなる文房具は？",
		source: "Smithsonian Institution",
		url: "https://www.si.edu/spotlight/pencils",
		checkedAt: "2026年7月"
	},
	{
		id: "velcro-burr",
		category: "身近なもの",
		text: "面ファスナーは、服に付いた植物の実を観察したことから着想されました。",
		question: "身近な発明で、よくできていると思うものは？",
		source: "Smithsonian Magazine",
		url: "https://www.smithsonianmag.com/innovation/accidental-invention-velcro-180972197/",
		checkedAt: "2026年7月"
	},
	{
		id: "tea-temperature",
		category: "暮らし",
		text: "同じお茶でも、お湯の温度や時間で香りと味の出方が変わります。",
		question: "ほっとするときに飲みたいものは？",
		source: "農林水産省",
		url: "https://www.maff.go.jp/j/seisan/tokusan/cha/ocha.html",
		checkedAt: "2026年7月"
	},
	{
		id: "sleep-cycles",
		category: "暮らし",
		text: "眠りは一晩中同じ深さではなく、いくつかの段階を繰り返します。",
		question: "よく眠れた朝にしたいことは？",
		source: "NIH",
		url: "https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep",
		checkedAt: "2026年7月"
	},
	{
		id: "kanji-kasa",
		category: "言葉",
		text: "「傘」という漢字には、人が屋根の下に集まっているように見える部分があります。",
		question: "形が好きな漢字はある？",
		source: "文化庁",
		url: "https://www.bunka.go.jp/seisaku/kokugo_nihongo/kokugo_shisaku/",
		checkedAt: "2026年7月"
	},
	{
		id: "emoji-origin",
		category: "文化",
		text: "絵文字は日本で生まれ、いまでは世界中の文字コードに収録されています。",
		question: "よく使う絵文字をひとつ選ぶなら？",
		source: "Unicode Consortium",
		url: "https://home.unicode.org/emoji/about-emoji/",
		checkedAt: "2026年7月"
	},
	{
		id: "postcard-history",
		category: "歴史",
		text: "日本で郵便はがきが発行されたのは、明治時代の1873年です。",
		question: "手紙やはがきを最後に書いたのはいつ？",
		source: "郵政博物館",
		url: "https://www.postalmuseum.jp/column/transition/postcard.html",
		checkedAt: "2026年7月"
	},
	{
		id: "tokyo-stations",
		category: "地域",
		text: "東京駅の赤れんが駅舎は、創建時の姿を大切にしながら復原されました。",
		question: "好きな駅や、思い出のある駅は？",
		source: "JR東日本",
		url: "https://www.jreast.co.jp/tokyostation/",
		checkedAt: "2026年7月"
	},
	{
		id: "library-order",
		category: "文化",
		text: "図書館の本の背にある数字は、似たテーマの本を近くに並べるための手がかりです。",
		question: "本屋や図書館で、最初に見る棚は？",
		source: "国立国会図書館",
		url: "https://www.ndl.go.jp/jp/data/catstandards/classification_subject/ndlc.html",
		checkedAt: "2026年7月"
	},
	{
		id: "cloud-weight",
		category: "科学",
		text: "雲は軽く見えますが、小さな水滴が集まってできています。",
		question: "空を見ていて、何に見えた雲があった？",
		source: "NOAA",
		url: "https://www.noaa.gov/jetstream/clouds",
		checkedAt: "2026年7月"
	},
	{
		id: "cat-whiskers",
		category: "動物",
		text: "猫のひげは、狭い場所や周りの動きを感じ取る助けになります。",
		question: "動物のすごい感覚で、ひとつ欲しいのは？",
		source: "Cornell Feline Health Center",
		url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center",
		checkedAt: "2026年7月"
	},
	{
		id: "bread-holes",
		category: "食べ物",
		text: "パンの中の穴は、酵母などが生地の中で作ったガスがふくらんだ跡です。",
		question: "焼きたてで食べたいパンは？",
		source: "American Chemical Society",
		url: "https://www.acs.org/education/whatischemistry/adventures-in-chemistry/experiments/yeast-air-balloons.html",
		checkedAt: "2026年7月"
	}
];
//#endregion
//#region src/storage.js
var statusMigration = {
	unopened: "unresolved",
	checked: "unresolved",
	talked: "resolved",
	pending: "pending",
	unresolved: "unresolved",
	resolved: "resolved"
};
var FONT_SIZE_KEY = "later-open-shiori-font-size-v1";
var THEME_KEY = "later-open-shiori-theme-v1";
var REFLECTION_KEY = "later-open-shiori-reflection-v1";
var HINTS_KEY = "later-open-shiori-hints-visible-v1";
var HINTS_INTRO_KEY = "later-open-shiori-hints-intro-v1";
var SENDER_NAME_KEY = "later-open-shiori-sender-name-v1";
var HINT_CACHE_KEY = "later-open-shiori-hint-cache-v1";
var validFontSizes = /* @__PURE__ */ new Set([
	"small",
	"standard",
	"large"
]);
var validThemes = /* @__PURE__ */ new Set([
	"orange",
	"pink",
	"blue",
	"green",
	"purple",
	"mono"
]);
function normalizeBookmark(bookmark) {
	return {
		id: String(bookmark.id || globalThis.crypto?.randomUUID?.() || Date.now()),
		targetName: String(bookmark.targetName || bookmark.person || "").trim(),
		memo: String(bookmark.memo || "").trim(),
		status: statusMigration[bookmark.status] || "unresolved",
		createdAt: String(bookmark.createdAt || (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE"))
	};
}
function loadBookmarks() {
	const raw = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS].map((key) => localStorage.getItem(key)).find(Boolean);
	if (!raw) {
		const samples = createSampleBookmarks();
		saveBookmarks(samples);
		return samples;
	}
	try {
		const parsed = JSON.parse(raw);
		const normalized = Array.isArray(parsed) ? parsed.map(normalizeBookmark) : [];
		saveBookmarks(normalized);
		return normalized;
	} catch {
		const samples = createSampleBookmarks();
		saveBookmarks(samples);
		return samples;
	}
}
function saveBookmarks(bookmarks) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}
function loadFontSize() {
	const stored = localStorage.getItem(FONT_SIZE_KEY);
	return validFontSizes.has(stored) ? stored : "standard";
}
function saveFontSize(size) {
	if (validFontSizes.has(size)) localStorage.setItem(FONT_SIZE_KEY, size);
}
function loadTheme() {
	const stored = localStorage.getItem(THEME_KEY);
	return validThemes.has(stored) ? stored : "orange";
}
function saveTheme(theme) {
	if (validThemes.has(theme)) localStorage.setItem(THEME_KEY, theme);
}
function loadReflectionVisibility() {
	return localStorage.getItem(REFLECTION_KEY) !== "off";
}
function saveReflectionVisibility(visible) {
	localStorage.setItem(REFLECTION_KEY, visible ? "on" : "off");
}
function loadHintVisibility() {
	return localStorage.getItem(HINTS_KEY) === "on";
}
function saveHintVisibility(visible) {
	localStorage.setItem(HINTS_KEY, visible ? "on" : "off");
}
function loadHintIntroSeen() {
	return localStorage.getItem(HINTS_INTRO_KEY) === "seen";
}
function saveHintIntroSeen() {
	localStorage.setItem(HINTS_INTRO_KEY, "seen");
}
function loadSenderName() {
	return localStorage.getItem(SENDER_NAME_KEY) || "";
}
function saveSenderName(name) {
	localStorage.setItem(SENDER_NAME_KEY, name);
}
function loadHintCache(fallback = []) {
	try {
		const parsed = JSON.parse(localStorage.getItem(HINT_CACHE_KEY) || "[]");
		return Array.isArray(parsed) && parsed.length ? parsed.slice(0, 30) : fallback;
	} catch {
		return fallback;
	}
}
function saveHintCache(hints) {
	localStorage.setItem(HINT_CACHE_KEY, JSON.stringify(hints.slice(0, 30)));
}
//#endregion
//#region src/screens/HintScreen.jsx
function HintScreen({ onUseHint }) {
	const [hints, setHints] = (0, import_react.useState)(() => loadHintCache(BUILT_IN_HINTS));
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [offline, setOffline] = (0, import_react.useState)(() => !navigator.onLine);
	(0, import_react.useEffect)(() => {
		if (!localStorage.getItem("later-open-shiori-hint-cache-v1")) {
			saveHintCache(BUILT_IN_HINTS);
			setHints(BUILT_IN_HINTS);
		}
		const update = () => setOffline(!navigator.onLine);
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", update);
			window.removeEventListener("offline", update);
		};
	}, []);
	const categories = (0, import_react.useMemo)(() => [...new Set(hints.map((hint) => hint.category))], [hints]);
	function drawHint() {
		setCurrent((now) => pickRandom(hints, now?.id));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "screen hint-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "hint-heading",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "CONVERSATION HINT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "話のヒントを引く" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "話題に迷ったときだけ、短いきっかけを一枚。" })
			]
		}), !current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hint-draw-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "omikuji-box",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "omikuji-slip" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [categories.slice(0, 5).join("・"), "などから、ひとつ選びます。"] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "primary-button hint-draw-button",
					disabled: !hints.length,
					onClick: drawHint,
					type: "button",
					children: "話のヒントを引く"
				}),
				!hints.length && offline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "offline-note",
					children: "新しいヒントを受け取るには、インターネットに接続してください"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hint-result",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hint-paper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hint-category",
							children: current.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hint-paper-ribbon",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint-text",
							children: current.text
						}),
						current.question && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hint-question",
							children: current.question
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["出典：", current.source] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [current.checkedAt, "確認"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: current.url,
								rel: "noreferrer",
								target: "_blank",
								children: "詳しく見る ↗"
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hint-source-note",
					children: "信頼できる情報源をもとに、会話向けに短く要約しています。"
				}),
				offline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "offline-note",
					children: "保存済みのヒントを表示しています。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hint-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "secondary-button",
						onClick: drawHint,
						type: "button",
						children: "もう一度引く"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "primary-button",
						onClick: () => onUseHint(current.text),
						type: "button",
						children: "しおりに挟む"
					})]
				})
			]
		})]
	});
}
//#endregion
//#region src/App.jsx
function App() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("save");
	const [bookmarks, setBookmarks] = (0, import_react.useState)([]);
	const [fontSize, setFontSize] = (0, import_react.useState)("standard");
	const [theme, setTheme] = (0, import_react.useState)("orange");
	const [showReflection, setShowReflection] = (0, import_react.useState)(true);
	const [showHints, setShowHints] = (0, import_react.useState)(false);
	const [hintIntroSeen, setHintIntroSeen] = (0, import_react.useState)(false);
	const [senderName, setSenderName] = (0, import_react.useState)("");
	const [prefilledMemo, setPrefilledMemo] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setBookmarks(loadBookmarks());
		setFontSize(loadFontSize());
		setTheme(loadTheme());
		setShowReflection(loadReflectionVisibility());
		setShowHints(loadHintVisibility());
		setHintIntroSeen(loadHintIntroSeen());
		setSenderName(loadSenderName());
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.fontSize = fontSize;
	}, [fontSize]);
	(0, import_react.useEffect)(() => {
		document.documentElement.dataset.theme = theme;
	}, [theme]);
	function addBookmark(bookmark) {
		setBookmarks((current) => {
			const next = [bookmark, ...current];
			saveBookmarks(next);
			return next;
		});
	}
	function updateStatus(id, status) {
		setBookmarks((current) => {
			const next = current.map((item) => item.id === id ? {
				...item,
				status
			} : item);
			saveBookmarks(next);
			return next;
		});
	}
	function updateBookmark(id, changes) {
		setBookmarks((current) => {
			const next = current.map((item) => item.id === id ? {
				...item,
				...changes
			} : item);
			saveBookmarks(next);
			return next;
		});
	}
	function updateFontSize(size) {
		setFontSize(size);
		saveFontSize(size);
	}
	function updateTheme(nextTheme) {
		setTheme(nextTheme);
		saveTheme(nextTheme);
	}
	function updateReflectionVisibility(visible) {
		setShowReflection(visible);
		saveReflectionVisibility(visible);
		if (!visible && activeTab === "reflection") setActiveTab("save");
	}
	function updateHintVisibility(visible) {
		setShowHints(visible);
		saveHintVisibility(visible);
		if (!visible && activeTab === "hints") setActiveTab("save");
	}
	function markHintIntroSeen() {
		setHintIntroSeen(true);
		saveHintIntroSeen();
	}
	function updateSenderName(name) {
		setSenderName(name);
		saveSenderName(name);
	}
	function useHintAsBookmark(text) {
		setPrefilledMemo(text);
		setActiveTab("save");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell",
		children: [
			activeTab === "save" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveScreen, {
				bookmarks,
				initialMemo: prefilledMemo,
				onInitialMemoConsumed: () => setPrefilledMemo(""),
				onSave: addBookmark,
				onShowBookmarks: () => setActiveTab("search")
			}),
			activeTab === "search" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchScreen, {
				bookmarks,
				onUpdateBookmark: updateBookmark,
				onUpdateStatus: updateStatus,
				senderName
			}),
			activeTab === "hints" && showHints && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintScreen, { onUseHint: useHintAsBookmark }),
			activeTab === "reflection" && showReflection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReflectionScreen, { bookmarks }),
			activeTab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsScreen, {
				fontSize,
				hintIntroSeen,
				onFontSizeChange: updateFontSize,
				onHintIntroSeen: markHintIntroSeen,
				onHintVisibilityChange: updateHintVisibility,
				onReflectionChange: updateReflectionVisibility,
				onSenderNameChange: updateSenderName,
				onThemeChange: updateTheme,
				senderName,
				showHints,
				showReflection,
				theme
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {
				activeTab,
				onChange: setActiveTab,
				showHints,
				showReflection
			})
		]
	});
}
//#endregion
//#region app/page.tsx
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
//#endregion
export { Home as default };
