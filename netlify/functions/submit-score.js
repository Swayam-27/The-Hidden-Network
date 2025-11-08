// netlify/functions/submit-score.js

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: "Bad Request: Invalid JSON" };
  }

  const {
    agentName,
    caseId,
    totalTimeMs,
    totalAttempts,
    rankClass,
    cipherKey,
  } = data;

  if (
    !agentName ||
    !caseId ||
    totalTimeMs === undefined ||
    !rankClass ||
    !cipherKey
  ) {
    return { statusCode: 400, body: "Missing required fields." };
  }

  const { data: existingScore, error: fetchError } = await supabase
    .from("global_scores")
    .select("id")
    .eq("agent_name", agentName)
    .eq("case_id", caseId)
    .limit(1);

  if (fetchError) {
    console.error("Supabase Fetch Error:", fetchError);
    return { statusCode: 500, body: "Database check failed." };
  }

  if (existingScore && existingScore.length > 0) {
    return {
      statusCode: 403,
      body: "Score already recorded. Only the first successful attempt is logged globally.",
    };
  }

  // 4. Insert New Score (Safe to write using Service Key)
  const { error: insertError } = await supabase.from("global_scores").insert([
    {
      agent_name: agentName,
      case_id: caseId,
      time_ms: totalTimeMs,
      total_attempts: totalAttempts,
      rank_class: rankClass,
      cipher_key: cipherKey,
    },
  ]);

  if (insertError) {
    console.error("Supabase Insert Error:", insertError);
    return {
      statusCode: 500,
      body: `Database insertion failed: ${insertError.message}`,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Score for Agent ${agentName} recorded successfully.`,
    }),
  };
};
