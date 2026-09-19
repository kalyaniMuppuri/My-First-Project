import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart } from "../services/cartService";
import API_BASE from "../config/api";
import foodImage from "../assets/background.jpg";
import "../styles/hero.css";
import "../styles/greeting.css";
import "../styles/carousel.css";
import "../styles/filters.css";
import "../styles/foodCard.css";
import "../styles/skeleton.css";

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

function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [selectedRating, setSelectedRating] = useState(ratingFilters[0]);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const isHovered = useRef(false);

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

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let animationFrameId;

    const scrollStep = () => {
      if (!isHovered.current) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [foods]);

  const getSuggestionCategory = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Breakfast";
    if (hour < 17) return "Lunch";
    return "Dinner";
  };

  const getSuggestionTitle = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning Tiffins & Breakfast 🌅";
    if (hour < 17) return "Afternoon Lunch Suggestions 🍛";
    return "Evening Dinner & Cravings 🌙";
  };

  const suggestedFoods = foods.filter(food => food.category === getSuggestionCategory());

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || food.category === selectedCategory;
    const matchesType = selectedType === "All" || food.type === selectedType;
    const matchesPrice = food.price >= selectedPrice.min && food.price <= selectedPrice.max;
    const matchesRating = food.rating >= selectedRating.min;
    return matchesSearch && matchesCategory && matchesType && matchesPrice && matchesRating;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="star filled">&#9733;</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="star filled">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="star empty">&#9734;</span>);
      }
    }
    return stars;
  };

  const handleAddToCart = (e, food) => {
    e.stopPropagation();
    addToCart(food);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { text: "Late Night Cravings?", emoji: "🌙", tagline: "We've got midnight snacks ready for you!" };
    if (hour < 9) return { text: "Rise & Dine!", emoji: "☀️", tagline: "Start your day with a hearty breakfast." };
    if (hour < 12) return { text: "Good Morning!", emoji: "🌅", tagline: "Fuel up for the day ahead." };
    if (hour < 15) return { text: "Lunchtime!", emoji: "🍛", tagline: "Treat yourself to something delicious." };
    if (hour < 17) return { text: "Afternoon Bites?", emoji: "☕", tagline: "Grab a quick snack or chai break." };
    if (hour < 20) return { text: "Dinner Time!", emoji: "🍽️", tagline: "Order your favorite meal tonight." };
    return { text: "Late Night Cravings?", emoji: "🌙", tagline: "We've got midnight snacks ready for you!" };
  };

  return (
    <>
    <div className="home-container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} foodItems={foods} />

      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${foodImage})`,
        }}
      >
        <h1 className="hero-title">ALGO FOODS</h1>
        <p className="hero-subtitle">Discover the best food & drinks in Hyderabad</p>
      </div>

      <div className="greeting-box">
        <div className="greeting-badge">{getGreeting().emoji}</div>
        <h2 className="greeting-text">{getGreeting().text}</h2>
        <h2 className="craving-text">What are you craving today?</h2>
        <p className="craving-subtext">{getGreeting().tagline}</p>
      </div>

      {suggestedFoods.length > 0 && (
        <div className="carousel-section">
          <h2 className="carousel-title">{getSuggestionTitle()}</h2>
          <div
            className="carousel-container"
            ref={carouselRef}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
          >
            {suggestedFoods.map((food) => (
              <div
                className="carousel-item"
                key={`carousel-${food.id}`}
                onClick={() => navigate(`/food/${food.id}`)}
              >
                <img src={food.image} alt={food.name} className="carousel-image" />
                <div className="carousel-overlay">
                  <div className="carousel-food-info">
                    <span className="carousel-food-name">{food.name}</span>
                    <span className="carousel-food-price">₹{food.price}</span>
                  </div>
                </div>
                <div className="carousel-rating">{food.rating} ★</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="filter-section">
        <div className="filter-row">
          <h2 className="section-title" style={{ margin: 0 }}>Filters</h2>
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
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
                    className={`filter-btn ${selectedType === type ? "active" : ""} ${
                      type === "Veg" ? "veg-btn" : type === "Non-Veg" ? "nonveg-btn" : ""
                    }`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type === "Veg" && <span className="type-indicator veg">&#9679;</span>}
                    {type === "Non-Veg" && <span className="type-indicator nonveg">&#9679;</span>}
                    {type === "All" ? "All" : type}
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

            <button
              className="clear-filters-btn"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedType("All");
                setSelectedPrice(priceRanges[0]);
                setSelectedRating(ratingFilters[0]);
                setSearchQuery("");
              }}
            >
              Clear All Filters
            </button>
        </div>
      )}
      </div>

      <div className="food-list-header">
        <h2 className="section-title">
          {selectedCategory === "All" ? "All Items" : selectedCategory}
        </h2>
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
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedType("All");
                  setSelectedPrice(priceRanges[0]);
                  setSelectedRating(ratingFilters[0]);
                  setSearchQuery("");
                }}
              >
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
                    <button
                      className="food-card-button"
                      onClick={(e) => handleAddToCart(e, food)}
                    >
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
    <Footer />
    </>
  );
}

export default Home;
