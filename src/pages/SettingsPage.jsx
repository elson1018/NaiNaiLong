import { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage() {
  const rawUser = localStorage.getItem("auth-user");
  const currentUser = rawUser ? JSON.parse(rawUser) : null;

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    password: "",
    language: "English",
    notifications: true,
    theme: "light",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "auth-user",
      JSON.stringify({ ...currentUser, ...formData })
    );
    alert("✅ Settings updated successfully!");
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">

        <div className="settings-section">
          <h3>👤 Profile</h3>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Change Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </label>
        </div>

        <div className="settings-section">
          <h3>🌐 Preferences</h3>
          <label>
            Language:
            <select name="language" value={formData.language} onChange={handleChange}>
              <option>English</option>
              <option>Malay</option>
              <option>Mandarin</option>
              <option>Tamil</option>
            </select>
          </label>

          <label>
            Theme:
            <select name="theme" value={formData.theme} onChange={handleChange}>
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
            </select>
          </label>
        </div>

        <div className="settings-section">
          <h3>🔔 Notifications</h3>
          <label className="checkbox">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
            />
            Enable email & app notifications
          </label>
        </div>

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
}