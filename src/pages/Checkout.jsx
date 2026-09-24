import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCart, clearCart } from "../services/cartService";
import API_BASE from "../config/api";
import "../styles/checkout.css";

const TAX_RATE = 0.05;
const DELIVERY_FEE = 40;

function Checkout() {
  const [cart] = useState(getCart());
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill in all delivery details.");
      return;
    }

    const order = {
      userId: currentUser?.id || null,
      items: cart,
      subtotal,
      tax,
      deliveryFee,
      total,
      delivery: { ...form },
      paymentMethod,
      status: "placed",
      createdAt: new Date().toISOString(),
    };

    setPlacing(true);
    try {
      const res = await fetch(API_BASE.ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error("Failed to save order");

      clearCart();
      window.dispatchEvent(new Event("order-placed"));
      setPlaced(true);
    } catch (err) {
      alert("Couldn't place your order — is the mock server running? " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0 && !placed) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-content">
          <div className="checkout-empty">
            <p>Your cart is empty — nothing to check out.</p>
            <button onClick={() => navigate("/home")}>Browse Food</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-content">
          <div className="checkout-success">
            <div className="checkout-success-icon">✓</div>
            <h1>Order placed!</h1>
            <p>Thanks, {form.name}. Your order will be delivered to:</p>
            <p className="checkout-success-address">
              {form.address}, {form.city} - {form.pincode}
            </p>
            <p>We'll call you at {form.phone} if we need anything.</p>
            <button onClick={() => navigate("/home")}>Back to Home</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar searchQuery="" setSearchQuery={() => {}} />

      <div className="checkout-content">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            {cart.map((item) => (
              <div className="checkout-summary-row" key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Taxes (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Delivery fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="checkout-summary-total">
              <span>Final Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <h2>Delivery Details</h2>

            <label htmlFor="checkout-name">Full Name</label>
            <input
              id="checkout-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />

            <label htmlFor="checkout-phone">Phone Number</label>
            <input
              id="checkout-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
            />

            <label htmlFor="checkout-address">Address</label>
            <textarea
              id="checkout-address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House no, street, area"
              rows={2}
            />

            <div className="checkout-form-row">
              <div>
                <label htmlFor="checkout-city">City</label>
                <input
                  id="checkout-city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div>
                <label htmlFor="checkout-pincode">Pincode</label>
                <input
                  id="checkout-pincode"
                  name="pincode"
                  type="text"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <h2>Payment Method</h2>
            <div className="checkout-payment-options">
              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="mock_online"
                  checked={paymentMethod === "mock_online"}
                  onChange={() => setPaymentMethod("mock_online")}
                />
                Mock Online Payment
              </label>
            </div>

            <button type="submit" className="checkout-place-order-btn" disabled={placing}>
              {placing ? "Placing order..." : `Place Order — ₹${total}`}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
