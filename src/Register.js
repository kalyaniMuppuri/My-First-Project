import logo from "./logo.png";
import { useState } from "react";
import {Link,useNavigate} from "react-router-dom";
import { Navigate } from "react-router-dom";
function Register(){
const[data,setData]=useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:""
    
})
const[error,setError]=useState("");
const[success,setSuccess]=useState("");
const Navigate=useNavigate();



const{username,email,password,confirmPassword}=data;
const changeHandler=e=>{
    setData({...data,[e.target.name]:e.target.value})
}
const submitHandler=(e)=>{
    e.preventDefault();
    setError("")
    setSuccess("")
  
    

if(
    username===""|| email==="" || password==="" || confirmPassword==="")
        {
           setError("please fill the all fields");
            return;
        }
         if(password!==confirmPassword){
            setError("password and confirmPassword should match");
            return;
        }
        if(password.length<6){
            setError("password must be at least 6 characters");
            return;
        }
        if(!email.includes("@") || !email.includes(".")){
            setError("please enter the valid email");
            return;
        }
        setSuccess("Registration successful");
        Navigate("/Login");
        
    
       
    }
     
        
return(
    <div className="container">
        <img src={logo} alt="ALGO FOODS" className="logo"/>
        <h1>Register</h1>

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

                <input type="password" 
                placeholder="confirmPassword" 
                name="confirmPassword" 
                value={confirmPassword} 
                onChange={changeHandler}/>
                <br></br>
                <br></br>

            <input className="btn" type="Submit" value="Register" onClick={changeHandler}/>

         

        </form>
        <p>Already have an acount?<Link to="/login">Login</Link></p>
         {error && <p style={{color:"red", fontSize:"25px"}}>{error}</p>}
          {success && <p style={{color:"darkgreen", fontSize:"25px"}}>{success}</p>}
    </div>
    
)
}
export default Register;