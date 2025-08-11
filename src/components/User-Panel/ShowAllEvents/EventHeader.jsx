import React from 'react'
import slide1 from '../../Images/vasota-1.webp';
import '../../Home_Header/Sidebar.css'
const EventHeader = ({name}) => {
    return (
        <div>
            <div className='event'>
                <div className="adjust-margin wrapper">
                    <h1 className='event-header'>{name}</h1>
                </div>
                <div className="imageContainer" >
                    <img src={slide1} alt="header" />
                </div>
            </div>
        </div>
    )
}

export default EventHeader
