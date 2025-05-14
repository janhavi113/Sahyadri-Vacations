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
    const validPrices = [props.event.eventCostPerPerson,props.event.eventCostPerPersonFromMumbai,props.event.b2bPrice].filter(price => price > 0);
    const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : null; // Get the lowest non-zero price
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
                            <div>{props.event.batchdate}</div>
                            
                            <div ><i>Starts From </i><strong className='price'>₹{lowestPrice} </strong>/-</div>
                        </div>
                    </div>
                </a>
            </div>
        </>
    )
}

export default card