
import Login from "./Login";
import Register from './Register';
import Home from "./Home";
import './App.css';
import {Routes,Route} from "react-router-dom";


function App() {
  return(
    
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
       <Route path="/home" element={<Home/>}/>
      </Routes>
  )
     
}

export default App;
