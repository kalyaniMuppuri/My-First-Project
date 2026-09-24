import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/profile.css";

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: currentUser?.username || "",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...currentUser, ...form };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h1 className="profile-name">{currentUser?.username || "User"}</h1>
          <p className="profile-email">{currentUser?.email || "No email"}</p>

          {saved && <p className="profile-success">Profile updated successfully!</p>}

          <div className="profile-details">
            <div className="profile-field">
              <label>Username</label>
              {editing ? (
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              ) : (
                <span>{currentUser?.username || "N/A"}</span>
              )}
            </div>

            <div className="profile-field">
              <label>Email</label>
              <span className="profile-readonly">{currentUser?.email || "N/A"}</span>
            </div>

            <div className="profile-field">
              <label>User ID</label>
              <span className="profile-id">{currentUser?.id || "N/A"}</span>
            </div>
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="profile-save-btn" onClick={handleSave}>Save Changes</button>
                <button className="profile-cancel-btn" onClick={() => { setEditing(false); setForm({ username: currentUser?.username }); }}>Cancel</button>
              </>
            ) : (
              <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
            )}
            <button className="profile-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="profile-links">
          <button onClick={() => navigate("/orders")}>View My Orders</button>
          <button onClick={() => navigate("/cart")}>View My Cart</button>
          <button onClick={() => navigate("/home")}>Back to Home</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
