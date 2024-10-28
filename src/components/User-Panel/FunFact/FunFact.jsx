import React from 'react'
import './FunFact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import google from '../../Images/google.svg'
import tour from '../../Images/tour.svg'
import destination from '../../Images/destination.svg'
import client from '../../Images/client.svg'
import event from '../../Images/event.svg'
const FunFact = () => {
    return (

        <>
            <div className="funfact-area style-2 ">
                <div className="funfact-container container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="section-title-funfact white text-center">
                                <p className="title" style={{ "color": "white" }}>Interesting Facts
                                </p>
                                <h2>Experiences Away
                                    <div>
                                    </div> From Crowd
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="add-gap rating-row">
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="adjust-top fact-info">
                                    <span>
                                        <img style={{ 'margin': 'auto' }} loading="lazy" src={client} />
                                    </span >
                                    <span style={{ 'margin-top': '-25px' }}>8000+
                                    </span>
                                    <p>Total Clients
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="adjust-top fact-info">
                                    <span>
                                        <img style={{ 'margin': 'auto' }} loading="lazy" src={event} />
                                    </span>
                                    <span style={{ 'margin-top': '-25px' }}> 600+
                                    </span>
                                    <p>Total Events
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="adjust-top-destination fact-info">
                                    <span>
                                        <img style={{ 'margin': 'auto' }} loading="lazy" src={destination} />
                                    </span>
                                    <span style={{ 'margin-top': '-15px' }}>100+
                                    </span>
                                    <p>Destinations
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="fact-info">
                                    <span>
                                        <img style={{ 'margin': 'auto' }} loading="lazy" src={tour} />
                                    </span>
                                    <span style={{ 'margin-top': '-4px' }}> 40+
                                    </span>
                                    <p>Customised Tours
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="fact-info">
                                    <span>
                                        <img style={{ 'margin': 'auto' }} loading="lazy" src={google} />
                                    </span>
                                    <span style={{ 'margin-top': '-20px' }}>
                                        <FontAwesomeIcon className="icon" icon={faStar} style={{ color: "white", }} size="2xs" />
                                        <FontAwesomeIcon className="icon" icon={faStar} style={{ color: "white", }} size="2xs" />
                                        <FontAwesomeIcon className="icon" icon={faStar} style={{ color: "white", }} size="2xs" />
                                        <FontAwesomeIcon className="icon" icon={faStar} style={{ color: "white", }} size="2xs" />
                                        <FontAwesomeIcon className="icon" icon={faStar} style={{ color: "white", }} size="2xs" /> </span>
                                    <p>5 Review
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FunFact
