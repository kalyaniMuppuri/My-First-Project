import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>ALGO FOODS</h3>
          <p>
            Discover the best food & drinks in Hyderabad.
            Fresh ingredients, authentic flavors, delivered to your door.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/home">Breakfast</Link></li>
            <li><Link to="/home">Lunch</Link></li>
            <li><Link to="/home">Dinner</Link></li>
            <li><Link to="/home">Snacks</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>Hyderabad, India</li>
            <li>support@algofoods.com</li>
            <li>+91 98765 43210</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Algo Foods. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
