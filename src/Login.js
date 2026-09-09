import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./AuthServices";
import logo from "./logo.png"; 
import { useEffect } from "react";

function Login() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    document.body.style.overflow="hidden";
    return()=>{
        document.body.style.overflow="auto";
    }
  },[]);
  
  const { username, email, password } = data;

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password) {
      setError("Please fill all the fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      await loginUser(trimmedEmail, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to connect to the database. Make sure your server is running.");
    } finally {
      setLoading(false);
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
            
            <button type="submit" className="authbutton" disabled={loading}>
              {loading ? "Checking..." : "Login"}
            </button>
          </form>
          
          <p>Not a User? <Link to="/register">Register Now</Link></p>
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

export default Login;