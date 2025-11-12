import React, { useState, useEffect } from "react";
import AdminNavbar from "../../AdminNavbar";
import "../../AdminNavbar.css";
import "../DirectBookings/DirectBooking.css";
import "../CreateEvent/CreateEvents.css";

const EmployeeOnboarding = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Role: "leader",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}get-employees`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok && data.isSuccess) setEmployees(data.employees);
    } catch (err) {
      console.error("Fetch employees error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}onboard-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.isSuccess) {
        setMessage("🎉 Employee onboarded successfully! Email sent.");
        setFormData({ Username: "", Email: "", Role: "leader" });
        fetchEmployees();
      } else {
        setMessage(data.message || "Failed to onboard employee.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminNavbar>
     
        <div className="container">
          <div className="title-header">
            EMPLOYEE ONBOARDING
            <div className="booking-header"></div>
          </div>

          {/* Onboarding Form */}
          <div className="content">
            <div className="user-details">
              <div className="input-box">
                <span className="details">Username</span>
                <input
                  type="text"
                  value={formData.Username}
                  onChange={(e) =>
                    setFormData({ ...formData, Username: e.target.value })
                  }
                  required
                />
              </div>

              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) =>
                    setFormData({ ...formData, Email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="input-box">
                <span className="details">Role</span>
                <select
                  value={formData.Role}
                  onChange={(e) =>
                    setFormData({ ...formData, Role: e.target.value })
                  }
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="leader">Leader</option>
                </select>
              </div>

             

              {message && (
                <p style={{ marginTop: "15px", color: "#333" }}>{message}</p>
              )}
            </div>
          </div>
           <div className="button">
                <input
                  type="submit"
                  value={loading ? "Sending..." : "Onboard Employee"}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </div>
        </div>
     
      {/* Active Employees List */}
      {/* Active Employees List */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", }} >
        <div className="container">
          <div className="title-header">
            Active Employees
            <div className="booking-header"></div>
          </div>
          </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", }} >
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}> Username </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}> Email </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}> Role </th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (employees.map((emp) => (
              <tr key={emp._id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}> {emp.Username} </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}> {emp.Email} </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}> {emp.Role} </td>
              </tr>))) :
              (<tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd", }} > No active employees found. </td>
              </tr>)}
          </tbody>
        </table>
      </div>

    </AdminNavbar>
  );
};

export default EmployeeOnboarding;