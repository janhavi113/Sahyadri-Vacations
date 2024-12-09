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
 
  var reviewList = [
    {
      name: 'Durva Shinde ',
      Date: 'November 24, 2024',
      reviewBody: 'I had great experience with Sahyadri Vacations. They were very friendly and provided best services which includes comfortable traveling, good food, comfortable stay. You should travel with them if you want to experience something different from your regular boring life. Do visit guys and have fun❤️'
    },
  {
    name: 'Shrikant Gawande',
    Date: 'November 06, 2024',
    reviewBody: 'Best experience with Sahyadri Vacations ! We travel in Gokarna -Murudeshwar - Honnavar trip. Best Management, Very Cooperative, Informative, Talente d, Experience and friendly leaders.\n\nOverall best trip to remember!!'
  },
  {
    name: 'Suleman Mulani',
    Date: 'August 4, 2024',
    reviewBody: 'I did the Adrai Jungle Trek with Sahyadri Vacation and Adventure on August 4, 2024, and it was amazing! The trek was well-organized, with knowledgeable and friendly guides. The views were stunning, and the jungle was serene and beautiful. Safety was a top priority, which made the experience worry-free. Highly recommend Sahyadri Vacation and Adventure for anyone looking for an unforgettable trek in the Sahyadri.'
  },
  {
    name: 'Samruddhi Manjre',
    Date: 'July 28, 2024',
    reviewBody: '"They give best arrangements throughout the trek as per location conditions." We enjoyed a lot while traveling and trekking to harihar fort both . Trek leaders , venkatesh sir and Shivam sir were very cooperative and entertaining ,they guided and managed this trek very well. We fully enjoyed the trek .lunch provided was perfectly arranged, local speciality food which was really good. ,For wonderful Trek experience sahyadri vacations is best and highly recommended'
  } ,
  {
    name: 'Pratik Kasar',
    Date: 'July 20, 2024',
    reviewBody: 'Sahyadri Vacations is the best option and team to visit Sahyadri Best Guide, Pleasant Travel, Healthy Food and Most Importantly Fun If you are tired from the week\'s work then Sunday trek will take away all the tiredness.Also, one could enjoy the pleasure of Sahyadri.\n# Shout but where is the Sahyadri vacation?\n# Top in areas'
  },
  {
    name: 'Shruti Jadhav',
    Date: 'July 13, 2024',
    reviewBody: 'I recently joined a trekking expedition with Sahyadri vacations, and it was an unforgettable experience! The guides were knowledgeable and attentive, ensuring everyone\'s safety and enjoyment throughout the journey. The trail was well-chosen, offering stunning views and a perfect mix of challenge and beauty. Food was good, making the entire trip comfortable and enjoyable. I highly recommend Sahyadri vacations for anyone looking to explore the outdoors with a professional and friendly team. Will surely like to join them for upcoming treks.'
  },
  {
    name: 'Gargi Botaljee',
    Date: 'July 06, 2024',
    reviewBody: 'Was the best experience with every member so supportive and motivating ❤️ made wonderful memories with complete fun and enjoyment🤝 thanku so much'
  }
  ,
  {
    name: 'Ankita Walunj',
    Date: 'June 10, 2024',
    reviewBody: 'What an amazing trek it was ! Bang on…! 🥳 It was so adventurous. 🤯 Our guides have guided us so well and took us to difficult points which was superb experience. 🤘🏻🫡 It was an amazing trek with wonderful memories. Being a female traveller i did not encounter any problem or any hassle. Even the food was sooo delicious.Looking forward for upcoming treks . Definitely, I am gonna recommend this group to my friends n family. Thanks guys…! 🤗'
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
  }
   ,
  {
    name: 'Shivani Kasar',
    Date: 'May 13, 2024',
    reviewBody: 'I recently joined "Sahyadri Vacations" for a Trek which was organised specially for women on the occasion of International Women\'s Day, and it was an absolute delight! The guides were knowledgeable, friendly and ensured everyone felt at ease. Kudos to Sahyadri Vacations - highly recommended !!!'
  },
  {
    name: 'Priti Nikam',
    Date: 'January 17, 2024',
    reviewBody: 'My name is Priti Nikam. This was my second trek with Sahyadri Vacation & Adventures. The team leaders were extremely cooperative and supportive, and the arrangements made by the whole team were very comfortable. The information about the fort and the surrounding forts was perfectly explained.Thank you so much, Sahyadri Vacation & Adventures, for giving us such an amazing experience. I look forward to doing further treks with your team.जय भवानी जय शिवराय जय शंभुराजे🚩🧡'
  },
  {
    name: 'Tejashree Khedkar ',
    Date: 'December 24, 2023',
    reviewBody: 'It\'s been almost 2 yrs now I\'m trekking frequently with Sahyadri Vacations.💫 Every trek was wonderfully coordinated by the team- from transportation, food, trek schedule -everything was seamless, which have always made the experience enjoyable. The trek leaders always make sure to educate everyone about our history and significance of the place we are visiting. I have always felt safe throughout every trek. The personalized attention each participant receives on trek is very commendable- trek leaders always carefully consider trekking experience of every participant and guide accordingly to make each and everyone\'s trek memorable. Cheers to the wonderful team 👏🏻🎉😁. Always looking forward to many more wonderful experiences with Sahyadri Vacations family ❣️'
  },
  {
    name: 'Prasanna Kalyan ',
    Date: 'August 23, 2023',
    reviewBody: 'Sahyadri team was highly professional, ensuring both safety & enjoyment throughout the journey. The guides were knowledgeable, friendly and enjoyed every moment and am already looking to my next adventure with you all. Thank you for an amazing experience 😊'
  },
  {
    name: 'Ankit Dere ',
    Date: 'July 23, 2023',
    reviewBody: 'I recently had the pleasure of embarking on the Andharban Jungle Trek with Sahyadri Vacations. It was my fourth trekking experience with them. Trekking through the dense forest was a truly memorable adventure. Sahyadri Vacations\' organization was impeccable from start to finish. Our trek leaders, Venkatesh, Janhavi, Sairaj, and Shivam, were outstanding. They ensured everything ran smoothly while keeping the group motivated and well-informed. The trek itself was a challenging yet exhilarating journey, requiring over six hours of walking through lush jungle terrain. The guides were incredibly knowledgeable, sharing fascinating insights about the flora and fauna, adding a rich educational aspect to the experience.Overall, I am excited to join them for more treks in the future. If you\'re looking for a well-organized trek with knowledgeable guides, I highly recommend Sahyadri Vacations!'
  },
  {
    name: 'Vijay Tamhankar',
    Date: 'October 03, 2022',
    reviewBody: 'Where Sahyadri Vacations and team shines is in their total dedication to providing clients with an exceptional hiking experience. While you are in-trek, their choices of accommodations, dining, transportation, local experts, hike options, add-ons, and even unexpected small surprises, provides one with a truly cut-to-fit experience. Pravin Sir possess top-shelf communications skills. It’s clear they care about their clients and want you to feel confident in travelling with them.You have best to best and caring team because they have behind Praveen Sir....Best and lovingly warm regards from Vijay and Harshada'
  },
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
            <span>375+ Reviews</span>
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
