import React, { useState } from "react";
import api from "../api"; // Import our new utility config

export default function EmployeeDashboard() {
  const [lwd, setLwd] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitResignation = async (e) => {
    e.preventDefault();
    try {
      // The interceptor in api.js injects your Token header automatically!
      const res = await api.post("/user/resign", { lwd });
      setMessage(res.data.message || "Submitted Successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Submission Failed");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h3>Employee Resignation Desk</h3>
      <form onSubmit={handleSubmitResignation} style={{ padding: "1rem", border: "1px solid #ccc" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Select Your Last Working Day (LWD): </label>
          <input type="date" value={lwd} onChange={(e) => setLwd(e.target.value)} required />
        </div>
        <button type="submit" style={{ background: "blue", color: "white", padding: "0.5rem 1rem" }}>Submit Resignation</button>
      </form>
      {message && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}