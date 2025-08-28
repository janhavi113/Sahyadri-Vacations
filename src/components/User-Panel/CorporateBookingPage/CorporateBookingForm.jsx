import React, { useState ,useRef  } from 'react';
import '../Contact_Us/ContactForm.css';
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
                    <button onClick={scrollToInquiry} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg text-lg font-semibold">
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
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Corporate treks are team bonding, stress relief, and nature
                    experiences designed to bring your employees together in a refreshing
                    way.
                </p>
            </section>
            {/* What We Offer */}
            <section className="py-12 px-6 md:px-20 bg-gray-50 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    <div>✔ Team-building treks</div>
                    <div>✔ Customised itineraries</div>
                    <div>✔ Safety & experienced trek leaders</div>
                    <div>✔ Transport, food & stay included</div>
                </div>
            </section>
            {/* Why Choose Us */}
            <section className="py-12 px-6 md:px-20 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                    Why Choose Sahyadri Vacations?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div>
                        <span className="text-3xl">⛰️</span>
                        <p className="font-semibold mt-2">Local expertise</p>
                    </div>
                    <div>
                        <span className="text-3xl">🌟</span>
                        <p className="font-semibold mt-2">100+ treks organized</p>
                    </div>
                    <div>
                        <span className="text-3xl">🏢</span>
                        <p className="font-semibold mt-2">Trusted by top companies</p>
                    </div>
                </div>
            </section>

            {/* Inquiry Form */}
            <section ref={inquiryRef} className="py-12 px-6 md:px-20 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Inquire Now</h2>
                <form className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        type="date"
                        placeholder="Preferred Date"
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

            <section className="py-12 px-6 md:px-20 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Find us here!
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
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
