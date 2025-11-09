import React, { useState, useEffect, useCallback } from "react";
import { caseData } from "../caseData";

const allCaseIds = Object.keys(caseData);


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
      
      const savedRank = localStorage.getItem(`case_${id}_rank`);
      const savedRankClass = localStorage.getItem(`case_${id}_rankClass`);
      
      const puzzleCount =
        caseInfo.episodes.filter((ep) => ep.puzzle).length +
        (caseInfo.firstPuzzle ? 1 : 0);

      stats = {
        ...stats,
        rank: savedRank || "N/A",
        rankClass: savedRankClass || "rank-n",
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
                      Time Taken: <strong>{caseStats.avgTime} MIN/PZ</strong>
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