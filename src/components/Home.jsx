import React, { useEffect, useState } from 'react';
import Footer from "./footer";
import Navbar from "./Navbar";
import Contact_Us from "./User-Panel/Contact_Us/Contact_Us";
import FunFact from "./User-Panel/FunFact/FunFact";
import WhyChooseUs from "./User-Panel/WhyChooseUs/WhyChooseUs";
import Rating from "./User-Panel/Rating/RatingSection";
import Card from "./card"
import Whatsapp from './Images/whatsapp.svg';
import ViewAll from './Images/viewAll.svg'
import Camping from './Images/camping.svg'
import upcomingEvent from './Images/upcomingEvent.svg'
import Backpacking from './Images/Backpacking.svg'
import './User-Panel/Gallery/Gallery.css'
import Sidebar from "./Home_Header/Sidebar"
import './home.css'

// Import Swiper styles
import "react-multi-carousel/lib/styles.css";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [show, setShow] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [backPackingEvents, setBackPackingEvents] = useState();
  const [campingEvents, setCampingEvents] = useState();
  const [trekkingEvents, setTrekkingEvents] = useState();
  const [specialOffer, setSpecialOffer] = useState();
  useEffect(() => {
    if (isSuccess == false) {
      getAllRecord();
      getSpecialOfferEvent();
    }

  })

  const getSpecialOfferEvent = async () => {
    //console.log('record found');
    let r = await fetch(`${apiUrl}getSpecialOfferEvent`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })

    let res = await r.json()
    if (r.ok) {
      setSpecialOffer(res.offer);
      //console.log('record found',res.offer);
    }
  }

  const getNextBatchDate = (event) => {
    var liveEvent = '';
    let batchdate;
    let sortdate;
    let eventCostPerPerson;
    const Q = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (event.batches) {
      for (let i = 0; i < event.batches.length; i++) {
        if (new Date(event.batches[i].eventStartDate) - Q >= 0) {
          batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + months[new Date(event.batches[i].eventEndDate).getFullYear()];
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          sortdate = new Date(event.batches[i].eventStartDate);

        } else if (event.batches[i].everyWeekend == true) {
          batchdate = 'Available On All Weekends';
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          sortdate = 'Available On All Weekends';
        } else if (event.batches[i].notScheduleYet == true) {
          batchdate = 'On Public Demand';
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          sortdate = 'On Public Demand';
        }
      }
    } else {
      if (new Date(event.eventStartDate) - Q >= 0) {
        batchdate = new Date(event.eventStartDate).getDate() + ' ' + months[new Date(event.eventStartDate).getMonth()] + ' - ' + new Date(event.eventEndDate).getDate() + ' ' + months[new Date(event.eventEndDate).getMonth()] + ' ' + new Date(event.eventEndDate).getFullYear();
        eventCostPerPerson = event.eventCostPerPerson;
        sortdate = new Date(event.eventStartDate);

      } else if (event.everyWeekend == true) {
        batchdate = 'Available On All Weekends';
        eventCostPerPerson = event.eventCostPerPerson;
        sortdate = 'Available On All Weekends';
      } else if (event.notScheduleYet == true) {
        batchdate = 'On Public Demand';
        eventCostPerPerson = event.eventCostPerPerson;
        sortdate = 'On Public Demand';
      }
    }

    var base_url = window.location.origin;
    if (batchdate && eventCostPerPerson) {
      liveEvent = {
        eventId: event.eventId,
        eventname: event.eventname,
        eventType: event.eventType,
        url: event.Url,
        images: `${apiUrl}` + event.images,
        batchdate: batchdate,
        eventCostPerPerson: eventCostPerPerson,
        sortDate: sortdate,
        inactive: false,
        sort: event.sort,
      }
    } else if (batchdate == undefined && eventCostPerPerson == undefined) {
      liveEvent = {
        eventId: event.eventId,
        inactive: true,
      }
    }
    return liveEvent;
  }

  const getAllRecord = async () => {
    ////console.log('getAllRecord--');
    let liveEvents = [];
    let trekkingEvents = [];
    let campingEvents = [];
    let backPackingEvents = [];
    let inactivateEvent = [];
    ////console.log('show-all-events');
    // //console.log(`${apiUrl}show-all-events`);
    let r = await fetch(`${apiUrl}show-all-events`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })

    let res = await r.json()
    //console.log('res',res);
    if (res.isSuccess == true) {
      setSuccess(true);
      for (let i = 0; i < res.events.length; i++) {
        let tempEvent = [];

        tempEvent = getNextBatchDate(res.events[i]);
        if (!tempEvent.inactive && tempEvent != '' && tempEvent.batchdate != 'On Public Demand' && res.events[i].eventType != 'CampingEvent') {
          liveEvents.push(getNextBatchDate(res.events[i]));
        }

        if (!tempEvent.inactive && (res.events[i].eventType == 'TrekEvent' || res.events[i].eventType == 'AdventureActivity')) {
          console.log('tempEvent----', tempEvent);
          trekkingEvents.push(tempEvent);
        } else if (!tempEvent.inactive && res.events[i].eventType == 'CampingEvent') {
          campingEvents.push(tempEvent);
        } else if (!tempEvent.inactive && res.events[i].eventType == 'BackPackingTrip') {
          backPackingEvents.push(tempEvent);
        }
      }
      liveEvents.sort((a, b) => a.sort - b.sort);
      setEvent(liveEvents);
      trekkingEvents.sort((a, b) => a.sort - b.sort);
      console.log('trekkingEvents----', trekkingEvents);
      setTrekkingEvents(trekkingEvents);
      setCampingEvents(sortEventsBySortDate(campingEvents));
      setBackPackingEvents(sortEventsBySortDate(backPackingEvents));
    }

  }

  const sortEventsBySortDate = (events) => {
    return events.sort((a, b) => {
      // Check if sortDate is 'Available On All Weekends' or 'On Public Demand'
      const isWeekendOrDemand = (date) => date === 'Available On All Weekends' || date === 'On Public Demand';

      if (isWeekendOrDemand(a.sortDate) && !isWeekendOrDemand(b.sortDate)) return 1;
      if (!isWeekendOrDemand(a.sortDate) && isWeekendOrDemand(b.sortDate)) return -1;
      if (isWeekendOrDemand(a.sortDate) && isWeekendOrDemand(b.sortDate)) return 0;

      // Sort by actual date for valid dates
      const dateA = new Date(a.sortDate);
      const dateB = new Date(b.sortDate);

      return dateA - dateB;
    });
  };

  const showDropdown = () => {
    setShow(!show);
  }
  
  return (
    <div >
      <Navbar />

      <div className='home' >
        <Sidebar />
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
                <a className="dropdown-item" href="mailto:contactus@sahyadrivacations.com">
                  <i className="bi bi-telephone"></i>
                  Email
                </a>
              </li>
            </ul>}
        </div>
        {/* Upcoming Event */}
        <div>
          <div className="section-header px-heading">
            <div className="col-7 row">
              <div className="col-lg-1 col-3">
                <img
                  className="section-header-img"
                  loading="lazy"
                  src={upcomingEvent}
                  alt="Upcoming Events Icon"
                />
              </div>
              <div className="col-lg-11 col-9">
                <h3 className="home-thicker home-header-text">Upcoming Events</h3>
              </div>
            </div>
            <div className="text-end">
              <a
                className="btn home-header-text-viewall"
                href="/events"
                role="button"
              >
                <div className="section-header-btn">
                  <span>View All</span>
                  <img
                    style={{ margin: '4px' }}
                    loading="lazy"
                    src={ViewAll}
                    alt="View All"
                  />
                </div>
              </a>
            </div>
          </div>
          {isSuccess && (
            <Swiper
              breakpoints={{
                0: { slidesPerView: 1.5 },
                400: { slidesPerView: 1.5 },
                639: { slidesPerView: 2 },
                865: { slidesPerView: 2 },
                1000: { slidesPerView: 3 },
                1500: { slidesPerView: 3 },
                1700: { slidesPerView: 3 },
              }}
              spaceBetween={50}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              modules={[Autoplay, Navigation]}
              className="rating-section"
            >
              {events.map((event, index) => (
                <SwiperSlide key={index}>
                  <Card key={index} event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        {/* Trek Event */}
        <div>
          <div className="section-header px-heading">
            <div className="col-7 row">
              <div className="col-lg-1 col-3">
                <img
                  className="section-header-img"
                  loading="lazy"
                  src={upcomingEvent}
                  alt="Trek Events Icon"
                />
              </div>
              <div className="col-lg-11 col-9">
                <h3 className="home-thicker home-header-text">Trek Events</h3>
              </div>
            </div>
            <div className="text-end">
              <a
                className="btn home-header-text-viewall"
                href="/treking-events"
                role="button"
              >
                <div className="section-header-btn">
                  <span>View All</span>
                  <img
                    style={{ margin: '4px' }}
                    loading="lazy"
                    src={ViewAll}
                    alt="View All"
                  />
                </div>
              </a>
            </div>
          </div>
          {isSuccess && (
            <Swiper
              breakpoints={{
                0: { slidesPerView: 1.5 },
                400: { slidesPerView: 1.5 },
                639: { slidesPerView: 2 },
                865: { slidesPerView: 2 },
                1000: { slidesPerView: 3 },
                1500: { slidesPerView: 3 },
                1700: { slidesPerView: 3 },
              }}
              spaceBetween={50}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              modules={[Autoplay, Navigation]}
              className="rating-section"
            >
              {trekkingEvents.map((event, index) => (
                <SwiperSlide key={index}>
                  <Card key={index} event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        {/* BackPacking Event */}
        <div>
          <div className="section-header">
            <div className="col-7 row">
              <div className="col-lg-1 col-3">
                <img
                  className="section-header-img"
                  loading="lazy"
                  src={Backpacking}
                  alt="Backpacking Events Icon"
                />
              </div>
              <div className="col-lg-11 col-9">
                <h3 className="home-thicker home-header-backpacking">
                  Backpacking Events
                </h3>
              </div>
            </div>
            <div className="text-end">
              <a
                className="btn home-header-text-viewall"
                href="/backpacking-events"
                role="button"
              >
                <div className="section-header-btn">
                  <span>View All</span>
                  <img
                    style={{ margin: '4px' }}
                    loading="lazy"
                    src={ViewAll}
                    alt="View All"
                  />
                </div>
              </a>
            </div>
          </div>
          {isSuccess && (
            <Swiper
              breakpoints={{
                0: { slidesPerView: 1.5 },
                400: { slidesPerView: 1.5 },
                639: { slidesPerView: 2 },
                865: { slidesPerView: 2 },
                1000: { slidesPerView: 3 },
                1500: { slidesPerView: 3 },
                1700: { slidesPerView: 3 },
              }}
              spaceBetween={50}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              modules={[Autoplay, Navigation]}
              className="rating-section"
            >
              {backPackingEvents.map((event, index) => (
                <SwiperSlide key={index}>
                  <Card key={index} event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        {/* Camping Event */}
        <div>
          <div className="section-header">
            <div className="col-7 row">
              <div className="col-lg-1 col-3">
                <img
                  className="section-header-img"
                  loading="lazy"
                  src={Camping}
                  alt="Camping & Resorts Icon"
                />
              </div>
              <div className="col-lg-11 col-9">
                <h3 className="home-thicker home-header-text">
                  Camping & Resorts
                </h3>
              </div>
            </div>
            <div className="text-end">
              <a
                className="btn home-header-text-viewall"
                href="/camping-events"
                role="button"
              >
                <div className="section-header-btn">
                  <span>View All</span>
                  <img
                    style={{ margin: '4px' }}
                    loading="lazy"
                    src={ViewAll}
                    alt="View All"
                  />
                </div>
              </a>
            </div>
          </div>
          {isSuccess && (
            <Swiper
              breakpoints={{
                0: { slidesPerView: 1.5 },
                400: { slidesPerView: 1.5 },
                639: { slidesPerView: 2 },
                865: { slidesPerView: 2 },
                1000: { slidesPerView: 3 },
                1500: { slidesPerView: 3 },
                1700: { slidesPerView: 3 },
              }}
              spaceBetween={50}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              modules={[Autoplay, Navigation]}
              className="rating-section"
            >
              {campingEvents.map((event, index) => (
                <SwiperSlide key={index}>
                  <Card key={index} event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      {/* {specialOffer && 
      <SpecialOfferSection  specialOffer={specialOffer} /> 
      }
       <WhyChooseUs />
      */}
     
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
