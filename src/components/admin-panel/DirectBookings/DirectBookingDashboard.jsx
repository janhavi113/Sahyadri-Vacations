import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DirectBookings from './DirectBookings'
import AdminNavbar from '../../AdminNavbar'
const DirectBookingDashboard = () => {
  const navigate = useNavigate();
  const [bookinDetails, setBookinDetails] = useState('');
  // Check token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]); // Add navigate as a dependency

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
     <AdminNavbar>
    <div className='direct-bookings-container'>
    <DirectBookings onSendData={handleChildResponse}/>
    </div>
    </AdminNavbar>
  </div>
  )
}

export default DirectBookingDashboard
