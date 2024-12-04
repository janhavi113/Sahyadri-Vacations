import React, { useState } from 'react';
import "./MinimalCoupons.css";
import discount from '../../Images/discount.svg';

const MinimalCoupons = ({ coupons }) => {
  const [copiedCouponCode, setcopiedCouponCode] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setcopiedCouponCode(id); // Save the id of the copied coupon to identify which coupon was copied
    setTimeout(() => {
      setcopiedCouponCode(null); // Reset after 2 seconds
    }, 2000);
  };

  return (
    <>
      <div id="scrollspyHeading6" className='pt-4 pb-1 px-2'>
        <h2 className="h3">Offers You’ll Love</h2>
      </div>
      <div className="minimal-coupons-container">
        <div className="minimal-coupons-list">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="minimal-coupon">
              <div >
                <img loading="lazy" src={discount} />
              </div>
              <div className="coupon-details">
                <h3>{coupon.couponName}</h3>
                <p>{coupon.couponDescription}</p>
              </div>
              <div className="coupon-action">
                <span className="coupon-code">{coupon.couponName}</span>
                <button 
                  onClick={() => handleCopy(coupon.couponName, coupon._id)}
                >
                  {copiedCouponCode === coupon._id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MinimalCoupons;
