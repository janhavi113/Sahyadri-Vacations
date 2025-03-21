import React from 'react'
import './Rating.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import google from '../../Images/google-circle.svg'
const RatingCard = (props) => {
 
  return (
    <>
      <div className="rating-card card-width card">
        <div className='verified-icon'>
          <FontAwesomeIcon icon={faCircleCheck} size="lg" style={{ color: "#028322", }} />
        </div>
        <div className="review-profile-header">
          <img className="muiCardMedia-img" src={google} alt="profile picture" crossOrigin="anonymous" />
          <div className="review-header">
            <h6 className="review-body-container review-profile-name" style={{ 'line-height': '150%;' }}>{props.event.name} </h6>
            <h4 className="review-body-container review-profile-date" style={{ 'color': 'black;', 'line-height': '150%;', 'opacity': '0.7;' }}>{props.event.Date}</h4>
          </div>
        </div>
        <div ><FontAwesomeIcon icon={faStar} size="xs" style={{ color: "#FFD43B", }} />    <FontAwesomeIcon icon={faStar} size="xs" style={{ color: "#FFD43B", }} />    <FontAwesomeIcon icon={faStar} size="xs" style={{ color: "#FFD43B", }} />    <FontAwesomeIcon icon={faStar} size="xs" style={{ color: "#FFD43B", }} />    <FontAwesomeIcon icon={faStar} size="xs" style={{ color: "#FFD43B", }} /></div>
        <div className="review-body">
          <p className="review-body-container review-body-text" style={{ 'line-height': '150%;' }}>{props.event.reviewBody}</p>
        </div>
      </div>
      
    </>
  )
}

export default RatingCard
