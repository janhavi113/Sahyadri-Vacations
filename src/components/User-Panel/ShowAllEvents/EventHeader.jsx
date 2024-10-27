import React from 'react'
import slide1 from '../../Images/backgrround (3).jpg';
import '../../Home_Header/Sidebar.css'
const EventHeader = () => {
    return (
        <div>
            <div className='event'>
                <div className="adjust-margin wrapper">
                    <h1>Upcoming Events</h1>
                </div>
                <div className="imageContainer" >
                    <img src={slide1} alt="header" />
                </div>
            </div>
        </div>
    )
}

export default EventHeader
