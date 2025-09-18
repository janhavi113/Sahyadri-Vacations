import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../AdminNavbar";
import "../../AdminNavbar.css";
import logo from '../../Images/logo.png';
const CustomisedTour = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [inquiries, setInquiries] = useState([]);
    const navigate = useNavigate();
    const [isSuccess, setSuccess] = useState(false);
    const url = '';
    useEffect(() => {
        fetchEvents('all');
    }, [navigate]);

    const handleFilter = async (filter) => {
        fetchEvents(filter);
    }

    const fetchEvents = async (filter) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin-login");
            return;
        }
        const response = await fetch(`${apiUrl}show-all-custom-Inquiry/${filter}`, {
            headers: { Authorization: token },
        });

        if (response.ok) {
            const data = await response.json();
            setSuccess(true);
            console.log('data--custom-Inquiry--', data);
            if (data.isSuccess) {
                setInquiries(data.customisedRequests);
            }
        }
    }

    return (
        <>
            <AdminNavbar>
                <div className=" contentbody">
                    <div className="container justify-content-center py-md-5">
                        <div className="row justify-content- py-4">
                            {/* Why Choose Us */}
                            <section className="py-16 px-6 md:px-20 text-center bg-gray-50">
                                <div className="flex gap-6">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-12">
                                        Welcome, Custom Inquiries.
                                    </h2>
                                    <div className="dashboard-details">
                                        <span >Show Bookigs<span style={{ 'color': 'red' }}>*</span></span>
                                        <select onChange={(e) => handleFilter(e.target.value)}>
                                            <option value={'all'} >All</option>
                                            <option value={'Pending'} >Pending</option>
                                            <option value={'Confirmed'} >Confirmed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                                    {isSuccess && inquiries && (
                                        inquiries.map((event, index) => (
                                            <div>
                                                
                                                {/* Card Example */}
                                                <a onClick={() => navigate("/custom-tour-details", { state: event })}>
                                                    <div className="relative h-auto md:h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out group p-6 bg-white">

                                                        {/* Top Section */}
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="text-lg font-semibold">Travel Inquiry</h3>
                                                            {/* Status Indicator */}
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`w-2 h-2 rounded-full ${event.status === "Complete" ? "bg-red-500" : "bg-green-500"
                                                                        }`}
                                                                />
                                                                <span className="text-sm text-orange-500 font-bold font-medium"><b>{event.status}</b></span>
                                                            </div>
                                                        </div>

                                                        {/* Content Section */}
                                                        <div className="mt-4 space-y-2 text-left">
                                                            <p><span className="font-semibold">Name:</span> {event.name}</p>
                                                            <p><span className="font-semibold">Company:</span> {event.company}</p>
                                                            <p><span className="font-semibold">Travel Date:</span> {event.traveldate}</p>
                                                            <p><span className="font-semibold">People:</span> {event.numberofpeople}</p>
                                                            <p><span className="font-semibold">Preferred Location:</span> {event.preferredLocation}</p>
                                                        </div>

                                                    </div>

                                                </a>
                                            </div>
                                        ))
                                    )
                                    }
                                </div>
                            </section>

                        </div>
                    </div>
                </div >
            </AdminNavbar >
        </>
    )
}

export default CustomisedTour
