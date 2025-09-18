import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../../AdminNavbar";
import CustomForm from '../../User-Panel/CorporateBookingPage/CustomForm';
import "../../AdminNavbar.css";
import BrochureItineraryForm from "./BrochureItineraryForm";
import GenerateBrochure from "./GenerateBrochure";
const CustomTourDetails = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isSubmitting, setSubmitting] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);   // toggle custom form
    const [showBrochureForm, setShowBrochureForm] = useState(false); // toggle brochure form
    const location = useLocation();
    const navigate = useNavigate();
    const [showBrochure, setShowBrochure] = useState(false);

    const [event, setEvent] = useState();
    const [record, setRecord] = useState(location.state); // keep record in state
    const [currentImages, setcurrentImages] = useState();
    // ------- Update Inquiry -------
    const handleFormSubmit = (data) => {
        console.log('---data---', data);
        handleSubmit(data);
    };
    const handleSubmit = async (formData) => {
        setSubmitting(true);
        // Add your logic for form submission here
        console.log(formData);
        let r = await fetch(`${apiUrl}update-customised-tour`, {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(formData)
        })
        let res = await r.json()
        console.log('res', JSON.stringify(res));
        if (res.isSuccess == true) {
            setSuccess(true);
            setRecord(res.data);
            setShowForm(false);
        } else {
            setSuccess(false);
        }
    };
    const handleBrochureFormSubmit = (data) => {
  
                console.log('=====data--', data);
        if (data) {
            setRecord(data.customisedRequest);
            setEvent(data.result);
             setcurrentImages(data.result?.images);
            setShowBrochureForm(false);
        }

    }
    const displayList = (data) => {
        var splitedList;
        if (data) {
            splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
            splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
            splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
            splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
        }
        return splitedList;
    }

    useEffect(() => {
        if (record.eventId) {
            fetchEvents(record.eventId);
        }

    }, []);

    const fetchEvents = async (eventId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin-login");
            return;
        }

        fetch(`${apiUrl}create-event/event-details/:${eventId}`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            }
        }).then(resp => resp.json())
            .then(data => {
                console.log('record--', record);
                console.log('data--', data.events);
                setEvent(data.events[0]);
                setcurrentImages(data.events[0]?.images);
            })
    };


    // ------- Cancel Inquiry (Delete) -------
    const handleCancelInquiry = async () => {
        if (!window.confirm("Are you sure you want to cancel this inquiry?")) return;

        try {
            let r = await fetch(`${apiUrl}delete-custom-Inquiry/${record._id}`, {
                method: "DELETE"
            });
            let res = await r.json();

            if (res.isSuccess) {
                alert("Inquiry cancelled successfully.");
                navigate("/customised-tour"); // redirect back to list page
            } else {
                alert("Failed to cancel inquiry.");
            }
        } catch (err) {
            console.error("Error cancelling inquiry:", err);
            alert("Something went wrong!");
        }
    };

    return (
        <AdminNavbar>
            <div className="contentbody">
                <div className="container justify-content-center py-md-5">
                    <div className="row justify-content- py-4">
                        <section className="py-16 px-6 md:px-20 text-center bg-gray-50">
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-0">
                                    Welcome, Custom Inquiries.
                                </h2>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setShowForm(!showForm);
                                            setShowBrochureForm(false); // close other form
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                                    >
                                        {showForm ? "Close Form" : "Edit Requirement"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowBrochureForm(!showBrochureForm);
                                            setShowForm(false); // close other form
                                        }}
                                        className="px-4 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700"
                                    >
                                        {showBrochureForm ? "Close Itinery Form" : "Generate Itinery"}
                                    </button>
                                    <button
                                        onClick={() => setShowBrochure(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                                    >
                                        {showBrochureForm ? "Close Brochure Form" : "Generate Brochure PDF"}
                                    </button>
                                    <button
                                        onClick={handleCancelInquiry}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
                                    >
                                        Cancel Inquiry
                                    </button>
                                </div>
                            </div>

                            {/* Show Info OR Forms */}
                            <div className="mt-8 text-left">
                                {!showForm && !showBrochureForm ? (
                                    <><div className="bg-white shadow-lg rounded-xl p-6">
                                        <h3 className="text-xl font-semibold mb-4">Inquiry Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(record || {}).map(([key, value]) => (
                                                <div key={key} className="p-2 bg-gray-50">
                                                    <span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {String(value)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                        <br></br>
                                        {event &&
                                            <div className="bg-white shadow-lg rounded-xl p-6">
                                                <h3 className="text-xl font-semibold mb-4">Itinery Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Event Name:</span>
                                                        {event.name}
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Event Details:</span>
                                                        {event.eventDetails}
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Event Type:</span>
                                                        {event.eventType}
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Location:</span>
                                                        {event.location}
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Type:</span>
                                                        {event.type}
                                                    </div>

                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Elevation:</span>
                                                        {event.elevation}
                                                    </div>

                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Difficulty:</span>
                                                        {event.difficulty}
                                                    </div>

                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Endurance:</span>
                                                        {event.endurance}
                                                    </div>

                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Duration:</span>
                                                        {event.duration}
                                                    </div>

                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Total Distance:</span>
                                                        {event.totalDistance}
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Age Group:</span>
                                                        {event.ageGroup}
                                                    </div>

                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Trek Distance:</span>
                                                        {event.trekDistance}
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Itinerary:</span>
                                                        <div>
                                                            <div dangerouslySetInnerHTML={{ __html: displayList(event.itinerary) }} />

                                                            <div className='note'><div className='thicker'>Note : </div>
                                                                Above mentioned timings are tentative, It may vary according to situation.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Highlights:</span>
                                                        <div dangerouslySetInnerHTML={{ __html: displayList(event.highlights) }} />
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">B2B Location:</span>
                                                        {event.b2bLocaion}
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Pickup Points from Pune:</span>
                                                        <div dangerouslySetInnerHTML={{ __html: displayList(event.pickupPoints) }} />
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Pickup Points form Mumbai:</span>
                                                        <div dangerouslySetInnerHTML={{ __html: displayList(event.pickupPointsfromMumbai) }} />
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Cost Includes:</span>
                                                        <div dangerouslySetInnerHTML={{ __html: displayList(event.costIncludes) }} />
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Cost Excludes:</span>
                                                        <div dangerouslySetInnerHTML={{ __html: displayList(event.costExcludes) }} />
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">Things To Carry:</span>
                                                        <div dangerouslySetInnerHTML={{ __html: displayList(event.thingsToCarry) }} />
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">FAQ:</span>
                                                        <div dangerouslySetInnerHTML={{ __html: displayList(event.FAQ) }} />
                                                    </div>
                                                    <div className="p-2 bg-gray-50">
                                                        <span className="font-bold capitalize">
                                                            Images
                                                            :</span>
                                                        <ul >
                                                            {currentImages.map(file => (
                                                                <li className="image-display" key={file} >
                                                                    <img
                                                                        src={`${apiUrl}${file}`}
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
                                            </div>}
                                    </>
                                ) : showForm ? (
                                    <CustomForm
                                        initialValues={record}
                                        showExtraFields={true}
                                        onFormSubmit={handleFormSubmit}
                                    />
                                ) : (showBrochureForm &&
                                    <BrochureItineraryForm
                                        initialValues={record}
                                        onFormSubmit={handleBrochureFormSubmit}
                                        onClose={() => setShowBrochureForm(false)}
                                    />
                                )}
                            </div>

                            {showBrochure && (
                                <GenerateBrochure
                                    event={event}
                                    inquiry={record}
                                    onClose={() => setShowBrochure(false)}
                                />
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </AdminNavbar>
    );
};

export default CustomTourDetails;
