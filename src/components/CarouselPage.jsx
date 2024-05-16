import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './CarouselPage.css'

function CarouselPage() {
    
    return (
        <div className='hero-section'>
            <Carousel>
                <Carousel.Item className='carousel-item1 vh-100'>
                    <Carousel.Caption className="h-100 d-flex w-100 flex-column align-item-center justify-content-top">
                        {/* <div className="row h-100">
                            <div className="col-lg-6 d-flex flex-column align-item-top  justify-content-center">
                                 <h1>Find yoour perfer solution</h1>
                            </div>
                            <div className="col-lg-6 d-none d-lg-block"></div>
                        </div> */}
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item className='carousel-item2 vh-100'>
                    <Carousel.Caption className="h-100">
                        {/* <div className="row h-100">
                            <div className="col-lg-6 d-flex flex-column align-item-top  justify-content-center">
                                 <h1>Find yoour perfer solution</h1>
                            </div>
                            <div className="col-lg-6 d-none d-lg-block"></div>
                        </div> */}
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item className='carousel-item3 vh-100'>
                    <Carousel.Caption className="h-100">
                        {/* <div className="row h-100">
                        <div className="col-lg-6 d-none d-lg-block"></div>
                            <div className="col-lg-6 d-flex flex-column align-item-end  justify-content-center">
                                 <h1>Find yoour perfer solution</h1>
                            </div>
                            
                        </div> */}
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default CarouselPage