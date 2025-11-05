import React, { useState, useEffect } from "react";
import CaseFolder from "../components/CaseFolder.jsx";
import { caseData } from "../caseData.js";

const allCases = Object.keys(caseData).map((key) => ({
  id: key,
  ...caseData[key],
}));

const CasesPage = ({ playHover, playClick }) => {
  const [filter, setFilter] = useState("all");
  const [completionStatus, setCompletionStatus] = useState({});

  useEffect(() => {
    const statuses = {};
    allCases.forEach((caseInfo) => {
      const isCompleted =
        localStorage.getItem(`case_${caseInfo.id}_completed`) === "true";
      statuses[caseInfo.id] = isCompleted;
    });
    setCompletionStatus(statuses);
  }, []);

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
    if (playClick) playClick();
  };

  return (
    <div className="page-container cases-page-container">
      <div className="section-header">
        <div className="header-content-wrapper">
          <h2>THE VAULT (UNLOCKED)</h2>
          <div className="filter-controls">
            <button
              onClick={() => handleFilterClick("all")}
              onMouseEnter={playHover}
              className={`cursor-target ${filter === "all" ? "active" : ""}`}
            >
              ALL
            </button>
            <button
              onClick={() => handleFilterClick("cyber-warfare")}
              onMouseEnter={playHover}
              className={`cursor-target ${
                filter === "cyber-warfare" ? "active" : ""
              }`}
            >
              CYBER WARFARE
            </button>
            <button
              onClick={() => handleFilterClick("data-privacy")}
              onMouseEnter={playHover}
              className={`cursor-target ${
                filter === "data-privacy" ? "active" : ""
              }`}
            >
              DATA & PRIVACY
            </button>
            <button
              onClick={() => handleFilterClick("financial-crime")}
              onMouseEnter={playHover}
              className={`cursor-target ${
                filter === "financial-crime" ? "active" : ""
              }`}
            >
              FINANCIAL CRIME
            </button>
          </div>
        </div>
      </div>
      <main className="case-files-container">
        {allCases.map((caseInfo) => (
          <CaseFolder
            key={caseInfo.id}
            {...caseInfo}
            isVisible={filter === "all" || filter === caseInfo.category}
            isCompleted={completionStatus[caseInfo.id] || false}
            playHover={playHover}
            playClick={playClick}
          />
        ))}
      </main>
    </div>
  );
};

export default CasesPage;
