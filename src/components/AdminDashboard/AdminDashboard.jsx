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

      const response = await fetch(`${apiUrl}show-all-events`, {
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
      <div>
      <h2>Admin Panel</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>{event.name}</li>
        ))}
      </ul>
    </div>

    </div>
  )
}

export default AdminDashboard
