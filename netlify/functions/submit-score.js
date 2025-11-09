const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    const data = JSON.parse(event.body);
    const { agentName, caseId, totalTimeMs, totalAttempts, rankClass, cipherKey } = data;

    if (!agentName || !caseId || !cipherKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields." }),
      };
    }

    const safeCase = caseId.trim().toLowerCase().replace("_", "-");
    const safeName = agentName.trim().toUpperCase();
    const safeKey = cipherKey.trim();

    console.log(" Incoming Submission:", {
      safeName,
      safeCase,
      totalTimeMs,
      totalAttempts,
      rankClass,
    });

    const { data: existingScore, error: selectError } = await supabase
      .from("global_scores")
      .select("id")
      .eq("agent_name", safeName)
      .eq("case_id", safeCase)
      .limit(1);

    if (selectError) {
      console.error(" Supabase Select Error:", selectError);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Database read failed." }),
      };
    }

    if (existingScore && existingScore.length > 0) {
      console.log(" Duplicate submission blocked for", safeName, safeCase);
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Score already recorded for this case.",
        }),
      };
    }
    const { error: insertError } = await supabase.from("global_scores").insert([
      {
        agent_name: safeName,
        case_id: safeCase,
        time_ms: totalTimeMs,
        total_wrong_attempts: totalAttempts,
        rank_class: rankClass,
        cipher_key: safeKey,
      },
    ]);

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: insertError.message || "Database insertion failed.",
          details: insertError,
        }),
      };
    }

    console.log(" Score inserted successfully for", safeName, safeCase);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Score submitted successfully.",
        case: safeCase,
        agent: safeName,
      }),
    };
  } catch (err) {
    console.error(" Unhandled Server Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error.", details: err.message }),
    };
  }
};
