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
import { redirect, useNavigate } from "react-router-dom";
function ScheduleEvents() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [activeError, setActiveError] = useState({ disply: false });
  const [count, setCount] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files

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
  const [currentImages, setcurrentImages] = useState();
  const addUploadedInages = () => {
    console.log('file', file);
    var allFiles = [];
    if (file) {
      for (let index = 0; index < file.length; index++) {
        const url = URL.createObjectURL(file[index])
        console.log(url)
        allFiles.push(url);
      }
      console.log('allFiles', allFiles);
    }
    setcurrentImages(allFiles);
  }
  const getCurrentrecord = async () => {

    // alert("ok"); 
    let r = await fetch(`${apiUrl}schedule-event`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    console.log('res ===', JSON.stringify(res.events[0]));
    if (res.isSuccess == true) {
      setSuccess(res.isSuccess);
      setEvent(res.events);
    }
    console.log('events', events);
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
    console.log('data---', data);
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
      formData.append("eventId", data.Event);
      const search = events.filter(function (item) {
        console.log('item', item.eventId == data.Event)
        return item.eventId == data.Event;
      });
      console.log('search--', search);
      formData.append('eventname', search[0].name);
      formData.append('eventType', search[0].eventType);
      formData.append('eventCostPerPerson', data.eventCostPerPerson);
      formData.append('eventEndDate', new Date(data.eventEndDate));
      formData.append('eventStartDate', new Date(data.eventStartDate));
      formData.append('eventBatchCount', data.eventBatchCount);
      formData.append('everyWeekend', data.everyWeekend);
      formData.append('notScheduleYet', data.notScheduleYet);
      formData.append('b2bPrice', data.b2bPrice);
      formData.append('bookingTillDate', data.bookingTillDate);
      formData.append('specialOfferEvent', data.specialOfferEvent);
      formData.append('bookingTillTime', data.bookingTillTime.toString());
      const url = `${apiUrl}schedule-event`;
      let r = await fetch(url, {
        method: "POST",
        body: formData,
      })
      let res = await r.json()
      console.log('res ===', JSON.stringify(res));
      if (res.isSuccess == true) {
        navigate('/scheduled-events')
      }
    }
  }


  return (
    <div>
      <AdminNavbar />

      < form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="schedule-form container">
          <div className="title-header">Schedule Event</div>

          <div className="content">
            {isSuccess &&
              <div className="user-details">
                <div className="input-box ">
                  <span className="details">Event Name<span style={{ 'color': 'red' }}>*</span></span>
                  <select  {...register("Event")}>
                    {events.map(event => (
                      <option value={event.eventId} key={event.eventId}>{event.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-box-column ">
                  <span className="details">Start Date </span>
                  <input type="date" {...register("eventStartDate")} />
                </div>
                <div className="input-box-column ">
                  <span className="details">End Date </span>
                  <input type="date" {...register("eventEndDate")} />
                </div>
                <br />
                <div className="input-box-column ">
                  <span className="details">Booking Open Till Date </span>
                  <input type="date" {...register("bookingTillDate")} />
                </div>
                <div className="input-box-column ">
                  <span className="details">Booking Open Till Time</span>
                  <input type="time" {...register("bookingTillTime")} />
                </div>
                {errors.dateError && <p className='show-error' >{errors.dateError.message}</p>}
                <div className="input-box-column event-picker ">
                  <span className="details">Every Weekend </span>
                  <input type="checkbox"  {...register("everyWeekend")} />
                </div>

                <div className="input-box-column event-picker ">
                  <span className="details">On Public Demand </span>
                  <input type="checkbox"   {...register("notScheduleYet")} />
                </div>
                {activeError.disply && <div className='errorMessage'>{activeError.message}</div>}

                <div className="input-box-column ">
                  <span className="details">B2B Per Person </span>
                  <input  {...register("b2bPrice")} type="text" />
                </div>
                <div className="input-box-column">
                  <span className="details">Cost Per Person <span style={{ 'color': 'red' }}>*</span></span>
                  <input  {...register("eventCostPerPerson", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>
                <div className="input-box-column ">
                  <span className="details">Batch Size <span style={{ 'color': 'red' }}>*</span></span>
                  <input  {...register("eventBatchCount", { required: { value: true, message: "This field is required" }, })} min="1" type="number" required />
                </div>
                <div className="input-box-column ">
                  <span className="details">Active</span>
                  <input  {...register("Active")} type="checkbox" id="active" name="Active" value={true} />
                </div>
                <div className="input-box-column ">
                  <span className="details">Special Offer Event</span>
                  <input  {...register("specialOfferEvent")} type="checkbox" id="active" name="Active" value={true} />
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
                {
                  /* <input onClick={() => {
                    setCount(count => count + 1)
                    addChildComponent()
                  }
                  } type="submit" value="Add Batch + " /> */
                }
                <input type="submit" value="Schedule Batches" />
              </div>
            </div>
          </div>
        </div>
      </form>

    </div>

  )
}

export default ScheduleEvents