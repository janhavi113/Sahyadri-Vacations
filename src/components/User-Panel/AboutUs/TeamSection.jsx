import React from 'react';
import './TeamSection.css';  // Import the CSS file
import multiimage2 from '../../Images/Team/sahane.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFacebook, faInstagram, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

const TeamSection = () => {
  return (
    <div className="ceo-section ">
      <div className="ceo-section-team row">
        <div className="ceo-col">
          <img className="multiimage2" src={multiimage2} />
        </div>
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 founder py-5">
          <h2 className="h2">Pravin Sahane</h2>
          <div className="designation">Founder</div>

          <p className="team-info">
          As the founder of Sahyadri Vacations and Adventures, He has explored more than 350 treks in Sahyadri mountain ranges and travel a lot in all over India. With a love for adventure and exploration, He leads a team who inspire others to step out of their comfort zones and experience the world through trekking and travel. His mission is crafting unforgettable journeys that connect people with nature and adventure. He is great leader and Mountaineer. He is deeply passionate about traveling and believe that every journey has the power to transform lives, broaden horizon and main tool to improve World Happiness Index.
          </p>
           <a className="links" href="https://www.facebook.com/profile.php?id=100090509509892&mibextid=JRoKGi" target="_blank" > <FontAwesomeIcon className="icon" icon={faSquareFacebook} style={{ color: "Orange", }} size='xl' />       </a>
          <a className="links" href="https://www.instagram.com/ek_awaraaa?igsh=NmowZTBrODBxcmpp" target="_blank" > <FontAwesomeIcon className="icon" icon={faInstagram} style={{ color: "Orange", }} size='xl' />      </a>
          <a className="links" href="https://youtube.com/@ekawaraa?si=YXubYwoPh-jvgyR4" target="_blank" > <FontAwesomeIcon className="icon" icon={faYoutube} style={{ color: "Orange", }} size='xl' />   </a>
         </div>

      </div>
    </div>
  );
};

export default TeamSection;
