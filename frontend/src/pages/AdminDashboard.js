import React, { useEffect, useState } from "react";
import api from "../api"; // Centralized API config

export default function AdminDashboard() {
  const [resignations, setResignations] = useState([]);
  const [exitResponses, setExitResponses] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // No need to manually type headers! api.js takes care of it.
      const resignRes = await api.get("/admin/resignations");
      setResignations(resignRes.data.data || []);

      const feedbackRes = await api.get("/admin/exit_responses");
      setExitResponses(feedbackRes.data.data || []);
    } catch (err) {
      console.error("Error retrieving dashboard admin data", err);
    }
  };

  const handleConcludeResignation = async (id, approve, currentLwd) => {
    try {
      await api.put("/admin/conclude_resignation", { 
        resignationId: id, 
        approved: approve, 
        lwd: currentLwd 
      });
      alert("Resignation processing state updated!");
      fetchAdminData(); // Refresh records on screen
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update review status");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>HR Admin Administration Center</h2>
      <hr />
      
      <h3>Employee Resignations Pipeline</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left", marginBottom: "3rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>Resignation ID</th>
            <th>Requested Last Working Day (LWD)</th>
            <th>Status</th>
            <th>Review Actions</th>
          </tr>
        </thead>
        <tbody>
          {resignations.map((r) => (
            <tr key={r._id}>
              <td>{r._id}</td>
              <td>{r.lwd}</td>
              <td style={{ fontWeight: "bold", color: r.status === "approved" ? "green" : r.status === "rejected" ? "red" : "orange" }}>
                {r.status.toUpperCase()}
              </td>
              <td>
                {r.status === "pending" && (
                  <>
                    <button onClick={() => handleConcludeResignation(r._id, true, r.lwd)} style={{ background: "green", color: "white", marginRight: "0.5rem", border: "none", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Approve</button>
                    <button onClick={() => handleConcludeResignation(r._id, false, r.lwd)} style={{ background: "red", color: "white", border: "none", padding: "0.3rem 0.6rem", cursor: "pointer" }}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Completed Exit Interview Questionnaire Feedback</h3>
      {exitResponses.length === 0 ? <p>No questionnaire interviews stored yet.</p> : (
        exitResponses.map((item) => (
          <div key={item._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", background: "#f9f9f9", borderRadius: "4px" }}>
            <h4>Submission ID: {item._id}</h4>
            {item.responses.map((ans, index) => (
              <p key={index}>
                <strong>Q: {ans.questionText}</strong> <br />
                <span>A: {ans.response}</span>
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}