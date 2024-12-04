import React, { useState } from 'react';
import '../Contact_Us/ContactForm.css';
import '../../admin-panel/CreateEvent/CreateEvents.css'
import './CustomisedTour.css'
import Footer from "../../footer";
import Navbar from "../../Navbar";
import slide3 from '../../Images/Screen_4.webp';
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from "react-hook-form"
import sadface from '../../Images/sad-face.svg'
const CustomisedTour = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        traveldate: '',
        durationoftour: '',
        numberofpeople: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setSubmitting] = useState(false);
    const [isSuccess, setSuccess] = useState('');
   
    const onSubmit = async (data) => {
        setSubmitting(true);
        console.log('data', JSON.stringify(data));
        // Add your logic for form submission here
        let r = await fetch(`${apiUrl}customised-tour`,{
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(data)
        })
        let res = await r.json()
        console.log('res', JSON.stringify(res));
        if (res.isSuccess == true) {
            setSuccess(true);
        }else{
            setSuccess(false);
        }
        console.log(formData);
    };
    return (
        <>
            <Navbar />
            <div className="header">
                <img className='slide-image' src={slide3}></img>
                <div className="text team-text-blk team-head-text">Customised Tour</div>
            </div>
            {!isSubmitting &&
                <div className="container ">
                    <h2 className="title-header">Customised Tour</h2>
                    <div className="user-details column">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="name">Name <span style={{ color: 'orange' }}>*</span></label>
                                <input
                                    type="text"
                                    {...register("name", { required: { value: true, message: "This field is required" }, })}
                                    required
                                />
                                {errors.password && <div className='red'>{errors.name.message}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone <span style={{ color: 'orange' }}>*</span></label>
                                <input
                                    type="phone"
                                    {...register("phone", { required: { value: true, message: "This field is required" }, })}
                                    required
                                />
                                {errors.phone && <div className='red'>{errors.phone.message}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email <span style={{ color: 'orange' }}>*</span></label>
                                <input
                                    type="email"  {...register("email", { required: { value: true, message: "This field is required" }, })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="traveldate">Travel Date <span style={{ color: 'orange' }}>*</span></label>
                                <input
                                    type="date"
                                    {...register("traveldate", { required: { value: true, message: "This field is required" }, })}
                                    required
                                />
                                {errors.traveldate && <div className='red'>{errors.traveldate.message}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="numberofpeople">Number of People <span style={{ color: 'orange' }}>*</span></label>
                                <input
                                    type="number"
                                    {...register("numberofpeople", { required: { value: true, message: "This field is required" }, })}
                                    required
                                />
                                {errors.numberofpeople && <div className='red'>{errors.numberofpeople.message}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="preferedlocation">Prefered Location</label>
                                <input
                                    type="text"
                                    {...register("preferedlocation")}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="durationoftour">Duration of Tour</label>
                                <input
                                    type="text"
                                    {...register("durationoftour")}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    {...register("message")}
                                ></textarea>
                            </div>
                            <div className="button-edit-container">
                                <div className="button">
                                    <input type="submit" value="Submit" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
            {isSubmitting && isSuccess &&
                <div className="container">
                    <h2 className='thicker'> Thank you ! </h2>
                    <p className='customised-message '> Your interest is greatly appreciated, and we're thrilled to assist you in planning your ideal travel experience. Our dedicated team will be in touch with you very soon to discuss your preferences and craft a personalized itinerary that perfectly suits your needs. We can't wait to embark on this journey with you!</p>
                </div>
            }
            {isSubmitting && !isSuccess &&
                <div className="container">
                    <h2 className='thicker'> Try again ! </h2>
                    <div > <img  loading="lazy" src={sadface} /> </div>
                </div>
            }
            <hr />
            <div className="container">
                <h2 className='thicker'> FIND US HERE! </h2>
                <div className="user-details">
                    <div className='address-show'>
                        <FontAwesomeIcon className="icon" icon={faLocationDot} size="2x" />
                        <div className='address'>
                            1, opp to Komal Sweets,
                            Gulabnagar,
                            Dhankawadi, Pune - 43
                        </div>
                    </div>
                    <div className='address-show '>
                        <a className='address' href="tel:07028740961">
                            <FontAwesomeIcon className="icon" icon={faPhone} size="2x" />
                            <span className='address'>
                                +91 7028740961  </span>
                        </a>

                    </div>

                    <div className='address-show'>
                        <a className='address' href="mailto:contactus@sahyadrivacations.com">
                            <FontAwesomeIcon className="icon" icon={faEnvelope} size="2x" />
                            <span className='address'>
                                contactus@sahyadrivacations.com
                            </span>
                        </a>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CustomisedTour
