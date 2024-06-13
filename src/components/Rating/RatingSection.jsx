import React from 'react'
import Google from '../Images/google.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Rating.css';
import Ratingcard from './RatingCard'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
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
  const onAutoplayTimeLeft = (s, time, progress) => {
    // progressCircle.current.style.setProperty('--progress', 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
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
        <Swiper
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          400:{
            slidesPerView:1,
          },
          639: {
            slidesPerView: 2,
          },
          865:{
            slidesPerView:2
          },
          1000:{
            slidesPerView:3
          },
          1500:{
            slidesPerView:3
          },
          1700:{
            slidesPerView:3
          }
        }}
          spaceBetween={50}
          slidesPerView={3}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          modules={[Autoplay, Pagination, Navigation]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className='rating-section'
        >
          {console.log('reviewList===='+reviewList)}
          {reviewList.map((event, index) => (

            <SwiperSlide key={index}>
              <Ratingcard key={index} event={event} />
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
    </>
  )
}

export default RatingSection
