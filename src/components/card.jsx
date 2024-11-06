import React from "react";
import { useNavigate } from "react-router-dom";
import "./card.css"

function card(props) {
    const eventLabels = {
        TrekEvent: 'Trekking Event',
        CampingEvent: 'Camping Event',
        BackPackingTrip: 'BackPacking Trip'
    };
    const navigate = useNavigate();
    return (
        <>
            <div className="event-card">
                <a onClick={() => navigate(props.event.url)}>
                    <img className="event-card-image" src={props.event.images} alt="Avatar" width="100%" />
                    <div className="event-card-container">
                        <h2 className='event-card-header bg-transparent'><b>{props.event.eventname}</b></h2>
                        <div className="event-tag">
                            {eventLabels[props.event.eventType] || 'Adventure Activity'}
                        </div>
                        <div className='event-card-footer'>
                            <div >{props.event.batchdate}</div>
                            <div ><strong className='price'>₹{props.event.eventCostPerPerson} </strong><i>per person</i></div>
                        </div>
                    </div>
                </a>
            </div>
        </>
    )
}

export default card