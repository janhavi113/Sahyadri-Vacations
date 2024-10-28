import React from 'react'
import Google from '../../Images/google.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Rating.css';
import Ratingcard from './RatingCard'
import "react-multi-carousel/lib/styles.css";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay,  Navigation } from 'swiper/modules';
const RatingSection = () => {
 
  var reviewList = [{
    name: 'Shivani Kasar',
    Date: 'May 13, 2024',
    reviewBody: 'I recently joined "Sahyadri Vacations" for a Trek which was organised specially for women on the occasion of International Women\'s Day, and it was an absolute delight! The guides were knowledgeable, friendly and ensured everyone felt at ease. Kudos to Sahyadri Vacations - highly recommended !!!'
  },
  {
    name: 'Anjali Ahuja',
    Date: 'June 10, 2024',
    reviewBody: 'Harishchandragad and Kokankada (via Khireshwar): Being a newbie in trekking, it\'s important to know your limits. This is supposed to be a fun and enjoyable experience, not painstakingly difficult. I personally made this mistake by attempting to climb Harishchandragad (via khireshwar) despite having any previous trekking experience. But hats off to all the Sahyadri vacations team for leading us safely to and from the location. Patiently supporting and encouraging throughout the journey, LOADS of fun, new friends, new experiences! Nice food and travel management. Loved it!!'
  },
  {
    name: 'Laukik Chaure',
    Date: 'June 30, 2024',
    reviewBody: 'I went to Harihar & Harishchandragad fort along with my other 4 friends and it was an amazing experience with Sahyadri Vacations.... Specially our coordinator Pravin and Dheeraj were amazing and the best part about our trip was our batch❤... Good food definitely…It was amazing trip with Sahyadri Vacations❤❤'
  },
  {
    name: 'Samruddhi Manjre',
    Date: 'July 28, 2024',
    reviewBody: '"They give best arrangements throughout the trek as per location conditions." We enjoyed a lot while traveling and trekking to harihar fort both . Trek leaders , venkatesh sir and Shivam sir were very cooperative and entertaining ,they guided and managed this trek very well. We fully enjoyed the trek .lunch provided was perfectly arranged, local speciality food which was really good. ,For wonderful Trek experience sahyadri vacations is best and highly recommended'
  }
    ,
  {
    name: 'Pratik Kasar',
    Date: 'July 20, 2024',
    reviewBody: 'Sahyadri Vacations is the best option and team to visit Sahyadri Best Guide, Pleasant Travel, Healthy Food and Most Importantly Fun If you are tired from the week\'s work then Sunday trek will take away all the tiredness.Also, one could enjoy the pleasure of Sahyadri.\n# Shout but where is the Sahyadri vacation?\n# Top in areas'
  },
  {
    name: 'Aditya Kadam',
    Date: 'July 13, 2024',
    reviewBody: 'We had great experience with Sahyadri vacations Super awesome trek All facilities were great like travelling,  supportive guides Food provided by the Sahyadri vacations was amazing ❤️ #ThankYouSahyadriVacations Next trek soon..💯'
  },
  {
    name: 'Gargi Botaljee',
    Date: 'July 06, 2024',
    reviewBody: 'Was the best experience with every member so supportive and motivating ❤️ made wonderful memories with complete fun and enjoyment🤝 thanku so much'
  }
];
  return (
    <>
      <div className='review-container'>
        <div className='rating-header-section'>
          <div className='rating-header'>
            <img className='google' loading="lazy" src={Google} />            
          </div>
          <div className='rating-text'>
           <div className='star' ><FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} size= "sm"/>
            <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} size= "sm"/>
            <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} size= "sm"/>
            <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} size= "sm"/>
            <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} size= "sm"/>
            </div> 
          <div className="rating-review-text">
            <span>272 Reviews</span>
          </div>
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
          modules={[Autoplay, Navigation]}
          className='rating-section'
        >
          {reviewList.map((event, index) => (

            <SwiperSlide key={index}>
              <Ratingcard key={index} event={event} />
            </SwiperSlide>
          ))}

        </Swiper>
        <br/>
      </div>
    </>
  )
}

export default RatingSection
