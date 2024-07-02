import React from 'react'
import slide1 from '../Images/background.png';
import './Sidebar.css'
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faInstagram, faTelegram, faSquareYoutube } from '@fortawesome/free-brands-svg-icons'

const textVariants = {
  initial: {
    y: 100,
    opacity: 0,
  },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 3.5,
      staggerChuldren: 0.1,
    },
  },
};
const socialVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 3.5,
      staggerChuldren: 0.1,
    },
  },
};
const sliderVariants = {
  initial: {
    x: 0,
  },
  animate: {
    x: "-100%",
    transition: {
      repeat: Infinity,
      repeatType:"mirror",
      duration: 20,
    },
  },
};

const Sidebar = () => {
  return (
    <div className='hero'>
      <div className="wrapper">
        <motion.div className="textContainer" variants={textVariants} initial="initial" animate="animate">
          <h2 > Welcome to</h2>
          <h1 >Sahydri Vacations</h1>
          <span >Enrich your experience </span>
          <div className="buttons">
            <a  href="/events" role="button" >Upcomming Events</a>
            {/* <button>Contact Us</button> */}
          </div>
        </motion.div>
        <motion.div className='social-icon' variants={socialVariants} initial="initial" animate="animate">
        <a href="https://m.facebook.com/people/Sahyadri-Vacations/100085021143109/" title="facebook" target="_blank">
            <FontAwesomeIcon className="icon" icon={faSquareFacebook} style={{color: "white",}} size="lg"/>
            {/* <i className="fa fa-facebook-square" aria-hidden="true"></i> */}
          </a>
          <a href="https://www.instagram.com/sahyadri_vacations/" title="instagram" target="_blank">
            <FontAwesomeIcon className="icon" icon={faInstagram} style={{color: "white",}} size="lg" /> 
          </a>
          <a href="https://t.me/sahyadri_vacations" title="telegram" target="_blank">
            <FontAwesomeIcon className="icon" icon={faTelegram} style={{color: "white",}} size="lg"/>
          </a>
          <a href="https://www.youtube.com/channel/UCLY1fnNaABNhYilv4s1ehLQ" title="youtube" target="_blank">
            <FontAwesomeIcon className="icon" icon={faSquareYoutube} style={{color: "white",}} size="lg"/>
          </a>
        </motion.div>
      </div>
      <motion.div className="sliderTextContainer" variants={sliderVariants} initial="initial" animate="animate">
        Sahyadri Vacations
      </motion.div>

      <div className="imageContainer" >
        <img src={slide1} alt="header" />
      </div>
    </div>
  )
}

export default Sidebar
