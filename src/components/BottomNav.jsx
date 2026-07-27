const icons = {
  home: <><path d="m4 10 8-6 8 6" /><path d="M6.5 9v10h11V9M10 19v-5h4v5" /></>,
  save: <><path d="M6 4h12v16l-6-3-6 3V4Z" /><path d="M9 8h6M12 6v4" /></>,
  search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4" /></>,
  open: <><path d="M5 6.5c2.5-.8 4.8-.4 7 1.1v11c-2.2-1.5-4.5-1.9-7-1.1v-11Z" /><path d="M19 6.5c-2.5-.8-4.8-.4-7 1.1v11c2.2-1.5 4.5-1.9 7-1.1v-11Z" /></>,
  pending: <><path d="M5 8h14v11H5zM4 5h16v3H4z" /><path d="M10 12h4" /></>,
};

const tabs = [
  ["home", "ホーム"],
  ["save", "挟む"],
  ["search", "探す"],
  ["open", "ひらく"],
  ["pending", "保留"],
];

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="メインメニュー">
      {tabs.map(([id, label]) => (
        <button
          aria-current={activeTab === id ? "page" : undefined}
          className={activeTab === id ? "nav-button active" : "nav-button"}
          key={id}
          onClick={() => onChange(id)}
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">{icons[id]}</svg>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
