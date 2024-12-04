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

          <p className="team-info">A passionate traveller and mountaineer. He has explored more than 350 treks in the Sahyadri mountain range. He is a great leader and skilled Mountaneer. He has successfully led more than 150 treks. He believe that travel has the power to transform lives, broaden horizons and is main tool to improve World Happiness Index.</p>
          <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faSquareFacebook} style={{ color: "Orange", }} size='xl' />       </a>
          <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faInstagram} style={{ color: "Orange", }} size='xl' />      </a>
          <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faYoutube} style={{ color: "Orange", }} size='xl' />   </a>
          <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faLinkedinIn} style={{ color: "Orange", }} size='xl' />   </a>
        </div>

      </div>
    </div>
  );
};

export default TeamSection;
