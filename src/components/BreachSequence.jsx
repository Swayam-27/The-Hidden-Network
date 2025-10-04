import React, { useState, useEffect } from 'react';

const sequenceLines = [ // Renamed 'lines' to 'sequenceLines' for clarity
    'Bypassing main firewall...',
    'Connection rerouted through proxy [127.0.0.1]',
    'Injecting SQL... Query OK.',
    'ROOT ACCESS GRANTED.',
];

const BreachSequence = ({ onComplete }) => {
    const [currentLines, setCurrentLines] = useState([]);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        let lineIndex = 0;
        let charIndex = 0;
        const timeouts = [];

        const typeLine = () => {
            if (lineIndex >= sequenceLines.length) {
                // Sequence complete
                setIsTyping(false); 
                timeouts.push(setTimeout(onComplete, 1000));
                return;
            }

            const currentLineText = sequenceLines[lineIndex];

            // Start a new line if needed
            if (charIndex === 0) {
                setCurrentLines(prev => [...prev, '']);
            }

            if (charIndex < currentLineText.length) {
                // Type the next character
                setCurrentLines(prev => {
                    const newLines = [...prev];
                    // Append one character to the last line
                    newLines[newLines.length - 1] = currentLineText.substring(0, charIndex + 1);
                    return newLines;
                });
                charIndex++;
                timeouts.push(setTimeout(typeLine, 50)); // Typing speed
            } else {
                // Line finished, move to the next line after a short delay
                lineIndex++;
                charIndex = 0;
                timeouts.push(setTimeout(typeLine, 500)); // Delay between lines
            }
        };

        timeouts.push(setTimeout(typeLine, 100)); // Initial delay
        
        return () => timeouts.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="breach-overlay">
            <div className="breach-text">
                {currentLines.map((line, i) => (
                    <p key={i}>
                        {line}
                        {/* Cursor only appears on the very last line while still typing */}
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