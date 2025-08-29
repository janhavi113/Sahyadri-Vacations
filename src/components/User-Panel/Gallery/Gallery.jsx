import PhotoAlbum from "react-photo-album";
import React, { useEffect, useState } from 'react';
import slide1 from '../../Images/gallery/image (1).jpg';
import slide2 from '../../Images/gallery/image (2).jpg';
import slide3 from '../../Images/gallery/image (3).jpg';
import slide4 from '../../Images/gallery/image (4).jpg';
import slide5 from '../../Images/gallery/image (5).jpg';
import slide6 from '../../Images/gallery/image (6).jpg';

const photos = [
  {
    src: slide1,
    width: 800,
    height: 700
  },
  {
    src: slide2,
    width: 700,
    height: 700
  },
  {
    src: slide3,
    width: 700,
    height: 800
  },
  {
    src: slide4,
    width: 700,
    height: 800
  },
  {
    src: slide5,
    width: 700,
    height: 800
  },
  {
    src: slide6,
    width: 800,
    height: 700
  }
];

export default function Gallery() {

  return (
    <>  
    <div className="contentbody all-event-contentbody">
      <div className="gallery">
        <div className="col-md-3">
          <a href="" target="_blank">
          </a><div className="content"><a href="" target="_blank">
            <div className="content-overlay"></div>
          </a><a href=""><img className="content-image" src={slide1} alt="" /></a>
            {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}
          </div>
         {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}


        </div>
        <div className="col-md-3">
          <a href="https://www.instagram.com/p/C0bgogkIoFg/?igsh=bzltejRmOWVjaHpx&img_index=1" target="_blank">
          </a><div className="content"><a href="https://www.instagram.com/p/C0bgogkIoFg/?igsh=bzltejRmOWVjaHpx&img_index=1" target="_blank">
            <div className="content-overlay"></div>
          </a><a href="https://www.instagram.com/p/C0bgogkIoFg/?igsh=bzltejRmOWVjaHpx&img_index=1"><img className="content-image" src={slide2} alt="" /></a>
            {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}
          </div>
          {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}


        </div>
        <div className="col-md-3">
          <a href="https://www.instagram.com/p/C1rRAiBokHI/?igsh=MXMzcXBrcmticnZvaw%3D%3D" target="_blank">
          </a><div className="content"><a href="https://www.instagram.com/p/C1rRAiBokHI/?igsh=MXMzcXBrcmticnZvaw%3D%3D" target="_blank">
            <div className="content-overlay"></div>
          </a><a href="https://www.instagram.com/p/C1rRAiBokHI/?igsh=MXMzcXBrcmticnZvaw%3D%3D"><img className="content-image" src={slide3} alt="" /></a>
            {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}
          </div>
         {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}



        </div>
        <div className="col-md-3">
          <a href="" target="_blank">
          </a><div className="content"><a href="" target="_blank">
            <div className="content-overlay"></div>
          </a><a href=""><img className="content-image" src={slide4} alt="" /></a>
            {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}
          </div>
         {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}



        </div>
        <div className="col-md-3">
          <a href="https://www.instagram.com/p/CnI9mcYPA0W/?igsh=NjlzZWp2d3o0NTVj" target="_blank">
          </a><div className="content"><a href="https://www.instagram.com/p/CnI9mcYPA0W/?igsh=NjlzZWp2d3o0NTVj" target="_blank">
            <div className="content-overlay"></div>
          </a><a href="https://www.instagram.com/p/CnI9mcYPA0W/?igsh=NjlzZWp2d3o0NTVj"><img className="content-image" src={slide5} alt="" /></a>
            {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}
          </div>
         {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}



        </div>
        <div className="col-md-3">
          <a href="https://www.instagram.com/p/CpFoXXqI1yi/?igsh=dGI3ZjV1bnhxMjZt" target="_blank">
          </a><div className="content"><a href="https://www.instagram.com/p/CpFoXXqI1yi/?igsh=dGI3ZjV1bnhxMjZt" target="_blank">
            <div className="content-overlay"></div>
          </a><a href="https://www.instagram.com/p/CpFoXXqI1yi/?igsh=dGI3ZjV1bnhxMjZt"><img className="content-image" src={slide6} alt="" /></a>
            {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}
          </div>
         {/* <div className="res-community-title">
            <h6>Harishchandragad Trek</h6>
          </div> */}



        </div>
        </div>

      </div>
    </>

  );
}