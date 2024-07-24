import React from 'react'
import './FunFact.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash ,faStar } from '@fortawesome/free-solid-svg-icons';
const FunFact = () => {
    return (

        <>
            <div className="funfact-area style-2 ">
                <div className="funfact-container container">
                    <div className="add-gap row justify-content-center">
                        <div className="col-lg-5">
                            <div className="section-title-funfact white text-center">
                                <p className="title" style={{"color":"white"}}>Interesting Facts
                                </p>
                                <h2>Experiences Away
                                    <div>
                                    </div> From Crowd
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="add-gap row">
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="fact-info">
                                  
                                         <span>8000
                                         </span>
                                        <span>+
                                        </span>
                                        <p>Total Clients
                                        </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="fact-info">
                                  
                                    <span> 600
                                    </span>
                                        <span>+
                                        </span>
                                        <p>Total Events
                                        </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="fact-info">
                                 
                                    <span>100
                                        </span>
                                        <span>+
                                        </span>
                                        <p>Destinations
                                        </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="fact-info">
                                  
                                    <span> 40
                                        </span>
                                        <span>+
                                        </span>
                                        <p>Customised Tours
                                        </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-4">
                            <div className="single-fact text-center">
                                <div className="fact-info">
                                   
                                    <span> 5
                                        </span>
                                        <span><FontAwesomeIcon className="icon" icon={faStar} style={{color: "white",}} size= "2xs" /></span>
                                        <p>Ratings
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
