import { useState, useEffect } from "react";
import { useCoins } from "../context/CoinContext.jsx";
import "./TutorAssignmentsPage.css";

export default function TutorAssignmentsPage() {
  const { role } = useCoins();
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Advanced Calculus Problems",
      subject: "Mathematics",
      description: "Solve complex calculus problems including derivatives, integrals, and limits. Focus on applications in physics and engineering.",
      difficulty: "Advanced",
      estimatedTime: "90 minutes",
      dueDate: "2024-01-15",
      maxPoints: 100,
      status: "Active",
      assignedTo: ["Alice Johnson", "Bob Smith"],
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      title: "Organic Chemistry Mechanisms",
      subject: "Chemistry",
      description: "Study and explain various organic reaction mechanisms including SN1, SN2, E1, and E2 reactions with detailed examples.",
      difficulty: "Intermediate",
      estimatedTime: "60 minutes",
      dueDate: "2024-01-18",
      maxPoints: 80,
      status: "Active",
      assignedTo: ["Carol Davis", "David Wilson"],
      createdAt: "2024-01-12"
    },
    {
      id: 3,
      title: "Python Data Structures",
      subject: "Programming",
      description: "Implement and analyze various data structures in Python including lists, dictionaries, sets, and custom classes.",
      difficulty: "Beginner",
      estimatedTime: "45 minutes",
      dueDate: "2024-01-20",
      maxPoints: 70,
      status: "Draft",
      assignedTo: [],
      createdAt: "2024-01-14"
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject: "",
    description: "",
    difficulty: "Beginner",
    estimatedTime: "",
    dueDate: "",
    maxPoints: 100
  });

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "English", "Biology", "History",
    "Python Programming", "C++ Programming", "Guitar", "Piano"
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const assignment = {
      id: assignments.length + 1,
      ...newAssignment,
      status: "Active",
      assignedTo: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments([...assignments, assignment]);
    setNewAssignment({
      title: "",
      subject: "",
      description: "",
      difficulty: "Beginner",
      estimatedTime: "",
      dueDate: "",
      maxPoints: 100
    });
    setShowCreateForm(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "#22c55e";
      case "Intermediate": return "#f59e0b";
      case "Advanced": return "#ef4444";
      default: return "#64748b";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "#22c55e";
      case "Draft": return "#f59e0b";
      case "Completed": return "#3b82f6";
      default: return "#64748b";
    }
  };

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

  if (role !== "tutor") {
    return (
      <div className="tutor-assignments-page">
        <div className="access-denied">
          <h2>🔒 Access Restricted</h2>
          <p>This page is only available for tutors. Please switch to tutor role to access assignment management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tutor-assignments-page">
      <div className="page-header">
        <h1>📚 Assignment Management</h1>
        <p>Create and manage assignments for your students</p>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(true)}
        >
          + Create New Assignment
        </button>
      </div>

      <div className="assignments-stats">
        <div className="stat-card">
          <span className="stat-number">{assignments.length}</span>
          <span className="stat-label">Total Assignments</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{assignments.filter(a => a.status === "Active").length}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{assignments.reduce((sum, a) => sum + a.assignedTo.length, 0)}</span>
          <span className="stat-label">Students Assigned</span>
        </div>
      </div>

      <div className="assignments-grid">
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <div className="assignment-info">
                <div className="assignment-title">
                  <span className="subject-icon">{getSubjectIcon(assignment.subject)}</span>
                  <h3>{assignment.title}</h3>
                </div>
                <p className="assignment-subject">{assignment.subject}</p>
              </div>
              <div className="assignment-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(assignment.status) }}
                >
                  {assignment.status}
                </span>
              </div>
            </div>

            <div className="assignment-description">
              <p>{assignment.description}</p>
            </div>

            <div className="assignment-details">
              <div className="detail-row">
                <span className="detail-label">Difficulty:</span>
                <span 
                  className="detail-value difficulty"
                  style={{ color: getDifficultyColor(assignment.difficulty) }}
                >
                  {assignment.difficulty}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{assignment.estimatedTime}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Points:</span>
                <span className="detail-value">{assignment.maxPoints}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Due:</span>
                <span className="detail-value">{assignment.dueDate}</span>
              </div>
            </div>

            <div className="assignment-students">
              <span className="students-label">Assigned to:</span>
              <div className="students-list">
                {assignment.assignedTo.length > 0 ? (
                  assignment.assignedTo.map((student, index) => (
                    <span key={index} className="student-tag">{student}</span>
                  ))
                ) : (
                  <span className="no-students">No students assigned</span>
                )}
              </div>
            </div>

            <div className="assignment-actions">
              <button 
                className="action-btn secondary"
                onClick={() => setSelectedAssignment(assignment)}
              >
                View Details
              </button>
              <button className="action-btn primary">
                Edit Assignment
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Assignment</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </button>
            </div>
            <form className="modal-body" onSubmit={handleCreateAssignment}>
              <div className="form-group">
                <label>Assignment Title</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  required
                  placeholder="Enter assignment title"
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  required
                  placeholder="Describe the assignment requirements and objectives"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={newAssignment.difficulty}
                    onChange={(e) => setNewAssignment({...newAssignment, difficulty: e.target.value})}
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Time</label>
                  <input
                    type="text"
                    value={newAssignment.estimatedTime}
                    onChange={(e) => setNewAssignment({...newAssignment, estimatedTime: e.target.value})}
                    placeholder="e.g., 60 minutes"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Max Points</label>
                  <input
                    type="number"
                    value={newAssignment.maxPoints}
                    onChange={(e) => setNewAssignment({...newAssignment, maxPoints: parseInt(e.target.value)})}
                    min="1"
                    max="1000"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  className="action-btn secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="action-btn primary">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAssignment && (
        <div className="modal-overlay" onClick={() => setSelectedAssignment(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assignment Details</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedAssignment(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="assignment-detail">
                <h4>{selectedAssignment.title}</h4>
                <p className="assignment-subject">{selectedAssignment.subject}</p>
                <p className="assignment-description">{selectedAssignment.description}</p>
                
                <div className="assignment-meta">
                  <div className="meta-item">
                    <span className="meta-label">Difficulty:</span>
                    <span className="meta-value">{selectedAssignment.difficulty}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Time:</span>
                    <span className="meta-value">{selectedAssignment.estimatedTime}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Points:</span>
                    <span className="meta-value">{selectedAssignment.maxPoints}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Due:</span>
                    <span className="meta-value">{selectedAssignment.dueDate}</span>
                  </div>
                </div>

                <div className="assigned-students">
                  <h5>Assigned Students:</h5>
                  {selectedAssignment.assignedTo.length > 0 ? (
                    <ul>
                      {selectedAssignment.assignedTo.map((student, index) => (
                        <li key={index}>{student}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No students assigned yet</p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="action-btn secondary"
                onClick={() => setSelectedAssignment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
