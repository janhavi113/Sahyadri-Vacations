import React from 'react'
import { NavLink } from 'react-router-dom'
import "./AdminNavbar.css";
import logo from './Images/logo.png';
const AdminNavbar = () => {
  return (
    <div>
    <nav>
      <NavLink className={(e)=>{return e.isActive?"red": "" }} to="/dashboard"      ><li className='tab-style'>Home</li></NavLink>
      <NavLink className={(e)=>{return e.isActive?"red": "" }} to="/all-events"     ><li className='tab-style'>All Events</li></NavLink>
      <NavLink className={(e)=>{return e.isActive?"red": "" }} to="/scheduled-events"><li className='tab-style'>Events Details</li></NavLink>
      <NavLink className={(e)=>{return e.isActive?"red": "" }} to="/create-event"   ><li className='tab-style'>Create Event</li></NavLink>
      <NavLink className={(e)=>{return e.isActive?"red": "" }} to="/schedule-event" ><li className='tab-style'>Schedule Event</li></NavLink>
      <img src={logo} width="80vh" height="80vh" />
    </nav>
  </div>
  )
}

export default AdminNavbar
