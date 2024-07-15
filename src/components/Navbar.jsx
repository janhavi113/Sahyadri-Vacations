import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import "./Navbar.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faMagnifyingGlass , faBars} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import logo from './Images/logo.png';
const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const [isSearch, setSearch] = useState(false);
  const [isSearchText, setSearchText] = useState('');
  const searchNavbar = () => {
    if(isSearchText.length > 0){
      navigate(`/search-event?search=${isSearchText}`);      
    }else{
      setSearch(!isSearch);
    }
    
    console.log('isSearchText',isSearchText.length);
  };
  
  function handleChange(e) {
    setSearchText(e.target.value);
}

const searchText = () => {
  console.log('I am ok ');
};
  return (
    <div >   
      <header className={isOpen ? 'active-header-center-aligned header-center-aligned' : 'header-center-aligned'} >
      {/* <div className="header-top">
        <div className="header-container">
          <div className="row">
            <div className="col-xs-12">
              <div className="holder">
                <div >
                  <ul className="info-list list-unstyled">
                    <li className="info-block">
                      <div className="multiple-phone call-desktop">
                        <a
                          href="#"
                          className="vl-popover hidden-xs hidden-sm skip-url-slug-check"
                          data-container="body"
                          data-toggle="popover"
                          data-placement="bottom"
                          data-popover-content="#customPopover"
                          data-original-title="Call Us"
                          ><FontAwesomeIcon className='header-icon' icon={faPhone} size="lg" /> Call
                          Us
                          <FontAwesomeIcon className='header-icon' icon={faSortDown} size="lg" />
                          </a>
                       
                      </div>
                    </li>
                    <li className="info-block">
                      <a
                        href="mailto:sahyadrivacations@gmail.com"
                        className="skip-url-slug-check"
                        title="sahyadrivacations@gmail.com"
                        > <FontAwesomeIcon className='header-icon' icon={faEnvelope} size="lg" />
                        sahyadrivacations@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>
      */}
      <div className={isOpen ? 'topnav responsive' : 'topnav'} >    
      <nav className='navlink' >
        <NavLink className='navlink-hover' to="/"><li className="info-block">Home</li></NavLink>
        <NavLink className='navlink-hover' to="/events"><li className="info-block">Events</li></NavLink>
        <NavLink className='navlink-hover' to="/gallery"><li className="info-block">Gallery</li></NavLink>
        <NavLink className='navlink-hover' to="/about"><li className="info-block">About</li></NavLink>
        <NavLink className='navlink-hover' to="/contact-us"><li className="info-block">Contact Us</li></NavLink>
        <NavLink className='navlink-hover-icon' onClick={toggleNavbar}><li className="info-block"><FontAwesomeIcon className='header-icon' icon={faBars} size="lg" /></li></NavLink>
        <NavLink className={isSearch ? ' input-style navlink-hover' : 'navlink-hover' } ><li className="info-block" onClick={searchNavbar}><FontAwesomeIcon icon={faMagnifyingGlass} size="lg" /></li>{isSearch &&  <input className="nav-input-box " onChange={handleChange}  type="text" placeholder='Search..' />}</NavLink>
        
       
      </nav>
      <NavLink to="/">
      <img className="navbar-brand" src={logo}  />
      </NavLink>
      </div>
      
    </header>
   
    </div>
  )
}

export default Navbar
