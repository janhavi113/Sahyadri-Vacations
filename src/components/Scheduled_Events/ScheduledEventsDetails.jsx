import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import '../ShowEventDetails/ShowEventDetails.css'
import './ScheduledEvents.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCirclePlus, faCircleMinus, faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const ScheduledEventsDetails = () => {
    const [searchParams, setSearchParams] = useSearchParams();
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
  
    useEffect(() => {

        if (isSuccess == false && type && params) {
          getAllRecord();
        }
      })
      const getNextBatchDate = (event) => {
        console.log('event--', event);
        let batchdate ='';
        let batchSize = -1;
        let eventCostPerPerson;
        let batchDates = [];
        let eventType = event.eventType;
        const Q = new Date("2024-04-09");
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
        for (let i = 0; i < event.batches.length; i++) {
          console.log('event.batches[' + i + ']--' ,  event.batches[i]);
           if(event.batches[i].everyWeekend == true){
            batchdate ='Available On All Weekends';
            eventCostPerPerson = event.batches[i].eventCostPerPerson;
            batchSize = event.batches[i].eventBatchCount;
            setEveryWeekend(true);
          }
          else if(event.batches[i].notScheduleYet == true){
            batchdate ='On Demand';
            setInquery(true);
            eventCostPerPerson = event.batches[i].eventCostPerPerson;
            batchSize = event.batches[i].eventBatchCount;
          }
          else
           {
            batchdate = batchdate + new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()]+ ' '+new Date(event.batches[i].eventStartDate).getFullYear() + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear() +' | ';
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
        let r = await fetch(`https://sahyadri-vacations-5e5s.vercel.app/event-details/eventid/${params[0]}/${params[1]}`, {
          method: "GET", headers: {
            "Content-Type": "application/json",
          }
        })
        let res = await r.json()
        // console.log( 'res ',res);
        if (res.isSuccess == true) {
          setSuccess(true);
         // console.log('eventDetails ', res.events);
         // console.log('scheduleBatch', res.ScheduleBatchesRecords);
          setEventDetails(res.events);
          setScheduleBatch(res.ScheduleBatchesRecords);
          getNextBatchDate(res.ScheduleBatchesRecords);
    
          //// console.log('scheduleBatch',scheduleBatch );
        }
    
      }
      const displayList = (data) => {
        var splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
        splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
        splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
        splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
        return splitedList;
      }
  return (
    <div>
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
                    {availableBatches && console.log('availableBatches ' + availableBatches)}
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
                    <ol class="display-bulletin">
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
                          {/* <input onClick={handleShow} type="submit" value="BOOK NOW" /> */}
                          <button  type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>
                        </div></>}
                        {inquery && 
                        <div className="button-margin button">
                         <button  type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>
                         </div>
                      }
                        <br />
                        <div className='card-info'><FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Best Price Guaranteed <br /> <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Secure & Easy Booking
                          <br />
                          <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> 1000+ Happy Customers</div>
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
                  { /* <input className="button-input" disabled={isSubmitting} type="submit" onClick={handleShow} value="BOOK NOW" /> */}
                  {!inquery &&
                   <button  type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button> 
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
    </div>
  )
}

export default ScheduledEventsDetails
