import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "./AdminNavbar";
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
  const onSubmit = async (data) => {
    const formData = new FormData();
    if (file) {
      for (let index = 0; index < file.length; index++) {
        formData.append("file", file[index]);
      }
    }
    formData.append("costIncludes", data.costIncludes);
    formData.append("eventDetails", data.eventDetails);
    formData.append("eventName", data.eventName);
    formData.append("highlights", data.highlights);
    formData.append("itinerary", data.itinerary);
    formData.append("pickupPoints", data.pickupPoints);
    formData.append("thingsToCarry", data.thingsToCarry);
    let r = await fetch("http://localhost:3000/create-event", {
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
    //setcurrentImages(currentImages => currentImages.filter(file => file !== name))
  }
  const addUploadedInages = () => {
    console.log('file', file);
    var allFiles =[];
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
                <span className="details"></span>
              </div>
              <div className="input-select-box ">
                <span className="details">Event Details</span>
                <textarea {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Itinerary</span>
                <textarea {...register("itinerary", { required: { value: true, message: "This field is required" }, })} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Highlights</span>
                <textarea type="text" {...register("highlights", { required: { value: true, message: "This field is required" }, })} required />
              </div>
              <div className="input-select-box">
                <span className="details">Cost Includes</span>
                <textarea {...register("costIncludes")} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Things To Carry</span>
                <textarea {...register("thingsToCarry")} type="text" required />
              </div>
              <div className="input-select-box">
                <span className="details">Pickup Points</span>
                <textarea  {...register("pickupPoints")} type="text" required />
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
