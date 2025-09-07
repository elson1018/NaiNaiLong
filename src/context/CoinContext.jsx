import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CoinContext = createContext(null);

const STORAGE_KEY = "coin-system-state";

export function CoinProvider({ children }) {
  const [role, setRole] = useState("student");
  const [studentCoins, setStudentCoins] = useState(0);
  const [tutorCoins, setTutorCoins] = useState(0);
  const [streaks, setStreaks] = useState({ dailyLogin: 0, weeklyAttendance: 0, tutorConsistency: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.role === "string") setRole(parsed.role);
        if (typeof parsed.studentCoins === "number") setStudentCoins(parsed.studentCoins);
        if (typeof parsed.tutorCoins === "number") setTutorCoins(parsed.tutorCoins);
        if (parsed.streaks && typeof parsed.streaks === "object") setStreaks(parsed.streaks);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const state = { role, studentCoins, tutorCoins, streaks };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [role, studentCoins, tutorCoins, streaks]);

  const addStudentCoins = useCallback((amount) => setStudentCoins((c) => Math.max(0, c + amount)), []);
  const addTutorCoins = useCallback((amount) => setTutorCoins((c) => Math.max(0, c + amount)), []);

  const spendStudentCoins = useCallback((amount) => setStudentCoins((c) => Math.max(0, c - amount)), []);
  const spendTutorCoins = useCallback((amount) => setTutorCoins((c) => Math.max(0, c - amount)), []);

  const simulateStudentAction = useCallback((action) => {
    switch (action) {
      case "attend_session":
        addStudentCoins(10);
        setStreaks((s) => ({ ...s, weeklyAttendance: Math.min(7, (s.weeklyAttendance || 0) + 1) }));
        break;
      case "complete_assignment":
        addStudentCoins(15);
        break;
      case "give_feedback":
        addStudentCoins(5);
        break;
      case "daily_login":
        addStudentCoins(5);
        setStreaks((s) => {
          const next = (s.dailyLogin || 0) + 1;
          if (next >= 3) addStudentCoins(5); 
          return { ...s, dailyLogin: next };
        });
        localStorage.setItem("last-daily-login", new Date().toDateString());
        break;
      case "weekly_streak_completed":
        addStudentCoins(30);
        setStreaks((s) => ({ ...s, weeklyAttendance: 0 }));
        break;
      default:
        break;
    }
  }, [addStudentCoins]);

  const simulateTutorAction = useCallback((action) => {
    switch (action) {
      case "conduct_session":
        addTutorCoins(20);
        setStreaks((s) => ({ ...s, tutorConsistency: Math.min(7, (s.tutorConsistency || 0) + 1) }));
        break;
      case "positive_rating":
        addTutorCoins(10);
        break;
      case "consistency_bonus":
        addTutorCoins(30);
        setStreaks((s) => ({ ...s, tutorConsistency: 0 }));
        break;
      case "upload_material":
        addTutorCoins(15);
        break;
      case "student_engagement":
        addTutorCoins(25);
        break;
      default:
        break;
    }
  }, [addTutorCoins]);

  const value = useMemo(() => ({
    role,
    setRole,
    studentCoins,
    tutorCoins,
    streaks,
    addStudentCoins,
    addTutorCoins,
    spendStudentCoins,
    spendTutorCoins,
    simulateStudentAction,
    simulateTutorAction,
  }), [role, studentCoins, tutorCoins, streaks, addStudentCoins, addTutorCoins, spendStudentCoins, spendTutorCoins, simulateStudentAction, simulateTutorAction]);

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
}

export function useCoins() {
  const ctx = useContext(CoinContext);
  if (!ctx) throw new Error("useCoins must be used within CoinProvider");
  return ctx;
}




