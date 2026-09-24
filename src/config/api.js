const API_BASE = {
  AUTH: process.env.REACT_APP_API_AUTH || 'http://localhost:3001/users',
  FOODS: process.env.REACT_APP_API_FOODS || 'http://localhost:3002/foods',
  CATEGORIES: process.env.REACT_APP_API_CATEGORIES || 'http://localhost:3002/categories',
  ORDERS: process.env.REACT_APP_API_ORDERS || 'http://localhost:3003/orders',
};

export default API_BASE;
