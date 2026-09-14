import Login from "./Login";
import Register from './Register';
import Home from "./Home";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Orders from "./orders";
import './App.css';
import {Routes,Route} from "react-router-dom";


function App() {
  return(
    
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
       <Route path="/home" element={<Home/>}/>
       <Route path="/cart" element={<Cart/>}/>
       <Route path="/checkout" element={<Checkout/>}/>
       <Route path="/orders" element={<Orders/>}/>
      </Routes>
  )
     
}

export default App;

/*users.json in port 3000
orders.json in port 3001
foods.json in port 3002*/
