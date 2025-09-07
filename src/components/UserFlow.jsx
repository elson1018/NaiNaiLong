import { useState } from "react";
import { Link } from "react-router-dom";
import "./UserFlow.css";

export default function UserFlow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Sign Up & Choose Role",
      description: "Create your account and select whether you're a student or tutor",
      icon: "👤",
      details: "Start by creating your account and choosing your role. Students can find tutors, while tutors can offer their expertise.",
      action: "Get Started",
      link: "/signup"
    },
    {
      id: 2,
      title: "Search & Find",
      description: "Use our smart search to find tutors or subjects that match your needs",
      icon: "🔍",
      details: "Search by subject, tutor name, or use our filters to find the perfect match. Our search works across all tutor profiles.",
      action: "Search Tutors",
      link: "/dashboard"
    },
    {
      id: 3,
      title: "Book & Learn",
      description: "Book sessions with tutors and start your learning journey",
      icon: "📅",
      details: "Connect with tutors, schedule sessions, and begin learning. All sessions are tracked and managed through our platform.",
      action: "View Dashboard",
      link: "/dashboard"
    },
    {
      id: 4,
      title: "Earn & Redeem",
      description: "Earn coins through activities and redeem rewards",
      icon: "💰",
      details: "Complete assignments, attend sessions, give feedback, and earn coins. Redeem them for discounts, materials, and special rewards.",
      action: "View Rewards",
      link: "/rewards"
    }
  ];

  const userTypes = [
    {
      role: "Student",
      icon: "🎓",
      features: [
        "Find expert tutors",
        "Book flexible sessions",
        "Earn coins for learning",
        "Access study materials",
        "Track your progress"
      ]
    },
    {
      role: "Tutor",
      icon: "👨‍🏫",
      features: [
        "Create your profile",
        "Set your rates",
        "Earn coins for teaching",
        "Access teaching tools",
        "Build your reputation"
      ]
    }
  ];

  return (
    <section className="user-flow">
      <div className="flow-header">
        <h2>How It Works</h2>
        <p>Get started in just a few simple steps</p>
      </div>

      <div className="flow-steps">
        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`step-card ${activeStep === index ? 'active' : ''}`}
              onClick={() => setActiveStep(index)}
            >
              <div className="step-number">{step.id}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {activeStep === index && (
                <div className="step-details">
                  <p>{step.details}</p>
                  <Link to={step.link} className="step-action-btn">
                    {step.action}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flow-indicators">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`flow-indicator ${activeStep === index ? 'active' : ''}`}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
      </div>

      <div className="user-types">
        <h3>Choose Your Path</h3>
        <div className="user-types-grid">
          {userTypes.map((userType, index) => (
            <div key={index} className="user-type-card">
              <div className="user-type-icon">{userType.icon}</div>
              <h4>{userType.role}</h4>
              <ul className="user-features">
                {userType.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              <Link 
                to="/signup" 
                className={`user-type-btn ${userType.role.toLowerCase()}`}
              >
                Become a {userType.role}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flow-cta">
        <h3>Ready to Start Learning?</h3>
        <p>Join thousands of students and tutors already using NaiNaiLong</p>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-btn primary">
            Sign Up Now
          </Link>
          <Link to="/about" className="cta-btn secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
