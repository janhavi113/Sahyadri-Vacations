// CircularLoading.js
import React from 'react';
import './CircularLoading.css'; // Import the CSS for styling

const CircularLoading = () => {
    return (
        <div className="circular-loading-container">
            <div className="circular-spinner"></div>
            <p>Processing your booking...</p>
        </div>
    );
};

export default CircularLoading;
