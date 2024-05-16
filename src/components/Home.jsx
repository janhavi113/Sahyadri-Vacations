import React, { useEffect, useState } from 'react';
import Footer from "./footer";
import Navbar from "./Navbar";
import Contact_Us from "./Contact_Us/Contact_Us";
import slide1 from './Images/Screen_2.jpg';
import slide2 from './Images/Screen_3.webp';
import slide3 from './Images/Screen_4.webp';
import slide4 from './Images/Screen_1.jpg';
import Card from "./card"
import Whatsapp from './Images/whatsapp.svg';
import ViewAll from './Images/viewAll.svg'
import upcomingEvent from './Images/upcomingEvent.svg'
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import './home.css'
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
const Home = () => {
  const images = [
    slide1,
    slide2,
    slide3,
    slide4
  ];
  var settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 7,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 3000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1636,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 4
        }
      },
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        }
      },
      {
        breakpoint: 678,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1.5,
          initialSlide: 1,
          arrows: false
        },
      },
      {
        breakpoint: 464,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        },

      }
    ]
  };
  const [backgroundImage, setBackgroundImage] = useState(images[1]);
  const [show, setShow] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  useEffect(() => {
    let currentIndex = 0;
    const chageBackgroundImage = () => {
      currentIndex = (currentIndex + 1) % images.length;
      setBackgroundImage(images[currentIndex])
    }

    const interval = setInterval(chageBackgroundImage, 5000)
    if (isSuccess == false) {
      getAllRecord();
    }
    return () => {
      clearInterval(interval)
    }
  })
  function searchEvent(data) {


  }
  const getNextBatchDate = (event) => {
    //console.log('event',event);
    var liveEvent = '';
    let batchdate;
    let eventCostPerPerson;
    const Q = new Date("2024-04-09");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i = 0; i < event.batches.length; i++) {
      if (new Date(event.batches[i].eventStartDate) - Q >= 0) {
        batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()];
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
      }
    }
    if (batchdate && eventCostPerPerson) {
      liveEvent = {
        eventId: event.eventId,
        eventname: event.eventname,
        images: event.images,
        batchdate: batchdate,
        eventCostPerPerson: eventCostPerPerson
      }
    }
    return liveEvent;
  }
  const getAllRecord = async () => {

    // alert("ok"); 
    let liveEvents = [];
    let r = await fetch(`http://localhost:3000/`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    console.log('res +==', JSON.stringify(res));
    if (res.isSuccess == true) {
      setSuccess(true);
      for (let i = 0; i < res.events.length; i++) {
        if (getNextBatchDate(res.events[i]) != '') {
          liveEvents.push(getNextBatchDate(res.events[i]));
        }
      }
      setEvent(liveEvents);
    }

  }
  const showDropdown = () => {
    setShow(!show);
  }
  return (
    <div >
      <Navbar />
      <div className='home' >
        <img className='slide-image' src={backgroundImage}></img>
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
          <div className='section-header'>
            <img className='section-header-img' loading="lazy" src={upcomingEvent} />
            <h1 className='thicker' >Upcoming Weekend Events</h1>
            <div className="col-6 text-end">
              <a className="btn home-header-text-viewall" role="button" >
                <div className='section-header-btn'><span>View All</span>
                <img  style={{'margin': '4px'}} loading="lazy" src={ViewAll} />
                </div>
              </a>
            </div>
          </div>
          {console.log("events---", events)}
          <Carousel responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={5000} customTransition="all .5"
            transitionDuration={500}>
            {isSuccess && events.map((event, index) => (
              <Card key={index} event={event} />
            ))}
          </Carousel>;
        </div>
      </div>
      <div className="container-bottom contact-Section">
          <h2 className='thicker'>CONTACT US</h2>
          </div>
      <Contact_Us/>
      <Footer />
    </div>

  );
}

export default Home
