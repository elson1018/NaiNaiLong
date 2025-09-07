import { useEffect, useState } from "react";
import { useCoins } from "../context/CoinContext.jsx";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { role, setRole, studentCoins, tutorCoins } = useCoins();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth-user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const changeRole = (nextRole) => {
    setRole(nextRole);
    setUser((u) => {
      const updated = { ...(u || {}), role: nextRole };
      localStorage.setItem("auth-user", JSON.stringify(updated));
      return updated;
    });
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Your Profile</h2>
          <p>No user found. Please sign up or create a demo account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar" aria-hidden>{(user.fullName || user.email || "U").charAt(0).toUpperCase()}</div>
          <div>
            <h2>Your Profile</h2>
            <p className="muted">Manage your account and role</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="field">
            <label>Name</label>
            <div className="value">{user.fullName || "—"}</div>
          </div>
          <div className="field">
            <label>Email</label>
            <div className="value">{user.email || "—"}</div>
          </div>
          <div className="field">
            <label>Role</label>
            <div className="role-toggle">
              <button className={`role-btn ${role === 'student' ? 'active' : ''}`} onClick={() => changeRole('student')}>🎓 Student</button>
              <button className={`role-btn ${role === 'tutor' ? 'active' : ''}`} onClick={() => changeRole('tutor')}>👨‍🏫 Tutor</button>
            </div>
          </div>
          <div className="field">
            <label>Coins</label>
            <div className="value">Student: {studentCoins} | Tutor: {tutorCoins}</div>
          </div>
        </div>
      </div>
    </div>
  );
}




