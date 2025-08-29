import React from 'react'
import slide1 from '../../Images/galary.jpg';
import '../../Home_Header/Sidebar.css'
import '../ShowAllEvents/Events.css'
import Navbar from "../../Navbar";
const GalleryHeader = () => {
    return (
        <div>
             {/* Hero Section */}
            <section
                className="relative h-[70vh] flex items-center justify-center text-white"
                style={{
                    backgroundImage: `url(${slide1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Navbar />
                <div className="bg-black/30 bg-opacity-40 absolute inset-0"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                       Gallery
                    </h1>

                </div>
            </section>
        </div>
    )
}


export default GalleryHeader
