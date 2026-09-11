import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import foodImage from "./background.jpg";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Beverages"];
const TYPES = ["All", "Veg", "Non-Veg"];
const PRICE_RANGES = [
  { label: "All", min: -Infinity, max: Infinity },
  { label: "₹0 - ₹100", value: "0-100", min: 0, max: 100 },
  { label: "₹101 - ₹200", value: "101-200", min: 101, max: 200 },
  { label: "₹201 - ₹300", value: "201-300", min: 201, max: 300 },
  { label: "₹301 - ₹400", value: "301-400", min: 301, max: 400 },
  { label: "₹401 - ₹500", value: "401-500", min: 401, max: 500 },
];

function Home() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH FOOD DATA =================
  useEffect(() => {
    fetch("http://localhost:3002/foods")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch food data");
        return res.json();
      })
      .then((data) => setFoods(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ================= FILTER =================
  const selectedRange =
    PRICE_RANGES.find((r) => r.value === priceRange) || PRICE_RANGES[0];

  const filteredFoods = foods.filter((food) => {
    const searchMatch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = category === "All" || food.category === category;
    const typeMatch = type === "All" || food.type === type;

    const price = Number(food.price);
    const priceMatch = price >= selectedRange.min && price <= selectedRange.max;

    return searchMatch && categoryMatch && typeMatch && priceMatch;
  });

  // ================= RESET FILTERS =================
  const resetFilters = () => {
    setCategory("All");
    setType("All");
    setPriceRange("All");
    setSearchQuery("");
  };

  return (
    <div className="home-container">
      {/* ================= NAVBAR ================= */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ================= HERO ================= */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${foodImage})`,
        }}
      >
        <h1 className="hero-title">ALGO FOODS</h1>
        <p className="hero-subtitle">Discover the best food & drinks</p>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="content-section">
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <h2>What are you craving today?</h2>
        <p>Find your favorite food and enjoy delicious meals.</p>

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
                <button className="food-card-button">Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
