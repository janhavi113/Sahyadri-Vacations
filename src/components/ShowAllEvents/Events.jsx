import React, { useEffect, useState } from 'react';
import Footer from "../footer";
import Navbar from "../Navbar";
import Contact_Us from "../Contact_Us/Contact_Us";
import Rating from "../Rating/RatingSection";
import slide1 from '../Images/backgrround (3).jpg';
import EventHeader from './EventHeader'
import slide2 from '../Images/Screen_3.webp';
import slide3 from '../Images/Screen_4.webp';
import slide4 from '../Images/Screen_1.jpg';
import Card from "../card"
import Whatsapp from '../Images/whatsapp.svg';
import Allevents from '../Images/Allevents.svg';
import ViewAll from '../Images/viewAll.svg'
import Camping from '../Images/camping.svg'
import upcomingEvent from '../Images/upcomingEvent.svg'
import Backpacking from '../Images/Backpacking.svg'
import { useNavigate } from "react-router-dom";
import "../card.css"
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import '../home.css'
import './Events.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Events = () => {
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
        let r = await fetch(`${apiUrl}show-all-events`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            }
        })
       
        let res = await r.json()
        console.log('res +==', JSON.stringify(res));
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
    const getNextBatchDate = (event) => {
        console.log('event--', event);
        var liveEvent = '';
        let batchdate;
        let eventCostPerPerson;
        const Q = new Date();
        console.log('Q---'+Q);
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
                eventType: event.eventType,
                url: event.Url,
                images: `${apiUrl}`+event.images,
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
            <EventHeader/>
            <div className="contentbody">
                <div className="container justify-content-center py-md-5">

                    <div className="row justify-content- py-4" >
                       
                    {isSuccess && events.map((event, index) => (
                         <>
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
                         </>
                    ))}
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
            )
}

            export default Events
