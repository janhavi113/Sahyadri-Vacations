import React, { useEffect, useRef } from 'react';
import './WhyChooseUs.css';
import solo from '../../Images/whyus/solo.svg';
import safety from '../../Images/whyus/safety.svg';
import affodable from '../../Images/whyus/affodable.svg';
import batch from '../../Images/whyus/batch.svg';
import expertTeam from '../../Images/whyus/experTeam.svg';

// Import Swiper styles
import "react-multi-carousel/lib/styles.css";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Navigation, Scrollbar } from 'swiper/modules';

const WhyChooseUs = () => {
  const scrollContainer = useRef(null);
  useEffect(() => {
    const isMobileOrTablet = window.innerWidth <= 1024; // Mobile or tablet check
    if (isMobileOrTablet && scrollContainer.current) {
      const firstFeature = scrollContainer.current.children[0];
      console.log("firstFeature----", firstFeature);
      if (firstFeature) {
        console.log("Auto-scrolling to the first feature");
        setTimeout(() => {
          firstFeature.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        }, 100); // Delay to ensure rendering
      }
    }
  }, []);
  return (
    <section className="why-choose-us">
      <div className='add-padding'>
        <h2> Why Sahyadri Vacations </h2>
        <Swiper
          breakpoints={{
            0: { slidesPerView: 1.5 },
            400: { slidesPerView: 1.5 },
            639: { slidesPerView: 3 },
            865: { slidesPerView: 3 },
            1000: { slidesPerView: 4 },
            1500: { slidesPerView: 4 },
            1700: { slidesPerView: 4 },
          }}
          spaceBetween={50}
          navigation
          scrollbar={{ draggable: true, el: '.custom-scrollbar' }} // Enable custom scrollbar
          modules={[Navigation, Scrollbar]}
          className="rating-section"
        >
          <SwiperSlide key={1}>
            <div className="feature ">
              <div>
                <img src={expertTeam} alt="Expert Team" />
                <h3>Expert Team</h3>
                <p>Our team of professionals ensures you have the best adventure experience.</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide key={2}>
            <div className="feature ">
              <div>
                <img src={batch} alt="Limited Batch Size" />
                <h3>Limited Batch Size</h3>
                <p>We ensure personalized attention with small and manageable group sizes.</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide key={3}>
            <div className="feature ">
              <div>
                <img className="feature-affordable" src={affodable} alt="Affordable Pricing" />
                <h3>Affordable Pricing</h3>
                <p>Enjoy your adventure without burning a hole in your pocket.</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide key={4}>
            <div className="feature ">
              <div>
                <img src={safety} alt="Safety First" />
                <h3>Safety First</h3>
                <p>We prioritize your safety with experienced guides and proper equipment.</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide key={5}>
            <div className="feature">
              <div>
                <img src={solo} alt="Recommended for Solo Travelers" />
                <h3>Recommended for Solo Travelers</h3>
                <p>Our trips are perfect for solo adventurers looking to connect with like-minded travelers.</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* Custom Scrollbar Below Swiper */}
        <div className="custom-scrollbar"></div>
        <button className="cta-button"><a href="/events" role="button">Book Your Adventure Now</a></button>
      </div>
    </section>
  );
};

export default WhyChooseUs;
