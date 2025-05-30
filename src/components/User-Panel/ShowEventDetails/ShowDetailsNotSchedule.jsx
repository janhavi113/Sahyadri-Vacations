import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useForm } from "react-hook-form"
import './ShowEventDetails.css'
import Footer from "../../footer";
import ContactSection from "../ContactLogo/contactSection";
import Navbar from "../../Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCalendarDays, faLocationDot, faMountainSun } from '@fortawesome/free-solid-svg-icons';
import { Modal } from "react-bootstrap";
import "../../admin-panel/CreateEvent/CreateEvents.css"
import tripType from '../../Images/type.svg'
import duration from '../../Images/duration.svg'
import distance from '../../Images/distance.svg'
import endurance from '../../Images/endurance.svg'
import locationicon from '../../Images/location.svg'
import MinimalCoupons from './MinimalCoupons';
import CircularLoading from '../Loading/CircularLoading';
import "../../Modal.css";
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import DatePicker from "react-datepicker";
import { isWeekend } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CollapsibleSection from './CollapsibleSection';
import "react-datepicker/dist/react-datepicker.css";
const ShowDetailsNotSchedule = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryParameters = new URLSearchParams(window.location.search);
  const [type, setType] = useState(queryParameters.get("eventid"));
  const [params, setParams] = useState(type.split('/'));
  const [isSuccess, setSuccess] = useState(false);
  const [inquery, setInquery] = useState(false);
  const [buttonClick, setButtonClick] = useState(null);
  const [everyWeekend, setEveryWeekend] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [pickupPoints, setPickupPoints] = useState([]);
  const [pickupPointsfromMumbai, setPickupPointsfromMumbai] = useState([]);
  const [b2bLocation, setB2bLocation] = useState();
  const [price, setPrice] = useState(0);
  const [priceMumbai, setPricePuneMumbai] = useState(0);
  const [pricePune, setPricePune] = useState(0);
  const [priceBase2Base, setPriceBase2Base] = useState(0);
  const [coupleRoom, setCoupleRoom] = useState(0);
  const [ACUpgrad, setACUpgrad] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [eventType, setEventType] = useState();
  const [currentEventId, setCurrentEventId] = useState();
  const [show, setShow] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState('false');
  const [loading, setLoading] = useState(false);
  const[batchFull,setBatchFull] = useState(false);
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();


  const displayList = (data) => {
    var splitedList;
    splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
    splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
    let s = splitedList;
    splitedList = s.includes('?') ? splitedList.replaceAll('?', '? <br>') : splitedList;
    splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
    splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
    splitedList = splitedList.replaceAll('<a href="', '<a class="link-show" href="');
    return splitedList;
  }

  const getNextBatchDate = async (event) => {
    let batchdate;
    let batchSize = -1;
    let bookedSize = 0;
    let b2bPrice = 0;
    let eventCostPerPerson = 0;
    let eventCostPerPersonFromMumbai = 0;
    let batchDates = [];
    let batchesList = [];
    let eventType = event[0]?.eventType;
    let eventEndDate;
    let eventStartDate;
    let partialBookingAmount = 3000;
    let doubleSharing = 0;
    let doubleSharingNote = '';
    let tripalSharing = 0;
    let tripalSharingNote = '';
    let thirdAcUpgrate = 0;
    let thirdAcUpgrateNote = '';
    let note = '';
    let isBatchFull = false;
    setEventType(eventType);
    let eventCostPerPersonTemp;
    let eventCostPerPersonFromMumbaiTemp;
    let b2bPriceTemp;

      for (let index = 0; index < event.length; index++) {
        batchSize = 0;
        bookedSize = 0;
        eventCostPerPerson = 0;
        eventCostPerPersonFromMumbai = 0;
        b2bPrice = 0;
        batchdate = '';
        doubleSharing = 0;
        doubleSharingNote = '';
        tripalSharing = 0;
        tripalSharingNote = '';
        thirdAcUpgrate = 0;
        thirdAcUpgrateNote = '';
        note = '';
        
        
       if (event[index].notScheduleYet == true) {
          batchdate = 'On Demand';
          setInquery(true);
          eventCostPerPerson = event[index]?.eventCostPerPerson;
          eventCostPerPersonFromMumbai = event[index]?.eventCostPerPersonFromMumbai;
          b2bPrice = event[index]?.b2bPrice;
          batchSize = event[index]?.eventBatchCount;
          bookedSize = event[index]?.alreadyBoockedCount;
          partialBookingAmount = event[index]?.partialBookingAmount;
          doubleSharing = event[index]?.doubleSharing;
          doubleSharingNote = event[index]?.doubleSharingNote;
          tripalSharing = event[index]?.tripalSharing;
          tripalSharingNote = event[index]?.tripalSharingNote;
          thirdAcUpgrate = event[index]?.thirdAcUpgrate;
          thirdAcUpgrateNote = event[index]?.thirdAcUpgrateNote;
          note = event[index]?.note;
        }
    
        if (batchSize > 0 && eventCostPerPerson > 0 && batchdate != '') {
          batchesList.push({
            batchSize: batchSize,
            bookedSize: bookedSize,
            eventCostPerPerson: eventCostPerPerson,
            batchdate: batchdate,
            eventEndDate: eventEndDate,
            eventStartDate: eventStartDate,
            eventCostPerPersonFromMumbai: eventCostPerPersonFromMumbai,
            b2bPrice: b2bPrice,
            eventId: event[index].eventId,
            partialBookingAmount: partialBookingAmount,
            doubleSharing: doubleSharing,
            doubleSharingNote: doubleSharingNote,
            tripalSharing: tripalSharing,
            tripalSharingNote: tripalSharingNote,
            thirdAcUpgrate: thirdAcUpgrate,
            thirdAcUpgrateNote: thirdAcUpgrateNote,
            note: note,
          })
        }

       if (event[index].notScheduleYet == true) {
          batchDates.push('On Demand');
        }
      }
   
    if ((event.length == 1 || event.length == 0 ) && batchesList.length <= 0) {
      setButtonDisabled('true');
      setBatchFull(true);
      isBatchFull = true;
    } 
    let ACUpgradTemp = 0;
    let coupleRoomTemp = 0;
    if (batchesList.length > 0) {    
      setBatchDate(batchesList[0].batchdate);
      eventCostPerPersonTemp = batchesList[0].eventCostPerPerson;
      eventCostPerPersonFromMumbaiTemp = batchesList[0].eventCostPerPersonFromMumbai;
      b2bPriceTemp = batchesList[0].b2bPrice;
      setButtonDisabled('false');
      coupleRoomTemp = batchesList[0].doubleSharing;
      ACUpgradTemp = batchesList[0].thirdAcUpgrate;
    }
 
    if(isBatchFull == true){
      eventCostPerPersonTemp = eventCostPerPerson;
      eventCostPerPersonFromMumbaiTemp = eventCostPerPersonFromMumbai ;
      b2bPriceTemp = b2bPrice;
    }
  
    let tempPrice = Math.min(...[eventCostPerPersonTemp, eventCostPerPersonFromMumbaiTemp, b2bPriceTemp].filter(price => price > 0));
    setPrice(tempPrice);
    setPricePuneMumbai(eventCostPerPersonFromMumbaiTemp);
    setPricePune(eventCostPerPersonTemp); 
    setPriceBase2Base(b2bPriceTemp);
    setCoupleRoom(coupleRoomTemp);
    setACUpgrad(ACUpgradTemp);
    }

  useEffect(() => {
    if (isSuccess == false && type && params) {
      getAllRecord();
    }
  })


  const getAllRecord = async () => {
    setLoading(true);
    let r = await fetch(`${apiUrl}event-details/eventid/${params[0]}/${params[1]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    setCurrentEventId(params[0]);
    let res = await r.json();
    if (res.isSuccess == true) {
      setLoading(false);
      setSuccess(true);
      setEventDetails(res.events);      
      setB2bLocation(res.events.b2bLocaion);
      getNextBatchDate(res.ScheduleBatchesRecords);
    }
  }

  return (
    <div>
      <Navbar />
      <div>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}

          modules={[Autoplay, Pagination, Navigation]}
        >
          {isSuccess && eventDetails.images.map((event, index) => (

            <SwiperSlide key={index}><img className='event-section-header-img' loading="lazy" src={`${apiUrl}` + event} />
              <div className="inner-content">
                <h3>{eventDetails.name}</h3>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>
      {loading ? (
        <CircularLoading />
      ) : (<>
        {isSuccess &&
          <div>
            <div className="content-row row2">
              <div>
                <nav id="navbar-example2" className="nav-color d-none d-md-none d-lg-block panel-heading tab-bg-info px-2 ">
                  <ul className="nav nav-tabs">
                    <li >
                      <a className="nav-link" href="#scrollspyHeading1"> OVERVIEW </a>
                    </li>
                    <li >
                      <a className="nav-link" href="#scrollspyHeading2"> ITINERARY </a>
                    </li>
                    <li >
                      <a className="nav-link" href="#scrollspyHeading3"> HIGHLIGHTS </a>
                    </li>
                    <li >
                      <a className="nav-link" href="#scrollspyHeading4"> COST INCLUDES </a>
                    </li>
                    {eventType != 'CampingEvent' && <li >
                      <a className="nav-link" href="#scrollspyHeading6"> PICKUP POINTS </a>
                    </li>
                    }
                  </ul>
                </nav>
                <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example  p-3 rounded-2" tabIndex="0">
                  <div id="scrollspyHeading1" className='pt-4 pb-1 px-2'>
                    <h2 className="h3"> Overview</h2>
                    <p>{eventDetails.eventDetails}</p>
                    <br />
                    <table className="event-details-table">
                      <tbody>
                        {/* Upcoming Batches */}
                        <tr >
                          <td className="tag-flex">
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              size="lg"
                              style={{ color: 'orange' }}
                            />
                            <span className="section-details-tag" style={{ marginTop: '-1px' }}>
                              Upcoming Batch: 
                            </span>
                            <span><b> On Demand</b></span>
                          </td>
                        </tr>

                        {/* Total Distance From */}
                        {eventDetails.totalDistance && (
                          <tr>
                            <td className="tag-flex">
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                size="lg"
                                style={{ color: 'orange' }}
                              />
                              <span className="section-details-tag" style={{ marginTop: '-1px' }}>
                                Total Distance:
                              </span>
                            </td>
                            <td className="section-details">
                              <p>{eventDetails.totalDistance}</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <br />
                    <h2 className="h3"> About {eventDetails.name}</h2>
                    <div>
                      <table className="event-details-table">
                        <tbody>
                          {eventDetails.location && (
                            <tr >
                              <td className="tag-flex">
                                <img
                                  src={locationicon}
                                  alt="Location icon"
                                  crossOrigin="anonymous"
                                />
                                <span className="section-details-tag"> Location :</span>
                              </td>
                              <td className="section-details">
                                <p>{eventDetails.location}</p>
                              </td>
                            </tr>
                          )}
                          {eventDetails.type && (
                            <tr >
                              <td className="tag-flex">
                                <img src={tripType} alt="Type icon" crossOrigin="anonymous" />
                                <span className="section-details-tag"> Type :</span>
                              </td>
                              <td className="section-details">
                                <p>{eventDetails.type}</p>
                              </td>
                            </tr>
                          )}
                          {eventDetails.elevation && (
                            <tr >
                              <td className="tag-flex">
                                <FontAwesomeIcon
                                  icon={faMountainSun}
                                  size="lg"
                                  style={{ color: "orange" }}
                                />
                                <span className="section-details-tag"> Elevation :</span>
                              </td>
                              <td className="section-details">
                                <p>{eventDetails.elevation}</p>
                              </td>
                            </tr>
                          )}
                          {eventDetails.difficulty && (
                            <tr >
                              <td className="tag-flex">
                                <img src={endurance} alt="Difficulty icon" crossOrigin="anonymous" />
                                <span className="section-details-tag"> Difficulty :</span>
                              </td>
                              <td className="section-details">
                                <p>{eventDetails.difficulty}</p>
                              </td>
                            </tr>
                          )}
                          {eventDetails.duration && (
                            <tr >
                              <td className="tag-flex">
                                <img src={duration} alt="Duration icon" crossOrigin="anonymous" />
                                <span className="section-details-tag"> Duration :</span>
                              </td>
                              <td className="section-details">
                                <p>{eventDetails.duration}</p>
                              </td>
                            </tr>
                          )}
                          {eventDetails.trekDistance && (
                            <tr >
                              <td className="tag-flex">
                                <img
                                  src={distance}
                                  alt="Distance icon"
                                  crossOrigin="anonymous"
                                />
                                <span className="section-details-tag">Trek Distance :</span>
                              </td>
                              <td className="section-details">
                                <p>{eventDetails.trekDistance}</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <hr />
                  <div id="scrollspyHeading3" className='pt-4 pb-1 px-2'>
                    <h2 className="h3"> Event Fees</h2>
                     <table className="pricing-table">
                     <tr>
                        <th>Charges</th>
                        <th>Price</th> 
                      </tr>
                      {priceBase2Base > 0 && <tr>
                        <td>{b2bLocation} (Without Transport)</td>
                        <td>{priceBase2Base}</td>
                      </tr> }
                      {pricePune > 0  && <tr>
                        <td>Pune to Pune</td>
                        <td>{pricePune}</td>
                      </tr> }                     
                      {priceMumbai > 0  && <tr>
                        <td> Mumbai to Mumbai</td>
                        <td>{priceMumbai}</td>
                      </tr> }
                      {coupleRoom > 0 && <tr>
                        <td> Separate Room for two people (AddOn) </td>
                      <td>{coupleRoom}</td>
                      </tr> 
                        }
                        {ACUpgrad > 0 && <tr>
                        <td> 3 Tier AC Train Travel (AddOn)  </td>
                      <td>{ACUpgrad}</td>
                      </tr> }
                     </table>
                  </div>
                  <div id="scrollspyHeading2" className='pt-4 pb-1 px-2'>
                    <h2 className="h3"> Itinerary</h2>
                    <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.itinerary) }} />
                  </div>
                  <hr />
                  {eventDetails.highlights != '' && eventDetails.highlights != 'undefined' &&
                    <div id="scrollspyHeading3" className='pt-4 pb-1 px-2'>
                      <h2 className="h3"> Highlights</h2>
                      <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.highlights) }} />
                    </div>
                  }
                  <hr />
                  <div id="scrollspyHeading4" className='pt-4 pb-1 px-2'>
                    <h2 className="h3"> Cost Includes</h2>
                    <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.costIncludes) }} />
                  </div>
                  <hr />
                  <div id="scrollspyHeading4" className="pt-4 pb-1 px-2">
                    <h2 className="h3">Cost Excludes </h2>
                    {eventDetails.costExcludes &&
                      <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.costExcludes) }} />}
                    {!eventDetails.costExcludes &&
                      <div className="section-details">
                        <ul className="display-bulletin">
                          <li>Anything not mentioned above</li>
                          <li>Mineral water/lime water/purchased for personal consumption</li>
                          <li>All expenses incurred due to unforeseen and unavailable circumstances like roadblocks, bad weather</li>
                          <li>Any medical/ Emergency evacuations if required</li>
                        </ul>
                      </div>
                    }
                  </div><hr />
                                  
                  <div>
                    <div id="scrollspyHeading6" className='pt-4 pb-1 px-2'>
                      <h2 className="h3">THINGS TO KNOW</h2>
                    </div>
                    <CollapsibleSection title="THINGS TO CARRY">
                      {eventDetails.thingsToCarry &&
                        <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.thingsToCarry) }} />}
                      {!eventDetails.thingsToCarry && <ul className="display-bulletin-collaps">
                        <li>Torch (optional)</li>
                        <li>Please wear full pants and full sleeves t-shirts to protect from tanning, thorns, insects during the trek</li>
                        <li>Snacks (Energy bars, Chikki, Biscuits, Sprouts, Chips, Dry fruits)</li>
                        <li>Glucon D/Protein shakes/ORS</li>
                        <li>Extra pair of clothes</li>
                        <li>2/3 litres of water (Mandatory)</li>
                        <li>Any personal medicines</li>
                        <li>Good grip trekking shoes</li>
                        <li>Suncap & Sunscreen</li>
                        <li>Rain are expected so please carry a raincover / Jacket & cover your phones also in a plastic cover</li>
                      </ul>
                      }
                    </CollapsibleSection>

                    <CollapsibleSection title="TERMS AND CONDITIONS">

                      <ul className="display-bulletin-collaps">
                        <li>You will have to pay full amount of that event before departure, without it your booking will not be confirmed.</li>
                        <li>The advance amount paid would not be refunded in any case, except if the trek/tour departure is cancelled by our side.</li>
                        <li>Please confirm seats availability on call before paying any amount.</li>
                        <li>Make sure you are added in the WhatsApp group 6-8 hours prior to the trip for all the details.</li>
                        <li>Food and Stay arrangements are as per the availability of that locations.Kindly don't expect it too luxurious.</li>
                        <li>Backpacking treks/trips are are arranged for the people who are looking for pocket friendly trips,They are more about chasing experiences.</li>
                        <li>We need at least 12-14 travelers to run that particular event, if batch size is not enough then Organisors have all right to Collabe with other Travel companies,Postpone or Cancel the event.; .</li>
                        <li>A waiver/consent form must be filled before departure.</li>
                        <li>Your payment implies that you have read and accept our terms and conditions.</li>
                      </ul>

                    </CollapsibleSection>

                    <CollapsibleSection title="CANCELLATION POLICY">

                      <ul className="display-bulletin-collaps">
                        <li>75% refund if notified 8 or more days before the event.</li>
                        <li>50% refund if notified 4 to 7 days before the event.</li>
                        <li>No refund if less than 3 days before the event.</li>
                        <li>No-show results in no refund.</li>
                        <li>Event tickets cannot be transferred to another date.</li>
                        <li>Tickets can be transferred to another person for the same event only.</li>
                        <li>If the trek is cancelled, only the trek amount will be refunded.</li>
                      </ul>
                    </CollapsibleSection>

                    <CollapsibleSection title="FAQ's">
                      {eventDetails.FAQ &&
                        <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.FAQ) }} />}
                      {!eventDetails.FAQ && (
                        <ol className="display-bulletin-collaps">
                          <li><b>What type of bus is provided?</b> <br></br> A NON-AC Tempo Traveller/ 32 seater bus are used with descent seating comfort.</li>
                          <li><b>Can I cancel my booking?</b> <br></br> Please refer the cancellation policy.</li>
                          <li><b>How many trek leaders will be available?</b><br></br> There will be 1 trek leader for every 8-10 people.</li>
                          <li><b>How do I get in touch with trek leaders?</b><br></br>  We add participants to a WhatsApp group 5-6 hours prior to the event to provide further details.</li>
                          <li><b>What is prohibited on this trek?</b> <br></br> Smoking, drinking, and loud music are prohibited.</li>
                          <li><b>Are changing rooms provided?</b> <br></br> Separate changing rooms are there as per availability on that location.</li>
                          <li><b>Are washrooms available?</b><br></br>  Washrooms are available at the base village only.</li>
                          <li><b>Is the trek safe for girls?</b><br></br>  Yes,This trek is absolutely safe for girls.We have seprate female volunteer to take care of them</li>
                          <li><b>Is there a way to charge my phone ?</b> <br></br> There is no electricity,You can bring a power bank with you.</li>
                          <li><b>Can I come alone ?</b> <br></br> Yes,You can join as a Solo Traveller.</li>
                          <li><b>Waht about extra baggage ?</b> <br></br> You can safely keep your bags in bus.</li>
                          <li><b>Can I join this trek if I have no prior trekking experience ?</b> <br></br> You can contact us before booking ,Our team will assist you regarding difficulty level.</li>
                        </ol>
                      )}

                    </CollapsibleSection>
                  </div>
                </div>
              </div>
              {/* button section for desktop*/}
              <div className="content-right-side col-sm-12 col-md-4  col-lg-4 col-xl-4 ">
                <div className="container sticky-top" >
                  <div className="justify-content-md-center">
                    <div className="col-lg-12 d-none d-md-none d-lg-block">
                      <div className="booking-card mb-3 " >
                        <div className="card-body text-dark">
                          <h4 className="details-card-title"><center>
                            <span><b>Starts@ </b></span>
                            <b className='event-price'>₹ {price} /</b>
                            <sub > Person</sub>
                          </center>
                          </h4>                         
                          {buttonDisabled == 'true' &&
                            <div className="button-margin button">
                              <button type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>
                            </div>
                          }
                          {inquery &&
                            <div>
                               <div className="button-margin button">
                                <button type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>
                              </div>
                            </div>
                          }
                          <br />
                          <div className='card-info'><FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Best Price Guaranteed <br /> <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> Secure & Easy Booking
                            <br />
                            <FontAwesomeIcon icon={faSun} size="xs" style={{ color: "gray", }} /> 8000+ Happy Customers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              {/* button section for mobile */}
            <div className="d-sm-block d-md-none d-lg-none fixed-bottom">
              <div className="booking-card-mb mb-0 " style={{ "width": "100%" }}>
                <div className="card-body text-dark">
                  <div className="booking-section d-flex justify-content-between align-items-center">
                    <h4 className="details-card-title"><center>
                      <span>Starts@ </span>
                      <b className='event-price'>₹{price} / </b>
                      <sub >Per Person</sub>
                    </center>
                    </h4>
                    <div>
                      <center> {batchDate} </center>
                    </div>
                  </div>
                  
                  <div className="button-edit-container">
                    <div className="button button-margin ">
                     {inquery &&
                        <button type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>
                      }
                      <button type="button"><a href="tel:07028740961"> <strong>&nbsp;CALL NOW </strong></a> </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <div>
        </div >
        {show == false && <ContactSection />}

        <Footer />
      </>
      )}
    </div >
  )
}

export default ShowDetailsNotSchedule
