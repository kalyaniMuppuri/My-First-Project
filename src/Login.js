import logo from "./logo.png";
import { useState} from "react";
import { useNavigate,Link} from "react-router-dom";
function Login(){
const[data,setData]=useState({
    username:"",
    email:"",
    password:""
})
const navigate=useNavigate();
const{username,email,password}=data;
const changeHandler=e=>{
    setData({...data,[e.target.name]:e.target.value})
}
const submitHandler=(e)=>{
    e.preventDefault();
    navigate("/Home")
}
return(
    <div className="container">
        <img src={logo} alt="ALGO FOODS" className="logo"/>
        <h1>Login</h1>

        <form onSubmit={submitHandler}>

            <input type="text" 
            placeholder="username" 
            name="username" 
            value={username} 
            onChange={changeHandler}/>
            <br></br>
            <br></br>

            <input type="text" 
            placeholder="Email" 
            name="email" 
            value={email} 
            onChange={changeHandler}/>
            <br></br>
            <br></br>

            <input type="password" 
            placeholder="password" 
            name="password" 
            value={password} 
            onChange={changeHandler}/>
            <br></br>
            <br></br>

            <input className="btn" type="Submit" value="Login"/>
        </form>
        <p>Don't have an acount?<Link to="/register">Register</Link></p>
        
    </div>
)
}
export default Login;