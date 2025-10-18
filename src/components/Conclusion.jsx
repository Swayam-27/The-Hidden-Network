import React from 'react';

const Conclusion = ({ message }) => {
  return (
    <div className="conclusion-wrapper">
      <div className="conclusion-header">[ TRANSMISSION COMPLETE ]</div>
      <p className="conclusion-message">{message}</p>
    </div>
  );
};

export default Conclusion;