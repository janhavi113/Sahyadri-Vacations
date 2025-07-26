import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './AdminLogin.css';

const AdminLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const {
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
        console.log('data--'+data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate("/dashboard");
      } else {
        setError("myform", {
          message: data.message || "Invalid username or password. Please try again.",
        });
      }
    } catch (error) {
      setError("myform", {
        message: "Something went wrong. Please check your internet connection or try again later.",
      });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                className="login-button"
                type="submit"
                value={isSubmitting ? "Logging in..." : "Login"}
                disabled={isSubmitting}
              />
            </div>
            {errors.myform && <div className="error-message">{errors.myform.message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
