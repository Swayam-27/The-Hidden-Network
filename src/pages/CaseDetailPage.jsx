import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { caseData } from "../caseData";
import Loader from "../components/Loader";
import DecryptionInterface from "../components/DecryptionInterface";
import Conclusion from "../components/Conclusion";

const ComingSoonPlaceholder = () => (
  <div className="coming-soon-placeholder">
    <p>// AUDIO DEBRIEFING PENDING //</p>
    <p>COMING SOON</p>
  </div>
);

const AudioPlayer = ({ src, caseTitle, episodeTitle }) => {
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
      <div className="custom-audio-player">
        <audio ref={audioRef} src={src} preload="metadata" />
        <div className="player-controls">
          <button className="play-pause-btn">
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"></path></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
            )}
          </button>
          <div className="player-info">
            <p className="track-title">{caseTitle.toUpperCase()}: {trackDisplayTitle}</p>
            <p className={`status-text ${isPlaying ? 'streaming' : ''}`}>STATUS: {isPlaying ? 'STREAMING...' : 'STANDBY'}</p>
          </div>
          <div className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</div>
        </div>
        <div className="progress-bar-wrapper" ref={progressBarRef} onClick={(e) => {
          e.stopPropagation();
          handleProgressChange(e);
        }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const caseInfo = caseData[caseId];
  const [isLoading, setIsLoading] = useState(true);

  const [unlockedEpisodes, setUnlockedEpisodes] = useState(() => {
    const savedProgress = sessionStorage.getItem(`progress_${caseId}`);
    return savedProgress ? JSON.parse(savedProgress) : [];
  });

  const [investigationVisible, setInvestigationVisible] = useState(false);
  const investigationRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    const savedProgress = sessionStorage.getItem(`progress_${caseId}`);
    setUnlockedEpisodes(savedProgress ? JSON.parse(savedProgress) : []);
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

  const handleDecryptionSuccess = (episodeIndex) => {
    if (!unlockedEpisodes.includes(episodeIndex)) {
      const newProgress = [...unlockedEpisodes, episodeIndex];
      setUnlockedEpisodes(newProgress);
      sessionStorage.setItem(`progress_${caseId}`, JSON.stringify(newProgress));
    }
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

  const allEpisodesUnlocked = unlockedEpisodes.length === caseInfo.episodes.length;
  const isCaseComingSoon = !caseInfo.intro.audioSrc;

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

        <div ref={investigationRef}>
          <div className="investigation-divider">
            <h2>[ BEGIN EPISODIC DEBRIEFING ]</h2>
          </div>

          {unlockedEpisodes.length === 0 && caseInfo.firstPuzzle && (
            <DecryptionInterface
              puzzle={caseInfo.firstPuzzle}
              onSuccess={() => handleDecryptionSuccess(0)}
              shouldFocus={investigationVisible}
            />
          )}

          {caseInfo.episodes.map((episode, index) => {
            const isUnlocked = unlockedEpisodes.includes(index);

            if (!isUnlocked) {
              if (index > 0) return null;
              return (
                <section key={index} className="case-episode locked">
                  <h3 className="episode-title">[ EPISODE 1 - ENCRYPTED ]</h3>
                  <div className="locked-placeholder"><p>// DATA REDACTED - AWAITING DECRYPTION KEY //</p></div>
                </section>
              );
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
                  />
                )}
              </section>
            );
          })}

          {allEpisodesUnlocked && caseInfo.conclusion && (
            <Conclusion message={caseInfo.conclusion.content} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CaseDetailPage;