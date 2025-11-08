import React, { useState, useEffect } from "react";
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

const LeaderboardHUD = ({ caseId, caseTitle }) => {
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopScores = async () => {
      setLoading(true);
      setError(null);

      // 1. Fetch scores for the specific case, ordered by fastest time (ascending)
      const { data, error } = await supabase
        .from("global_scores")
        .select("agent_name, rank_class, time_ms")
        .eq("case_id", caseId)
        .order("time_ms", { ascending: true })
        .limit(10);

      if (error) {
        console.error("Leaderboard Fetch Error:", error);
        setError(true);
      } else {
        setTopScores(data || []);
      }
      setLoading(false);
    };

    if (caseId) {
      fetchTopScores();
    }
  }, [caseId]);

  if (loading) {
    return (
      <div className="mission-timer-hud leaderboard-hud">
        <p className="hud-label rank-n">FETCHING GLOBAL RANKINGS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mission-timer-hud leaderboard-hud">
        <p className="hud-label stat-error">DATABASE CONNECTION FAILED.</p>
      </div>
    );
  }

  return (
    <div className="mission-timer-hud leaderboard-hud">
      <div className="hud-log-section leaderboard-header">
        <span className="hud-label">
          GLOBAL BEST ({caseTitle.toUpperCase()})
        </span>
      </div>

      <table className="leaderboard-mini-table">
        <thead>
          <tr>
            <th>RANK</th>
            <th>AGENT</th>
            <th>TIME</th>
          </tr>
        </thead>
        <tbody>
          {topScores.map((score, index) => (
            <tr
              key={index}
              className={`rank-${score.rank_class
                .toLowerCase()
                .replace("-", "")}`}
            >
              <td>#{index + 1}</td>
              <td>{score.agent_name}</td>
              <td>{formatTime(score.time_ms)}</td>
            </tr>
          ))}
          {topScores.length === 0 && (
            <tr>
              <td colSpan="3" className="rank-n">
                NO SCORES RECORDED YET. BE THE FIRST.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardHUD;
