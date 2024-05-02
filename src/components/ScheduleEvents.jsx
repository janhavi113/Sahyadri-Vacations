import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "./AdminNavbar";
import Card from "./card";
import "./ScheduleEvents.css"
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "./EventDatePicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form"
function ScheduleEvents() {
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [activeError, setActiveError] = useState({disply: false});
  const [count, setCount] = useState(1);
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

  const getCurrentrecord = async () => {

    // alert("ok"); 
    let r = await fetch(`http://localhost:3000/schedule-event`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    console.log('res ===', JSON.stringify(res));
    if (res.isSuccess == true) {
      setSuccess(res.isSuccess);
      setEvent(res.events);
    }
    console.log('events', events);
  }
  const onSubmit = async (data) => {
    console.log('data',data);
    let active = data ? data.Active : false;
    console.log('dataFromChild',active);
   if(active && dataFromChild && dataFromChild.length <= 0)
   {
    setActiveError({disply: true , message:"At least one batch should be schedule"});
   }else{
    setActiveError({disply: false});
      const batches = [];
     if (dataFromChild) {
      for (let index = 0; index < dataFromChild.length; index++) {
        batches.push( dataFromChild[index].Data);
      }
    }
    // formData.append("active", active);
    // formData.append("eventId", data.Event);
    // console.log('formData',formData);

    var formData = {
      "active":active,
      "eventId": data.Event,
      "batches": batches
  }
  console.log('formData',formData);

    const url = `http://localhost:3000/schedule-event`;
    let r = await fetch(url, {
      method: "POST",headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(formData)
    })
    let res = await r.json()
    console.log('res ===', JSON.stringify(res));
    if (res.isSuccess == true) {
      //
    }
   }
  }
  
  const [dataFromChild, setDataFromChild] = useState([]);
  const [childComponents, setChildComponents] = useState([]);
  const addChildComponent = () => {
    setChildComponents([...childComponents, <DatePicker datapass={dataFromChild[{ count }]} count={count} key={childComponents.length} sendDataToParent={handleDataFromChild} />]);
  };

  function handleDataFromChild(data) {
    var childData;
    if (dataFromChild) {
      childData = dataFromChild;
    } else {
      childData = [];
    }
    console.log('data.Edit', data.Edit);
    if (data.Edit) {
      childData.push(data);
      console.log('childData', childData);
      setDataFromChild(childData);
      setActiveError({disply: false});
     
    } else {
      console.log('childData', childData);
      const elementIndex = childData.findIndex(item => item.key === data.key);
      deleteItem(elementIndex);

      // setDataFromChild(newArray);
    }
    console.log('dataFromChild', dataFromChild);
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
        <div className="container">
          <div className="title-header">Schedule Event</div>
          <div className="content">
            {isSuccess &&
              <div className="user-details">
                <div className="input-box ">
                  <span className="details">Event Name</span>
                  <select  {...register("Event")} >
                    {events.map(event => (
                      <option  value={event.eventId} key={event.eventId}>{event.name}</option>
                    ))}
                  </select>

                </div>
                <div >
                  <span className="details">Active</span>
                  <input  {...register("Active")} type="checkbox" id="active" name="Active" value ={true} />

                </div>
              </div>
            }
          </div>
          {activeError.disply && <div className='errorMessage'>{activeError.message}</div>}
          <div className="button-edit-container">
            <div className="button">
              <input onClick={() => {
                setCount(count => count + 1)
                addChildComponent()
              }
              } type="submit" value="Add Batch + " />
              <input  type="submit" value="Schedule Batches" />
            </div>
          </div>
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