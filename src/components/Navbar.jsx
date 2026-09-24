import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCartCount } from '../services/cartService';
import API_BASE from '../config/api';
import '../styles/navbar.css';
import '../styles/searchSuggestions.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [localQuery, setLocalQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const searchRef = useRef(null);

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', updateCount);
    updateCount();
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  useEffect(() => {
    fetch(API_BASE.FOODS)
      .then(res => res.json())
      .then(data => setFoods(Array.isArray(data) ? data : []))
      .catch(() => setFoods([]));
  }, []);

  useEffect(() => {
    if (location.pathname === "/menu") {
      const params = new URLSearchParams(location.search);
      setLocalQuery(params.get("q") || "");
    } else {
      setLocalQuery("");
      setShowSuggestions(false);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = localQuery.trim().toLowerCase();
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }
    const matched = foods.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      f.category.toLowerCase().includes(query)
    ).slice(0, 8);
    setSuggestions(matched);
  }, [localQuery, foods]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (localQuery.trim()) {
      navigate(`/menu?q=${encodeURIComponent(localQuery.trim())}`);
    } else {
      navigate("/menu");
    }
    setMenuOpen(false);
  };

  const handleSuggestionClick = (food) => {
    setShowSuggestions(false);
    setLocalQuery(food.name);
    navigate(`/food/${food.id}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <nav className="floating-navbar">
        <Link to="/home" className="nav-logo"><b>ALGO FOODS</b></Link>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/home" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/menu" className="nav-link" onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>Orders</Link>
        </div>

        <div className={`search-bar-wrapper ${menuOpen ? "open" : ""}`} ref={searchRef}>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search food, category..."
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="search-input"
            />
          </form>

          {showSuggestions && localQuery.trim() && (
            suggestions.length > 0 ? (
              <ul className="search-suggestions">
                {suggestions.map(food => (
                  <li
                    key={food.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(food)}
                  >
                    <img src={food.image} alt={food.name} className="suggestion-item-img" />
                    <div className="suggestion-item-text">
                      <span className="suggestion-item-name">{food.name}</span>
                      <span className="suggestion-item-desc">{food.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="search-suggestions">
                <li className="suggestion-item suggestion-no-results">
                  No foods found matching "{localQuery}"
                </li>
              </ul>
            )
          )}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="nav-cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-badge">{cartCount}</span>
          </Link>

          <Link to="/profile" className="nav-profile">
            <div className="profile-avatar">
              {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </Link>

          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
