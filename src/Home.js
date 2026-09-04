import { useState,useEffect } from "react";
function Home(){
    const[foods,setFoods]=useState([]);
    
      useEffect(()=>{
        fetch("http://localhost:5000/foods")
        .then(res=>res.json())
        .then(data=>setFoods(data))
      },[]);
    
      return (
        <div className="container">
          <h1 className="title">ALGO FOODS</h1>
    
          <div className="food-list">
            {foods.map((food)=>(
              <div className="food-card" key={food.id}>
    
              <img src={food.image}/> 
              <h2>{food.name}</h2>  
              <p>{food.category}</p>  
              <span>{food.price}/-</span> 
              </div>  
              ))}
          </div>
          </div>
          )
}
export default Home;