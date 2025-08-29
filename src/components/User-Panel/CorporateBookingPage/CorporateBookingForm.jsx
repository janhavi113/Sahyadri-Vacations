import React, { useState, useEffect, useRef } from 'react';
import '../Contact_Us/ContactForm.css';
import BIGBUSK from '../../Images/CorporateClients/bigbucks.webp';
import TBWES from '../../Images/CorporateClients/Tbwes.jpg';
import JSPM from '../../Images/CorporateClients/JSPM.png';
import ENZIGMA from '../../Images/CorporateClients/enzigma.png';
import FITNESS from '../../Images/CorporateClients/FITNESS.png';
import INFINITY from '../../Images/CorporateClients/infinity.png';
import BEAST from '../../Images/CorporateClients/GOLD.png';
import MDI from '../../Images/CorporateClients/MDI.jpeg';
import './CorporateBooking.css'
import slide1 from "../../Images/corporate.jpeg";
import Navbar from "../../Navbar";
import TrustedBy from './TrustedBy';
import { faLocationDot, faEnvelope, faPhone, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sadface from '../../Images/sad-face.svg'
const logos = [TBWES, BIGBUSK, JSPM, ENZIGMA, INFINITY, BEAST, FITNESS, MDI];
const CorporateBookingForm = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        setSubmitting(true);
        e.preventDefault();
        // Add your logic for form submission here
        console.log(formData);
        let r = await fetch(`${apiUrl}contact-us`, {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(formData)
        })
        let res = await r.json()
        console.log('res', JSON.stringify(res));
        if (res.isSuccess == true) {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
    };
    const [isSuccess, setSuccess] = useState('');

    const inquiryRef = useRef(null);
    const scrollToInquiry = () => {
        inquiryRef.current.scrollIntoView({ behavior: "smooth" });
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (logos.length - 2));
        }, 3000); // move every 3s

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };
    return (
        <div>

            {/* Hero Section */}
            <section
                className="relative h-[70vh] flex items-center justify-center text-white"
                style={{
                    backgroundImage: `url(${slide1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Navbar />
                <div className="bg-black/30 bg-opacity-40 absolute inset-0"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Custom Corporate Outings
                    </h1>
                    <button onClick={scrollToInquiry} className="px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg text-lg font-semibold">
                        Request a Quote
                    </button>
                </div>
            </section>
            <div className="all-event-contentbody">
                {/* About Section */}

                <section className="py-12 px-6 md:px-20 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        About Corporate Events
                    </h2>
                    <p className="text-gray-600 max-w-6xl mx-auto mb-6">
                        At Sahyadri Vacations, we believe that corporate events are more than just gatherings – they are powerful opportunities to build stronger teams, celebrate achievements, and create unforgettable memories. Whether it’s an offsite team outing, an incentive tour to reward top performers, a high-energy adventure for team bonding, or a well-planned conference in a serene setting, we design customized experiences that perfectly align with your company’s goals. With our expertise in corporate tours and MICE (Meetings, Incentives, Conferences, Exhibitions), we ensure seamless planning, professional execution, and a touch of leisure that keeps your team refreshed and motivated. From travel arrangements to unique destinations, we take care of everything so you can focus on what matters most – connecting, collaborating, and growing together.
                    </p>
                </section>


                {/* What We Offer */}
                <section className="py-12 px-6 md:px-20 text-center ">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">
                        What We Offer
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto">

                        <div>
                            <span className="text-3xl">🚌</span>
                            <p className="font-semibold mt-2">End-to-End Travel Management</p>
                            <p className="text-gray-600 text-sm mt-1">
                                Transport, stay, meals, activities, and logistics handled smoothly.
                            </p>
                        </div>

                        <div>
                            <span className="text-3xl">🤝</span>
                            <p className="font-semibold mt-2">Team Building & Engagement</p>
                            <p className="text-gray-600 text-sm mt-1">
                                Trekking, adventure sports, group games, bonfire nights, and workshops.
                            </p>
                        </div>

                        <div>
                            <span className="text-3xl">🎉</span>
                            <p className="font-semibold mt-2">Reward & Recognition Tours</p>
                            <p className="text-gray-600 text-sm mt-1">
                                Incentive trips to motivate and celebrate employees.
                            </p>
                        </div>

                        <div>
                            <span className="text-3xl">🛡️</span>
                            <p className="font-semibold mt-2">Safety & Comfort First</p>
                            <p className="text-gray-600 text-sm mt-1">
                                Certified vehicles, trained leaders, first-aid support & 24/7 assistance.
                            </p>
                        </div>

                        <div>
                            <span className="text-3xl">🌍</span>
                            <p className="font-semibold mt-2">Pan-India Destinations</p>
                            <p className="text-gray-600 text-sm mt-1">
                                From Sahyadri treks to Shimla-Manali, Goa, Kerala, and beyond.
                            </p>
                        </div>

                    </div>
                </section>



                {/* Why Choose Us */}
                <section className="py-16 px-6 md:px-20 text-center bg-gray-50">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12">
                        Why Choose <span className="text-orange-600">Sahyadri Vacations?</span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {/* Card 1 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-5xl">🧑‍🏫</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">Expert Team</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                Our team of professionals ensures you have the best adventure experience.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-5xl">📋</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">Perfect Planning & Execution</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                From travel to stay to meals — our meticulous planning ensures smooth and stress-free experiences.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-5xl">🏢</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">Proven Corporate Trust</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                Partnered with top organizations to deliver customized
                                experiences that boost teamwork and employee morale.
                            </p>
                        </div>

                        {/* Card 4 */}

                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-5xl">🌟</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">50+ Events Organized</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                Successfully hosted over 50 corporate group events with a
                                proven track record of safety, fun, and adventure.
                            </p>
                        </div>
                    </div>
                </section>
                <TrustedBy />

                {/* Inquiry Form */}
                {!isSubmitting && <section ref={inquiryRef} className="py-12 px-8 md:px-20 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Inquire Now</h2>
                    <form className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            Name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Company"
                            Name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            Name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            Name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Group Size"
                            Name="numberofpeople"
                            value={formData.numberofpeople}
                            onChange={handleChange}
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Preferred Date"
                            Name="traveldate"
                            value={formData.traveldate}
                            onChange={handleChange}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            Name="budgetPerPerson"
                            value={formData.budgetPerPerson}
                            onChange={handleChange}
                            placeholder="Budget Per Person"
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            Name="preferedLocation"
                            value={formData.preferedLocation}
                            onChange={handleChange}
                            placeholder="Preferred Destination"
                            className="border p-3 rounded-lg"
                        />
                        <textarea
                            placeholder="Message"
                            Name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="border p-3 rounded-lg md:col-span-2"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg md:col-span-2 font-semibold"
                        >
                            Request a Proposal
                        </button>
                    </form>
                </section>}
{isSubmitting && isSuccess &&
              <div className="container">
                <h2 className='thicker'> Thank you ! </h2>
                <p className='customised-message '> Your interest is greatly appreciated, and we're thrilled to assist you in planning your ideal travel experience. Our dedicated team will be in touch with you very soon to discuss your preferences and craft a personalized itinerary that perfectly suits your needs. We can't wait to embark on this journey with you!</p>
              </div>
            }
            {isSubmitting && !isSuccess &&
              <div className="container">
                <h2 className='thicker'> Try again ! </h2>
                <div > <img style={{ margin: '12px 0px 0 46%' }} loading="lazy" src={sadface} /> </div>
              </div>
            }
                <section className="py-12 px-8 md:px-20 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Find us here!
                    </h2>
                    <p className="text-gray-600 max-w-4xl mx-auto">
                        <div className="user-details">
                            <div className='address-show'>
                                <FontAwesomeIcon className="location icon" icon={faLocationDot} size="1x" />
                                <div >
                                    1, opp to Komal Sweets,
                                    Gulabnagar,
                                    Dhankawadi, Pune , Maharashtra - 411043
                                </div>
                            </div>
                            <div className='address-show '>
                                <a className='address' href="tel:07028740961">
                                    <FontAwesomeIcon className="icon" icon={faPhone} size="1x" />
                                    <span className='address'>
                                        +91 7028740961  </span>
                                </a>

                            </div>

                            <div className='address-show'>
                                <a className='address address-email' href="mailto:contactus@sahyadrivacations.com">
                                    <FontAwesomeIcon className="icon" icon={faEnvelope} size="1x" />
                                    <span className='address'>
                                        contactus@sahyadrivacations.com
                                    </span>
                                </a>

                            </div>
                        </div>
                    </p>
                </section>
            </div>
        </div>
    )
}

export default CorporateBookingForm
