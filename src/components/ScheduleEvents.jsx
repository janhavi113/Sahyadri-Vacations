import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "./AdminNavbar";
import "./ScheduleEvents.css"
import "./CreateEvents.css"
// import DatePicker from "./EventDatePicker";
//import card from "./card"
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form"
import Dropzone from "react-dropzone";
import { redirect, useNavigate } from "react-router-dom";
function ScheduleEvents() {
  const apiUrl = import.meta.env.VITE_API_URL;
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

  const onSubmit = async (data) => {
    console.log('data---', data);

    const formData = new FormData();
    let active = data ? data.Active : false;
    
    if (active && ((data.everyWeekend == true && data.eventEndDate != '' && data.notScheduleYet == true) || (data.everyWeekend == true && data.eventEndDate != '') || (data.eventEndDate != '' && data.notScheduleYet == true) || (data.everyWeekend == true && data.notScheduleYet == true))) {
      setActiveError({ disply: true, message: "You can only selet one from Every Weekend / Not Schedule Yet / Event EndDate " });
    } else {
      setActiveError({ disply: false });
        if (file) {
          formData.append("file", file[0]);
        }

       formData.append("active", active);
       formData.append("eventId", data.Event);
               const search = events.filter(function (item) {
          console.log('item', item.eventId == data.Event)
          return item.eventId == data.Event;
        });
        console.log('search--', search);
        formData.append('eventname', search[0].name);
        formData.append('eventType', search[0].eventType);
        formData.append('eventCostPerPerson',data.eventCostPerPerson); 
        formData.append('eventEndDate',data.eventEndDate  );
        formData.append('eventStartDate',data.eventStartDate  );
        formData.append('eventBatchCount',data.eventBatchCount );
        formData.append('everyWeekend',data.everyWeekend);
        formData.append('notScheduleYet',data.notScheduleYet);

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

  // const [dataFromChild, setDataFromChild] = useState([]);
  // const [childComponents, setChildComponents] = useState([]);

  // const addChildComponent = () => {
  //   setChildComponents([...childComponents, <DatePicker datapass={dataFromChild[{ count }]} count={count} key={childComponents.length} sendDataToParent={handleDataFromChild} />]);
  // };

  const removeFile = name => {
    setcurrentImages(currentImages => currentImages.filter(file => file !== name))
  }

  // function handleDataFromChild(data) {
  //   var childData;
  //   if (dataFromChild) {
  //     childData = dataFromChild;
  //   } else {
  //     childData = [];
  //   }
  //   console.log('data.Edit', data.Edit);
  //   if (data.Edit) {
  //     var tempDate = JSON.stringify(data);
  //     tempdata.replaceAll
  //     childData.push(data);
  //     childData.sort((a, b) => new Date(a.Data.eventStartDate) - new Date(b.Data.eventStartDate));
  //     console.log('childData', JSON.stringify(childData));
  //     setDataFromChild(childData);
  //     setActiveError({ disply: false });

  //   } else {
  //     console.log('childData ==', childData);
  //     const elementIndex = childData.findIndex(item => item.key === data.key);
  //     deleteItem(elementIndex);
  //   }
  //   console.log('dataFromChild -', dataFromChild);
  // }

  // const deleteItem = (index) => {
  //   const newArray = [
  //     ...dataFromChild.slice(0, index), // Elements before the one to delete
  //     ...dataFromChild.slice(index + 1) // Elements after the one to delete
  //   ];

  //   setDataFromChild(newArray); // Triggers a re-render with the new array
  // };

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
                  <span className="details">Event Name</span>
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
                  <div className="input-box ">
                    <span className="details">Batch Size *</span>
                    <input  {...register("eventBatchCount", { required: { value: true, message: "This field is required" }, })} min="1" type="number" required />
                  </div>
                  <div className="input-box ">
                    <span className="details">Cost Per Person *</span>
                    <input  {...register("eventCostPerPerson", { required: { value: true, message: "This field is required" }, })} type="text" required />
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