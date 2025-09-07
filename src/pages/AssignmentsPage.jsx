import { useState, useEffect } from "react";
import { useCoins } from "../context/CoinContext.jsx";
import "./AssignmentsPage.css";

export default function AssignmentsPage() {
  const { simulateStudentAction } = useCoins();
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      title: "Algebra Practice Set", 
      subject: "Mathematics", 
      status: "Incomplete",
      difficulty: "Beginner",
      estimatedTime: "30 minutes",
      coins: 15,
      questions: [
        { id: 1, question: "Solve for x: 2x + 5 = 13", options: ["x = 4", "x = 3", "x = 6", "x = 2"], correct: 0 },
        { id: 2, question: "What is the value of 3x - 7 when x = 4?", options: ["5", "12", "19", "1"], correct: 0 },
        { id: 3, question: "Simplify: 2(x + 3) - 4", options: ["2x + 2", "2x + 6", "2x - 2", "2x + 10"], correct: 0 }
      ]
    },
    { 
      id: 2, 
      title: "Newton's Laws Quiz", 
      subject: "Physics", 
      status: "Incomplete",
      difficulty: "Intermediate",
      estimatedTime: "45 minutes",
      coins: 20,
      questions: [
        { id: 1, question: "What is Newton's First Law?", options: ["F = ma", "An object at rest stays at rest", "Every action has an equal reaction", "Gravity pulls objects down"], correct: 1 },
        { id: 2, question: "Which law explains why you feel pushed back in a car when it accelerates?", options: ["First Law", "Second Law", "Third Law", "Law of Gravity"], correct: 0 },
        { id: 3, question: "What does F = ma represent?", options: ["First Law", "Second Law", "Third Law", "Law of Conservation"], correct: 1 }
      ]
    },
    { 
      id: 3, 
      title: "Organic Chemistry Worksheet", 
      subject: "Chemistry", 
      status: "Incomplete",
      difficulty: "Advanced",
      estimatedTime: "60 minutes",
      coins: 25,
      questions: [
        { id: 1, question: "What is the general formula for alkanes?", options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"], correct: 1 },
        { id: 2, question: "Which functional group is present in alcohols?", options: ["-COOH", "-OH", "-CHO", "-NH2"], correct: 1 },
        { id: 3, question: "What type of bond is formed between carbon atoms in alkenes?", options: ["Single bond", "Double bond", "Triple bond", "Ionic bond"], correct: 1 }
      ]
    },
    { 
      id: 4, 
      title: "Python Basics Quiz", 
      subject: "Programming", 
      status: "Incomplete",
      difficulty: "Beginner",
      estimatedTime: "25 minutes",
      coins: 18,
      questions: [
        { id: 1, question: "What is the correct way to create a list in Python?", options: ["list = []", "list = {}", "list = ()"], correct: 0 },
        { id: 2, question: "Which keyword is used to define a function in Python?", options: ["def", "function", "define", "func"], correct: 0 },
        { id: 3, question: "What will print(2 + 3 * 4) output?", options: ["20", "14", "24", "Error"], correct: 1 }
      ]
    }
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [completedAssignments, setCompletedAssignments] = useState([]);

  useEffect(() => {
    const completed = localStorage.getItem("completed-assignments");
    if (completed) {
      setCompletedAssignments(JSON.parse(completed));
    }
  }, []);

  const startAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedAssignment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    selectedAssignment.questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
  };

  const completeAssignment = () => {
    if (score >= selectedAssignment.questions.length * 0.6) { // 60% pass rate
      simulateStudentAction("complete_assignment");
      
      const updatedAssignments = assignments.map(a => 
        a.id === selectedAssignment.id ? { ...a, status: "Completed" } : a
      );
      setAssignments(updatedAssignments);
      
      const newCompleted = [...completedAssignments, selectedAssignment.id];
      setCompletedAssignments(newCompleted);
      localStorage.setItem("completed-assignments", JSON.stringify(newCompleted));
      
      alert(`🎉 Assignment completed! You scored ${score}/${selectedAssignment.questions.length} and earned ${selectedAssignment.coins} coins!`);
    } else {
      alert(`❌ You need at least 60% to pass. You scored ${score}/${selectedAssignment.questions.length}. Try again!`);
    }
    
    setSelectedAssignment(null);
    setShowResults(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "#22c55e";
      case "Intermediate": return "#f59e0b";
      case "Advanced": return "#ef4444";
      default: return "#64748b";
    }
  };

  const filteredAssignments = assignments.filter(a => !completedAssignments.includes(a.id));

  if (selectedAssignment && !showResults) {
    const question = selectedAssignment.questions[currentQuestion];
    return (
      <div className="assignments-page">
        <div className="assignment-quiz">
          <div className="quiz-header">
            <h2>{selectedAssignment.title}</h2>
            <div className="quiz-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestion + 1) / selectedAssignment.questions.length) * 100}%` }}
                />
              </div>
              <span>Question {currentQuestion + 1} of {selectedAssignment.questions.length}</span>
            </div>
          </div>

          <div className="question-card">
            <h3>{question.question}</h3>
            <div className="options">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-btn ${answers[question.id] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(question.id, index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-actions">
            <button 
              className="action-btn secondary"
              onClick={() => setSelectedAssignment(null)}
            >
              Exit Quiz
            </button>
            <button 
              className="action-btn primary"
              onClick={nextQuestion}
              disabled={answers[question.id] === undefined}
            >
              {currentQuestion === selectedAssignment.questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="assignments-page">
        <div className="results-card">
          <div className="results-header">
            <h2>Quiz Results</h2>
            <div className="score-display">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {selectedAssignment.questions.length}</span>
            </div>
          </div>

          <div className="results-details">
            <p className="score-percentage">
              {((score / selectedAssignment.questions.length) * 100).toFixed(1)}% Correct
            </p>
            <p className="pass-status">
              {score >= selectedAssignment.questions.length * 0.6 ? 
                "🎉 Congratulations! You passed!" : 
                "❌ You need at least 60% to pass. Try again!"
              }
            </p>
          </div>

          <div className="results-actions">
            <button 
              className="action-btn secondary"
              onClick={() => {
                setSelectedAssignment(null);
                setShowResults(false);
              }}
            >
              Back to Assignments
            </button>
            {score >= selectedAssignment.questions.length * 0.6 ? (
              <button 
                className="action-btn primary"
                onClick={completeAssignment}
              >
                Complete Assignment (+{selectedAssignment.coins} coins)
              </button>
            ) : (
              <button 
                className="action-btn primary"
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
              >
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-page">
      <div className="page-header">
        <h1>📚 Assignments & Quizzes</h1>
        <p>Complete assignments to earn coins and improve your skills</p>
      </div>

      <div className="assignments-stats">
        <div className="stat-card">
          <span className="stat-number">{filteredAssignments.length}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{completedAssignments.length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{assignments.reduce((sum, a) => sum + a.coins, 0)}</span>
          <span className="stat-label">Total Coins</span>
        </div>
      </div>

      <div className="assignments-grid">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <div className="assignment-info">
                <h3>{assignment.title}</h3>
                <p className="assignment-subject">{assignment.subject}</p>
              </div>
              <div className="assignment-coins">+{assignment.coins} 🪙</div>
            </div>

            <div className="assignment-details">
              <div className="detail-item">
                <span className="detail-label">Difficulty:</span>
                <span 
                  className="detail-value difficulty"
                  style={{ color: getDifficultyColor(assignment.difficulty) }}
                >
                  {assignment.difficulty}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{assignment.estimatedTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Questions:</span>
                <span className="detail-value">{assignment.questions.length}</span>
              </div>
            </div>

            <button 
              className="start-btn"
              onClick={() => startAssignment(assignment)}
            >
              Start Assignment
            </button>
          </div>
        ))}
      </div>

      {completedAssignments.length > 0 && (
        <div className="completed-section">
          <h3>✅ Completed Assignments</h3>
          <div className="completed-list">
            {assignments.filter(a => completedAssignments.includes(a.id)).map(assignment => (
              <div key={assignment.id} className="completed-item">
                <span>{assignment.title}</span>
                <span className="completed-coins">+{assignment.coins} 🪙</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


