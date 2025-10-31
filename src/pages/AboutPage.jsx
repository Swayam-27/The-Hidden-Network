import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // <--- PATCH 1: Import useAuth

// ... (RevealedContent component code is unchanged) ...
const missionBriefingContent = [
    { type: 'h2', text: 'Our Purpose' },
    { type: 'p', text: "I am the sole custodian of this archive, known around here as The Cipher. I navigate the shadows of the digital world, turning confusion into clarity. This is not a collection of stories it is a collection of insight drawn from the chaos of information. The Hidden Network exists to reveal the truth behind the noise and show what is actually happening in the digital ether." },
    { type: 'h2', text: 'Signal From Noise' },
    { type: 'p', text: "The internet is vast and filled with whispers, hidden agendas, and misleading signals. Deleted files, buried reports, and erased conversations all contribute to the noise. My role is to analyze and simplify this chaos, uncovering the signal beneath it. Patterns emerge, timelines become clear, and hidden connections are revealed. The truth that lies beneath the static becomes visible for those who seek it." },
    { type: 'h2', text: 'How It Works' },
    { type: 'p', text: "I transform scattered and complex information into clear case files. Timelines are reconstructed, connections are highlighted, and the underlying story becomes visible. I do not create narratives or tell you what to think. I provide the framework to understand what really happened. The archive grows each day, a living map of what is hidden, forgotten, or deliberately obscured. If you are searching for clarity in the chaos, you have found the right place." },
];

const RevealedContent = ({ animate }) => {
    const [blocks, setBlocks] = useState(missionBriefingContent.map(b => ({ ...b, typedText: '' })));
    const blockIndexRef = useRef(0);
    const charIndexRef = useRef(0);

    useEffect(() => {
        if (!animate) return;
        let timer;
        const type = () => {
            const currentBlockIndex = blockIndexRef.current;
            if (currentBlockIndex >= missionBriefingContent.length) return;
            const currentBlock = missionBriefingContent[currentBlockIndex];
            const currentCharIndex = charIndexRef.current;
            if (currentCharIndex < currentBlock.text.length) {
                setBlocks(prev => {
                    const newBlocks = [...prev];
                    newBlocks[currentBlockIndex].typedText = currentBlock.text.substring(0, currentCharIndex + 1);
                    return newBlocks;
                });
                charIndexRef.current++;
                timer = setTimeout(type, 8); // Faster typing
            } else {
                blockIndexRef.current++;
                charIndexRef.current = 0;
                timer = setTimeout(type, 50); // Faster delay
            }
        };
        timer = setTimeout(type, 250);
        return () => clearTimeout(timer);
    }, [animate]);

    return (
        <div className="about-content">
            {animate
                ? blocks.map((block, index) => {
                    if (index > blockIndexRef.current) return null;
                    const isCurrentBlock = index === blockIndexRef.current;
                    const isTypingComplete = block.typedText.length === block.text.length;
                    const showCursor = isCurrentBlock && !isTypingComplete;

                    if (block.type === 'h2') {
                        return <h2 key={index}>{block.typedText}{showCursor && <span className="typing-cursor">_</span>}</h2>;
                    }
                    return <p key={index}>{block.typedText}{showCursor && <span className="typing-cursor">_</span>}</p>;
                  })
                : missionBriefingContent.map((block, index) => (
                    block.type === 'h2'
                        ? <h2 key={index}>{block.text}</h2>
                        : <p key={index}>{block.text}</p>
                  ))
            }
        </div>
    );
};


// --- AboutPage Component (UPDATED) ---
const AboutPage = () => {
  // VVV PATCH 2: Get state and functions from AuthContext VVV
  const { accessGranted, grantAccess } = useAuth();

  // VVV PATCH 3: Initialize state from context variable VVV
  const [step, setStep] = useState(accessGranted ? 'revealed' : 'authenticating');
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAccessAttempt = (e) => {
    e.preventDefault();
    if (inputValue.toUpperCase() === 'CIPHER') {
      setStep('success');
      setShouldAnimate(true);
      // VVV PATCH 4: Call grantAccess() from context VVV
      grantAccess(); 
    } else {
      setFeedback('// ACCESS DENIED //');
      setIsShaking(true);
      setInputValue('');
      setTimeout(() => { setIsShaking(false); setFeedback(''); }, 1000);
    }
  };

  const handleTerminalClick = () => inputRef.current?.focus();

  useEffect(() => {
      if (step === 'success') {
          const fadeTimer = setTimeout(() => setIsFading(true), 2000);
          const stepTimer = setTimeout(() => setStep('revealed'), 2500);
          return () => { clearTimeout(fadeTimer); clearTimeout(stepTimer); };
      }
  }, [step]);

  const containerClass = step === 'revealed' ? 'page-container' : 'terminal-page-container';

  return (
    <div className={containerClass}>
      <div>
        <h1 className="about-page-title">[CLASSIFIED] Mission Briefing</h1>

        {step === 'authenticating' && (
            <form id="access-terminal" className={`cursor-target ${isShaking ? 'shake' : ''}`} onSubmit={handleAccessAttempt} onClick={handleTerminalClick} noValidate>
                <div className="terminal-header">[ AUTHENTICATION REQUIRED ]</div>
                <label htmlFor="access-code-input">ENTER ACCESS CODE:</label>
                <p className="terminal-hint">HINT: The 6-letter access key is scattered and blinking in order, across the Network's entry point.</p>
                <input
                  ref={inputRef}
                  type="text"
                  id="access-code-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toUpperCase())} // Force uppercase
                  autoFocus
                  maxLength={6}
                  autoCapitalize="characters"
                  style={{ textTransform: 'uppercase' }}
                 />
                {isMobile && (
                  <button type="submit" className="decrypt-button" style={{ marginTop: '1.5rem' }}>AUTHENTICATE</button>
                )}
                <p id="access-feedback">{feedback}</p>
            </form>
        )}

        {step === 'success' && (
            <div id="access-terminal" className={`success-message ${isFading ? 'fading-out' : ''}`}>
                <div className="success-title">AUTHENTICATION SUCCESSFUL</div>
                <p className="success-subtitle">DECRYPTING BRIEFING...</p>
            </div>
        )}

        {step === 'revealed' && <RevealedContent animate={shouldAnimate} />}
      </div>
    </div>
  );
};

export default AboutPage;