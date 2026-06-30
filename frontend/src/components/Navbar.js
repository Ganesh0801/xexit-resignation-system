import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#333", color: "#fff" }}>
      <h2>XExit Portal</h2>
      <div>
        {token ? (
          <>
            <span style={{ marginRight: "1rem" }}>Role: {role}</span>
            <button onClick={handleLogout} style={{ background: "red", color: "white", border: "none", padding: "0.5rem 1rem", cursor: "pointer" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", marginRight: "1rem" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}