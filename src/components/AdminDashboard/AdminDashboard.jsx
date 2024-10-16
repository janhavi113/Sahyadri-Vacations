import React, { useEffect, useState } from 'react';
import AdminNavbar from "../AdminNavbar";
import "../AdminNavbar.css";
import { useNavigate } from 'react-router-dom';
function AdminDashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin-login');
        return;
      }

      const response = await fetch(`${apiUrl}show-all-bookings`, {
        headers: { 'Authorization': token }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        navigate('/admin-login');
      }
    };

    fetchEvents();
  }, [navigate]);

  return (
    <div>
      <AdminNavbar />
      <div className="scheduled-contentbody contentbody">
        <div className="container justify-content-center py-md-5">
          <h1><b>Welcome, Bookings for next batches</b></h1>
          <div className="row justify-content- py-4" >
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard
