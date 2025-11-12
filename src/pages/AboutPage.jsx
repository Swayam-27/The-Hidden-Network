import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const missionBriefingContent = [
  { type: 'h2', text: 'Our Purpose' },
  {
    type: 'p',
    text: 'I am the sole custodian of this archive, known around here as The Cipher. I navigate the shadows of the digital world, turning confusion into clarity. This is not a collection of stories it is a collection of insight drawn from the chaos of information. The Hidden Network exists to reveal the truth behind the noise and show what is actually happening in the digital ether.',
  },
  { type: 'h2', text: 'Signal From Noise' },
  {
    type: 'p',
    text: 'The internet is vast and filled with whispers, hidden agendas, and misleading signals. Deleted files, buried reports, and erased conversations all contribute to the noise. My role is to analyze and simplify this chaos, uncovering the signal beneath it. Patterns emerge, timelines become clear, and hidden connections are revealed. The truth that lies beneath the static becomes visible for those who seek it.',
  },
  { type: 'h2', text: 'How It Works' },
  {
    type: 'p',
    text: 'I transform scattered and complex information into clear case files. Timelines are reconstructed, connections are highlighted, and the underlying story becomes visible. I do not create narratives or tell you what to think. I provide the framework to understand what really happened. The archive grows each day, a living map of what is hidden, forgotten, or deliberately obscured. If you are searching for clarity in the chaos, you have found the right place.',
  },
  { type: 'h2', text: 'Performance Rankings' },
  {
    type: 'p',
    text: 'All field operations within this archive are monitored in real-time. Agent performance is classified through precision metrics—tracking failed decryption attempts—and temporal efficiency measurements via embedded case timers. Upon completing all episodes within a case file, your operational rating is calculated and archived. The classification system separates elite operatives from standard analysts.',
  },
  { type: 'table' },
  { type: 'h2', text: 'Declassify Creator' },
];

const RevealedContent = ({ animate, onFinished, playTypingLoop, stopTypingLoop }) => {
  const [blocks, setBlocks] = useState(
    missionBriefingContent.map((b) => ({ ...b, typedText: '' }))
  );
  const blockIndexRef = useRef(0);
  const charIndexRef = useRef(0);

  useEffect(() => {
    if (!animate) {
      onFinished();
      return;
    }

    if (playTypingLoop) playTypingLoop();
    let timer;
    const type = () => {
      const currentBlockIndex = blockIndexRef.current;
      if (currentBlockIndex >= missionBriefingContent.length) {
        if (stopTypingLoop) stopTypingLoop();
        onFinished();
        return;
      }
      const currentBlock = missionBriefingContent[currentBlockIndex];

      if (currentBlock.type === 'table') {
        blockIndexRef.current++;
        timer = setTimeout(type, 50);
      } else {
        const currentCharIndex = charIndexRef.current;
        if (currentCharIndex < currentBlock.text.length) {
          setBlocks((prev) => {
            const newBlocks = [...prev];
            newBlocks[currentBlockIndex].typedText = currentBlock.text.substring(
              0,
              currentCharIndex + 1
            );
            return newBlocks;
          });
          charIndexRef.current++;
          timer = setTimeout(type, 1);
        } else {
          blockIndexRef.current++;
          charIndexRef.current = 0;
          timer = setTimeout(type, 10);
        }
      }
    };
    timer = setTimeout(type, 100);
    return () => {
      clearTimeout(timer);
      if (stopTypingLoop) stopTypingLoop();
    };
  }, [animate, onFinished, playTypingLoop, stopTypingLoop]);

  return (
    <div className="about-content">
      {animate
        ? blocks.map((block, index) => {
            if (index > blockIndexRef.current) return null;

            const isCurrentBlock = index === blockIndexRef.current;
            const isTypingComplete = block.typedText
              ? block.typedText.length === block.text.length
              : false;
            const showCursor =
              isCurrentBlock && !isTypingComplete && block.type !== 'table';

            if (block.type === 'h2') {
              return (
                <h2 key={index} className="about-content-subtitle">
                  {block.typedText}
                  {showCursor && <span className="typing-cursor">_</span>}
                </h2>
              );
            }
            if (block.type === 'p') {
              return (
                <p key={index} className="about-content-text">
                  {block.typedText}
                  {showCursor && <span className="typing-cursor">_</span>}
                </p>
              );
            }
            if (block.type === 'table') {
              return (
                <table className="ranking-table is-typing" key={index}>
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>TITLE</th>
                      <th>REQUIREMENTS (PER PUZZLE)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="RANK" className="rank-s">
                        S-CLASS
                      </td>
                      <td data-label="TITLE">GHOST PROTOCOL</td>
                      <td data-label="REQS">
                        Flawless precision (0 wrong attempts) & Elite speed (&lt;
                        1.5 min avg).
                      </td>
                    </tr>
                    <tr>
                      <td data-label="RANK" className="rank-a">
                        A-CLASS
                      </td>
                      <td data-label="TITLE">FIELD AGENT</td>
                      <td data-label="REQS">
                        High precision (&lt; 50% attempts) & Fast pace (&lt; 3
                        min avg).
                      </td>
                    </tr>
                    <tr>
                      <td data-label="RANK" className="rank-b">
                        B-CLASS
                      </td>
                      <td data-label="TITLE">ANALYST</td>
                      <td data-label="REQS">
                        Standard completion (&lt; 5 min avg).
                      </td>
                    </tr>
                    <tr>
                      <td data-label="RANK" className="rank-c">
                        C-CLASS
                      </td>
                      <td data-label="TITLE">RECRUIT</td>
                      <td data-label="REQS">
                        Sloppy or slow. Performance archived.
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            }
            return null;
          })
        : missionBriefingContent.map((block, index) => {
            if (block.type === 'h2') {
              return (
                <h2 key={index} className="about-content-subtitle">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'p') {
              return (
                <p key={index} className="about-content-text">
                  {block.text}
                </p>
              );
            }
            if (block.type === 'table') {
              return (
                <table className="ranking-table" key={index}>
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>TITLE</th>
                      <th>REQUIREMENTS (PER PUZZLE)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="RANK" className="rank-s">
                        S-CLASS
                      </td>
                      <td data-label="TITLE">GHOST PROTOCOL</td>
                      <td data-label="REQS">
                        Flawless precision (0 wrong attempts) & Elite speed (&lt;
                        1.5 min avg).
                      </td>
                    </tr>
                    <tr>
                      <td data-label="RANK" className="rank-a">
                        A-CLASS
                      </td>
                      <td data-label="TITLE">FIELD AGENT</td>
                      <td data-label="REQS">
                        High precision (&lt; 50% attempts) & Fast pace (&lt; 3
                        min avg).
                      </td>
                    </tr>
                    <tr>
                      <td data-label="RANK" className="rank-b">
                        B-CLASS
                      </td>
                      <td data-label="TITLE">ANALYST</td>
                      <td data-label="REQS">
                        Standard completion (&lt; 5 min avg).
                      </td>
                    </tr>
                    <tr>
                      <td data-label="RANK" className="rank-c">
                        C-CLASS
                      </td>
                      <td data-label="TITLE">RECRUIT</td>
                      <td data-label="REQS">
                        Sloppy or slow. Performance archived.
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            }
            return null;
          })}
    </div>
  );
};

const AboutPage = ({
  playHover,
  playClick,
  playKeypress,
  playEnter,
  playTypingLoop,
  stopTypingLoop,
}) => {
  const { accessGranted, grantAccess } = useAuth();

  const PROFESSOR_PASSWORD = 'SWAYAM87';
  const PASSWORD_VERSION = 'v1';

  const [step, setStep] = useState(
    accessGranted ? 'revealed_briefing' : 'authenticating'
  );
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isTypingFinished, setIsTypingFinished] = useState(accessGranted);

  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);

  const [isFinalRevealed, setIsFinalRevealed] = useState(() => {
    const saved = localStorage.getItem('creatorDeclassified');
    const version = localStorage.getItem('creatorPasswordVersion');
    return saved === 'true' && version === PASSWORD_VERSION;
  });

  const [finalInputValue, setFinalInputValue] = useState('');
  const [finalFeedback, setFinalFeedback] = useState('');
  const [isFinalShaking, setIsFinalShaking] = useState(false);
  const finalInputRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAccessAttempt = (e) => {
    e.preventDefault();
    if (playEnter) playEnter();
    if (inputValue.toUpperCase() === 'CIPHER') {
      setStep('success');
      setShouldAnimate(true);
      grantAccess();
    } else {
      setFeedback('ACCESS DENIED');
      setIsShaking(true);
      setInputValue('');
      setTimeout(() => {
        setIsShaking(false);
        setFeedback('');
      }, 1000);
    }
  };

  const handleFinalAccessAttempt = (e) => {
    e.preventDefault();
    if (playEnter) playEnter();

    if (finalInputValue === PROFESSOR_PASSWORD) {
      setIsFinalRevealed(true);
      localStorage.setItem('creatorDeclassified', 'true');
      localStorage.setItem('creatorPasswordVersion', PASSWORD_VERSION);
      setFinalFeedback('IDENTITY DECLASSIFIED');
    } else {
      setFinalFeedback('INCORRECT PROTOCOL');
      setIsFinalShaking(true);
      setFinalInputValue('');
      setTimeout(() => {
        setIsFinalShaking(false);
        setFinalFeedback('');
      }, 1000);
    }
  };

  const handleTerminalClick = () => inputRef.current?.focus();
  const handleFinalTerminalClick = () => finalInputRef.current?.focus();

  useEffect(() => {
    if (step === 'success') {
      const stepTimer = setTimeout(() => setStep('revealed_briefing'), 2500);
      return () => {
        clearTimeout(stepTimer);
      };
    }
  }, [step]);

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' && playKeypress) {
      playKeypress();
    }
  };

  const containerClass =
    step === 'authenticating' || step === 'success'
      ? 'terminal-page-container'
      : 'page-container';

  return (
    <div className={containerClass}>
      <div>
        <h1 className="about-page-title">[CLASSIFIED] Mission Briefing</h1>

        {step === 'authenticating' && (
          <form
            id="access-terminal"
            className={`cursor-target ${isShaking ? 'shake' : ''}`}
            onSubmit={handleAccessAttempt}
            onClick={handleTerminalClick}
            noValidate
          >
            <div className="terminal-header">[ AUTHENTICATION REQUIRED ]</div>
            <label htmlFor="access-code-input">ENTER ACCESS CODE:</label>
            <p className="terminal-hint">
              HINT: The 6-letter access key is scattered and blinking in order,
              across the Network's entry point.
            </p>
            <input
              ref={inputRef}
              type="text"
              id="access-code-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={6}
              autoCapitalize="characters"
              style={{ textTransform: 'uppercase' }}
            />
            {isMobile && (
              <button
                type="submit"
                className="decrypt-button cursor-target"
                style={{ marginTop: '1.5rem' }}
                onMouseEnter={playHover}
                onClick={playClick}
              >
                AUTHENTICATE
              </button>
            )}
            <p id="access-feedback">{feedback}</p>
          </form>
        )}

        {step === 'success' && (
          <div
            id="access-terminal"
            className={`success-message ${
              step === 'revealed_briefing' ? 'fading-out' : ''
            }`}
          >
            <div className="success-title">AUTHENTICATION SUCCESSFUL</div>
            <p className="success-subtitle">DECRYPTING BRIEFING...</p>
          </div>
        )}

        {step === 'revealed_briefing' && (
          <div className="about-page-revealed-wrapper">
            <RevealedContent
              animate={shouldAnimate}
              onFinished={() => setIsTypingFinished(true)}
              playTypingLoop={playTypingLoop}
              stopTypingLoop={stopTypingLoop}
            />

            <div
              className={`final-reveal-section ${
                isTypingFinished ? 'is-visible' : ''
              }`}
            >
              {!isFinalRevealed ? (
                <form
                  id="final-access-terminal"
                  className={`cursor-target ${isFinalShaking ? 'shake' : ''}`}
                  onSubmit={handleFinalAccessAttempt}
                  onClick={handleFinalTerminalClick}
                  noValidate
                >
                  <div className="terminal-header">
                    [ FINAL VALIDATION REQUIRED ]
                  </div>
                  <label htmlFor="final-access-code-input">
                    ENTER THESIS PROTOCOL:
                  </label>
                  <p className="terminal-hint">
                    This protocol is provided externally to the Professor.
                  </p>
                  <input
                    ref={finalInputRef}
                    type="password"
                    id="final-access-code-input"
                    value={finalInputValue}
                    onChange={(e) => setFinalInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  {isMobile && (
                    <button
                      type="submit"
                      className="decrypt-button cursor-target"
                      style={{ marginTop: '1.5rem' }}
                      onMouseEnter={playHover}
                      onClick={playClick}
                    >
                      DECLASSIFY
                    </button>
                  )}
                  <p id="access-feedback">{finalFeedback}</p>
                </form>
              ) : (
                <div className="about-content" style={{ marginTop: '2rem' }}>
                  <p
                    className="about-content-text"
                    style={{
                      textAlign: 'center',
                      color: 'var(--secondary-red)',
                      marginBottom: '1rem',
                      textShadow: '0 0 10px var(--glow-color-red)',
                    }}
                  >
                    SECURITY OVERRIDE DETECTED
                  </p>
                  <p
                    className="about-content-text"
                    style={{
                      textAlign: 'center',
                      marginBottom: '0.5rem',
                      opacity: '0.8',
                    }}
                  >
                    REAL WORLD IDENTITY:
                  </p>
                  <h2
                    className="about-content-subtitle"
                    style={{
                      textAlign: 'center',
                      fontSize: '2.5rem',
                      marginTop: '0.5rem',
                      marginBottom: '2rem',
                      borderBottom: 'none',
                      color: '#FFD700',
                      textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                    }}
                  >
                    SWAYAM PRAJAPATI
                  </h2>

                  <div
                    style={{
                      borderTop: '1px dashed var(--accent-color-faded)',
                      paddingTop: '1.5rem',
                      marginTop: '1.5rem',
                    }}
                  >
                    <p className="about-content-text">
                      <strong>ACADEMIC CONTEXT:</strong> Government Secrecy and
                      Intelligence Course
                    </p>
                    <p className="about-content-text">
                      <strong>INSTITUTION:</strong> Ahmedabad University
                    </p>
                    <p className="about-content-text">
                      <strong>PROJECT TYPE:</strong> Interactive Case Study
                    </p>
                    <p className="about-content-text">
                      <strong>BUILT WITH:</strong> React.js, GSAP, Custom CSS, Supabase, Netlify Functions, LocalStorage API
                    </p>
                    <p className="about-content-text">
                      <strong>ACADEMIC YEAR:</strong> 2024-2028
                    </p>

                    <p
                      className="about-content-text"
                      style={{
                        marginTop: '1.5rem',
                        fontStyle: 'italic',
                        opacity: '0.85',
                        borderTop: '1px dashed rgba(57, 255, 20, 0.3)',
                        paddingTop: '1rem',
                      }}
                    >
                      "The Hidden Network", a website built to keep you engaged, making the user understand covert operations better using narrative interactivity to simulate real intelligence work.
                      <br /><br />
                      The idea came from a simple problem: understanding covert operations for roundtable talk, meant jumping between papers, each telling only fragments of the story. I wanted to build something that connected everything, a space where you could learn the operation from start to finish, through experience.
                      <br /><br />
                      What started as a research and explanation based through audio briefing website quickly transformed into something much larger. One idea kept leading to another the puzzles, the console, the audio, the HUD, the leaderboard until the system felt immersive and unique. Every feature was created and added to preserve immersion: the custom cursor, the audio player, the whole "CIPHER" persona  and the terminal interface all custom designed to keep you inside the environment, not just on a website.
                      <br /><br />
                      This project is the result of constant iteration and imagination. And it's still evolving, I plan to expand it with new cases, puzzle types, and more complex backend systems. But no matter how advanced it becomes, its purpose will always remain the same: to make learning about secrecy and intelligence feel like discovery, not theory.
                      <br /><br />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
