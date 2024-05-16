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
      
        <div className="footer-links justify-content-center">
          <img className="footer-brand" src={logo} />
          <ul className="footer-navbar">
           <li> <NavLink  to="/"><li className="info-block">Home</li></NavLink></li>
           <li> <NavLink  to="/events"><li className="info-block">Events</li></NavLink></li>
           <li> <NavLink  to="/gallery"><li className="info-block">Gallery</li></NavLink></li>
           <li> <NavLink  to="/customise-tours"><li className="info-block">Customise Tours</li></NavLink></li>
           <li> <NavLink  to="/our-team"><li className="info-block">Our Team</li></NavLink></li>
           <li> <NavLink  to="/about"><li className="info-block">About</li></NavLink></li>
           <li> <NavLink  to="/contact-us"><li className="info-block">Contact Us</li></NavLink></li>
          </ul>
        </div>
        <div className="social-icons">
        
          <div className='thicker' style={{color: 'white'}}>Follow us on</div>
          <a href="https://m.facebook.com/people/Sahyadri-Vacations/100085021143109/" title="facebook" target="_blank">
            <FontAwesomeIcon className="icon" icon={faSquareFacebook} />
            {/* <i className="fa fa-facebook-square" aria-hidden="true"></i> */}
          </a>
          <a href="https://www.instagram.com/sahyadri_vacations/" title="instagram" target="_blank">
            <FontAwesomeIcon className="icon" icon={faInstagram} />
          </a>
          <a href="https://t.me/sahyadri_vacations" title="telegram" target="_blank">
            <FontAwesomeIcon className="icon" icon={faTelegram} />
          </a>
          <a href="https://www.youtube.com/channel/UCLY1fnNaABNhYilv4s1ehLQ" title="youtube" target="_blank">
            <FontAwesomeIcon className="icon" icon={faSquareYoutube} />
          </a>
          <div className="copyright">
            <hr />
            <br />Copyright &copy; Sahyadri Vacations and Adventures
          </div>
        </div>
      </div>
    </div>
  )
}

export default footer
