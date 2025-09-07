import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCoins } from "../context/CoinContext.jsx";
import LessonPage from "../pages/LessonPage.jsx";
import TutorRecommendation from "../components/TutorRecommendation.jsx";
import PerformanceInsights from "../components/PerformanceInsights.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const rawUser = localStorage.getItem("auth-user");
  const currentUser = rawUser ? JSON.parse(rawUser) : null;

  const {
    role,
    setRole,
    studentCoins,
    tutorCoins,
    simulateStudentAction,
    simulateTutorAction,
  } = useCoins();

  const ran = useRef(false);
  const navigate = useNavigate();

  const [hasLoggedInToday, setHasLoggedInToday] = useState(false);

  const addActivity = (actionText, type = "user") => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setRecentActivity((prev) => [
      { id: prev.length + 1, action: actionText, time: timeString, type },
      ...prev,
    ]);
  };

  const [tutorEarnings, setTutorEarnings] = useState({
    session: 0,
    upload_material: 0,
    positive_rating: 0,
    consistency_bonus: 0,
    engagement: 0,
  });

  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    subject: "",
    priceRange: { min: 0, max: 100 },
    experience: { min: 0, max: 10 },
    rating: { min: 0, max: 5 },
    searchQuery: "",
  });

  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setAiMessages((prev) => [...prev, { type: "user", text: aiInput }]);

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { type: "ai", text: "🤖 Here's a helpful tip for you!" },
      ]);
    }, 800);

    setAiInput("");
  };

  // Filter functions
  const updateFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      priceRange: { min: 0, max: 100 },
      experience: { min: 0, max: 10 },
      rating: { min: 0, max: 5 },
      searchQuery: "",
    });
  };

  const getFilteredTutors = () => {
    return tutors.filter((tutor) => {
      if (
        filters.subject &&
        tutor.subject.toLowerCase() !== filters.subject.toLowerCase()
      ) {
        return false;
      }

      if (
        tutor.price < filters.priceRange.min ||
        tutor.price > filters.priceRange.max
      ) {
        return false;
      }

      if (
        tutor.experience < filters.experience.min ||
        tutor.experience > filters.experience.max
      ) {
        return false;
      }

      if (
        tutor.rating < filters.rating.min ||
        tutor.rating > filters.rating.max
      ) {
        return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const searchTerms = query.split(' ').filter(term => term.length > 0);
        
        const matchesAnyTerm = searchTerms.some(term => {
          const matchesName = tutor.name.toLowerCase().includes(term);
          const matchesSubject = tutor.subject.toLowerCase().includes(term);
          const matchesDescription = tutor.description.toLowerCase().includes(term);
          const matchesPrice = tutor.price.toString().includes(term);
          const matchesExperience = tutor.experience.toString().includes(term);
          const matchesRating = tutor.rating.toString().includes(term);
          
          return matchesName || matchesSubject || matchesDescription || 
                 matchesPrice || matchesExperience || matchesRating;
        });

        if (!matchesAnyTerm) {
          return false;
        }
      }

      return true;
    });
  };

  const [sessions, setSessions] = useState([
    {
      id: 1,
      tutor: "Alice Tan",
      student: "Elson",
      subject: "Math",
      date: "2025-09-06",
      time: "15:00",
      type: "live",
      status: "completed",
      feedback: null,
    },
  ]);

  useEffect(() => {
    const lastLogin = localStorage.getItem("last-daily-login");
    const today = new Date().toDateString();
    if (lastLogin === today) {
      setHasLoggedInToday(true);
    }
  }, []);

  const handleDailyLogin = () => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem("last-daily-login");

    if (lastLogin === today) {
      alert("You've already checked in today!");
      return;
    }

    localStorage.setItem("last-daily-login", today);
    setHasLoggedInToday(true);

    simulateStudentAction("daily_login");

    addActivity("Checked in for daily login", "user");

    alert("🎉 Daily login successful! Coins awarded.");
  };

  const [selectedAction, setSelectedAction] = useState("");

  const [assignments, setAssignments] = useState([
    { id: 1, title: "Math Quiz 1", completed: false },
    { id: 2, title: "Science Homework", completed: false },
    { id: 3, title: "English Essay", completed: false },
  ]);

  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const raw = localStorage.getItem("auth-user");
    if (!raw) {
      alert("Please log in to access the dashboard.");
      navigate("/login");
    }
  }, [navigate]);

  const [stats, setStats] = useState({
    users: 0,
    tutors: 0,
    sessions: 0,
    satisfaction: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tutors] = useState([
    {
      id: 1,
      name: "Alice Tan",
      subject: "Mathematics",
      experience: 5,
      rating: 4.8,
      price: 45,
      description:
        "Alice specializes in algebra, calculus, and competition math. She focuses on problem-solving strategies and building strong fundamentals.",
    },
    {
      id: 2,
      name: "Benjamin Lee",
      subject: "Physics",
      experience: 7,
      rating: 4.9,
      price: 55,
      description:
        "Benjamin makes physics intuitive with visuals and real-world examples. Experienced in IGCSE, A-Levels, and AP curricula.",
    },
    {
      id: 3,
      name: "Carmen Ong",
      subject: "Chemistry",
      experience: 4,
      rating: 4.7,
      price: 40,
      description:
        "Carmen simplifies complex concepts in organic and physical chemistry. Provides concise notes and practice questions.",
    },
    {
      id: 4,
      name: "Daniel Wong",
      subject: "English",
      experience: 6,
      rating: 4.6,
      price: 50,
      description:
        "Daniel improves grammar, writing, and literature analysis with structured frameworks and plenty of feedback.",
    },
    {
      id: 5,
      name: "Evelyn Lim",
      subject: "Biology",
      experience: 3,
      rating: 4.5,
      price: 35,
      description:
        "Evelyn teaches exam-oriented biology with diagrams and active recall. Great for secondary to pre-university levels.",
    },
    {
      id: 6,
      name: "Frank Chen",
      subject: "Python Programming",
      experience: 8,
      rating: 4.9,
      price: 60,
      description:
        "Frank is a software engineer with expertise in Python, data science, and web development. Great for beginners to advanced learners.",
    },
    {
      id: 7,
      name: "Grace Kim",
      subject: "Guitar",
      experience: 6,
      rating: 4.8,
      price: 40,
      description:
        "Grace teaches acoustic and electric guitar for all skill levels. Specializes in rock, pop, and classical music styles.",
    },
    {
      id: 8,
      name: "Henry Zhang",
      subject: "C++ Programming",
      experience: 9,
      rating: 4.7,
      price: 65,
      description:
        "Henry is a senior software developer specializing in C++, algorithms, and competitive programming. Perfect for CS students.",
    },
    {
      id: 9,
      name: "Isabella Rodriguez",
      subject: "Piano",
      experience: 10,
      rating: 4.9,
      price: 50,
      description:
        "Isabella is a classically trained pianist with experience teaching children and adults. Focuses on technique and musicality.",
    },
    {
      id: 10,
      name: "James Wilson",
      subject: "History",
      experience: 5,
      rating: 4.6,
      price: 35,
      description:
        "James makes history engaging with storytelling and critical analysis. Specializes in world history and political science.",
    },
  ]);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('q');
    if (searchQuery) {
      setFilters(prev => ({
        ...prev,
        searchQuery: decodeURIComponent(searchQuery)
      }));
    }
  }, [location.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        users: 1247,
        tutors: 320,
        sessions: 156, 
        satisfaction: 95,
      });

      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.hash === "#tutors") {
      const el = document.getElementById("tutors");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "session":
        return "📅";
      case "upload":
        return "📚";
      case "coins":
        return "💰";
      case "user":
        return "👤";
      default:
        return "📝";
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <p>Loading your data...</p>
        </div>
        <div className="loading-spinner">⏳</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, {currentUser?.fullName || "Learner"}! 👋</h2>
        <p>
          Check your upcoming sessions, achievements, and rewards for today 📚✨
        </p>
        <div className="role-bar">
          <label className="role-label">Role:</label>
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>
          <span className="coin-badge student">
            Student Coins: {studentCoins}
          </span>
          <span className="coin-badge tutor">Tutor Coins: {tutorCoins}</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.users.toLocaleString()}</h3>
            <p>Total Learners</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>{stats.tutors}</h3>
            <p>Active Tutors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.sessions}</h3>
            <p>Sessions This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.satisfaction}%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {role === "student" ? (
          <>
            <TutorRecommendation tutors={tutors} />
            <div id="tutors" className="tutors-panel">
              <h3>Find Your Tutor</h3>
              {filters.searchQuery && (
                <div className="search-results-header">
                  <p>Search results for: <strong>"{filters.searchQuery}"</strong></p>
                  <button 
                    className="clear-search-btn"
                    onClick={() => updateFilter("searchQuery", "")}
                  >
                    Clear Search
                  </button>
                </div>
              )}

              <div className="tutor-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <label>Search:</label>
                    <input
                      type="text"
                      placeholder="Search by name, subject, or description..."
                      value={filters.searchQuery}
                      onChange={(e) =>
                        updateFilter("searchQuery", e.target.value)
                      }
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Subject:</label>
                    <select
                      value={filters.subject}
                      onChange={(e) => updateFilter("subject", e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="English">English</option>
                      <option value="Biology">Biology</option>
                      <option value="History">History</option>
                      <option value="Python Programming">Python Programming</option>
                      <option value="C++ Programming">C++ Programming</option>
                      <option value="Guitar">Guitar</option>
                      <option value="Piano">Piano</option>
                    </select>
                  </div>
                </div>

                <div className="filter-row">
                  <div className="filter-group">
                    <label>
                      Price Range: ${filters.priceRange.min} - $
                      {filters.priceRange.max}
                    </label>
                    <div className="range-inputs">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.priceRange.min}
                        onChange={(e) =>
                          updateFilter("priceRange", {
                            ...filters.priceRange,
                            min: parseInt(e.target.value),
                          })
                        }
                        className="range-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          updateFilter("priceRange", {
                            ...filters.priceRange,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="range-slider"
                      />
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>
                      Experience: {filters.experience.min} -{" "}
                      {filters.experience.max} years
                    </label>
                    <div className="range-inputs">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={filters.experience.min}
                        onChange={(e) =>
                          updateFilter("experience", {
                            ...filters.experience,
                            min: parseInt(e.target.value),
                          })
                        }
                        className="range-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={filters.experience.max}
                        onChange={(e) =>
                          updateFilter("experience", {
                            ...filters.experience,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="range-slider"
                      />
                    </div>
                  </div>
                </div>

                <div className="filter-row">
                  <div className="filter-group">
                    <label>
                      Rating: {filters.rating.min} - {filters.rating.max} stars
                    </label>
                    <div className="range-inputs">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={filters.rating.min}
                        onChange={(e) =>
                          updateFilter("rating", {
                            ...filters.rating,
                            min: parseFloat(e.target.value),
                          })
                        }
                        className="range-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={filters.rating.max}
                        onChange={(e) =>
                          updateFilter("rating", {
                            ...filters.rating,
                            max: parseFloat(e.target.value),
                          })
                        }
                        className="range-slider"
                      />
                    </div>
                  </div>

                  <div className="filter-actions">
                    <button
                      onClick={clearFilters}
                      className="clear-filters-btn"
                    >
                      Clear Filters
                    </button>
                    <span className="results-count">
                      {getFilteredTutors().length} tutors found
                    </span>
                  </div>
                </div>
              </div>

              <div className="tutor-grid">
                {getFilteredTutors().map((t) => (
                  <div key={t.id} className="tutor-card">
                    <div className="tutor-header">
                      <div className="avatar" aria-hidden>
                        👩‍🏫
                      </div>
                      <div>
                        <div className="tutor-name">{t.name}</div>
                        <div className="tutor-subject">{t.subject}</div>
                      </div>
                    </div>
                    <div className="tutor-meta">
                      <span>Experience: {t.experience} yrs</span>
                      <span className="rating">⭐ {t.rating}</span>
                    </div>
                    <div className="tutor-price">
                      <span className="price-label">Price per hour:</span>
                      <span className="price-amount">${t.price}</span>
                    </div>
                    <button
                      className="action-btn primary"
                      onClick={() => setSelectedTutor(t)}
                    >
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <PerformanceInsights
              sessions={sessions}
              currentUser={currentUser}
            />
            <div> </div>
          </>
        )}

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-details">
                  <p className="activity-action">{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>

          {role === "student" ? (
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() => {
                  navigate("/dashboard#tutors");
                }}
              >
                🔍 Find a Tutor
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setAiOpen(true)}
              >
                🤖 AI Assistant
              </button>
              <button
                className="action-btn secondary"
                onClick={() => navigate("/assignments")}
              >
                📚 View Assignments
              </button>
              <button
                className="action-btn secondary"
                onClick={() => navigate("/rewards")}
              >
                💰 Redeem Rewards
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("view_schedule")}
              >
                🗓 My Schedule
              </button>
            </div>
          ) : (
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() => setSelectedAction("conduct_session")}
              >
                📅 Start a Session
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setAiOpen(true)}
              >
                🤖 AI Assistant
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("upload_material")}
              >
                📤 Upload Materials
              </button>
              <button
                className="action-btn secondary"
                onClick={() => navigate("/tutor-assignments")}
              >
                📚 Manage Assignments
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("view_earnings")}
              >
                📊 View Earnings
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("respond_feedback")}
              >
                💬 Respond to Feedback
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("view_schedule")}
              >
                🗓 My Teaching Schedule
              </button>
            </div>
          )}

          <h3 style={{ marginTop: 24 }}>Earning Actions</h3>
          {role === "student" ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="action-btn primary"
                onClick={() => {
                  navigate("/dashboard#tutors");
                }}
              >
                📅 Attend a Lesson
              </button>

              <button
                className="action-btn secondary"
                onClick={() => navigate("/assignments")}
              >
                📚 Complete Assignments
              </button>

              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("feedback")}
              >
                Give useful feedback
              </button>

              <button
                className="action-btn secondary"
                onClick={handleDailyLogin}
                disabled={hasLoggedInToday}
                style={{
                  opacity: hasLoggedInToday ? 0.6 : 1,
                  cursor: hasLoggedInToday ? "not-allowed" : "pointer",
                }}
              >
                {hasLoggedInToday ? "✅ Checked In" : "Check In"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="action-btn primary"
                onClick={() => setSelectedAction("conduct_session")}
              >
                Conduct a tutoring session
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("respond_feedback")}
              >
                View Student Feedback
              </button>
              <button
                className="action-btn secondary"
                onClick={() => setSelectedAction("upload_material")}
              >
                📤 Upload Materials
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedTutor && (
        <div className="modal-overlay" onClick={() => setSelectedTutor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="avatar lg" aria-hidden>
                👩‍🏫
              </div>
              <div>
                <div className="tutor-name">{selectedTutor.name}</div>
                <div className="tutor-subject">{selectedTutor.subject}</div>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedTutor(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>{selectedTutor.description}</p>
              <div className="tutor-meta" style={{ marginTop: 12 }}>
                <span>Experience: {selectedTutor.experience} yrs</span>
                <span className="rating">⭐ {selectedTutor.rating}</span>
              </div>
              <div className="tutor-price" style={{ marginTop: 12 }}>
                <span className="price-label">Price per hour:</span>
                <span className="price-amount">${selectedTutor.price}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="action-btn secondary"
                onClick={() => setSelectedTutor(null)}
              >
                Close
              </button>

              <button
                className="action-btn primary"
                onClick={() => {
                  const raw = localStorage.getItem("auth-user");
                  if (!raw) {
                    alert("Please log in to perform this action.");
                    return;
                  }

                  const user = JSON.parse(raw);

                  setSessions((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      tutor: selectedTutor.name,
                      student: user.fullName,
                      subject: selectedTutor.subject,
                      date: new Date().toISOString().split("T")[0],
                      time: "15:00",
                      type: "live",
                      status: "upcoming",
                    },
                  ]);

                  simulateStudentAction("attend_session");

                  addActivity(
                    `You joined ${selectedTutor.name}'s ${selectedTutor.subject} class`,
                    "session"
                  );

                  navigate(`/lesson?student=true&tutor=${encodeURIComponent(selectedTutor.name)}&subject=${encodeURIComponent(selectedTutor.subject)}`);
                  setSelectedTutor(null);
                }}
              >
                💳 Pay & Join Class
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAction === "assignments" && (
        <div className="modal-overlay" onClick={() => setSelectedAction("")}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assignments</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedAction("")}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {assignments.filter((a) => !a.completed).length === 0 ? (
                <p>✅ All assignments are completed!</p>
              ) : (
                <ul>
                  {assignments
                    .filter((a) => !a.completed)
                    .map((a) => (
                      <li key={a.id} style={{ marginBottom: 12 }}>
                        <span>{a.title}</span>
                        <button
                          className="action-btn primary"
                          style={{ marginLeft: 12 }}
                          onClick={() => {
                            const raw = localStorage.getItem("auth-user");
                            if (!raw) {
                              alert("Please log in to perform this action.");
                              return;
                            }

                            setAssignments((prev) =>
                              prev.map((x) =>
                                x.id === a.id ? { ...x, completed: true } : x
                              )
                            );

                            simulateStudentAction("complete_assignment");

                            addActivity(
                              `Completed assignment: ${a.title}`,
                              "assignment"
                            );

                            alert(
                              `🎉 You completed ${a.title} and earned coins!`
                            );
                          }}
                        >
                          Complete
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAction === "feedback" && (
        <div className="modal-overlay" onClick={() => setSelectedAction("")}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Give Feedback</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedAction("")}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {sessions.filter((s) => s.student === currentUser?.fullName)
                .length === 0 ? (
                <p>⚠️ You need to attend a class before giving feedback.</p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const raw = localStorage.getItem("auth-user");
                    if (!raw) {
                      alert("Please log in first.");
                      return;
                    }

                    const formData = new FormData(e.target);
                    const sessionId = formData.get("session");
                    const feedback = formData.get("feedback");

                    setSessions((prev) =>
                      prev.map((s) =>
                        s.id.toString() === sessionId ? { ...s, feedback } : s
                      )
                    );

                    simulateStudentAction("give_feedback");
                    addActivity("Submitted feedback for a tutor", "feedback");

                    alert("🎉 Feedback submitted successfully! Coins awarded.");
                    setSelectedAction("");
                  }}
                >
                  <label>Select a Tutor:</label>
                  <select name="session" required>
                    {sessions
                      .filter(
                        (s) =>
                          s.student === currentUser?.fullName && !s.feedback
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.subject} with {s.tutor} ({s.date})
                        </option>
                      ))}
                  </select>

                  <textarea
                    name="feedback"
                    required
                    placeholder="Write your feedback here..."
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "8px",
                      borderRadius: "8px",
                      marginTop: "12px",
                    }}
                  />

                  <button
                    type="submit"
                    className="action-btn primary"
                    style={{ marginTop: "12px" }}
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAction === "respond_feedback" && (
        <div className="modal-overlay" onClick={() => setSelectedAction("")}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Feedback</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedAction("")}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {sessions.filter(
                (s) => s.tutor === currentUser?.fullName && s.feedback
              ).length === 0 ? (
                <p>No feedback yet.</p>
              ) : (
                <ul>
                  {sessions
                    .filter(
                      (s) => s.tutor === currentUser?.fullName && s.feedback
                    )
                    .map((s) => (
                      <li key={s.id} style={{ marginBottom: 12 }}>
                        <strong>{s.student}</strong> ({s.subject} on {s.date}):
                        <p style={{ marginTop: 4, fontStyle: "italic" }}>
                          {s.feedback}
                        </p>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAction === "upload_material" && (
        <div className="modal-overlay" onClick={() => setSelectedAction("")}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Materials</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedAction("")}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  simulateTutorAction("upload_material");
                  setTutorEarnings((prev) => ({
                    ...prev,
                    upload_material: prev.upload_material + 15,
                  }));

                  addActivity("Uploaded new study material", "upload");

                  alert("📤 Materials uploaded successfully! Coins awarded.");
                  setSelectedAction("");
                }}
              >
                <input type="file" required style={{ marginBottom: "10px" }} />
                <button type="submit" className="action-btn primary">
                  Upload
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedAction === "conduct_session" && (
        <div className="modal-overlay" onClick={() => setSelectedAction("")}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <LessonPage
              onFinish={(action) => {
                simulateTutorAction(action);
                setTutorEarnings((prev) => ({
                  ...prev,
                  session: prev.session + 20,
                }));

                addActivity("Conducted a tutoring session", "session");

                alert("🎉 Coins awarded for conducting the session!");
                setSelectedAction("");
              }}
            />
          </div>
        </div>
      )}

      {selectedAction === "view_schedule" && (
        <div className="modal-overlay" onClick={() => setSelectedAction("")}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {role === "student" ? "My Schedule" : "Teaching Schedule"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setSelectedAction("")}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {sessions.filter((s) =>
                role === "student"
                  ? s.student === currentUser?.fullName
                  : s.tutor === currentUser?.fullName
              ).length === 0 ? (
                <p>No sessions scheduled.</p>
              ) : (
                <ul>
                  {sessions
                    .filter((s) =>
                      role === "student"
                        ? s.student === currentUser?.fullName
                        : s.tutor === currentUser?.fullName
                    )
                    .map((s) => (
                      <li key={s.id} style={{ marginBottom: 8 }}>
                        <strong>{s.subject}</strong> with{" "}
                        <em>{role === "student" ? s.tutor : s.student}</em>
                        <br />
                        Date: {s.date} | Time: {s.time} | Type: {s.type} |
                        Status: {s.status}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAction === "view_earnings" && (
        <div className="modal-overlay" onClick={() => setSelectedAction("")}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>My Earnings</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedAction("")}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <ul>
                <li>📅 Sessions Conducted: {tutorEarnings.session} coins</li>
                <li>
                  📤 Materials Uploaded: {tutorEarnings.upload_material} coins
                </li>
                <li>
                  👍 Positive Ratings: {tutorEarnings.positive_rating} coins
                </li>
                <li>
                  🔥 Consistency Bonus: {tutorEarnings.consistency_bonus} coins
                </li>
                <li>💬 Student Engagement: {tutorEarnings.engagement} coins</li>
              </ul>
              <p>
                <strong>Total Coins Earned: </strong>
                {Object.values(tutorEarnings).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="action-btn primary"
                onClick={() => setSelectedAction("")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`ai-assistant ${aiOpen ? "open" : "collapsed"}`}>
        {aiOpen ? (
          <div className="ai-container">
            <div className="ai-header">
              <span>AI Assistant 🤖</span>
              <button className="ai-close-btn" onClick={() => setAiOpen(false)}>
                ✕
              </button>
            </div>
            <div className="ai-messages">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`ai-message ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <form className="ai-input-form" onSubmit={handleAiSend}>
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask me..."
                className="ai-input"
              />
              <button type="submit" className="action-btn primary">
                Send
              </button>
            </form>
          </div>
        ) : (
          <button className="ai-float-btn" onClick={() => setAiOpen(true)}>
            🤖
          </button>
        )}
      </div>
    </div>
  );
}
