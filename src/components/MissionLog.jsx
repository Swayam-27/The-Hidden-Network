import React, { useState, useEffect, useCallback } from "react";
import { caseData } from "../caseData";

const allCaseIds = Object.keys(caseData);

// === HELPER FUNCTIONS (unchanged) ===
const getRank = (attempts, puzzles, timeMs) => {
  if (timeMs === 0 || puzzles === 0)
    return { rank: "N/A", rankClass: "rank-n" };

  const avgTimeMin = timeMs / 1000 / 60 / puzzles;
  const errorPercentage = puzzles > 0 ? attempts / puzzles : 0;

  if (attempts === 0 && avgTimeMin < 1.5)
    return { rank: "S-CLASS", rankClass: "rank-s" };
  if (errorPercentage < 0.5 && avgTimeMin < 3)
    return { rank: "A-CLASS", rankClass: "rank-a" };
  if (avgTimeMin < 5) return { rank: "B-CLASS", rankClass: "rank-b" };
  return { rank: "C-CLASS", rankClass: "rank-c" };
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
        .slice(0, 4), // PR, CA, PP, STUX
      rank: "N/A",
      rankClass: "rank-n",
      attempts: "N/A",
      avgTime: "N/A",
      isPending,
      isCompleted: isCompleted,
    };

    if (isCompleted) {
      const time = parseInt(localStorage.getItem(`case_${id}_time`) || 0, 10);
      const attempts = parseInt(
        localStorage.getItem(`case_${id}_attempts`) || 0,
        10
      );
      const puzzleCount =
        caseInfo.episodes.filter((ep) => ep.puzzle).length +
        (caseInfo.firstPuzzle ? 1 : 0);
      const { rank, rankClass } = getRank(attempts, puzzleCount, time);

      stats = {
        ...stats,
        rank,
        rankClass,
        attempts,
        avgTime:
          puzzleCount > 0 ? (time / 1000 / 60 / puzzleCount).toFixed(1) : "N/A",
      };
    }
    return stats;
  });
};

const MissionLog = ({ agentName }) => {
  const [allCasesData, setAllCasesData] = useState([]);
  // State to track which case's stats are currently open/visible
  const [openCaseId, setOpenCaseId] = useState(null);

  // Load and synchronize data
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

  // Toggle function
  const handleCaseClick = (id) => {
    // If the clicked case is already open, close it. Otherwise, open it.
    setOpenCaseId(openCaseId === id ? null : id);
  };

  // Find the stats for the currently open case to display below
  const activeStats = allCasesData.find((c) => c.id === openCaseId);

  return (
    <div className="mission-log-hud">
      <div className="hud-agent-status">
        AGENT: <strong>{agentName}</strong>
      </div>

      <div className="case-log-container">
        {allCasesData.map((caseStats) => (
          <React.Fragment key={caseStats.id}>
            {/* --- 1. THE CASE BUTTON (Always Visible) --- */}
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

            {/* --- 2. THE STATS DROPDOWN (Visible on Click) --- */}
            {openCaseId === caseStats.id && (
              <div className="case-stats-dropdown">
                {caseStats.isPending ? (
                  <p className="log-status-message rank-n">
                    File in preparation. No data available.
                  </p>
                ) : caseStats.isCompleted ? (
                  // Display detailed stats for completed cases
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
                      Time Taken: <strong>{caseStats.avgTime} MIN/PZ</strong>
                    </span>
                  </>
                ) : (
                  // Display message for unsolved cases
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
