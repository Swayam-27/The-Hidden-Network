import React, { useState, useEffect } from "react";
import { caseData } from "../caseData";

const allCaseIds = Object.keys(caseData);

// Helper function to format time (00:00)
const formatTimerDisplay = (timeInMs) => {
  if (!timeInMs || !Number.isFinite(timeInMs) || timeInMs < 0)
    return "00:00";
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const loadAllCaseData = () => {
  return allCaseIds.map((id) => {
    const caseInfo = caseData[id];
    const isCompleted = localStorage.getItem(`case_${id}_completed`) === "true";
    const isPending = caseInfo.difficulty === "In Preparation";

    let stats = {
      id,
      title: caseInfo.title,
      shortCode: id
        .split("-")
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 4),
      rank: "N/A",
      rankClass: "rank-n",
      attempts: "N/A",
      avgTimeDisplay: "N/A", 
      isPending,
      isCompleted: isCompleted,
    };

    if (isCompleted) {
      const attempts = parseInt(
        localStorage.getItem(`case_${id}_attempts`) || 0,
        10
      );

      const savedRank = localStorage.getItem(`case_${id}_rank`);
      const savedRankClass = localStorage.getItem(`case_${id}_rankClass`);

      // Load the Net Solve Time (Total Net Time)
      const netSolveTimeMs = parseInt(
        localStorage.getItem(`case_${id}_netSolveTimeMs`) || 0,
        10
      );

      const puzzleCount =
        caseInfo.episodes.filter((ep) => ep.puzzle).length +
        (caseInfo.firstPuzzle ? 1 : 0);

      let avgTimeDisplay = "N/A";
      if (puzzleCount > 0 && netSolveTimeMs > 0) {
        // Correct calculation: Total Net Time / Puzzle Count = Average Time Per Puzzle
        const avgMsPerPuzzle = netSolveTimeMs / puzzleCount; 
        avgTimeDisplay = formatTimerDisplay(avgMsPerPuzzle);
      } else if (netSolveTimeMs === 0 && puzzleCount > 0) {
        // Handles the non-zero speedrunner case
        avgTimeDisplay = "00:00";
      }

      stats = {
        ...stats,
        rank: savedRank || "N/A",
        rankClass: savedRankClass || "rank-n",
        attempts,
        avgTimeDisplay: avgTimeDisplay, 
      };
    }
    return stats;
  });
};

const MissionLog = ({ agentName }) => {
  const [allCasesData, setAllCasesData] = useState([]);
  const [openCaseId, setOpenCaseId] = useState(null);

  useEffect(() => {
    const updateLog = () => {
      setAllCasesData(loadAllCaseData());
    };

    updateLog();

    document.addEventListener("visibilitychange", updateLog);
    window.addEventListener("focus", updateLog);

    return () => {
      document.removeEventListener("visibilitychange", updateLog);
      window.removeEventListener("focus", updateLog);
    };
  }, []);

  const handleCaseClick = (id) => {
    setOpenCaseId(openCaseId === id ? null : id);
  };

  return (
    <div className="mission-log-hud"> 
      <div className="hud-agent-status">
        AGENT: <strong>{agentName}</strong>
      </div>

      <div className="case-log-container">
        {allCasesData.map((caseStats) => (
          <React.Fragment key={caseStats.id}>
            <div
              className={`case-log-item cursor-target ${
                openCaseId === caseStats.id ? "active" : ""
              } ${caseStats.isCompleted ? "completed" : ""}`}
              onClick={() => handleCaseClick(caseStats.id)}
            >
              {caseStats.title} ({caseStats.rank})
              <span className="case-log-indicator">
                {caseStats.isPending ? "FILE" : "▼"}
              </span>
            </div>
            {openCaseId === caseStats.id && (
              <div className="case-stats-dropdown">
                {caseStats.isPending ? (
                  <p className="log-status-message rank-n">
                    File in preparation. No data available.
                  </p>
                ) : caseStats.isCompleted ? (
                  <>
                    <span className="log-stat-line">
                      Rank:{" "}
                      <strong className={caseStats.rankClass}>
                        {caseStats.rank}
                      </strong>
                    </span>
                    <span className="log-stat-line">
                      Errors:{" "}
                      <strong
                        className={
                          caseStats.attempts === 0 ? "rank-s" : "rank-c"
                        }
                      >
                        {caseStats.attempts}
                      </strong>
                    </span>
                    <span className="log-stat-line">
                      Avg. Solve Time:{" "}
                      <strong>{caseStats.avgTimeDisplay}</strong>
                    </span>
                  </>
                ) : (
                  <p className="log-status-message rank-n">
                    Case unsolved. No metrics recorded.
                  </p>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MissionLog;