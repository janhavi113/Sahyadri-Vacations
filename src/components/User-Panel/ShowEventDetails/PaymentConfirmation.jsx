import React, { useEffect, useState } from 'react';

const PaymentConfirmation = ({ merchantId, merchantTransactionId }) => {
  const [paymentStatus, setPaymentStatus] = useState('Checking payment status...');
  const apiUrl = 'https://your-api-url.com/'; // Replace with your API base URL

  useEffect(() => {
    // Function to check the payment status
    const checkPaymentStatus = async () => {
      try {
        // Make an API request to check the status
        const response = await fetch(`${apiUrl}api/phonepe/status/${merchantId}/${merchantTransactionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success && data.data.status === 'SUCCESS') {
          setPaymentStatus('Payment successful! Thank you for your payment.');
        } else if (data.data.status === 'PENDING') {
          setPaymentStatus('Payment is still pending. We will update you once it is confirmed.');
          // Optionally, you can add retry logic for pending status here
        } else {
          setPaymentStatus('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('An error occurred while checking payment status.');
      }
    };

    // Call the function on component mount
    checkPaymentStatus();
  }, [merchantId, merchantTransactionId, apiUrl]);

  return (
    <div>
      <h1>Payment Confirmation</h1>
      <p>{paymentStatus}</p>
    </div>
  );
};

export default PaymentConfirmation;
