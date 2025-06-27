import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ChecklistView.css';

function ChecklistView() {
const { eventName, batch } = useParams();
const [bookings, setBookings] = useState([]);
const apiUrl = import.meta.env.VITE_API_URL;
const navigate = useNavigate();

useEffect(() => {
    fetchBookings();
}, []);

const fetchBookings = async () => {
    try {
        const response = await fetch(`${apiUrl}show-all-bookings/Confirmed`);
        if (response.ok) {
            const data = await response.json();
            if (data.isSuccess) {
                const filteredBookings = data.bookings.filter((b) =>
                    b.eventName === decodeURIComponent(eventName) &&
                    (b.batch || "") === decodeURIComponent(batch)
                );
                setBookings(filteredBookings);
            }
        } else {
            console.error("Failed to fetch bookings");
        }
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
};

const handlePickupToggle = async (bookingId, participantIndex, newValue) => {
  try {
    const response = await fetch(`${apiUrl}update-pickup-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId,
        participantIndex,
        pickupDone: newValue,
      }),
    });

    if (response.ok) {
      // Update UI locally
      setBookings((prevBookings) =>
        prevBookings.map((b) => {
          if (b._id !== bookingId) return b;

          if (participantIndex === null) {
            return { ...b, pickupDone: newValue };
          } else {
            const updatedParticipants = [...b.otherParticipants];
            updatedParticipants[participantIndex].pickupDone = newValue;
            return { ...b, otherParticipants: updatedParticipants };
          }
        })
      );
    } else {
      console.error("Failed to update pickup status");
    }
  } catch (error) {
    console.error("Error updating pickup status:", error);
  }
};

return (
    <div className=" contentbody">
        <div className="container justify-content-center py-md-5">
            <div className="dashboard-title">
                <b className="header-check-list">Checklist for: {decodeURIComponent(eventName)} - Batch: {decodeURIComponent(batch)}</b>
            </div>
            <div className="row justify-content- py-4">
                <div className="checklist-container">
                {bookings.length === 0 ? (
<div className="no-bookings-msg">
<p>No bookings found for this event and batch.</p>
</div>
) : (
                   <div className="table-responsive">
                   <table className="checklist-table ">
                        <thead>
                            <tr>
                                <th>✔️</th>
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
                            </tr>
                        </thead>

                        <tbody>
                            {(() => {
                                let globalIndex = 1; // Single global counter
                                return bookings.map((booking) => (
                                    <React.Fragment key={booking._id}>
                                        {/* Main booking row */}
                                        <tr>
                                            <td><input type="checkbox" checked={booking.pickupDone}
  onChange={() => handlePickupToggle(booking._id, null, !booking.pickupDone)} /></td>
                                            <td>{globalIndex++}</td> {/* Increment global index */}
                                            <td>{booking.bookingId}</td>
                                            <td>{booking.name}</td>
                                            <td className="phone-link"> <a href={`tel:${booking.mobileNumber}`}>{booking.mobileNumber}</a></td>
                                            <td>{booking.numberOfPeoples}</td>
                                            <td>{booking.amountPaid}</td>
                                            <td>{booking.pickupLocation}</td>
                                            <td>{booking.status}</td>
                                            <td>{booking.doubleSharing}</td>
                                            <td>{booking.tripalSharing}</td>
                                            <td>{booking.thirdAcUpgrate}</td>
                                            <td>{booking.specialNote}</td>
                                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>

                                        </tr>
                                        {/* Rows for other participants */}
                                        {booking.otherParticipants &&
                                            booking.otherParticipants.length > 0 &&
                                            booking.otherParticipants.map((participant, index) => (
                                                <tr key={`${booking._id}-participant-${index}`} className="sub-row">
                                                    <td><input type="checkbox" checked={participant.pickupDone}
  onChange={() =>
    handlePickupToggle(booking._id, index, !participant.pickupDone)
  }/></td>
                                                    <td>{globalIndex++}</td> {/* Increment global index */}
                                                    <td></td> {/* Empty cell for Booking ID */}
                                                    <td>{participant.name}</td>
                                                    <td className="phone-link"> <a href={`tel:${participant.mobileNumber}`}>{participant.mobileNumber}</a></td>
                                                    <td></td> {/* Empty cell for Number of People */}
                                                    <td></td> {/* Empty cell for Amount Paid */}
                                                    <td>{participant.pickupLocation}</td>
                                                    <td>{participant.status}</td>
                                                    <td></td> {/* Empty cell for Booking Date */}
                                                    <td></td> {/* Empty cell for Number of People */}
                                                    <td></td> {/* Empty cell for Number of People */}
                                                    <td></td> {/* Empty cell for Number of People */}
                                                    <td></td> {/* Empty cell for Number of People */}

                                                </tr>
                                            ))}
                                    </React.Fragment>
                                ));
                            })()}
                        </tbody>
                    </table>
                    </div>
                    )}
                </div>
            </div>
        </div>
        </div>
        );
}

        export default ChecklistView;
