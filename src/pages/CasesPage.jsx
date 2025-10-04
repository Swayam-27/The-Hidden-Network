import React, { useState } from 'react';
import CaseFolder from '../components/CaseFolder.jsx';
import { caseData } from '../caseData.js';

const allCases = Object.keys(caseData).map(key => ({ id: key, ...caseData[key] }));

const CasesPage = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="page-container">
      <div className="section-header">
        <h2>THE VAULT (UNLOCKED)</h2>
        <div className="filter-controls">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>ALL</button>
          <button onClick={() => setFilter('cyber-warfare')} className={filter === 'cyber-warfare' ? 'active' : ''}>CYBER WARFARE</button>
          <button onClick={() => setFilter('data-privacy')} className={filter === 'data-privacy' ? 'active' : ''}>DATA & PRIVACY</button>
          <button onClick={() => setFilter('financial-crime')} className={filter === 'financial-crime' ? 'active' : ''}>FINANCIAL CRIME</button>
        </div>
      </div>
      <main className="case-files-container">
        {allCases.map(caseInfo => (
          <CaseFolder 
            key={caseInfo.id} 
            {...caseInfo} 
            isVisible={filter === 'all' || filter === caseInfo.category}
          />
        ))}
      </main>
    </div>
  );
};

export default CasesPage;