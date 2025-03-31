import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useForm } from "react-hook-form"
import './ShowEventDetails.css'
import Footer from "../../footer";
import ContactSection from "../ContactLogo/contactSection";
import Navbar from "../../Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import "../../admin-panel/CreateEvent/CreateEvents.css"
import CircularLoading from '../Loading/CircularLoading';
import "../../Modal.css";
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { useNavigate } from 'react-router-dom';

import "react-datepicker/dist/react-datepicker.css";
const CustomerBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventDetails, batch, showLocations, pickupPoints, bookingPhone, pickupPointsfromMumbai, isSuccess, finalBatchesList, selectedDate, bookingId, discountAvailable, coupons } = location.state || {}; // Extract the data safely
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [buttonClick, setButtonClick] = useState('confirm-details');
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [actualPrice, setActualPrice] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [maxBooking, setMaxBooking] = useState();
  const [bookedSlot, setBookedSlot] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [specialNote, setSpecialNote] = useState('');
  const [selectedBatch, setSelectedbatch] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
  const [paynowButtonDisabled, setPayNowButtonDisabled] = useState(false);
  const [batchFull, setBatchFull] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(-1);
  const [showDiscountStatus, setShowDiscountStatus] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [showBreakup, setShowBreakup] = useState(true);
  const [paymentOption, setPaymentOption] = useState("full"); // Default to full payment
  const [partialPayment, setPartialPayment] = useState(0);
  const [selected, setSelected] = useState('Pune to Pune');
  const [doubleSharingCount, setDoubleSharingCount] = useState(0);
  const [tripalSharingCount, setTripalSharingCount] = useState(0);
  const [thirdAcUpgrateCount, setThirdAcUpgrateCount] = useState(0);
  const [punePrice, setPunePrice] = useState(0);
  const [bookingPrice, setBookingPrice] = useState(0);
  const [mumbaiPrice, setMumbaiPrice] = useState(0);
  const [basetobasePrice, setBasetoBasePrice] = useState(0);
  const [addOn, setAddOn] = useState(0);
  const [addOnMap, setAddOnMap] = useState();
  const [additionalParticipantsList,setAdditionalParticipantsList]= useState([]);
  // For Join Us From selection
  const handleSelect = async (option) => {
    setSelected(option);
    const foundRecord = await handleBookingSlot();
    let price = 0;
    if (option == 'Pune to Pune') {
      price = foundRecord.eventCostPerPerson;
      setShowTermsAndConditions(false);
    } else if (option == 'Mumbai to Mumbai') {
      price = foundRecord.eventCostPerPersonFromMumbai;
      setShowTermsAndConditions(false);
    } else {
      setSelectedLocation(option);
      setShowTermsAndConditions(true);
      price = foundRecord.b2bPrice;
    }   
    setActualPrice(Number(price));
    setBookingPrice(Number(price));
    let convenience_Fee = (Number(price) * 0.0199).toFixed(2);
    setConvenienceFee(convenience_Fee);
    setFinalPrice(Number(price)+Number(convenience_Fee));
  }

  const handleBookingSlot = async () => {
    const { startDate, endDate } = parseDateRange(batch);
    let foundRecord = finalBatchesList.find(batchSearch => batchSearch['batchdate'] == batch);
    if (foundRecord) {
      setSelectedbatch(foundRecord);
      setMaxBooking(foundRecord.batchSize);
      setBookedSlot(foundRecord.bookedSize);
      if (finalPrice <= 0) {
        if (foundRecord.eventCostPerPerson) {
          let price = foundRecord.eventCostPerPerson;         
          setActualPrice(Number(price));
          setBookingPrice(Number(price));
          setBookingPrice(Number(price));
          let convenience_Fee = (Number(price) * 0.0199).toFixed(2);
          setConvenienceFee(convenience_Fee);
          setFinalPrice(Number(price) + Number(convenience_Fee));

        } else {
          foundRecord = await handleFetchSelectedBatch(eventDetails.eventId, startDate, endDate);
        }
      }
    } else {
      foundRecord = await handleFetchSelectedBatch(eventDetails.eventId, startDate, endDate);
    }
    setPunePrice(foundRecord.eventCostPerPerson);
    setMumbaiPrice(foundRecord.eventCostPerPersonFromMumbai);
    setBasetoBasePrice(foundRecord.b2bPrice);
    return foundRecord;
  }

  const handleFetchSelectedBatch = async (eventId, startDate, endDate) => {
    let r = await fetch(`${apiUrl}get-selected-batch/${eventId}/${startDate}/${endDate}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    });
    let res = await r.json();
    if (res.isSuccess == true) {
      let foundRecord = res.ScheduleBatchesRecords[0];
      setSelectedbatch(foundRecord);
      setMaxBooking(foundRecord.batchSize);
      setBookedSlot(foundRecord.bookedSize);
      if (finalPrice <= 0) {
        let price = foundRecord.eventCostPerPerson;
       
        setActualPrice(Number(price));
        let convenience_Fee = (Number(price) * 0.0199).toFixed(2);
        setConvenienceFee(convenience_Fee);
        setFinalPrice(Number(price)+Number(convenience_Fee));
      }
      return foundRecord;
    } else {
      navigate('/');
    }
  }

  function parseDateRange(dateRange) {
    const months = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };

    const parts = dateRange.split(' - ');
    const year = parts[1].split(' ')[2];
    const startParts = parts[0].split(' ');
    const endParts = parts[1].split(' ');

    const startDate = `${year}-${months[startParts[1]]}-${parseInt(startParts[0]) < 9 ? '0' + startParts[0] : startParts[0]}T00:00:00.000Z`;
    const endDate = `${year}-${months[endParts[1]]}-${parseInt(endParts[0]) < 9 ? '0' + endParts[0] : endParts[0]}T00:00:00.000Z`;
    return { startDate, endDate };
  }

  const handlePaymentChange = (event) => {
    setPaymentOption(event.target.value);
    if (event.target.value == "partial") {
     
      let price = Number(selectedBatch.partialBookingAmount) * Number(noOfTrekkers) + Number(addOn);
      let conF = (Number(price) * 0.0199).toFixed(2);
      setConvenienceFee(conF);
      // price = price ;//+ (price * 0.0199);
      setPartialPayment(price);
      setFinalPrice(Number(price)+Number(conF));
      setDiscount(0);
      setCouponCode('');
      let final_price = 0;
      for (let i = 0; i < participants.length; i++) {
        final_price = Number(participants[i].price) + Number(final_price);
      }
      let fCon = (Number(final_price) * 0.0199).toFixed(2);
      final_price = Number(final_price) + Number(addOn) + Number(selectedBatch.eventCostPerPerson);
      let remainingAmount = ( Number(final_price) +Number(fCon)) - ( Number(price)+(Number(fCon)));
      setRemainingAmount(Number(remainingAmount));
      //  setPrice(Number(selectedBatch.partialBookingAmount));

    } else {
      let final_price = 0;
      for (let i = 0; i < participants.length; i++) {
        final_price = participants[i].price + final_price;
      }
      final_price = final_price + Number(selectedBatch.eventCostPerPerson);
      let conv =(Number(final_price) * 0.0199).toFixed(2);
      setConvenienceFee(conv);

      setFinalPrice(Number(final_price) + Number(addOn)+Number(conv));
      setActualPrice(Number(final_price));
    }
  };

  const handleToggleBreakup = () => {
    setShowBreakup((prev) => !prev);
  };

  const handleParticipantChange = (index, field, value) => {
    let price = 0;
    let final_Price = Number(finalPrice);
    let pickupLocation = [];
    const addParticipantsList =[...additionalParticipantsList];
   
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    if (field == 'locationCity') {
      if (value == 'Pune to Pune') {
        price = selectedBatch.eventCostPerPerson;
        pickupLocation = pickupPoints ;
      } else if (value == 'Mumbai to Mumbai') {
        price = selectedBatch.eventCostPerPersonFromMumbai;
        pickupLocation = pickupPointsfromMumbai;
      } else {
        price = selectedBatch.b2bPrice;
        pickupLocation = [{ 'Id': 1, 'name': eventDetails.b2bLocaion }];
      }
      newParticipants[index]['price'] = price;
      final_Price = final_Price + price;
     
      addParticipantsList[index]['pickupLocationList']= pickupLocation; 
      setActualPrice(final_Price);
      let convenience_Fee = (Number(final_Price - discount) * 0.0199).toFixed(2);
      setConvenienceFee(convenience_Fee);
      let fprice = (Number(final_Price) +Number(convenience_Fee)) - Number(discount);
      setFinalPrice(Number(fprice).toFixed(2));
     
    }
    setParticipants(newParticipants);
    setAdditionalParticipantsList(addParticipantsList);
  };

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  // Watch the checkbox value
  const termsChecked = watch("termsAndconditions");

  // Handle blur to toggle the value
  const handleCheckboxBlur = () => {

    if (selectedLocation == null && eventDetails.eventType != 'CampingEvent') {

      setError("dateError", {
        type: "manual",
        message: "Please select Pickup Location and accept terms & condition to proceed",
      })
      setPayNowButtonDisabled(false);
      if (termsChecked) {
        setValue("termsAndconditions", false);
      }
    } else {
      setPayNowButtonDisabled(true);
      clearErrors('dateError');

    }
  }

  const onSubmit = async (data) => {
    try {
      if (buttonClick == 'confirm-details') {
        if (selectedLocation) {
          setButtonClick('pay-now');
        }
      } else if (buttonClick == 'pay-now') {
        const formData = new FormData();
        formData.append("numberOfPeoples", noOfTrekkers);
        formData.append("amountPaid", Number(finalPrice));
        formData.append("pickupLocation", selectedLocation);
        const today = new Date();
        formData.append("bookingDate", today);
        formData.append("otherParticipants", JSON.stringify(participants));
        formData.append("bookingId", bookingId);
        formData.append("scheduleEventId", eventDetails.eventId);
        formData.append("addedDiscount", discount);
        formData.append("remainingAmount", remainingAmount);
        formData.append("doubleSharing", doubleSharingCount);
        formData.append("tripalSharing", tripalSharingCount);
        formData.append("thirdAcUpgrate", thirdAcUpgrateCount);
        formData.append("specialNote", specialNote);
        let r = await fetch(`${apiUrl}confirmed-booking`, {
          method: "PUT",
          body: formData,
        });

        let res = await r.json()
        if (res.isSuccess == true) {
          // Send the payment request to your backend
          const response = await fetch(`${apiUrl}api/phonepe/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: finalPrice, // Convert amount to paisa (1 INR = 100 paisa)
              orderId: bookingId,
              mobileNumber: bookingPhone,
            }),
          });

          const data = await response.json();
          if (data && data.redirectUrl) {
            // Redirect the user to PhonePe for payment
            window.location.href = data.redirectUrl;
          } else {
            console.log('Payment initiation failed. Please try again.');
          }
        }
      }
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        // alert('Booking submitted successfully!');
      }, 2000);
    } catch (error) {
      console.error('Error during booking:', error);
      // Optionally, show an error message to the user
    }
  }

  const handleSelection = (event) => {
    setSelectedLocation(event.target.value);
    setShowTermsAndConditions(true);
    clearErrors('dateError');
  };

  const increaseCount = async () => {
    if (Number(maxBooking) - Number(bookedSlot) > Number(noOfTrekkers)) {
      let count = noOfTrekkers;
      count++;
      setNoOfTrekkers(count);

      setParticipants([
        ...participants,
        { name: "", mobileNumber: "", pickupLocation: "" },
      ]);

      setAdditionalParticipantsList([
          ...additionalParticipantsList  ,
        {pickupLocationList: "" },
      ]);
    } else {
      setBatchFull(true);
      setAvailableSlot(Number(maxBooking) - Number(bookedSlot));
    }
  }

  const decreaseCount = async () => {
    let count = 1;
    let final_Price = 0;
    if (noOfTrekkers > 1) {
      count = noOfTrekkers;
      count--;
      setNoOfTrekkers(Number(count));
      const lastRecord = participants[participants.length - 1];
    
      if (lastRecord?.price != null && lastRecord?.price != undefined && lastRecord?.price != '') {
        final_Price = finalPrice - lastRecord?.price;
      } else {
        final_Price = bookingPrice;
      }
      
      setActualPrice(Number(final_Price).toFixed(2));
      let convenience_Fee = (Number(final_Price) * 0.0199).toFixed(2);
      setConvenienceFee(convenience_Fee);
      setFinalPrice(Number(final_Price)+Number(convenience_Fee));
      setParticipants(participants.slice(0, -1));
      setAdditionalParticipantsList(additionalParticipantsList.slice(0, -1));
    }

  }

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    } else {
      const foundRecord = handleBookingSlot();
    }
  }, [location.state, navigate]);

  const handleCouponApply = async () => {
    try {
     
      if (couponCode && paymentOption != 'partial') {
        if (!selectedBatch.specialOfferEvent) {
          const response = await fetch(`${apiUrl}api/validate-coupon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: couponCode, eventType: eventDetails.eventType, numberOfPeople: noOfTrekkers })
          });
          const data = await response.json();
          let calculatedDiscount;
          let final_price = Number(actualPrice);
          if (response.ok && data.isValid) {
            if (data.coupon == null) {
              calculatedDiscount = 0;
            } else if (data.coupon.discountPrice) {
              calculatedDiscount = data.coupon.discountPrice;
            } else if (data.coupon.discountPercent) {
              calculatedDiscount = Math.min(
                (Number(final_price) + Number(addOn) * Number(data.coupon.discountPercent)) / 100
              );

            }
            setShowDiscountStatus(true);
            setDiscount(Number(calculatedDiscount));
            let fPrice = Number(final_price) + Number(addOn) ;
            let con =  (Number(fPrice) * 0.0199).toFixed(2);
            setConvenienceFee(con);
            setFinalPrice(Number(fPrice)+Number(con) - Number(calculatedDiscount));
          } else {
            // setErrorMessage(data.message || 'Invalid coupon code.');
          }
        }
      } else {
        setDiscount(-1);
        let con =  (Number(actualPrice) * 0.0199).toFixed(2);
        setFinalPrice(Number(actualPrice) + Number(con));
        setConvenienceFee(Number(con));
      }
       
    } catch (error) {
      //setErrorMessage('An error occurred while applying the coupon.');
    }

  };

  const handleAddOnChange = (e) => {
    let myMap = new Map();
    if (addOnMap) {
      myMap = addOnMap;
    }
    const value = parseInt(e.target.value, 20);
    let addOnFee = 0;
    if (e.target.id == "double-sharing-picklist") {
      setDoubleSharingCount(value);
      addOnFee = selectedBatch?.doubleSharing;
    } else if (e.target.id == "tripal-sharing-picklist") {
      setTripalSharingCount(value);
      addOnFee = selectedBatch?.tripalSharing;
    } else if (e.target.id == "third-ac-upgrate-picklist") {
      setThirdAcUpgrateCount(value);
      addOnFee = selectedBatch?.thirdAcUpgrate;
    }
    myMap.set(e.target.id, { 'addOnFee': addOnFee, 'value': value });
    setAddOnMap(myMap);
    let final_price = 0;
    if(paymentOption != 'partial'){
     final_price = Number(actualPrice);
    }else{
      final_price = Number(partialPayment);
    }
    let addOnTemp = 0;
   
    myMap.forEach((addon, key) => {
      final_price = final_price + Number(addon.addOnFee) * Number(addon.value);
      addOnTemp = addOnTemp + Number(addon.addOnFee) * Number(addon.value);
    });
    let con =  (Number(final_price) * 0.0199).toFixed(2); 
    setFinalPrice(Number(final_price) + Number(con));
    setConvenienceFee(Number(con));
    setAddOn(Number(addOnTemp))
  };

  const generateOptions = () => {
    const options = [];
    for (let i = 0; i <= 20; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div>
      <div style={{ 'background': 'orange' }}>
        <Navbar />
        <div className="user-agreement-header">
        </div>
      </div>
      {loading ? (
        <CircularLoading />
      ) : (
        <div>
          {eventDetails &&
            <div className="h3"> <center>
              <h2>{eventDetails.name}</h2>
              <p>Batch: {batch}</p></center>
            </div>
          }
          {isSuccess && eventDetails &&
            <div >
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">

                  <div className="content">
                    {buttonClick == 'confirm-details' &&
                      <div className="user-details">

                        {eventDetails.eventType != 'CampingEvent' &&
                          <div>
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
                                  {option} - {option === "Pune to Pune" && punePrice
                                    ? punePrice + "/-"
                                    : option === "Mumbai to Mumbai" && mumbaiPrice
                                      ? mumbaiPrice + "/-"
                                      : basetobasePrice + "/-"}
                                </div>
                              ))}
                            </div>
                            {selected == 'Pune to Pune' &&
                              <div>
                                <h3 className='add-bold'>Please Select Pickup Location :<span style={{ 'color': 'red' }}> *</span></h3>
                                <ul>
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

                            {selected == eventDetails.b2bLocaion &&
                              <div>
                                <h3 className='add-bold'>Selected Pickup Location :<span style={{ 'color': 'red' }}> *</span></h3>
                                <ul className="b2blocation display-bulletin"><li>{eventDetails.b2bLocaion}</li>
                                </ul>
                              </div>
                            }
                          </div>
                        }
                        {selected && showTermsAndConditions &&
                          <div className="input-box finalCalculation">
                            <div className="add-bold details">Add More Participants :</div>
                            <div></div>
                            <div className='noOftrekkers'>
                              <span onClick={decreaseCount}>  <FontAwesomeIcon icon={faCircleMinus} size="lg" style={{ color: "orange", }} /></span>
                              {noOfTrekkers}
                              <span onClick={increaseCount}><FontAwesomeIcon icon={faCirclePlus} size="lg" style={{ color: "orange", }} /></span>
                            </div>
                          </div>
                        }
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
                                type="tel" // Changed to 'tel'
                                placeholder="WhatsApp Number"
                                value={participant.mobileNumber}
                                onChange={(e) =>
                                  handleParticipantChange(
                                    index,
                                    "mobileNumber",
                                    e.target.value
                                  )
                                }
                                pattern="[0-9]{10}" // Restricts to exactly 10 digits
                                title="Please enter a valid 10-digit mobile number (e.g., 987xxxxxxx)"
                                required
                              />
                              {eventDetails.eventType != 'CampingEvent' &&

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

                                  <option value="">Join Us From </option>{" "}
                                  {/* Optional: Placeholder option */}
                                  {showLocations.map((option) => {
                                    return (
                                      <option value={option} key={option}>
                                        {option} - {option === "Pune to Pune" && punePrice
                                          ? punePrice + "/-"
                                          : option === "Mumbai to Mumbai" && mumbaiPrice
                                            ? mumbaiPrice + "/-"
                                            : basetobasePrice + "/-"}
                                      </option>
                                    );
                                  })}
                                </select>
                              }
                              {eventDetails.eventType != 'CampingEvent' &&
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
                                  <option value="">Select Pickup Location </option>{" "}
                                  {additionalParticipantsList[index].pickupLocationList && additionalParticipantsList[index].pickupLocationList.map((pickupPoint) => {
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
                        {batchFull &&
                          <p className='bookingClosed'>Only {availableSlot} seats are currently available. Please reach out to us at +91 7028740961 to discuss the possibility of accommodating additional bookings.</p>
                        }
                      </div>
                    }
                    {buttonClick == 'pay-now' && (selectedBatch?.doubleSharing > 0 || selectedBatch?.tripalSharing > 0 || selectedBatch?.thirdAcUpgrate > 0) &&
                      <div> <div className='finalCalculation' style={{
                        color: "rgb(255, 115, 0)",
                        cursor: "pointer",
                      }}> Add On Details</div>
                        <table className='pay-table'>
                          <tr>
                            <th className='pay-th'></th>
                            <th className='column2 pay-th'></th>
                            <th className='column2 pay-th'></th>
                          </tr>
                          {selectedBatch?.doubleSharing > 0 ? <tr>
                            <td className='pay-td'><b>Couple Room</b><br /><span>{selectedBatch?.doubleSharingNote}</span></td>
                            <td className='column2 pay-td'>₹ {selectedBatch?.doubleSharing}</td>
                            <td className='column2 pay-td'>  <select
                              id="double-sharing-picklist"
                              value={doubleSharingCount}
                              onChange={handleAddOnChange}
                            >
                              {generateOptions()}
                            </select></td>
                          </tr> : ''}
                          {selectedBatch?.tripalSharing > 0 ? <tr>
                            <td className='pay-td'><b>Tripal Sharing Room</b><br /><span>{selectedBatch?.tripalSharingNote}</span></td>
                            <td className='column2 pay-td'>₹ {selectedBatch?.tripalSharing}</td>
                            <td className='column2 pay-td'> <select
                              id="tripal-sharing-picklist"
                              value={tripalSharingCount}
                              onChange={handleAddOnChange}
                            >
                              {generateOptions()}
                            </select></td>
                          </tr> : ''}
                          {selectedBatch?.thirdAcUpgrate > 0 ? <tr>
                            <td className='pay-td'><b>{selectedBatch?.thirdAcUpgrateNote}</b><br /></td>
                            <td className='column2 pay-td'>₹ {selectedBatch?.thirdAcUpgrate}</td>
                            <td className='column2 pay-td'> <select
                              id="third-ac-upgrate-picklist"
                              value={thirdAcUpgrateCount}
                              onChange={handleAddOnChange}
                            >
                              {generateOptions()}
                            </select></td>
                          </tr> : ''}
                        </table>
                        <br></br>


                        {/* General Note */}
                        <div className="input-box">
                          <span className="details">Custom Message (if Any)</span>
                          <textarea
                            value={specialNote}
                            placeholder='Enter Custom Message'
                            onChange={(e) => setSpecialNote(e.target.value)}
                          />
                        </div>
                        <br></br>
                      </div>
                    }
                    {
                      buttonClick == 'pay-now' && showBreakup && paymentOption == 'partial' &&
                      <div >
                        <div className='finalCalculation' style={{
                          color: "orange",
                          cursor: "pointer",
                        }}> Show breakup</div>
                        <table className='pay-table'>
                          <tr>
                            <th className='pay-th'>Details</th>
                            <th className='column2 pay-th'>Amount</th>
                          </tr>
                          <tr>
                            <td className='pay-td'>Event Fees</td>
                            <td className='column2 pay-td'>{noOfTrekkers} x {selectedBatch.partialBookingAmount} /- </td>
                          </tr>
                          <tr>
                            <td className='pay-td'>Subtotal</td>
                            <td className='column2 pay-td'>{Number(noOfTrekkers) * Number(selectedBatch.partialBookingAmount)} /-</td>
                          </tr>
                          <tr>
                            <td className='pay-td'>Add on</td>
                            <td className='column2 pay-td'>{Number(addOn)} /- </td>
                          </tr>
                          <tr>
                            <td className='pay-td'>Convenience Fee (1.99 %)</td>
                            <td className='column2 pay-td'>{convenienceFee} /- </td>
                          </tr>
                          {/* <tr>
                            <td className='pay-td'>Discount</td>
                            <td className='column2 pay-td'>- ₹ {convenienceFee} /-</td>
                          </tr> */}
                          <tr>
                            <td className='pay-th' style={{ color: 'green' }}><b>Remaining </b></td>
                            <td className='column2 pay-th' style={{ color: 'green' }}><b>₹ {remainingAmount} /-</b></td>
                          </tr>
                        </table>
                      </div>

                    }
                    {buttonClick == 'pay-now' && showBreakup && paymentOption == 'full' &&
                      <div >

                        <div className='finalCalculation' style={{
                          color: "rgb(255, 115, 0)",
                          cursor: "pointer",
                        }}> Show breakup</div>
                        <table className='pay-table'>
                          <tr>
                            <th className='pay-th'>Details</th>
                            <th className='column2 pay-th'></th>
                          </tr>
                          <tr>
                            <td className='pay-td'>Event Fees</td>
                            <td className='column2 pay-td'>₹ {actualPrice} /-</td>
                          </tr>
                          <tr>
                            <td className='pay-td'>No of Participant</td>
                            <td className='column2 pay-td'>{Number(noOfTrekkers)}</td>
                          </tr>
                          <tr>
                            <td className='pay-td'>Add on</td>
                            <td className='column2 pay-td'>{Number(addOn)}</td>
                          </tr>
                          <tr>
                            <td className='pay-td'>Convenience Fee (1.99 %)</td>
                            <td className='column2 pay-td'>₹ {convenienceFee} /-</td>
                          </tr>
                          {/* <tr>
                            <td className='pay-td'>Discount</td>
                            <td className='column2 pay-td'>- ₹ {convenienceFee} /-</td>
                          </tr> */}
                          {discount > 0 ? <tr>
                            <td className='pay-td'>Added Discount</td>
                            <td className='column2 pay-td'>- ₹ {discount} /-</td>
                          </tr> : ''}

                        </table>
                      </div>
                    }
                    {buttonClick == 'pay-now' &&
                      <div>
                        <div className="user-details">
                          {
                            selected && discountAvailable &&
                            <div className="input-box" style={{ 'display': 'flex', 'gap': '10px' }}>
                              <input
                                type="text" className="input-box-discount"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                              />
                              <div className="button discount-button">
                                <button type="button" onClick={handleCouponApply}>
                                  Apply Coupon
                                </button>
                              </div>
                            </div>
                          }
                          {showDiscountStatus && paymentOption == 'partial' && <p style={{ 'display': 'flex', 'font-weight': 'bold', 'color': '#c70000', 'gap': '5px' }}> You can not apply coupon code for Partial Payment. <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#c70000" fill-rule="evenodd" d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M3,8 C3,10.7614237 5.23857625,13 8,13 C9.01910722,13 9.96700318,12.6951083 10.7574478,12.1715651 L3.8284349,5.24255219 C3.30489166,6.03299682 3,6.98089278 3,8 Z M8,3 C6.98089278,3 6.03299682,3.30489166 5.24255219,3.8284349 L12.1715651,10.7574478 C12.6951083,9.96700318 13,9.01910722 13,8 C13,5.23857625 10.7614237,3 8,3 Z"></path> </g></svg></p>}
                          {showDiscountStatus && paymentOption != 'partial' && discount > 0 && <p style={{ 'display': 'flex', 'font-weight': 'bold', 'color': 'green', 'gap': '5px' }}> Discount Applied   <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.007 8.27C22.194 9.125 23 10.45 23 12c0 1.55-.806 2.876-1.993 3.73.24 1.442-.134 2.958-1.227 4.05-1.095 1.095-2.61 1.459-4.046 1.225C14.883 22.196 13.546 23 12 23c-1.55 0-2.878-.807-3.731-1.996-1.438.235-2.954-.128-4.05-1.224-1.095-1.095-1.459-2.611-1.217-4.05C1.816 14.877 1 13.551 1 12s.816-2.878 2.002-3.73c-.242-1.439.122-2.955 1.218-4.05 1.093-1.094 2.61-1.467 4.057-1.227C9.125 1.804 10.453 1 12 1c1.545 0 2.88.803 3.732 1.993 1.442-.24 2.956.135 4.048 1.227 1.093 1.092 1.468 2.608 1.227 4.05Zm-4.426-.084a1 1 0 0 1 .233 1.395l-5 7a1 1 0 0 1-1.521.126l-3-3a1 1 0 0 1 1.414-1.414l2.165 2.165 4.314-6.04a1 1 0 0 1 1.395-.232Z" fill="#009912"></path></g></svg></p>}
                          {showDiscountStatus && paymentOption != 'partial' && discount == 0 && <p style={{ 'display': 'flex', 'font-weight': 'bold', 'color': '#c70000', 'gap': '5px' }}> Please try to apply the coupon again. <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#c70000" fill-rule="evenodd" d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M3,8 C3,10.7614237 5.23857625,13 8,13 C9.01910722,13 9.96700318,12.6951083 10.7574478,12.1715651 L3.8284349,5.24255219 C3.30489166,6.03299682 3,6.98089278 3,8 Z M8,3 C6.98089278,3 6.03299682,3.30489166 5.24255219,3.8284349 L12.1715651,10.7574478 C12.6951083,9.96700318 13,9.01910722 13,8 C13,5.23857625 10.7614237,3 8,3 Z"></path> </g></svg></p>}
                        </div>
                        {selected && eventDetails.eventType == 'BackPackingTrip' &&
                          <div>
                            <span className="details">Select Payment Type:<span style={{ 'color': 'red' }}> *</span></span>
                            <div className='payment-selection'>
                              <label className='radio-display'>
                                <input
                                  type="radio"
                                  value="full"
                                  checked={paymentOption === "full"}
                                  onChange={handlePaymentChange}
                                />
                                Full Payment
                              </label>
                              <label className='radio-display'>
                                <input
                                  type="radio"
                                  value="partial"
                                  checked={paymentOption === "partial"}
                                  onChange={handlePaymentChange}
                                />
                                Partial Payment
                              </label>
                            </div>
                          </div>
                        }

                      </div>
                    }
                    {buttonClick == 'pay-now' && selected &&
                      <div>
                        <div className='hr'></div>

                        <div className='finalCalculation'>
                          <span >Total To Pay</span>
                          <span></span>
                          <span ><div className='calculation'>
                            <span >₹ {finalPrice} /-
                            </span>
                            <span className='price-link'><a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleToggleBreakup();
                              }}
                              style={{
                                marginLeft: "10px",
                                color: "orange",
                                cursor: "pointer",
                              }}
                            >{showBreakup ? ' Hide breakup' : 'Show breakup'}

                            </a>
                            </span>
                          </div>
                          </span>
                        </div>
                      </div>
                    }
                  </div>
                  {buttonClick == 'confirm-details' &&
                    <div className="button">
                      <input type="submit" className={!selectedLocation ? 'confirm-disable-paynow' : 'confirm-button'} disabled={selectedLocation ? false : true} value="Confirm Details >>" />
                    </div>
                  }
                  {buttonClick != 'pay-now' && buttonClick != 'confirm-details' &&
                    <div className="button">
                      <input type="submit" value="Next >>" />
                    </div>
                  }
                  {buttonClick == 'pay-now' &&
                    <div>
                      <div className='termsAndCondition'>
                        <input
                          type="checkbox"
                          {...register("termsAndconditions", {
                            required: {
                              value: true,
                              message: "This field is required"
                            }
                          })}
                          required
                          onMouseOver={handleCheckboxBlur}
                          checked={termsChecked} // Controlled component
                          disabled={!showTermsAndConditions}
                        />
                        <div >
                          I accept all terms & conditions.{paynowButtonDisabled}
                          <a className='link' href={'https://sahyadrivacations.com/user-agreement'} target="_blank"> (View)</a>
                        </div>
                      </div>
                      {errors.dateError && <p className='show-error' >{errors.dateError.message}</p>}
                      <div className="button">
                        <input onMouseOver={handleCheckboxBlur} className={!paynowButtonDisabled ? 'disable-paynow' : 'paynow-button'} disabled={paynowButtonDisabled ? false : true} type="submit" value="Pay Now" />
                      </div>
                    </div>
                  }
                </div>
              </form>
            </div >
          }
        </div >)}
      <ContactSection />
      <Footer />
    </div>
  );
}


export default CustomerBookings