import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { caseData } from "../caseData.js";
import Loader from "../components/Loader.jsx";
import DecryptionInterface from "../components/DecryptionInterface.jsx";
import Conclusion from "../components/Conclusion.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// ... (formatTimerDisplay function is unchanged) ...
const formatTimerDisplay = (timeInMs) => {
  if (timeInMs == null || !Number.isFinite(timeInMs) || timeInMs < 0) return "00:00";
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// ... (AudioPlayer component is unchanged) ...
const ComingSoonPlaceholder = () => (
  <div className="coming-soon-placeholder">
    <p>// AUDIO DEBRIEFING PENDING //</p>
    <p>COMING SOON</p>
  </div>
);

const AudioPlayer = ({ src, caseTitle, episodeTitle }) => {
  // ... (Your existing AudioPlayer code is unchanged) ...
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      if (audio) {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, [src]);

  const togglePlayPause = () => {
    if (!src) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBar.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const trackDisplayTitle = episodeTitle ? episodeTitle.toUpperCase() : "AUDIO BRIEFING";

  if (!src) {
    return <ComingSoonPlaceholder />;
  }

  return (
    <div className="custom-audio-player-wrapper cursor-target" onClick={togglePlayPause}>
      {/* ... (rest of AudioPlayer JSX is unchanged) ... */}
      <div className="custom-audio-player">
        <audio ref={audioRef} src={src} preload="metadata" />
        <div className="player-controls">
          <button className="play-pause-btn" disabled={!src}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"></path></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
            )}
          </button>
          <div className="player-info">
            <p className="track-title">{caseTitle.toUpperCase()}: {trackDisplayTitle}</p>
            <p className={`status-text ${isPlaying && src ? 'streaming' : ''}`}>STATUS: {isPlaying && src ? 'STREAMING...' : 'STANDBY'}</p>
          </div>
          <div className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</div>
        </div>
        <div className="progress-bar-wrapper" ref={progressBarRef} onClick={(e) => {
          e.stopPropagation();
          if (src) handleProgressChange(e);
        }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// --- CaseDetailPage Component (UPDATED) ---
const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { isInsider } = useAuth();
  const caseInfo = caseData[caseId];

  const [isLoading, setIsLoading] = useState(true);
  const investigationRef = useRef(null);
  const [investigationVisible, setInvestigationVisible] = useState(false);

  // --- Persistence State ---
  const [unlockedEpisodes, setUnlockedEpisodes] = useState(() => {
    const savedProgress = localStorage.getItem(`case_${caseId}_progress`);
    return savedProgress ? JSON.parse(savedProgress) : [];
  });
  
  // --- Timer & Ranking State ---
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

  // === THIS IS THE FIX ===
  const isCaseComingSoon = caseInfo ? !caseInfo.intro.audioSrc : false;
  // This variable now checks for "Coming Soon" *before* declaring all episodes unlocked
  const allEpisodesUnlocked = caseInfo ? (unlockedEpisodes.length === caseInfo.episodes.length) && !isCaseComingSoon : false;
  // ========================

  // ... (Security, Loading, and Observer effects are unchanged) ...
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

  // ... (Master Timer logic is unchanged) ...
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
  
  // ... (Pause Timer logic is unchanged) ...
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
  
  // ... (Persistence logic is unchanged, it was already fixed) ...
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
  
  // ... (handleDecryptionSuccess and handleWrongAttempt are unchanged) ...
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
  // =====================================

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
      {/* The 'allEpisodesUnlocked' variable here now correctly uses the patched logic */}
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
        
        {/* --- Sections: Intro, Overview, Timeline --- */}
        {/* ... (These sections are unchanged) ... */}
        <section className="case-section">
          <h2>Cipher's Introduction</h2>
          <AudioPlayer src={caseInfo.intro.audioSrc} caseTitle={caseInfo.title} />
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

        {/* --- Episodic Debriefing Section --- */}
        {/* ... (This section is unchanged, still passes onWrongAttempt) ... */}
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
            />
          )}
        </div>
      </main>
      
      {/* --- Floating HUD (Unchanged) --- */}
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