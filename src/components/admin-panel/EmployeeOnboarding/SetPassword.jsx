import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
      setIsTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok && data.isSuccess) {
        setMessage("Password set successfully! Redirecting to login...");
        setTimeout(() => navigate("admin-login"), 2000);
      } else {
        setMessage(data.message || "Failed to set password.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#f9f9f9",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        width: "350px",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#2b7cff", marginBottom: "20px" }}>
          Set Your Password
        </h2>

        {isTokenValid ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#2b7cff",
                color: "white",
                padding: "10px 15px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                width: "100%"
              }}
            >
              {loading ? "Saving..." : "Set Password"}
            </button>
            {message && (
              <p style={{ marginTop: "15px", color: "#333" }}>{message}</p>
            )}
          </form>
        ) : (
          <p style={{ color: "red" }}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default SetPassword;
