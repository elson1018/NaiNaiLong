import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    "Find your perfect tutor today",
    "Learn anytime, anywhere", 
    "Learn and grow",
    "Make a difference",
    "Grow your skills with expert tutors"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to <span className="highlight">NaiNaiLong</span>
        </h1>
        <p className="hero-subtitle">
          {texts[currentText]}
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="hero-btn primary">
            Get Started
          </Link>
          <Link to="/about" className="hero-btn secondary">
            Learn More
          </Link>
        </div>
      </div>
      <div className="hero-visual">
        <div className="floating-card">
          <div className="card-icon">🎓</div>
          <h3>Expert Tutors</h3>
          <p>Learn from top-rated professionals</p>
        </div>
        <div className="floating-card">
          <div className="card-icon">🕒</div>
          <h3>Flexible Scheduling</h3>
          <p>Book lessons at your own time</p>
        </div>
        <div className="floating-card">
          <div className="card-icon">📚</div>
          <h3>Wide Range of Subjects</h3>
          <p>Math, Coding, Languages, and more</p>
        </div>
      </div>
    </div>
  );
}
