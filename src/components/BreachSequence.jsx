import React, { useState, useEffect } from 'react';

const sequenceLines = [
  'Bypassing main firewall...',
  'Connection rerouted through proxy [127.0.0.1]',
  'Injecting SQL... Query OK.',
  'ROOT ACCESS GRANTED.',
];

const BreachSequence = ({ onComplete, playTypingLoop, stopTypingLoop }) => {
  const [currentLines, setCurrentLines] = useState([]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (playTypingLoop) playTypingLoop();
    let lineIndex = 0;
    let charIndex = 0;
    const timeouts = [];

    const typeLine = () => {
      if (lineIndex >= sequenceLines.length) {
        setIsTyping(false);
        if (stopTypingLoop) stopTypingLoop();
        timeouts.push(setTimeout(onComplete, 1000));
        return;
      }

      const currentLineText = sequenceLines[lineIndex];

      if (charIndex === 0) {
        setCurrentLines((prev) => [...prev, '']);
      }

      if (charIndex < currentLineText.length) {
        setCurrentLines((prev) => {
          const newLines = [...prev];
          newLines[newLines.length - 1] = currentLineText.substring(
            0,
            charIndex + 1
          );
          return newLines;
        });
        charIndex++;
        timeouts.push(setTimeout(typeLine, 50));
      } else {
        lineIndex++;
        charIndex = 0;
        timeouts.push(setTimeout(typeLine, 500));
      }
    };

    timeouts.push(setTimeout(typeLine, 100));

    return () => {
      timeouts.forEach(clearTimeout);
      if (stopTypingLoop) stopTypingLoop();
    };
  }, [onComplete, playTypingLoop, stopTypingLoop]);

  return (
    <div className="breach-overlay">
      <div className="breach-text">
        {currentLines.map((line, i) => (
          <p key={i}>
            {line}
            {i === currentLines.length - 1 && isTyping && (
              <span className="typing-cursor"></span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BreachSequence;