import React from 'react'
import Google from '../Images/google.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Rating.css';
import Ratingcard from './RatingCard'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};
const RatingSection = () => {
  var reviewList = [{
    name: 'Shivani Kasar',
    Date: 'May 13, 2024',
    reviewBody: 'I recently joined "Sahyadri Vacations" for a Trek which was organised specially for women on the occasion of International Women\'s Day, and it was an absolute delight! The guides were knowledgeable, friendly and ensured everyone felt at ease. Kudos to Sahyadri Vacations - highly recommended !!!'
  },
  {
    name: 'Shivani Kasar1',
    Date: 'May 13, 2024',
    reviewBody: 'I recently joined "Sahyadri Vacations" for a Trek which was organised specially for women on the occasion of International Women\'s Day, and it was an absolute delight! The guides were knowledgeable, friendly and ensured everyone felt at ease. Kudos to Sahyadri Vacations - highly recommended !!!'
  }
    ,
  {
    name: 'Shivani Kasar2',
    Date: 'May 13, 2024',
    reviewBody: 'I recently joined "Sahyadri Vacations" for a Trek which was organised specially for women on the occasion of International Women\'s Day, and it was an absolute delight! The guides were knowledgeable, friendly and ensured everyone felt at ease. Kudos to Sahyadri Vacations - highly recommended !!!'
  },
  {
    name: 'Shivani Kasar3',
    Date: 'May 13, 2024',
    reviewBody: 'I recently joined "Sahyadri Vacations" for a Trek which was organised specially for women on the occasion of International Women\'s Day, and it was an absolute delight! The guides were knowledgeable, friendly and ensured everyone felt at ease. Kudos to Sahyadri Vacations - highly recommended !!!'
  }];
  return (
    <>
      <div className='review-container'>
        <div className='rating-header-section'>
          <div className='rating-header'>
            <img loading="lazy" src={Google} />
            <span className='rating-text'>5.0</span>
            <FontAwesomeIcon icon={faStar} size="xl" style={{ color: "#FFD43B", }} />
          </div>
          <div className="rating-review-text">
            <span>
              <strong>219</strong> Reviews</span>
          </div>
        </div>
        <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={5000} customTransition="all 0.5s linear 0s;"
          transitionDuration={800}>
          {reviewList.map((event, index) => (
            <Ratingcard key={index} event={event} />
          ))}
        </Carousel>;
      </div>
    </>
  )
}

export default RatingSection
