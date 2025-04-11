import React, { useState, useEffect } from 'react';
import './CouponForm.css';
import AdminNavbar from '../../AdminNavbar';
import CouponCard from './CouponCard';

const CouponForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [coupons, setCoupons] = useState([]);
  const [couponName, setCouponName] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [eventType, setEventType] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [couponDescription,setCouponDescription] = useState('');
  // Fetch all coupons
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${apiUrl}get-coupons`);
      const data = await response.json();

      if (response.ok) {
        setCoupons(data.coupons);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      const response = await fetch(`${apiUrl}delete-coupon/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setCoupons(coupons.filter((coupon) => coupon._id !== id)); // Update state after deletion
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!couponName || !eventType || (!discountPrice && !discountPercent)) {
      setMessage('Please fill out all required fields, including either discount price or discount percent.');
      return;
    }

    try {
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
          numberOfPeople,
          couponDescription
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
        setNumberOfPeople(1);
        setCouponDescription('');
        fetchCoupons(); // Refresh the coupon list
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
        <div className="container">
          <div className="coupon-title-header">
            <h2>Coupons</h2>
            <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
              {showForm ? 'Hide Form' : 'Create Coupon'}
            </button>
          </div>
         

          {showForm && (
            <div className="content">
              <div className="form-title-header">
                <h2>Create Coupons</h2>
             </div>
              <form onSubmit={handleSubmit}>
                <div className="user-details">
                  <div className="input-box">
                    <label htmlFor="couponName">Coupon Name:</label>
                    <input
                      type="text"
                      id="couponName"
                      value={couponName}
                      onChange={(e) => setCouponName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <label htmlFor="discountPrice">Discount Price:</label>
                    <input
                      type="number"
                      id="discountPrice"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="Enter discount price or leave empty"
                    />
                  </div>
                  <div className="input-box">
                    <label htmlFor="discountPercent">Discount Percent:</label>
                    <input
                      type="number"
                      id="discountPercent"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="Enter discount percent or leave empty"
                    />
                  </div>
                  <div className="input-box">
                    <label htmlFor="numberOfPeople">Number Of People:</label>
                    <input
                      type="number"
                      id="numberOfPeople"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <label htmlFor="couponName">Coupon Description:</label>
                    <input
                      type="text"
                      id="couponDescription"
                      value={couponDescription}
                      onChange={(e) => setCouponDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <label htmlFor="eventType">Event Type:</label>
                    <select
                      id="eventType"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      required
                    >
                      <option value="">--Select Event Type--</option>
                      <option value="TrekEvent">Trekking Event</option>
                      <option value="CampingEvent">Camping Event</option>
                      <option value="BackPackingTrip">BackPacking Trip</option>
                      <option value="AdventureActivity">Adventure Activity</option>
                      <option value="Special">Special</option>
                    </select>
                  </div>
                  <div className="button">
                    <input style={{ margin: '10px' }} type="submit" value="Create Coupon" />
                  </div>
                </div>
              </form>
            </div>
          )}

         
          {message && <p className='error-message'>{message}</p>}
          <div className="coupon-list">
            {coupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} onDelete={handleDeleteCoupon} />
            ))}
          </div>
        </div>
      </AdminNavbar>
    </div>
  );
};

export default CouponForm;
