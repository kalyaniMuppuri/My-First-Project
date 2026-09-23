import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart } from "../services/cartService";
import API_BASE from "../config/api";
import "../styles/filters.css";
import "../styles/foodCard.css";
import "../styles/skeleton.css";
import "../styles/menu.css";

const foodTypes = ["All", "Veg", "Non-Veg"];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹100", min: 0, max: 100 },
  { label: "₹100–₹200", min: 100, max: 200 },
  { label: "₹200–₹500", min: 200, max: 500 },
  { label: "Above ₹500", min: 500, max: Infinity },
];
const ratingFilters = [
  { label: "All", min: 0 },
  { label: "4+ Stars", min: 4 },
  { label: "3+ Stars", min: 3 },
];

function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [selectedRating, setSelectedRating] = useState(ratingFilters[0]);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_BASE.FOODS)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch food data");
        return res.json();
      })
      .then((data) => setFoods(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredFoods = foods.filter((food) => {
    const matchesType = selectedType === "All" || food.type === selectedType;
    const matchesPrice = food.price >= selectedPrice.min && food.price <= selectedPrice.max;
    const matchesRating = food.rating >= selectedRating.min;
    return matchesType && matchesPrice && matchesRating;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating)
          ? <span key={i} className="star filled">&#9733;</span>
          : <span key={i} className="star empty">&#9734;</span>
      );
    }
    return stars;
  };

  const handleAddToCart = (e, food) => {
    e.stopPropagation();
    addToCart(food);
  };

  const clearFilters = () => {
    setSelectedType("All");
    setSelectedPrice(priceRanges[0]);
    setSelectedRating(ratingFilters[0]);
  };

  return (
    <>
      <div className="home-container">
        <Navbar />

        <div className="menu-page">
          <div className="filter-section">
            <div className="filter-row">
              <h2 className="section-title" style={{ margin: 0 }}>Filters</h2>
              <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
              </button>
            </div>

            {showFilters && (
              <div className="filters-panel">
                <div className="filter-group">
                  <label className="filter-label">Food Type</label>
                  <div className="filter-options">
                    {foodTypes.map((type) => (
                      <button
                        key={type}
                        className={`filter-btn ${selectedType === type ? "active" : ""}`}
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Price Range</label>
                  <div className="filter-options">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        className={`filter-btn ${selectedPrice.label === range.label ? "active" : ""}`}
                        onClick={() => setSelectedPrice(range)}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Rating</label>
                  <div className="filter-options">
                    {ratingFilters.map((rf) => (
                      <button
                        key={rf.label}
                        className={`filter-btn ${selectedRating.label === rf.label ? "active" : ""}`}
                        onClick={() => setSelectedRating(rf)}
                      >
                        {rf.label === "All" ? "All" : `${rf.label} ⭐`}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          <div className="food-list-header">
            <h2 className="section-title">All Items</h2>
            <span className="results-count">{filteredFoods.length} items found</span>
          </div>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          {loading && (
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text medium"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-btn"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="food-list">
              {filteredFoods.length === 0 ? (
                <div className="no-results">
                  <p>No food items match your filters.</p>
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredFoods.map((food) => (
                  <div
                    className="food-card"
                    key={food.id}
                    onClick={() => navigate(`/food/${food.id}`)}
                  >
                    <div className="food-card-image-wrapper">
                      <img src={food.image} alt={food.name} className="food-card-image" />
                      <span className={`food-type-badge ${food.type === "Veg" ? "veg" : "nonveg"}`}>
                        {food.type === "Veg" ? "Veg" : "Non-Veg"}
                      </span>
                      <span className="food-availability-badge">{food.availability}</span>
                    </div>
                    <div className="food-card-body">
                      <h3 className="food-card-title">{food.name}</h3>
                      <p className="food-card-description">{food.description}</p>
                      <span className="food-card-category">{food.category}</span>
                      <div className="food-card-rating">
                        {renderStars(food.rating)}
                        <span className="rating-value">{food.rating}</span>
                      </div>
                      <div className="food-card-footer">
                        <span className="food-card-price">₹{food.price}</span>
                        <button className="food-card-button" onClick={(e) => handleAddToCart(e, food)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Menu;