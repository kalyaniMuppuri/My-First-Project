
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';
import { getCartCount } from './cartService';

const Navbar = ({ searchQuery, setSearchQuery, foodItems = [] }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setActiveIndex(-1);
    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const matches = foodItems
      .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 6);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

  const handleSelect = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex].name);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <nav className="floating-navbar">
        <Link to="/" className="nav-logo"><b>ALGO FOODS</b></Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
        </div>

        <div className="search-bar" ref={wrapperRef}>
          <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="search-input"
            autoComplete="off"
          />
          {showSuggestions && (
            <ul className="search-suggestions">
              {suggestions.map((item, index) => (
                <li
                  key={item.id ?? item.name}
                  className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                  onMouseDown={() => handleSelect(item.name)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="nav-cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
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
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar
