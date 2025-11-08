import React, {
  useState,
  useEffect,
  Suspense,
  useCallback,
  useRef,
} from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Loader from "./components/Loader";
import BreachSequence from "./components/BreachSequence";
import TargetCursor from "./components/Cursor";
import MissionLog from "./components/MissionLog";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const CasesPage = React.lazy(() => import("./pages/CasesPage"));
const CaseDetailPage = React.lazy(() => import("./pages/CaseDetailPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));

const AppState = {
  PRELOADING: "PRELOADING",
  AUTHENTICATING: "AUTHENTICATING",
  BREACHING: "BREACHING",
  INSIDER: "INSIDER",
  NAVIGATING: "NAVIGATING",
};

const ProtectedRoute = ({ children }) => {
  const { isInsider } = useAuth();
  if (!isInsider) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  const { isInsider, login } = useAuth();
  const [appState, setAppState] = useState(AppState.PRELOADING);
  const [breachTarget, setBreachTarget] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- AGENT STATE ---
  const [agentName, setAgentName] = useState(
    () => localStorage.getItem("agentName") || "AGENT"
  );

  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const hoverSoundRef = useRef(new Audio("/assets/ui-hover.mp3"));
  const clickSoundRef = useRef(new Audio("/assets/ui-click.mp3"));
  const keypressSoundRef = useRef(new Audio("/assets/keypress.mp3"));
  const enterSoundRef = useRef(new Audio("/assets/enter-key.mp3"));
  const typingLoopRef = useRef(new Audio("/assets/typing-loop.mp3"));

  useEffect(() => {
    typingLoopRef.current.loop = true;
    typingLoopRef.current.volume = 0.5;

    hoverSoundRef.current.volume = 0.5;
    clickSoundRef.current.volume = 0.5;
    keypressSoundRef.current.volume = 0.4;
    enterSoundRef.current.volume = 0.6;
  }, []);

  const unlockAudio = useCallback(() => {
    if (isAudioUnlocked) return true;

    try {
      hoverSoundRef.current.load();
      clickSoundRef.current.load();
      keypressSoundRef.current.load();
      enterSoundRef.current.load();
      typingLoopRef.current.load();
      setIsAudioUnlocked(true);
      return true;
    } catch (e) {
      console.error("Audio unlock failed:", e);
      return false;
    }
  }, [isAudioUnlocked]);

  const playHover = useCallback(() => {
    if (!unlockAudio()) return;
    hoverSoundRef.current.currentTime = 0;
    hoverSoundRef.current.play().catch(() => {});
  }, [unlockAudio]);

  const playClick = useCallback(() => {
    if (!unlockAudio()) return;
    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play().catch(() => {});
  }, [unlockAudio]);

  const playKeypress = useCallback(() => {
    if (!unlockAudio()) return;
    keypressSoundRef.current.currentTime = 0;
    keypressSoundRef.current.play().catch(() => {});
  }, [unlockAudio]);

  const playEnter = useCallback(() => {
    if (!unlockAudio()) return;
    enterSoundRef.current.currentTime = 0;
    enterSoundRef.current.play().catch(() => {});
  }, [unlockAudio]);

  const playTypingLoop = useCallback(() => {
    if (!unlockAudio()) return;
    typingLoopRef.current.currentTime = 0;
    typingLoopRef.current.play().catch(() => {});
  }, [unlockAudio]);

  const stopTypingLoop = useCallback(() => {
    typingLoopRef.current.pause();
    typingLoopRef.current.currentTime = 0;
  }, []);

  // --- AGENT REGISTRATION ---
  const registerAgent = useCallback((name) => {
    const safeName = name.trim().toUpperCase() || "AGENT";
    setAgentName(safeName);
    localStorage.setItem("agentName", safeName);
  }, []);

  const audioProps = {
    playHover,
    playClick,
    playKeypress,
    playEnter,
    playTypingLoop,
    stopTypingLoop,
  };

  useEffect(() => {
    const preloaderShown = localStorage.getItem("preloaderShown") === "true";
    if (!preloaderShown) {
      setAppState(AppState.PRELOADING);
    } else if (isInsider) {
      setAppState(AppState.INSIDER);
    } else {
      setAppState(AppState.AUTHENTICATING);
    }
  }, [isInsider]);

  const handlePreloaderFinish = useCallback(() => {
    localStorage.setItem("preloaderShown", "true");
    setAppState(AppState.AUTHENTICATING);
  }, []);

  const handleLogin = useCallback(
    (path) => {
      playEnter();
      const breachShown =
        localStorage.getItem("breachAnimationShown") === "true";

      if (!breachShown) {
        setBreachTarget(path);
        setAppState(AppState.BREACHING);
      } else {
        if (!isInsider) {
          login();
        }
        setAppState(AppState.NAVIGATING);
        setTimeout(() => {
          navigate(path);
          setAppState(AppState.INSIDER);
        }, 500);
      }
    },
    [isInsider, login, navigate, playEnter]
  );

  const handleBreachComplete = useCallback(() => {
    localStorage.setItem("breachAnimationShown", "true");
    if (!isInsider) login();
    setAppState(AppState.INSIDER);
    if (breachTarget) navigate(breachTarget);
  }, [isInsider, login, navigate, breachTarget]);

  const onCasePage = location.pathname.startsWith("/case/");

  if (appState === AppState.BREACHING) {
    return <BreachSequence onComplete={handleBreachComplete} {...audioProps} />;
  }

  if (appState === AppState.NAVIGATING) {
    return <Loader {...audioProps} />;
  }

  return (
    <>
      <TargetCursor targetSelector=".cursor-target" />

      {appState === AppState.INSIDER && (
        <>
          <Navbar {...audioProps} />
          {!onCasePage && <MissionLog agentName={agentName} />}
        </>
      )}

      <main>
        <Suspense fallback={<Loader {...audioProps} />}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onLogin={handleLogin}
                  onPreloaderFinish={handlePreloaderFinish}
                  appState={appState}
                  agentName={agentName}
                  updateAgentName={registerAgent}
                  {...audioProps}
                />
              }
            />
            <Route
              path="/cases"
              element={
                <ProtectedRoute>
                  <CasesPage {...audioProps} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/case/:caseId"
              element={
                <ProtectedRoute>
                  {/* ✅ Passing agentName prop here */}
                  <CaseDetailPage agentName={agentName} {...audioProps} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutPage {...audioProps} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer {...audioProps} />
    </>
  );
}
