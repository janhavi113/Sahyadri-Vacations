import React, { useState } from 'react';
import './ContactForm.css';
import Footer from "../../footer";

import Contact_Us from "./Contact_Us";
import EventHeader from './ContactUsHeader'
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
     <EventHeader/>
     
     <br />
     <div className="contentbody-contactUs all-event-contentbody">
      <Contact_Us/>
      </div>
      <Footer />
    </>
  );
}

export default ContactUs
