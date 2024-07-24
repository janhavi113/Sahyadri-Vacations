import React from 'react'
import "./Footer.css"
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faInstagram, faTelegram, faSquareYoutube } from '@fortawesome/free-brands-svg-icons'
import logo from './Images/logo.png';
const footer = () => {
  return (
    <div>
      <div className="footer">

        <div className="footer-links">
          <img className="footer-brand" src={logo} />
          <div className="remove-margin" >
            <div className=" row ">
              <div className="col-xs-12">
                <ul className="footer-navbar">
                  <li> <NavLink to="/"><li className="info-block">Home</li></NavLink></li>
                  <li> <NavLink to="/events"><li className="info-block">Events</li></NavLink></li>
                  <li> <NavLink to="/gallery"><li className="info-block">Gallery</li></NavLink></li>
                  <li> <NavLink to="/customised-tour"><li className="info-block">Customise Tours</li></NavLink></li>
                  <li> <NavLink to="/about"><li className="info-block">Our Team</li></NavLink></li>
                  <li> <NavLink to="/about"><li className="info-block">About</li></NavLink></li>
                  <li> <NavLink to="/contact-us"><li className="info-block">Contact Us</li></NavLink></li>
                </ul>
                <ul className="footer-navbar">
                  <li> <NavLink to="/privacy-policy"><li className="info-block">Privacy Policy</li></NavLink></li>
                  <li> <NavLink to="/cancellation-policy"><li className="info-block">Refund & Cancellation Policy</li></NavLink></li>
                  <li> <NavLink to="/user-agreement"><li className="info-block">Terms & Conditions</li></NavLink></li>
                </ul>
              </div>
            </div>
          </div>
        </div>


        <div className="social-icons">
          <div className='thicker' style={{ color: 'white' }}>Follow us on</div>
          <a href="https://m.facebook.com/people/Sahyadri-Vacations/100085021143109/" title="facebook" target="_blank">
            <FontAwesomeIcon className="icon" icon={faSquareFacebook} style={{ color: "white", }} />
            {/* <i className="fa fa-facebook-square" aria-hidden="true"></i> */}
          </a>
          <a href="https://www.instagram.com/sahyadri_vacations/" title="instagram" target="_blank">
            <FontAwesomeIcon className="icon" icon={faInstagram} style={{ color: "white", }} />
          </a>
          <a href="https://t.me/sahyadri_vacations" title="telegram" target="_blank">
            <FontAwesomeIcon className="icon" icon={faTelegram} style={{ color: "white", }} />
          </a>
          <a href="https://www.youtube.com/channel/UCLY1fnNaABNhYilv4s1ehLQ" title="youtube" target="_blank">
            <FontAwesomeIcon className="icon" icon={faSquareYoutube} style={{ color: "white", }} />
          </a>
          <div className="copyright">
            <hr />
            <br />&copy; 2024 Sahyadri Vacations. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default footer
