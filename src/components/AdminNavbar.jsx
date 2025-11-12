import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faCalendar, faChartPie, faPlus, faShuffle, faBars,
  faClipboardList, faTag, faFire, faBookOpen, faPenToSquare, faTable
} from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setRole(parsedUser.Role || parsedUser.role || '');
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
      }
    }
  }, []);

  const toggleNavbar = () => setIsExpanded(!isExpanded);

  // ✅ admin or super_admin check
  const isAdmin = role === 'admin' || role === 'super_admin';

  return (
    <div className="admin-layout">
      <div className={isExpanded ? 'admin-panel expanded' : 'admin-panel collapsed'}>
        <button className="toggle-button" onClick={toggleNavbar}>
          {isExpanded ? '<' : <FontAwesomeIcon className='header-icon' icon={faBars} size="sm" />}
        </button>

        <nav className="nav-links">

          {/* Dashboard - visible to all */}
          <NavLink to="/dashboard" className="nav-item">
            <FontAwesomeIcon icon={faHome} className="nav-icon" />
            {isExpanded && <span className="nav-text">Dashboard</span>}
          </NavLink>

          {/* Reports - visible to all */}
          <NavLink to="/booking-report" className="nav-item">
            <FontAwesomeIcon icon={faChartPie} className="nav-icon" />
            {isExpanded && <span className="nav-text">Reports</span>}
          </NavLink>

          {/* Admin-only Tabs */}
          {isAdmin && (
            <>
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

              <NavLink to="/scheduled-events" className="nav-item">
                <FontAwesomeIcon icon={faTable} className="nav-icon" />
                {isExpanded && <span className="nav-text">Show Scheduled Events</span>}
              </NavLink>
            </>
          )}

          {/* Direct Bookings - visible to all */}
          <NavLink to="/direct-bookings-dashboard" className="nav-item">
            <FontAwesomeIcon icon={faPenToSquare} className="nav-icon" />
            {isExpanded && <span className="nav-text">Direct Bookings</span>}
          </NavLink>

          {/* Direct Booking Dashboard - visible to all */}
          <NavLink to="/direct-booking-confirmation" className="nav-item">
            <FontAwesomeIcon icon={faBookOpen} className="nav-icon" />
            {isExpanded && <span className="nav-text">Direct Booking Dashboard</span>}
          </NavLink>

          {/* Admin-only Tabs */}
          {isAdmin && (
            <>
              <NavLink to="/CouponCode" className="nav-item">
                <FontAwesomeIcon icon={faTag} className="nav-icon" />
                {isExpanded && <span className="nav-text">Coupons</span>}
              </NavLink>

              <NavLink to="/sort-schedule-batches" className="nav-item">
                <FontAwesomeIcon icon={faShuffle} className="nav-icon" />
                {isExpanded && <span className="nav-text">Sort Schedule Batches</span>}
              </NavLink>

              <NavLink to="/employee-onboarding" className="nav-item">
                <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
                {isExpanded && <span className="nav-text">Employee Onboarding</span>}
              </NavLink>
            </>
          )}

          {/* Customise Inquiry - visible to all */}
          <NavLink to="/customised-tour" className="nav-item">
            <FontAwesomeIcon icon={faFire} className="nav-icon" />
            {isExpanded && <span className="nav-text">Customise Inquiry</span>}
          </NavLink>

          {/* Admin-only Tab */}
          {isAdmin && (
            <NavLink to="/categories" className="nav-item">
              <FontAwesomeIcon icon={faFire} className="nav-icon" />
              {isExpanded && <span className="nav-text">Honey Moon Categories</span>}
            </NavLink>
          )}
        </nav>
      </div>

      <main className={isExpanded ? 'main-content shifted' : 'main-content'}>
        {children}
      </main>
    </div>
  );
};

export default AdminNavbar;
