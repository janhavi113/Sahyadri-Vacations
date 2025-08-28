import React from 'react'
import slide1 from '../../Images/contact-us.jpg';
import '../../Home_Header/Sidebar.css'
import './CorporateBooking.css'
import '../ShowAllEvents/Events.css'
const CorporateBookingPageHeader = () => {
    return (
        <div>
            <div className='event'>
                <div className="hero">
                    <div className="wrapper">
                        <h1> Plan Your Corporate Event with Us</h1>
                        <div className="buttons">
                            <a href="/events" role="button" >Upcomming Events</a>

                        </div>
                    </div>
                </div>
                <div className="contactimg" >
                    <img src={slide1} alt="header" />
                </div>
            </div>

        </div>
    )
}


export default CorporateBookingPageHeader
