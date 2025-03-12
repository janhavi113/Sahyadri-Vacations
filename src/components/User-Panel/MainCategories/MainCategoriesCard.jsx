import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import './mainCategories.css'
import logo from '../../Images/logo.png';
const MainCategoriesCard = ({ mainCategory }) => {
    console.log('mainCategory---', mainCategory.imagePath);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isHovered, setIsHovered] = useState(false);
    const [categoryUrl , setCategoryUrl] = useState('');
   
    const url = 'category?eventname='+mainCategory.title.toLowerCase().replaceAll(" ", "-")+'/'+ +mainCategory.categoryId;
     
  
    const navigate = useNavigate();
    return (
        <>

            <div className="col-lg-3 col-md-4 col-6  category-card-container " onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                <a onClick={() => navigate(url)}>
                    <div className="category-background-image"></div>
                    <div className="top-right"><img src={logo} /></div>
                    <img
                        src={apiUrl+'/'+mainCategory.imagePath}
                        alt="Card Background" className="card-image " />
                    <div className="centered">{mainCategory.title}</div>
                    {isHovered && mainCategory.startingPrice &&
                        <div className="bottom-left">Starting Price @{mainCategory.startingPrice}/-</div>
                    }
                </a>
            </div>

        </>
    );
};

export default MainCategoriesCard;
