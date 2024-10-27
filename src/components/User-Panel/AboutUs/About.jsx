import React, { useState } from 'react';
import Footer from "../../footer";
import Navbar from "../../Navbar";
import './AboutUs.css'
import EventHeader from './AboutUsHeader'
import 'bootstrap/dist/css/bootstrap.min.css';
const About = () => {
  return (
    <>
      <EventHeader />
      <Navbar />
      <div className="contentbody-about-us">
        <div className='about'>
          <div className="aboutus-container">
            <h2 >Who We Are ?</h2>
            <p className="info" >In November 2021, we embarked on a remarkable journey with a simple yet powerful belief: that people should passionately pursue their hobby of trekking. With this vision in mind, Sahyadri Vacations and Adventures born. Our primary objective was to introduce people to the hidden gems of Maharashtra and India in long term At Sahaydri Vacations, we strive to create unforgettable memories for our participants. We carefully curate each trek, tour, and camping experience to showcase the hidden treasures of Maharashtra, from the majestic forts perched atop rugged mountains to the serene valleys and pristine lakes that adorn the landscape. We believe in the transformative power of nature and adventure, and our aim is to provide you with immersive experiences that leave a lasting impact.Welcome to Sahyadri Vacations And Adventures, where we specialize in creating unforgettable travel experiences across Maharashtra, and beyond. Founded with a passion for exploration and a commitment to excellence, we are dedicated to follow the Virtues set by Chhatrapati Shivaji Maharaj. Whether you're seeking cultural immersion, adventure, or relaxation, our expert team ensures every detail of your trip is meticulously planned for an enriching and seamless experience.</p>
          </div>

          <div className="aboutus-container">
            <h2 >Our Mission</h2>
            <p className="info" >At Sahyadri Vacations and Adventures, our mission is to inspire and empower travellers to discover the beauty India. By fostering meaningful connections with our guests and local communities, we aim to promote sustainable tourism practices and preserve the natural and cultural heritage of the regions we explore.</p>
            <p>Our prime goal is to make you feel safe while you're having the best adventure of your life. And make each journey of yours memorable for life long. Also we respect and are very proud of our ancient heritage and aim to provide you all with the necessary information about our culture, tradition, historical Places events</p>
          </div>
          <div className="aboutus-container">
            <h2 >Our History</h2>
            <p className="info" >Established in Nov 2021, Sahyadri Vacations began as a vision to showcase the hidden gems and vibrant culture of India and with One simple belief — Everyone Must Travel. Over the years, we have grown from a passionate idea into a trusted travel partner, known for our commitment to Quality, Integrity, and Customer satisfaction. With each journey we curate, we build upon our expertise and continue to evolve, ensuring that every traveller’s experience with us is nothing short of extraordinary.</p>
          </div>
          {/* <div className='team-section'>
            <h1 className='team-header' > Sahyadri Vacations Team </h1>
            <div className="home-container">
              <div><div className="team row">
                <div className="col multiimage">
                 
                  <img className="multiimage2" src={multiimage2} />
                  
                </div>
                <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 founder py-5">
                  <h2 className="h2">Pravin Sahane</h2>
                  <div className="designation">Founder</div>

                  <p className="team-info">A passionate traveller and mountaineer. He has explored more than 350 treks in the Sahyadri mountain range. He is a great leader and skilled Mountaneer. He has successfully led more than 150 treks. He believe that travel has the power to transform lives, broaden horizons and is main tool to improve World Happiness Index.</p>
                  <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faSquareFacebook} style={{ color: "white", }} size='xl' />       </a>
                  <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faInstagram} style={{ color: "white", }} size='xl' />      </a>
                  <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faYoutube} style={{ color: "white", }} size='xl' />   </a>
                  <a className="links" href="https://www.instagram.com/traveller_hrushi/" target="_blank" > <FontAwesomeIcon className="icon" icon={faLinkedinIn} style={{ color: "white", }} size='xl' />   </a>
                </div>

              </div>
              </div>

            </div>
            <br />
            <br />
             <div className="team justify-content-around" >
            <div className="row justify-content-around">
                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={rajesh} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Rajesh Mahatme</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={dheeraj} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Vikas Chalke</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={sandeep} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Kunal Sahane</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
              <div className="row justify-content-around">
                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={venkatesh} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Venkatesh Lagade</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={dheeraj} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Dheeraj Damare</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={sandeep} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Sandeep Borude</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
              <div className="row justify-content-around">
                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={rajesh} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Sairaj Mhaske</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={dheeraj} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Rutvik Gavhane</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={dheeraj} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Vijay Tamhankar</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-around">
              <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={sandeep} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Nikita Bankar</h5>
                      <p className="card-text">Content Creator 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={sandeep} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Mayuri Nikam</h5>
                      <p className="card-text">Content Creator 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={rajesh} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Shivam Shinde</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="row justify-content-around">
              <div className="mt-2 team-members col-lg-3 col-md-3 col-sm-3">
                  <div className="bg-transparent text-center" >
                    <img src={sandeep} className="card-img-top" alt="Shivraj Chirmure Leader" />
                    <div className="card-body all-team">
                      <h5 className="card-title">Aditya Thakre</h5>
                      <p className="card-text">Trek Leader 🌄</p>
                      <a href="https://www.linkedin.com/in/ankit-sakhare-1077ba214" target="_blank" className="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <g id="Group_789" data-name="Group 789" transform="translate(-1385 -625)">
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="24" height="24" transform="translate(1385 625)" fill="none"></rect>
                            <path id="Subtraction_4" data-name="Subtraction 4" d="M20,24H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H20a4,4,0,0,1,4,4V20A4.005,4.005,0,0,1,20,24ZM15.274,11.875c1.96,0,1.96,1.858,1.96,3.215V21H21l0-6.669c0-3-.547-5.776-4.516-5.776a3.977,3.977,0,0,0-3.567,1.96h-.053V8.86H9.248V21h3.766V14.988C13.014,13.448,13.282,11.875,15.274,11.875ZM3.3,8.861V21H7.07V8.861ZM5.184,3A2.194,2.194,0,1,0,7.367,5.183,2.186,2.186,0,0,0,5.184,3Z" transform="translate(1385 625)" fill="#ff9900"></path>
                          </g>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div> }
          </div>  */}

        
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
