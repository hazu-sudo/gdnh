const tabs = [
  { id: "home", label: "ホーム" },
  { id: "save", label: "しおりを挟む" },
  { id: "before", label: "会う前" },
  { id: "people", label: "相手" },
  { id: "unsent", label: "未送信" },
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
          <span className="nav-dot" aria-hidden="true" />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
