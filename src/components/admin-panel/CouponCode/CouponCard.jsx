import React, { useState, useEffect } from 'react';
import './CouponCard.css';

// Function to shuffle the colors and maintain order
const shuffleColors = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC300', '#8E44AD', '#2ECC71', '#E74C3C', '#FF7F50', '#6495ED'];
    return colors.sort(() => Math.random() - 0.5); // Randomize order
};

let colorQueue = shuffleColors();

// Get random color from the queue
const getRandomColor = () => {
  if (colorQueue.length === 0) {
    colorQueue = shuffleColors(); // Refill and reshuffle if all colors are used
  }
  return colorQueue.pop(); // Use the last color and remove it from the queue
};

// Function to create a gradient from the color
const getGradient = (baseColor) => {
  // Create a lighter and darker shade of the base color for the gradient
  const lightShade = shadeColor(baseColor, 20); // Lighten the color
  const darkShade = shadeColor(baseColor, -20); // Darken the color
  return `linear-gradient(135deg, ${lightShade}, ${darkShade})`; // Apply gradient with both shades
};

// Function to lighten or darken a color
const shadeColor = (color, percent) => {
  let num = parseInt(color.slice(1), 16); // Convert hex to RGB
  let r = (num >> 16) + percent;
  let g = (num >> 8 & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  return `#${(0x1000000 + (r < 255 ? r < 1 ? 0 : r : 255) * 0x10000 + (g < 255 ? g < 1 ? 0 : g : 255) * 0x100 + (b < 255 ? b < 1 ? 0 : b : 255)).toString(16).slice(1)}`;
};

const CouponCard = ({ coupon, onDelete }) => {
    const [backgroundColor, setBackgroundColor] = useState('');

    useEffect(() => {
      const color = getRandomColor(); // Get a random color
      const gradient = getGradient(color); // Get the gradient based on the random color
      setBackgroundColor(gradient); // Set the background to the gradient
    }, []); // Generate a new gradient when the component mounts
  
  const handleDelete = () => {
    onDelete(coupon._id);
  };

  return (
    <div className="coupon-card"  
      style={{
        background: backgroundColor, // Apply the gradient as the background
        color: '#FFFFFF', // Ensure text color is always white
      }}
    >
      <h3>{coupon.couponName}</h3>
      <p><strong>Event Type:</strong> {coupon.eventType}</p>
      <p><strong>Discount Price:</strong> ₹{coupon.discountPrice || 'N/A'}</p>
      <p><strong>Discount Percent:</strong> {coupon.discountPercent || 'N/A'}%</p>
      <p><strong>Number of People:</strong> {coupon.numberOfPeople}</p>
      <p><strong>Coupon Description:</strong> {coupon.couponDescription}</p>
      <button onClick={handleDelete} className="delete-button">Remove</button>
    </div>
  );
};

export default CouponCard;
