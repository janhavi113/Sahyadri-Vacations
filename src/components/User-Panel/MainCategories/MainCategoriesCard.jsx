import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import './mainCategories.css'
import logo from '../../Images/logo.png';
const MainCategoriesCard = ({ mainCategory }) => {
    console.log('mainCategory---', mainCategory.imagePath);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isHovered, setIsHovered] = useState(false);
    const url = 'category?eventname=' + mainCategory.title.toLowerCase().replaceAll(" ", "-") + '/' + +mainCategory.categoryId;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

    // Detect screen size changes
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const navigate = useNavigate();
    return (
        <>

            {/* Card Example */}
            <a onClick={() => navigate(url)}>

                {/* Card Example */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out group">

                    {/* Image */}
                    <img
                        src={apiUrl + mainCategory.imagePath}
                        alt="Scenic Treks"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0  bg-opacity-40 group-hover:bg-opacity-50 transition"></div>

                    {/* Title */}
                    <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
                        {mainCategory.title}
                    </h3>

                    {/* Logo (Top Right) */}
                    <img
                        src={logo}
                        alt="logo"
                        className="absolute top-3 right-3 w-6 h-6 md:w-8 md:h-8 rounded-full"
                    />

                    {/* Price (Bottom Left) */}
                    <span className="absolute bottom-3 left-3 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-lg shadow">
                        Starting Price @{mainCategory.startingPrice}/-
                    </span>
                </div>

            </a>


        </>
    );
};

export default MainCategoriesCard;
