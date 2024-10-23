import React, { useRef, useEffect, useState } from 'react';
import './DirectBooking.css'
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCirclePlus, faCircleMinus, faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import "../CreateEvent/CreateEvents.css"
import "../../Modal.css";
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import DatePicker from "react-datepicker";
import { addDays, isWeekend } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
const DirectBookings = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [locationsArray, setLocationsArray] = useState();
  const queryParameters = new URLSearchParams(window.location.search);
  const [startDate, setStartDate] = useState(new Date());
  const [params, setParams] = useState();
  const [isSuccess, setSuccess] = useState(false);
  const [inquery, setInquery] = useState(true);
  const [everyWeekend, setEveryWeekend] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [pickupPoints, setPickupPoints] = useState([]);
  const [eventPickupPoints, setEventPickupPoints] = useState([]);
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [scheduleBatch, setScheduleBatch] = useState();
  const [participants, setParticipants] = useState([]);
  const [availableBatches, setAvailableBatches] = useState();
  const [price, setPrice] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isBookingConfirmed, setBookingConfirmed] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [events, setEvent] = useState();
  const handleDateChange = (date) => {
    setSelectedDate(date);
  }
  const isWeekendDay = (date) => {
    return isWeekend(date);
  }
  const filterWeekends = (date) => {
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
    // ////console.log('---data---'+data);

    let r = await fetch(`${apiUrl}booking`, {
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(data)
    })
    let res = await r.json()
    // ////console.log('res', JSON.stringify(res));
    if (res.isSuccess == true) {
      setBookingConfirmed(true);
    }
  }

  const handleSelection = (event) => {
    setSelectedLocation(event.target.value);
  };

  const increaseCount = async () => {
    console.log('availableSlot--', availableSlot);
    console.log('noOfTrekkers--', noOfTrekkers);
    if (availableSlot > noOfTrekkers) {
      let count = noOfTrekkers;
      let price1 = price;
      count++;
      setNoOfTrekkers(count);
      setFinalPrice(price1 * count);
      setParticipants([...participants, { name: '', whatsapp: '', pickup: '' }]);
    }
  }

  const decreaseCount = async () => {
    if (noOfTrekkers > 0) {
      let count = noOfTrekkers;
      let price1 = price;
      count--;
      setNoOfTrekkers(count);
      setFinalPrice(price1 * count);
      setParticipants(participants.slice(0, -1));
    }
  }
  const handleParticipantChange = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

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
    ////console.log('event--', event);
    let batchdate;
    let batchSize = -1;
    let eventCostPerPerson;
    let batchDates = [];
    let eventType = event.eventType;
    const Q = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let i = 0; i < event.batches.length; i++) {
      ////console.log('event.batches[' + i + ']--', event.batches[i]);
      if (batchSize == -1 && new Date(event.batches[i].eventStartDate) - Q >= 0 && event.batches[i].eventBatchCount > 0) {
        batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear();
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
      } else if (event.batches[i].everyWeekend == true) {
        batchdate = 'Available On All Weekends';
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
        setEveryWeekend(true);
      }
      else if (event.batches[i].notScheduleYet == true) {
        batchdate = 'On Demand';

        setInquery(true);

        eventCostPerPerson = event.batches[i].eventCostPerPerson;
        batchSize = event.batches[i].eventBatchCount;
      }
      if (event.batches[i].everyWeekend == false && event.batches[i].notScheduleYet == false) {
        batchDates.push(new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear());
      } else if (event.batches[i].notScheduleYet == true) {
        batchDates.push('On Demand');
      } else if (event.batches[i].everyWeekend == true) {
        batchDates.push('Available On All Weekends');
      }
    }
    // ////console.log('batchDates --- ' + batchDates);
    if (batchdate && eventCostPerPerson) {
      setAvailableBatches(batchDates);
      setPrice(eventCostPerPerson);
      setBatchDate(batchdate);
      setAvailableSlot(batchSize);
      setFinalPrice(eventCostPerPerson);

    }
  }

  useEffect(() => {
    if (isSuccess == false) {
      getCurrentrecord();
    }
  })

  function convertHtmlToJSON(htmlString) {
    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Select all the <li> elements from the temporary DOM
    let listItems = tempDiv.querySelectorAll('li');
    if (listItems.length <= 0) {
      listItems = tempDiv.querySelectorAll('p');
    }

    const locations = [];

    listItems.forEach((item, index) => {
      // Extract the text content, which is in the form "Location : Time"
      const [name, time] = item.textContent.split(' : ');
      // Create the object for each location and push it into the array
      locations.push({
        id: index + 1,
        name: name != undefined ? name.trim() : '',
        time: time != undefined ? time.trim() : ''
      });
    });

    return locations;
  }

  const getCurrentrecord = async () => {
    let r = await fetch(`${apiUrl}schedule-event`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    if (res.isSuccess == true) {
      setSuccess(res.isSuccess);
      setEventDetails(res.events);
      setEvent(res.scheduleBatches);
    }
  }

  function handleSelectEventChange(e) {

    let eventId = e.target.value;
    const scheduleBatches = events.find(e => e.eventId == eventId);
    console.log('scheduleBatches---', scheduleBatches);
    setAvailableSlot(scheduleBatches.eventBatchCount);
    let eventApi = scheduleBatches.eventApi;
    const event = eventDetails.find(e => e.apiname == eventApi);
    const jsonData = convertHtmlToJSON(event.pickupPoints);
    setEventPickupPoints(jsonData);

  }
  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="direct-bookings-form container">

          <div className="title-header">BOOKING SUMMERY<br />
            <div className='booking-header'>
              {/* {eventDetails.name} */}
            </div>
          </div>

          <div className="content">
            {isSubmitting && <div>Loading...</div>}

            <div className="user-details">
              {isSuccess &&

                <div className="input-box ">
                  <span className="details">Event Name</span>
                  <select  {...register("Event")} onChange={handleSelectEventChange}>
                    {events.map(event => {
                      // Format the start and end dates to show only the date part
                      const formattedStartDate = new Date(event.eventStartDate).toLocaleDateString() == 'Invalid Date' ? '' : ' : ' + new Date(event.eventStartDate).toLocaleDateString() + ' - ';
                      const formattedEndDate = new Date(event.eventEndDate).toLocaleDateString() == 'Invalid Date' ? '' : new Date(event.eventEndDate).toLocaleDateString();

                      return (
                        <option value={event.eventId} key={event.eventId}>
                          {event.eventname} {formattedStartDate} {formattedEndDate}
                        </option>
                      );
                    })}
                  </select>
                </div>

              }
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
              {/* {!everyWeekend && <div className="input-box">
                <span className="details">Select Batch</span>
                <select  {...register("selectDate", { required: { value: true, message: "This field is required" }, })} required>
                  {availableBatches && availableBatches.map((event, index) => (
                    <option key={index} value={event} >{event}</option>
                  ))}
                </select>
              </div>}
              {everyWeekend && <div className="input-box">
                <span className="details">Select Batch</span>
                <DatePicker placeholder="Select Date" selected={selectedDate} filterDate={filterWeekends} onChange={handleDateChange} />
              </div>} */}

              <div>
                <h3>Select a Location:</h3>
                <ul>
                  {eventPickupPoints.map((location) => (
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
                </ul>
              </div>


              <div className="input-box finalCalculation">
                <div className="details">Number of Participents</div>
                <div></div>
                <div className='noOftrekkers'>
                  <span onClick={decreaseCount}>  <FontAwesomeIcon icon={faCircleMinus} size="lg" style={{ color: "orange", }} /></span>
                  {noOfTrekkers}
                  <span onClick={increaseCount}><FontAwesomeIcon icon={faCirclePlus} size="lg" style={{ color: "orange", }} /></span>
                </div>
              </div>
              {/* Render input fields for each participant */}
              {participants.map((participant, index) => (
                <div key={index} className="participant-inputs">
                  <input
                    type="text"
                    placeholder="Name"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp Number"
                    value={participant.whatsapp}
                    onChange={(e) => handleParticipantChange(index, 'whatsapp', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Pickup Location"
                    value={participant.pickup}
                    onChange={(e) => handleParticipantChange(index, 'pickup', e.target.value)}
                  />
                </div>
              ))}
              <div className='hr'></div>

              <div className='finalCalculation'>
                <span >Total Payment</span>
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
