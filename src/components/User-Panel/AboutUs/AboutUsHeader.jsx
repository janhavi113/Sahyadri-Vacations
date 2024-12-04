import React from 'react'
import slide1 from '../../Images/backgrround (1).jpg';
import '../../Home_Header/Sidebar.css'
import '../ShowAllEvents/Events.css'

const AboutUsHeader = () => {
    return (
        <div>
            <div className='event'>
                <div className="wrapper">
                    <h1>About Us</h1>
                </div>
                <div className="imageContainer" >
                    <img src={slide1} alt="header" />
                </div>
            </div>
        </div>
    )
}


export default AboutUsHeader
