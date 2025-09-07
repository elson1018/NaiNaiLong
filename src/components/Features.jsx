import { useState } from "react";
import "./Features.css";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
  {
    icon: "🎓",
    title: "Expert Tutors",
    description: "Learn from verified and experienced tutors.",
    details: "Our tutors are carefully selected, reviewed by students, and dedicated to helping you succeed."
  },
  {
    icon: "📚",
    title: "Wide Range of Subjects",
    description: "From math and coding to languages and science.",
    details: "Easily find a tutor who matches your learning needs across different fields."
  },
  {
    icon: "🕒",
    title: "Flexible Scheduling",
    description: "Lessons that fit your busy lifestyle.",
    details: "Book sessions anytime and study at your own pace, whether day or night."
  },
  {
    icon: "💰",
    title: "Reward System",
    description: "Earn and spend coins as you learn.",
    details: "Stay motivated with our unique coin-based reward system for both students and tutors."
  }
];


  return (
    <section className="features">
      <div className="features-header">
        <h2>Why Choose NaiNaiLong?</h2>
        <p>Discover what makes us different</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`feature-card ${activeFeature === index ? 'active' : ''}`}
            onClick={() => setActiveFeature(index)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <div className="feature-details">
              {activeFeature === index && (
                <p>{feature.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="features-indicators">
        {features.map((_, index) => (
          <button
            key={index}
            className={`indicator ${activeFeature === index ? 'active' : ''}`}
            onClick={() => setActiveFeature(index)}
          />
        ))}
      </div>
    </section>
  );
}
