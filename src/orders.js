import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        // Most recent order first
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="orders-page">
      <Navbar searchQuery="" setSearchQuery={() => {}} />

      <div className="orders-content">
        <h1>Your Orders</h1>

        {loading && <p>Loading orders...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <p>You haven't placed any orders yet.</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                  <span className={`order-status order-status-${order.status}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items?.map((item) => (
                    <div className="order-item-row" key={item.id}>
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-delivery">
                    <span>
                      Deliver to: {order.delivery?.name}, {order.delivery?.address},{" "}
                      {order.delivery?.city} - {order.delivery?.pincode}
                    </span>
                    <span>Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Mock Online Payment"}</span>
                  </div>
                  <span className="order-total">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
