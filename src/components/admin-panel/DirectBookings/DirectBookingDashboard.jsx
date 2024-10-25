import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DirectBookings from './DirectBookings'
import AdminNavbar from '../../AdminNavbar'
const DirectBookingDashboard = () => {
  const navigate = useNavigate();
  const [bookinDetails, setBookinDetails] = useState('');
  // Function to handle data from child
  const handleChildResponse = (data) => {
    setBookinDetails(data); // Update state with data from child
    console.log('Data received from child:', data);
    if(data.isSuccess){
      navigate('/direct-booking-confirmation');
    }
  };
  return (
    <div>
    <div className='admin-navbar'>
      <AdminNavbar />
    </div>
    <div className='direct-bookings-container'>
    <DirectBookings onSendData={handleChildResponse}/>
    </div>
  </div>
  )
}

export default DirectBookingDashboard
