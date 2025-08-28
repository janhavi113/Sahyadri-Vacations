import React, { useState } from 'react';
import '../Contact_Us/ContactForm.css';
import Footer from "../../footer";
import Contact_Us from "./CorporateBookingForm";
import EventHeader from './CorporateBookingPageHeader'
const CorporateBookingPage = () => {
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
    
     <div className="contentbody-CorporateBookingPage">
      <Contact_Us/>
      </div>
      <Footer />
    </>
  );
}

export default CorporateBookingPage
