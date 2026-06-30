import React, { useState } from "react";
import api from "../api"; // Import our new utility config
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Clean and compact: No hardcoded URL string needed anymore!
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      if (res.data.role === "HR" || res.data.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem", border: "1px solid #ccc" }}>
      <h3>XExit Account Login</h3>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Username / Email: </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </div>
        <button type="submit" style={{ width: "100%", padding: "0.5rem", background: "green", color: "white" }}>Login</button>
      </form>
    </div>
  );
}