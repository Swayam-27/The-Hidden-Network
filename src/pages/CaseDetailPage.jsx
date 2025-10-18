import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { caseData } from "../caseData";
import Loader from "../components/Loader";
import DecryptionInterface from "../components/DecryptionInterface";
import Conclusion from "../components/Conclusion"; // Import the new component

// A simple placeholder for your audio player
const AudioPlayer = ({ src }) => (
  <div className="media-embed">
    {src ? <p>[Audio Player for {src}]</p> : <p>[Audio Not Available]</p>}
  </div>
);

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

  // Check if all episodes have been unlocked
  const allEpisodesUnlocked = unlockedEpisodes.length === caseInfo.episodes.length;

  return (
    <div className="page-container">
      <main className={`case-content ${allEpisodesUnlocked ? 'case-closed' : ''}`}>
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
          <AudioPlayer src={caseInfo.intro.audioSrc} />
          <div className="episode-content">{caseInfo.intro.content}</div>
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
                  <div className="locked-placeholder">
                    <p>// DATA REDACTED - AWAITING DECRYPTION KEY //</p>
                  </div>
                </section>
              );
            }

            return (
              <section key={index} className="case-episode unlocked">
                <h3 className="episode-title">{episode.title}</h3>
                <div className="episode-content-wrapper">
                  {episode.audioSrc && <AudioPlayer src={episode.audioSrc} />}
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