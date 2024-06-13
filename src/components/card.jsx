import React from "react";
import { useNavigate } from "react-router-dom";
import "./card.css"

function card(props) {
    
    const navigate = useNavigate();
    return (
       <>
        <div className="card">
            <a onClick={() => navigate(props.event.url)}>
                <img className="card-image" src={props.event.images} alt="Avatar" width="100%" />
                <div className="card-container">
                    <h2 className='card-header bg-transparent'><b>{props.event.eventname}</b></h2>
                    <div className='card-footer'>
                    <div >{props.event.batchdate}</div>
                    <div ><strong className='price'>₹{props.event.eventCostPerPerson} /- </strong>per person</div>
                    </div>
                </div>
            </a>
        </div>
        </>
    )
}

export default card