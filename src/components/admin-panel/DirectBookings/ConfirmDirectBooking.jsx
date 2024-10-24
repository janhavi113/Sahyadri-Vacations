import React, { useState } from 'react';
import DirectBookings from './DirectBookings'
import logo from '../../Images/logo.png';
import "./DirectBooking.css";
export const ConfirmDirectBooking = () => {
  const [bookinDetails, setBookinDetails] = useState('');

  // Function to handle data from child
  const handleChildResponse = (data) => {
    setBookinDetails(data); // Update state with data from child
    console.log('Data received from child:', data);
  };
  return (
    <div className='confirm-booking'>
    <img className="admin-logo" src={logo} />
    {bookinDetails.isSuccess && <div>sucess</div>}
    <DirectBookings onSendData={handleChildResponse}/>
    </div>
  )
}
export default ConfirmDirectBooking