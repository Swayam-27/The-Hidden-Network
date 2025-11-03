import React, { useEffect } from 'react';

const Loader = ({
  message = 'ESTABLISHING SECURE CONNECTION...',
  playTypingLoop,
  stopTypingLoop,
}) => {
  useEffect(() => {
    if (playTypingLoop) playTypingLoop();
    return () => {
      if (stopTypingLoop) stopTypingLoop();
    };
  }, [playTypingLoop, stopTypingLoop]);

  return (
    <div className="loader-container">
      <p className="loader-text">
        {message}
        <span className="typing-cursor">_</span>
      </p>
    </div>
  );
};

export default Loader;