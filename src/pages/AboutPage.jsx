import Footer from "../components/Footer";
import "./AboutPage.css";

export default function AboutPage() {
  const teamMembers = [
  {
    name: "Tan Chin Qian",
    role: "CEO & Founder",
    avatar: "🤵",
    bio: "Driven by a passion for education, he leads NaiNaiLong with the vision of making quality learning accessible to everyone."
  },
  {
    name: "Elson Ooi Yin Feng",
    role: "Co-Founder & Tech Lead",
    avatar: "👨‍💻",
    bio: "The backbone of our platform — Elson designs and builds the technology that connects students with the right tutors."
  },
  {
    name: "Goo Yong Shen",
    role: "Community & Engagement Lead",
    avatar: "👨‍🔧",
    bio: "A natural motivator, he ensures both students and tutors feel supported, valued, and excited to learn and teach."
  },
  {
    name: "Chong Han Zhneg",
    role: "Head of Learning Experience",
    avatar: "🧑‍🎨",
    bio: "Focused on user experience, he creates engaging and intuitive designs that make learning enjoyable for all."
  }
];

  return (
    <div className="about-page">
      
      <main className="about-content">
        <section className="about-hero">
          <h1>About NaiNaiLong</h1>
          <p>We’re on a mission to make quality tutoring accessible for every learner.</p>
        </section>

        <section className="about-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2025, NaiNaiLong started with a simple idea: what if every student 
              could find the right tutor, anytime and anywhere? We wanted to make 
              learning flexible, engaging, and rewarding.
            </p>
            <p>
              Today, we’re connecting students and tutors across multiple subjects — 
              from math and coding to languages and science. With our unique 
              coin-based reward system and easy-to-use platform, we help learners stay 
              motivated while tutors grow their impact.
            </p>
          </div>
          <div className="story-stats">
            <div className="stat">
              <h3>1K+</h3>
              <p>Students & Tutors</p>
            </div>
            <div className="stat">
              <h3>20+</h3>
              <p>Subjects Covered</p>
            </div>
            <div className="stat">
              <h3>95%</h3>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Student Success</h3>
              <p>We focus on helping students achieve their learning goals.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Empowering Tutors</h3>
              <p>We give tutors the tools and support they need to thrive.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">📚</div>
              <h3>Accessible Learning</h3>
              <p>Education should be flexible, affordable, and available to all.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Continuous Growth</h3>
              <p>We believe in lifelong learning — for students and tutors alike.</p>
            </div>
          </div>
        </section>

        <section className="about-team">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-avatar">{member.avatar}</div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
