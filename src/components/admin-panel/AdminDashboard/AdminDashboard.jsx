import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import "../../AdminNavbar.css";
import "./AdminDashboard.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from "react-router-dom";
import CollapsibleSection from '../../User-Panel/ShowEventDetails/CollapsibleSection';
import logo from '../../Images/logo.png';
import * as XLSX from 'xlsx';
function AdminDashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [events, setEvents] = useState([]);
  const [tables, setTables] = useState([]);
  const [isSuccess, setSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState('all');
  const navigate = useNavigate();
  useEffect(() => {

    fetchEvents('all');
  }, [navigate]);

  const handleFilter = async (filter) => {

    fetchEvents(filter);
  }
  const fetchEvents = async (filter) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const response = await fetch(`${apiUrl}show-all-bookings/${filter}`, {
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
  const handleDownloadExcel = (key) => {
    const tableElement = document.getElementById(`table-${key}`);
    if (tableElement) {
      // Parse HTML table to a worksheet
      const worksheet = XLSX.utils.table_to_sheet(tableElement);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Split trek name and batch for the file name
      const [eventName, batch] = key.split(' : ');
      const filename = `${eventName.replace(/ +/g, '_')}_${batch.replace(/ +/g, '_')}.xlsx`;

      // Save the workbook
      XLSX.writeFile(workbook, filename);
    }
  };
  const handleCancelPerson = async (bookingId, participantId = null) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    const confirmMsg = participantId
      ? "Cancel this participant?"
      : "Cancel the main booking?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(`${apiUrl}cancel-person`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          bookingId,
          participantId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.isSuccess) {
        alert("Cancellation successful");
        fetchEvents(showOptions); // Refresh the list
      } else {
        alert("Failed to cancel");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Something went wrong");
    }
  };

  const generateTablesFromMap = (eventMap) => {
    return Array.from(eventMap.entries()).map(([key, bookings]) => (

      <div key={key} className="table-container">
        <CollapsibleSection title={key}>
          <div className="container-table-header">
            <div className="table-caption"></div>
            <button
              onClick={() => {
                const [eventName, batch] = key.split(" : ");
                const encodedEvent = encodeURIComponent(eventName);
                const encodedBatch = encodeURIComponent(batch);
                const checklistUrl = `/checklist-view/${encodedEvent}/${encodedBatch}`;
                window.open(checklistUrl, "_blank");
              }}
              className="download-button"
            >
              View Checklist
            </button>

            <button onClick={() => handleDownloadExcel(key)} className="download-button">Download Excel</button>
          </div>
          <table id={`table-${key}`} className="event-table">
            <thead>
              <tr>
                <th>#</th> {/* Index column */}
                <th>Booking ID</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Number of People</th>
                <th>Amount Paid</th>
                <th>Pickup Location</th>
                <th>Status</th>
                <th>Double Sharing</th>
                <th>Tripal Sharing</th>
                <th>ThirdAc / Sleeper Upgrate</th>
                <th>Special Note</th>
                <th>Booking Date</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let globalIndex = 1; // Single global counter
                return bookings.map((booking) => (
                  <React.Fragment key={booking._id}>
                    {/* Main booking row */}
                    <tr>
                      <td>{globalIndex++}</td> {/* Increment global index */}
                      <td>{booking.bookingId}</td>
                      <td>{booking.name}</td>
                      <td>{booking.mobileNumber}</td>
                      <td>{booking.numberOfPeoples}</td>
                      <td>{booking.amountPaid}</td>
                      <td>{booking.pickupLocation}</td>
                      <td>{booking.status}</td>
                      <td>{booking.doubleSharing}</td>
                      <td>{booking.tripalSharing}</td>
                      <td>{booking.thirdAcUpgrate}</td>
                      <td>{booking.specialNote}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>
                        {booking.status === "Confirmed" && (<button
                          className="cancel-button"
                          onClick={() => handleCancelPerson(booking._id, null)}
                          disabled={booking.status === "Cancelled"}
                        >
                          Cancel
                        </button>)}
                      </td>
                    </tr>
                    {/* Rows for other participants */}
                    {booking.otherParticipants &&
                      booking.otherParticipants.length > 0 &&
                      booking.otherParticipants.map((participant, index) => (
                        <tr key={`${booking._id}-participant-${index}`} className="sub-row">
                          <td>{globalIndex++}</td> {/* Increment global index */}
                          <td></td> {/* Empty cell for Booking ID */}
                          <td>{participant.name}</td>
                          <td>{participant.mobileNumber}</td>
                          <td></td> {/* Empty cell for Number of People */}
                          <td></td> {/* Empty cell for Amount Paid */}
                          <td>{participant.pickupLocation}</td>
                          <td>{participant.status}</td>
                          <td></td> {/* Empty cell for Booking Date */}
                          <td></td> {/* Empty cell for Number of People */}
                          <td></td> {/* Empty cell for Number of People */}
                          <td></td> {/* Empty cell for Number of People */}
                          <td></td> {/* Empty cell for Number of People */}
                          <td>
                            {participant.status === "Confirmed" && (<button
                              className="cancel-button"
                              onClick={() => handleCancelPerson(booking._id, participant._id)}
                              disabled={participant.status === "Cancelled"}
                            >
                              Cancel
                            </button>)}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ));
              })()}
            </tbody>
          </table>

        </CollapsibleSection>
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
    <AdminNavbar>
      <div className=" contentbody">
        <div className="container justify-content-center py-md-5">
          <div className="dashboard-title">
            <b className="home-dashboard">Welcome, Bookings for next batches..</b>
            <div className="dashboard-details">
              <span >Show Bookigs<span style={{ 'color': 'red' }}>*</span></span>
              <select onChange={(e) => handleFilter(e.target.value)}>
                <option value={'all'} >All</option>
                <option value={'Pending'} >Pending</option>
                <option value={'Confirmed'} >Confirmed</option>
              </select>
            </div>
          </div>
          <div className="row justify-content- py-4">
            <div>
              {tables.length > 0 ? tables : <p>No bookings available.</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminNavbar>
  );
}

export default AdminDashboard;
