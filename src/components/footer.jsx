import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString('en-IN'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString('en-IN'));
    }, 60000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-status">[CONNECTION STATUS: SECURE || CHANNEL: ARCHIVAL]</div>
      <div className="footer-disclaimer">All intel is presented for archival purposes. Dissemination is monitored.</div>
      <div className="footer-timestamp">[LAST SYSTEM SYNC: {timestamp}]</div>
    </footer>
  );
};

export default Footer;
