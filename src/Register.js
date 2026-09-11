import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./AuthServices";
import logo from "./logo.png"; 


function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

    useEffect(()=>{
      document.body.style.overflow="hidden";
      return()=>{
          document.body.style.overflow="auto";
      }
    },[]);

  const { username, email, password, confirmPassword } = data;

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

   
    setError("");
    setSuccess("");

    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      setError("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and Confirm Password should match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email");
      return;
    }

   try{
    const newUser=await registerUser({username,email,password});
    localStorage.setItem("currentUser",JSON.stringify(newUser));
    setSuccess("Registration successful");
    navigate("/home")
   }catch(err){
    setError(err.message || "Registration failed")
   }
  };
  return (
    <div className="Twoside">
           <div className="leftside">
               <img src={logo} alt="logo" className="app-logo"/>
        <div className="SubmissionForm">
          <form onSubmit={submitHandler} className="form-column">
            <input 
              type="text" 
              placeholder="Username" 
              name="username" 
              value={username} 
              onChange={changeHandler}
            />
            
            <input 
              type="email" 
              placeholder="Email" 
              name="email" 
              value={email} 
              onChange={changeHandler}
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              name="password" 
              value={password} 
              onChange={changeHandler}
            />
            
            <input 
              type="password" 
              placeholder="Confirm Password" 
              name="confirmPassword" 
              value={confirmPassword} 
              onChange={changeHandler}
            />
            
            <button type="submit" className="authbutton">
              Register
            </button>
          </form>
          
          <p>Already a User?<Link to="/">Login Now</Link></p>
          
          {error && <p style={{ color: "red", fontSize: "16px" }}>{error}</p>}
          {success && <p style={{ color: "darkgreen", fontSize: "16px" }}>{success}</p>}
        </div>
      </div>

      <div className="rightside">
        <div className="logo-container">
          <img src={"/Images/food-image.jpg"} alt="ALGO FOODS Logo" className="side-logo" />
           <p className="brand-quote">
            "Let's work magic in the kitchen and bring good food to your table."
          </p>
          </div>
          </div>
    </div>
  );
}

export default Register;