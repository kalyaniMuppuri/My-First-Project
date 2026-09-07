import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./logo.png";

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

      const response = await axios.get("http://localhost:3001/users"); 
      const users = response.data;

      const matchedUser = users.find(
        (user) => 
          user.username === trimmedUsername && 
          user.email === trimmedEmail && 
          user.password === password
      );

      if (matchedUser) {
        localStorage.setItem("currentUser", JSON.stringify(matchedUser));
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError("Invalid credentials. Please check your details or register.");
      }
    } catch (err) {
      setError("Failed to connect to the database. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };
    
 return (
    <div className="Twoside">
      <div className="leftside">
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
              type="text" 
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
          <img src={logo} alt="ALGO FOODS Logo" className="side-logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;