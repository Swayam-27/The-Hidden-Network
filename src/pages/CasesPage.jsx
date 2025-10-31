import React, { useState, useEffect } from 'react'; // <--- 1. Import useEffect
import CaseFolder from '../components/CaseFolder.jsx';
import { caseData } from '../caseData.js';

const allCases = Object.keys(caseData).map(key => ({ id: key, ...caseData[key] }));

const CasesPage = () => {
  const [filter, setFilter] = useState('all');

  // === 2. NEW: State for completion status ===
  const [completionStatus, setCompletionStatus] = useState({});

  // On mount, read all completion statuses from localStorage
  useEffect(() => {
    const statuses = {};
    allCases.forEach(caseInfo => {
      const isCompleted = localStorage.getItem(`case_${caseInfo.id}_completed`) === 'true';
      statuses[caseInfo.id] = isCompleted;
    });
    setCompletionStatus(statuses);
  }, []); // Empty dependency array means this runs once on mount
  // ==========================================

  return (
    <div className="page-container cases-page-container">
      <div className="section-header">
        <div className="header-content-wrapper">
          <h2>THE VAULT (UNLOCKED)</h2>
          <div className="filter-controls">
            <button onClick={() => setFilter('all')} className={`cursor-target ${filter === 'all' ? 'active' : ''}`}>ALL</button>
            <button onClick={() => setFilter('cyber-warfare')} className={`cursor-target ${filter === 'cyber-warfare' ? 'active' : ''}`}>CYBER WARFARE</button>
            <button onClick={() => setFilter('data-privacy')} className={`cursor-target ${filter === 'data-privacy' ? 'active' : ''}`}>DATA & PRIVACY</button>
            <button onClick={() => setFilter('financial-crime')} className={`cursor-target ${filter === 'financial-crime' ? 'active' : ''}`}>FINANCIAL CRIME</button>
          </div>
        </div>
      </div>
      <main className="case-files-container">
        {allCases.map(caseInfo => (
          <CaseFolder 
            key={caseInfo.id} 
            {...caseInfo} 
            isVisible={filter === 'all' || filter === caseInfo.category}
            isCompleted={completionStatus[caseInfo.id] || false}
          />
        ))}
      </main>
    </div>
  );
};

export default CasesPage;