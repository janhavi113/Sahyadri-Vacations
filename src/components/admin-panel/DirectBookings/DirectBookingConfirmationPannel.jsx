import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import "../../AdminNavbar.css";
import '../AdminDashboard/AdminDashboard.css';
import { useNavigate } from "react-router-dom";
function DirectBookingConfirmationPannel() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [events, setEvents] = useState([]);
  const [tables, setTables] = useState([]);
  const [isSuccess, setSuccess] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      const response = await fetch(`${apiUrl}show-all-direct-bookings`, {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('data--bookings--'+JSON.stringify(data));
        // Create the map
        if (data.isSuccess) {
          setSuccess(true);
          const resultMap = createEventMap(data.bookings);

          // Output the result
          console.log("resultMap--");
          setEvents(resultMap);
          const tables = generateTablesFromMap(resultMap);
          setTables(tables);
        }
      } else {
        navigate("/admin-login");
      }
    };

    fetchEvents();
  }, [navigate]);
  function createEventMap(bookings) {
    const eventMap = new Map();

    bookings.forEach((booking) => {
      const eventKey = `${booking.eventName} : ${booking.batch || ""}`;

      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, []);
      }

      eventMap.get(eventKey).push(booking);
    });
    console.log("eventMap--", eventMap);
    return eventMap;
  }
  const handleConfirmBooking = async (booking) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      // Send a request to confirm the booking
      const response = await fetch(`${apiUrl}confirm-booking/${booking._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        let bookingId = booking._id;
        // Booking confirmed successfully
        await setEvents((prevEvents) => {
          // Remove the confirmed booking from the current state
          const updatedEvents = new Map(prevEvents);
          for (let [key, bookings] of updatedEvents) {
            updatedEvents.set(key, bookings.filter((booking) => booking._id !== bookingId));
          }
          return updatedEvents;
        });
        console.log('events--', events);

        // Update the state to remove the row from the UI
        // Update the state to remove the confirmed booking from the UI
        setTables((prevTables) =>
          prevTables.map((table) => {
            // Check if this is the right table
            if (table.key === `${booking.eventName} : ${booking.batch || ""}`) {
              return {
                ...table,
                bookings: table.bookings.filter((b) => b._id !== booking._id), // Remove the booking from the table
              };
            }
            return table; // Return other tables unchanged
          })
        );

        alert("Booking confirmed successfully!");
      } else {
        alert("Failed to confirm the booking.");
      }
    } catch (error) {
      console.error("Error confirming the booking:", error);
      alert("An error occurred while confirming the booking.");
    }
  };

  const generateTablesFromMap = (eventMap) => {
    return Array.from(eventMap.entries()).map(([key, bookings]) => ({
      key, // Use this key to identify the table
      bookings, // Pass the bookings array for later use
    }));
  };

  return (
    <div>
      <AdminNavbar />
      <div className="scheduled-contentbody contentbody">
        <div className="container justify-content-center py-md-5">
          <div>
            <b className="home-dashboard">Welcome, Bookings for next batches..</b>
          </div>
          <div className="row justify-content- py-4">
            <div>
              {isSuccess && tables.length > 0 ? (
                tables.map((table) => (
                  <div key={table.key} className="table-container">
                    <div className="container-table-header">
                      <div className="table-caption">{table.key}</div>
                    </div>
                    <table id={`table-${table.key}`} className="event-table">
                      <thead>
                        <tr>
                          <th>Booking ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile Number</th>
                          <th>Number of People</th>
                          <th>Amount Paid</th>
                          <th>Pickup Location</th>
                          <th>Status</th>
                          <th>Booking Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.name}</td>
                            <td>{booking.email}</td>
                            <td>{booking.mobileNumber}</td>
                            <td>{booking.numberOfPeoples}</td>
                            <td>{booking.amountPaid}</td>
                            <td>{booking.pickupLocation}</td>
                            <td>{booking.status}</td>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td>
                              <button onClick={() => handleConfirmBooking(booking)} className="confirm-button">Confirm</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <p>No direct bookings available.</p>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectBookingConfirmationPannel;
