import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "./AdminNavbar";
import Card from "./eventcard";
import "./ScheduleEvents.css"
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
const AllEvents = () => {
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [scheduleBatches, setScheduleBatches] = useState();
  const {
    register,
    handleSubmit,
    setError,
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
    console.log('res ===', res.isSuccess);
    if (res.isSuccess) {
    
         setSuccess(res.isSuccess);
         setEvent(res.events);
         setScheduleBatches(res.scheduleBatches);
       
        }
        
  }
  return (
    <div>
        <AdminNavbar />
        <div className="title-header">All Avilable Events </div>
         <div className='card-display'>
         {isSuccess && events.map(event=> (
          <Card event = {event} key = {event.name}/>
         ))
         }
        </div>
    </div>
  )
}

export default AllEvents;