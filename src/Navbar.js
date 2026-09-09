import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

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
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for food..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input" 
          />
        </div>

        {/* Grouped Cart and Logout for clean right-side alignment */}
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
            {/* Optional indicator for items in cart */}
            <span className="cart-badge">1</span>
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