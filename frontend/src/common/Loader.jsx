// common/Loader.jsx
import React from 'react';
import '../App.css'; // Create this CSS file

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClass = `loader-${size}`;
    
    return (
        <div className="loader-container">
            <div className={`loader ${sizeClass}`}>
                <div className="loader-spinner"></div>
            </div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;