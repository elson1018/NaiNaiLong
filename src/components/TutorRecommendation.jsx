import { useState, useEffect } from "react";
import "./TutorRecommendation.css";

export default function TutorRecommendation({ tutors }) {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const sorted = [...tutors].sort((a, b) => b.rating - a.rating);
    setRecommended(sorted.slice(0, 2));
  }, [tutors]);

  return (
    <div className="recommendation-panel">
      <h3>🎯 Recommended Tutors for You</h3>
      {recommended.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        <div className="tutor-grid">
          {recommended.map((tutor) => (
            <div key={tutor.id} className="tutor-card">
              <div className="tutor-header">
                <div className="avatar" aria-hidden>
                  👨‍🏫
                </div>
                <div>
                  <div className="tutor-name">{tutor.name}</div>
                  <div className="tutor-subject">{tutor.subject}</div>
                </div>
              </div>
              <div className="tutor-meta">
                <span>Experience: {tutor.experience} yrs</span>
                <span className="rating">⭐ {tutor.rating}</span>
              </div>
              <div className="tutor-price">
                <span className="price-label">Price per hour:</span>
                <span className="price-amount">${tutor.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
