// Loading.js
import React, { useEffect } from 'react';
import './Loading.css'; // Optional: for styling
import logo from '../Images/logo.png'; // Update the path to your logo
import { useNavigate } from 'react-router-dom';

const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/confirmation'); // Redirect to the confirmation page or desired path
        }, 5000); // 5 seconds

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [navigate]);

    return (
        <div className="loading-container">
            <img src={logo} alt="Loading..." className="loading-logo" />
            <p>Loading, please wait...</p>
        </div>
    );
};

export default Loading;
