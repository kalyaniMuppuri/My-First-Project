import { useState, useEffect } from "react";
import Navbar from "./Navbar";

function Home() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/foods")
      .then((res) => res.json())
      .then((data) => setFoods(data));
  }, []);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div style={{ marginTop: '140px' }}>
        <h1 className="title">ALGO FOODS</h1>
    
        <div className="food-list">
          {/* FIXED: Mapped over filteredFoods instead of foods */}
          {filteredFoods.map((food) => (
            <div className="food-card" key={food.id}>
              <img src={food.image} alt={food.name} /> 
              <h2>{food.name}</h2>  
              <p className="category">{food.category}</p>  
              <span className="price">₹{food.price}/-</span>
              <button style={{right:"",borderRadius:"10px",width:"60px"}}>Add</button> 
            </div>  
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;