import React, { useState } from 'react';
import './CouponForm.css';
import AdminNavbar from '../../AdminNavbar'
const CouponForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [couponName, setCouponName] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [eventType, setEventType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if either discountPrice or discountPercent is provided
    if (!couponName || !eventType || (!discountPrice && !discountPercent)) {
      setMessage('Please fill out all required fields, including either discount price or discount percent.');
      return;
    }
    console.log('coupen---', JSON.stringify({
      couponName,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      discountPercent: discountPercent ? parseFloat(discountPercent) : null,
      eventType,
    }))
    try {
      // Sending a POST request to create a new coupon using fetch
      const response = await fetch(`${apiUrl}create-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponName,
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          discountPercent: discountPercent ? parseFloat(discountPercent) : null,
          eventType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Coupon created successfully: ${data.coupon.couponName}`);
        // Reset form fields
        setCouponName('');
        setDiscountPrice('');
        setDiscountPercent('');
        setEventType('');
      } else {
        setMessage(`Error creating coupon: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
    <AdminNavbar>
    <div className="container" style={{    'margin-top': '130px'}}>
      <div className="title-header">
        <h2>Create a New Coupon</h2>
      </div>
      <div className="content">
      <form onSubmit={handleSubmit}>
       
          <div className="user-details">
            <div className="input-box ">
              <label htmlFor="couponName">Coupon Name:</label>
              <input
                type="text"
                id="couponName"
                value={couponName}
                onChange={(e) => setCouponName(e.target.value)}
                required
              />
            </div>
            <div className="input-box ">
              <label htmlFor="discountPrice">Discount Price:</label>
              <input
                type="number"
                id="discountPrice"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Enter discount price or leave empty"
              />
            </div>
            <div className="input-box ">
              <label htmlFor="discountPercent">Discount Percent:</label>
              <input
                type="number"
                id="discountPercent"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="Enter discount percent or leave empty"
              />
            </div>
            <div className="input-box ">
              <label htmlFor="eventType">Event Type:</label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              >
                <option value="">--Select Event Type--</option>
                <option value={"TrekEvent"} >Trekking Event</option>
                <option value={"CampingEvent"}>Camping Event</option>
                <option value={"BackPackingTrip"} >BackPacking Trip</option>
                <option value={"AdventureActivity"} >Adventure Activity</option>
                <option value={"Special"}>Special</option>
              </select>
            </div>
            <div className="button">
              <input style={{'margin': '10px'}}  type="submit" value="Create Coupon" />
            </div>
          </div>
        
      </form>
      </div>
      {message && <p>{message}</p>}
    </div>
    </AdminNavbar>
    </div>
  );
};

export default CouponForm;
