import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useForm } from "react-hook-form"
import './ShowEventDetails.css'
import Footer from "../footer";
import Ratingcard from '../Rating/RatingCard'
import { motion } from "framer-motion"
import ContactSection from "../ContactLogo/contactSection";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCirclePlus, faCircleMinus, faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from "react-bootstrap";
import "../CreateEvents.css"
import "../Modal.css";
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import DatePicker from "react-datepicker";
import {addDays ,isWeekend } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
const ShowEventDetails = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationsArray ,setLocationsArray] = useState();
  const queryParameters = new URLSearchParams(window.location.search);
  const [type, setType] = useState(queryParameters.get("eventid"));
  const [startDate, setStartDate] = useState(new Date());
  const [params, setParams] = useState(type.split('/'));
  const [isSuccess, setSuccess] = useState(false);
  const [inquery, setInquery] = useState(false);
  const [everyWeekend, setEveryWeekend] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const[pickupPoints , setPickupPoints] = useState([]);
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [scheduleBatch, setScheduleBatch] = useState();
  const [availableBatches, setAvailableBatches] = useState();
  const [price, setPrice] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate , setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isBookingConfirmed, setBookingConfirmed] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  }
  const isWeekendDay = (date) =>{
    return isWeekend(date);
  }
  const filterWeekends = (date) =>{
    return isWeekendDay(date);
  }
  const toggleModal = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };
  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    const formData = new FormData();
      formData.append('name', 'janhai');
    
    data.numberOfPeoples = noOfTrekkers;
    data.amountPaid = finalPrice;
    data.eventId = eventDetails.eventId;
    data.eventName = eventDetails.name;
    data.batch = selectedDate;
    data.pickupLocation = selectedLocation;
   // console.log('---data---'+data);
   
    let r = await fetch(`${apiUrl}booking`, {
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(data)
    })
    let res = await r.json()
   // console.log('res', JSON.stringify(res));
   if (res.isSuccess == true) {
    setBookingConfirmed(true);
  }
  }

  const handleSelection = (event) => {
    setSelectedLocation(event.target.value);
  };

  const increaseCount = async () => {
    if (availableSlot > noOfTrekkers) {
      let count = noOfTrekkers;
      let price1 = price;
      count++;
      setNoOfTrekkers(count);
      setFinalPrice(price1 * count);
    }
  }
  
  const decreaseCount = async () => {
    if (noOfTrekkers > 0) {
      let count = noOfTrekkers;
      let price1 = price;
      count--;
      setNoOfTrekkers(count);
      setFinalPrice(price1 * count);
    }
  }

  const onAutoplayTimeLeft = (s, time, progress) => {
    // progressCircle.current.style.setProperty('--progress', 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const displayList = (data) => {
    var splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
    splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
    splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
    splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
    return splitedList;
  }

  const getNextBatchDate = (event) => {
    //console.log('event--', event);
    let batchdate;
    let batchSize = -1;
    let eventCostPerPerson;
    let batchDates = [];
    let eventType = event.eventType;
    const Q = new Date("2024-04-09");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let i = 0; i < event.batches.length; i++) {
     console.log('event.batches[' + i + ']--' ,  event.batches[i]);
      if (batchSize == -1 && new Date(event.batches[i].eventStartDate) - Q >= 0 && event.batches[i].eventBatchCount > 0) {
        batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear();
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
      }else if(event.batches[i].everyWeekend == true){
        batchdate ='Available On All Weekends';
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
        setEveryWeekend(true);
      }
      else if(event.batches[i].notScheduleYet == true){
        batchdate ='On Demand';
        setInquery(false);
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
      }
      if(event.batches[i].everyWeekend == false && event.batches[i].notScheduleYet == false){
       batchDates.push(new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear());
       }else if(event.batches[i].notScheduleYet == true){
        batchDates.push('On Demand');
       }else if(event.batches[i].everyWeekend == true){
        batchDates.push('Available On All Weekends');
       }
  }
   // console.log('batchDates --- ' + batchDates);
    if (batchdate && eventCostPerPerson) {
      setAvailableBatches(batchDates);
      setPrice(eventCostPerPerson);
      setBatchDate(batchdate);
      setAvailableSlot(batchSize);
      setFinalPrice(eventCostPerPerson);
    }
  }

  useEffect(() => {
    if (isSuccess == false && type && params) {
      getAllRecord();
    }
  })

  function convertHtmlToJSON(htmlString) {
    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
  
    // Select all the <li> elements from the temporary DOM
    const listItems = tempDiv.querySelectorAll('li');
    const locations = [];
  
    listItems.forEach((item, index) => {
      // Extract the text content, which is in the form "Location : Time"
      const [name, time] = item.textContent.split(' : ');
  
      // Create the object for each location and push it into the array
      locations.push({
        id: index + 1,
        name: name.trim(),
        time: time.trim()
      });
    });
  
    return locations;
  }
  
  const getAllRecord = async () => {
    let r = await fetch(`${apiUrl}event-details/eventid/${params[0]}/${params[1]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    // console.log( 'res ',res);
    if (res.isSuccess == true) {
      setSuccess(true);
      console.log('eventDetails --', );
     // 
      setEventDetails(res.events);
      if(res.events.pickupPoints != null && res.events.pickupPoints != 'undefine'){
      const jsonData = convertHtmlToJSON(res.events.pickupPoints);
      setPickupPoints(jsonData);
      }
      setScheduleBatch(res.ScheduleBatchesRecords);
      getNextBatchDate(res.ScheduleBatchesRecords);

      //// console.log('scheduleBatch',scheduleBatch );
    }

  }
 
  return (
    <div>
      <Navbar />
      <div>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}

          modules={[Autoplay, Pagination, Navigation]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
        >
          {isSuccess && eventDetails.images.map((event, index) => (

            <SwiperSlide key={index}><img className='event-section-header-img' loading="lazy" src={`${apiUrl}`+event} />
              <div className="inner-content">
                <h3>{eventDetails.name}</h3>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
      {isSuccess &&
        <div>
          <div className="content-row row2">
            <div>
              <nav id="navbar-example2" className="nav-color d-none d-md-none d-lg-block panel-heading tab-bg-info px-2 ">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading1"> DETAILS </a>
                  </li>
                  <li >
                    <a className="nav-link" href="#scrollspyHeading2"> SHEDULE </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading3"> HIGHLIGHTS </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading4"> COST INCLUDES </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#scrollspyHeading6"> PICKUP POINTS </a>
                  </li>
                </ul>
              </nav>
              <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example  p-3 rounded-2" tabindex="0">
                <div id="scrollspyHeading1" className='pt-4 pb-1 px-2'>
                  <h2 className="h3"> Details</h2>
                  <p>{eventDetails.eventDetails}</p>
                  <br />
                  <div className='flex'> <FontAwesomeIcon icon={faCalendarDays} size="lg" /> <h3> Upcoming Batches </h3> </div>
                  <div className='section-details'>
                    {availableBatches && availableBatches.map((event, index) => (
                      <div key={index}><b>Batch {index + 1} :</b> {event}</div>
                    ))}
                  </div>
                  <div className='flex'> <FontAwesomeIcon icon={faLocationDot} size="lg" /> <h3> Location </h3> </div>
                  <div className='section-details'>
                    <p>{eventDetails.location}</p>
                  </div>
                </div>
                <hr />
                <div id="scrollspyHeading2" className='pt-4 pb-1 px-2'>
                  <h2 className="h3"> Schedule</h2>
                  <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.itinerary) }} />
                </div>
                <hr />
                <div id="scrollspyHeading3" className='pt-4 pb-1 px-2'>
                  <h2 className="h3"> Highlights</h2>
                  <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.highlights) }} />
                </div>
                <hr />
                <div id="scrollspyHeading4" className='pt-4 pb-1 px-2'>
                  <h2 className="h3"> Cost Includes</h2>
                  <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.costIncludes) }} />
                </div>
                <hr />
                <div id="scrollspyHeading5" className='pt-4 pb-1 px-2'>
                  <h2 className="h3"> Things To Carry</h2>
                  <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.thingsToCarry) }} />
                </div>
                <hr />
                <div id="scrollspyHeading6" className='pt-4 pb-1 px-2'>
                  <h2 className="h3"> Pickup Points</h2>
                  <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.pickupPoints) }} />
                </div>

                <div id="" className='pt-4 pb-1 px-2'>
                  <h2 className="h3"> FAQ's</h2>
                  <div className="section-details">
                    <ol className="display-bulletin">
                      <li>
                        <b>How many trek leaders will be available?</b><br />
                        There will be 1 trek leader available for a group of 8 people in each trek.<br />
                      </li>
                      <li>
                        <b>How do I get in touch with trek leaders and trek groups ?</b><br />
                        We add participants in our Whatsapp group one day prior to the event.<br />
                      </li>
                      <li>
                        <b>Can I cancel my booking?</b><br />
                        You can check our cancel policy for the same.Or you can join us on the next trek (please inform us before 2 days)<br />
                      </li>
                      <li>
                        <b>What is prohibited in this trek?</b><br />
                        Smoking, Drinking and loud music is prohibited.<br />
                      </li>
                      <li>
                        <b>Are changing rooms provided?</b><br />
                        Yes, separate (Male/Female) changing rooms are provided. <br />
                      </li>
                      <li>
                        <b> What is the type of bus ?</b><br />
                        The bus is NON/AC Tempo Traveler with decent seating comfort.<br />
                      </li>
                      <li>
                        <b>Are washrooms available on the trek?</b><br />
                        Washrooms are available at the base village only. No facility is available during the trek.<br />
                      </li>
                      <li>
                        <b>Is this trek safe for girls?</b><br />
                        This trek is completely safe for girls. We have girl volunteers specially appointed for girls. And have separate changing rooms.<br />
                      </li>
                      <li>
                        <b>Pick up points?</b><br />
                        Pick up is available if your location comes in between our route for this you have to contact us before.<br />
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-right-side col-sm-12 col-md-4  col-lg-4 col-xl-4 ">
              <div className="container sticky-top" >
                <div className="justify-content-md-center">
                  <div className="col-lg-12 d-none d-md-none d-lg-block">
                    <div className="booking-card mb-3 " >
                      <div className="card-body text-dark">
                        <h4 className="card-title"><center>
                          <b className='event-price'>₹{price} /- </b>
                          <sub >Per Person</sub>
                        </center>
                        </h4>
                        {!inquery && <> <div>
                          <center> {batchDate} </center></div>
                          
                           <div className="button-margin button">
                          <input onClick={handleShow} type="submit" value="BOOK NOW" />
                           {/*<button  type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button> */}
                        </div></>}
                        {inquery && 
                        <div className="button-margin button">
                         <button  type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>
                         </div>
                      }
                        <br />
                        <div className='card-info'><FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Best Price Guaranteed <br /> <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Secure & Easy Booking
                          <br />
                          <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> 8000+ Happy Customers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-sm-block d-md-none d-lg-none fixed-bottom">
            <div className="booking-card-mb mb-0 " style={{ "width": "100%;" }}>
              <div className="card-body text-dark">
                <div className="booking-section d-flex justify-content-between align-items-center">
                  <h4 className="card-title"><center>
                    <b className='event-price'>₹{price} /- </b>
                    <sub >Per Person</sub>
                  </center>
                  </h4>
                  <div>
                    <center> {batchDate} </center>
                  </div>
                </div>
                <div className="button-edit-container">
                  <div className="button button-margin ">
                  {!inquery &&
                  <input className="button-input" disabled={isSubmitting} type="submit" onClick={handleShow} value="BOOK NOW" />
                   /* <button  type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button> */
                  }
                  {inquery &&                      
                         <button  type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>                        
                      }
                  <button  type="button"><a href="tel:07028740961"> <strong>&nbsp;CALL NOW </strong></a> </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {isSuccess &&
        <Modal show={show} onHide={handleClose}>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="container">
              <Modal.Header closeButton>
                <div className="title-header">BOOKING SUMMERY<br />
                  <div className='booking-header'>
                    {eventDetails.name}
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <div className="content">
                  {isSubmitting && <div>Loading...</div>}
                  <div className="user-details">
                    <div className="input-box ">
                      <span className="details">Full Name</span>
                      <input {...register("fullName", { required: { value: true, message: "This field is required" }, })} type="text" required />
                    </div>
                    <div className="input-box ">
                      <span className="details">Email ID</span>
                      <input  {...register("emailId", { required: { value: true, message: "This field is required" }, })} type="email" required />
                    </div>
                    <div className="input-box">
                      <span className="details">WhatsApp Mobile Number</span>
                      <input placeholder='+91'{...register("whatsappNumber", { required: { value: true, message: "This field is required" }, })} type="tel" required />
                    </div>
                    { !everyWeekend && <div className="input-box">
                      <span className="details">Select Batch</span>
                      <select  {...register("selectDate", { required: { value: true, message: "This field is required" }, })} required>
                        {availableBatches && availableBatches.map((event, index) => (
                          <option key={index} value={event} >{event}</option>
                        ))}
                      </select>
                     </div>}
                    { everyWeekend && <div className="input-box">
                      <span className="details">Select Batch</span>
                      <DatePicker placeholder="Select Date" selected={selectedDate} filterDate={filterWeekends} onChange={handleDateChange}  />
                    </div> }

                    <div>
                    <h3>Select a Location:</h3>
                    <ul>
                      {pickupPoints.map((location) => (
                        <li key={location.id}>
                          <label className='radio-display'>
                            <input
                              type="radio"
                              name="location"
                              value={location.name}
                              onChange={handleSelection}
                              checked={selectedLocation === location.name}
                            />
                            {location.name} : {location.time}
                          </label>
                        </li>
                      ))}
                    </ul>
                    </div>
                  

                    <div className="input-box finalCalculation">
                      <div className="details">Number of Trekkers</div>
                      <div></div>
                      <div className='noOftrekkers'>
                        <span onClick={decreaseCount}>  <FontAwesomeIcon icon={faCircleMinus} size="lg" style={{ color: "orange", }} /></span>
                        {noOfTrekkers}
                        <span onClick={increaseCount}><FontAwesomeIcon icon={faCirclePlus} size="lg" style={{ color: "orange", }} /></span>
                      </div>
                    </div>
                    <div className='hr'></div>

                    <div className='finalCalculation'>
                      <span >Total To Pay</span>
                      <span></span>
                      <span >₹{finalPrice} /-</span>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className='termsAndCondition'>
                  <input type="checkbox"  {...register("termsAndconditions", { required: { value: true, message: "This field is required" }, })} required />
                  <div >
                    Accept all
                    <a className='link' href='http://localhost:5173/user-agreement' target="_blank"> terms & conditions</a>
                  </div>
                </div>
                <div className="button">
                  <input disabled={isSubmitting} type="submit" value="Submit" />
                </div>
              </Modal.Footer>
            </div>
          </form>
        </Modal>
      }
      {show== false && <ContactSection />}
      {
        <Modal
          show={isBookingConfirmed}
          onHide={() => setBookingConfirmed(false)}
        >
            <Modal.Header closeButton>
              <div className="title-header">
                BOOKING CONFIRMED
                <br />
              </div>
            </Modal.Header>
        </Modal>
      }
      <Footer />
    </div>
  )
}

export default ShowEventDetails
