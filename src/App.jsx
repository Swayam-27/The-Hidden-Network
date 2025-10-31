import React, { useState, useEffect, Suspense, useCallback } from 'react';
// 1. --- PATCH: Import Navigate ---
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
// 2. --- PATCH: Removed .jsx extensions from imports ---
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/footer';
import Loader from './components/Loader';
import BreachSequence from './components/BreachSequence';
import TargetCursor from './components/Cursor'; 

const HomePage = React.lazy(() => import('./pages/HomePage'));
const CasesPage = React.lazy(() => import('./pages/CasesPage'));
const CaseDetailPage = React.lazy(() => import('./pages/CaseDetailPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
// ---------------------------------------------------

const AppState = {
  PRELOADING: 'PRELOADING',
  AUTHENTICATING: 'AUTHENTICATING',
  BREACHING: 'BREACHING',
  INSIDER: 'INSIDER',
  NAVIGATING: 'NAVIGATING', 
};

// --- PATCH: Add ProtectedRoute component ---
// This component protects your routes from non-insiders
const ProtectedRoute = ({ children }) => {
  const { isInsider } = useAuth();
  if (!isInsider) {
    // If not an insider, boot them to the homepage.
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const { isInsider, login } = useAuth();
  const [appState, setAppState] = useState(AppState.PRELOADING);
  const [breachTarget, setBreachTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // --- PATCH: Use localStorage ---
    const preloaderShown = localStorage.getItem('preloaderShown') === 'true';
    if (!preloaderShown) {
      setAppState(AppState.PRELOADING);
    } else if (isInsider) {
      setAppState(AppState.INSIDER);
    } else {
      setAppState(AppState.AUTHENTICATING);
    }
  }, [isInsider]);

  const handlePreloaderFinish = useCallback(() => {
    // --- PATCH: Use localStorage ---
    localStorage.setItem('preloaderShown', 'true');
    setAppState(AppState.AUTHENTICATING);
  }, []);

  const handleLogin = useCallback((path) => {
    // --- PATCH: Use localStorage ---
    const breachShown = localStorage.getItem('breachAnimationShown') === 'true';

    if (!breachShown) {
      setBreachTarget(path);
      setAppState(AppState.BREACHING);
    } else {
      if (!isInsider) login();
      setAppState(AppState.NAVIGATING);
      setTimeout(() => {
        navigate(path);
        setAppState(AppState.INSIDER); 
      }, 500); 
    }
  }, [isInsider, login, navigate]);

  const handleBreachComplete = useCallback(() => {
    // --- PATCH: Use localStorage ---
    localStorage.setItem('breachAnimationShown', 'true');
    if (!isInsider) login();
    setAppState(AppState.INSIDER);
    if (breachTarget) navigate(breachTarget);
  }, [isInsider, login, navigate, breachTarget]);

  if (appState === AppState.BREACHING) {
    return <BreachSequence onComplete={handleBreachComplete} />;
  }
  
  if (appState === AppState.NAVIGATING) {
    return <Loader />;
  }
  
  return (
    <>
      <TargetCursor targetSelector=".cursor-target" />

      {/* This logic is correct */}
      {appState === AppState.INSIDER && <Navbar />}
      
      <main>
        {/* --- PATCH: Fixed typo 'SuspFense' --- */}
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* --- PATCH: Cleaned up props --- */}
            <Route path="/" element={<HomePage onLogin={handleLogin} onPreloaderFinish={handlePreloaderFinish} appState={appState} />} />

            {/* --- PATCH: Wrap all routes in ProtectedRoute --- */}
            <Route 
              path="/cases" 
              element={
                <ProtectedRoute>
                  <CasesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/case/:caseId" 
              element={
                <ProtectedRoute>
                  <CaseDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <AboutPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        {/* --- PATCH: Fixed typo 'SuspFailurense' --- */}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

