import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { redirect,useNavigate } from "react-router-dom";
import './AdminLogin.css';
const AdminLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const {
    register,
    handleSubmit,
    setError,    
    formState: { errors, isSubmitting },
  } = useForm();
 const navigate = useNavigate();
 const handleLogin = async (e) => {
  e.preventDefault();
  console.log('username---'+username);
  console.log('password---'+password);
  const response = await fetch(`${apiUrl}admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    navigate("/dashboard");      
  } else {
    setError("myform", {message: "Invalid Password and UserName. Please contact Syatem Admin"})
  }
};
 
  
  return (
    <div className='login-body'> 
    {isSubmitting && <div>Loading...</div>}
    <div className="login-container">
      <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
      <div className="input-group">
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
      <div className="input-group">
        <input disabled={isSubmitting} type="submit" value="Login" />
          </div>
        {errors.myform && <div className='red'>{errors.myform.message}</div>}
      </form>
    </div>
    </div>
    </div>
  )
}

export default AdminLogin
