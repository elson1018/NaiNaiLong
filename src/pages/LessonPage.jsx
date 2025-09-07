import { useState, useEffect } from "react";
import { useCoins } from "../context/CoinContext.jsx";
import "./LessonPage.css";

export default function LessonPage({ onFinish, tutor, subject }) {
  const { role } = useCoins();
  const [lessonType, setLessonType] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isStudentView, setIsStudentView] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentView = urlParams.get('student') === 'true';
    setIsStudentView(studentView);
  }, []);

  useEffect(() => {
    let interval;
    if (sessionStarted) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const startLiveSession = () => {
    setSessionStarted(true);
    setSessionTime(0);
  };

  const endLiveSession = () => {
    setSessionStarted(false);
    if (onFinish) {
      onFinish("conduct_session");
    }
  };

  const submitPrerecordedLesson = () => {
    if (uploadedFile) {
      alert("✅ Pre-recorded lesson uploaded successfully! Coins awarded!");
      if (onFinish) {
        onFinish("conduct_session");
      }
    }
  };

  const joinLesson = () => {
    alert("🎉 Successfully joined the lesson! Enjoy your learning session!");
  };

  if (isStudentView || role === "student") {
    return (
      <div className="lesson-page student-view">
        <div className="lesson-container">
          <div className="lesson-header">
            <h2>📚 {subject || "Mathematics"} Lesson</h2>
            <p>with {tutor || "Alice Tan"}</p>
            <div className="lesson-type-badge">
              {lessonType === "live" ? "🔴 Live Session" : "🎥 Pre-recorded"}
            </div>
          </div>

          <div className="lesson-content">
            {lessonType === "live" ? (
              <div className="live-session">
                <div className="video-container">
                  <div className="video-placeholder">
                    <div className="video-icon">📹</div>
                    <h3>Live Video Stream</h3>
                    <p>Connected to {tutor || "Alice Tan"}'s session</p>
                    {sessionStarted && (
                      <div className="session-timer">
                        Session Time: {formatTime(sessionTime)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="session-controls">
                  {!sessionStarted ? (
                    <button className="join-btn" onClick={joinLesson}>
                      🎯 Join Live Session
                    </button>
                  ) : (
                    <div className="session-active">
                      <div className="status-indicator">
                        <span className="status-dot"></span>
                        Live Session Active
                      </div>
                      <button className="leave-btn" onClick={() => setSessionStarted(false)}>
                        Leave Session
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="prerecorded-session">
                <div className="video-container">
                  <div className="video-player">
                    <div className="play-button">▶️</div>
                    <h3>Pre-recorded Lesson</h3>
                    <p>Duration: 45 minutes</p>
                    <div className="video-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "35%" }}></div>
                      </div>
                      <span>15:30 / 45:00</span>
                    </div>
                  </div>
                </div>
                
                <div className="lesson-actions">
                  <button className="action-btn primary" onClick={joinLesson}>
                    📖 Start Learning
                  </button>
                  <button className="action-btn secondary">
                    📝 Take Notes
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lesson-sidebar">
            <div className="sidebar-section">
              <h4>📋 Lesson Outline</h4>
              <ul>
                <li>Introduction to {subject || "Mathematics"}</li>
                <li>Key Concepts Review</li>
                <li>Practice Problems</li>
                <li>Q&A Session</li>
                <li>Summary & Next Steps</li>
              </ul>
            </div>

            <div className="sidebar-section">
              <h4>💬 Chat</h4>
              <div className="chat-messages">
                <div className="message">
                  <span className="sender">{tutor || "Alice Tan"}:</span>
                  <span className="text">Welcome everyone! Let's start with the basics.</span>
                </div>
                <div className="message">
                  <span className="sender">You:</span>
                  <span className="text">Hello! Excited to learn.</span>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
              </div>
            </div>

            <div className="sidebar-section">
              <h4>📚 Resources</h4>
              <div className="resources-list">
                <div className="resource-item">
                  <span className="resource-icon">📄</span>
                  <span>Lesson Notes.pdf</span>
                  <button>Download</button>
                </div>
                <div className="resource-item">
                  <span className="resource-icon">🔗</span>
                  <span>Practice Problems</span>
                  <button>Open</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tutor view
  return (
    <div className="lesson-page tutor-view">
      <div className="lesson-container">
        <div className="lesson-header">
          <h2>👨‍🏫 Conduct Tutoring Lesson</h2>
          <p>Choose how you want to deliver your lesson</p>
        </div>

        {!lessonType && (
          <div className="lesson-type-selection">
            <div className="type-card" onClick={() => setLessonType("prerecorded")}>
              <div className="type-icon">🎥</div>
              <h3>Pre-recorded Lesson</h3>
              <p>Upload a pre-recorded video lesson for students to watch at their own pace</p>
              <ul>
                <li>✅ Students can rewatch anytime</li>
                <li>✅ Flexible scheduling</li>
                <li>✅ Easy to share resources</li>
              </ul>
            </div>

            <div className="type-card" onClick={() => setLessonType("live")}>
              <div className="type-icon">🔴</div>
              <h3>Live Session</h3>
              <p>Start a real-time interactive session with your students</p>
              <ul>
                <li>✅ Real-time interaction</li>
                <li>✅ Immediate feedback</li>
                <li>✅ Collaborative learning</li>
              </ul>
            </div>
          </div>
        )}

        {lessonType === "prerecorded" && (
          <div className="prerecorded-setup">
            <h3>📹 Upload Pre-recorded Lesson</h3>
            <div className="upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  id="video-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="video-upload" className="upload-label">
                  {uploadedFile ? (
                    <div className="uploaded-file">
                      <span className="file-icon">📹</span>
                      <div>
                        <p className="file-name">{uploadedFile.name}</p>
                        <p className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📤</span>
                      <p>Click to upload video</p>
                      <p className="upload-hint">Supports MP4, AVI, MOV formats</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="lesson-details">
              <h4>Lesson Details</h4>
              <div className="form-group">
                <label>Lesson Title</label>
                <input type="text" placeholder="Enter lesson title" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe what students will learn in this lesson"></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input type="number" placeholder="45" />
                </div>
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lesson-actions">
              <button className="action-btn secondary" onClick={() => setLessonType("")}>
                Back
              </button>
              <button 
                className="action-btn primary" 
                onClick={submitPrerecordedLesson}
                disabled={!uploadedFile}
              >
                Upload Lesson
              </button>
            </div>
          </div>
        )}

        {lessonType === "live" && (
          <div className="live-setup">
            <h3>🔴 Live Session Setup</h3>
            
            {!sessionStarted ? (
              <div className="session-setup">
                <div className="setup-section">
                  <h4>Session Information</h4>
                  <div className="form-group">
                    <label>Session Title</label>
                    <input type="text" placeholder="Enter session title" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="What will you cover in this session?"></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Estimated Duration</label>
                      <select>
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                        <option>60 minutes</option>
                        <option>90 minutes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Max Students</label>
                      <input type="number" placeholder="10" />
                    </div>
                  </div>
                </div>

                <div className="session-controls">
                  <button className="action-btn secondary" onClick={() => setLessonType("")}>
                    Back
                  </button>
                  <button className="action-btn primary" onClick={startLiveSession}>
                    🚀 Start Live Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="active-session">
                <div className="session-header">
                  <div className="session-info">
                    <h4>Live Session Active</h4>
                    <div className="session-timer">
                      Duration: {formatTime(sessionTime)}
                    </div>
                  </div>
                  <div className="session-status">
                    <span className="status-dot"></span>
                    Live
                  </div>
                </div>

                <div className="video-container">
                  <div className="video-placeholder">
                    <div className="video-icon">📹</div>
                    <h3>Your Live Stream</h3>
                    <p>Students can now join your session</p>
                    <div className="participants">
                      <span className="participant-count">👥 3 students joined</span>
                    </div>
                  </div>
                </div>

                <div className="session-tools">
                  <button className="tool-btn">📝 Share Screen</button>
                  <button className="tool-btn">📄 Share Whiteboard</button>
                  <button className="tool-btn">💬 Open Chat</button>
                  <button className="tool-btn">📚 Share Resources</button>
                </div>

                <div className="session-controls">
                  <button className="action-btn secondary" onClick={() => setSessionStarted(false)}>
                    Pause Session
                  </button>
                  <button className="action-btn primary" onClick={endLiveSession}>
                    ✅ End Session
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
