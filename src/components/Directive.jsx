import React, { useState, useEffect, useRef } from "react";

const directiveLines = [
  "// INCOMING TRANSMISSION... SOURCE UNKNOWN //",
  "",
  '<span class="directive-greeting">WELCOME, AGENT.</span>',
  "Your mission: breach the core network. This is a one-time authentication.",
  "Use the command-line terminal below to prove your skills.",
  'Success will restore <span class="directive-reward">full navigational access</span>, making it easier to move around the Network.',
  "Your terminal is now active below. Awaiting your directive.",
];

const Directive = ({ isVisible, onFinished }) => {
  const [lines, setLines] = useState(Array(directiveLines.length).fill(""));
  const lineIndex = useRef(0);
  const charIndex = useRef(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const directiveShown = sessionStorage.getItem("directiveShown") === "true";

    if (directiveShown) {
      setLines(directiveLines);
      setIsComplete(true);
      if (onFinished) onFinished();
      return;
    }

    const timeouts = [];
    const type = () => {
      if (lineIndex.current >= directiveLines.length) {
        if (onFinished) onFinished();
        sessionStorage.setItem("directiveShown", "true");
        setIsComplete(true);
        return;
      }

      const currentLineText = directiveLines[lineIndex.current];
      if (charIndex.current < currentLineText.length) {
        setLines((prev) => {
          const newLines = [...prev];
          newLines[lineIndex.current] = currentLineText.substring(
            0,
            charIndex.current + 1
          );
          return newLines;
        });
        charIndex.current++;
        const typingSpeed = 15; 
        timeouts.push(setTimeout(type, typingSpeed));
      } else {
        lineIndex.current++;
        charIndex.current = 0;
        const delayBetweenLines = lineIndex.current === 2 ? 300 : 150; 
        timeouts.push(setTimeout(type, delayBetweenLines));
      }
    };

    timeouts.push(setTimeout(type, 250)); 
    return () => timeouts.forEach(clearTimeout);
  }, [isVisible, onFinished]);

  return (
    <div className="directive-wrapper">
      <div className="directive-container">
        <div className="directive-header">[ SECURE CHANNEL ESTABLISHED ]</div>
        <div className="directive-body">
          {lines.map((line, index) => (
            <p key={index}>
              <span dangerouslySetInnerHTML={{ __html: line }} />
              {!isComplete &&
                index === lineIndex.current &&
                charIndex.current < directiveLines[index]?.length && (
                  <span className="typing-cursor">_</span>
                )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Directive;