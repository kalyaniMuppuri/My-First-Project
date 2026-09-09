import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import foodimage from "./background.jpg"; 

function Home() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/foods")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch food data");
        }
        return res.json();
      })
      .then((data) => setFoods(data))
      .catch((err) => setError(err.message));
  }, []);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
   
    <div className="home-container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div 
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${foodimage})`
        }}
      >
        <h1 className="hero-title">ALGO FOODS</h1>
        <p className="hero-subtitle">Discover the best food & drinks in Hyderabad</p>
      </div>
  
      <div className="content-section">
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <div className="food-list">
          {filteredFoods.map((food) => (
            <div className="food-card" key={food.id}>
              <img src={food.image} alt={food.name} className="food-card-image" /> 
              <h2 className="food-card-title">{food.name}</h2>  
              <p className="food-card-category">{food.category}</p>  
              <span className="food-card-price">₹{food.price}/-</span>
              <button className="food-card-button">Add to Cart</button> 
            </div>  
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;