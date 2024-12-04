import React, { useRef, useEffect, useState } from 'react';
import { useSearchParams, useLocation } from "react-router-dom";
import Footer from "../../footer";
import Navbar from "../../Navbar";
import slide1 from '../../Images/backgrround (2).jpg';
import '../../Home_Header/Sidebar.css'
import '../ShowAllEvents/Events.css'
import './SearchEvent.css'
import { useNavigate } from "react-router-dom";

const SearchEvent = (props) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParameters = new URLSearchParams(window.location.search)
  //alert('queryParameters',queryParameters);
  const [type, setType] = useState(queryParameters.get("search"));
  const [params, setParams] = useState(type?.split('/'));
  const [prParams, setPrParams] = useState();
  const [isSuccess, setSuccess] = useState(false);
  const [events, setEvent] = useState();
  const [searchInfo, setSearchInfo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [allAvailable, setAllAvailable] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    searchRecord();
  }, [location.search]);

  function handleSearchChange(e) {
    setSearchInfo(e.target.value);

  }
  function handleSearch() {
    if (searchInfo) {
      navigate("/search-event?search=" + searchInfo);
    } else {
      navigate("/search-event");
    }

  }
  const searchRecord = async () => {

    const query = new URLSearchParams(location.search).get('search');
    setSearchText(query);
    setSearchInfo(query);
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
    } else {

      getAllAvailableEvents();
    }
  }
  const eventLabels = {
    TrekEvent: 'Trekking Event',
    CampingEvent: 'Camping Event',
    BackPackingTrip: 'BackPacking Trip'
  };
  const getNextBatchDate = (event) => {
    var liveEvent = '';
    let batchdate;
    let eventCostPerPerson;
    const Q = new Date("2024-04-09");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (event.batches) {
      for (let i = 0; i < event.batches.length; i++) {
        if (new Date(event.batches[i].eventStartDate) - Q >= 0) {
          batchdate = new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()];
          eventCostPerPerson = event.batches[i].eventCostPerPerson;
        }
      }
    } else {
      if (new Date(event.eventStartDate) - Q >= 0) {
        batchdate = new Date(event.eventStartDate).getDate() + ' ' + months[new Date(event.eventStartDate).getMonth()] + ' - ' + new Date(event.eventEndDate).getDate() + ' ' + months[new Date(event.eventEndDate).getMonth()];
        eventCostPerPerson = event.eventCostPerPerson;
      }
    }
    if (batchdate && eventCostPerPerson) {
      liveEvent = {
        eventId: event.eventId,
        eventname: event.eventname,
        eventType: event.eventType,
        url: event.Url,
        images: `${apiUrl}` + event.images,
        batchdate: batchdate,
        eventCostPerPerson: eventCostPerPerson,

      }
    }
    return liveEvent;
  }
  const getAllAvailableEvents = async () => {
    let liveEvents = [];
    let r = await fetch(`${apiUrl}show-all-events`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json();
    if (res.isSuccess == true) {
      setSuccess(true);
      setAllAvailable(true);
      setNotFound(false);
      if (res.isSuccess == true) {
        for (let i = 0; i < res.events.length; i++) {
          if (getNextBatchDate(res.events[i]) != '') {
            liveEvents.push(getNextBatchDate(res.events[i]));
          }
        }
        setEvent(liveEvents);
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }
  const getAllRecord = async (query) => {
    let liveEvents = [];
    let r = await fetch(`${apiUrl}search-event/${query}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })
    let res = await r.json()
    console.log('res +==', JSON.stringify(res));
    if (res.isSuccess == true) {
      setSuccess(true);
      setAllAvailable(false);
      setNotFound(false);
      if (res.events.length > 0) {
        for (let i = 0; i < res.events.length; i++) {
          if (getNextBatchDate(res.events[i]) != '') {
            liveEvents.push(getNextBatchDate(res.events[i]));
          }
        }
        setEvent(liveEvents);
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }

  }

  return (
    <div>
      <Navbar />
      <div className='search'>
        <div className="wrapper">
          <h1>Search</h1>
          <div className="input-container">
            <input
              type="text"
              className="mx-lg-4 form-control"
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              value={searchInfo}
              placeholder="Search for a trek/trip"
            />
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
      {!notFound && <div className="contentbody">
        <div className="container justify-content-center py-md-5">
          <div className='search-text'>
            {!allAvailable &&
              <h2><b>Search result for : </b><span className='searchtextcolor'>{searchText}</span></h2>
            }
            {allAvailable &&
              <h2><b>Available Events : </b><span className='searchtextcolor'>{searchText}</span></h2>
            }
          </div>
          <div className="row justify-content- py-4" >

            {isSuccess && events.map((event, index) => (
              <>
                <div className="event-card card all-events-card">
                  <a onClick={() => navigate(event.url)}>
                    <img className="event-card-image" src={event.images} alt="Avatar" width="100%" />
                    <div className="event-card-container">
                      <h2 className='all-event-header event-card-header bg-transparent'><b>{event.eventname}</b></h2>
                      <div className="event-tag-search">
                        {eventLabels[event.eventType] || 'Adventure Activity'}
                      </div>
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
      </div>}
      {notFound && <div className="contentbody">
        <div className="container justify-content-center py-md-5">
          <div className='not-found'>No Event Found  
          <svg width="64px" height="64px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#f0e800" fill-rule="evenodd" d="M484,163 L485,163 C485,161.343146 483.656854,160 482,160 C480.343146,160 479,161.343146 479,163 L480,163 C480,161.895431 480.895431,161 482,161 C483.104569,161 484,161.895431 484,163 Z M482,168 C486.970563,168 491,163.970563 491,159 C491,154.029437 486.970563,150 482,150 C477.029437,150 473,154.029437 473,159 C473,163.970563 477.029437,168 482,168 Z M479,158 C479.552285,158 480,157.552285 480,157 C480,156.447715 479.552285,156 479,156 C478.447715,156 478,156.447715 478,157 C478,157.552285 478.447715,158 479,158 Z M485,158 C485.552285,158 486,157.552285 486,157 C486,156.447715 485.552285,156 485,156 C484.447715,156 484,156.447715 484,157 C484,157.552285 484.447715,158 485,158 Z" transform="translate(-473 -150)"></path> </g></svg>
           </div>
        </div>
      </div>}
      <Footer />
    </div>
  )
}

export default SearchEvent
