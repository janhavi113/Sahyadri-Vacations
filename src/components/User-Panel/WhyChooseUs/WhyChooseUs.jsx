import React, { useEffect, useRef } from 'react';
import './WhyChooseUs.css';
import solo from '../../Images/whyus/solo.svg';
import safety from '../../Images/whyus/safety.svg';
import affodable from '../../Images/whyus/affodable.svg';
import batch from '../../Images/whyus/batch.svg';
import expertTeam from '../../Images/whyus/experTeam.svg';
// Import Swiper styles
import "react-multi-carousel/lib/styles.css";
// Import Swiper styles
import 'swiper/css/bundle';
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

        <div className="rating-section feature-container" ref={scrollContainer}>
          <div className="feature feature-partician">
            <img src={expertTeam} alt="Expert Team" />
            <h3>Expert Team</h3>
            <p>Our team of professionals ensures you have the best adventure experience.</p>
          </div>

          <div className="feature feature-partician">
            <img src={batch} alt="Limited Batch Size" />
            <h3>Limited Batch Size</h3>
            <p>We ensure personalized attention with small and manageable group sizes.</p>
          </div>

          <div className="feature feature-partician">
            <img className="feature-affordable" src={affodable} alt="Affordable Pricing" />
            <h3>Affordable Pricing</h3>
            <p>Enjoy your adventure without burning a hole in your pocket.</p>
          </div>
          <div className="feature feature-partician">
            <img src={safety} alt="Safety First" />
            <h3>Safety First</h3>
            <p>We prioritize your safety with experienced guides and proper equipment.</p>
          </div>

          <div className="feature">
            <img src={solo} alt="Recommended for Solo Travelers" />
            <h3>Recommended for Solo Travelers</h3>
            <p>Our trips are perfect for solo adventurers looking to connect with like-minded travelers.</p>
          </div>
        </div>

        <button className="cta-button"><a href="/events" role="button">Book Your Adventure Now</a></button>
      </div>
    </section>
  );
};

export default WhyChooseUs;
