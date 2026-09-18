// cartService.js
export const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");

export const addToCart = (item) => {
  const cart = getCart();
  const exist = cart.find(c => c.id === item.id);
  if (exist) {
    exist.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const updateQuantity = (id, qty) => {
  if (qty < 1) return; // guard: never let an item's quantity drop below 1
  let cart = getCart();
  cart = cart.map(c => c.id === id ? { ...c, quantity: qty } : c);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const removeFromCart = (id) => {
  let cart = getCart().filter(c => c.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const clearCart = () => {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event('cart-updated'));
};

export const getCartTotal = () => {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getCartCount = () => {
  return getCart().reduce((count, item) => count + item.quantity, 0);
};
