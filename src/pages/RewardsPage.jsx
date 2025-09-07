import { useCoins } from "../context/CoinContext.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RewardsPage.css";

export default function RewardsPage() {
  const { role, setRole, studentCoins, tutorCoins, spendStudentCoins, spendTutorCoins, streaks, simulateStudentAction } = useCoins();
  const [redeemed, setRedeemed] = useState([]);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    const lastLogin = localStorage.getItem("last-daily-login");
    if (lastLogin === new Date().toDateString()) {
      setHasCheckedIn(true);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("redeemed-items");
    setRedeemed(raw ? JSON.parse(raw) : []);
  }, []);

  const handleCheckIn = () => {
  const today = new Date().toDateString();
  const lastLogin = localStorage.getItem("last-daily-login");

  if (lastLogin === today) {
    alert("You've already checked in today!");
    return;
  }

  localStorage.setItem("last-daily-login", today);
  setHasCheckedIn(true);

  simulateStudentAction("daily_login");

  alert("🎉 Checked in! Coins awarded.");
};

  const handleRedeem = (amount, label) => {
    if (role === "student" && studentCoins >= amount) {
      spendStudentCoins(amount);
    } else if (role === "tutor" && tutorCoins >= amount) {
      spendTutorCoins(amount);
    } else {
      alert("Not enough coins!");
      return;
    }

    const next = [{ label, ts: new Date().toLocaleString() }, ...redeemed];
    setRedeemed(next);
    localStorage.setItem("redeemed-items", JSON.stringify(next));
    alert(`🎉 Successfully redeemed ${label}!`);
  };

  const coins = role === "student" ? studentCoins : tutorCoins;

  return (
    <div className="rewards-page">
      <h1>My Rewards</h1>

      <div className="rewards-header">
        <span>Viewing as:</span>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>

        <div className="spacer balances">
          <span className="balance-pill">{role === "student" ? "Student" : "Tutor"} Coins: {coins}</span>
        </div>
      </div>

      <div className="check-in-section">
        <button 
          className="btn primary" 
          onClick={handleCheckIn} 
          disabled={hasCheckedIn}
        >
          {hasCheckedIn ? "✅ Checked In" : "Check In"}
        </button>

        <div className="streak-container">
          <span>Daily Login Streak:</span>
          <div className="streak-bar">
            <div
              className="streak-progress"
              style={{ width: `${Math.min(streaks.dailyLogin || 0, 7) * (100/7)}%` }}
            />
          </div>
          <span>{streaks.dailyLogin || 0} / 7 days</span>
        </div>

        <div className="streak-reward">
          <span>Next streak reward: {10 + (streaks.dailyLogin || 0) * 2} coins</span>
        </div>
      </div>

      <div className="redeem-section">
        <h2>Redeem Coins</h2>
        <div className="redeem-list">
          {role === "student" ? (
            <>
              <div className="redeem-item">
                <span>50 coins → Small study material</span>
                <button className="btn" onClick={() => handleRedeem(50, "Small study material")} disabled={coins < 50}>Redeem</button>
              </div>
              <div className="redeem-item">
                <span>100 coins → 10% discount on next session</span>
                <button className="btn" onClick={() => handleRedeem(100, "10% discount")} disabled={coins < 100}>Redeem</button>
              </div>
              <div className="redeem-item">
                <span>200 coins → Unlock premium workshop</span>
                <button className="btn" onClick={() => handleRedeem(200, "Premium workshop")} disabled={coins < 200}>Redeem</button>
              </div>
              <div className="redeem-item">
                <span>500 coins → Gift voucher / special badge</span>
                <button className="btn" onClick={() => handleRedeem(500, "Gift voucher")} disabled={coins < 500}>Redeem</button>
              </div>
            </>
          ) : (
            <>
              <div className="redeem-item">
                <span>100 coins → Highlighted tutor profile (1 week)</span>
                <button className="btn" onClick={() => handleRedeem(100, "Highlighted profile")} disabled={coins < 100}>Redeem</button>
              </div>
              <div className="redeem-item">
                <span>200 coins → Access advanced teaching tools</span>
                <button className="btn" onClick={() => handleRedeem(200, "Advanced tools")} disabled={coins < 200}>Redeem</button>
              </div>
              <div className="redeem-item">
                <span>500 coins → Gift card / small payout</span>
                <button className="btn" onClick={() => handleRedeem(500, "Gift card")} disabled={coins < 500}>Redeem</button>
              </div>
              <div className="redeem-item">
                <span>1000 coins → Top Tutor badge & profile boost</span>
                <button className="btn" onClick={() => handleRedeem(1000, "Top Tutor badge")} disabled={coins < 1000}>Redeem</button>
              </div>
            </>
          )}
        </div>
      </div>

      {redeemed.length > 0 && (
        <div className="redeemed-section">
          <div className="redeemed-header">
            <h3>Redeemed Items</h3>
            <Link to="/redeemed" className="view-all-btn">
              View All Redeemed Items →
            </Link>
          </div>
          <ul className="redeemed-list">
            {redeemed.slice(0, 3).map((r, i) => (
              <li key={i} className="redeemed-item">
                <span>{r.label}</span>
                <span>{r.ts}</span>
              </li>
            ))}
          </ul>
          {redeemed.length > 3 && (
            <div className="view-more">
              <Link to="/redeemed" className="view-more-btn">
                View {redeemed.length - 3} more items →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}