import React, { useEffect, useState, useContext } from 'react'
import Dropzone from "react-dropzone";
import AdminNavbar from "./AdminNavbar";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import "./CreateEvents.css"
import "./Modal.css";
function EventDetails() {
  const [modal, setModal] = useState();
  const [file, setFiles] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
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

  const removeFile = name => {
    setcurrentImages(currentImages => currentImages.filter(file => file !== name))
  }


  const getCurrentrecord = async () => {
    fetch(`http://localhost:3000/create-event/event-details/:${eventId}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    }).then(resp => resp.json())
      .then(data => {
        console.log('data--', data);
        setSuccess(data.isSuccess);
        if (data.isSuccess == true) {
          setEvent(data.events[0]);
          setcurrentImages(data.events[0]?.images);
          console.log('event-%8', event);
        }
      });
  }

  const onDelete = async (data) => {
    let r = await fetch(`http://localhost:3000/create-event/event-details/:${eventId}`, {
      method: "POST", headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(data)
    })
    let res = await r.json()
    console.log('res --', JSON.stringify(res));
    if (res.isSuccess == true) {
      navigate('/all-events');
    }

  }

  function getSubstring(string, char1, char2) {
    var array = string.slice(
      string.indexOf(char1) + 1,
      string.lastIndexOf(char2),
    ).split("$$");

    var filtered = array.filter(function (element) {
      return element != '';
    });
    console.log("filtered",filtered);
    return filtered;
  }

  const displayList = (data)=>{
    var splitedList = getSubstring(data, '[', ']');
    const listItems = splitedList.map(value => <li key={value}>{value}</li>);     
    return <ul className="details-list">{listItems}</ul>;
  }

  const addUploadedInages = () => {
    console.log('file', file);
    var allFiles = currentImages;
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
  const handleUpload = async (data) => {
    console.log('data ===', data);
    // fake request to upload file
    const url = `http://localhost:3000/create-event/event-details/:${eventId}`;
    const formData = new FormData();
    if (file) {
      for (let index = 0; index < file.length; index++) {
        formData.append("file", file[index]);
      }
    }
    if (currentImages) {
      for (let index = 0; index < currentImages.length; index++) {
        formData.append("currentImages", currentImages[index])
      }
    }
    formData.append("costIncludes", data.costIncludes);
    formData.append("eventDetails", data.eventDetails);
    formData.append("eventName", data.eventName);
    formData.append("highlights", data.highlights);
    formData.append("itinerary", data.itinerary);
    formData.append("pickupPoints", data.pickupPoints);
    formData.append("thingsToCarry", data.thingsToCarry);

    //Assuming you only accept one file     
    // console.log("file logging drop/selected file", JSON.stringify(formData));
    let r = await fetch(url, {
      method: "PUT",
      body: formData,
    })
    let res = await r.json()
    console.log('res ===', JSON.stringify(res));
    if (res.isSuccess == true) {
      setEditable(false);
    }
  };

  return (
    <div>
      <AdminNavbar />
      {!isEditable && isSuccess &&
          <div className="container">
            <div className="title-header">Event Details</div>
            <div className="button-container">
              <div className="button">
                <input type="submit" value="Edit" onClick={() => {
                  console.log('click');
                  setEditable(true)
                }} />
                <input type="submit" value="Delete" onClick={toggleModal} /> {modal && (
                  <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                      <center><div>Do you want to delete event ?</div></center>
                      <button className="close-modal" onClick={toggleModal}>
                        &#x2715;
                      </button>
                      <div className="button-edit-container">
                        <div className="button">
                          <input type="submit" value="Yes" onClick={handleSubmit(onDelete)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            
            {
              <div className="content">
                <div className="user-details">
                  <div className="input-box ">
                    <span className="details">Event Name</span>
                    <div>{event.name}</div>
                  </div>
                  <div className="input-box ">
                    <span className="details"></span>
                  </div>
                  <div className="input-select-box ">
                    <span className="details">Event Details</span>
                    <div>{event.eventDetails}</div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Itinerary</span>
                    <div>{
                    displayList(event.itinerary)
                    }
                   <div className='note'><div className='thicker'>Note : </div>
                    Above mentioned timings are tentative, It may vary according to situation.
                   </div>
                    </div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Highlights</span>
                    <div>{
                    displayList(event.highlights)}
                    
                    </div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Cost Includes</span>
                    <div>{
                    displayList(event.costIncludes)}
                    </div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Things To Carry</span>
                    <div>{
                    displayList(event.thingsToCarry)}
                    </div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Pickup Points</span>
                    <div>{
                    displayList(event.thingsToCarry)}
                    </div>
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
                <div className="input-select-box ">
                  <span className="details">Event Details</span>
                  <textarea defaultValue={event.eventDetails}   {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Itinerary</span>
                  <textarea defaultValue={event.itinerary}  {...register("itinerary", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Highlights</span>
                  <textarea defaultValue={event.highlights} type="text" {...register("highlights", { required: { value: true, message: "This field is required" }, })} required />
                </div>
                <div className="input-select-box">
                  <span className="details">Cost Includes</span>
                  <textarea defaultValue={event.costIncludes}  {...register("costIncludes")} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Things To Carry</span>
                  <textarea defaultValue={event.thingsToCarry}  {...register("thingsToCarry")} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Pickup Points</span>
                  <textarea defaultValue={event.pickupPoints}  {...register("pickupPoints")} type="text" required />
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
      }
    </div >
  )
}

export default EventDetails
