import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../Images/logo.png';
import './Categories.css'
import "../../User-Panel/MainCategories/mainCategories.css";
const CategoriesCard = ({ mainCategory }) => {
    const url = 'category?eventname='+mainCategory.title.toLowerCase().replaceAll(" ", "-")+'/'+ +mainCategory.categoryId;
    const apiUrl = import.meta.env.VITE_API_URL;
   
        return (
            <a href={url} className="categories-image-card" target="_blank" rel="noopener noreferrer">
              <div
                className="categories-card-background"
                style={{ backgroundImage: `url(${apiUrl+mainCategory.imagePath})` }}
              >
                <div className="categories-card-overlay" />
        
                <div className="categories-card-title">{mainCategory.title}</div>
                <img src={logo} alt="Logo" className="categories-card-logo" />
                <div className="categories-card-price">${mainCategory.startingPrice}</div>
              </div>
            </a>
          );
        };

export default CategoriesCard