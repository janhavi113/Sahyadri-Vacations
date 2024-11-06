import React from 'react';
import './Confirmation.css'; // Optional: for styling
import { useLocation } from 'react-router-dom';
const Confirmation = () => {
    const location = useLocation();
    const { phone, email, name, bookingId, noOfParticipant } = location.state || {}; // Destructure to get phone and email
// Check if name or bookingId is missing
const isStateMissing = !name || !bookingId;
    return (
        <div className="confirmation-container">
            {isStateMissing ? (
                <div>
                    <h1>Contact Us</h1>
                    <br />
                    <button onClick={() => window.location.href = '/'}>Go to Home</button>
                    <p>If you have any questions or need assistance, feel free to reach out to us.</p>
                    <p>
                        <strong>Phone:</strong>
                        <a href="tel:+917028740961" className="confirmed-link" style={{ marginLeft: '5px' }}>+91 7028740961</a>
                    </p>
                    <p>
                        <strong>Email:</strong>
                        <a href="mailto:contactus@sahyadrivacations.com" className="confirmed-link" style={{ marginLeft: '5px' }}>contactus@sahyadrivacations.com</a>
                    </p>
                </div>
            ) : (
                <div>
                    <h1>Booking Confirmation</h1>
                    <p>Thank you for your booking, {name}!</p>
                    <p>
                        Your booking for <strong>{noOfParticipant}</strong> participant{noOfParticipant !== 1 ? 's' : ''} has been successfully confirmed.
                        We appreciate your choice and look forward to welcoming you soon!
                    </p>
                    <h2>Your Booking Details</h2>
                    <div className="contact-details">
                        <p><strong>Booking ID:</strong> {bookingId}</p>
                        <p><strong>Phone Number:</strong> {phone}</p>
                        <p><strong>Email:</strong> {email}</p>
                    </div>
                    <p className="invoice-message">You will receive an invoice by email in the next few minutes.</p>
                    <p>If you have any questions, feel free to contact us.</p>
                    <p>
                        <strong>Phone:</strong>
                        <a href="tel:+917028740961" className="confirmed-link" style={{ marginLeft: '5px' }}>+91 7028740961</a>
                    </p>
                    <p>
                        <strong>Email:</strong>
                        <a href="mailto:contactus@sahyadrivacations.com" className="confirmed-link" style={{ marginLeft: '5px' }}>contactus@sahyadrivacations.com</a>
                    </p>
                    <button onClick={() => window.location.href = '/'}>Go to Home</button>
                </div>
            )}
        </div>
    );
};

export default Confirmation;
