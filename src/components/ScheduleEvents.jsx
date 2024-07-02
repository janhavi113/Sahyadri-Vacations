import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "./AdminDashboard";
import "./ScheduleEvents.css"
import "./CreateEvents.css"
import DatePicker from "./EventDatePicker";
import card from "./card"
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form"
import Dropzone from "react-dropzone";
import { redirect,useNavigate } from "react-router-dom";
function ScheduleEvents() {
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [activeError, setActiveError] = useState({ disply: false });
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    getCurrentrecord();
  }, []);
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
    let r = await fetch(`https://sahyadri-vacations.vercel.app/schedule-event`, {
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

  const onSubmit = async (data) => {
    console.log('events', events);
  
    const formData = new FormData();
    let active = data ? data.Active : false;
    console.log('dataFromChild', active);
    if (active && dataFromChild && dataFromChild.length <= 0) {
      setActiveError({ disply: true, message: "At least one batch should be schedule" });
    } else {
      setActiveError({ disply: false });
      const batches = [];
      if (dataFromChild) {
        for (let index = 0; index < dataFromChild.length; index++) {
          batches.push(dataFromChild[index].Data);
          console.log('dataFromChild[index].Data', dataFromChild[index].Data)
          formData.append("batches", JSON.stringify(dataFromChild[index].Data));
          console.log('formData', formData)
        }
      }

      if (file) {
        formData.append("file", file[0]);
      }

      formData.append("active", active);
      formData.append("eventId", data.Event);
      const search = events.filter(function (item) {
        console.log('item',item.eventId == data.Event)
        return item.eventId == data.Event;
      });
      console.log('search--',search);
      formData.append('eventname', search[0].name);
      formData.append('eventType', search[0].eventType);
      const url = `https://sahyadri-vacations.vercel.app/schedule-event`;
      let r = await fetch(url, {
        method: "POST",
        body: formData,
      })
      let res = await r.json()
      console.log('res ===', JSON.stringify(res));
      if (res.isSuccess == true) {
        navigate("/scheduled-event"); 
      }
    }
  }
  const [dataFromChild, setDataFromChild] = useState([]);
  const [childComponents, setChildComponents] = useState([]);
  const addChildComponent = () => {
    setChildComponents([...childComponents, <DatePicker datapass={dataFromChild[{ count }]} count={count} key={childComponents.length} sendDataToParent={handleDataFromChild} />]);
  };
  const removeFile = name => {
    setcurrentImages(currentImages => currentImages.filter(file => file !== name))
  }
  function handleDataFromChild(data) {
    var childData;
    if (dataFromChild) {
      childData = dataFromChild;
    } else {
      childData = [];
    }
    console.log('data.Edit', data.Edit);
    if (data.Edit) {
      var tempDate = JSON.stringify(data);
      tempDate.replaceAll
      childData.push(data);
      childData.sort((a, b) => new Date(a.Data.eventStartDate) - new Date(b.Data.eventStartDate));
      console.log('childData', JSON.stringify(childData));
      setDataFromChild(childData);
      setActiveError({ disply: false });

    } else {
      console.log('childData ==', childData);
      const elementIndex = childData.findIndex(item => item.key === data.key);
      deleteItem(elementIndex);
    }
    console.log('dataFromChild -', dataFromChild);
  }

  const deleteItem = (index) => {
    const newArray = [
      ...dataFromChild.slice(0, index), // Elements before the one to delete
      ...dataFromChild.slice(index + 1) // Elements after the one to delete
    ];

    setDataFromChild(newArray); // Triggers a re-render with the new array
  };
  
  return (
    <div>
      <AdminNavbar />
     
      < form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="schedule-form container">          
          <div className="title-header">Schedule Event</div>
          <div className='button-group'>
          <div className="button-edit-container">
            <div className="button">
              <input onClick={() => {
                setCount(count => count + 1)
                addChildComponent()
              }
              } type="submit" value="Add Batch + " />
              <input type="submit" value="Schedule Batches" />
            </div>
          </div>
          </div>
          <div className="content">
            {isSuccess &&
              <div className="user-details">
                <div className="input-box ">
                  <span className="details">Event Name</span>
                  <select  {...register("Event")}>
                    {events.map(event => (
                      <option value={event.eventId} key={event.eventId}>{event.name}</option>
                    ))}
                  </select>
                </div>
                <div >
                  <span className="details">Active</span>
                  <input  {...register("Active")} type="checkbox" id="active" name="Active" value={true} />
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
                          </ul>
                        </div>
                      }
                    </div>
                  </div>
                </div>
            }
          </div>
          {activeError.disply && <div className='errorMessage'>{activeError.message}</div>}
          
        </div>
      </form>
      <div>
        {childComponents.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    </div>

  )
}

export default ScheduleEvents