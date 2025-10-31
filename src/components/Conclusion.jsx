import React from 'react';

// --- 1. Helper function to format time (ms to MM:SS) ---
const formatTimerDisplay = (timeInMs) => {
  if (timeInMs == null || !Number.isFinite(timeInMs) || timeInMs < 0) return "00:00";
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// --- 2. Helper function to calculate rank ---
const calculateRank = (totalTimeMs, totalAttempts, puzzleCount) => {
  // Handle potential division by zero if puzzleCount is 0
  if (puzzleCount === 0) {
    return { rank: 'A-CLASS', title: 'OPERATIONAL' };
  }

  const avgTimePerPuzzle = totalTimeMs / puzzleCount;

  // S-CLASS: Flawless (0 wrong attempts) and fast
  if (totalAttempts === 0 && avgTimePerPuzzle < 45000) { // < 45s per puzzle
    return { rank: 'S-CLASS', title: 'GHOST PROTOCOL' };
  }

  // A-CLASS: Very few mistakes and good time
  if (totalAttempts <= puzzleCount / 2 && avgTimePerPuzzle < 90000) { // < 1m 30s per puzzle
    return { rank: 'A-CLASS', title: 'FIELD AGENT' };
  }
  
  // B-CLASS: Standard completion
  if (totalAttempts <= puzzleCount || avgTimePerPuzzle < 180000) { // < 3m per puzzle
    return { rank: 'B-CLASS', title: 'ANALYST' };
  }

  // C-CLASS: Sloppy or slow
  return { rank: 'C-CLASS', title: 'RECRUIT' };
};

// --- 3. Update component to use new props ---
const Conclusion = ({ message, totalTimeMs, totalAttempts, episodeCount }) => {
  
  // Get the calculated rank and title
  const { rank, title } = calculateRank(totalTimeMs, totalAttempts, episodeCount);

  return (
    <div className="conclusion-wrapper">
      <div className="conclusion-header">[ TRANSMISSION COMPLETE ]</div>
      
      {/* --- 4. Dynamic Ranked Debriefing --- */}
      <div className="conclusion-rank-debrief">
        <h3 className="rank-title">CLASSIFIED: {title}</h3>
        <p className="rank-rating">Rating: {rank}</p>
        <div className="rank-stats">
          <p><strong>Completion Time:</strong> {formatTimerDisplay(totalTimeMs)}</p>
          <p><strong>Wrong Attempts:</strong> {totalAttempts}</p>
        </div>
      </div>
      
      <p className="conclusion-message">{message}</p>
    </div>
  );
};

export default Conclusion;