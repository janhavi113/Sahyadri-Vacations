import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useForm } from "react-hook-form"
import './ShowEventDetails.css'
import Footer from "../../footer";
import ContactSection from "../ContactLogo/contactSection";
import Navbar from "../../Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCirclePlus, faCircleMinus, faCalendarDays, faLocationDot, faMountainSun } from '@fortawesome/free-solid-svg-icons';
import { Modal } from "react-bootstrap";
import "../../admin-panel/CreateEvent/CreateEvents.css"
import tripType from '../../Images/type.svg'
import duration from '../../Images/duration.svg'
import distance from '../../Images/distance.svg'
import endurance from '../../Images/endurance.svg'
import locationicon from '../../Images/location.svg'
import Loading from '../Loading/Loading';
import CircularLoading from '../Loading/CircularLoading';
import MinimalCoupons from './MinimalCoupons';
import "../../Modal.css";
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import DatePicker from "react-datepicker";
import { isWeekend } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CollapsibleSection from './CollapsibleSection';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the loading spinner component

import "react-datepicker/dist/react-datepicker.css";
import { set } from 'mongoose';
const ShowEventDetails = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryParameters = new URLSearchParams(window.location.search);
  const [type, setType] = useState(queryParameters.get("eventid"));
  const [params, setParams] = useState(type.split('/'));
  const [isSuccess, setSuccess] = useState(false);
  const [inquery, setInquery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonClick, setButtonClick] = useState(null);
  const [everyWeekend, setEveryWeekend] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [pickupPoints, setPickupPoints] = useState([]);
  const [participantsPickupPoints, setParticipantsPickupPoints] = useState([]);
  const [pickupPointsfromMumbai, setPickupPointsfromMumbai] = useState([]);
  const [b2bLocation, setB2bLocation] = useState();
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [actualPrice, setActualPrice] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [scheduleBatch, setScheduleBatch] = useState();
  const [availableBatches, setAvailableBatches] = useState();
  const [price, setPrice] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [maxBooking, setMaxBooking] = useState();
  const [bookedSlot, setBookedSlot] = useState();
  const [bookingPhone, setBookingPhone] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const [eventType, setEventType] = useState();
  const [currentEventId, setCurrentEventId] = useState();
  const [noOfPeopleNeedforCoupon, setNoOfPeopleNeedforCoupon] = useState();
  const [selectDate, setSelectDate] = useState();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [batchFull, setBatchFull] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [preCouponCode, setPreCouponCode] = useState('');
  const [discount, setDiscount] = useState(-1);
  const [discountAvailable, setDiscountAvailable] = useState(false);
  const [showDiscountStatus, setShowDiscountStatus] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [showBreakup, setShowBreakup] = useState(false);
  const [paymentOption, setPaymentOption] = useState("full"); // Default to full payment
  const [partialPayment, setPartialPayment] = useState(0);
  const [finalBatchesList, setFinalBatchesList] = useState();
  const [selected, setSelected] = useState('Pune to Pune');
  const [errorMessageforNext, setErrorMessageforNext] = useState(false);
  const [isLoadingMSG, setIsLoadingMSG] = useState(false);
  const [showLocations, setShowLocations] = useState([]);
  const handleSelect = (option) => {
    setSelected(option);
    const foundRecord = finalBatchesList.find(batch => batch['batchdate'] == selectedDate);

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
    console.log('price---', price);
    let convenienceFeePerPerson = (Number(price) * 0.015).toFixed(2);
    setMaxBooking(foundRecord.batchSize);
    setBookedSlot(foundRecord.bookedSize);
    setFinalPrice(Number(price) + Number(convenienceFeePerPerson));
    setConvenienceFee(convenienceFeePerPerson);
    setActualPrice(Number(price));
    setPrice(price);
  };

  const handlePaymentChange = (event) => {
    setPaymentOption(event.target.value);
    if (event.target.value == "partial") {
      //alert('partial');
      let price = Number(scheduleBatch.partialBookingAmount) * Number(noOfTrekkers);
      setConvenienceFee(Number(price) * 0.015);
      price = price + (price * 0.015);
      setPartialPayment(price);
      setFinalPrice(price);
      setDiscount(0);
      let remainingAmount = Number(scheduleBatch.eventCostPerPerson) * Number(noOfTrekkers);
      let remainingConvenienceFee = Number(remainingAmount) * 0.015;
      remainingAmount = remainingAmount + remainingConvenienceFee;
      setRemainingAmount(remainingAmount);
    } else {
      let price = Number(scheduleBatch.eventCostPerPerson) * Number(noOfTrekkers);
      setConvenienceFee(Number(price) * 0.015);

      if (Number(discount) > 0 && (Number(noOfTrekkers) >= Number(noOfPeopleNeedforCoupon))) {
        price = Number(price) - Number(discount);
      } else {
        setDiscount(0);
      }
      price = price + (price * 0.015);
      setActualPrice(Number(scheduleBatch.eventCostPerPerson) * Number(noOfTrekkers));
      setFinalPrice(price);
    }

  };

  const handleToggleBreakup = () => {
    setShowBreakup((prev) => !prev);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }
  const isWeekendDay = (date) => {
    return isWeekend(date);
  }
  const filterWeekends = (date) => {
    return isWeekendDay(date);
  }

  const handleParticipantChange = (index, field, value) => {
    if(field == 'locationCity' ){
             console.log('pickupPoints---',pickupPoints);
             if(value =='Pune to Pune'){
              setParticipantsPickupPoints(pickupPoints);
             }else if(value =='Mumbai to Mumbai'){
              setParticipantsPickupPoints(pickupPointsfromMumbai);
             }else{
              setParticipantsPickupPoints([{'Id': 1 ,'name':eventDetails.b2bLocaion}]);
             }
    }

    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
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
    clearErrors,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  // Watch the checkbox value
  const termsChecked = watch("termsAndconditions");

  // Handle blur to toggle the value
  const handleCheckboxBlur = () => {
    if (selectedLocation == null && eventType != 'CampingEvent') {
      setError("dateError", {
        type: "manual",
        message: "Please select Pickup Location and again click Pay Now",
      })
      setButtonDisabled(false);
      if (termsChecked) {
        setValue("termsAndconditions", false);
      }
    } else {
      clearErrors('dateError');
      setButtonDisabled(false);
    }
  }
  // Set checkbox to unchecked on blur if it is currently checked

  const onSubmit = async (data) => {
    setIsLoading(true); // Set loading to true before starting the request
    try {
      if (buttonClick == 'pay-now') {

        const formData = new FormData();
        formData.append("numberOfPeoples", noOfTrekkers);
        formData.append("amountPaid", Number(finalPrice));
        formData.append("pickupLocation", selectedLocation);
        const today = new Date();
        formData.append("bookingDate", today);
        formData.append("otherParticipants", JSON.stringify(participants));
        formData.append("bookingId", bookingId);
        formData.append("scheduleEventId", eventDetails.eventId);
        if (scheduleBatch.eventStartDate) {
          formData.append("eventStartDate", scheduleBatch.eventStartDate);
        }
        if (scheduleBatch.eventEndDate) {
          formData.append("eventEndDate", scheduleBatch.eventEndDate);
        }
        formData.append("addedDiscount", discount);
        formData.append("remainingAmount", remainingAmount);
        let r = await fetch(`${apiUrl}confirmed-booking`, {
          method: "PUT",
          body: formData,
        });

        let res = await r.json()
        if (res.isSuccess == true) {
          // try {
         // alert('In Pay Now');
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
          console.log('data---', data);
          if (data && data.redirectUrl) {
            // Redirect the user to PhonePe for payment
            window.location.href = data.redirectUrl;
          } else {
            console.log('Payment initiation failed. Please try again.');
          }
        }
      } else {
        const formData = new FormData();
        setBookingPhone(data.whatsappNumber);
        formData.append("fullName", data.fullName);
        formData.append("email", data.emailId);
        formData.append("mobileNumber", data.whatsappNumber);
        formData.append("batch", selectDate);
        formData.append("eventId", eventDetails.eventId);
        formData.append("eventName", eventDetails.name);
        const today = new Date();
        formData.append("bookingDate", today);
        formData.append("eventPrice", price);
        let r = await fetch(`${apiUrl}booking`, {
          method: "POST",
          body: formData,
        });

        let res = await r.json()

        if (res.isSuccess == true) {
          setButtonClick('pay-now');
          setBookingId(res.booking.bookingId);
        }
      }
    } catch (error) {
      console.error('Error during booking:', error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false); // Reset loading to false after the request is complete
    }
  }

  const handleSelection = (event) => {
    setSelectedLocation(event.target.value);
    setShowTermsAndConditions(true);
  };

  const increaseCount = async () => {
    if (Number(maxBooking) - Number(bookedSlot) > Number(noOfTrekkers)) {
      let count = noOfTrekkers;
      let price1 = price;
      count++;
      let convenienceFee = (Number(price1) * Number(count) * 0.015).toFixed(2);
      setNoOfTrekkers(count);
      let totalPrice = (Number(price1) * Number(count));
      let final_Price = Number(totalPrice) + Number(convenienceFee);
      if (Number(discount) > 0 && (Number(count) >= Number(noOfPeopleNeedforCoupon))) {
        final_Price = Number(final_Price) - Number(discount);
      } else {
        setDiscount(0);
      }
      setFinalPrice(final_Price);
      setActualPrice(Number(totalPrice));
      setConvenienceFee(Number(convenienceFee));
      setParticipants([
        ...participants,
        { name: "", mobileNumber: "", pickupLocation: "" },
      ]);
    } else {
      setBatchFull(true);
      setAvailableSlot(Number(maxBooking) - Number(bookedSlot));
    }
  }

  const decreaseCount = async () => {
    let count = 1;
    let price1;
    if (noOfTrekkers > 1) {
      count = noOfTrekkers;
      price1 = Number(actualPrice) / Number(count);
      count--;
      let amount = Number(price1) * Number(count);
      let convenienceFee = (Number(amount) * 0.015).toFixed(2);
      let final_Price = Number(amount) + Number(convenienceFee);
      if (Number(discount) > 0 && (Number(count) >= Number(noOfPeopleNeedforCoupon))) {
        final_Price = Number(final_Price) - Number(discount);
      } else {
        setDiscount(0);
      }
      setNoOfTrekkers(Number(count));
      setActualPrice(Number(amount));
      setFinalPrice(Number(final_Price));
      setConvenienceFee(Number(convenienceFee));
      setParticipants(participants.slice(0, -1));
    }

  }

  const onAutoplayTimeLeft = (s, time, progress) => {
    // progressCircle.current.style.setProperty('--progress', 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

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
    setIsLoadingMSG(true); // Start loading
    let batchdate;
    let batchSize = -1;
    let bookedSize = 0;
    let b2bPrice = 0;
    let eventCostPerPerson = 0;
    let eventCostPerPersonFromMumbai = 0;
    let batchDates = [];
    let batchesList = [];
    let eventType = event[0]?.eventType;
    setEventType(eventType);

    if (eventType == 'CampingEvent') {
      setShowTermsAndConditions(true);
    }

    const Q = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (event.batches) {
      for (let i = 0; i < event.batches.length; i++) {
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
    } else {
      for (let index = 0; index < event.length; index++) {
        batchSize = 0;
        bookedSize = 0;
        eventCostPerPerson = 0;
        eventCostPerPersonFromMumbai = 0;
        b2bPrice = 0;
        batchdate = '';
        if (new Date(event[index].eventStartDate) - Q >= 0 && (Number(event[index].eventBatchCount) > Number(event[index].alreadyBoockedCount))) {
          batchdate = new Date(event[index].eventStartDate).getDate() + ' ' + months[new Date(event[index].eventStartDate).getMonth()] + ' - ' + new Date(event[index].eventEndDate).getDate() + ' ' + months[new Date(event[index].eventEndDate).getMonth()] + ' ' + new Date(event[index].eventStartDate).getFullYear();
          eventCostPerPerson = event[index]?.eventCostPerPerson;
          eventCostPerPersonFromMumbai = event[index]?.eventCostPerPersonFromMumbai;
          b2bPrice = event[index]?.b2bPrice;
          batchSize = event[index]?.eventBatchCount;
          bookedSize = event[index]?.alreadyBoockedCount;
        } else if (event[index].everyWeekend == true && (Number(event[index].eventBatchCount) > Number(event[index].alreadyBoockedCount))) {
          batchdate = 'Available On All Weekends';
          eventCostPerPerson = event[index]?.eventCostPerPerson;
          eventCostPerPersonFromMumbai = event[index]?.eventCostPerPersonFromMumbai;
          b2bPrice = event[index]?.b2bPrice;
          batchSize = event[index]?.eventBatchCount;
          bookedSize = event[index]?.alreadyBoockedCount;
          setEveryWeekend(true);
        } else if (event[index].notScheduleYet == true) {
          batchdate = 'On Demand';
          setInquery(true);
          eventCostPerPerson = event[index]?.eventCostPerPerson;
          eventCostPerPersonFromMumbai = event[index]?.eventCostPerPersonFromMumbai;
          b2bPrice = event[index]?.b2bPrice;
          batchSize = event[index]?.eventBatchCount;
          bookedSize = event[index]?.alreadyBoockedCount;
        }

        if (batchSize > 0 && eventCostPerPerson > 0 && batchdate != '') {

          batchesList.push({
            batchSize: batchSize,
            bookedSize: bookedSize,
            eventCostPerPerson: eventCostPerPerson,
            batchdate: batchdate,
            eventCostPerPersonFromMumbai: eventCostPerPersonFromMumbai,
            b2bPrice: b2bPrice,
            eventId: event[index].eventId
          })
        }

        if (event[index].everyWeekend == false && event[index].notScheduleYet == false) {
          batchDates.push(new Date(event[index].eventStartDate).getDate() + ' ' + months[new Date(event[index].eventStartDate).getMonth()] + ' - ' + new Date(event[index].eventEndDate).getDate() + ' ' + months[new Date(event[index].eventEndDate).getMonth()] + ' ' + new Date(event[index].eventStartDate).getFullYear());
        } else if (event[index].notScheduleYet == true) {
          batchDates.push('On Demand');
        } else if (event[index].everyWeekend == true) {
          batchDates.push('Available On All Weekends');
        }

      }
    }

    if (batchesList.length <= 0) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
      setFinalBatchesList(batchesList);
    }

    let currentbatch = batchesList.find(batch => batch['eventId'] == currentEventId);
    if (currentbatch) {
      let convenienceFeePerPerson = currentbatch.eventCostPerPerson * 0.015;
      convenienceFeePerPerson = convenienceFeePerPerson.toFixed(2);
      console.log('here', currentbatch);
      if (batchDates.length > 0 && currentbatch.batchdate != 'Available On All Weekends') {

        setSelectedDate(currentbatch.batchdate);
      }
      setAvailableBatches(batchDates);
      setBatchDate(currentbatch.batchdate);
      setMaxBooking(currentbatch.batchSize);
      setBookedSlot(currentbatch.bookedSize);
      setFinalPrice(Number(currentbatch.eventCostPerPerson) + Number(convenienceFeePerPerson));
      setConvenienceFee(convenienceFeePerPerson);
      setActualPrice(Number(currentbatch.eventCostPerPerson));
      setPrice(currentbatch.eventCostPerPerson);
      setErrorMessageforNext(false);
    } else if (batchesList.length > 0) {
      let convenienceFeePerPerson = batchesList[0].eventCostPerPerson * 0.015;
      convenienceFeePerPerson = convenienceFeePerPerson.toFixed(2);
      //Math.round(((eventCostPerPerson * 0.015)/ 10) * 100) / 100;
      if (batchDates.length > 0 && batchesList[0].batchdate != 'Available On All Weekends') {
        setSelectedDate(batchesList[0].batchdate);
      }
      setAvailableBatches(batchDates);
      setBatchDate(batchesList[0].batchdate);
      setMaxBooking(batchesList[0].batchSize);
      setBookedSlot(batchesList[0].bookedSize);
      setFinalPrice(Number(batchesList[0].eventCostPerPerson) + Number(convenienceFeePerPerson));
      setConvenienceFee(convenienceFeePerPerson);
      setActualPrice(Number(batchesList[0].eventCostPerPerson));
      setPrice(batchesList[0].eventCostPerPerson);
      setErrorMessageforNext(true);
      setButtonDisabled(false);
      setSelectDate(batchesList[0].batchdate);
    }
    setIsLoadingMSG(false); // Start loading
  }

  useEffect(() => {
    if (isSuccess == false && type && params) {
      getAllRecord();
    }

    if (discount > 0 || discount === 0) {

      const timer = setTimeout(() => {
        setShowDiscountStatus(false); // Hide the message after 2 seconds
        setCouponCode('');
      }, 2000);

      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  })

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

  const getAllRecord = async () => {
    //  alert(params[0]);
    let r = await fetch(`${apiUrl}event-details/eventid/${params[0]}/${params[1]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })

    setCurrentEventId(params[0]);
    let res = await r.json()
    if (res.isSuccess == true) {
      setLoading(false);
      let tempLocations = [];
      setSuccess(true);
      setEventDetails(res.events);
      setScheduleBatch(res.ScheduleBatchesRecords);

      getNextBatchDate(res.ScheduleBatchesRecords);
      console.log('res.ScheduleBatchesRecords--', res.ScheduleBatchesRecords);
      if (res.ScheduleBatchesRecords.alreadyBoockedCount >= res.ScheduleBatchesRecords.eventBatchCount) {
        setButtonDisabled(true);
      } else {
        setButtonDisabled(false);
      }

      if (res.events.pickupPoints != null && res.events.pickupPoints != 'undefine') {
        const jsonData = convertHtmlToJSON(res.events.pickupPoints);
        setPickupPoints(jsonData);
        setParticipantsPickupPoints(jsonData);
      }
      if (res.events.pickupPointsfromMumbai != null && res.events.pickupPointsfromMumbai != 'undefine') {
        const jsonData = convertHtmlToJSON(res.events.pickupPointsfromMumbai);
        setPickupPointsfromMumbai(jsonData);
      }
      if (res.events.b2bLocaion != null && res.events.b2bLocaion != 'undefine') {
        setB2bLocation(res.events.b2bLocaion);
        tempLocations.push(res.events.b2bLocaion);
      }
      tempLocations.push('Pune to Pune');
      if (res.ScheduleBatchesRecords[0]?.eventCostPerPersonFromMumbai != 'undefine' && res.ScheduleBatchesRecords[0]?.eventCostPerPersonFromMumbai > 0) {
        tempLocations.push('Mumbai to Mumbai');
      }
      setShowLocations(tempLocations);
      getAvailableCoupons(res.ScheduleBatchesRecords);
    }

  }

  const handleCouponApply = async () => {
    try {
      if (couponCode) {
        if (!scheduleBatch.specialOfferEvent && (couponCode != preCouponCode)) {
          const response = await fetch(`${apiUrl}api/validate-coupon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: couponCode, eventType: eventDetails.eventType, numberOfPeople: noOfTrekkers })
          });
          setPreCouponCode(couponCode);
          const data = await response.json();
          let calculatedDiscount;
          let final_price = Number(actualPrice) + Number(convenienceFee);
          if (response.ok && data.isValid) {
            if (data.coupon == null) {
              calculatedDiscount = 0;
            } else if (data.coupon.discountPercent) {
              calculatedDiscount = Math.min(
                (Number(final_price) * Number(data.coupon.discountPercent)) / 100
              );

            } else if (data.coupon.discountPrice) {
              calculatedDiscount = data.coupon.discountPrice;
            }
            setNoOfPeopleNeedforCoupon(data.coupon.numberOfPeople)
            setShowDiscountStatus(true);
            setDiscount(Number(calculatedDiscount));
            setFinalPrice(Number(final_price) - Number(calculatedDiscount));
          } else {
            // setErrorMessage(data.message || 'Invalid coupon code.');
          }
        }
      } else {
        setPreCouponCode(couponCode);
        setDiscount(-1);
        setFinalPrice(actualPrice);
      }
    } catch (error) {
      //setErrorMessage('An error occurred while applying the coupon.');
    }

  };

  // get all available coupon code if it is available 
  const getAvailableCoupons = async (ScheduleBatchesRecords) => {
    console.log('ScheduleBatchesRecords', ScheduleBatchesRecords);
    setDiscountAvailable(!ScheduleBatchesRecords.specialOfferEvent);
    if (!ScheduleBatchesRecords.specialOfferEvent) {
      let scheduleEventType = ScheduleBatchesRecords.eventType;
      if (scheduleEventType == 'TrekEvent' || scheduleEventType == 'AdventureActivity') {
        scheduleEventType = 'TrekEvent';
      } else {
        scheduleEventType = ScheduleBatchesRecords.eventType;
      }

      const response = await fetch(`${apiUrl}get-coupons-event/${scheduleEventType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCoupons(data.coupons);
      }
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
          onAutoplayTimeLeft={onAutoplayTimeLeft}
        >
          {isSuccess && eventDetails.images.map((event, index) => (

            <SwiperSlide key={index}><img className='event-section-header-img' loading="lazy" src={`${apiUrl}` + event} />
              <div className="inner-content">
                <h3>{eventDetails.name} | Pune</h3>
              </div>
            </SwiperSlide>
          ))}

        </Swiper>
      </div>

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
              <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example  p-3 rounded-2" tabindex="0">
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
                        </td>
                      </tr> <tr>
                        <td >
                          <div className="section-details">
                            <ul className="display-bulletin">
                              {finalBatchesList && finalBatchesList.map((event, index) => (
                                <li key={index}><b>{event.batchdate}</b></li>
                              ))}
                            </ul>
                          </div>
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
                {eventType != 'CampingEvent' &&
                  <div id="scrollspyHeading6" className='pt-4 pb-1 px-2'>
                    <h2 className="h3"> Pickup Points : </h2>
                    <div className='margin-location'>
                      {eventDetails.b2bLocaion &&
                        <div className="section-details" >
                          <h2 > <b>Base to Base : </b></h2>
                          <ul className="display-bulletin"><li>{eventDetails.b2bLocaion} </li>
                          </ul>
                        </div>
                      }
                      <br />
                      <h2 > <b>Pickup Points from Pune :</b> </h2>
                      <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.pickupPoints) }} />
                      <br />
                      {eventDetails.pickupPointsfromMumbai &&
                        <div>
                          <h2 > <b>Pickup Points from Mumbai :</b> </h2>
                          <div className="section-details" dangerouslySetInnerHTML={{ __html: displayList(eventDetails.pickupPointsfromMumbai) }} />
                        </div>
                      }
                    </div>
                  </div>
                }
                <hr />
                <div>

                  <MinimalCoupons coupons={coupons} />
                </div>
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
            <div className="content-right-side col-sm-12 col-md-4  col-lg-4 col-xl-4 ">
              <div className="container sticky-top" >
                <div className="justify-content-md-center">
                  <div className="col-lg-12 d-none d-md-none d-lg-block">
                    <div className="booking-card mb-3 " >
                      <div className="card-body text-dark">
                        <h4 className="card-title"><center>
                          <b className='event-price'>₹{price} /- </b>
                          <sub >Per Person</sub>
                        </center>
                        </h4>

                        {/* {!isLoadingMSG && errorMessageforNext &&
                          <p className="bookingClosed" >**Current batch if full. To inquire about seat availability, please contact us directly or you can book for next batch on {batchDate}</p>
                        } */}
                        {buttonDisabled &&
                          <p className="bookingClosed" >**Bookings are currently closed. To inquire about seat availability, please contact us directly.</p>
                        }
                        {!inquery && !buttonDisabled && <> <div>
                          <center> {batchDate} </center></div>

                          <div className="button-margin button">
                            <input disabled={buttonDisabled} onClick={handleShow} type="submit" value="BOOK NOW" />
                          </div></>
                        }

                        {buttonDisabled &&
                          <div className="button-margin button">
                            <button type="button"><a href="https://wa.me/message/4IO4IE3JUKVHC1" target="_blank"> <strong>ENQUIRE NOW </strong></a> </button>
                          </div>
                        }
                        {inquery &&
                          <div>
                            <p className="bookingClosed" >**Due to some technical issue  we are unable to take your booking from website , please contact us directly.</p>

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
          <div className="d-sm-block d-md-none d-lg-none fixed-bottom">
            <div className="booking-card-mb mb-0 " style={{ "width": "100%;" }}>
              <div className="card-body text-dark">
                <div className="booking-section d-flex justify-content-between align-items-center">
                  <h4 className="card-title"><center>
                    <b className='event-price'>₹{price} /- </b>
                    <sub >Per Person</sub>
                  </center>
                  </h4>
                  <div>
                    <center> {batchDate} </center>
                  </div>
                </div>
                {/* {!isLoadingMSG && errorMessageforNext &&
                  <p className="bookingClosed" >**Current batch if full. To inquire about seat availability, please contact us directly or you can book for next batch on {batchDate}</p>
                } */}
                {buttonDisabled &&
                  <p className="bookingClosed" >**Bookings are currently closed. To inquire about seat availability, please contact us directly.</p>
                }
                {inquery && <div>
                  <p className="bookingClosed" >**Due to some technical issue  we are unable to take your booking from website, please contact us directly.</p>
                </div>
                }
                <div className="button-edit-container">
                  <div className="button button-margin ">
                    {!inquery && !buttonDisabled &&
                      <input className="button-input" disabled={isSubmitting} type="submit" onClick={handleShow} value="BOOK NOW" />
                    }

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
        {isSuccess &&
          <div className='add-Scroller'>
            <Modal show={show} onHide={handleClose}>
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">
                  <Modal.Header closeButton>
                    <div className="show-title-header"> <br />
                      <div className='booking-header'>
                        <h2>BOOKING</h2>
                        <p>{eventDetails.name}</p>

                      </div>
                    </div>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="content">
                      {buttonClick != 'pay-now' &&
                        <div className="user-details">
                          <div className="input-box ">
                            <span className="details">Full Name<span style={{ 'color': 'red' }}> *</span></span>
                            <input {...register("fullName", { required: { value: true, message: "This field is required" }, })} type="text" required />
                          </div>
                          <div className="input-box ">
                            <span className="details">Email ID<span style={{ 'color': 'red' }}> *</span></span>
                            <input  {...register("emailId", { required: { value: true, message: "This field is required" }, })} type="email" required />
                          </div>
                          <div className="input-box">
                            <span className="details">WhatsApp Mobile Number<span style={{ 'color': 'red' }}> *</span></span>
                            <input placeholder='+91' {...register("whatsappNumber", { required: { value: true, message: "This field is required" }, })} type="tel" required />
                          </div>
                          {!everyWeekend && <div className="input-box">
                            <span className="details">Select Batch<span style={{ 'color': 'red' }}> *</span></span>
                            <select onClick={(e) => setSelectDate(e)} required>
                              {finalBatchesList && finalBatchesList.map((event, index) => (
                                <option key={index} value={event.batchdate} >{event.batchdate}</option>
                              ))}
                            </select>
                          </div>}
                          {everyWeekend && <div className="input-box">
                            <span className="details">Select Batch</span>
                            <DatePicker placeholder="Select Date" selected={selectedDate} filterDate={filterWeekends} onChange={handleDateChange} />
                          </div>}
                        </div>}
                      {buttonClick == 'pay-now' &&
                        <div className="user-details">
                          {errors.dateError && <p className='show-error' >{errors.dateError.message}</p>}

                          {eventType != 'CampingEvent' &&

                            <div>
                              <h3>Join Us From:<span style={{ 'color': 'red' }}> *</span></h3>
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
                                  <h3>Select Pickup Location:<span style={{ 'color': 'red' }}> *</span></h3>
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
                                  <h3>Select Pickup Location:<span style={{ 'color': 'red' }}> *</span></h3>
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
                                  <h3>Selected Pickup Location:<span style={{ 'color': 'red' }}> *</span></h3>
                                  <ul className="b2blocation display-bulletin"><li>{eventDetails.b2bLocaion}</li>
                                  </ul>
                                </div>
                              }
                            </div>
                          }
                          {selected &&
                            <div className="input-box finalCalculation">
                              <div className="details">Add More Participants:</div>
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
                                    {console.log('participantsPickupPoints-----',participantsPickupPoints )}
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
                          {batchFull &&
                            <p className='bookingClosed'>Only {availableSlot} seats are currently available. Please reach out to us at +91 7028740961 to discuss the possibility of accommodating additional bookings.</p>
                          }
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
                          {selected && eventType == 'BackPackingTrip' &&
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
                          }
                          {showDiscountStatus && discount > 0 && <p style={{ 'display': 'flex', 'font-weight': 'bold', 'color': 'green', 'gap': '5px' }}> Discount Applied   <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.007 8.27C22.194 9.125 23 10.45 23 12c0 1.55-.806 2.876-1.993 3.73.24 1.442-.134 2.958-1.227 4.05-1.095 1.095-2.61 1.459-4.046 1.225C14.883 22.196 13.546 23 12 23c-1.55 0-2.878-.807-3.731-1.996-1.438.235-2.954-.128-4.05-1.224-1.095-1.095-1.459-2.611-1.217-4.05C1.816 14.877 1 13.551 1 12s.816-2.878 2.002-3.73c-.242-1.439.122-2.955 1.218-4.05 1.093-1.094 2.61-1.467 4.057-1.227C9.125 1.804 10.453 1 12 1c1.545 0 2.88.803 3.732 1.993 1.442-.24 2.956.135 4.048 1.227 1.093 1.092 1.468 2.608 1.227 4.05Zm-4.426-.084a1 1 0 0 1 .233 1.395l-5 7a1 1 0 0 1-1.521.126l-3-3a1 1 0 0 1 1.414-1.414l2.165 2.165 4.314-6.04a1 1 0 0 1 1.395-.232Z" fill="#009912"></path></g></svg></p>}
                          {showDiscountStatus && discount == 0 && <p style={{ 'display': 'flex', 'font-weight': 'bold', 'color': '#c70000', 'gap': '5px' }}> Coupon Not Applied  <svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#c70000" fill-rule="evenodd" d="M8,1 C11.8659932,1 15,4.13400675 15,8 C15,11.8659932 11.8659932,15 8,15 C4.13400675,15 1,11.8659932 1,8 C1,4.13400675 4.13400675,1 8,1 Z M3,8 C3,10.7614237 5.23857625,13 8,13 C9.01910722,13 9.96700318,12.6951083 10.7574478,12.1715651 L3.8284349,5.24255219 C3.30489166,6.03299682 3,6.98089278 3,8 Z M8,3 C6.98089278,3 6.03299682,3.30489166 5.24255219,3.8284349 L12.1715651,10.7574478 C12.6951083,9.96700318 13,9.01910722 13,8 C13,5.23857625 10.7614237,3 8,3 Z"></path> </g></svg></p>}
                          <div className='hr'></div>
                          {selected &&
                            <div className='finalCalculation'>
                              <span >Total To Pay</span>
                              <span></span>
                              <span ><div className='calculation'>
                                <span >₹{finalPrice} /-
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
                                >
                                  Show breakup
                                </a>
                                </span>
                              </div>
                              </span>
                            </div>
                          }
                        </div>
                      }
                      {
                        showBreakup && paymentOption == 'partial' &&
                        <div >
                          <table className='pay-table'>
                            <tr>
                              <th className='pay-th'>Details</th>
                              <th className='column2 pay-th'>Amount</th>
                            </tr>
                            <tr>
                              <td className='pay-td'>Event Fees</td>
                              <td className='column2 pay-td'>{noOfTrekkers} x {scheduleBatch.partialBookingAmount}</td>
                            </tr>
                            <tr>
                              <td className='pay-td'>Subtotal</td>
                              <td className='column2 pay-td'>{Number(noOfTrekkers) * Number(scheduleBatch.partialBookingAmount)}</td>
                            </tr>
                            <tr>
                              <td className='pay-td'>Convenience Fee (1.5 %)</td>
                              <td className='column2 pay-td'>{convenienceFee}</td>
                            </tr>
                            <tr>
                              <td className='pay-td'>Added On</td>
                              <td className='column2 pay-td'>0</td>
                            </tr>
                            <tr>
                              <th className='pay-th'>Total Payment</th>
                              <th className='column2 pay-th'>{partialPayment}</th>
                            </tr>
                          </table>
                        </div>

                      }
                      {showBreakup && paymentOption == 'full' &&
                        <div >
                          <table className='pay-table'>
                            <tr>
                              <th className='pay-th'>Details</th>
                              <th className='column2 pay-th'>Amount</th>
                            </tr>
                            <tr>
                              <td className='pay-td'>Event Fees</td>
                              <td className='column2 pay-td'>{noOfTrekkers} x {price}</td>
                            </tr>
                            <tr>
                              <td className='pay-td'>Subtotal</td>
                              <td className='column2 pay-td'>{actualPrice}</td>
                            </tr>
                            <tr>
                              <td className='pay-td'>Convenience Fee (1.5 %)</td>
                              <td className='column2 pay-td'>{convenienceFee}</td>
                            </tr>
                            <tr>
                              <td className='pay-td'>Added On</td>
                              <td className='column2 pay-td'>0</td>
                            </tr>
                            {discount > 0 ? <tr>
                              <td className='pay-td'>Added Discount</td>
                              <td className='column2 pay-td'>- {discount}</td>
                            </tr> : ''}
                            <tr>
                              <th className='pay-th'>Total Payment</th>
                              <th className='column2 pay-th'>{finalPrice}</th>
                            </tr>
                          </table>
                        </div>
                      }

                    </div>

                    {buttonClick != 'pay-now' &&
                      <div className="button">
                        <input type="submit" value="Next >>" />
                      </div>
                    }
                    {buttonClick == 'pay-now' && showTermsAndConditions &&
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
                          />
                          <div >
                            Accept all
                            <a className='link' href={'https://sahyadrivacations.com/user-agreement'} target="_blank"> terms & conditions</a>
                          </div>
                        </div>

                        <div className="button">
                          <input style={{ "background": "green" }} disabled={buttonDisabled} type="submit" value="Pay Now" />
                        </div>
                      </div>
                    }
                  </Modal.Body>
                </div>
              </form>
            </Modal>
          </div>
        }
      </div>
      {show == false && <ContactSection />}

      <Footer />
    </div>
  )
}

export default ShowEventDetails
