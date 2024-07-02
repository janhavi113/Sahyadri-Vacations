import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "./AdminNavbar";
import Editor from "./Editor";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import "./CreateEvents.css"
import Dropzone from "react-dropzone";
function CreateEvents() {
  const {
    register,
    handleSubmit,
    setError,
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
  const onSubmit = async (data) => {
    console.log('data--'+data);
    const formData = new FormData();
    if (file) {
      for (let index = 0; index < file.length; index++) {
        formData.append("file", file[index]);
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
    let r = await fetch("https://sahyadri-vacations.vercel.app/create-event", {
      method: "POST",
      body: formData,
    })
    let res = await r.json()
    console.log('res', JSON.stringify(res));
    if (res.isSuccess == true) {
      navigate(`event-details/${res.eventId}`);
    }

  }

  const removeFile = name => {
    setcurrentImages(currentImages => currentImages.filter(file => file !== name))
  }
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

  return (
    <div>
      <AdminNavbar />
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <div className="title-header">Event Details</div>
          <div className="content">
            {isSubmitting && <div>Loading...</div>}
            <div className="user-details">
              <div className="input-box ">
                <span className="details">Event Name</span>
                <input {...register("eventName", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-box ">
                <span className="details">Event Type</span>
                <select  {...register("eventType", { required: { value: true, message: "This field is required" }, })} >
                  <option value={"TrekEvent"} >Trekking Event</option>
                  <option value={"CampingEvent"}>Camping Event</option>
                  <option value={"BackPackingTrip"} >BackPacking Trip</option>
                </select>
              </div>
              <div className="input-select-box ">
                <span className="details">Event Details</span>
                <textarea {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Itinerary</span>
                <Editor sendDataToParent={setItinerary} />
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
            <div className="input-box">
              <span className="details">Upload Images</span>
              <div className="dropzon">
                <Dropzone onDrop={files => {
                  setFiles(files);
                  addUploadedInages();
                }}>
                  {({ getRootProps, getInputProps }) => (
                    <div className="container">
                      <div
                        {...getRootProps({
                          className: 'dropzone',
                          onDrop: event => event.stopPropagation()
                        })}
                      >
                        <input {...getInputProps()} />
                        <div>Drag 'n' drop some files here, or click to select files</div>
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>

            </div>
            <div >
              {currentImages &&
                <div> <div className='image-font'>
                  Images
                </div>
                  <ul >
                    {currentImages.map(file => (
                      <li className="image-display" key={file} >
                        <div
                          className='close-button'
                          onClick={() => removeFile(file)}                        >
                          <span className="close">&times;</span>
                        </div>
                        <img
                          src={file}
                          width="200vh"
                          height="250vh"
                          onLoad={() => {
                            URL.revokeObjectURL(file)
                          }}
                        />
                      </li>
                    ))}
                  </ul> </div>}
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
