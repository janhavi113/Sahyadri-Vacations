import React, { useEffect, useState } from 'react';
import Footer from "../../footer";
import Gallery from "./Gallery" ;
import slide1 from '../../Images/Screen_2.jpg';
import slide2 from '../../Images/Screen_3.webp';
import slide3 from '../../Images/Screen_4.webp';
import slide4 from '../../Images/Screen_1.jpg';
import './Gallery.css'
import EventHeader from './GalleryHeader'
const PhotoGallery = () => {
  const images = [
    slide1,
    slide2,
    slide3,
    slide4
];
const [backgroundImage, setBackgroundImage] = useState(images[1]);
  return (
    <div>
      <EventHeader/>
      <Gallery/>
     
      <Footer />
    </div>
  )
}

export default PhotoGallery
