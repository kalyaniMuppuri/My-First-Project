import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import foodImage from "./background.jpg";
import { addToCart } from "./cartService";


const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Beverages"];
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
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [selectedRating, setSelectedRating] = useState(ratingFilters[0]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3002/foods")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch food data");
        return res.json();
      })
      .then((data) => setFoods(data))
      .catch((err) => setError(err.message));
  }, []);

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

  // ================= ADD TO CART =================
  const handleAddToCart = (e, food) => {
    e.stopPropagation();
    addToCart(food);
  };
  // ================= GREETING  =================  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };



  return (
    <div className="home-container">
      {/* ================= NAVBAR ================= */}
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

      {/* ================= CONTENT ================= */}
      <div className="greeting-box">
  <h2 className="greeting-text">{getGreeting()}! 👋</h2>
  <h2 className="craving-text">What are you craving today?</h2>
  <p className="craving-subtext">Find your favorite food and enjoy delicious meals.</p>
</div>
           {/* ================= FILTERS ================= */}
        <h2>Filters</h2>

        <div className="filters-bar">
          <div className="filter-group">
            <label htmlFor="category-select">Category</label>
            <select
              id="category-select"
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-select">Food Type</label>
            <select
              id="type-select"
              className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price-select">Price Range</label>
            <select
              id="price-select"
              className="filter-select"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="All">All</option>
              {PRICE_RANGES.slice(1).map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button className="reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {/* ================= FOOD LIST ================= */}
        <h2>Food List</h2>

        {loading ? (
          <p>Loading food items...</p>
        ) : filteredFoods.length === 0 ? (
          <p>No food items found.</p>
        ) : (
          <div className="food-list">
            {filteredFoods.map((food) => (
              <div className="food-card" key={food.id}>
                <img src={food.image} alt={food.name} className="food-card-image" />
                <h2 className="food-card-title">{food.name}</h2>
                <p className="food-card-description">{food.description}</p>
                <p className="food-card-category">
                  Category:{" "}
                  <button onClick={() => setCategory(food.category)}>
                    {food.category}
                  </button>
                </p>
                <p>Type: {food.type}</p>
                <p className="food-card-price">₹{food.price}</p>
                <p>{food.availability}</p>
                <button
                  className="food-card-button"
                  onClick={(e) => handleAddToCart(e, food)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
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
                    {food.type === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${food.name} added to cart!`);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    
  );
}

export default Home;
