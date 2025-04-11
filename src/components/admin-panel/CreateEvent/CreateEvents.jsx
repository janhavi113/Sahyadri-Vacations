import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "../../AdminNavbar";
import Editor from "../../Editor";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./CreateEvents.css"
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
function CreateEvents() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const [currentImages, setcurrentImages] = useState();
  const [file, setFiles] = useState(null);
  const [itinerary, setItinerary] = useState();
  const [highlights, setHighlights] = useState();
  const [pickupPoints, setPickupPoints] = useState();
  const [pickupPointsfromMumbai, setPickupPointsfromMumbai] = useState();
  const [thingsToCarry, setThingsToCarry] = useState();
  const [costIncludes, setCostIncludes] = useState();
  const [costExcludes, setCostExcludes] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
  const [FAQ ,setFAQ] = useState();
  const onSubmit = async (data) => {
    console.log('data--', data);
    if (uploadedFiles.length === 0) {
      setError("dropzone", {
        type: "manual",
        message: "Please upload at least one file.",
      });
      return;
    }
    const formData = new FormData();
    if (uploadedFiles) {
      for (let index = 0; index < uploadedFiles.length; index++) {
        formData.append("files", uploadedFiles[index]);
      }
    }
    console.log('itinerary--',itinerary);
    formData.append("costIncludes", costIncludes);
    formData.append("costExcludes", costExcludes);
    formData.append("FAQ", FAQ);
    formData.append("eventDetails", data.eventDetails.toString());
    formData.append("eventName", data.eventName.toString());
    formData.append("eventType", data.eventType.toString());
    formData.append("highlights", highlights);
    formData.append("itinerary", itinerary);
    formData.append("pickupPoints", pickupPoints);
    formData.append("pickupPointsfromMumbai", pickupPointsfromMumbai);
    formData.append("b2bLocaion", data.b2bLocaion);
    formData.append("thingsToCarry", thingsToCarry);
    formData.append("location", data.location);
    formData.append("type", data.type);
    formData.append("elevation", data.elevation);
    formData.append("difficulty", data.difficulty);
    formData.append("endurance", data.endurance);
    formData.append("duration", data.duration);
    formData.append("totalDistance", data.totalDistance);

    console.log('formData--', formData);

    let r = await fetch(`${apiUrl}create-event`, {
      method: "POST",
      body: formData,
    })
    let res = await r.json()
    console.log('res', JSON.stringify(res));
    if (res.isSuccess == true) {
      navigate(`event-details/${res.eventId}`);
    }

  }


  // Check token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]); // Add navigate as a dependency


  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file), // Create a preview URL for the image
      })
    );
    setUploadedFiles((prev) => [...prev, ...newFiles]); // Add new files to the uploaded files state
    clearErrors("dropzone");
  };

  const removeFile = (file) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== file)); // Remove the file from the state
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div>
      <AdminNavbar>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="create-form container ">
          <div className="title-header">Event Details</div>
          <div className="content">
            {isSubmitting && <div>Loading...</div>}
            <div className="user-details addscroller">
              <div className="input-box ">
                <span className="details">Event Name
                <HelpTooltip text="Enter the official name of the event" />
              </span>
                <input {...register("eventName", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-box ">
                <span className="details">Overview
                <HelpTooltip text="Provide a brief summary of the event" />
              </span>
                <textarea {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-box ">
                <span className="details">Itinerary
                <HelpTooltip text="Include a day-wise plan for the event" />
              </span>
                <Editor sendDataToParent={setItinerary} />
              </div>
              <div className="input-select-box ">
                <span className="details">Event Type
                <HelpTooltip text="Select the type of event" />
              </span>
                <select  {...register("eventType", { required: { value: true, message: "This field is required" }, })} >
                  <option value={"TrekEvent"} >Trekking Event</option>
                  <option value={"CampingEvent"}>Camping Event</option>
                  <option value={"BackPackingTrip"} >BackPacking Trip</option>                  
                  <option value={"AdventureActivity"} >Adventure Activity</option>
                </select>
              </div>
              <div className="input-select-box">
                <span className="details">Location
                <HelpTooltip text="Enter the location where the event will take place" />
              </span>
                <input {...register("location", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Type
                <HelpTooltip text="Type of activity or event style" />
              </span>
                <input {...register("type",)} type="text"  />
              </div>

              <div className="input-select-box">
                <span className="details">Elevation
                <HelpTooltip text="Enter the highest altitude in meters" />
              </span>
                <input {...register("elevation",)} type="text"  />
              </div>

              <div className="input-select-box">
                <span className="details">Difficulty
                <HelpTooltip text="Describe how challenging the event is" />
              </span>
                <input {...register("difficulty",)} type="text" />
              </div>

              <div className="input-select-box">
                <span className="details">Endurance
                <HelpTooltip text="Mention the stamina level required" />
              </span>
                <input {...register("endurance",)} type="text" />
              </div>

              <div className="input-select-box">
                <span className="details">Duration
                <HelpTooltip text="Provide the duration of the event in days" />
              </span>
                <input {...register("duration",)} type="text" />
              </div>

              <div className="input-select-box">
                <span className="details">Total Distance
                <HelpTooltip text="Total travel distance in kilometers" />
              </span>
                <input {...register("totalDistance",)} type="text"  />
              </div>
              <div className="input-select-box">
                <span className="details">Age Group
                <HelpTooltip text="Specify suitable age group for the event" />
              </span>
                <input {...register("ageGroup",)} type="text" />
              </div>

              <div className="input-select-box">
                <span className="details">Trek Distance
                <HelpTooltip text="Distance to be trekked during event" />
              </span>
                <input {...register("trekDistance",)} type="text" />
              </div>
              
              <div className="input-select-box">
                <span className="details">B2B Location
                <HelpTooltip text="Base toBase Pickup Location" />
              </span>
                <input {...register("b2bLocation",)} type="text" />
              </div>
              <div className="input-select-box">
                <span className="details">Pickup Points from Pune
                <HelpTooltip text="Enter all pickup locations from Pune" />
              </span>
                <Editor sendDataToParent={setPickupPoints} />
              </div>
              <div className="input-select-box">
                <span className="details">Pickup Points from Mumbai
                <HelpTooltip text="Enter all pickup locations from Mumbai" />
              </span>
                <Editor sendDataToParent={setPickupPointsfromMumbai} />
              </div>
              <div className="input-select-box">
                <span className="details">Highlights
                <HelpTooltip text="Main attractions or features of the event" />
              </span>
                <Editor sendDataToParent={setHighlights} />
              </div>
              
              <div className="input-select-box">
                <span className="details">Cost Includes
                <HelpTooltip text="Everything included in the event cost" />
              </span>
                <Editor sendDataToParent={setCostIncludes} />
              </div>
              <div className="input-select-box">
                <span className="details">Cost Excludes
                <HelpTooltip text="Things not included in the cost" />
              </span>
                <Editor sendDataToParent={setCostExcludes} />
              </div>
              <div className="input-select-box">
                <span className="details">Things To Carry
                <HelpTooltip text="Checklist of things participants should bring" />
              </span>
                <Editor sendDataToParent={setThingsToCarry} />
              </div>
              <div className="input-select-box">
                <span className="details">FAQ 
                   <HelpTooltip text="Frequently Asked Questions" /></span>
                <Editor sendDataToParent={setFAQ} />
              </div>
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
          <div className="button">
            <input disabled={isSubmitting} type="submit" value="Submit" />
          </div>
        </div>
      </form>
      </AdminNavbar>
    </div>
  )
}

export default CreateEvents
