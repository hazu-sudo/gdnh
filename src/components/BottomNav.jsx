const tabs = [
  {
    id: "save",
    label: "挟む",
    icon: <><path d="M6 4h12v16l-6-3-6 3V4Z" /><path d="M9 8h6M12 5v6" /></>,
  },
  {
    id: "search",
    label: "探す",
    icon: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4" /></>,
  },
  {
    id: "hints",
    label: "ヒント",
    icon: <><path d="M9 18h6M10 21h4" /><path d="M8.2 14.5A6 6 0 1 1 15.8 14.5C14.6 15.4 14 16.2 14 17h-4c0-.8-.6-1.6-1.8-2.5Z" /></>,
  },
  {
    id: "reflection",
    label: "振り返り",
    icon: <><path d="M5 19V11M12 19V5M19 19v-6" /><path d="M3 19h18" /></>,
  },
  {
    id: "settings",
    label: "設定",
    icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  },
];

export default function BottomNav({ activeTab, onChange, showHints, showReflection }) {
  const visibleTabs = tabs.filter((tab) => {
    if (tab.id === "reflection") return showReflection;
    if (tab.id === "hints") return showHints;
    return true;
  });

  return (
    <nav
      className={`bottom-nav simple-nav tabs-${visibleTabs.length}`}
      aria-label="メインメニュー"
    >
      {visibleTabs.map((tab) => (
        <button
          aria-current={activeTab === tab.id ? "page" : undefined}
          className={activeTab === tab.id ? "nav-button active" : "nav-button"}
          key={tab.id}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">{tab.icon}</svg>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
