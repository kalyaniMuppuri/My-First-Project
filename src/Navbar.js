import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate('/login');
  };

  return (
    <div className="navbar-container">
      <nav className="floating-navbar">
        <Link to="/" className="nav-logo"><b>ALGO FOODS</b></Link>
        
        {/* Search bar positioned directly after ALGO FOODS */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for food..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input" 
          />
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/Login" className="nav-link">Menu</Link>
          <Link to="/Login" className="nav-link">Orders</Link>
        </div>

        <button onClick={handleLogout} className="nav-logout">
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;