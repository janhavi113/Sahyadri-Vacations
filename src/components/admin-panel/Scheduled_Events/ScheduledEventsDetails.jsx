import React, { useRef, useEffect, useState } from 'react';
import AdminNavbar from "../../AdminNavbar";
import { useSearchParams, useNavigate } from "react-router-dom";
import '../../User-Panel/ShowEventDetails/ShowEventDetails.css'
import './ScheduledEvents.css'
import GenerateBrochure from "./GenerateBrochure";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css/bundle';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const ScheduledEventsDetails = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const queryParameters = new URLSearchParams(window.location.search);
  const [type, setType] = useState(queryParameters.get("eventid"));
  const [startDate, setStartDate] = useState(new Date());
  const [params, setParams] = useState(type.split('/'));
  const [isSuccess, setSuccess] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [scheduleBatch, setScheduleBatch] = useState();
  const [showBrochure, setShowBrochure] = useState(false);
  const [showBrochureForm, setShowBrochureForm] = useState(false);
  const [everyWeekend, setEveryWeekend] = useState(false);
  const [noOfTrekkers, setNoOfTrekkers] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0);
  const [availableBatches, setAvailableBatches] = useState();
  const [price, setPrice] = useState(0);
  const [batchDate, setBatchDate] = useState();
  const [availableSlot, setAvailableSlot] = useState();
  const [inquery, setInquery] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigateUrl = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  useEffect(() => {

    if (isSuccess == false && type && params) {
      getAllRecord();
    }
  })
  const getNextBatchDate = (event) => {
    console.log('event--', event);
    let batchdate = '';
    let batchSize = -1;
    let eventCostPerPerson;
    let batchDates = [];
    //let eventType = event.eventType;
    const Q = new Date("2024-04-09");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (eventDetails.batches) {
      for (let i = 0; i < event.batches.length; i++) {
        console.log('event.batches[' + i + ']--', event.batches[i]);
        if (eventDetails.batches[i].everyWeekend == true) {
          batchdate = 'Available On All Weekends';
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
          setEveryWeekend(true);
        }
        else if (eventDetails.batches[i].notScheduleYet == true) {
          batchdate = 'On Demand';
          setInquery(true);
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
        }
        else {
          batchdate = batchdate + new Date(eventDetails.batches[i].eventStartDate).getDate() + ' ' + months[new Date(eventDetails.batches[i].eventStartDate).getMonth()] + ' ' + new Date(eventDetails.batches[i].eventStartDate).getFullYear() + ' - ' + new Date(eventDetails.batches[i].eventEndDate).getDate() + ' ' + months[new Date(eventDetails.batches[i].eventEndDate).getMonth()] + ' ' + new Date(eventDetails.batches[i].eventStartDate).getFullYear() + ' | ';
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
          batchSize = event.batches[i].eventBatchCount;
        }

        if (eventDetails.batches[i].everyWeekend == false && event.batches[i].notScheduleYet == false) {
          batchDates.push(new Date(eventDetails.batches[i].eventStartDate).getDate() + ' ' + months[new Date(eventDetails.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(eventDetails.batches[i].eventEndDate).getDate() + ' ' + months[new Date(eventDetails.batches[i].eventEndDate).getMonth()] + ' ' + new Date(eventDetails.batches[i].eventStartDate).getFullYear());
        } else if (eventDetails.batches[i].notScheduleYet == true) {
          batchDates.push('On Demand');
        } else if (eventDetails.batches[i].everyWeekend == true) {
          batchDates.push('Available On All Weekends');
        }
      }
    } else {
      if (eventDetails.everyWeekend == true) {
        batchdate = 'Available On All Weekends';
        eventCostPerPerson = event.eventCostPerPerson;
        batchSize = event.eventBatchCount;
        setEveryWeekend(true);
      }
      else if (eventDetails.notScheduleYet == true) {
        batchdate = 'On Demand';
        setInquery(true);
        eventCostPerPerson = event.eventCostPerPerson;
        batchSize = event.eventBatchCount;
      }
      else {
        batchdate = batchdate + new Date(eventDetails.eventStartDate).getDate() + ' ' + months[new Date(eventDetails.eventStartDate).getMonth()] + ' ' + new Date(eventDetails.eventStartDate).getFullYear() + ' - ' + new Date(eventDetails.eventEndDate).getDate() + ' ' + months[new Date(eventDetails.eventEndDate).getMonth()] + ' ' + new Date(eventDetails.eventStartDate).getFullYear() + ' | ';
        eventCostPerPerson = event.eventCostPerPerson;
        batchSize = event.eventBatchCount;
      }

      if (eventDetails.everyWeekend == false && event.notScheduleYet == false) {
        batchDates.push(new Date(eventDetails.eventStartDate).getDate() + ' ' + months[new Date(eventDetails.eventStartDate).getMonth()] + ' - ' + new Date(eventDetails.eventEndDate).getDate() + ' ' + months[new Date(eventDetails.eventEndDate).getMonth()] + ' ' + new Date(eventDetails.eventStartDate).getFullYear());
      } else if (eventDetails.notScheduleYet == true) {
        batchDates.push('On Demand');
      } else if (eventDetails.everyWeekend == true) {
        batchDates.push('Available On All Weekends');
      }
    }
    console.log('batchDates --- ' + batchDates);
    if (batchdate && eventCostPerPerson) {
      setAvailableBatches(batchDates);
      setPrice(eventCostPerPerson);
      setBatchDate(batchdate);
      setAvailableSlot(batchSize);
      setFinalPrice(eventCostPerPerson);
    }
  }
  const getAllRecord = async () => {
    let r = await fetch(`${apiUrl}event-details-admin/eventid/${params[0]}/${params[1]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    // console.log( 'res ',res);
    if (res.isSuccess == true) {
      setSuccess(true);
      // console.log('eventDetails ', res.events);
      console.log('scheduleBatch', res.ScheduleBatchesRecords);
      setEventDetails(res.events);
      setScheduleBatch(res.ScheduleBatchesRecords);
      getNextBatchDate(res.ScheduleBatchesRecords);

      //// console.log('scheduleBatch',scheduleBatch );
    }

  }
  const deleteScheduleEvents = async () => {
    console.log('Button clicked from class component!');
    let r = await fetch(`${apiUrl}delete-scheduled-events/eventid/${params[0]}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json();
    if (r.ok) {
      navigateUrl('/scheduled-events');
    }
  };

  const openConfirmPopup = () => {
    setShowConfirm(true);
  };
  const editScheduleEvent = () => {
    navigateUrl(`/update-schedule-events?eventid=${params[0]}`);
  };
  const displayList = (data) => {
    console.log('-=-data', data);

    var splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
    splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
    splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
    splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
    return splitedList;
  }
  const onAutoplayTimeLeft = (s, time, progress) => {
    // progressCircle.current.style.setProperty('--progress', 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <div>
      <AdminNavbar>
        <div className="contentbody">
          <div className="container justify-content-center py-md-5">
            <div className="row justify-content- py-4">
              <section className="py-16 px-6 md:px-20 text-center bg-gray-50">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-0">
                    Schedule Batch Details
                  </h2>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button onClick={editScheduleEvent} type="button" className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700"> <strong>EDIT</strong> </button>
                    <button onClick={() => setShowDialog(true)} type="button" className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700"> <strong>DELETE</strong> </button>
                    <button
                      onClick={() => setShowBrochure(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                    >
                      {showBrochureForm ? "Close Brochure Form" : "Generate Brochure PDF"}
                    </button>

                  </div>
                </div>
                         {showBrochure && (
                                <GenerateBrochure
                                    event={eventDetails}
                                    inquiry={scheduleBatch}
                                    onClose={() => setShowBrochure(false)}
                                />
                            )}
                {/* Show Info OR Forms */}
                {scheduleBatch && (
                  <div className="mt-8 text-left">
                    <div className="bg-white shadow-lg rounded-xl p-6 space-y-8">

                      {/* Event Details Section */}
                      <section>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Event Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Event Name:</span> {scheduleBatch.eventname}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Event API:</span> {scheduleBatch.eventApi}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Event ID:</span> {scheduleBatch.eventId}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Event Type:</span> {scheduleBatch.eventType}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Start Date:</span> {new Date(scheduleBatch.eventStartDate).toLocaleDateString()}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">End Date:</span> {new Date(scheduleBatch.eventEndDate).toLocaleDateString()}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Duration:</span> {scheduleBatch.duration}
                          </div>
                        </div>
                      </section>

                      {/* Pricing Section */}
                      <section>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Cost/Person (Pune):</span> ₹{scheduleBatch.eventCostPerPerson}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Mumbai Cost/Person:</span> ₹{scheduleBatch.eventCostPerPersonFromMumbai}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">B2B Price:</span> ₹{scheduleBatch.b2bPrice}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Partial Booking Amount:</span> ₹{scheduleBatch.partialBookingAmount}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Special Offer:</span> {scheduleBatch.specialOfferEvent ? "Yes" : "No"}
                          </div>
                        </div>
                      </section>

                      {/* Sharing Options */}
                      <section>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Sharing & Upgrades</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Double Sharing:</span> ₹{scheduleBatch.doubleSharing}
                            <div className="text-sm text-gray-600">{scheduleBatch.doubleSharingNote}</div>
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Triple Sharing:</span> ₹{scheduleBatch.tripalSharing}
                            <div className="text-sm text-gray-600">{scheduleBatch.tripalSharingNote}</div>
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">3rd AC Upgrade:</span> ₹{scheduleBatch.thirdAcUpgrate}
                            <div className="text-sm text-gray-600">{scheduleBatch.thirdAcUpgrateNote}</div>
                          </div>
                        </div>
                      </section>

                      {/* Booking Info */}
                      <section>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Booking Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Booking Till:</span> {scheduleBatch.bookingTillDate} {scheduleBatch.bookingTillTime}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Batch Count:</span> {scheduleBatch.eventBatchCount}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Already Booked:</span> {scheduleBatch.alreadyBoockedCount}
                          </div>
                        </div>
                      </section>

                      {/* Status Section */}
                      <section>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Active:</span> {scheduleBatch.active ? "Yes" : "No"}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Every Weekend:</span> {scheduleBatch.everyWeekend ? "Yes" : "No"}
                          </div>
                          <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Not Scheduled Yet:</span> {scheduleBatch.notScheduleYet ? "Yes" : "No"}
                          </div>
                        </div>
                      </section>

                      {/* Note */}
                      {scheduleBatch.note && (
                        <section>
                          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Note</h3>
                          <div className="p-2 bg-gray-50">{scheduleBatch.note}</div>
                        </section>
                      )}

                      {/* Images */}
                      {scheduleBatch.images && (
                        <section>
                          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Images</h3>
                          <div className="flex gap-4 flex-wrap">
                            {scheduleBatch.images.split(",").map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`batch-img-${idx}`}
                                className="w-40 h-32 object-cover rounded-lg shadow"
                              />
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Scheduled Batches */}
                      {availableBatches && (
                        <section>
                          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Scheduled Batches</h3>
                          {availableBatches.map((event, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded">
                              <b>Upcoming Batch {index + 1}:</b> {event}
                            </div>
                          ))}
                        </section>
                      )}

                    </div>
                  </div>
                )}

                {showDialog && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                      <>
                        <h3 className="text-lg font-bold mb-4">Do you want to delete event ?</h3>
                        <div className="flex justify-between">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={deleteScheduleEvents}
                          >
                            Delete
                          </button>
                          <button
                            className="bg-orange-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                              setShowConfirm(false);
                              setShowDialog(false);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>


                    </div>
                  </div>
                )}

              </section>
            </div>
          </div>
        </div>
      </AdminNavbar>
    </div>
  )
}

export default ScheduledEventsDetails
