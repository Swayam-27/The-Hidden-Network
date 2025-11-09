import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const formatTime = (ms) => {
  if (!ms || ms === 0) return "--:--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const LeaderboardHUD = ({ caseId, caseTitle, submissionStatus }) => {
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [newRecordName, setNewRecordName] = useState("");
  const [currentUserName, setCurrentUserName] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("agent_name");
    if (storedName) setCurrentUserName(storedName);
  }, []);

  const fetchTopScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    const normalizedCaseId = (caseId || "").trim().toLowerCase();

    if (!normalizedCaseId) {
      setLoading(false);
      setError(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("global_scores")
        .select("agent_name, rank_class, time_ms")
        .eq("case_id", normalizedCaseId)
        .order("time_ms", { ascending: true })
        .limit(10);

      if (error) {
        setError(true);
      } else {
        const scores = data || [];
        
        if (scores.length > 0) {
          const storageKey = `lastBest_${normalizedCaseId}`;
          const lastBest = localStorage.getItem(storageKey);
          
          if (lastBest && scores[0].time_ms < parseInt(lastBest)) {
            setNewRecordName(scores[0].agent_name);
            setShowNewRecord(true);
            setTimeout(() => setShowNewRecord(false), 4000);
          }
          
          localStorage.setItem(storageKey, scores[0].time_ms.toString());
        }
        
        setTopScores(scores);
      }
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  }, [caseId]);

  useEffect(() => {
    fetchTopScores();
  }, [fetchTopScores, submissionStatus]);

  if (loading) {
    return (
      <div className="leaderboard-hud-container">
        <div className="leaderboard-hud-fixed">
          <div className="hud-header-minimal">
            <h3>GLOBAL BEST (PROJECT RAVEN)</h3>
          </div>
          <div className="hud-loading-minimal">⟳ LOADING...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-hud-container">
        <div className="leaderboard-hud-fixed">
          <div className="hud-header-minimal">
            <h3>GLOBAL BEST (PROJECT RAVEN)</h3>
          </div>
          <div className="hud-error-minimal">⚠ CONNECTION FAILED</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showNewRecord && (
        <div className="new-record-toast">
          ⚡ NEW RECORD: {newRecordName}
        </div>
      )}

      <div className="leaderboard-hud-container">
        <div className="leaderboard-hud-fixed">
          <div className="hud-header-minimal">
            <h3>GLOBAL BEST ({caseTitle})</h3>
          </div>

          <table className="leaderboard-table-minimal">
            <thead>
              <tr>
                <th>RANK</th>
                <th>AGENT</th>
                <th>CLASS</th>
                <th>TIME</th>
              </tr>
            </thead>
            <tbody>
              {topScores.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data-minimal">
                    NO SCORES YET
                  </td>
                </tr>
              ) : (
                (() => {
                  let lastRankClass = null;
                  return topScores.map((score, index) => {
                    const isFirst = index === 0;
                    const isCurrentUser =
                      currentUserName &&
                      score.agent_name.toLowerCase() === currentUserName.toLowerCase();
                    
                    const currentRankClass = score.rank_class?.charAt(0)?.toUpperCase() || "C";
                    const showDivider = lastRankClass && lastRankClass !== currentRankClass;
                    lastRankClass = currentRankClass;

                    return (
                      <React.Fragment key={`${score.agent_name}-${index}`}>
                        {showDivider && (
                          <tr className="divider-row">
                            <td colSpan="4">
                              <div className="rank-divider-minimal">
                                ━━ {currentRankClass}-CLASS ━━
                              </div>
                            </td>
                          </tr>
                        )}

                        <tr
                          className={`
                            ${isFirst ? "first-place" : ""} 
                            ${isCurrentUser ? "current-user-row" : ""}
                          `}
                        >
                          <td className="rank-col">
                            {isFirst && <span className="crown-icon">👑</span>}
                            #{index + 1}
                          </td>
                          <td className="agent-col">{score.agent_name}</td>
                          <td className="class-col">
                            <span className={`class-badge class-${currentRankClass.toLowerCase()}`}>
                              {score.rank_class || "C-CLASS"}
                            </span>
                          </td>
                          <td className="time-col">{formatTime(score.time_ms)}</td>
                        </tr>
                      </React.Fragment>
                    );
                  });
                })()
              )}
            </tbody>
          </table>

          <div className="hud-footer-minimal">
            [LAST SYNC: {new Date().toLocaleTimeString()}]
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderboardHUD;
