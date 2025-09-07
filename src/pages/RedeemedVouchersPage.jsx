import { useEffect, useState } from "react";
import { useCoins } from "../context/CoinContext.jsx";
import "./RedeemedVouchersPage.css";

export default function RedeemedVouchersPage() {
  const { role, setRole } = useCoins();
  const [redeemed, setRedeemed] = useState([]);
  const [filteredRedeemed, setFilteredRedeemed] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const raw = localStorage.getItem("redeemed-items");
    const redeemedItems = raw ? JSON.parse(raw) : [];
    setRedeemed(redeemedItems);
    setFilteredRedeemed(redeemedItems);
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredRedeemed(redeemed);
    } else {
      const filtered = redeemed.filter(item => {
        const itemLower = item.label.toLowerCase();
        return itemLower.includes(filter.toLowerCase());
      });
      setFilteredRedeemed(filtered);
    }
  }, [filter, redeemed]);

  const getItemIcon = (label) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes("study material") || labelLower.includes("workshop")) {
      return "📚";
    } else if (labelLower.includes("discount")) {
      return "💰";
    } else if (labelLower.includes("voucher") || labelLower.includes("gift")) {
      return "🎁";
    } else if (labelLower.includes("badge") || labelLower.includes("profile")) {
      return "🏆";
    } else if (labelLower.includes("tools")) {
      return "🛠️";
    } else {
      return "🎉";
    }
  };

  const getItemCategory = (label) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes("study material") || labelLower.includes("workshop")) {
      return "Learning Materials";
    } else if (labelLower.includes("discount")) {
      return "Discounts";
    } else if (labelLower.includes("voucher") || labelLower.includes("gift")) {
      return "Gift Items";
    } else if (labelLower.includes("badge") || labelLower.includes("profile")) {
      return "Profile Enhancements";
    } else if (labelLower.includes("tools")) {
      return "Tools & Features";
    } else {
      return "Other";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const categories = ["all", "Learning Materials", "Discounts", "Gift Items", "Profile Enhancements", "Tools & Features", "Other"];

  return (
    <div className="redeemed-vouchers-page">
      <div className="page-header">
        <h1>My Redeemed Items</h1>
        <p>View and manage all your redeemed vouchers and rewards</p>
      </div>

      <div className="role-selector">
        <span>Viewing as:</span>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>
      </div>

      <div className="filters-section">
        <div className="filter-buttons">
          <span>Filter by category:</span>
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? "active" : ""}`}
              onClick={() => setFilter(category)}
            >
              {category === "all" ? "All Items" : category}
            </button>
          ))}
        </div>
        
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{redeemed.length}</span>
            <span className="stat-label">Total Redeemed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filteredRedeemed.length}</span>
            <span className="stat-label">Filtered Results</span>
          </div>
        </div>
      </div>

      {redeemed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎁</div>
          <h3>No Redeemed Items Yet</h3>
          <p>Start earning coins and redeem rewards to see them here!</p>
          <a href="/rewards" className="cta-button">Go to Rewards</a>
        </div>
      ) : (
        <div className="redeemed-items-grid">
          {filteredRedeemed.map((item, index) => (
            <div key={index} className="redeemed-item-card">
              <div className="item-header">
                <div className="item-icon">{getItemIcon(item.label)}</div>
                <div className="item-info">
                  <h3 className="item-title">{item.label}</h3>
                  <span className="item-category">{getItemCategory(item.label)}</span>
                </div>
              </div>
              
              <div className="item-details">
                <div className="redeemed-date">
                  <span className="date-label">Redeemed on:</span>
                  <span className="date-value">{formatDate(item.ts)}</span>
                </div>
                
                <div className="item-status">
                  <span className="status-badge active">Active</span>
                </div>
              </div>
              
              <div className="item-actions">
                <button className="action-btn secondary">View Details</button>
                <button className="action-btn primary">Use Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {redeemed.length > 0 && filteredRedeemed.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No Items Found</h3>
          <p>Try selecting a different category filter.</p>
        </div>
      )}
    </div>
  );
}
