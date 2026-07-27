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
];

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav simple-nav" aria-label="メインメニュー">
      {tabs.map((tab) => (
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
