import Login from "./Login";
import Register from './Register';
import Home from "./Home";
import Cart from "./Cart";
import './App.css';
import {Routes,Route} from "react-router-dom";
import Checkout from "./Checkout";


function App() {
  return(
    
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
       <Route path="/home" element={<Home/>}/>
       <Route path="/cart" element={<Cart/>}/>
       <Route path="/checkout" element={<Checkout/>}/>
      </Routes>
  )
     
}

export default App;
