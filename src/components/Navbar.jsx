import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartCount } from '../services/cartService';
import '../styles/navbar.css';
import '../styles/searchSuggestions.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', updateCount);
    updateCount();
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

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

        <div className={`search-bar ${menuOpen ? "open" : ""}`}>
          <input
            type="text"
            placeholder="Search food, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
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
            <span className="cart-badge">{cartCount}</span>
          </Link>

          <div className="nav-profile">
            <div className="profile-avatar">
              {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="profile-name">{currentUser?.username || "User"}</span>
          </div>

          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
