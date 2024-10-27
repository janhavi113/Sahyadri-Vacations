import React from 'react'
import slide1 from '../../Images/backgrround (2).jpg';
import '../../Home_Header/Sidebar.css'
import '../ShowAllEvents/Events.css'
const GalleryHeader = () => {
    return (
        <div>
            <div className='event'>
                <div className="wrapper">
                    <h1>Gallery</h1>
                </div>
                <div className="contactimg" >
                    <img src={slide1} alt="header" />
                </div>
            </div>
        </div>
    )
}


export default GalleryHeader
