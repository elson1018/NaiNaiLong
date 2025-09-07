import { useEffect, useMemo, useState } from "react";
import { useCoins } from "../context/CoinContext.jsx";
import "./CheckInPage.css";

const STORAGE_KEY = "daily-checkin";

export default function CheckInPage() {
  const { simulateStudentAction, streaks } = useCoins();
  const [todayChecked, setTodayChecked] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();
      setTodayChecked(raw === today);
    } catch {}
  }, []);

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    try { localStorage.setItem(STORAGE_KEY, today); } catch {}
    simulateStudentAction("daily_login");
    setTodayChecked(true);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 1000);
  };

  const weekDays = useMemo(() => {
    const base = new Date();
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      arr.push({
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        key: d.toDateString(),
      });
    }
    return arr;
  }, []);

  return (
    <div className="checkin">
      <div className="checkin-header">
        <h1>Daily Check-in</h1>
        {celebrate && (
          <div className="confetti" aria-hidden>
            <span className="piece">🎉</span>
          </div>
        )}
      </div>
      <p className="checkin-sub">Check in daily to build your login streak.</p>
      <div style={{ marginTop: 12 }}>
        <button className="btn primary" disabled={todayChecked} onClick={handleCheckIn}>
          {todayChecked ? "Checked in today" : "Check in now"}
        </button>
      </div>

      <div className="streak-grid">
        {weekDays.map((d, idx) => (
          <div key={d.key} className={`streak-day ${localStorage.getItem(STORAGE_KEY) === d.key ? 'checked' : ''}`}>
            <span>{d.label}</span>
            <span className="big">{idx === 6 ? (streaks.dailyLogin || 0) : ""}</span>
          </div>
        ))}
      </div>

      <div className="progress"><div style={{ width: `${Math.min(100, (streaks.dailyLogin || 0) % 7 / 7 * 100)}%` }} /></div>
      <div className="hint">{(streaks.dailyLogin || 0) % 7 === 0 && (streaks.dailyLogin || 0) > 0 ? "Weekly bonus applied! Keep going for another streak." : "Reach 7 to earn a weekly bonus."}</div>
    </div>
  );
}


