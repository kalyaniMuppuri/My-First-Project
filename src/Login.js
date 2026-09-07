import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";




function Login() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });
    const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { username, email, password } = data;

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = async(e) => {
    e.preventDefault();
    localStorage.setItem("tempUser",JSON.stringify(data));
     setError("");
    setSuccess("");

    if (username === "" || email === "" || password === "" ) {
      setError("Please fill all the fields");
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
   setSuccess("login details saved, go to Register");
   navigate("/register",{state:data});
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
            
            <button type="submit" className="authbutton">
              Login
            </button>
          </form>
          
          <p>Not a User?<Link to="/register">Register Now</Link>  </p>
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