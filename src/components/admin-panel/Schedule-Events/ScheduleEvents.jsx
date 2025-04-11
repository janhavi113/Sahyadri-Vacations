import React, { useEffect, useState } from 'react'
import AdminNavbar from "../../AdminNavbar";
import "./ScheduleEvents.css"
import "../CreateEvent/CreateEvents.css"
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form"
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
function ScheduleEvents() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [activeError, setActiveError] = useState({ disply: false });
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
  const [search, setSearch] = useState();
  const [eventType, setEventType] = useState();
  const [eventOptionsList, setEventOptionsList] = useState([]);
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
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }
    getCurrentrecord();
  }, [navigate]);

  const getCurrentrecord = async () => {
    let r = await fetch(`${apiUrl}schedule-event`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json();
    if (res.isSuccess == true) {
      setSuccess(res.isSuccess);
      setEvent(res.events);

      const eventOptions = res.events.map(event => ({
        value: event.eventId,
        label: event.name,
      }));
      setEventOptionsList(eventOptions);
    }
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (file) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== file)); // Remove the file from the state
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (uploadedFiles.length === 0) {
      setError("dropzone", {
        type: "manual",
        message: "Please upload at least one file.",
      });
      return;
    } else {
      formData.append("file", uploadedFiles[0]);
    }

    let active = data ? data.Active : false;

    if (active && ((data.everyWeekend == true && data.eventEndDate != '' && data.notScheduleYet == true) || (data.everyWeekend == true && data.eventEndDate != '') || (data.eventEndDate != '' && data.notScheduleYet == true) || (data.everyWeekend == true && data.notScheduleYet == true))) {
      setActiveError({ disply: true, message: "You can only selet one from Every Weekend / Not Schedule Yet / Event EndDate " });
    } else {
      setActiveError({ disply: false });

      formData.append("active", active);
      formData.append('eventname', search[0].name);
      formData.append('eventType', search[0].eventType);
      formData.append('duration', search[0].duration);
      formData.append('scheduleEventId', search[0].eventId);
      formData.append('eventCostPerPerson', data.eventCostPerPerson);
      formData.append('eventCostPerPersonFromMumbai', data.eventCostPerPersonFromMumbai);
      if (data.eventEndDate) {
        formData.append('eventEndDate', new Date(data.eventEndDate));
      }
      if (data.eventStartDate) {
        formData.append('eventStartDate', new Date(data.eventStartDate));
      }
      formData.append('eventBatchCount', data.eventBatchCount);
      formData.append('everyWeekend', data.everyWeekend);
      formData.append('notScheduleYet', data.notScheduleYet);
      formData.append('b2bPrice', data.b2bPrice);
      formData.append('bookingTillDate', data.bookingTillDate);
      formData.append('specialOfferEvent', data.specialOfferEvent);
      formData.append('bookingTillTime', data.bookingTillTime.toString());
      // New fields added
      formData.append('doubleSharing', doubleSharing);
      formData.append('doubleSharingNote', doubleSharingNote);
      formData.append('tripalSharing', tripalSharing);
      formData.append('tripalSharingNote', tripalSharingNote);
      formData.append('thirdAcUpgrate', thirdAcUpgrate);
      formData.append('thirdAcUpgrateNote', thirdAcUpgrateNote);
      if (data.partialBookingAmount) {
        formData.append('partialBookingAmount', data.partialBookingAmount);
      }
      const url = `${apiUrl}schedule-event`;
      let r = await fetch(url, {
        method: "POST",
        body: formData,
      })
      let res = await r.json()
      if (res.isSuccess == true) {
        navigate('/scheduled-events')
      }
    }
  }

  const handleSelectEvent = async (eventId) => {
    const search = events.filter(function (item) {
      return item.eventId == eventId;
    });
    if (search) {
      setEventType(search[0].eventType);
      setSearch(search);
    }
  }
  const handleEventChange = (selectedOption) => {
    if (selectedOption) {
      handleSelectEvent(selectedOption.value);
    }
  };

  return (
    <div>
      <AdminNavbar>

        < form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="schedule-form container">
            <div className="title-header">Schedule Event</div>

            <div className="content">
              {isSuccess &&
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">
                      Event Name<span style={{ color: 'red' }}>*</span>
                      <HelpTooltip text="Choose an event from the dropdown." />
                    </span>
                    <Select
                      options={eventOptionsList}
                      onChange={handleEventChange}
                      placeholder="---Select---"
                      isSearchable
                    />

                  </div>
                  <div className="input-box-column ">
                    <span className="details">Start Date
                      <HelpTooltip text="Select the starting date of the event" /></span>
                    <input type="date" {...register("eventStartDate")} />

                  </div>
                  <div className="input-box-column ">
                    <span className="details">End Date
                      <HelpTooltip text="Choose the end date of the event." /></span>
                    <input type="date" {...register("eventEndDate")} />

                  </div>
                  <br />
                  <div className="input-box-column ">
                    <span className="details">Booking Open Till Date
                      <HelpTooltip text="Set the final date for accepting bookings." /></span>
                    <input type="date" {...register("bookingTillDate")} />

                  </div>
                  <div className="input-box-column ">
                    <span className="details">Booking Open Till Time
                      <HelpTooltip text="Set the cut-off time for bookings." /></span>
                    <input type="time" {...register("bookingTillTime")} />

                  </div>
                  {errors.dateError && <p className='show-error' >{errors.dateError.message}</p>}
                  <div className="input-box-column event-picker ">
                    <span className="details">Every Weekend
                      <HelpTooltip text="Check if this event occurs every weekend." /></span>
                    <input type="checkbox"  {...register("everyWeekend")} />

                  </div>

                  <div className="input-box-column event-picker ">
                    <span className="details">On Public Demand
                      <HelpTooltip text="Check if this event is based on public demand." /></span>
                    <input type="checkbox"   {...register("notScheduleYet")} />

                  </div>
                  {activeError.disply && <div className='errorMessage'>{activeError.message}</div>}

                  <div className="input-box-column ">
                    <span className="details">B2B Per Person
                      <HelpTooltip text="Enter the Base to Base pricing per person." /></span>
                    <input  {...register("b2bPrice")} type="number" defaultValue={0} />

                  </div>

                  <div className="input-box-column">
                    <span className="details">Cost Per Person from Pune<span style={{ 'color': 'red' }}>*</span>
                      <HelpTooltip text="Enter the cost per person if travelling from Pune." /></span>
                    <input defaultValue={0}  {...register("eventCostPerPerson", { required: { value: true, message: "This field is required" }, })} type="number" required />

                  </div>
                  <div className="input-box-column">
                    <span className="details">Cost Per Person from Mumbai<span style={{ 'color': 'red' }}>*</span>
                      <HelpTooltip text="Enter the cost per person if travelling from Mumbai." /></span>
                    <input defaultValue={0}  {...register("eventCostPerPersonFromMumbai")} type="number" />

                  </div>

                  {eventType == 'BackPackingTrip' &&
                    <div className="input-box-column ">
                      <span className="details">Partial Booking Amount Per Person
                        <HelpTooltip text="Amount required to reserve a spot." /> </span>
                      <input  {...register("partialBookingAmount")} type="number" />

                    </div>
                  }
                  <div className="input-box-column ">
                    <span className="details">Batch Size <span style={{ 'color': 'red' }}>*</span>
                      <HelpTooltip text="Enter the max number of participants." /></span>
                    <input defaultValue={0} {...register("eventBatchCount", { required: { value: true, message: "This field is required" }, })} min="1" type="number" required />

                  </div>
                  {/* Double Sharing */}
                  <div className="input-box-column">
                    <span className="details">
                      Double Sharing <span style={{ color: 'red' }}>*</span>
                      <HelpTooltip text="Cost per person for double sharing." />
                    </span>
                    <input
                      type="number"
                      value={doubleSharing}
                      onChange={(e) => setDoubleSharing(e.target.value)}
                      required
                    />

                  </div>
                  <div className="input-box-column">
                    <span className="details">Double Sharing Note
                      <HelpTooltip text="Additional notes for double sharing." /></span>
                    <textarea
                      value={doubleSharingNote}
                      onChange={(e) => setDoubleSharingNote(e.target.value)}
                    />

                  </div>

                  {/* Tripal Sharing */}
                  <div className="input-box-column">
                    <span className="details">
                      Tripal Sharing <span style={{ color: 'red' }}>*</span>
                      <HelpTooltip text="Cost per person for triple sharing." />
                    </span>
                    <input
                      type="number"
                      value={tripalSharing}
                      onChange={(e) => setTripalSharing(e.target.value)}
                      required
                    />

                  </div>
                  <div className="input-box-column">
                    <span className="details">Tripal Sharing Note
                      <HelpTooltip text="Additional notes for triple sharing." /></span>
                    <textarea
                      value={tripalSharingNote}
                      onChange={(e) => setTripalSharingNote(e.target.value)}
                    />

                  </div>

                  {/* Third AC Upgrade */}
                  <div className="input-box-column">
                    <span className="details">
                      Third AC Upgrade <span style={{ color: 'red' }}>*</span>
                      <HelpTooltip text="Cost for upgrading to 3AC.<br /> (You can use same if any other additionl charges need to add )" />
                    </span>
                    <input
                      type="number"
                      value={thirdAcUpgrate}
                      onChange={(e) => setThirdAcUpgrate(e.target.value)}
                      required
                    />

                  </div>
                  <div className="input-box-column">
                    <span className="details">Third AC Upgrade Note  
                      <HelpTooltip text="Notes related to 3AC.<br /> Upgrade option is required if Third AC Upgrade is filled" /></span>
                    <textarea
                      value={thirdAcUpgrateNote}
                      onChange={(e) => setThirdAcUpgrateNote(e.target.value)}
                    />

                  </div>

                  {/* General Note */}
                  <div className="input-box-column">
                    <span className="details">General Note
                      <HelpTooltip text="Any general info you want to display." /></span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />

                  </div>

                  <div className="input-box-column ">
                    <span className="details">Active
                      <HelpTooltip text="Mark this to keep the event visible." /></span>
                    <input  {...register("Active")} type="checkbox" id="active" name="Active" value={true} />

                  </div>
                  <div className="input-box-column ">
                    <span className="details">Special Offer Event
                      <HelpTooltip text="Highlight this as a special offer event." /></span>
                    <input  {...register("specialOfferEvent")} type="checkbox" id="active" name="Active" value={true} />

                  </div>
                  <div className="input-box-column ">
                    <span className="details"></span>
                  </div>
                  <div className="input-box-column ">
                    <span className="details">Upload Cover Photo <span style={{ 'color': 'red' }}>*</span>
                    <HelpTooltip text="Upload a cover image (JPG/PNG)." /></span>

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
                          src={file.preview}
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

export default ScheduleEvents