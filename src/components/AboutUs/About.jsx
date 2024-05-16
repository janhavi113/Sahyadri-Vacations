import React, { useState } from 'react';
import Footer from "../footer";
import Navbar from "../Navbar";
import slide3 from '../Images/Screen_4.webp';
import './AboutUs.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faInstagram, faTelegram, faSquareYoutube } from '@fortawesome/free-brands-svg-icons'

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="header">
        <img className='slide-image' src={slide3}></img>
        <div className="text team-text-blk team-head-text">About Us</div>
      </div>
      <div className="container">
        <h2 className="title-header">Our Story</h2>
        <p className="info" >In November 2021, we embarked on a remarkable journey with a simple yet powerful belief: that people should passionately pursue their hobby of trekking. With this vision in mind, Sahyadri Vacations and Adventures born. Our primary objective was to introduce people to the hidden gems of Maharashtra and India in long term At Sahaydri Vacations, we strive to create unforgettable memories for our participants. We carefully curate each trek, tour, and camping experience to showcase the hidden treasures of Maharashtra, from the majestic forts perched atop rugged mountains to the serene valleys and pristine lakes that adorn the landscape. We believe in the transformative power of nature and adventure, and our aim is to provide you with immersive experiences that leave a lasting impact.</p>
      </div>

      <div className='team-section'>
        <h1 className='thicker'> Sahyadri Vacations Team </h1>
        <div className="home-container">
          <div className="profile-card">
            <div className="img">
              <img src="./man.jpg" />
            </div>
            <div className="caption">
              <h3>Tom Cruise</h3>
              <div>Full Stack Developer</div>
              <div className="social-links">
                <i><FontAwesomeIcon className="icon1" icon={faSquareFacebook} /></i>
                <i><FontAwesomeIcon className="icon1" icon={faTelegram} /></i>
                <i><FontAwesomeIcon className="icon1" icon={faInstagram} /></i>
              </div>
            </div>
          </div>
          <div className="profile-card">
            <div className="img">
              <img src="./man.jpg" />
            </div>
            <div className="caption">
              <h3>David Wornar</h3>
              <div>Front End Developer</div>
              <div className="social-links">
                <i><FontAwesomeIcon className="icon1" icon={faSquareFacebook} /></i>
                <i><FontAwesomeIcon className="icon1" icon={faTelegram} /></i>
                <i><FontAwesomeIcon className="icon1" icon={faInstagram} /></i>
              </div>
            </div>
          </div>
          <div className="profile-card">
            <div className="img">
              <img src="./man.jpg" />
            </div>
            <div className="caption">
              <h3>Vin Diesel</h3>
              <div>Back End Developer</div>
              <div className="social-links">
                <i><FontAwesomeIcon className="icon1" icon={faSquareFacebook} /></i>
                <i><FontAwesomeIcon className="icon1" icon={faTelegram} /></i>
                <i><FontAwesomeIcon className="icon1" icon={faInstagram} /></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About
