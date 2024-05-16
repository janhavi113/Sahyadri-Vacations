import React, { useState } from 'react';
import './ContactForm.css';
import Footer from "../footer";
import Navbar from "../Navbar";
import Contact_Us from "./Contact_Us";
import slide3 from '../Images/Screen_4.webp';
const ContactUs = () => {
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

  const handleSubmit = (e) => {
    setSubmitting(true);
    e.preventDefault();
    // Add your logic for form submission here
    console.log(formData);
  };

  return (
    <>
      <Navbar />
      <div className="header">
        <img className='slide-image' src={slide3}></img>
        <div className="text team-text-blk team-head-text">Contact Us</div>
      </div>
      <div className="container-bottom container">
          <h2 className="title-header">CONTACT US</h2>
          </div>
      <Contact_Us/>
      <Footer />
    </>
  );
}

export default ContactUs
