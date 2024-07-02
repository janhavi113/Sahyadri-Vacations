import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams, useLocation } from "react-router-dom";
import Footer from "../footer";
import Navbar from "../Navbar";
import slide2 from '../Images/Screen_3.webp';
import slide3 from '../Images/Screen_4.webp';
import slide4 from '../Images/Screen_1.jpg';
import slide1 from '../Images/backgrround (2).jpg';
import '../Home_Header/Sidebar.css'
import '../ShowAllEvents/Events.css'
import './SearchEvent.css'
import { useNavigate } from "react-router-dom";

const SearchEvent = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParameters = new URLSearchParams(window.location.search)
  //alert('queryParameters',queryParameters);
  const [type, setType] = useState(queryParameters.get("search"));
  const [params, setParams] = useState(type.split('/'));
  const [prParams, setPrParams] = useState();
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [searchInfo, setSearchInfo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    searchRecord();
  }, [location.search]);

  function handleSearchChange(e) {
    setSearchInfo(e.target.value);

  }
  function handleSearch() {
    navigate("/search-event?search=" + searchInfo);
  }
  const searchRecord = async () => {

    const query = new URLSearchParams(location.search).get('search');
    setSearchText(query);
    if (query) {
      const fetchData = async () => {
        try {
          setParams(query);
          getAllRecord(query);
        } catch (error) {
          console.error('Error fetching the treks', error);
        }
      };
      fetchData();
    }
  }

  const getNextBatchDate = (event) => {
    var liveEvent = '';
    let batchdate;
    let eventCostPerPerson;
    const Q = new Date("2024-04-09");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i = 0; i < event.batches.length; i++) {
      if (new Date(event.batches[i].eventStartDate) - Q >= 0) {
        batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()];
        eventCostPerPerson = event.batches[i].eventCostPerPerson;
      }
    }
    if (batchdate && eventCostPerPerson) {
      liveEvent = {
        eventId: event.eventId,
        eventname: event.eventname,
        eventType: event.eventType,
        url: event.Url,
        images: event.images,
        batchdate: batchdate,
        eventCostPerPerson: eventCostPerPerson,

      }
    }
    return liveEvent;
  }
  const getAllRecord = async (query) => {
    let liveEvents = [];
    let r = await fetch(`http://localhost:3000/search-event/${query}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    console.log('res +==', JSON.stringify(res));
    if (res.isSuccess == true) {
      setSuccess(true);
      for (let i = 0; i < res.events.length; i++) {
        if (getNextBatchDate(res.events[i]) != '') {
          liveEvents.push(getNextBatchDate(res.events[i]));
        }
      }
      setEvent(liveEvents);
    }

  }

  return (
    <div>
      <Navbar />
      <div className='search'>
        <div className="wrapper">
          <h1>Search</h1>
          <div className="input-container ">
            <input type="text" className='mx-lg-4 form-control'  onChange={handleSearchChange} placeholder="Search for a trek/trip" />
            <div className="button-edit-container">
              <div className="button">
                <input type="submit" onClick={handleSearch} value="Search" />
              </div>
            </div>
          </div>
        </div>
        <div className="Search-Img" >
          <img src={slide1} alt="header" />
        </div>
      </div>
      <div className="contentbody">
        <div className="container justify-content-center py-md-5">
        <div className='search-text'>
              <h2><b>Search result for : </b><span className='searchtextcolor'>{searchText}</span></h2>
            </div>  
          <div className="row justify-content- py-4" >      
            
            {isSuccess && events.map((event, index) => (
              <>
                <div className="event-card card all-events-card">
                  <a onClick={() => navigate(event.url)}>
                    <img className="event-card-image" src={event.images} alt="Avatar" width="100%" />
                    <div className="event-card-container">
                      <h2 className='all-event-header event-card-header bg-transparent'><b>{event.eventname}</b></h2>
                      <div className='all-event-card-footer event-card-footer'>
                        <div >{event.batchdate}</div>
                        <div ><strong className='price'>₹{event.eventCostPerPerson} </strong><i>per person</i></div>
                      </div>
                    </div>
                  </a>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SearchEvent
