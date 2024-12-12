import React, { useRef, useEffect, useState } from 'react';
import AdminNavbar from "../../AdminNavbar";
import { useSearchParams , useNavigate} from "react-router-dom";
import '../../User-Panel/ShowEventDetails/ShowEventDetails.css'
import './ScheduledEvents.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const ScheduledEventsDetails = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const queryParameters = new URLSearchParams(window.location.search);
  const [type, setType] = useState(queryParameters.get("eventid"));
  const [startDate, setStartDate] = useState(new Date());
  const [params, setParams] = useState(type.split('/'));
  const [isSuccess, setSuccess] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [scheduleBatch, setScheduleBatch] = useState();

  const [everyWeekend, setEveryWeekend] = useState(false);
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [availableBatches, setAvailableBatches] = useState();
  const [price, setPrice] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const [inquery, setInquery] = useState(false);
  const navigateUrl = useNavigate();
  useEffect(() => {

    if (isSuccess == false && type && params) {
      getAllRecord();
    }
  })
  const getNextBatchDate = (event) => {
    console.log('event--', event);
    let batchdate = '';
    let batchSize = -1;
    let eventCostPerPerson;
    let batchDates = [];
    //let eventType = event.eventType;
    const Q = new Date("2024-04-09");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (event.batches) {
      for (let i = 0; i < event.batches.length; i++) {
        console.log('event.batches[' + i + ']--', event.batches[i]);
        if (event.batches[i].everyWeekend == true) {
          batchdate = 'Available On All Weekends';
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
          setEveryWeekend(true);
        }
        else if (event.batches[i].notScheduleYet == true) {
          batchdate = 'On Demand';
          setInquery(true);
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
        }
        else {
          batchdate = batchdate + new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear() + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear() + ' | ';
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
        }

        if (event.batches[i].everyWeekend == false && event.batches[i].notScheduleYet == false) {
          batchDates.push(new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear());
        } else if (event.batches[i].notScheduleYet == true) {
          batchDates.push('On Demand');
        } else if (event.batches[i].everyWeekend == true) {
          batchDates.push('Available On All Weekends');
        }
      }
    } else {
      if (event.everyWeekend == true) {
        batchdate = 'Available On All Weekends';
        eventCostPerPerson = event.eventCostPerPerson;
        batchSize = event.eventBatchCount;
        setEveryWeekend(true);
      }
      else if (event.notScheduleYet == true) {
        batchdate = 'On Demand';
        setInquery(true);
        eventCostPerPerson = event.eventCostPerPerson;
        batchSize = event.eventBatchCount;
      }
      else {
        batchdate = batchdate + new Date(event.eventStartDate).getDate() + ' ' + months[new Date(event.eventStartDate).getMonth()] + ' ' + new Date(event.eventStartDate).getFullYear() + ' - ' + new Date(event.eventEndDate).getDate() + ' ' + months[new Date(event.eventEndDate).getMonth()] + ' ' + new Date(event.eventStartDate).getFullYear() + ' | ';
        eventCostPerPerson = event.eventCostPerPerson;
        batchSize = event.eventBatchCount;
      }

      if (event.everyWeekend == false && event.notScheduleYet == false) {
        batchDates.push(new Date(event.eventStartDate).getDate() + ' ' + months[new Date(event.eventStartDate).getMonth()] + ' - ' + new Date(event.eventEndDate).getDate() + ' ' + months[new Date(event.eventEndDate).getMonth()] + ' ' + new Date(event.eventStartDate).getFullYear());
      } else if (event.notScheduleYet == true) {
        batchDates.push('On Demand');
      } else if (event.everyWeekend == true) {
        batchDates.push('Available On All Weekends');
      }
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
  const getAllRecord = async () => {
    let r = await fetch(`${apiUrl}event-details-admin/eventid/${params[0]}/${params[1]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    // console.log( 'res ',res);
    if (res.isSuccess == true) {
      setSuccess(true);
      // console.log('eventDetails ', res.events);
     console.log('scheduleBatch', res.ScheduleBatchesRecords);
      setEventDetails(res.events);
      setScheduleBatch(res.ScheduleBatchesRecords);
      getNextBatchDate(res.ScheduleBatchesRecords);

      //// console.log('scheduleBatch',scheduleBatch );
    }

  }
  const deleteScheduleEvents = async () => {
    console.log('Button clicked from class component!');
    let r = await fetch(`${apiUrl}delete-scheduled-events/eventid/${params[0]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json();
      if(r.ok){
        navigateUrl('/scheduled-events');
      }
  };

  const openConfirmPopup = () => {
    setShowConfirm(true);
  };
  const editScheduleEvent = () => {
    navigateUrl(`/update-schedule-events?eventid=${params[0]}`);
  };
  const displayList = (data) => {
    var splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
    splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
    splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
    splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
    return splitedList;
  }
  const onAutoplayTimeLeft = (s, time, progress) => {
    // progressCircle.current.style.setProperty('--progress', 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <div>
      <AdminNavbar>
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
          {isSuccess && console.log('eventDetails.images-- ' + eventDetails.images)}
          {isSuccess && eventDetails.images.map((event, index) => (

            <SwiperSlide key={index}><img className='event-schedule-section-header-img' loading="lazy" src={`${apiUrl}` + scheduleBatch.images} />
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
             
              <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example  p-3 rounded-2" tabindex="0">
                <div  className='pt-4 pb-1 px-2'>
                
                  <div className='section-details'>
                  <div > 
                  <h2 className='schedule-section-header'>Event Details </h2>
                  {availableBatches && console.log('availableBatches ' + availableBatches)}
                    {availableBatches && availableBatches.map((event, index) => (
                      <div key={index}><b> Upcoming Batches  Batch {index + 1} :</b> {event}</div>
                    ))}
                  </div>
                  <div id="scrollspyHeading1"> 
                
                    <div className='scheduled-flex'>
                    <div ><b>eventApi: </b>{ scheduleBatch.eventApi}</div>
                   <div id="scrollspyHeading5"><b>eventType: </b>{ scheduleBatch.eventType}</div>
                   </div>
                    <div className='scheduled-flex'>
                    <div ><b>eventCostPerPerson: </b>{ scheduleBatch.eventCostPerPerson}</div>
                    <div ><b>Base to Base Price: </b>{ scheduleBatch.b2bPrice}</div>
                    </div>
                    <div className='scheduled-flex'>
                    {scheduleBatch.eventEndDate && <div><b>eventEndDate: </b>{new Date(scheduleBatch.eventEndDate).toISOString().split('T')[0]}</div> }
                    {scheduleBatch.eventStartDate &&<div><b>eventStartDate: </b>{ new Date(scheduleBatch.eventStartDate).toISOString().split('T')[0]}</div>}
                    </div>
                    </div>
                    <hr/>
                    <div id="scrollspyHeading2" >
                    <h2 className='schedule-section-header'>Booking Open Details </h2>
                    <div className='scheduled-flex'>                    
                    <div><b>bookingTillDate: </b>{ scheduleBatch.bookingTillDate}</div>
                    <div><b>bookingTillTime: </b>{ scheduleBatch.bookingTillTime}</div>
                    </div>
                    </div>
                    <div className='scheduled-flex'>
                    <div><b>everyWeekend: </b>{ scheduleBatch.everyWeekend}</div>
                    <div><b>notScheduleYet: </b>{ scheduleBatch.notScheduleYet}</div>
                    </div>
                    <hr />
                    <h2 className='schedule-section-header'>Booking Count Details </h2>
                    <div className='scheduled-flex'>                    
                    <div><b>eventBatchCount: </b>{ scheduleBatch.eventBatchCount}</div>
                    <div><b>alreadyBoockedCount: </b>{ scheduleBatch.alreadyBoockedCount}</div>
                    </div>
                    <hr />
                    <h2 className='schedule-section-header'>Booking Count Details </h2>
                    <div><b>specialOfferEvent: </b>{ scheduleBatch.specialOfferEvent}</div>
                   
                    </div>              
                </div>  
              </div>
            </div>
            <div className="col-xl-4 ">
              <div className="container sticky-top" >
                <div >
                  <div >
                    <div className="booking-card mb-3 " >
                      <div className="card-body text-dark">
                        <h4 className="card-title"><center>
                          <b className='event-price'>₹{price} /- </b>
                          <sub >Per Person</sub>
                        </center>
                        </h4>
                        {!inquery && <> <div>
                          <center> {batchDate} </center></div>

                          <div className="button-margin button button-group-box">
                            {/* <input onClick={handleShow} type="submit" value="BOOK NOW" /> */}
                            <button onClick={editScheduleEvent} type="button"> <strong>EDIT</strong> </button>
                            <button onClick={openConfirmPopup} type="button"> <strong>DELETE</strong> </button>
                          </div></>}
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
                <div className="booking-section d-scheduled-flex justify-content-between align-items-center">
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
                    { /* <input className="button-input" disabled={isSubmitting} type="submit" onClick={handleShow} value="BOOK NOW" /> */}

                    <button type="button"> <strong>EDIT</strong> </button>

                    <button onClick={openConfirmPopup} type="button"><strong>&nbsp;DELETE </strong> </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Modal show={showConfirm} >
              <Modal.Header closeButton>

              </Modal.Header>
              <Modal.Body> <center><div>Do you want to delete event ?</div></center></Modal.Body>
              <Modal.Footer>
                <div className="button-edit-container">
                  <div className="button">
                    <input type="submit" value=" Delete " onClick={deleteScheduleEvents} />
                    <input type="submit" value=" Cancel " onClick={() => setShowConfirm(false)} />
                  </div>
                </div>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      }
     </AdminNavbar>
    </div>
  )
}

export default ScheduledEventsDetails
