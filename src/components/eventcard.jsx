import React from 'react'
import "./card.css"
const eventcard = (props) => {
    return (
        <div className="card">

            <img className="card-image" src={props.event.images[0]} alt="Avatar" width="100%" />
            <div className="card-container">
                <h4><b>{props.event.name}</b></h4>
                
                    <div className="button-edit-container">
                        <div className="button">
                            <input type="submit" value="Edit Event" />
                            <input type="submit" value=" Schedule Event " />
                        </div>
                    </div>
                
            </div>


        </div>
    )
}

export default eventcard
