import { useState, useEffect } from "react";
import "./PerformanceInsights.css";

export default function PerformanceInsights({ sessions, currentUser }) {
  const [insights, setInsights] = useState({
    total: 0,
    feedback: 0,
    averageRating: 0,
    students: [],
    subjectStats: {},
    monthlyStats: [],
    recentFeedback: []
  });

  useEffect(() => {
    const tutorSessions = sessions.filter(s => s.tutor === currentUser?.fullName);
    const feedbackCount = tutorSessions.filter(s => s.feedback).length;
    
    const uniqueStudents = [...new Set(tutorSessions.map(s => s.student))];
    
    const subjectStats = {};
    tutorSessions.forEach(session => {
      if (!subjectStats[session.subject]) {
        subjectStats[session.subject] = { count: 0, students: new Set() };
      }
      subjectStats[session.subject].count++;
      subjectStats[session.subject].students.add(session.student);
    });
    
    Object.keys(subjectStats).forEach(subject => {
      subjectStats[subject].students = subjectStats[subject].students.size;
    });
    
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      
      const monthSessions = tutorSessions.filter(s => 
        s.date.startsWith(monthKey)
      );
      
      monthlyStats.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        sessions: monthSessions.length,
        students: new Set(monthSessions.map(s => s.student)).size
      });
    }
    
    const recentFeedback = tutorSessions
      .filter(s => s.feedback)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setInsights({
      total: tutorSessions.length,
      feedback: feedbackCount,
      averageRating: feedbackCount > 0 ? 4.7 : 0,
      students: uniqueStudents,
      subjectStats,
      monthlyStats,
      recentFeedback
    });
  }, [sessions, currentUser]);

  const getSubjectIcon = (subject) => {
    const icons = {
      'Mathematics': '🔢',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'English': '📝',
      'Biology': '🧬',
      'History': '📚',
      'Python Programming': '🐍',
      'C++ Programming': '⚙️',
      'Guitar': '🎸',
      'Piano': '🎹'
    };
    return icons[subject] || '📖';
  };

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h3>📊 Performance Insights</h3>
        <p>Track your teaching progress and student engagement</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card primary">
          <div className="insight-icon">📅</div>
          <div className="insight-content">
            <h4>{insights.total}</h4>
            <p>Total Sessions</p>
          </div>
        </div>

        <div className="insight-card success">
          <div className="insight-icon">👥</div>
          <div className="insight-content">
            <h4>{insights.students.length}</h4>
            <p>Unique Students</p>
          </div>
        </div>

        <div className="insight-card warning">
          <div className="insight-icon">💬</div>
          <div className="insight-content">
            <h4>{insights.feedback}</h4>
            <p>Feedback Received</p>
          </div>
        </div>

        <div className="insight-card info">
          <div className="insight-icon">⭐</div>
          <div className="insight-content">
            <h4>{insights.averageRating.toFixed(1)}</h4>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="insights-sections">
        <div className="insight-section">
          <h4>📈 Monthly Progress</h4>
          <div className="monthly-chart">
            {insights.monthlyStats.map((month, index) => (
              <div key={index} className="month-bar">
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${Math.max(10, (month.sessions / Math.max(...insights.monthlyStats.map(m => m.sessions), 1)) * 100)}%` 
                    }}
                  />
                </div>
                <span className="bar-label">{month.month}</span>
                <span className="bar-value">{month.sessions}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-section">
          <h4>📚 Subject Statistics</h4>
          <div className="subject-stats">
            {Object.entries(insights.subjectStats).map(([subject, stats]) => (
              <div key={subject} className="subject-item">
                <div className="subject-info">
                  <span className="subject-icon">{getSubjectIcon(subject)}</span>
                  <div>
                    <span className="subject-name">{subject}</span>
                    <span className="subject-students">{stats.students} students</span>
                  </div>
                </div>
                <div className="subject-count">{stats.count} sessions</div>
              </div>
            ))}
          </div>
        </div>

        <div className="insight-section">
          <h4>💬 Recent Feedback</h4>
          <div className="feedback-list">
            {insights.recentFeedback.length > 0 ? (
              insights.recentFeedback.map((session, index) => (
                <div key={index} className="feedback-item">
                  <div className="feedback-header">
                    <span className="feedback-student">{session.student}</span>
                    <span className="feedback-subject">{session.subject}</span>
                    <span className="feedback-date">{session.date}</span>
                  </div>
                  <p className="feedback-text">"{session.feedback}"</p>
                </div>
              ))
            ) : (
              <p className="no-feedback">No feedback received yet</p>
            )}
          </div>
        </div>

        <div className="insight-section">
          <h4>🎯 Performance Summary</h4>
          <div className="performance-summary">
            <div className="summary-item">
              <span className="summary-label">Feedback Rate:</span>
              <span className="summary-value">
                {insights.total > 0 
                  ? `${(insights.feedback / insights.total * 100).toFixed(1)}%` 
                  : "0%"
                }
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Student Retention:</span>
              <span className="summary-value">
                {insights.students.length > 0 
                  ? `${Math.min(100, (insights.total / insights.students.length * 100).toFixed(1))}%` 
                  : "0%"
                }
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Most Popular Subject:</span>
              <span className="summary-value">
                {Object.keys(insights.subjectStats).length > 0
                  ? Object.entries(insights.subjectStats).reduce((a, b) => 
                      insights.subjectStats[a[0]].count > insights.subjectStats[b[0]].count ? a : b
                    )[0]
                  : "None yet"
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
