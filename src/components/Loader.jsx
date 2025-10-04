import React from 'react';

const Loader = ({ message = "ESTABLISHING SECURE CONNECTION..." }) => {
    return (
        <div className="loader-container">
            <p className="loader-text">{message}<span className="typing-cursor">_</span></p>
        </div>
    );
};

export default Loader;