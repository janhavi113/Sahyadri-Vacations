import React, { useEffect, useState } from 'react';
import Footer from "../../footer";
import Navbar from "../../Navbar";
import slide1 from '../../Images/backgrround (3).jpg';
import EventHeader from './EventHeader'
import { useNavigate } from "react-router-dom";
import "../../card.css"
import '../../home.css'
import './Events.css'
import "react-multi-carousel/lib/styles.css";
import './Camping_Event.css';

const Camping_Event = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [backgroundImage, setBackgroundImage] = useState(slide1);
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
    const getAllRecord = async () => {

        // alert("ok"); 
        let liveEvents = [];
        let trekkingEvents = [];
        let campingEvents = [];
        let backPackingEvents = [];
        let r = await fetch(`${apiUrl}show-events/CampingEvent`, {
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
            setTrekkingEvents(trekkingEvents);
            setCampingEvents(campingEvents);
            setBackPackingEvents(backPackingEvents);
        }

    }
    const getNextBatchDate = (event) => {
        console.log('event--', event);
        var liveEvent = '';
        let batchdate;
        let eventCostPerPerson;
        const Q = new Date();
        console.log('Q---' + Q);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (event.batches) {
            for (let i = 0; i < event.batches.length; i++) {
                if (event.batches[i].everyWeekend == true) {
                    batchdate = 'Available On All Weekends';
                    eventCostPerPerson = event.batches[i].eventCostPerPerson;
                } else if (event.batches[i].notScheduleYet == true) {
                    batchdate = 'On Public Demand';
                    eventCostPerPerson = event.batches[i].eventCostPerPerson;
                }
            }
        } else {
            if (event.everyWeekend == true) {
                batchdate = 'Available On All Weekends';
                eventCostPerPerson = event.eventCostPerPerson;
            } else if (event.notScheduleYet == true) {
                batchdate = 'On Public Demand';
                eventCostPerPerson = event.eventCostPerPerson;
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

            }
        }
        return liveEvent;
    }
    const navigate = useNavigate();
    return (
        <div >
            <Navbar />
            {/* <div className="header-img-wapper">
          <h1 >Sahydri Vacations</h1>
          <img className='slide-image' src={backgroundImage}></img>
          </div> */}
            <EventHeader name='Camping Events' />
            <div className="all-event-contentbody">
                <div className="team justify-content-center">
                    <div className="row justify-content-around">
                        {isSuccess && events.map((event, index) => (
                            <>
                                <div className="mt-2 col-lg-3 col-md-3 col-sm-3">
                                    <div className="event-card card all-events-card">
                                        <a onClick={() => navigate(event.url)}>
                                            <img className="event-card-image" src={event.images} alt="Avatar" width="100%" />
                                            <div className="event-card-container">
                                                <h2 className='all-event-header event-card-header bg-transparent'><b>{event.eventname}</b></h2>
                                                <div className='all-event-card-footer event-card-footer'>
                                                    <div >{event.batchdate}</div>
                                                    <div ><strong className='price'>₹{event.eventCostPerPerson} </strong><i>per person</i></div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Camping_Event