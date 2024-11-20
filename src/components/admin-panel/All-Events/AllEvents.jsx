import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "../../AdminNavbar";
import Card from "../../eventcard";
import "../Schedule-Events/ScheduleEvents.css"
import "./AllEvents.css"
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
const AllEvents = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [scheduleBatches, setScheduleBatches] = useState();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin-login");
        return;
      }
    getCurrentrecord();
  }, [navigate]);

  const getCurrentrecord = async () => {

    // alert("ok"); 
    let r = await fetch(`${apiUrl}schedule-event`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    console.log('res ===', res.events);
    if (res.isSuccess) {

      setSuccess(res.isSuccess);
      setEvent(res.events);
      setScheduleBatches(res.scheduleBatches);

    }

  }
  return (
    <div>
      <AdminNavbar>
      <div className=" contentbody">
        <div className="container justify-content-center py-md-5">
          <h1><b>All Available Events</b></h1>
          <div className="row justify-content- py-4" >

            {isSuccess && events.map((event, index) => (
              <>
                <div className="event-card card all-events-card">
                
                    <img className="event-card-image" src={event.images[0]} alt="Avatar" width="100%" />
                    <div className="event-card-container">
                      <h2 className='all-event-header event-card-header bg-transparent'><b>{event.name}</b></h2>
                      <div className='show-event-card-footer event-card-footer'>
                        <div className="button-edit-container">
                          <div className="button">
                            <input type="submit" value="Edit Event" onClick={() => navigate(event.url.includes("http://localhost:5173") ? event.url.replace( "http://localhost:5173","") : event.url)}/>
                            <input type="submit" value=" Schedule Event " onClick={() => navigate('/schedule-event')} />
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
      </AdminNavbar>
    </div>
  )
}

export default AllEvents;