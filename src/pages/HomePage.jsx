import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  useCallback,
} from "react";
import Spline from "@splinetool/react-spline";
import Console from "../components/Console.jsx";
import Directive from "../components/Directive.jsx";

// --- Preloader Component (with faster typing) ---
const Preloader = ({ onFinished }) => {
  const [lines, setLines] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const lineIndex = useRef(0);
  const charIndex = useRef(0);
  const preloaderLines = [
    "> Initializing connection...",
    "> Bypassing security protocols... [OK]",
    "> Decrypting archive... [██████████] 100%",
    "> ACCESS GRANTED",
  ];

  useEffect(() => {
    const timeouts = [];
    const type = () => {
      if (lineIndex.current >= preloaderLines.length) {
        timeouts.push(
          setTimeout(() => {
            setIsClosing(true);
            timeouts.push(setTimeout(onFinished, 800));
          }, 500) // Shorter pause at the end
        );
        return;
      }
      const currentLineText = preloaderLines[lineIndex.current];
      if (charIndex.current === 0) setLines((prev) => [...prev, ""]);
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
        const typingSpeed = 25; // Faster typing
        timeouts.push(setTimeout(type, typingSpeed));
      } else {
        lineIndex.current++;
        charIndex.current = 0;
        const delayBetweenLines = 150; // Faster delay
        timeouts.push(setTimeout(type, delayBetweenLines));
      }
    };
    timeouts.push(setTimeout(type, 250));
    return () => timeouts.forEach(clearTimeout);
  }, [onFinished]);

  return (
    <div id="preloader" className={isClosing ? "closing" : ""}>
      <div className="preloader-text">
        {lines.map((line, index) => (
          <p key={index}>
            {line}
            {lineIndex.current === index &&
              charIndex.current < preloaderLines[index].length && (
                <span className="typing-cursor"></span>
              )}
          </p>
        ))}
      </div>
    </div>
  );
};

// --- HomePage Component (UPDATED with the fix) ---
const HomePage = ({ onLogin }) => {
  const [showPreloader, setShowPreloader] = useState(
    () => !sessionStorage.getItem("preloaderShown")
  );
  const [activeFragment, setActiveFragment] = useState(0);
  const fragments = ["C", "I", "P", "H", "E", "R"];

  const [directiveVisible, setDirectiveVisible] = useState(false);
  const [directiveFinished, setDirectiveFinished] = useState(false);
  const directiveRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    if (showPreloader) return;
    const pulseInterval = setInterval(() => {
      setActiveFragment((prev) => (prev + 1) % fragments.length);
    }, 1500);
    return () => clearInterval(pulseInterval);
  }, [showPreloader]);

  useEffect(() => {
    if (showPreloader) return;
    const timer = setTimeout(() => {
      setShowScrollIndicator(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [showPreloader]);

  useEffect(() => {
    if (showPreloader || !directiveRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDirectiveVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(directiveRef.current);
    return () => observer.disconnect();
  }, [showPreloader]);

  const handlePreloaderFinish = useCallback(() => {
    sessionStorage.setItem("preloaderShown", "true");
    setShowPreloader(false);
  }, []);

  // === NEW: Logic for Mobile Background ===
  // This code runs in the component, bypassing the CSS build error.
  const isMobile = window.innerWidth <= 768;
  const heroStyle = isMobile ? {
    backgroundImage: `linear-gradient(rgba(5, 6, 8, 0.9), rgba(5, 6, 8, 0.9)), url(/assets/static-background.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  } : {};
  // ======================================

  if (showPreloader) {
    return <Preloader onFinished={handlePreloaderFinish} />;
  }

  return (
    <>
      {/* Apply the inline style here */}
      <header className="hero" style={heroStyle}>
        <video autoPlay muted loop playsInline id="bg-video">
          <source src="/assets/background-video.mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="spline-background">
          <Suspense
            fallback={<div className="spline-loader">Loading 3D Scene...</div>}
          >
            <Spline scene="https://prod.spline.design/t6aIkI2ZVM4XbICx/scene.splinecode" />
          </Suspense>
        </div>

        {/* This is the new PNG logo for mobile */}
        <img 
          src="/assets/logo-mobile.png" 
          alt="The Hidden Network" 
          className="hero-logo-mobile" 
        />

        <div className="hero-subtitle">
          <p>Investigating the world’s most covert operations.</p>
          <p className="access-text">ACCESS GRANTED</p>
        </div>
        <div className="fragment-container">
          {fragments.map((char, index) => (
            <span
              key={char}
              id={`frag-${index + 1}`}
              className={`data-fragment ${
                index === activeFragment ? "active" : ""
              }`}
            >
              {char}
            </span>
          ))}
        </div>

        {showScrollIndicator && (
          <div className="scroll-prompt-container">
            <span className="scroll-text">SCROLL DOWN</span>
            <div className="scroll-arrow"></div>
          </div>
        )}
      </header>

      <div ref={directiveRef}>
        <Directive
          isVisible={directiveVisible}
          onFinished={() => setDirectiveFinished(true)}
        />
        <Console
          onLogin={onLogin}
          startTyping={directiveFinished}
        />
      </div>
    </>
  );
};

export default HomePage;
