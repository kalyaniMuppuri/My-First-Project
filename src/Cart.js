import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "./cartService";

function Cart() {
  const [cart, setCart] = useState(getCart());
  const navigate = useNavigate();

  const refresh = () => setCart(getCart());

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1);
    refresh();
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) return; // use Remove to drop to zero
    updateQuantity(item.id, item.quantity - 1);
    refresh();
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    refresh();
  };

  const handleEmptyCart = () => {
    clearCart();
    refresh();
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const total = getCartTotal();

  return (
    <div className="cart-page">
      {/* Cart page doesn't use search, so pass no-op props */}
      <Navbar searchQuery="" setSearchQuery={() => {}} />

      <div className="cart-content">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button onClick={() => navigate("/checkout")}>Browse Food</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>

                  <div className="cart-item-qty">
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-total">
                    ₹{item.price * item.quantity}
                  </p>

                  <button
                    className="cart-item-remove"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Grand Total: ₹{total}</h2>
              <div className="cart-actions">
                <button className="cart-empty-btn" onClick={handleEmptyCart}>
                  Empty Cart
                </button>
                <button className="cart-checkout-btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
