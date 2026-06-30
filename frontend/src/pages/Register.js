import React, { useState } from "react";
import api from "../api"; // Centralized API config
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Automatically uses localhost or Render based on your environment
      await api.post("/auth/register", { username, password });
      alert("Registration Successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration Failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h3>Create an Employee Account</h3>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Username / Email: </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5rem" }} />
        </div>
        <button type="submit" style={{ width: "100%", padding: "0.5rem", background: "blue", color: "white", border: "none", cursor: "pointer" }}>Register</button>
      </form>
    </div>
  );
}