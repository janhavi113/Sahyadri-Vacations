import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "../../AdminNavbar";
import Editor from "../../Editor";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
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
  const [thingsToCarry, setThingsToCarry] = useState();
  const [costIncludes, setCostIncludes] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files

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
    formData.append("costIncludes", costIncludes);
    formData.append("eventDetails", data.eventDetails.toString());
    formData.append("eventName", data.eventName.toString());
    formData.append("eventType", data.eventType.toString());
    formData.append("highlights", highlights);
    formData.append("itinerary", itinerary);
    formData.append("pickupPoints", pickupPoints);
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
      <AdminNavbar />
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="create-form container ">
          <div className="title-header">Event Details</div>
          <div className="content">
            {isSubmitting && <div>Loading...</div>}
            <div className="user-details">
              <div className="input-box ">
                <span className="details">Event Name</span>
                <input {...register("eventName", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-box ">
                <span className="details">Overview</span>
                <textarea {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-box ">
                <span className="details">Itinerary</span>
                <Editor sendDataToParent={setItinerary} />
              </div>
              <div className="input-select-box ">
                <span className="details">Event Type</span>
                <select  {...register("eventType", { required: { value: true, message: "This field is required" }, })} >
                  <option value={"TrekEvent"} >Trekking Event</option>
                  <option value={"CampingEvent"}>Camping Event</option>
                  <option value={"BackPackingTrip"} >BackPacking Trip</option>
                </select>
              </div>
              <div className="input-select-box">
                <span className="details">Location</span>
                <input {...register("location", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Type</span>
                <input {...register("type",)} type="text" required />
              </div>

              <div className="input-select-box">
                <span className="details">Elevation</span>
                <input {...register("elevation",)} type="text" required />
              </div>

              <div className="input-select-box">
                <span className="details">Difficulty</span>
                <input {...register("difficulty",)} type="text" required />
              </div>

              <div className="input-select-box">
                <span className="details">Endurance</span>
                <input {...register("endurance",)} type="text" required />
              </div>

              <div className="input-select-box">
                <span className="details">Duration</span>
                <input {...register("duration",)} type="text" required />
              </div>

              <div className="input-select-box">
                <span className="details">Total Distance</span>
                <input {...register("totalDistance",)} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Age Group</span>
                <input {...register("ageGroup",)} type="text" required />
              </div>

              <div className="input-select-box">
                <span className="details">Trek Distance</span>
                <input {...register("trekDistance",)} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Highlights</span>
                <Editor sendDataToParent={setHighlights} />
              </div>
              <div className="input-select-box">
                <span className="details">Cost Includes</span>
                <Editor sendDataToParent={setCostIncludes} />
              </div>
              <div className="input-select-box">
                <span className="details">Things To Carry</span>
                <Editor sendDataToParent={setThingsToCarry} />
              </div>
              <div className="input-select-box">
                <span className="details">Pickup Points</span>
                <Editor sendDataToParent={setPickupPoints} />
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

    </div>
  )
}

export default CreateEvents
