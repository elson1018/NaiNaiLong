import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./components/Dashboard";
import RewardsPage from "./pages/RewardsPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import FeedbackPage from "./pages/FeedbackPage";
import CheckInPage from "./pages/CheckInPage";
import RedeemedVouchersPage from "./pages/RedeemedVouchersPage";
import TutorAssignmentsPage from "./pages/TutorAssignmentsPage";
import LessonPage from "./pages/LessonPage";

export default function App() {
  return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/redeemed" element={<RedeemedVouchersPage />} />
          <Route path="/tutor-assignments" element={<TutorAssignmentsPage />} />
          <Route path="/lesson" element={<LessonPage />} />
        </Routes>
      </>
  );
}