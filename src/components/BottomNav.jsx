const tabs = [
  { id: "home", label: "ホーム", icon: "🏠" },
  { id: "save", label: "挟む", icon: "📖" },
  { id: "search", label: "探す", icon: "🔍" },
  { id: "open", label: "ひらく", icon: "💡" },
  { id: "box", label: "しおり箱", icon: "📦" },
];

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="画面">
      {tabs.map((tab) => (
        <button
          aria-current={activeTab === tab.id ? "page" : undefined}
          className={activeTab === tab.id ? "nav-button active" : "nav-button"}
          key={tab.id}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          <span className="nav-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
