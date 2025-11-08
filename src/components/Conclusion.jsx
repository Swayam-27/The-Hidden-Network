import React, { useState, useCallback } from "react";
import LeaderboardHUD from "./LeaderboardHUD";
import { caseData } from "../caseData";

const formatTimerDisplay = (timeInMs) => {
  if (timeInMs == null || !Number.isFinite(timeInMs) || timeInMs < 0)
    return "00:00";
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const calculateRank = (
  totalTimeMs,
  totalAttempts,
  puzzleCount,
  totalAudioDurationMs
) => {
  if (puzzleCount === 0) {
    return { rank: "A-CLASS", title: "OPERATIONAL", rankClass: "rank-a" };
  }

  const solveTimeMs = Math.max(0, totalTimeMs - totalAudioDurationMs);
  const avgSolveTimeMs = solveTimeMs / puzzleCount;

  if (totalAttempts === 0 && avgSolveTimeMs < 90000) {
    return { rank: "S-CLASS", title: "GHOST PROTOCOL", rankClass: "rank-s" };
  }

  if (totalAttempts <= puzzleCount / 2 && avgSolveTimeMs < 180000) {
    return { rank: "A-CLASS", title: "FIELD AGENT", rankClass: "rank-a" };
  }

  if (totalAttempts <= puzzleCount || avgSolveTimeMs < 300000) {
    return { rank: "B-CLASS", title: "ANALYST", rankClass: "rank-b" };
  }

  return { rank: "C-CLASS", title: "RECRUIT", rankClass: "rank-c" };
};

const SubmissionModal = ({
  agentName,
  onFinalSubmit,
  onCancel,
  playHover,
  playClick,
}) => {
  const [cipherKey, setCipherKey] = useState("");
  const [feedback, setFeedback] = useState("ENTER 4-DIGIT KEY TO SUBMIT.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const key = cipherKey.trim();
    if (key.length !== 4) {
      setFeedback("KEY MUST BE 4 CHARACTERS.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    setFeedback("TRANSMITTING SCORE...");

    // Pass the key and the local feedback setter to the parent
    await onFinalSubmit(key, setFeedback);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <form
        onSubmit={handleSubmit}
        className={`submission-modal ${shake ? "shake" : ""}`}
      >
        <h3 className="modal-header">SECURE SCORE TRANSMISSION</h3>
        <p className="modal-text">
          Agent {agentName}, verify your identity to post your **first-attempt**
          score. If this is a new device, your key is required for
          authentication.
        </p>

        <div className="input-group">
          <label htmlFor="cipher-key-input">4-DIGIT CIPHER KEY:</label>
          <input
            id="cipher-key-input"
            type="password"
            maxLength={4}
            value={cipherKey}
            onChange={(e) => setCipherKey(e.target.value.toUpperCase())}
            disabled={isSubmitting}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onCancel}
            className="decrypt-button cursor-target cancel-button"
            onMouseEnter={playHover}
            disabled={isSubmitting}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="decrypt-button cursor-target submit-button"
            onMouseEnter={playHover}
            onClick={playClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "TRANSMITTING..." : "VERIFY & SUBMIT"}
          </button>
        </div>
        {feedback && <p className={`modal-feedback`}>{feedback}</p>}
      </form>
    </div>
  );
};

const Conclusion = ({
  message,
  totalTimeMs,
  totalAttempts,
  episodeCount,
  totalAudioDurationMs,
  caseId,
  agentName,
  playHover,
  playClick,
}) => {
  const [showModal, setShowModal] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const { rank, title, rankClass } = calculateRank(
    totalTimeMs,
    totalAttempts,
    episodeCount,
    totalAudioDurationMs || 0
  );

  const handleSubmission = async (cipherKey, setModalFeedback) => {
    const payload = {
      agentName,
      caseId,
      totalTimeMs,
      totalAttempts,
      rankClass: rank,
      cipherKey,
    };

    try {
      const response = await fetch(`/.netlify/functions/submit-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 200) {
        setSubmissionStatus("SUCCESS");
        setModalFeedback(`Score submitted. Rank: ${rank}.`);
      } else if (response.status === 403) {
        setSubmissionStatus("ALREADY_RECORDED");
        setModalFeedback("ALREADY LOGGED. First attempt locked.");
      } else {
        setSubmissionStatus("FAILED");
        setModalFeedback(
          `FAILED: ${result.body || result.message || "Server Error"}`
        );
        console.error("API Submission Error:", response.status, result.message);
      }
    } catch (error) {
      setSubmissionStatus("FAILED");
      setModalFeedback("FAILED: NETWORK ERROR.");
      console.error("Network Error during submission:", error);
    }
  };

  if (showModal && submissionStatus === null) {
    return (
      <SubmissionModal
        agentName={agentName}
        onFinalSubmit={handleSubmission}
        onCancel={() => setShowModal(false)}
        playHover={playHover}
        playClick={playClick}
      />
    );
  }

  const statusMessage = {
    SUCCESS: "SCORE SUBMITTED. CHECK GLOBAL LEADERBOARD.",
    ALREADY_RECORDED: "SCORE NOT SUBMITTED: FIRST ATTEMPT ALREADY LOGGED.",
    FAILED: "TRANSMISSION FAILED. CHECK CONSOLE FOR ERRORS.",
  };

  return (
    <div className="conclusion-wrapper">
      <div className="conclusion-header">[ TRANSMISSION COMPLETE ]</div>
      <div className="conclusion-rank-debrief">
        <h3 className="rank-title">CLASSIFIED: {title}</h3>
        <p className={`rank-rating ${rankClass}`}>Rating: {rank}</p>
        <div className="rank-stats">
          <p>
            <strong>Completion Time:</strong> {formatTimerDisplay(totalTimeMs)}
          </p>
          <p>
            <strong>Wrong Attempts:</strong> {totalAttempts}
          </p>
        </div>
      </div>

      {/* --- RENDER LEADERBOARD HUD HERE --- */}
      {submissionStatus !== null && (
        <LeaderboardHUD
          caseId={caseId}
          caseTitle={caseData[caseId]?.title || "Unknown Mission"}
        />
      )}

      <p className="submission-status-note status-bar">
        // STATUS: {statusMessage[submissionStatus] || message} //
      </p>
      <p className="conclusion-message">{message}</p>
    </div>
  );
};

export default Conclusion;
