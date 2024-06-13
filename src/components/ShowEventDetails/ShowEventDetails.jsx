import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useForm } from "react-hook-form"
import './ShowEventDetails.css'
import Footer from "../footer";
import Ratingcard from '../Rating/RatingCard'
import Rating from "../Rating/RatingSection";
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
const ShowEventDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParameters = new URLSearchParams(window.location.search)
  //alert('queryParameters',queryParameters);
  const [type, setType] = useState(queryParameters.get("eventid"));
  const [params, setParams] = useState(type.split('/'));
  const [isSuccess, setSuccess] = useState(false);
  const [eventDetails, setEventDetails] = useState();
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
    console.log('data---', data);
    const formData = new FormData();
    formData.append('name', 'janhai');
    //  formData.append('email', data.emailId);
    //  formData.append('mobileNumber', data.whatsappNumber);
    //  formData.append('batch', data.selectDate);
    //  formData.append('eventId', eventDetails.eventId);
    //  formData.append('eventName', eventDetails.name);
    //  formData.append('numberOfPeoples',  noOfTrekkers);
    //  formData.append('amountPaid', finalPrice);
    console.log('formData---', typeof data);
    data.numberOfPeoples = noOfTrekkers;
    data.amountPaid = finalPrice;
    data.eventId = eventDetails.eventId;
    data.eventName = eventDetails.name;
    let r = await fetch(`http://localhost:3000/event-details/eventid/${params[0]}/${params[1]}`, {
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(data)
    })
    let res = await r.json()
    console.log('res', JSON.stringify(res));
    if (res.isSuccess == true) {
      //navigate(`event-details/${res.eventId}`);
    }
  }

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
    console.log('event--', event);
    let batchdate;
    let batchSize = -1;
    let eventCostPerPerson;
    let batchDates = [];
    const Q = new Date("2024-04-09");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i = 0; i < event.batches.length; i++) {
      console.log('event.batches[' + i + ']--' + typeof event.batches[i].eventBatchCount);
      if (batchSize == -1 && new Date(event.batches[i].eventStartDate) - Q >= 0 && event.batches[i].eventBatchCount > 0) {
        batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear();
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
      }
      batchDates.push(new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear());
    }
    console.log('batchDates --- ' + batchDates);
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
  const getAllRecord = async () => {
    let r = await fetch(`http://localhost:3000/event-details/eventid/${params[0]}/${params[1]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()

    if (res.isSuccess == true) {
      setSuccess(true);
      console.log('eventDetails ', res.events);
      console.log('scheduleBatch', res.ScheduleBatchesRecords);
      setEventDetails(res.events);
      setScheduleBatch(res.ScheduleBatchesRecords);
      getNextBatchDate(res.ScheduleBatchesRecords);

      // console.log('scheduleBatch',scheduleBatch );
    }

  }
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
          {isSuccess && console.log('eventDetails.images-- '+eventDetails.images)}
          {isSuccess &&  eventDetails.images.map((event, index) => (

            <SwiperSlide key={index}><img className='event-section-header-img' loading="lazy" src={event} />
              <div className="inner-content">
                <h3>{eventDetails.name}</h3>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
      {isSuccess &&
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
                { availableBatches && console.log('availableBatches '+availableBatches)}
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
          <div className="content-right-side col-sm-12  col-md-4  col-lg-4 col-xl-4">
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
                      <div>
                        <center> {batchDate} </center></div>
                      <div className="button">
                        <input onClick={handleShow} type="submit" value="Submit" />
                      </div>
                      <br />
                      <div className='card-info'><FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Best Price Guaranteed <br /> <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Secure & Easy Booking
                        <br />
                        <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> 1000+ Happy Customers</div>
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-12">
                  <div className="card eventcard" style="margin-top:50px!important;  max-width: 22rem; margin-right: auto; margin-left: auto;">
                    <h3 className="text-start mb-0 text-start" style="font-weight: 600; position: absolute; margin-top: -70px;"> Events </h3>
                    <p className="text-start mb-4 text-start" style="position: absolute; margin-top: -36px;"> You Might Loved To Go! </p>

                    <a href="camping.php?campid=1">
                      <img className="img-fluid img-fluid-1" src="Admin/camping-images/pawana.jpg" onError="this.onerror=null;this.src='assets/images/icons/camping_event_default_image-512px.png';" />
                        <img src="Admin/trek-images/icons/camping_event_badge-48px.svg" style="position: absolute; border-radius: 0px; width: 50%; top: 10px; left: 10px;"/>
                      </a>
                        <div className="card-header bg-transparent">
                          <a href="camping.php?campid=1">
                            <h5 className="home-text-bold"><strong> Pawana Lake Camping</strong></h5>
                          </a>
                        </div>
                        <a href="camping.php?campid=1" style="text-decoration: none; color: black;">
                          <div className="card-body">
                            <p className="card-text">
                              Available On All Weekends
                            </p>
                          </div>
                        </a>
                        <a href="camping.php?campid=1" style="text-decoration: none; color: black;">
                          <div className="card-footer row bg-transparent">
                            <div className="col">
                              <span style="float: left;">
                                <strong className="text-end" style="color: #288700;">
                                  ₹1,199/-
                                </strong>
                                <strong> <small style="font-size:14px;"> Per Person</small> </strong>
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                      <p className="text-center" style="margin-top: 20px; margin-bottom: 20px; color: #ff9900;">
                        <a href="camping-list.php?page=1" style="text-decoration:none; color: #ff9900;">
                          VIEW ALL RELATED EVENTS
                          <svg id="arrow_forward-24px" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g id="Group_792" data-name="Group 792">
                              <path id="Path_911" data-name="Path 911" d="M0,0H24V24H0Z" fill="none"></path>
                            </g>
                            <g id="Group_795" data-name="Group 795" transform="translate(4 2)">
                              <g id="Group_794" data-name="Group 794">
                                <g id="Group_793" data-name="Group 793">
                                  <path id="Path_912" data-name="Path 912" d="M5,13H16.17l-4.88,4.88a1.008,1.008,0,0,0,0,1.42h0a1,1,0,0,0,1.41,0l6.59-6.59a1,1,0,0,0,0-1.41L12.71,4.7a1,1,0,0,0-1.41,0h0a1,1,0,0,0,0,1.41L16.17,11H5a1,1,0,0,0-1,1H4A1,1,0,0,0,5,13Z" transform="translate(-4 -4.408)" fill="#f90"></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </a>
                      </p>

                  </div> */}

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
                    <div className="input-box">
                      <span className="details">Select Batch</span>
                      <select  {...register("selectDate", { required: { value: true, message: "This field is required" }, })} required>
                      { console.log('availableBatches -----'+availableBatches)}
                        {availableBatches && availableBatches.map((event, index) => (
                          <option key={index} value={event} >{event}</option>
                        ))}
                      </select>
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
    
      <Footer />
    </div>
  )
}

export default ShowEventDetails
