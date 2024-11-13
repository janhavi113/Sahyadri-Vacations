import React, { useEffect, useState } from 'react';
import './Confirmation.css'; // Optional: for styling
import { useLocation } from 'react-router-dom';
import logoLoading from '../Loading/Loading'
const Confirmation = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const [bookingId, setBookingId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);  // To store payment status
    const [loading, setLoading] = useState(true);  // To show loading state while checking status
    const [paymentErrorMessage, setpaymentErrorMessage] = useState(null);  // To handle any errors
    const [error, setError] = useState(null);
    const [isStateMissing, setIsStateMissing] = useState(false);
    const [status, setStatus] = useState('');
    const [phone, setPhone] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [noOfParticipant, setNoOfParticipant] = useState(null);
    const [details, setDetails] = useState(null);
    // Sample user data (you may fetch it based on the bookingId or get it from state)
    // Replace with actual data

    // Function to fetch payment status from PhonePe API
    const fetchPaymentStatus = async (merchantTransactionId) => {

        try {
            const response = await fetch(`${apiUrl}api/check-status/${merchantTransactionId}`);
            const data = await response.json();
            console.log('data--',data);
            if (data.status == 'success' || data.status == 'pending') {
                const details = data.details;
                if (details.code === 'PAYMENT_SUCCESS') {
                    // Payment is successful
                    setLoading(false);
                    setPaymentStatus('SUCCESS');
                    await getBookingData(details.data.merchantTransactionId, details.data.paymentInstrument.type, details.data.transactionId);
                } else if (details.code === 'PAYMENT_PENDING') {
                    // Payment is pending
                    setPaymentStatus('PENDING');
                } else {
                    setpaymentErrorMessage(details.message);
                    setPaymentStatus('FAILED');
                }
            } else if (data.status == 'failed') {
                const details = data.details;
                if (details.code === 'PAYMENT_ERROR') {
                    // Payment failed, show detailed message
                    setpaymentErrorMessage(details.message);
                } else {
                    setpaymentErrorMessage(details.message);
                }

                setPaymentStatus('FAILED');
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            //alert('There was an error processing your request. Please try again later.');
        }
    };

    const getBookingData = async (bookingId, paymentMethod, transactionId) => {
        try {
            const formData = new FormData();
            formData.append("bookingId", bookingId);
            formData.append("paymentMethod", paymentMethod);
            formData.append("transactionId", transactionId);
            let r = await fetch(`${apiUrl}payment-confirmed`, {
                method: "PUT",
                body: formData,
            });

            let res = await r.json();
            if (res.isSuccess) {
                setBookingId(res.booking.bookingId);
                setPhone(res.booking.mobileNumber);
                setEmail(res.booking.email);
                setName(res.booking.name);
                setNoOfParticipant(res.booking.numberOfPeoples);
                if(!res.booking.invoiceDelivered){
                await sendInvoiceRequest(res.booking);
                }
            }

        } catch (error) {
            console.error('Error checking payment status:', error);
            //alert('There was an error processing your request. Please try again later.');
        }
    };
    // Call fetchPaymentStatus when component mounts
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('booking-id') != null) {
            setIsStateMissing(isStateMissing);
            fetchPaymentStatus(params.get('booking-id'));
        } else {
            setIsStateMissing(true);
        }

    }, []);

    const sendInvoiceRequest = async (booking) => {
        console.log('booking---',booking)
        try {
            const response = await fetch(`${apiUrl}sendInvoice`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(booking),
            });

            const result = await response.text();
            if (response.ok) {
                console.log("Invoice sent successfully:", result);
            } else {
                console.error("Failed to send invoice:", result);
            }
        } catch (error) {
            console.error("Error sending invoice:", error);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading payment status...</p>
            ) : (<div className="confirmation-container">
                {isStateMissing == true ? (
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

                        {/* Displaying Payment Status */}
                        {loading ? (
                            <logoLoading />
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : paymentStatus === 'SUCCESS' ? (
                            <p>Payment Successful! Thank you for your payment.</p>
                        ) : paymentStatus === 'FAILED' ? (
                            <p>Payment Failed. Please try again or contact support.</p>
                        ) : paymentStatus === 'PENDING' ? (
                            <p>Payment is still pending. Please check back later.</p>
                        ) : (
                            <p>Unable to fetch payment status.</p>
                        )}

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
            )}
        </div>
    );
};

export default Confirmation;
