import { useMemo, useState } from "react";

const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

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
  const today = new Date();
  const distanceFromMonday = (today.getDay() + 6) % 7;
  return addDays(today, -distanceFromMonday);
}

function getStats(bookmarks) {
  return {
    total: bookmarks.length,
    resolved: bookmarks.filter((item) => item.status === "resolved").length,
    pending: bookmarks.filter((item) => item.status === "pending").length,
    unresolved: bookmarks.filter((item) => item.status === "unresolved").length,
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
      ...getStats(items),
    };
  });
}

function buildMonthlyData(bookmarks) {
  const today = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    const key = monthKey(date);
    const items = bookmarks.filter((item) => item.createdAt.startsWith(key));
    return {
      key,
      label: `${date.getMonth() + 1}月`,
      year: date.getFullYear(),
      ...getStats(items),
    };
  });
}

function StackedBarChart({ data, onSelect, selectedKey }) {
  const maximum = Math.max(1, ...data.map((item) => item.total));

  return (
    <div className="chart-scroll">
      <div className="chart-layout">
        <div className="chart-y-axis" aria-hidden="true">
          <span>{maximum}</span>
          <span>0</span>
        </div>
        <div className="chart-area">
          <div className="chart-guide top" />
          <div className="chart-guide middle" />
          <div className="chart-guide bottom" />
          <div className="chart-columns">
            {data.map((item) => {
              const height = `${(item.total / maximum) * 100}%`;
              const resolvedHeight = item.total ? `${(item.resolved / item.total) * 100}%` : "0%";
              const remainingHeight = item.total ? `${((item.total - item.resolved) / item.total) * 100}%` : "0%";
              const column = (
                <>
                  <span className="bar-value">{item.total || ""}</span>
                  <span className="bar-track">
                    <span className="bar-stack" style={{ height }}>
                      <i className="bar-remaining" style={{ height: remainingHeight }} />
                      <i className="bar-resolved" style={{ height: resolvedHeight }} />
                    </span>
                  </span>
                  <strong>{item.label}</strong>
                  {item.sublabel && <small>{item.sublabel}</small>}
                </>
              );

              return onSelect ? (
                <button
                  aria-label={`${item.label}、挟んだしおり${item.total}枚、話せたしおり${item.resolved}枚`}
                  className={selectedKey === item.key ? "chart-column active" : "chart-column"}
                  key={item.key}
                  onClick={() => onSelect(item.key)}
                  type="button"
                >
                  {column}
                </button>
              ) : (
                <div
                  aria-label={`${item.label}、挟んだしおり${item.total}枚、話せたしおり${item.resolved}枚`}
                  className="chart-column"
                  key={item.key}
                >
                  {column}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function GentleSummary({ period, stats }) {
  if (stats.total === 0) {
    return (
      <div className="gentle-summary empty-summary">
        <span aria-hidden="true">栞</span>
        <p><strong>{period}は、まだしおりがありません</strong>話したいことが見つかったときに、そっと挟んでみましょう。</p>
      </div>
    );
  }

  if (stats.resolved === 0) {
    return (
      <div className="gentle-summary">
        <span aria-hidden="true">栞</span>
        <p><strong>{period}は{stats.total}枚のしおりを挟みました</strong>あとで開けるしおりが{stats.total}枚あります。</p>
      </div>
    );
  }

  return (
    <div className="gentle-summary">
      <span aria-hidden="true">栞</span>
      <p><strong>{period}は{stats.total}枚のしおりを挟みました</strong>そのうち{stats.resolved}枚を話すことができました。</p>
    </div>
  );
}

export default function ReflectionScreen({ bookmarks }) {
  const [mode, setMode] = useState("week");
  const weeklyData = useMemo(() => buildWeeklyData(bookmarks), [bookmarks]);
  const monthlyData = useMemo(() => buildMonthlyData(bookmarks), [bookmarks]);
  const [selectedMonth, setSelectedMonth] = useState(monthlyData.at(-1)?.key || "");
  const weekStats = useMemo(
    () => getStats(weeklyData.flatMap((day) =>
      bookmarks.filter((item) => item.createdAt === day.key),
    )),
    [bookmarks, weeklyData],
  );
  const selectedMonthData =
    monthlyData.find((item) => item.key === selectedMonth) || monthlyData.at(-1);

  return (
    <main className="screen reflection-screen">
      <header className="reflection-heading">
        <p className="eyebrow">LOOK BACK</p>
        <h1>しおりの振り返り</h1>
        <p>残した気持ちと、会話につながったしおりを、ゆっくり眺めます。</p>
      </header>

      <div className="period-switch" role="tablist" aria-label="振り返る期間">
        <button
          aria-selected={mode === "week"}
          className={mode === "week" ? "active" : ""}
          onClick={() => setMode("week")}
          role="tab"
          type="button"
        >
          週ごと
        </button>
        <button
          aria-selected={mode === "month"}
          className={mode === "month" ? "active" : ""}
          onClick={() => setMode("month")}
          role="tab"
          type="button"
        >
          月ごと
        </button>
      </div>

      <section className="reflection-panel">
        <header className="chart-heading">
          <div>
            <p>{mode === "week" ? "今週" : "過去6か月"}</p>
            <h2>{mode === "week" ? "月曜日から日曜日まで" : "しおりを挟んだ月"}</h2>
          </div>
          <span>単位：枚</span>
        </header>

        {mode === "week" ? (
          <StackedBarChart data={weeklyData} />
        ) : (
          <StackedBarChart data={monthlyData} onSelect={setSelectedMonth} selectedKey={selectedMonth} />
        )}

        <div className="chart-legend" aria-label="グラフの凡例">
          <span><i className="legend-resolved" />話せた</span>
          <span><i className="legend-remaining" />まだ話していない・保留中</span>
        </div>
      </section>

      {mode === "week" ? (
        <GentleSummary period="今週" stats={weekStats} />
      ) : (
        <>
          <section className="month-detail">
            <header>
              <div><strong>{selectedMonthData.label}</strong><small>{selectedMonthData.year}年</small></div>
              <span className="month-detail-ribbon" aria-hidden="true" />
            </header>
            <dl>
              <div><dt>挟んだしおり</dt><dd>{selectedMonthData.total}<small>枚</small></dd></div>
              <div><dt>話せたしおり</dt><dd>{selectedMonthData.resolved}<small>枚</small></dd></div>
              <div><dt>保留中</dt><dd>{selectedMonthData.pending}<small>枚</small></dd></div>
              <div><dt>まだ選択していない</dt><dd>{selectedMonthData.unresolved}<small>枚</small></dd></div>
            </dl>
          </section>
          <GentleSummary period="この月" stats={selectedMonthData} />
        </>
      )}
    </main>
  );
}
