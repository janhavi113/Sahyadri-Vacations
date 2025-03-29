import React, { useEffect, useState } from 'react'
import AdminNavbar from "../../AdminNavbar";
import "../Schedule-Events/ScheduleEvents"
import "../CreateEvent/CreateEvents.css"
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
function Categories() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSuccess, setSuccess] = useState(false);
  const [eventList, setEventList] = useState();
  const [eventOptionsList, setEventOptionsList] = useState([]);
  const [activeError, setActiveError] = useState({ disply: false });
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
  const [search, setSearch] = useState();
  const [startingPrice, setStartingPrice] = useState();
  const [title, setTitle] = useState('');
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
    console.log('res',res);
    
    if (res.isSuccess == true) {
      setSuccess(res.isSuccess);

      const eventOptions = res.scheduleBatches.map(event => (
        {
        value: event.eventId,
        label: event.eventname + " " + event.duration ,
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
    formData.append("active", active);
    formData.append('title', title);
    formData.append('events', eventList);
    formData.append('startingPrice', startingPrice);
    const url = `${apiUrl}create-categories`;
    let r = await fetch(url, {
      method: "POST",
      body: formData,
    })
    let res = await r.json()
    if (res.isSuccess == true) {
    console.log('res--',res);
    
    }
  }


  const handleEventChange = (selectedOption) => {
    var eventIdSet = [];
    selectedOption.forEach((event) => {

      eventIdSet.push(event.value);
    });
    console.log('eventIdSet', eventIdSet);
    setEventList(eventIdSet);
    // if (selectedOption) {
    //   handleSelectEvent(selectedOption.value);
    // }
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



                  {/* Third AC Upgrade */}
                  <div className="input-box">
                    <span className="details">
                      Title <span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <span className="details">
                      Event Name<span style={{ color: 'red' }}>*</span>
                    </span>
                    <Select
                      options={eventOptionsList}
                      onChange={handleEventChange}
                      placeholder="---Select---"
                      isSearchable
                      isMulti
                    />
                  </div>
                  <div className="input-box-column ">
                    <span className="details">Active</span>
                    <input  {...register("Active")} type="checkbox" id="active" name="Active" value={true} />
                  </div>
                  <div className="input-box-column ">
                    <span className="details"></span>
                  </div>
                  <div className="input-box">
                    <span className="details">
                    Starting Price <span style={{ color: 'red' }}>*</span>
                    </span>
                    <input
                      type="text"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      required
                    />
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
                  <input type="submit" value="Create Categories" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </AdminNavbar>
    </div>

  )
}

export default Categories