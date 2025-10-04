import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { caseData } from '../caseData.js';
import Loader from '../components/Loader.jsx';

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const caseInfo = caseData[caseId];
  const [isLoading, setIsLoading] = useState(true);

  // This effect simulates loading the case file
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [caseId]);

  // THIS IS THE FIX: This new effect hides and shows the nav/footer
  useEffect(() => {
    // Find the nav and footer elements in the document
    const navbar = document.querySelector('.main-nav');
    const footer = document.querySelector('.site-footer');

    if (isLoading) {
      // If the page is loading, hide the elements
      if (navbar) navbar.style.display = 'none';
      if (footer) footer.style.display = 'none';
    } else {
      // When loading is finished, show them again
      if (navbar) navbar.style.display = 'flex';
      if (footer) footer.style.display = 'block';
    }

    // Cleanup function: ensure elements are visible if user navigates away mid-load
    return () => {
      if (navbar) navbar.style.display = 'flex';
      if (footer) footer.style.display = 'block';
    };
  }, [isLoading]);


  // Show the loader while isLoading is true
  if (isLoading) {
    return <Loader />;
  }

  if (!caseInfo) {
    return (
        <div className="page-container">
            <main className="case-content"><h2>Case Not Found</h2></main>
        </div>
    );
  }

  return (
    <div className="page-container">
      <main className="case-content">
        <nav className="case-nav"><Link to="/cases">&larr; Return to Archives</Link></nav>
        <header className="case-header">
          <div>
            <h1>Case File: {caseInfo.title}</h1>
            <span className="case-meta">{caseInfo.meta}</span>
          </div>
          <img src={caseInfo.imgSrc} alt={`${caseInfo.title} stamp`} className="stamp" />
        </header>
        <section className="case-section"><h2>Audio Debriefing</h2><div className="media-embed"><p>[Podcast Player]</p></div></section>
        <section className="case-section"><h2>Case Overview</h2>{caseInfo.overview}</section>
        <section className="case-section"><div className="timeline"><h2>Key Events Timeline</h2>{caseInfo.timeline}</div></section>
        <section className="case-section">
            <h2>Documents & Resources</h2>
            <ul className="resource-list">
                {caseInfo.resources.map((res, i) => <li key={i}><a href={res.url} target="_blank" rel="noopener noreferrer">&gt; {res.name}</a></li>)}
            </ul>
        </section>
      </main>
    </div>
  );
};

export default CaseDetailPage;