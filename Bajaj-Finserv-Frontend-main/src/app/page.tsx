"use client";

import { useState } from "react";

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const requestBody = {
        full_name: fullName,
        dob: dob,
      };

      const res = await fetch(
        "https://bajaj-finserv-backend-t0kn.onrender.com/bfhl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await res.json();
      setResponse(result);
      setError("");
    } catch {
      setError("Invalid JSON input");
      setResponse(null);
    }
  };

  const handleGetRequest = async () => {
    try {
      const res = await fetch(
        "https://bajaj-finserv-backend-t0kn.onrender.com/bfhl",
        {
          method: "GET",
        }
      );

      const result = await res.json();
      setResponse(result);
      setError("");
    } catch {
      setError("Failed to fetch data");
      setResponse(null);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>BFHL Challenge</h1>

      <input
        type="text"
        placeholder="Enter full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="text"
        placeholder="Enter DOB (ddmmyyyy)"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
        }}
      />

      <button
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          width: "100%",
          marginBottom: "10px",
        }}
        onClick={handleSubmit}
      >
        Submit (POST)
      </button>

      <button
        style={{
          padding: "10px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          width: "100%",
        }}
        onClick={handleGetRequest}
      >
        Fetch Data (GET)
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
