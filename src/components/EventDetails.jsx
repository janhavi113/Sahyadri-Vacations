import React, { useEffect, useState, useContext } from 'react'
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./admin-panel/CreateEvent/CreateEvents.css"
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import AdminNavbar from "./AdminNavbar";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import "./admin-panel/CreateEvent/CreateEvents.css"
import "./Modal.css";
import Editor from "./Editor";
function EventDetails() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [modal, setModal] = useState(false);
  const [file, setFiles] = useState(null);
  const [itinerary, setItinerary] = useState();
  const [highlights, setHighlights] = useState();
  const [pickupPoints, setPickupPoints] = useState();
  const [thingsToCarry, setThingsToCarry] = useState();
  const [costIncludes, setCostIncludes] = useState();
  const [show, setShow] = useState(false);
  const [locationValue, setLocationValue] = useState();
  const [typeValue, setTypeValue] = useState();
  const [elevationValue, setElevationValue] = useState();
  const [difficultyValue, setDifficultyValue] = useState();
  const [enduranceValue, setEnduranceValue] = useState();
  const [durationValue, setDurationValue] = useState();
  const [totalDistanceValue, setTotalDistanceValue] = useState();
  const [ageGroupValue, setAgeGroupValue] = useState();
  const [trekDistanceValue,  setTrekDistanceValue] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleModal = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
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
    formState: { errors, isSubmitting },
  } = useForm();
  const [isEditable, setEditable] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [event, setEvent] = useState();
  const [currentImages, setcurrentImages] = useState();
  const navigate = useNavigate();
  const params = useParams()
  let eventId = params.eventId;
  useEffect(() => {
    getCurrentrecord();
  }, []);

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

  const removeCurrentFile = name => {
    setcurrentImages(currentImages => currentImages.filter(file => file !== name))
  }
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const getCurrentrecord = async () => {
    fetch(`${apiUrl}create-event/event-details/:${eventId}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    }).then(resp => resp.json())
      .then(data => {
        console.log('data--', data);
        setSuccess(data.isSuccess);
        if (data.isSuccess == true) {
          setEvent(data.events[0]);
          setItinerary(data.events[0]?.itinerary);
          setHighlights(data.events[0]?.highlights);
          setPickupPoints(data.events[0]?.pickupPoints);
          setThingsToCarry(data.events[0]?.thingsToCarry);
          setCostIncludes(data.events[0]?.costIncludes);
          setcurrentImages(data.events[0]?.images);
          setLocationValue(data.events[0]?.location);
          setTypeValue(data.events[0]?.type);
          setElevationValue(data.events[0]?.elevation);
          setDifficultyValue(data.events[0]?.difficulty);
          setEnduranceValue(data.events[0]?.endurance);
          setDurationValue(data.events[0]?.duration);
          setTotalDistanceValue(data.events[0]?.totalDistance);
          setAgeGroupValue(data.events[0]?.ageGroup);
          setTrekDistanceValue(data.events[0]?.trekDistance);
          console.log('event-%8', event);
        }
      });
  }

  const onDelete = async (data) => {
    let r = await fetch(`${apiUrl}create-event/event-details/:${eventId}`,
      {
        method: "POST", headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify(data)
      })
    let res = await r.json()
    console.log('res --', JSON.stringify(res));
    if (res.isSuccess == true) {
      navigate('/all-events');
    }
    handleClose();
  }

  function getSubstring(string, char1, char2) {
    var array = string.slice(
      string.indexOf(char1) + 1,
      string.lastIndexOf(char2),
    ).split("$$");

    var filtered = array.filter(function (element) {
      return element != '';
    });
    console.log("filtered", filtered);
    return filtered;
  }

  const displayList = (data) => {
    var splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
    splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
    splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
    splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
    return splitedList;
  }

 
  const handleUpload = async (data) => {
    if (currentImages.length === 0 && uploadedFiles!= 'undefined' && uploadedFiles.length === 0) {
      setError("dropzone", {
        type: "manual",
        message: "Please upload at least one file.",
      });
      return;
    }
    // fake request to upload file
    const url = `${apiUrl}create-event/event-details/:${eventId}`;
    const formData = new FormData();
    if (uploadedFiles) {
      for (let index = 0; index < uploadedFiles?.length; index++) {
        formData.append("files", uploadedFiles[index]);
      }
    }
    if (currentImages) {
      for (let index = 0; index < currentImages?.length; index++) {
        formData.append("currentImages", currentImages[index])
      }
    }
    formData.append("costIncludes", costIncludes);
    formData.append("eventDetails", data.eventDetails);
    formData.append("eventName", data.eventName);
    formData.append("eventType", data.eventType);
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
    formData.append("ageGroup", data.ageGroup);
    formData.append("trekDistance", data.trekDistance);
    console.log('formData ===', formData);
    //Assuming you only accept one file     
    // console.log("file logging drop/selected file", JSON.stringify(formData));
    let r = await fetch(url, {
      method: "PUT",
      body: formData,
    })
    let res = await r.json()
    console.log('res ===', res.events[0]);
    if (res.isSuccess == true) {
      setEditable(false);
      setEvent(res.events[0]);
    }

  };

  return (
    <div>
      <AdminNavbar />
      {!isEditable && isSuccess &&
        <div className="create-form container ">
          <div className="title-header">Event Details</div>
          <div className="button-container">
            <div className="button">
              <input type="submit" value="Edit" onClick={() => {
                console.log('click');
                setEditable(true)
              }} />
              <input type="submit" value="Delete" onClick={handleShow} />

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body> <center><div>Do you want to delete event ?</div></center></Modal.Body>
                <Modal.Footer>
                  <div className="button-edit-container">
                    <div className="button">
                      <input type="submit" value=" Delete " onClick={handleSubmit(onDelete)} />
                      <input type="submit" value=" Cancel " onClick={handleClose} />
                    </div>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>
            {
              <div className="content">
                <div className="user-details">
                  <div className="input-box ">
                    <span className="details">Event Name</span>
                    <div>{event.name}</div>
                  </div>
                  <div className="input-box ">
                    <span className="details">Event Details</span>
                    <div>{event.eventDetails}</div>
                  </div>
                  <div className="input-select-box ">
                    <span className="details">Event Type</span>
                    <div>{event.eventType}</div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Location</span>
                    <div>{event.location}</div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Type</span>
                    <div>{event.type}</div>
                  </div>

                  <div className="input-select-box">
                    <span className="details">Elevation</span>
                    <div>{event.elevation}</div>
                  </div>

                  <div className="input-select-box">
                    <span className="details">Difficulty</span>
                    <div>{event.difficulty}</div>
                  </div>

                  <div className="input-select-box">
                    <span className="details">Endurance</span>
                    <div>{event.endurance}</div>
                  </div>

                  <div className="input-select-box">
                    <span className="details">Duration</span>
                    <div>{event.duration}</div>
                  </div>

                  <div className="input-select-box">
                    <span className="details">Total Distance</span>
                    <div>{event.totalDistance}</div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Age Group</span>
                    <div>{event.ageGroup}</div>
                  </div>

                  <div className="input-select-box">
                    <span className="details">Trek Distance</span>
                    <div>{event.trekDistance}</div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Itinerary</span>
                    <div>
                      <div dangerouslySetInnerHTML={{ __html: displayList(event.itinerary) }} />

                      <div className='note'><div className='thicker'>Note : </div>
                        Above mentioned timings are tentative, It may vary according to situation.
                      </div>
                    </div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Highlights</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.highlights) }} />
                  </div>
                  <div className="input-select-box">
                    <span className="details">Cost Includes</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.costIncludes) }} />
                  </div>
                  <div className="input-select-box">
                    <span className="details">Things To Carry</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.thingsToCarry) }} />
                  </div>
                  <div className="input-select-box">
                    <span className="details">Pickup Points</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.pickupPoints) }} />
                  </div>
                </div>
                <div >
                  <div className='image-font'>
                    Images
                  </div>
                  <ul >
                    {currentImages.map(file => (
                      <li className="image-display" key={file} >
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
                  </ul>
                </div>
              </div>
            }
          </div>
        </div>
      }
      {
        isEditable && isSuccess &&
        <div style={{'margin-top':'130px'}}>
        <form action="" onSubmit={handleSubmit(handleUpload)}>
          <div className="container">
            <div className="title-header">Event Details</div>
            <div className="content">
              {isSubmitting && <div>Loading...</div>}
              <div className="user-details">
                <div className="input-box ">
                  <span className="details">Event Name</span>
                  <input value={event.name} {...register("eventName", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>

                <div className="input-box ">
                  <span className="details">Event Details</span>
                  <textarea defaultValue={event.eventDetails}   {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>

                <div className="input-box">
                  <span className="details">Itinerary</span>
                  <Editor value={itinerary} sendDataToParent={setItinerary} />
                </div>
                <div className="input-select-box">
                  <span className="details">Event Type</span>
                  <select  {...register("eventType", { required: { value: true, message: "This field is required" }, })} >
                    <option value={"TrekEvent"} >Trekking Event</option>
                    <option value={"CampingEvent"}>Camping Event</option>
                    <option value={"BackPackingTrip"} >BackPacking Trip</option>
                  </select>
                </div>
                <div className="input-select-box">
                  <span className="details">Location</span>
                  <input value={locationValue} {...register("location", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Type</span>
                  <input value={typeValue} {...register("type")} type="text" required />
                </div>

                <div className="input-select-box">
                  <span className="details">Elevation</span>
                  <input value={elevationValue} {...register("elevation",)} type="text" required />
                </div>

                <div className="input-select-box">
                  <span className="details">Difficulty</span>
                  <input value={difficultyValue} {...register("difficulty",)} type="text" required />
                </div>

                <div className="input-select-box">
                  <span className="details">Endurance</span>
                  <input value={enduranceValue} {...register("endurance",)} type="text" required />
                </div>

                <div className="input-select-box">
                  <span className="details">Duration</span>
                  <input value={durationValue} {...register("duration",)} type="text" required />
                </div>

                <div className="input-select-box">
                  <span className="details">Total Distance</span>
                  <input value={totalDistanceValue} {...register("totalDistance",)} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Age Group</span>
                  <input value={ageGroupValue} {...register("ageGroup",)} type="text" required />
                </div>

                <div className="input-select-box">
                  <span className="details">Trek Distance</span>
                  <input value={trekDistanceValue} {...register("trekDistance",)} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Highlights</span>
                  <Editor value={highlights} sendDataToParent={setHighlights} />
                </div>
                <div className="input-select-box">
                  <span className="details">Cost Includes</span>
                  <Editor value={costIncludes} sendDataToParent={setCostIncludes} />
                </div>
                <div className="input-select-box">
                  <span className="details">Things To Carry</span>
                  <Editor value={thingsToCarry} sendDataToParent={setThingsToCarry} />
                </div>
                <div className="input-select-box">
                  <span className="details">Pickup Points</span>
                  <Editor value={pickupPoints} sendDataToParent={setPickupPoints} />
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
              <div >
                <div className='image-font'>
                  Images
                </div>
                <ul >
                  {currentImages.map(file => (
                    <li className="image-display" key={file} >
                      <div
                        className='close-button'
                        onClick={() => removeCurrentFile(file)}                        >
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
                </ul>
              </div>
            </div>
            <div className="button-edit-container">
              <div className="button">
                <input disabled={isSubmitting} type="submit" value="Update" />
                <input disabled={isSubmitting} type="submit" value="Cancel" onClick={() => setEditable(false)} />
              </div>
            </div>
          </div>
        </form>
        </div>
      }
    </div >
  )
}

export default EventDetails
