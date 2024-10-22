import React, { useRef, useEffect, useState } from 'react';
import './DirectBooking.css'
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCirclePlus, faCircleMinus, faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import "../admin-panel/CreateEvent/CreateEvents.css"
import "../Modal.css";
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import DatePicker from "react-datepicker";
import {addDays ,isWeekend } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
const DirectBookings = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationsArray ,setLocationsArray] = useState();
  const queryParameters = new URLSearchParams(window.location.search);
  const [startDate, setStartDate] = useState(new Date());
  const [params, setParams] = useState();
  const [isSuccess, setSuccess] = useState(false);
  const [inquery, setInquery] = useState(true);
  const [everyWeekend, setEveryWeekend] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const[pickupPoints , setPickupPoints] = useState([]);
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [scheduleBatch, setScheduleBatch] = useState();
  const [availableBatches, setAvailableBatches] = useState();
  const [price, setPrice] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate , setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isBookingConfirmed, setBookingConfirmed] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  }
  const isWeekendDay = (date) =>{
    return isWeekend(date);
  }
  const filterWeekends = (date) =>{
    return isWeekendDay(date);
  }
  const toggleModal = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };
  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const onSubmit = async (data) => {
    const formData = new FormData();
    data.numberOfPeoples = noOfTrekkers;
    data.amountPaid = finalPrice;
    data.eventId = eventDetails.eventId;
  //  data.eventName = eventDetails.name;
    data.batch = selectedDate;
    data.pickupLocation = selectedLocation;
   // console.log('---data---'+data);
   
    let r = await fetch(`${apiUrl}booking`, {
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(data)
    })
    let res = await r.json()
   // console.log('res', JSON.stringify(res));
   if (res.isSuccess == true) {
    setBookingConfirmed(true);
  }
  }

  const handleSelection = (event) => {
    setSelectedLocation(event.target.value);
  };

  const increaseCount = async () => {
    if (availableSlot > noOfTrekkers) {
      let count = noOfTrekkers;
      let price1 = price;
      count++;
      setNoOfTrekkers(count);
      setFinalPrice(price1 * count);
    }
  }
  
  const decreaseCount = async () => {
    if (noOfTrekkers > 0) {
      let count = noOfTrekkers;
      let price1 = price;
      count--;
      setNoOfTrekkers(count);
      setFinalPrice(price1 * count);
    }
  }

  const onAutoplayTimeLeft = (s, time, progress) => {
    // progressCircle.current.style.setProperty('--progress', 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const displayList = (data) => {
    var splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
    splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
    splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
    splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
    return splitedList;
  }

  const getNextBatchDate = (event) => {
    console.log('event--', event);
    let batchdate;
    let batchSize = -1;
    let eventCostPerPerson;
    let batchDates = [];
    let eventType = event.eventType;
    const Q = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let i = 0; i < event.batches.length; i++) {
     console.log('event.batches[' + i + ']--' ,  event.batches[i]);
      if (batchSize == -1 && new Date(event.batches[i].eventStartDate) - Q >= 0 && event.batches[i].eventBatchCount > 0) {
        batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear();
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
      }else if(event.batches[i].everyWeekend == true){
        batchdate ='Available On All Weekends';
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
        setEveryWeekend(true);
      }
      else if(event.batches[i].notScheduleYet == true){
        batchdate ='On Demand';
        
        setInquery(true);

        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
      }
      if(event.batches[i].everyWeekend == false && event.batches[i].notScheduleYet == false){
       batchDates.push(new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear());
       }else if(event.batches[i].notScheduleYet == true){
        batchDates.push('On Demand');
       }else if(event.batches[i].everyWeekend == true){
        batchDates.push('Available On All Weekends');
       }
  }
   // console.log('batchDates --- ' + batchDates);
    if (batchdate && eventCostPerPerson) {
      setAvailableBatches(batchDates);
      setPrice(eventCostPerPerson);
      setBatchDate(batchdate);
      setAvailableSlot(batchSize);
      setFinalPrice(eventCostPerPerson);

    }
  }

  useEffect(() => {
    if (isSuccess == false ) {
      getAllRecord();
    }
  })

  function convertHtmlToJSON(htmlString) {
    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
  
    // Select all the <li> elements from the temporary DOM
    const listItems = tempDiv.querySelectorAll('li');
    const locations = [];
  
    listItems.forEach((item, index) => {
      // Extract the text content, which is in the form "Location : Time"
      const [name, time] = item.textContent.split(' : ');
       
      // Create the object for each location and push it into the array
      locations.push({
        id: index + 1,
        name: name!= 'undefine' ? name.trim() : '',
        time: name!= 'undefine' ? time.trim() : ''
      });
    });
  
    return locations;
  }
  
  const getAllRecord = async () => {
    let r = await fetch(`${apiUrl}show-all-events`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    // console.log( 'res ',res);
    if (res.isSuccess == true) {
      setSuccess(true);
      console.log('eventDetails --', res);
     // 
      setEventDetails(res.events);
      if(res.events.pickupPoints != null && res.events.pickupPoints != 'undefine'){
      const jsonData = convertHtmlToJSON(res.events.pickupPoints);
      setPickupPoints(jsonData);
      }
      setScheduleBatch(res.ScheduleBatchesRecords);

      getNextBatchDate(res.ScheduleBatchesRecords);

      //// console.log('scheduleBatch',scheduleBatch );
    }

  }
  return (
    <div>
       
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="container">
             
                <div className="title-header">BOOKING SUMMERY<br />
                  <div className='booking-header'>
                    {/* {eventDetails.name} */}
                  </div>
                </div>
          
                <div className="content">
                  {isSubmitting && <div>Loading...</div>}
                  <div className="user-details">
                    <div className="input-box ">
                      <span className="details">Full Name</span>
                      <input {...register("fullName", { required: { value: true, message: "This field is required" }, })} type="text" required />
                    </div>
                    <div className="input-box ">
                      <span className="details">Email ID</span>
                      <input  {...register("emailId", { required: { value: true, message: "This field is required" }, })} type="email" required />
                    </div>
                    <div className="input-box">
                      <span className="details">WhatsApp Mobile Number</span>
                      <input placeholder='+91'{...register("whatsappNumber", { required: { value: true, message: "This field is required" }, })} type="tel" required />
                    </div>
                    { !everyWeekend && <div className="input-box">
                      <span className="details">Select Batch</span>
                      <select  {...register("selectDate", { required: { value: true, message: "This field is required" }, })} required>
                        {availableBatches && availableBatches.map((event, index) => (
                          <option key={index} value={event} >{event}</option>
                        ))}
                      </select>
                     </div>}
                    { everyWeekend && <div className="input-box">
                      <span className="details">Select Batch</span>
                      <DatePicker placeholder="Select Date" selected={selectedDate} filterDate={filterWeekends} onChange={handleDateChange}  />
                    </div> }

                    <div>
                    <h3>Select a Location:</h3>
                    {/* <ul>
                      {pickupPoints.map((location) => (
                        <li key={location.id}>
                          <label className='radio-display'>
                            <input
                              type="radio"
                              name="location"
                              value={location.name}
                              onChange={handleSelection}
                              checked={selectedLocation === location.name}
                            />
                            {location.name} : {location.time}
                          </label>
                        </li>
                      ))}
                    </ul> */}
                    </div>
                  

                    <div className="input-box finalCalculation">
                      <div className="details">Number of Trekkers</div>
                      <div></div>
                      <div className='noOftrekkers'>
                        <span onClick={decreaseCount}>  <FontAwesomeIcon icon={faCircleMinus} size="lg" style={{ color: "orange", }} /></span>
                        {noOfTrekkers}
                        <span onClick={increaseCount}><FontAwesomeIcon icon={faCirclePlus} size="lg" style={{ color: "orange", }} /></span>
                      </div>
                    </div>
                    <div className='hr'></div>

                    <div className='finalCalculation'>
                      <span >Total To Pay</span>
                      <span></span>
                      <span >₹{finalPrice} /-</span>
                    </div>
                  </div>
                </div>
             
                <div className='termsAndCondition'>
                  <input type="checkbox"  {...register("termsAndconditions", { required: { value: true, message: "This field is required" }, })} required />
                  <div >
                    Accept all
                    <a className='link' href='http://localhost:5173/user-agreement' target="_blank"> terms & conditions</a>
                  </div>
                </div>
                <div className="button">
                  <input disabled={isSubmitting} type="submit" value="Submit" />
                </div>
             
            </div>
          </form>
     
    </div>
  )
}

export default DirectBookings
