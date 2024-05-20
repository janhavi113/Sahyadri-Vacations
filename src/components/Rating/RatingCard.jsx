import React from 'react'
import './Rating.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCircleCheck, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
const RatingCard = (props) => {
 
  return (
    <>
      <div className="rating-card card">
        <div className='verified-icon'>
          <FontAwesomeIcon icon={faCircleCheck} size="lg" style={{ color: "#028322", }} />
        </div>
        <div className="review-profile-header">
          <img className="muiCardMedia-img" src="https://recensioni-io-static-folder.s3.eu-central-1.amazonaws.com/public_onlinereviews/images/no_image.png?bustcache=1715847086631" alt="profile picture" crossOrigin="anonymous" />
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
