import React from 'react';

const formatTimerDisplay = (timeInMs) => {
  if (timeInMs == null || !Number.isFinite(timeInMs) || timeInMs < 0) return "00:00";
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const calculateRank = (totalTimeMs, totalAttempts, puzzleCount, totalAudioDurationMs) => {
  if (puzzleCount === 0) {
    return { rank: 'A-CLASS', title: 'OPERATIONAL' };
  }

  const solveTimeMs = Math.max(0, totalTimeMs - totalAudioDurationMs);
  const avgSolveTimeMs = solveTimeMs / puzzleCount;

  if (totalAttempts === 0 && avgSolveTimeMs < 90000) { 
    return { rank: 'S-CLASS', title: 'GHOST PROTOCOL' };
  }

  if (totalAttempts <= puzzleCount / 2 && avgSolveTimeMs < 180000) {
    return { rank: 'A-CLASS', title: 'FIELD AGENT' };
  }
  
  if (totalAttempts <= puzzleCount || avgSolveTimeMs < 300000) {
    return { rank: 'B-CLASS', title: 'ANALYST' };
  }
  
  return { rank: 'C-CLASS', title: 'RECRUIT' };
};

const Conclusion = ({ message, totalTimeMs, totalAttempts, episodeCount, totalAudioDurationMs }) => {
  
  const { rank, title } = calculateRank(totalTimeMs, totalAttempts, episodeCount, totalAudioDurationMs || 0);

  return (
    <div className="conclusion-wrapper">
      <div className="conclusion-header">[ TRANSMISSION COMPLETE ]</div>
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

export default React.memo(Conclusion);