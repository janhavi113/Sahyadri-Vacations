import React, { useRef, useEffect, useState, useCallback } from "react";
import "./DirectBooking.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleMinus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../CreateEvent/CreateEvents.css";
import "../../Modal.css";
// Import Swiper styles
import "swiper/css/bundle";
// import required modules
import "react-datepicker/dist/react-datepicker.css";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
const DirectBookings = ({ onSendData }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [eventName, setEventName] = useState();
  const [isSuccess, setSuccess] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [eventPickupPoints, setEventPickupPoints] = useState([]);
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [price, setPrice] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [pickupPointsfromMumbai, setPickupPointsfromMumbai] = useState([]);
  const [b2bLocation, setB2bLocation] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isBookingConfirmed, setBookingConfirmed] = useState(false);
  const [events, setEvent] = useState();
  const [file, setFile] = useState(null); // State to store uploaded file
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
  const [showLocations, setShowLocations] = useState([]);
  const [selected, setSelected] = useState('Pune to Pune');
  const [eventType, setEventType] = useState();
  const [selectedBatch, setSelectedBatch]  = useState();
  const [participantsPickupPoints, setParticipantsPickupPoints] = useState([]);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();
  const handleSelect = (option) => {
    setSelected(option);
  }
  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file), // Create a preview URL for the image
      })
    );
    setUploadedFiles((prev) => [...prev, ...newFiles]); // Add new files to the uploaded files state
    clearErrors("dropzone");
  };
  const [selectedDate, setSelectedDate] = useState(null);
  const removeFile = (file) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== file)); // Remove the file from the state
  };

  const onSubmit = async (data) => {
    console.log('selectedBatch---',Number(selectedBatch.eventCostPerPerson));
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.emailId);
    formData.append("mobileNumber", data.whatsappNumber);
    formData.append("batch", batchDate);
    formData.append("eventId", data.Event);
    formData.append("eventName", eventName);
    formData.append("numberOfPeoples", noOfTrekkers);
    formData.append("amountPaid", data.amountPaid);
    formData.append("remainingAmount", (Number(finalPrice) - Number(data.amountPaid) - Number(data.Discount)).toFixed(2));
   // formData.append("packageGiven",Number(data.finalPrice));
    formData.append("eventPrice",Number(selectedBatch.eventCostPerPerson));
    formData.append("bookingMode", 'Direct Booking ');
    formData.append("paymentMethod", data.paymentMethod);
    formData.append("transactionId", data.transactionId);
    formData.append("addedDiscount", data.Discount);
    formData.append("pickupLocation", selectedLocation);
    formData.append("eventStartDate",selectedBatch.eventStartDate);
    formData.append("eventEndDate",selectedBatch.eventEndDate);
    const today = new Date();
    formData.append("bookingDate", today);
    formData.append("otherParticipants", JSON.stringify(participants));
    let r = await fetch(`${apiUrl}direct-booking`, {
      method: "POST",
      body: formData,
    });
    let res = await r.json();
    if (res.isSuccess == true) {
      setBookingConfirmed(true);
      onSendData(res);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSelection = (event) => {
    setSelectedLocation(event.target.value);
  };

  const increaseCount = async () => {
    if (availableSlot > noOfTrekkers) {
      let count = noOfTrekkers;
      let price1 = price;
      count++;
      let convenienceFee = (Number(price1) * Number(count) * 0.0199).toFixed(2);
      let totalPrice = (Number(price1) * Number(count));
      let final_Price = Number(totalPrice);
      setNoOfTrekkers(count);
      setFinalPrice(final_Price);
      setParticipants([
        ...participants,
        { name: "", mobileNumber: "", pickupLocation: "" },
      ]);
    }
  };

  const decreaseCount = async () => {
    if (noOfTrekkers > 0) {
      let count = noOfTrekkers;
      let price1 = price;
      count--;
      let amount = Number(price1) * Number(count);
      let convenienceFee = (Number(amount) * 0.0199).toFixed(2);
      let final_Price = Number(amount);
      setNoOfTrekkers(count);
      setFinalPrice(final_Price);
      setParticipants(participants.slice(0, -1));
    }
  };

  const handleParticipantChange = (index, field, value) => {
    if (field == 'locationCity') {
      //console.log('pickupPoints---',pickupPoints);
      if (value == 'Pune to Pune') {
        setParticipantsPickupPoints(eventPickupPoints);
      } else if (value == 'Mumbai to Mumbai') {
        setParticipantsPickupPoints(pickupPointsfromMumbai);
      } else {
        setParticipantsPickupPoints([{ 'Id': 1, 'name': b2bLocation }]);
      }
    }
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const getNextBatchDate = (event) => {
    let batchdate;
    let batchSize = -1;
    let eventCostPerPerson;
    let batchDates = [];
    let eventName = event.eventname;
    const Q = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (event.batches) {
      for (let i = 0; i < event.batches.length; i++) {
        if (
          batchSize == -1 &&
          new Date(event.batches[i].eventStartDate) - Q >= 0 &&
          event.batches[i].eventBatchCount > 0
        ) {
          batchdate =
            new Date(event.batches[i].eventStartDate).getDate() +
            " " +
            months[new Date(event.batches[i].eventStartDate).getMonth()] +
            " - " +
            new Date(event.batches[i].eventEndDate).getDate() +
            " " +
            months[new Date(event.batches[i].eventEndDate).getMonth()] +
            " " +
            new Date(event.batches[i].eventStartDate).getFullYear();
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
        } else if (event.batches[i].everyWeekend == true) {
          batchdate = "Available On All Weekends";
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
        } else if (event.batches[i].notScheduleYet == true) {
          batchdate = "On Demand";
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
        }

        if (
          event.batches[i].everyWeekend == false &&
          event.batches[i].notScheduleYet == false
        ) {
          batchDates.push(
            new Date(event.batches[i].eventStartDate).getDate() +
            " " +
            months[new Date(event.batches[i].eventStartDate).getMonth()] +
            " - " +
            new Date(event.batches[i].eventEndDate).getDate() +
            " " +
            months[new Date(event.batches[i].eventEndDate).getMonth()] +
            " " +
            new Date(event.batches[i].eventStartDate).getFullYear()
          );
        } else if (event.batches[i].notScheduleYet == true) {
          batchDates.push("On Demand");
        } else if (event.batches[i].everyWeekend == true) {
          batchDates.push("Available On All Weekends");
        }
      }
    } else {
      if (event.everyWeekend == false && event.notScheduleYet == false) {
        batchDates.push(
          new Date(event.eventStartDate).getDate() +
          " " +
          months[new Date(event.eventStartDate).getMonth()] +
          " - " +
          new Date(event.eventEndDate).getDate() +
          " " +
          months[new Date(event.eventEndDate).getMonth()] +
          " " +
          new Date(event.eventStartDate).getFullYear()
        );
        batchdate =
          new Date(event.eventStartDate).getDate() +
          " " +
          months[new Date(event.eventStartDate).getMonth()] +
          " - " +
          new Date(event.eventEndDate).getDate() +
          " " +
          months[new Date(event.eventEndDate).getMonth()] +
          " " +
          new Date(event.eventStartDate).getFullYear();
      } else if (event.notScheduleYet == true) {
        batchDates.push("On Demand");
        batchdate = "On Demand";
      } else if (event.everyWeekend == true) {
        batchDates.push("Available On All Weekends");
        batchdate = "Available On All Weekends";
      }
      eventCostPerPerson = event.eventCostPerPerson;
      batchSize = event.eventBatchCount;
    }
    if (batchdate && eventCostPerPerson) {
      setPrice(eventCostPerPerson);
      setBatchDate(batchdate);
      setAvailableSlot(batchSize);
      
      let convenienceFee = (Number(eventCostPerPerson) * 0.0199).toFixed(2);
      setFinalPrice(Number(eventCostPerPerson));
      setEventName(eventName);
    }
  };

  useEffect(() => {
    if (isSuccess == false) {
      getCurrentrecord();
    }
  });

  function convertHtmlToJSON(htmlString) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    let listItems = tempDiv.querySelectorAll("li");
    if (listItems.length <= 0) {
      listItems = tempDiv.querySelectorAll("p");
    }
    const locations = [];
    listItems.forEach((item, index) => {
      locations.push({
        id: index + 1,
        name: item.textContent,
      });
    });
    return locations;
  }

  const getCurrentrecord = async () => {
    let r = await fetch(`${apiUrl}schedule-event`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await r.json();
    if (res.isSuccess == true) {
      setSuccess(res.isSuccess);
      setEventDetails(res.events);
      setEvent(res.scheduleBatches);
      const scheduleBatches = res.scheduleBatches[0];
      setSelectedBatch(scheduleBatches);
      let eventApi = scheduleBatches.eventApi;
      const event = res.events.find((e) => e.apiname == eventApi);
      setSelectedbatchDetails(event);
      getNextBatchDate(scheduleBatches);
      setEventType(res.events.eventType);
    }
  };

  function handleSelectEventChange(e) {
    let eventId = e.target.value;
    eventChange(eventId);


  }

  function eventChange(eventId) {
    const scheduleBatches = events.find((e) => e.eventId == eventId);
    console.log(scheduleBatches);
    getNextBatchDate(scheduleBatches);
    setSelectedBatch(scheduleBatches);
    let eventApi = scheduleBatches.eventApi;
    const event = eventDetails.find((e) => e.apiname == eventApi);
    setSelectedbatchDetails(event);
  }


  function setSelectedbatchDetails(event) {
    const jsonData = convertHtmlToJSON(event.pickupPoints);
    let tempLocations = [];
    setEventPickupPoints(jsonData);
    tempLocations.push('Pune to Pune');
    console.log('event---', event);
    if (event?.b2bLocaion != null && event?.b2bLocaion != undefined && event?.b2bLocaion.trim() != '' && event?.b2bLocaion.trim() != 'undefined') {
      setB2bLocation(event?.b2bLocaion);
      tempLocations.push(event?.b2bLocaion);
    }
    if (event.pickupPointsfromMumbai != null && event.pickupPointsfromMumbai != 'undefine') {
      const jsonDataMumbai = convertHtmlToJSON(event.pickupPointsfromMumbai);
      setPickupPointsfromMumbai(jsonDataMumbai);
      tempLocations.push('Mumbai to Mumbai');
    }
   
    setShowLocations(tempLocations);
  }

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <div className="title-header">
            BOOKING SUMMERY
            <br />
            <div className="booking-header"></div>
          </div>
          <div className="content">
            {isSubmitting && <div>Loading...</div>}
            <div className="user-details">
              {isSuccess && (
                <div className="input-box ">
                  <span className="details">Event Name</span>
                  <select
                    {...register("Event")}
                    onChange={handleSelectEventChange}
                  >
                    {events.map((event) => {
                      // Format the start and end dates to show only the date part
                      const formattedStartDate =
                        new Date(event.eventStartDate).toLocaleDateString() ==
                          "Invalid Date"
                          ? ""
                          : " : " +
                          new Date(
                            event.eventStartDate
                          ).toLocaleDateString() +
                          " - ";
                      const formattedEndDate =
                        new Date(event.eventEndDate).toLocaleDateString() ==
                          "Invalid Date"
                          ? ""
                          : new Date(event.eventEndDate).toLocaleDateString();

                      return (
                        <option value={event.eventId} key={event.eventId}>
                          {event.eventname} {formattedStartDate}{" "}
                          {formattedEndDate}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
              <div className="input-box ">
                <span className="details">Full Name</span>
                <input
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                  type="text"
                  required
                />
              </div>
              <div className="input-box ">
                <span className="details">Email ID</span>
                <input
                  {...register("emailId", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                  type="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">WhatsApp Mobile Number</span>
                <input
                  placeholder="+91"
                  {...register("whatsappNumber", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                  type="tel"
                  required
                />
              </div>

              <br></br>

              {eventType != 'CampingEvent' &&

                <div className="flex-apply">
                  <h3 className='add-bold'>Join Us From :<span style={{ 'color': 'red' }}> *</span></h3>
                  <div className="button-radio">
                    {showLocations.map((option) => (
                      <div
                        key={option}
                        role="button"
                        tabIndex={0} // Makes the div focusable
                        className={`radio-button ${selected === option ? 'active' : ''}`}
                        onClick={() => handleSelect(option)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelect(option)} // Handles keyboard accessibility
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  {selected == 'Pune to Pune' &&
                    <div>
                      <h3 className='add-bold'>Please Select Pickup Location :<span style={{ 'color': 'red' }}> *</span></h3>
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
                              {location.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                  {selected == 'Mumbai to Mumbai' &&
                    <div>
                      <h3 className='add-bold'>Please Select Pickup Location :<span style={{ 'color': 'red' }}> *</span></h3>
                      <ul>
                        {pickupPointsfromMumbai.map((location) => (
                          <li key={location.id}>
                            <label className='radio-display'>
                              <input
                                type="radio"
                                name="location"
                                value={location.name}
                                onChange={handleSelection}
                                checked={selectedLocation === location.name}
                              />
                              {location.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  }

                  {selected == b2bLocation &&
                    <div>
                      <h3 className='add-bold'>Selected Pickup Location :<span style={{ 'color': 'red' }}> *</span></h3>
                      <ul className="b2blocation display-bulletin"><li>{b2bLocation}</li>
                      </ul>
                    </div>
                  }
                </div>
              }
              <div className="input-box finalCalculation">
                <div className="details">Number of participants</div>
                <div></div>
                <div className="noOftrekkers">
                  <span onClick={decreaseCount}>
                    {" "}
                    <FontAwesomeIcon
                      icon={faCircleMinus}
                      size="lg"
                      style={{ color: "orange" }}
                    />
                  </span>
                  {noOfTrekkers}
                  <span onClick={increaseCount}>
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      size="lg"
                      style={{ color: "orange" }}
                    />
                  </span>
                </div>
              </div>
              {/* Render input fields for each participant */}
              {participants.map((participant, index) => (
                <div key={index} className="participant-box">
                  <h2>participant {index + 2} </h2>
                  <div key={index} className="Column-2 participant-inputs">
                    <input
                      type="text"
                      placeholder="Name"
                      value={participant.name}
                      onChange={(e) =>
                        handleParticipantChange(index, "name", e.target.value)
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="WhatsApp Number"
                      value={participant.mobileNumber}
                      onChange={(e) =>
                        handleParticipantChange(
                          index,
                          "mobileNumber",
                          e.target.value
                        )
                      }
                      required
                    />
                    {eventType != 'CampingEvent' &&

                      <select
                        className="select-class"
                        name="locationCity"
                        value={participant.locationCity}
                        onChange={(e) =>
                          handleParticipantChange(
                            index,
                            "locationCity",
                            e.target.value
                          )
                        }
                        required
                      >

                        <option value="">Join Us From</option>{" "}
                        {/* Optional: Placeholder option */}
                        {showLocations.map((option) => {
                          return (
                            <option value={option} key={option}>
                              {option}
                            </option>
                          );
                        })}
                      </select>
                    }
                    {eventType != 'CampingEvent' &&
                      <select
                        className="select-class"
                        name="location"
                        value={participant.pickupLocation}
                        onChange={(e) =>
                          handleParticipantChange(
                            index,
                            "pickupLocation",
                            e.target.value
                          )
                        }
                        required
                      >

                        <option value="">Select Pickup Location</option>{" "}
                        {console.log('participantsPickupPoints-----', participantsPickupPoints)}
                        {participantsPickupPoints.map((pickupPoint) => {
                          return (
                            <option value={pickupPoint.name} key={pickupPoint.id}>
                              {pickupPoint.name}
                            </option>
                          );
                        })}
                      </select>
                    }
                  </div>
                </div>
              ))}


              <div className="hr"></div>
              <div className="finalCalculation">
                <span>Total Payment</span>
                <span></span>
                <span>₹{finalPrice} /-</span>
              </div>
              <div className="hr" style={{ 'margin': '15px 0 15px 0', 'height': '1px', 'backgroundColor': 'gray' }}></div>
              <div className="input-box finalCalculation">
                <span className="details">Given Discount</span>
                <span></span>
                <input
                  style={{ 'width': "33%" }}
                  {...register("Discount", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                  type="number"
                  required
                />
              </div>
              <div className="input-box finalCalculation">
                <span className="details">Amount Paid</span>
                <span></span>
                <input
                  style={{ 'width': "33%" }}
                  {...register("amountPaid", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                  type="number"
                  step="0.01"
                  required
                />
              </div>
              <div className="input-box finalCalculation">
                <span className="details">Payment Method</span>
                <span></span>
                <input
                  style={{ 'width': "33%" }}
                  {...register("paymentMethod", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                  type="text"
                  required
                />
              </div>
              <div className="input-box finalCalculation">
                <span className="details">TransactionId</span>
                <span></span>
                <input
                  style={{ 'width': "33%" }}
                  {...register("transactionId", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  })}
                  type="text"
                  required
                />
              </div>
            </div>
          </div>

          <div className="termsAndCondition">
            <input
              type="checkbox"
              {...register("termsAndconditions", {
                required: { value: true, message: "This field is required" },
              })}
              required
            />
            <div>
              Accept all
              <a
                className="link"
                href="http://localhost:5173/user-agreement"
                target="_blank"
              >
                {" "}
                terms & conditions
              </a>
            </div>
          </div>
          <div className="button">
            <input disabled={isSubmitting} type="submit" value="Submit" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default DirectBookings;
