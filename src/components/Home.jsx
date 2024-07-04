import React, { useEffect, useState } from 'react';
import Footer from "./footer";
import Navbar from "./Navbar";
import Contact_Us from "./Contact_Us/Contact_Us";
import FunFact from "./FunFact/FunFact";
import Rating from "./Rating/RatingSection";
import slide1 from './Images/Screen_2.jpg';
import slide2 from './Images/Screen_3.webp';
import slide3 from './Images/Screen_4.webp';
import slide4 from './Images/Screen_1.jpg';
import Card from "./card"
import Whatsapp from './Images/whatsapp.svg';
import ViewAll from './Images/viewAll.svg'
import Camping from './Images/camping.svg'
import upcomingEvent from './Images/upcomingEvent.svg'
import Backpacking from './Images/Backpacking.svg'
import './Gallery/Gallery.css'
import Sidebar from "./Home_Header/Sidebar"
import './home.css'
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
const Home = () => {
  const images = [
    slide1,
    slide2,
    slide3,
    slide4
  ];
 
  const [show, setShow] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [backPackingEvents, setBackPackingEvents] = useState();
  const [campingEvents, setCampingEvents] = useState();
  const [trekkingEvents, setTrekkingEvents] = useState();
  useEffect(() => {
    if (isSuccess == false) {
      getAllRecord();
    }
    
  })

  const getNextBatchDate = (event) => {
    var liveEvent = '';
    let batchdate;
    let eventCostPerPerson;
    const Q = new Date("2024-04-09");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i = 0; i < event.batches.length; i++) {
      if (new Date(event.batches[i].eventStartDate) - Q >= 0) {
        batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()];
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
      } else if(event.batches[i].everyWeekend == true){
        batchdate = 'Available On All Weekends';
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
      }else if (event.batches[i].notScheduleYet == true) {
        batchdate = 'On Public Demand';
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
      }
    }
    
    if (batchdate && eventCostPerPerson) {
      liveEvent = {
        eventId: event.eventId,
        eventname: event.eventname,
        eventType: event.eventType,
        url: event.Url,
        images: event.images,
        batchdate: batchdate,
        eventCostPerPerson: eventCostPerPerson,

      }
    }
    return liveEvent;
  }
  const getAllRecord = async () => {
    let liveEvents = [];
    let trekkingEvents = [];
    let campingEvents = [];
    let backPackingEvents = [];
    let r = await fetch(`${window.location.origin}/`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    if (res.isSuccess == true) {
      setSuccess(true);
      for (let i = 0; i < res.events.length; i++) {
        console.log('res.events[' + i + '] ---', res.events[i]);
        if (getNextBatchDate(res.events[i]) != '') {
          liveEvents.push(getNextBatchDate(res.events[i]));
        }
        if (res.events[i].eventType == 'TrekEvent') {
          trekkingEvents.push(getNextBatchDate(res.events[i]));
        } else if (res.events[i].eventType == 'CampingEvent') {
          console.log('CampingEvent++==', getNextBatchDate(res.events[i]));
          campingEvents.push(getNextBatchDate(res.events[i]));
        } else if (res.events[i].eventType == 'BackPackingTrip') {
          backPackingEvents.push(getNextBatchDate(res.events[i]));
        }
      }
      setEvent(liveEvents);
      setTrekkingEvents(trekkingEvents);
      setCampingEvents(campingEvents);
      setBackPackingEvents(backPackingEvents);
    }

  }
  const showDropdown = () => {
    setShow(!show);
  }
  return (
    <div >
      <Navbar />
     
      <div className='home' >
        <Sidebar/>
        <div className="Phone">
          <a className="btn" onClick={showDropdown} aria-expanded="false">
            <img loading="lazy" src={Whatsapp} />
          </a>
          {show &&
            <ul className="dropdown-menu show">
              <li>
                <a className="dropdown-item" href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank">
                  <i className="bi bi-whatsapp"></i>
                  WhatsApp
                </a>
              </li>
              <hr />
              <li>
                <a className="dropdown-item" href="tel:07028740961">
                  <i className="bi bi-telephone"></i>
                  Call Now
                </a>
              </li>
              <hr />
              <li>
                <a className="dropdown-item" href="mailto:sahyadrivacations21@gmail.com">
                  <i className="bi bi-telephone"></i>
                  Email
                </a>
              </li>
            </ul>}
        </div>
        <div>
          <div className='section-header px-heading'>
            <div className="col-7 row">
              <div className="col-lg-1 col-3">
                <img className='section-header-img' loading="lazy" src={upcomingEvent} />
              </div>
              <div className="col-lg-11 col-9">
                <h3 className='home-thicker home-header-text' >Upcoming Events</h3>
              </div>
            </div>
            <div className="text-end">
              <a className="btn home-header-text-viewall" href="/events" role="button" >
                <div className='section-header-btn'><span>View All</span>
                  <img style={{ 'margin': '4px' }} loading="lazy" src={ViewAll} />
                </div>
              </a>
            </div>
          </div>
        
          {/* <OwlCarousel className='owl-theme' loop margin={10} nav>
          {isSuccess && events.map((event, index) => (
              <Card key={index} event={event} />
            ))}
          </OwlCarousel>; */}
          <Swiper
            breakpoints={{
              0: {
                slidesPerView: 1.5,
              },
              400: {
                slidesPerView: 1.5,
              },
              639: {
                slidesPerView: 2,
              },
              865: {
                slidesPerView: 3
              },
              1000: {
                slidesPerView: 3
              },
              1500: {
                slidesPerView: 3
              },
              1700: {
                slidesPerView: 3
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
            {isSuccess && trekkingEvents.map((event, index) => (
              <SwiperSlide key={index}>
                <Card key={index} event={event} />
              </SwiperSlide>
            ))}

          </Swiper>

        </div>
        <div>
          <div className='section-header'>
            <div className="col-7 row">
              <div className="col-lg-1 col-3">
                <img loading="lazy" src={Camping} />
              </div>
              <div className="col-lg-11 col-9">
                <h3 className='home-thicker home-header-text ' >Camping & Resorts</h3>
              </div>
            </div>
            <div className="text-end">
              <a className="btn home-header-text-viewall" href="/events" role="button" >
                <div className='section-header-btn'><span>View All</span>
                  <img style={{ 'margin': '4px' }} loading="lazy" src={ViewAll} />
                </div>
              </a>
            </div>
          </div>
          {console.log("campingEvents---", campingEvents)}
          <Swiper
            breakpoints={{
              0: {
                slidesPerView: 1.5,
              },
              400: {
                slidesPerView: 1.5,
              },
              639: {
                slidesPerView: 2,
              },
              865: {
                slidesPerView: 2
              },
              1000: {
                slidesPerView: 3
              },
              1500: {
                slidesPerView: 3
              },
              1700: {
                slidesPerView: 3
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
            {isSuccess && campingEvents.map((event, index) => (
              <SwiperSlide key={index}>
                <Card key={index} event={event} />
              </SwiperSlide>
            ))}

          </Swiper>
        </div>
        <div>
          <div className='section-header'>
            <div className="col-7 row">
              <div className="col-lg-1 col-3">
                <img className='section-header-img' loading="lazy" src={Backpacking} />
              </div>
              <div className="col-lg-11 col-9">
                <h3 className='home-thicker home-header-backpacking ' >BackPacking Events</h3>
              </div>
            </div>
            <div className="text-end">
              <a className="btn home-header-text-viewall" href="/events" role="button" >
                <div className='section-header-btn'><span>View All</span>
                  <img style={{ 'margin': '4px' }} loading="lazy" src={ViewAll} />
                </div>
              </a>
            </div>
          </div>
          {console.log("backPackingEvents---", backPackingEvents)}
          <Swiper
            breakpoints={{
              0: {
                slidesPerView: 1.5,
              },
              400: {
                slidesPerView: 1.5,
              },
              639: {
                slidesPerView: 2,
              },
              865: {
                slidesPerView: 2
              },
              1000: {
                slidesPerView: 3
              },
              1500: {
                slidesPerView: 3
              },
              1700: {
                slidesPerView: 3
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
            {isSuccess && backPackingEvents.map((event, index) => (
              <SwiperSlide key={index}>
                <Card key={index} event={event} />
              </SwiperSlide>
            ))}

          </Swiper>
        </div>
      </div>
      <Rating />
      <div>
      <FunFact />
        <div className='section-header'>
          <div className="col-7 row">
            <div className="col-lg-1 col-3">

            </div>
            <div className="col-lg-11 col-9">
              <h3 className='home-header-text home-thicker' >Contact us</h3>
            </div>
          </div>
        </div>
        <div className='contactUsSection'>
          <Contact_Us />
        </div>        
      </div>
      <Footer />
    </div>

  );
}

export default Home
