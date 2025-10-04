import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import Console from '../components/Console';

// --- Preloader Component ---

const Preloader = ({ onFinished }) => {
    const [lines, setLines] = useState([]);
    const [isClosing, setIsClosing] = useState(false);
    const lineIndex = useRef(0);
    const charIndex = useRef(0);

    const preloaderLines = [
        '> Initializing connection...',
        '> Bypassing security protocols... [OK]',
        '> Decrypting archive... [██████████] 100%',
        '> ACCESS GRANTED'
    ];

    useEffect(() => {
        const timeouts = [];
        const type = () => {
            if (lineIndex.current >= preloaderLines.length) {
                timeouts.push(setTimeout(() => {
                    setIsClosing(true);
                    timeouts.push(setTimeout(onFinished, 800));
                }, 1000));
                return;
            }
            const currentLineText = preloaderLines[lineIndex.current];
            if (charIndex.current === 0) setLines(prev => [...prev, '']);
            if (charIndex.current < currentLineText.length) {
                setLines(prev => {
                    const newLines = [...prev];
                    newLines[lineIndex.current] = currentLineText.substring(0, charIndex.current + 1);
                    return newLines;
                });
                charIndex.current++;
                const typingSpeed = (lineIndex.current > 1 && lineIndex.current < 8) ? 30 : 50;
                timeouts.push(setTimeout(type, typingSpeed));
            } else {
                lineIndex.current++;
                charIndex.current = 0;
                const delayBetweenLines = (lineIndex.current > 1 && lineIndex.current < 8) ? 100 : 500;
                timeouts.push(setTimeout(type, delayBetweenLines));
            }
        };
        timeouts.push(setTimeout(type, 500));
        return () => timeouts.forEach(clearTimeout);
    }, [onFinished]);

    return (
        <div id="preloader" className={isClosing ? 'closing' : ''}>
            <div className="preloader-text">
                {lines.map((line, index) => (
                    <p key={index}>{line}{lineIndex.current === index && charIndex.current < preloaderLines[index].length && <span className="typing-cursor"></span>}</p>
                ))}
            </div>
        </div>
    );
};

// --- HomePage Component (Fix for Auto-Scroll) ---

const HomePage = ({ onLogin }) => {
    const [showPreloader, setShowPreloader] = useState(() => !sessionStorage.getItem('preloaderShown'));
    const [activeFragment, setActiveFragment] = useState(0); 
    const fragments = ['C', 'I', 'P', 'H', 'E', 'R'];

    // NEW STATE: To signal the Console when to start typing
    const [consoleVisible, setConsoleVisible] = useState(false); 
    // NEW REF: To attach to the Console section for the Intersection Observer
    const consoleRef = useRef(null); 

    // Pulsing effect logic
    useEffect(() => {
        if (showPreloader) return;
        const pulseInterval = setInterval(() => {
            setActiveFragment(prev => (prev + 1) % fragments.length);
        }, 1500);
        return () => clearInterval(pulseInterval);
    }, [showPreloader]);

    // NEW EFFECT: Intersection Observer to detect scroll
    useEffect(() => {
        // Wait until the preloader is gone and the ref is ready
        if (showPreloader || !consoleRef.current) return; 

        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the element is now visible
                if (entry.isIntersecting) {
                    setConsoleVisible(true);
                    observer.unobserve(entry.target); 
                }
            },
            {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.1, // trigger when 10% of the element is visible
            }
        );

        observer.observe(consoleRef.current);
        
        // Cleanup function
        return () => observer.disconnect();
    }, [showPreloader]); 

    // Preloader finish handler
    const handlePreloaderFinish = useCallback(() => {
        sessionStorage.setItem('preloaderShown', 'true');
        setShowPreloader(false);
    }, []);

    if (showPreloader) {
        return <Preloader onFinished={handlePreloaderFinish} />;
    }

    // Main JSX content
    return (
        <>
            <header className="hero">
                <video autoPlay muted loop playsInline id="bg-video">
                    <source src="/assets/background-video.mp4" type="video/mp4" />
                </video>
                <div className="video-overlay"></div>
                <div className="spline-background">
                    <Suspense fallback={<div className="spline-loader">Loading 3D Scene...</div>}>
                        <Spline scene="https://prod.spline.design/t6aIkI2ZVM4XbICx/scene.splinecode" />
                    </Suspense>
                </div>
                <div className="hero-subtitle">
                    <p>Investigating the world’s most covert operations.</p>
                    <p className="access-text">ACCESS GRANTED</p>
                </div>
                <div className="fragment-container">
                    {fragments.map((char, index) => (
                        <span 
                            key={char} 
                            id={`frag-${index + 1}`} 
                            className={`data-fragment ${index === activeFragment ? 'active' : ''}`}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </header>
            
            {/* WRAPPER: Attach the ref here so the Intersection Observer can track it */}
            <div ref={consoleRef}>
                {/* PASS PROP: Tell the Console component to start typing only when visible */}
                <Console onLogin={onLogin} startTyping={consoleVisible} />
            </div>
        </>
    );
};

export default HomePage;