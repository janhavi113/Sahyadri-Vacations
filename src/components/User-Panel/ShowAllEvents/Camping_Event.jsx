import React, { useEffect, useState } from 'react';
import Footer from "../../footer";
import EventHeader from './EventHeader'
import { useNavigate } from "react-router-dom";
import "../../card.css"
import '../../home.css'
import './Events.css'
import "react-multi-carousel/lib/styles.css";
import './Camping_Event.css';
import { getUnscheduledOrRecurringEvents } from '../../utils/eventUtils';

const Camping_Event = () => {
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
        let r = await fetch(`${apiUrl}show-events/CampingEvent`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            }
        })

        let res = await r.json();
        if (res.isSuccess == true) {
            setSuccess(true);
            const campingEvents = getUnscheduledOrRecurringEvents(res.events, apiUrl, "CampingEvent");
            setEvent(campingEvents);
        }

    }
   
    const navigate = useNavigate();
    return (
        <div >
            <EventHeader name='Camping Events' />
            <div className="all-event-contentbody">
                <div className="team justify-content-center">
                    <div className="row">
                        {isSuccess && events && events.map((event, index) => (
                                <div key={index} className="mt-2 col-lg-3 col-md-3 col-sm-3">
                                    <div className="event-card card all-events-card">
                                        <a onClick={() => navigate(event.url)}>
                                            <img className="event-card-image" src={event.images} alt="Avatar" width="100%" />
                                            <div className="event-card-container">
                                                <h2 className='all-event-header event-card-header bg-transparent'><b>{event.eventname}</b></h2>
                                                <div className='all-event-card-footer event-card-footer'>
                                                    <div >{event.batchdate}</div>
                                                    <div ><i>Strats From </i><strong className='price'>₹{Math.min(...[event.eventCostPerPerson, event.eventCostPerPersonFromMumbai, event.b2bPrice].filter(price => price > 0))} </strong>/-</div>
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

export default Camping_Event