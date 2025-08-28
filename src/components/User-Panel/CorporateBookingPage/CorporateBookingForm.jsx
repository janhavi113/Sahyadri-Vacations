import React, { useState, useRef } from 'react';
import '../Contact_Us/ContactForm.css';
import BIGBUSK from '../../Images/CorporateClients/bigbucks.webp';
import TBWES from '../../Images/CorporateClients/Tbwes.jpg';
import JSPM from '../../Images/CorporateClients/JSPM.png';
import './CorporateBooking.css'
import slide1 from "../../Images/contact-us.jpg";
import Navbar from "../../Navbar";
import { faLocationDot, faEnvelope, faPhone, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sadface from '../../Images/sad-face.svg'
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
                        Plan Your Corporate Trek with Us
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
                        About Corporate Treks
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        Corporate treks are more than just outdoor adventures—they are carefully
                        curated experiences designed to boost team spirit, improve collaboration,
                        and create lasting memories. Stepping out of the office and into nature
                        helps employees recharge mentally and physically while strengthening
                        workplace relationships.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
                        <div className="p-6 bg-white shadow-md rounded-2xl">
                            <h3 className="text-xl font-semibold mb-3">🌿 Stress Relief</h3>
                            <p className="text-gray-600">
                                Time in nature helps employees disconnect from routine work pressure
                                and return refreshed with renewed focus.
                            </p>
                        </div>

                        <div className="p-6 bg-white shadow-md rounded-2xl">
                            <h3 className="text-xl font-semibold mb-3">🤝 Team Bonding</h3>
                            <p className="text-gray-600">
                                Outdoor challenges encourage teamwork, problem-solving, and
                                better communication among colleagues.
                            </p>
                        </div>

                        <div className="p-6 bg-white shadow-md rounded-2xl">
                            <h3 className="text-xl font-semibold mb-3">💡 Skill Building</h3>
                            <p className="text-gray-600">
                                Activities promote leadership, adaptability, and decision-making skills
                                that employees carry back to the workplace.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Trusted by Section */}
                <section className="py-12 px-8 md:px-20 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Trusted by
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-8xl mx-auto">
                        <div >
                            <img src={TBWES} alt="TBWES" className="corporate-logo-img " />
                        </div>
                        <div>
                            <img src={BIGBUSK} alt="BIGBUSK" className="corporate-logo-img " />
                        </div>
                        <div>
                            <img src={JSPM} alt="JSPM" className="corporate-logo-img " />
                        </div>


                    </div>
                </section>
                {/* What We Offer */}
                <section className="py-12 px-8 md:px-20 bg-gray-50 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-8xl mx-auto">
                        <div>✔ Team-building treks</div>
                        <div>✔ Customised itineraries</div>
                        <div>✔ Safety & experienced trek leaders</div>
                        <div>✔ Transport, food & stay included</div>
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
                            <span className="text-5xl">⛰️</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">Local Expertise</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                With years of experience in the Sahyadris, we know the best trails,
                                hidden gems, and safe routes to make your trek unforgettable.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-5xl">🌟</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">100+ Treks Organized</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                Successfully hosted over 100 corporate and group treks with a
                                proven track record of safety, fun, and adventure.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-5xl">🏢</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">Trusted by Companies</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                Partnered with top organizations to deliver customized trekking
                                experiences that boost teamwork and employee morale.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                            <span className="text-5xl">🌍</span>
                            <h3 className="text-lg md:text-xl font-semibold mt-4">Sustainable Tourism</h3>
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                We promote eco-friendly trekking practices and leave no trace
                                to preserve nature for future generations.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Inquiry Form */}
                <section ref={inquiryRef} className="py-12 px-8 md:px-20 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Inquire Now</h2>
                    <form className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Name"
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Company"
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Group Size"
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Preferred Date"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                            className="border p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            placeholder="Budget Per Person"
                            className="border p-3 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Preferred Destination"
                            className="border p-3 rounded-lg"
                        />
                        <textarea
                            placeholder="Message"
                            className="border p-3 rounded-lg md:col-span-2"
                        />
                        <button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg md:col-span-2 font-semibold"
                        >
                            Submit Inquiry
                        </button>
                    </form>
                </section>

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
