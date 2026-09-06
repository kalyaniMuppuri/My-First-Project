import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    navigate('/login');
  };

  return (
    <div className="navbar-container">
      <nav className="floating-navbar">
        <Link to="/" className="nav-logo"><b>ALGO FOODS</b></Link>
        
        <div className="nav-links">
            <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for food..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input" 
            />
          </div>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          
          
          <Link to="/orders" className="nav-link">Orders</Link>
        </div>

        <button onClick={handleLogout} className="nav-logout">
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;