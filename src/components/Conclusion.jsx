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
    return {
      rank: "A-CLASS",
      title: "OPERATIONAL",
      rankClass: "rank-a",
      netSolveTimeMs: 0, 
    };
  }

  const rawSolveTimeMs = totalTimeMs - (totalAudioDurationMs || 0);

  const solveTimeMs = rawSolveTimeMs < 0 ? totalTimeMs : rawSolveTimeMs;

  const avgSolveTimeMs = solveTimeMs / puzzleCount;

  let rank = "C-CLASS";
  let title = "RECRUIT";
  let rankClass = "rank-c";

  if (totalAttempts === 0 && avgSolveTimeMs < 90000) {
    rank = "S-CLASS";
    title = "GHOST PROTOCOL";
    rankClass = "rank-s";
  } else if (totalAttempts <= puzzleCount / 2 && avgSolveTimeMs < 180000) {
    rank = "A-CLASS";
    title = "FIELD AGENT";
    rankClass = "rank-a";
  } else if (totalAttempts <= puzzleCount || avgSolveTimeMs < 300000) {
    rank = "B-CLASS";
    title = "ANALYST";
    rankClass = "rank-b";
  }

  return { rank, title, rankClass, netSolveTimeMs: solveTimeMs };
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

  const { rank, title, rankClass, netSolveTimeMs } = calculateRank(
    totalTimeMs,
    totalAttempts,
    episodeCount,
    totalAudioDurationMs || 0
  );

  // --- FIX: SAVING netSolveTimeMs TO LOCAL STORAGE ---
  useEffect(() => {
    const normalizedCaseId = caseId?.toString().trim().toLowerCase().replace(/\s+/g, "-");
    if (localStorage.getItem(`case_${normalizedCaseId}_completed`) === "true") {
        localStorage.setItem(`case_${normalizedCaseId}_rank`, rank);
        localStorage.setItem(`case_${normalizedCaseId}_rankClass`, rankClass);
        localStorage.setItem(`case_${normalizedCaseId}_netSolveTimeMs`, netSolveTimeMs.toString()); 
    }
  }, [caseId, rank, rankClass, netSolveTimeMs]);

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
      netSolveTimeMs: netSolveTimeMs,
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
        await response.json(); 
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
    netSolveTimeMs, 
  ]);

  useEffect(() => {
    handleSubmission();
  }, [handleSubmission]);


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
      </p>
      <p className="conclusion-message">{message}</p>
    </div>
  );
};

export default Conclusion;