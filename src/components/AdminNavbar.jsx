import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import "./AdminNavbar.css";
import logo from './Images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons';
const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <header className={isOpen ? 'active-header-center-aligned header-center-aligned' : 'header-center-aligned'} >
      
        <div className={isOpen ? 'topnav responsive' : 'topnav'} >
          <nav className='admin-navlink navlink' >
          <NavLink to="/dashboard">
          <img className="admin-logo" src={logo} />
        </NavLink>
            <NavLink className='navlink-hover' to="/dashboard"      ><li className='tab-style'>Home</li></NavLink>
            <NavLink className='navlink-hover' to="/all-events"     ><li className='tab-style'>All Events</li></NavLink>
            <NavLink className='navlink-hover' to="/scheduled-events"><li className='tab-style'>Events Details</li></NavLink>
            <NavLink className='navlink-hover' to="/create-event"   ><li className='tab-style'>Create Event</li></NavLink>
            <NavLink className='navlink-hover' to="/schedule-event" ><li className='tab-style'>Schedule Event</li></NavLink>
            <NavLink className='navlink-hover' to="/direct-bookings-dashboard" ><li className='tab-style'>Direct Booking</li></NavLink>
            <NavLink className='navlink-hover-icon' onClick={toggleNavbar}><li className="info-block"><FontAwesomeIcon className='header-icon' icon={faBars} size="lg" /></li></NavLink>
          </nav>
        </div>

      </header>
    </div>

  )
}

export default AdminNavbar
