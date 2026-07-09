function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 11.2 12 4.8l7.5 6.4" />
      <path d="M6.8 10.4v8.2h4.1v-4.8h2.2v4.8h4.1v-8.2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 5.6c2.3-.7 4.5-.4 6.5.9v12.2c-2-1.3-4.2-1.6-6.5-.9V5.6Z" />
      <path d="M18.5 5.6c-2.3-.7-4.5-.4-6.5.9v12.2c2-1.3 4.2-1.6 6.5-.9V5.6Z" />
      <path d="M8 8.4c.8-.1 1.5 0 2.2.3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="5.2" />
      <path d="m14.5 14.5 4.2 4.2" />
    </svg>
  );
}

function LightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.2 11a4 4 0 1 1 7.6 1.7c-.8 1.3-1.6 1.8-1.8 3.2H10c-.2-1.4-1-1.9-1.8-3.2A3.9 3.9 0 0 1 8.2 11Z" />
      <path d="M10 18h4" />
      <path d="M10.7 20h2.6" />
      <path d="M12 3.8v1.4" />
      <path d="m5.8 6.1 1 1" />
      <path d="m18.2 6.1-1 1" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.7 8.2 12 5l7.3 3.2-7.3 3.2-7.3-3.2Z" />
      <path d="M4.7 8.2v7.8L12 19.2l7.3-3.2V8.2" />
      <path d="M12 11.4v7.8" />
      <path d="m8.3 6.6 7.4 3.2" />
    </svg>
  );
}

const tabs = [
  { id: "home", label: "ホーム", icon: <HomeIcon /> },
  { id: "save", label: "挟む", icon: <BookIcon /> },
  { id: "search", label: "探す", icon: <SearchIcon /> },
  { id: "open", label: "ひらく", icon: <LightIcon /> },
  { id: "pending", label: "保留", icon: <BoxIcon /> },
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
