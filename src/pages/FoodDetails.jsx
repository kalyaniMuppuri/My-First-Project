import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addToCart, getCart, updateQuantity } from "../services/cartService";
import API_BASE from "../config/api";
import "../styles/foodDetails.css";

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(API_BASE.FOODS)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch food data");
        return res.json();
      })
      .then((data) => {
        const found = data.find((f) => String(f.id) === String(id));
        if (!found) throw new Error("Food item not found");
        setFood(found);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!food) return;
    const cart = getCart();
    const item = cart.find((c) => c.id === food.id);
    if (item) setQty(item.quantity);
  }, [food]);

  const handleAddToCart = () => {
    if (!food) return;
    if (food.stock !== undefined && food.stock === 0) return;
    try {
      const cart = getCart();
      const existing = cart.find((c) => c.id === food.id);
      if (existing) {
        updateQuantity(food.id, qty);
      } else {
        for (let i = 0; i < qty; i++) addToCart(food);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {}
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= Math.round(rating) ? "filled" : "empty"}`}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="fd-page">
        <Navbar />
        <div className="fd-content">
          <div className="fd-loading">
            <div className="fd-spinner" />
            <p>Loading food details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="fd-page">
        <Navbar />
        <div className="fd-content">
          <div className="fd-error">
            <span className="fd-error-icon">!</span>
            <p>{error || "Food item not found"}</p>
            <button onClick={() => navigate("/menu")}>Back to Menu</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="fd-page">
      <Navbar />
      <div className="fd-content">
        <button className="fd-back" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <div className="fd-layout">
          <div className="fd-image-section">
            <img src={food.image} alt={food.name} className="fd-image" loading="lazy" />
            <span className={`fd-type-badge ${food.type === "Veg" ? "veg" : "nonveg"}`}>
              {food.type === "Veg" ? "Veg" : "Non-Veg"}
            </span>
          </div>

          <div className="fd-info-section">
            <span className="fd-category">{food.category}</span>
            <h1 className="fd-name">{food.name}</h1>
            <p className="fd-description">{food.description}</p>

            <div className="fd-rating">
              {renderStars(food.rating)}
              <span className="fd-rating-value">{food.rating}</span>
            </div>

            <div className="fd-meta">
              <div className="fd-meta-item">
                <span className="fd-meta-label">Price</span>
                <span className="fd-meta-value fd-price">₹{food.price}</span>
              </div>
              <div className="fd-meta-item">
                <span className="fd-meta-label">Availability</span>
                <span className={`fd-meta-value ${food.availability === "In Stock" ? "fd-in-stock" : "fd-out-stock"}`}>
                  {food.availability}
                </span>
              </div>
              {food.stock !== undefined && (
                <div className="fd-meta-item">
                  <span className="fd-meta-label">Stock</span>
                  <span className={`fd-meta-value ${food.stock === 0 ? "fd-out-stock" : "fd-in-stock"}`}>
                    {food.stock === 0 ? "Out of Stock" : `${food.stock} left in stock`}
                  </span>
                </div>
              )}
              {food.preparationTime && (
                <div className="fd-meta-item">
                  <span className="fd-meta-label">Preparation</span>
                  <span className="fd-meta-value">{food.preparationTime}</span>
                </div>
              )}
            </div>

            {food.ingredients && food.ingredients.length > 0 && (
              <div className="fd-ingredients">
                <h3>Ingredients</h3>
                <div className="fd-ingredients-list">
                  {food.ingredients.map((ing, i) => (
                    <span key={i} className="fd-ingredient-tag">{ing}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="fd-actions">
              <div className="fd-qty-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1 || (food.stock !== undefined && food.stock === 0)}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)} disabled={food.stock !== undefined && qty >= food.stock}>+</button>
              </div>
              <button 
                className="fd-add-btn" 
                onClick={handleAddToCart} 
                disabled={food.availability !== "In Stock" || (food.stock !== undefined && food.stock === 0)}
              >
                {added ? "Added to Cart!" : (food.stock !== undefined && food.stock === 0 ? "Out of Stock" : `Add to Cart — ₹${food.price * qty}`)}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FoodDetails;
