import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png"

function Login() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
  const navigate = useNavigate();
  const { username, email, password } = data;

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/Home");
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
          
          <p>Don't have an account? <Link to="/register">Register</Link></p>
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