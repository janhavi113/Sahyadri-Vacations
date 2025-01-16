import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "../../AdminNavbar";
import "./ScheduleEvents.css"
import "../CreateEvent/CreateEvents.css"
// import DatePicker from "./EventDatePicker";
//import card from "./card"
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form"
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import { useSearchParams, useNavigate } from "react-router-dom";
const UpdateScheduleEvents = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [activeError, setActiveError] = useState({ disply: false });
  const [count, setCount] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files

  // find parameter from url
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParameters = new URLSearchParams(window.location.search);
  const [type, setType] = useState(queryParameters.get("eventid"));
  const [params, setParams] = useState(type.split('/'));
  const [isActive, setActive] = useState();
  const [eventname, setEventname] = useState();
  const [eventType, setEventType] = useState();
  const [eventIsScheduled, setEventIsScheduled] = useState();
  const [eventId, setEventId] = useState();
  const [eventCostPerPerson, setEventCostPerPerson] = useState();
  const [eventEndDate, setEventEndDate] = useState();
  const [eventStartDate, setEventStartDate] = useState();
  const [eventBatchCount, setEventBatchCount] = useState();
  const [everyWeekend, setEveryWeekend] = useState();
  const [notScheduleYet, setNotScheduleYet] = useState();
  const [b2bPrice, setB2bPrice] = useState();
  const [bookingTillDate, setBookingTillDate] = useState();
  const [bookingTillTime, setBookingTillTime] = useState();
  const [specialOfferEvent, setSpecialOfferEvent] = useState();
  const [partialBookingAmount, setPartialBookingAmount] = useState();
  const [eventCostPerPersonFromMumbai, setEventCostPerPersonFromMumbai] = useState(0);
  const [doubleSharing, setDoubleSharing] = useState(0);
  const [doubleSharingNote, setDoubleSharingNote] = useState('');
  const [tripalSharing, setTripalSharing] = useState(0);
  const [tripalSharingNote, setTripalSharingNote] = useState('');
  const [thirdAcUpgrate, setThirdAcUpgrate] = useState(0);
  const [thirdAcUpgrateNote, setThirdAcUpgrateNote] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }
    getCurrentrecord();
  }, [navigate]);

  const [file, setFiles] = useState(null);

  const getCurrentrecord = async () => {
    let r = await fetch(`${apiUrl}schedule-event-to-update/${params}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json();
    if (res.isSuccess == true) {
      // Set values from the response
      setSuccess(res.isSuccess);
      setEvent(res.events);
      setActive(res.scheduleBatch[0].active);
      setEventname(res.scheduleBatch[0].eventname);
      setEventType(res.scheduleBatch[0].eventType);
      setEventCostPerPerson(res.scheduleBatch[0].eventCostPerPerson);
      setEventEndDate(new Date(res.scheduleBatch[0].eventEndDate).toISOString().split('T')[0]);
      setEventStartDate(new Date(res.scheduleBatch[0].eventStartDate).toISOString().split('T')[0]);
      setEventBatchCount(res.scheduleBatch[0].eventBatchCount);
      setEveryWeekend(res.scheduleBatch[0].everyWeekend);
      setNotScheduleYet(res.scheduleBatch[0].notScheduleYet);
      setB2bPrice(res.scheduleBatch[0].b2bPrice);
      setBookingTillDate(res.scheduleBatch[0].bookingTillDate);
      setBookingTillTime(res.scheduleBatch[0].bookingTillTime);
      setSpecialOfferEvent(res.scheduleBatch[0].specialOfferEvent);
      setEventIsScheduled(res.scheduleBatch[0].scheduleEventId);
      setEventId(res.scheduleBatch[0].eventId);
      setPartialBookingAmount(res.scheduleBatch[0].partialBookingAmount);

      // Set new fields
      setDoubleSharing(res.scheduleBatch[0].doubleSharing);
      setDoubleSharingNote(res.scheduleBatch[0].doubleSharingNote);
      setTripalSharing(res.scheduleBatch[0].tripalSharing);
      setTripalSharingNote(res.scheduleBatch[0].tripalSharingNote);
      setThirdAcUpgrate(res.scheduleBatch[0].thirdAcUpgrate);
      setThirdAcUpgrateNote(res.scheduleBatch[0].thirdAcUpgrateNote);
      setNote(res.scheduleBatch[0].note);

      // Handle uploaded images
      let images = [];
      images.push(res.scheduleBatch[0]?.images);
      setUploadedFiles(images);
    }
    //console.log('events', res.scheduleBatch[0].scheduleEventId);
  }

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file), // Create a preview URL for the image
      })
    );
    setUploadedFiles(newFiles); // Add new files to the uploaded files state
    clearErrors("dropzone");
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (file) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== file)); // Remove the file from the state
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    //console.log('uploadedFiles---', uploadedFiles);
    if (uploadedFiles.length === 0) {
      setError("dropzone", {
        type: "manual",
        message: "Please upload at least one file.",
      });
      return;
    } else {
      formData.append("file", uploadedFiles[0]);
    }


    if (isActive && ((everyWeekend == true && eventEndDate != '' && notScheduleYet == true) || (everyWeekend == true && eventEndDate != '') || (eventEndDate != '' && notScheduleYet == true) || (everyWeekend == true && notScheduleYet == true))) {
      setActiveError({ disply: true, message: "You can only selet one from Every Weekend / Not Schedule Yet / Event EndDate " });
    } else {
      setActiveError({ disply: false });
      //console.log('isActive',isActive);
      formData.append("active", isActive);
      formData.append("eventId", eventIsScheduled);
      const search = events.filter(function (item) {
        //console.log('item', item.eventId == eventIsScheduled)
        return item.eventId == eventIsScheduled;
      });
      console.log('search--', (specialOfferEvent == 'on' || specialOfferEvent == true));
      let b2bValue = b2bPrice == null ? 0 : b2bPrice;
      formData.append('eventname', search[0].name);
      formData.append('eventType', eventType);
      formData.append('eventCostPerPerson', eventCostPerPerson);
      formData.append('eventEndDate', new Date(eventEndDate));
      formData.append('eventStartDate', new Date(eventStartDate));
      formData.append('eventBatchCount', eventBatchCount);
      formData.append('everyWeekend', everyWeekend);
      formData.append('notScheduleYet', notScheduleYet);
      formData.append('b2bPrice', b2bValue);
      formData.append('bookingTillDate', bookingTillDate);
      formData.append('specialOfferEvent', specialOfferEvent);
      formData.append('bookingTillTime', bookingTillTime.toString());
      formData.append('scheduleEventId', eventIsScheduled);
      formData.append('partialBookingAmount', partialBookingAmount);
      formData.append('eventCostPerPersonFromMumbai', eventCostPerPersonFromMumbai);
      // New fields added
      formData.append('doubleSharing', doubleSharing);
      formData.append('doubleSharingNote', doubleSharingNote);
      formData.append('tripalSharing', tripalSharing);
      formData.append('tripalSharingNote', tripalSharingNote);
      formData.append('thirdAcUpgrate', thirdAcUpgrate);
      formData.append('thirdAcUpgrateNote', thirdAcUpgrateNote);
      formData.append('note', note);

      const url = `${apiUrl}update-schedule-events/${eventId}`;
      let r = await fetch(url, {
        method: "POST",
        body: formData,
      })
      let res = await r.json()
      if (res.isSuccess == true) {

        navigate(`/scheduled-event-details?eventid=${res.events[0].eventId}/${res.events[0].eventApi}`)
      }
    }
  }


  return (
    <div>
      <AdminNavbar>
        < form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="schedule-form container">
            <div className="title-header">Schedule Event</div>
            <div className="content">
              {isSuccess &&
                <div className="user-details">
                  <div className="input-box ">
                    <span className="details">Event Name<span style={{ 'color': 'red' }}>*</span></span>
                    <select value={eventIsScheduled} onChange={(e) => setEventIsScheduled(e.target.value)} disabled >
                      {events.map(event => (
                        <option value={event.eventId} key={event.eventId}>{event.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-box-column ">
                    <span className="details">Start Date </span>
                    <input type="date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} />
                  </div>
                  <div className="input-box-column ">
                    <span className="details">End Date </span>
                    <input type="date" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} />
                  </div>
                  <br />
                  <div className="input-box-column ">
                    <span className="details">Booking Open Till Date </span>
                    <input type="date" value={bookingTillDate} onChange={(e) => setBookingTillDate(e.target.value)} />
                  </div>
                  <div className="input-box-column ">
                    <span className="details">Booking Open Till Time</span>
                    <input type="time" value={bookingTillTime} onChange={(e) => setBookingTillTime(e.target.value)} />
                  </div>

                  {errors.dateError && <p className='show-error' >{errors.dateError.message}</p>}
                  <div className="input-box-column event-picker ">
                    <span className="details">Every Weekend </span>
                    <input type="checkbox" defaultChecked={everyWeekend} onChange={(e) => setEveryWeekend(e.target.checked)} />
                  </div>

                  <div className="input-box-column event-picker ">
                    <span className="details">On Public Demand </span>
                    <input type="checkbox" defaultChecked={notScheduleYet} onChange={(e) => setNotScheduleYet(e.target.checked)} />
                  </div>
                  {activeError.disply && <div className='errorMessage'>{activeError.message}</div>}
                  {eventType == 'BackPackingTrip' &&
                    <div className="input-box-column ">
                      <span className="details">Partial Booking Amount Per Person </span>
                      <input value={partialBookingAmount} onChange={(e) => setPartialBookingAmount(e.target.value)} type="text" />
                    </div>
                  }
                  <div className="input-box-column ">
                    <span className="details">B2B Per Person </span>
                    <input value={b2bPrice} onChange={(e) => setB2bPrice(e.target.value)} type="text" />
                  </div>
                  <div className="input-box-column">
                    <span className="details">Cost Per Person from Pune<span style={{ 'color': 'red' }}>*</span></span>
                    <input value={eventCostPerPerson} onChange={(e) => setEventCostPerPerson(e.target.value)} type="text" required />
                  </div>
                  <div className="input-box-column">
                    <span className="details">Cost Per Person from Mumbai <span style={{ 'color': 'red' }}>*</span></span>
                    <input value={eventCostPerPersonFromMumbai} onChange={(e) => setEventCostPerPersonFromMumbai(e.target.value)} type="text" required />
                  </div>

                  {/* Double Sharing */}
                  <div className="input-box-column">
                    <span className="details">
                      Double Sharing <span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="number"
                      value={doubleSharing}
                      onChange={(e) => setDoubleSharing(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box-column">
                    <span className="details">Double Sharing Note</span>
                    <textarea
                      value={doubleSharingNote}
                      onChange={(e) => setDoubleSharingNote(e.target.value)}
                    />
                  </div>

                  {/* Tripal Sharing */}
                  <div className="input-box-column">
                    <span className="details">
                      Tripal Sharing <span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="number"
                      value={tripalSharing}
                      onChange={(e) => setTripalSharing(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box-column">
                    <span className="details">Tripal Sharing Note</span>
                    <textarea
                      value={tripalSharingNote}
                      onChange={(e) => setTripalSharingNote(e.target.value)}
                    />
                  </div>

                  {/* Third AC Upgrade */}
                  <div className="input-box-column">
                    <span className="details">
                      Third AC Upgrade <span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="number"
                      value={thirdAcUpgrate}
                      onChange={(e) => setThirdAcUpgrate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box-column">
                    <span className="details">Third AC Upgrade Note</span>
                    <textarea
                      value={thirdAcUpgrateNote}
                      onChange={(e) => setThirdAcUpgrateNote(e.target.value)}
                    />
                  </div>

                  {/* General Note */}
                  <div className="input-box-column">
                    <span className="details">General Note</span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <div className="input-box-column ">
                    <span className="details">Batch Size <span style={{ 'color': 'red' }}>*</span></span>
                    <input
                      value={eventBatchCount}
                      onChange={(e) => setEventBatchCount(e.target.value)}
                      type="number"
                      min="1"
                      required
                    />
                  </div>
                  <div className="input-box-column ">
                    <span className="details">Active</span>
                    <input defaultChecked={isActive} onChange={(e) => setActive(e.target.checked)} type="checkbox" id="active" name="Active" />
                  </div>
                  <div className="input-box-column ">
                    <span className="details">Special Offer Event</span>
                    <input defaultChecked={specialOfferEvent} onChange={(e) => setSpecialOfferEvent(e.target.checked)} type="checkbox" id="active" name="Active" />
                  </div>
                  <div className="input-box-column ">
                    <span className="details"></span>
                  </div>
                  <div className="input-box-column ">
                    <span className="details">Upload Cover Photo <span style={{ 'color': 'red' }}>*</span></span>
                  </div>
                  {/* Dropzone for file uploads */}
                  <Dropzone onDrop={onDrop} accept="image/jpeg, image/png">
                    {({ getRootProps, getInputProps }) => (
                      <section className="dropzone">
                        <div {...getRootProps({ className: "dropzone" })}>
                          <input {...getInputProps()} />
                          <p>
                            Drag 'n' drop some files here, or click to select files
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  {/* Show validation error if no file is uploaded */}
                  {errors.dropzone && (
                    <p className="error-message">{errors.dropzone.message}</p>
                  )}

                  {/* Preview Uploaded Images */}
                  <div className="image-preview-container">
                    {uploadedFiles.map((file) => (
                      <div key={file.name} className="image-preview">
                        <img
                          src={file.preview ? file.preview : `${apiUrl}${file}`}
                          alt={file.name}
                          style={{
                            width: "150px",
                            height: "175px",
                            objectFit: "cover",
                          }}
                        />
                        <button type="button" onClick={() => removeFile(file)}>
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            size="lg"
                            style={{ color: "orange" }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              }
            </div>
            <div className='button-group'>
              <div className="button-edit-container">
                <div className="button">
                  <input type="submit" value="Schedule Batches" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </AdminNavbar>
    </div>

  )
}

export default UpdateScheduleEvents