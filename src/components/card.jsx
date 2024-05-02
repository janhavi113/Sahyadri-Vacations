import React from 'react'
import "./card.css"
function card(props) {
    return (
        <div className="card">
            <a href={props.event.url} >
            <img className="card-image" src={props.event.images[0]} alt="Avatar" width="100%" />
            <div className="card-container">
                <h4><b>{props.event.name}</b></h4>
                <p>Interior Designer</p>
            </div>
            </a>
        </div>
    )
}

export default card