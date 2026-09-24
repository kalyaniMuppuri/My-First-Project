import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart } from "../services/cartService";
import API_BASE from "../config/api";
import foodImage from "../assets/background.webp";
import "../styles/hero.css";
import "../styles/greeting.css";
import "../styles/carousel.css";
import "../styles/filters.css";
import "../styles/foodCard.css";
import "../styles/skeleton.css";
import "../styles/aiBot.css";

const KEYWORD_MAP = {
  spicy: ["spicy", "hot", "masala", "tikka", "65", "manchurian", "kurkure"],
  crispy: ["crispy", "fried", "crunchy", "pakoda", "samosa", "spring roll", "nugget", "fries", "65"],
  sweet: ["sweet", "dessert", "cake", "brownie", "ice cream", "gulab jamun", "rasmalai", "jalebi", "kheer", "halwa", "rasgulla", "shake", "juice"],
  healthy: ["healthy", "salad", "fruit", "dal", "veg", "light", "steamed", "idli", "pongal", "upma"],
  creamy: ["creamy", "butter", "paneer butter", "malai", "milkshake", "coffee", "cappuccino", "oreo"],
  tangy: ["tangy", "lemon", "lime", "raspberry", "chatpata"],
  filling: ["biryani", "meals", "rice", "thali", "full", "heavy", "chicken curry", "mutton"],
  snack: ["snack", "fast", "quick", "bite", "pakoda", "samosa", "vada", "pav"],
  refreshing: ["juice", "shake", "cold", "iced", "lemon", "lime", "soda", "watermelon", "mango"],
  traditional: ["traditional", "south indian", "dosa", "idli", "vada", "pongal", "pesarattu", "dal"],
  protein: ["chicken", "egg", "fish", "mutton", "paneer", "non-veg", "omelette"],
  veg: ["veg", "vegetarian", "paneer", "dal", "mixed vegetable", "chana"],
  nonveg: ["non-veg", "chicken", "mutton", "fish", "egg", "biryani"],
  breakfast: ["breakfast", "morning", "dosa", "idli", "vada", "pongal", "upma", "poori", "pesarattu", "pav bhaji"],
  lunch: ["lunch", "afternoon", "meals", "biryani", "rice", "thali"],
  dinner: ["dinner", "night", "curry", "dal", "paneer", "butter chicken"],
  beverages: ["tea", "coffee", "juice", "shake", "drink", "cold", "hot"],
  chocolate: ["chocolate", "brownie", "cake", "oreo"],
};

function Home() {
  const [foods, setFoods] = useState([]);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSearched, setAiSearched] = useState(false);

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
      .catch(() => {});
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
    if (hour < 12) return "Morning Tiffins & Breakfast";
    if (hour < 17) return "Afternoon Lunch Suggestions";
    return "Evening Dinner & Cravings";
  };

  const suggestedFoods = foods.filter(food => food.category === getSuggestionCategory());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return { text: "Late Night Cravings?", emoji: "\u{1F319}", tagline: "We've got midnight snacks ready for you!" };
    if (hour < 9) return { text: "Rise & Dine!", emoji: "\u2600\uFE0F", tagline: "Start your day with a hearty breakfast." };
    if (hour < 12) return { text: "Good Morning!", emoji: "\u{1F305}", tagline: "Fuel up for the day ahead." };
    if (hour < 15) return { text: "Lunchtime!", emoji: "\u{1F35B}", tagline: "Treat yourself to something delicious." };
    if (hour < 17) return { text: "Afternoon Bites?", emoji: "\u2615", tagline: "Grab a quick snack or chai break." };
    if (hour < 20) return { text: "Dinner Time!", emoji: "\u{1F37D}\uFE0F", tagline: "Order your favorite meal tonight." };
    return { text: "Late Night Cravings?", emoji: "\u{1F319}", tagline: "We've got midnight snacks ready for you!" };
  };

  const analyzeAiQuery = (query) => {
    if (!query.trim() || foods.length === 0) {
      setAiResults([]);
      setAiSearched(false);
      return;
    }
    setAiLoading(true);
    setAiSearched(true);
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const matchedTags = [];
      const matchedKeywords = [];
      for (const [tag, keywords] of Object.entries(KEYWORD_MAP)) {
        for (const kw of keywords) {
          if (lowerQuery.includes(kw)) {
            if (!matchedTags.includes(tag)) matchedTags.push(tag);
            if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw);
          }
        }
      }
      const scored = foods.map((food) => {
        let score = 0;
        const foodText = `${food.name} ${food.description} ${food.category} ${food.type}`.toLowerCase();
        const reasons = [];
        for (const kw of matchedKeywords) {
          if (foodText.includes(kw)) { score += 10; reasons.push(kw); }
        }
        if (matchedTags.includes("spicy") && (food.description.toLowerCase().includes("spicy") || food.description.toLowerCase().includes("masala"))) { score += 5; reasons.push("spicy"); }
        if (matchedTags.includes("crispy") && food.description.toLowerCase().includes("crispy")) { score += 5; reasons.push("crispy"); }
        if (matchedTags.includes("sweet") && (food.category === "Desserts" || food.name.toLowerCase().includes("sweet"))) { score += 8; reasons.push("sweet"); }
        if (matchedTags.includes("healthy") && (food.type === "Veg" || food.description.toLowerCase().includes("healthy"))) { score += 5; reasons.push("healthy"); }
        if (matchedTags.includes("creamy") && (food.description.toLowerCase().includes("creamy") || food.description.toLowerCase().includes("butter"))) { score += 5; reasons.push("creamy"); }
        if (matchedTags.includes("filling") && (food.category === "Lunch" || food.category === "Dinner")) { score += 4; reasons.push("filling"); }
        if (matchedTags.includes("snack") && food.category === "Snacks") { score += 6; reasons.push("snack"); }
        if (matchedTags.includes("refreshing") && food.category === "Beverages") { score += 6; reasons.push("refreshing"); }
        if (matchedTags.includes("traditional") && food.description.toLowerCase().includes("traditional")) { score += 5; reasons.push("traditional"); }
        if (matchedTags.includes("protein") && food.type === "Non-Veg") { score += 5; reasons.push("protein-rich"); }
        if (matchedTags.includes("veg") && food.type === "Veg") { score += 4; reasons.push("vegetarian"); }
        if (matchedTags.includes("nonveg") && food.type === "Non-Veg") { score += 4; reasons.push("non-vegetarian"); }
        if (matchedTags.includes("breakfast") && food.category === "Breakfast") { score += 5; reasons.push("breakfast item"); }
        if (matchedTags.includes("lunch") && food.category === "Lunch") { score += 5; reasons.push("lunch item"); }
        if (matchedTags.includes("dinner") && food.category === "Dinner") { score += 5; reasons.push("dinner item"); }
        if (matchedTags.includes("beverages") && food.category === "Beverages") { score += 6; reasons.push("beverage"); }
        if (matchedTags.includes("chocolate") && food.name.toLowerCase().includes("chocolate")) { score += 5; reasons.push("chocolate"); }
        return { ...food, aiScore: score, reasons: [...new Set(reasons)].slice(0, 3) };
      });
      setAiResults(scored.filter((f) => f.aiScore > 0).sort((a, b) => b.aiScore - a.aiScore).slice(0, 6));
      setAiLoading(false);
    }, 500);
  };

  const handleAiSearch = (e) => {
    e.preventDefault();
    analyzeAiQuery(aiQuery);
  };

  return (
    <>
    <div className="home-container">
      <Navbar />

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
                <img src={food.image} alt={food.name} className="carousel-image" loading="lazy" />
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

      <div className="ai-suggestion-section">
        <div className="ai-suggestion-header">
          <div className="ai-suggestion-icon-wrap">
            <span className="ai-suggestion-icon">🤖</span>
          </div>
          <div>
            <h2 className="ai-suggestion-title">Smart AI Food Suggestion</h2>
            <p className="ai-suggestion-subtitle">Tell us what you're craving and we'll find the perfect dish for you</p>
          </div>
        </div>

        <form className="ai-suggestion-input-wrap" onSubmit={handleAiSearch}>
          <div className="ai-suggestion-input-container">
            <svg className="ai-suggestion-input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="ai-suggestion-input"
              placeholder='Try "I want something spicy and crispy"'
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
            />
            <button type="submit" className="ai-suggestion-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </form>

        <div className="ai-suggestion-examples">
          <span className="ai-example-label">Try:</span>
          {["I want something spicy", "Healthy vegetarian dinner", "Something sweet and creamy", "Quick snack for evening"].map((ex) => (
            <button key={ex} className="ai-example-tag" onClick={() => { setAiQuery(ex); analyzeAiQuery(ex); }}>
              {ex}
            </button>
          ))}
        </div>

        {aiLoading && (
          <div className="ai-results-loading">
            <div className="ai-results-spinner"></div>
            <span>Finding the perfect dishes for you...</span>
          </div>
        )}

        {!aiLoading && aiSearched && aiResults.length === 0 && (
          <div className="ai-results-empty">
            <span className="ai-results-empty-icon">🍽️</span>
            <p>We couldn't find matching dishes. Try different keywords!</p>
          </div>
        )}

        {!aiLoading && aiResults.length > 0 && (
          <div className="ai-results-header">
            <span className="ai-results-count">{aiResults.length} dish{aiResults.length > 1 ? "es" : ""} found for you</span>
          </div>
        )}

        {!aiLoading && aiResults.length > 0 && (
          <div className="ai-results-grid">
            {aiResults.map((food) => (
              <div className="ai-result-card" key={`ai-${food.id}`} onClick={() => navigate(`/food/${food.id}`)}>
                <div className="ai-result-image-wrap">
                  <img src={food.image} alt={food.name} className="ai-result-image" loading="lazy" />
                  <span className={`ai-result-type ${food.type === "Veg" ? "veg" : "nonveg"}`}>
                    {food.type === "Veg" ? "Veg" : "Non-Veg"}
                  </span>
                </div>
                <div className="ai-result-body">
                  <h3 className="ai-result-name">{food.name}</h3>
                  <p className="ai-result-price">₹{food.price}</p>
                  <div className="ai-result-reasons">
                    {food.reasons.map((reason, i) => (
                      <span key={i} className="ai-result-tag">{reason}</span>
                    ))}
                  </div>
                  <p className="ai-result-reason">
                    Recommended because you mentioned "{aiQuery.split(" ").slice(0, 4).join(" ")}..."
                  </p>
                  <button className="ai-result-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(food); }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
    <Footer />
    </>
  );
}

export default Home;
