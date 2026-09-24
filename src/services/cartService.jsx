export const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");

export const addToCart = (item) => {
  const cart = getCart();
  
  // Check stock availability
  if (item.stock !== undefined && item.stock <= 0) {
    throw new Error(`${item.name} is out of stock`);
  }
  
  const exist = cart.find(c => c.id === item.id);
  const currentQtyInCart = exist ? exist.quantity : 0;
  
  // Check if adding would exceed stock
  if (item.stock !== undefined && currentQtyInCart + 1 > item.stock) {
    throw new Error(`Only ${item.stock - currentQtyInCart} ${item.name}(s) left in stock`);
  }
  
  if (exist) {
    exist.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const updateQuantity = (id, qty) => {
  if (qty < 1) return;
  let cart = getCart();
  const item = cart.find(c => c.id === id);
  
  // Check stock availability if item has stock property
  if (item && item.stock !== undefined && qty > item.stock) {
    throw new Error(`Only ${item.stock} ${item.name}(s) available in stock`);
  }
  
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
