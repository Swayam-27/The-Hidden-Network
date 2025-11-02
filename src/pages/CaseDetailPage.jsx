import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { caseData } from "../caseData";
import Loader from "../components/Loader";
import AudioPlayer from "../components/AudioPlayer";
import DecryptionInterface from "../components/DecryptionInterface";
import Conclusion from "../components/Conclusion";
import { useAuth } from "../context/AuthContext";

const formatTimerDisplay = (timeInMs) => {
  if (timeInMs == null || !Number.isFinite(timeInMs) || timeInMs < 0) return "00:00";
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { isInsider } = useAuth();
  const caseInfo = caseData[caseId];

  const [isLoading, setIsLoading] = useState(true);
  const investigationRef = useRef(null);
  const [investigationVisible, setInvestigationVisible] = useState(false);

  const [unlockedEpisodes, setUnlockedEpisodes] = useState(() => {
    const savedProgress = localStorage.getItem(`case_${caseId}_progress`);
    return savedProgress ? JSON.parse(savedProgress) : [];
  });
  
  const [completionTimeMs, setCompletionTimeMs] = useState(() => {
    const savedTime = localStorage.getItem(`case_${caseId}_time`);
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [totalAttempts, setTotalAttempts] = useState(() => {
    const savedAttempts = localStorage.getItem(`case_${caseId}_attempts`);
    return savedAttempts ? parseInt(savedAttempts, 10) : 0;
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);
  const intervalRef = useRef(null);

  const isCaseComingSoon = caseInfo ? !caseInfo.intro.audioSrc : false;
  const allEpisodesUnlocked = caseInfo ? (unlockedEpisodes.length === caseInfo.episodes.length) && !isCaseComingSoon : false;

  useEffect(() => {
    if (!isInsider) {
      navigate('/');
    }
    if (!caseInfo) {
      navigate('/cases');
    }
  }, [isInsider, caseInfo, navigate]);

  useEffect(() => {
    setIsLoading(true);
    setInvestigationVisible(false);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [caseId]);

  useEffect(() => {
    if (isLoading || !investigationRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInvestigationVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(investigationRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    if (!isInsider || !caseInfo || allEpisodesUnlocked) {
      setIsTimerRunning(false);
      return;
    }
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    
    if (isTimerRunning) {
      const startTime = Date.now() - completionTimeMs;
      intervalRef.current = setInterval(() => {
        setCompletionTimeMs(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning, isInsider, caseInfo, allEpisodesUnlocked, completionTimeMs]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if(isTimerRunning) setIsTimerRunning(false);
      } else {
        if(!allEpisodesUnlocked) setIsTimerRunning(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTimerRunning, allEpisodesUnlocked]);
  
  useEffect(() => {
    localStorage.setItem(`case_${caseId}_progress`, JSON.stringify(unlockedEpisodes));
    localStorage.setItem(`case_${caseId}_attempts`, totalAttempts.toString());

    if (allEpisodesUnlocked && !isCaseComingSoon) {
      if (isTimerRunning) {
          setIsTimerRunning(false); 
      }
      setShowConclusion(true);   
      if (!localStorage.getItem(`case_${caseId}_completed`)) {
        localStorage.setItem(`case_${caseId}_completed`, 'true');
        localStorage.setItem(`case_${caseId}_time`, completionTimeMs.toString());
      }
    } else if (completionTimeMs > 0 && isTimerRunning) {
      localStorage.setItem(`case_${caseId}_time`, completionTimeMs.toString());
    }
  }, [unlockedEpisodes, totalAttempts, allEpisodesUnlocked, caseId, completionTimeMs, isTimerRunning, isCaseComingSoon]);
  
  useEffect(() => {
    const handleFocusIn = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        document.body.classList.add('is-typing');
      }
    };
    const handleFocusOut = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        document.body.classList.remove('is-typing');
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      document.body.classList.remove('is-typing');
    };
  }, []);
  
  const handleDecryptionSuccess = (episodeIndex) => {
    if (!caseInfo || !caseInfo.episodes) return;
    if (!unlockedEpisodes.includes(episodeIndex)) {
      const newProgress = [...unlockedEpisodes, episodeIndex];
      setUnlockedEpisodes(newProgress);
    }
  };
  
  const handleWrongAttempt = () => {
    setTotalAttempts(prev => prev + 1);
  };

  if (isLoading) return <Loader />;
  if (!caseInfo) {
    return (
      <div className="page-container">
        <main className="case-content">
          <h2>Case Not Found</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className={`case-content ${allEpisodesUnlocked ? 'case-closed' : ''} ${isCaseComingSoon ? 'coming-soon-blur' : ''}`}>
        
        {isCaseComingSoon && (
          <div className="full-page-coming-soon-overlay">
            <h2>// FILE IN PREPARATION //</h2>
            <p>This case file is currently being compiled and encrypted. Full debriefing coming soon.</p>
          </div>
        )}

        <div className="case-closed-stamp">[ CASE CLOSED ]</div>
        
        <nav className="case-nav">
          <Link to="/cases">&larr; Return to Archives</Link>
        </nav>

        <header className="case-header">
          <div>
            <h1>Case File: {caseInfo.title}</h1>
            <span className="case-meta">{caseInfo.meta}</span>
          </div>
          <img
            src={caseInfo.imgSrc}
            alt={`${caseInfo.title} stamp`}
            className="stamp"
          />
        </header>
        
        <section className="case-section">
          <h2>Cipher's Introduction</h2>
          <AudioPlayer src={caseInfo.intro.audioSrc} caseTitle={caseInfo.title} episodeTitle="Cipher's Introduction" />
          {caseInfo.intro.content && <div className="episode-content">{caseInfo.intro.content}</div>}
        </section>
        <section className="case-section">
          <h2>Case Overview</h2>
          {caseInfo.overview}
        </section>
        <section className="case-section">
          <div className="timeline">
            <h2>Key Events Timeline</h2>
            {caseInfo.timeline}
          </div>
        </section>

        <div ref={investigationRef}>
          <div className="investigation-divider">
            <h2>[ BEGIN EPISODIC DEBRIEFING ]</h2>
          </div>

          {unlockedEpisodes.length === 0 && caseInfo.firstPuzzle && (
            <DecryptionInterface
              puzzle={caseInfo.firstPuzzle}
              onSuccess={() => handleDecryptionSuccess(0)}
              shouldFocus={investigationVisible}
              onWrongAttempt={handleWrongAttempt}
            />
          )}

          {caseInfo.episodes.map((episode, index) => {
            const isUnlocked = unlockedEpisodes.includes(index);
            if (!isUnlocked) {
              if (index === 0 || unlockedEpisodes.includes(index - 1)) {
                 return (
                  <section key={index} className="case-episode locked">
                    <h3 className="episode-title">[ EPISODE {index + 1} - ENCRYPTED ]</h3>
                    <div className="locked-placeholder"><p>// DATA REDACTED - AWAITING DECRYPTION KEY //</p></div>
                  </section>
                );
              }
              return null;
            }

            return (
              <section key={index} className="case-episode unlocked">
                <h3 className="episode-title">{episode.title}</h3>
                <div className="episode-content-wrapper">
                  <AudioPlayer src={episode.audioSrc} caseTitle={caseInfo.title} episodeTitle={episode.title} />
                  <div className="episode-content">{episode.content}</div>
                </div>

                {episode.puzzle && !unlockedEpisodes.includes(index + 1) && (
                  <DecryptionInterface
                    puzzle={episode.puzzle}
                    onSuccess={() => handleDecryptionSuccess(index + 1)}
                    shouldFocus={true}
                    onWrongAttempt={handleWrongAttempt}
                  />
                )}
              </section>
            );
          })}

          {showConclusion && caseInfo.conclusion && (
            <Conclusion
                message={caseInfo.conclusion.content}
                totalTimeMs={completionTimeMs}
                totalAttempts={totalAttempts}
                episodeCount={caseInfo.episodes.filter(ep => ep.puzzle).length + (caseInfo.firstPuzzle ? 1 : 0)}
                totalAudioDurationMs={caseInfo.totalAudioDurationMs} 
            />
          )}
        </div>
      </main>
      
      {!allEpisodesUnlocked && !isCaseComingSoon && (
        <div className="mission-timer-hud">
          <div className="hud-timer">
            <span className="hud-label">TIME:</span>
            <span className="hud-time-value">{formatTimerDisplay(completionTimeMs)}</span>
          </div>
          <div className="hud-message">
            <p><strong>// OPERATIONAL NOTE //</strong></p>
            <p>Cipher is tracking your performance. Efficiency is paramount. Only the precise achieve 'S-CLASS' status. The sloppy are... archived.</p>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CaseDetailPage;