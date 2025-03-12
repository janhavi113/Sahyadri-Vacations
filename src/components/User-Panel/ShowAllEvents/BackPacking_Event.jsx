import React, { useEffect, useState } from 'react';
import Footer from "../../footer";
import Navbar from "../../Navbar";
import EventHeader from './EventHeader'
import { useNavigate } from "react-router-dom";
import "../../card.css"
import '../../home.css'
import './Events.css'
import "react-multi-carousel/lib/styles.css";
import './Camping_Event.css';
const BackPacking_Event = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  useEffect(() => {

      if (isSuccess == false) {
          getAllRecord();
      }
  })
  const getAllRecord = async () => {

      // alert("ok"); 
      let liveEvents = [];
      let r = await fetch(`${apiUrl}show-events/BackPackingTrip`, {
          method: "GET", headers: {
              "Content-Type": "application/json",
          }
      })

      let res = await r.json();
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
  const getNextBatchDate = (event) => {
      var liveEvent = '';
      let batchdate;
      let eventCostPerPerson;
      let eventCostPerPersonFromMumbai;
      let b2bPrice;
      const Q = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (event.batches) {
          for (let i = 0; i < event.batches.length; i++) {
              if (new Date(event.batches[i].eventStartDate) - Q >= 0) {
                  batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()]+ ' ' + new Date(event.batches[i].eventEndDate).getFullYear();
                  eventCostPerPerson = event.batches[i].eventCostPerPerson;
              }
          }
      } else {
          if (new Date(event.eventStartDate) - Q >= 0) {
              batchdate = new Date(event.eventStartDate).getDate() + ' ' + months[new Date(event.eventStartDate).getMonth()] + ' - ' + new Date(event.eventEndDate).getDate() + ' ' + months[new Date(event.eventEndDate).getMonth()]+ ' ' + new Date(event.eventEndDate).getFullYear();
              eventCostPerPerson = event.eventCostPerPerson;
              b2bPrice = event.b2bPrice;
              eventCostPerPersonFromMumbai = event.eventCostPerPersonFromMumbai;
          }
      }
      if (batchdate && eventCostPerPerson) {
          liveEvent = {
              eventId: event.eventId,
              eventname: event.eventname,
              eventType: event.eventType,
              url: event.Url,
              images: `${apiUrl}` + event.images,
              batchdate: batchdate,
              eventCostPerPerson: eventCostPerPerson,
              eventCostPerPersonFromMumbai:eventCostPerPersonFromMumbai,
              b2bPrice:b2bPrice,
          }
      }
      return liveEvent;
  }
  const navigate = useNavigate();
  return (
      <div >
          <Navbar />
          <EventHeader name='BackPacking Events'/>
          <div className="all-event-contentbody">
              <div className="team justify-content-center">
                  <div className="row">
                      {isSuccess && events.map((event, index) => (                        
                              <div  key={index} className="mt-2 col-lg-3 col-md-3 col-sm-3">
                                  <div className="event-card card all-events-card">
                                      <a onClick={() => navigate(event.url)}>
                                          <img className="event-card-image" src={event.images} alt="Avatar" width="100%" />
                                          <div className="event-card-container">
                                              <h2 className='all-event-header event-card-header bg-transparent'><b>{event.eventname}</b></h2>
                                              <div className='all-event-card-footer event-card-footer'>
                                                  <div >{event.batchdate}</div>
                                                  <div ><strong className='price'>₹{Math.min(...[event.eventCostPerPerson,event.eventCostPerPersonFromMumbai,event.b2bPrice].filter(price => price > 0))} </strong><i>per person</i></div>
                                              </div>
                                          </div>
                                      </a>
                                  </div>
                              </div>
                      ))}
                  </div>
              </div>
          </div>

          <Footer />
      </div>
  )
}

export default BackPacking_Event