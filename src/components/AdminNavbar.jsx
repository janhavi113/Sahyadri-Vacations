import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendar, faPlus, faClipboardList, faTag , faBookOpen , faPenToSquare , faTable} from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="admin-layout">
      <div className={isExpanded ? 'admin-panel expanded' : 'admin-panel collapsed'}>
        <button className="toggle-button" onClick={toggleNavbar}>
          {isExpanded ? '<' : '>'}
        </button>
        <nav className="nav-links">
          <NavLink to="/dashboard" className="nav-item">
            <FontAwesomeIcon icon={faHome} className="nav-icon" />
            {isExpanded && <span className="nav-text">Dashboard</span>}
          </NavLink>
          <NavLink to="/all-events" className="nav-item">
            <FontAwesomeIcon icon={faCalendar} className="nav-icon" />
            {isExpanded && <span className="nav-text">All Events</span>}
          </NavLink>
          <NavLink to="/create-event" className="nav-item">
            <FontAwesomeIcon icon={faPlus} className="nav-icon" />
            {isExpanded && <span className="nav-text">Create Event</span>}
          </NavLink>
          <NavLink to="/schedule-event" className="nav-item">
            <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
            {isExpanded && <span className="nav-text">Schedule Event</span>}
          </NavLink>
          <NavLink to="/scheduled-events"className="nav-item">
            <FontAwesomeIcon icon={faTable} className="nav-icon" />
            {isExpanded && <span className="nav-text">Show Scheduled Events</span>}
          </NavLink>
            <NavLink to="/direct-bookings-dashboard" className="nav-item">
            <FontAwesomeIcon icon={faPenToSquare} className="nav-icon" />
            {isExpanded && <span className="nav-text">Direct Bookings</span>}
          </NavLink>
            <NavLink to="/direct-booking-confirmation" className="nav-item">
            <FontAwesomeIcon icon={faBookOpen} className="nav-icon" />
            {isExpanded && <span className="nav-text">Direct Booking Dashboard</span>}
          </NavLink>
            <NavLink to="/CouponCode" className="nav-item">
            <FontAwesomeIcon icon={faTag} className="nav-icon" />
            {isExpanded && <span className="nav-text">Coupons</span>}
          </NavLink>
        </nav>
      </div>
      <main className={isExpanded ? 'main-content shifted' : 'main-content'}>
        {children}
      </main>
    </div>
  );
};
export default AdminNavbar;
