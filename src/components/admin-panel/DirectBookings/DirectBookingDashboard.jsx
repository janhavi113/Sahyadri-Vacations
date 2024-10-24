import React from 'react'
import DirectBookings from './DirectBookings'
import AdminNavbar from '../../AdminNavbar'
const DirectBookingDashboard = () => {
  return (
    <div>
    <div className='admin-navbar'>
      <AdminNavbar />
    </div>
    <div className='direct-bookings-container'>
      <DirectBookings />
    </div>
  </div>
  )
}

export default DirectBookingDashboard
