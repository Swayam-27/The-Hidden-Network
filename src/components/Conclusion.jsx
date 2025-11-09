import React, { useState, useCallback, useEffect } from "react";
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

const Conclusion = ({
  message,
  totalTimeMs,
  totalAttempts,
  episodeCount,
  totalAudioDurationMs,
  caseId,
  agentName,
}) => {
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const cipherKey = localStorage.getItem("agentCipherKey");

  const { rank, title, rankClass } = calculateRank(
    totalTimeMs,
    totalAttempts,
    episodeCount,
    totalAudioDurationMs || 0
  );

  useEffect(() => {
    const normalizedCaseId = caseId?.toString().trim().toLowerCase().replace(/\s+/g, "-");
    if (localStorage.getItem(`case_${normalizedCaseId}_completed`) === "true") {
        localStorage.setItem(`case_${normalizedCaseId}_rank`, rank);
        localStorage.setItem(`case_${normalizedCaseId}_rankClass`, rankClass);
    }
  }, [caseId, rank, rankClass]);
  // --- END NEW LOGIC ---

  const handleSubmission = useCallback(async () => {
    if (submissionStatus !== null || !agentName || !cipherKey) {
      if (!agentName || !cipherKey) {
        setSubmissionStatus("NOT_LOGGED_IN");
      }
      return;
    }
    setSubmissionStatus("TRANSMITTING...");

    const normalizedCaseId = caseId
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const payload = {
      agentName,
      caseId: normalizedCaseId,
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

      if (response.status === 200) {
        try {
          await response.json(); 
          setSubmissionStatus("SUCCESS");
        } catch (jsonError) {
          console.warn("Successful submission, but JSON response was unreadable.", jsonError);
          setSubmissionStatus("SUCCESS"); 
        }
      } else if (response.status === 403) {
        const result = await response.json(); 
        setSubmissionStatus("ALREADY_RECORDED");
      } else {
        const result = await response.json(); 
        setSubmissionStatus("FAILED");
        console.error("API Submission Error:", response.status, result.message);
      }
    } catch (error) {
      setSubmissionStatus("FAILED");
      console.error("Network Error during submission:", error);
    }
  }, [
    agentName,
    caseId,
    totalTimeMs,
    totalAttempts,
    rank,
    cipherKey,
    submissionStatus,
  ]);

  useEffect(() => {
    handleSubmission();
  }, [handleSubmission]);

  const statusMessage = {
    SUCCESS: "SCORE SUBMITTED. CHECK GLOBAL LEADERBOARD.",
    ALREADY_RECORDED: "SCORE NOT SUBMITTED: FIRST ATTEMPT ALREADY LOGGED.",
    FAILED: "TRANSMISSION FAILED. CHECK CONSOLE FOR ERRORS.",
    "TRANSMITTING...": "TRANSMITTING SCORE TO GLOBAL ARCHIVE...",
    NOT_LOGGED_IN: "LOCAL SCORE. LOG IN TO SUBMIT TO GLOBAL LEADERBOARD.",
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

      {submissionStatus !== null && (
        <LeaderboardHUD
          caseId={caseId}
          caseTitle={caseData[caseId]?.title || "Unknown Mission"}
          submissionStatus={submissionStatus} 
        />
      )}

      <p
        className={`submission-status-note status-bar status-${(
          submissionStatus || "not_logged_in"
        )
          .toLowerCase()
          .replace(/_/g, "-")
          .replace(/\.+/g, "")}`}
      >
        // STATUS: {statusMessage[submissionStatus] || message} //
      </p>
      <p className="conclusion-message">{message}</p>
    </div>
  );
};

export default Conclusion;