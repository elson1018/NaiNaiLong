import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCoins } from "../context/CoinContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { studentCoins, tutorCoins, role, setRole } = useCoins?.() || { studentCoins: 0, tutorCoins: 0, role: "student", setRole: () => {} };
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions] = useState([
    "Mathematics", "Physics", "Chemistry", "English", "Biology", "History",
    "Python Programming", "C++ Programming", "Guitar", "Piano",
    "Alice Tan", "Benjamin Lee", "Frank Chen", "Grace Kim"
  ]);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth-user");
      if (raw) setAuthUser(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth-user");
      setAuthUser(raw ? JSON.parse(raw) : null);
    } catch {}
  }, [location]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth-user") {
        try {
          setAuthUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch { setAuthUser(null); }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-user");
    setAuthUser(null);
    setRole("student");
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(query.trim())}#tutors`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/dashboard?q=${encodeURIComponent(suggestion)}#tutors`);
    setShowSuggestions(false);
  };

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">NaiNaiLong</Link>
      </div>

      <div className="search-container" ref={searchRef}>
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search subject or tutor..." 
            value={query} 
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(query.length > 0)}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="search-suggestions">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <div 
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="nav-buttons">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
        {authUser ? (
           <span className="nav-link" style={{ pointerEvents: "none", fontWeight: 600 }}>
            {role === "student" ? `Coins: ${studentCoins}` : `Coins: ${tutorCoins}`}
          </span>
        ): null}
       
        {authUser ? (
          <div className="nav-profile profile-menu" ref={menuRef}>
            <button className="profile-trigger" onClick={() => setIsMenuOpen((v) => !v)} aria-haspopup="menu" aria-expanded={isMenuOpen}>
              <div className="avatar-pill" title={authUser.fullName || authUser.email}>
                {(authUser.fullName || authUser.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="profile-meta">
                <div className="profile-name">{authUser.fullName || authUser.email}</div>
                <div className="profile-role">{authUser.role ? authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1) : "User"}</div>
              </div>
            </button>
            {isMenuOpen && (
              <div className="menu-dropdown" role="menu">
                <Link to="/profile" className="menu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link to="/settings" className="menu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                <Link to="/rewards" className="menu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>Rewards</Link>
                <Link to="/redeemed" className="menu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>My Redeemed Items</Link>
                {role === "tutor" && (
                  <Link to="/tutor-assignments" className="menu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>Manage Assignments</Link>
                )}
                <div className="menu-sep" />
                <button className="menu-item danger" role="menuitem" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
