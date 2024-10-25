import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import "../../AdminNavbar.css";
import '../AdminDashboard/AdminDashboard.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from "react-router-dom";
import logo from '../../Images/logo.png';
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
  const handleConfirmBooking = async (bookingId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }
  
    try {
      // Send a request to confirm the booking
      const response = await fetch(`${apiUrl}confirm-booking/${bookingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
  
      if (response.ok) {
        // Booking confirmed successfully
        setEvents((prevEvents) => {
          // Remove the confirmed booking from the current state
          const updatedEvents = new Map(prevEvents);
          for (let [key, bookings] of updatedEvents) {
            updatedEvents.set(key, bookings.filter((booking) => booking._id !== bookingId));
          }
          return updatedEvents;
        });
  
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
    return Array.from(eventMap.entries()).map(([key, bookings]) => (
      <div key={key} className="table-container">
        <div className="container-table-header">
          <div className="table-caption">{key}</div>
          <button onClick={() => handleDownloadPDF(key)} className="download-button">Download PDF</button>
        </div>
        <table id={`table-${key}`} className="event-table">
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
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
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
                  <button onClick={() => handleConfirmBooking(booking._id)} className="confirm-button">Confirm</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    ));
  };

  const handleDownloadPDF = (key) => {
    const tableElement = document.getElementById(`table-${key}`);
    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4'); // Portrait orientation

        const imgWidth = 595 - 40; // Full width of A4 in points minus margin
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 40; // Initial position

        // Split trek name and batch for display
        const [eventName, batch] = key.split(' : ');

        // Add logo at the top center
        const logoWidth = 75; // Width of the logo in points
        const logoHeight = logoWidth; // Maintain aspect ratio

        // Centering the logo
        const xOffset = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
        pdf.addImage(logo, 'PNG', xOffset, position, logoWidth, logoHeight); // Add logo
        position += logoHeight + 20; // Move position down after the logo

        // Add trek name and batch below the logo
        pdf.setFontSize(14);
        pdf.text(eventName, 20, position);
        pdf.text(`Batch: ${batch}`, 20, position + 20);
        position += 40; // Move position down after the title

        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight); // Add image with left margin
        heightLeft -= (position + imgHeight); // Update height left after adding the image

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 40; // Maintain top margin
          pdf.addPage();
          // Centering the logo on new pages
          pdf.addImage(logo, 'PNG', xOffset, 20, logoWidth, logoHeight);
          position = 40 + logoHeight; // Reset position after adding the logo
          pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight); // Add image with left margin
          heightLeft -= pageHeight;
        }

        pdf.save(`${key.replace(/ +/g, '_')}.pdf`);
      });
    }
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
              {tables.length > 0 ? tables : <p>No bookings available.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectBookingConfirmationPannel;
