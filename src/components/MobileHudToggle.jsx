import React, { useState, useEffect } from "react";
import MissionLog from "./MissionLog";
import LeaderboardHUD from "./LeaderboardHUD";
import { useLocation } from "react-router-dom";
import { formatTimerDisplay } from "../utils/helpers";

const BookOpenIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ClockIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrophyIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CloseIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MobileHudToggle = ({
  agentName,
  isCaseActive,
  caseId,
  caseTitle,
  totalTimeMs,
  totalAttempts,
  submissionStatus,
  puzzlesSolved,    
  totalPuzzles     
}) => {
  const location = useLocation();
  const [openHud, setOpenHud] = useState(null);

  const toggleHud = (hudName) => {
    setOpenHud(openHud === hudName ? null : hudName);
  };

  useEffect(() => {
    setOpenHud(null);
  }, [location.pathname]);

  // Handle body scroll lock
  useEffect(() => {
    if (openHud) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [openHud]);

  const onCaseDetailPage = location.pathname.startsWith('/case/');

  const renderCurrentHud = () => {
    if (!openHud) return null;

    let title = "";
    let content = null;

    switch (openHud) {
      case 'log':
        title = "MISSION LOG";
        content = <MissionLog agentName={agentName} />;
        break;

      case 'timer':
        title = "OPERATIONAL TIMER";
        const formattedTime = formatTimerDisplay(totalTimeMs);
        
        content = (
          <div className="mobile-hud-timer-content">
            <div className="hud-stat-row">
              <span className="hud-stat-label">TIME:</span>
              <span className="hud-stat-value stat-ok">{formattedTime}</span>
            </div>
            
            <div className="hud-stat-row">
              <span className="hud-stat-label">ERRORS:</span>
              <span className={`hud-stat-value ${totalAttempts > 0 ? 'stat-error' : 'stat-ok'}`}>
                {totalAttempts}
              </span>
            </div>
            
            <div className="hud-stat-row">
              <span className="hud-stat-label">PUZZLES SOLVED:</span>
              <span className="hud-stat-value stat-ok">
                {puzzlesSolved || 0} / {totalPuzzles || 0}
              </span>
            </div>
            
            {submissionStatus && (
              <div className="operational-note">
                {submissionStatus}
              </div>
            )}
          </div>
        );
        break;

      case 'leaderboard':
        title = `GLOBAL BEST [${caseTitle?.toUpperCase() || 'LOADING'}]`;
        content = <LeaderboardHUD caseId={caseId} />;
        break;

      default:
        return null;
    }

    return (
      <div className="mobile-hud-overlay">
        <div className="mobile-hud-panel">
          <div className="mobile-hud-header">
            <span className="mobile-hud-title">{title}</span>
            <button 
              className="mobile-hud-close" 
              onClick={() => setOpenHud(null)}
              aria-label="Close"
            >
              <CloseIcon width={24} height={24} />
            </button>
          </div>
          <div className="mobile-hud-content">
            {content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderCurrentHud()}

      <div className="mobile-hud-toggle-buttons">
        <button
          className={`hud-toggle-btn ${openHud === 'log' ? 'active' : ''}`}
          onClick={() => toggleHud('log')}
          aria-label="Mission Log"
        >
          <BookOpenIcon width={20} height={20} />
        </button>

        {onCaseDetailPage && isCaseActive && (
          <button
            className={`hud-toggle-btn ${openHud === 'timer' ? 'active' : ''}`}
            onClick={() => toggleHud('timer')}
            aria-label="Timer"
          >
            <ClockIcon width={20} height={20} />
          </button>
        )}

        {onCaseDetailPage && caseId && (
          <button
            className={`hud-toggle-btn ${openHud === 'leaderboard' ? 'active' : ''}`}
            onClick={() => toggleHud('leaderboard')}
            aria-label="Leaderboard"
          >
            <TrophyIcon width={20} height={20} />
          </button>
        )}
      </div>
    </>
  );
};

export default MobileHudToggle;