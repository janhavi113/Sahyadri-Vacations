import React, { useEffect, useState } from 'react';
import Footer from "../../footer";
import EventHeader from './EventHeader';
import { useNavigate } from "react-router-dom";
import "../../card.css";
import '../../home.css';
import './Events.css';
import "react-multi-carousel/lib/styles.css";
import './Camping_Event.css';
import { getUpcomingEvents, getUnscheduledOrRecurringEvents } from '../../utils/eventUtils';

const BackPacking_Event = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isSuccess, setSuccess] = useState(false);
    const [events, setEvents] = useState([]);
    const [unscheduledEvents, setUnscheduledEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isSuccess) {
            getAllRecord();
        }
    }, [isSuccess]);

    const getAllRecord = async () => {
        try {
            const response = await fetch(`${apiUrl}show-events/BackPackingTrip`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json();

            if (res.isSuccess) {
                setSuccess(true);

                // ✅ Get upcoming events
                const filteredUpcoming = getUpcomingEvents(
                    res.events,
                    apiUrl,
                    ["BackPackingTrip"]
                );

                // ✅ Get "On Public Demand" / "Available on All Weekends" events
                const filteredUnscheduled = getUnscheduledOrRecurringEvents(
                    res.events,
                    apiUrl,
                    ["BackPackingTrip"]
                );

                setEvents(filteredUpcoming);
                setUnscheduledEvents(filteredUnscheduled);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const renderEventCard = (event, index) => (
        <div key={index} className="mt-2 col-lg-3 col-md-3 col-sm-3">
            <div className="event-card card all-events-card">
                <a onClick={() => navigate(event.url)}>
                    <img
                        className="event-card-image"
                        src={event.images}
                        alt={event.eventname}
                        width="100%"
                    />
                    <div className="event-card-container">
                        <h2 className="all-event-header event-card-header bg-transparent">
                            <b>{event.eventname}</b>
                        </h2>
                        <div className="all-event-card-footer event-card-footer">
                            <div>{event.batchdate}</div>
                            <div>
                                <i>Starts From </i>
                                <strong className="price">
                                    ₹
                                    {Math.min(
                                        ...[event.eventCostPerPerson, event.eventCostPerPersonFromMumbai, event.b2bPrice]
                                            .filter((price) => price > 0)
                                    )}
                                </strong>
                                /-
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );

    return (
        <div>
            <EventHeader name="BackPacking Events" />

            {/* 🔹 UPCOMING EVENTS */}
            <div className="all-event-contentbody">
                <div className="team justify-content-center">
                    <div className="row">
                        {isSuccess && events.length > 0 ? (
                            events.map(renderEventCard)
                        ) : (
                            <p className="text-center mt-3">No upcoming events found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔹 ON PUBLIC DEMAND / WEEKEND EVENTS SECTION */}
            {unscheduledEvents.length > 0 && (
                <div className="on-demand-section all-event-contentbody mt-5">
                    <div className="team justify-content-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">On Public Demand — Because You Loved Them!</h1>
                        <div className="row">
                            {unscheduledEvents.map(renderEventCard)}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BackPacking_Event;
