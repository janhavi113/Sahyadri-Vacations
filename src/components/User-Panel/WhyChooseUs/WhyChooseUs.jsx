import React from 'react';
import './WhyChooseUs.css';
import expand from '../../Images/tttt.jpg';
// Import Swiper styles
import "react-multi-carousel/lib/styles.css";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay,  Navigation } from 'swiper/modules';
const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <h2>❤️ Why Choose Sahyadri Vacations? </h2>
      <div className="experience-paragraph">
        <p>
          With over 3+ years of experience in organizing unforgettable trips and treks, 
          and being part of the best-rated travel community with 400+ 5-star Google reviews, 
          Sahyadri Vacations is your trusted partner for memorable adventures.
        </p>
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
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                modules={[Autoplay, Navigation]}
                className='rating-section'
              >
        <SwiperSlide>
          <div className="feature">
            {/* <img src={expand} alt="Expert Team" /> */}
            <h3>Expert Team</h3>
            <p>Our team of professionals ensures you have the best adventure experience.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="feature">
            {/* <img src={expand} alt="Limited Batch Size" /> */}
            <h3>Limited Batch Size</h3>
            <p>We ensure personalized attention with small and manageable group sizes.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="feature">
            {/* <img src={expand} alt="Affordable Pricing" /> */}
            <h3>Affordable Pricing</h3>
            <p>Enjoy your adventure without burning a hole in your pocket.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="feature">
            {/* <img src={expand} alt="Safety First" /> */}
            <h3>Safety First</h3>
            <p>We prioritize your safety with experienced guides and proper equipment.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="feature">
            {/* <img src={expand} alt="Recommended for Solo Travelers" /> */}
            <h3>Recommended for Solo Travelers</h3>
            <p>Our trips are perfect for solo adventurers looking to connect with like-minded travelers.</p>
          </div>
        </SwiperSlide>
      </Swiper>

      <button className="cta-button">Book Your Adventure Now</button>
    </section>
  );
};

export default WhyChooseUs;
