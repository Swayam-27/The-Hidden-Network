import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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

const AppState = {
    PRELOADING: 'PRELOADING',
    AUTHENTICATING: 'AUTHENTICATING',
    BREACHING: 'BREACHING',
    INSIDER: 'INSIDER',
    NAVIGATING: 'NAVIGATING', 
};

export default function App() {
    const { isInsider, login } = useAuth();
    const [appState, setAppState] = useState(AppState.PRELOADING);
    const [breachTarget, setBreachTarget] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const preloaderShown = sessionStorage.getItem('preloaderShown') === 'true';
        if (!preloaderShown) {
            setAppState(AppState.PRELOADING);
        } else if (isInsider) {
            setAppState(AppState.INSIDER);
        } else {
            setAppState(AppState.AUTHENTICATING);
        }
    }, [isInsider]);

    const handlePreloaderFinish = useCallback(() => {
        sessionStorage.setItem('preloaderShown', 'true');
        setAppState(AppState.AUTHENTICATING);
    }, []);

    const handleLogin = useCallback((path) => {
        const breachShown = sessionStorage.getItem('breachAnimationShown') === 'true';

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
        sessionStorage.setItem('breachAnimationShown', 'true');
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

            {appState === AppState.INSIDER && <Navbar />}
            <main>
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route path="/" element={<HomePage onLogin={handleLogin} onPreloaderFinish={handlePreloaderFinish} appState={appState} />} />
                        <Route path="/cases" element={<CasesPage />} />
                        <Route path="/case/:caseId" element={<CaseDetailPage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
