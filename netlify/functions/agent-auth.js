require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

console.log(" SUPABASE_URL:", process.env.SUPABASE_URL );
console.log(" SUPABASE_SERVICE_KEY:", process.env.SUPABASE_SERVICE_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(" Missing environment variables. Check your .env or Netlify settings.");
}

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

  const { agentName, cipherKey, action } = data;
  if (!agentName || !cipherKey || !action) {
    return { statusCode: 400, body: JSON.stringify({ message: "Missing required fields" }) };
  }

  const safeName = agentName.trim().toUpperCase();
  const safeKey = cipherKey.trim();

  const { data: existingAgent, error: fetchError } = await supabase
    .from("global_scores")
    .select("cipher_key")
    .eq("agent_name", safeName)
    .limit(1);

  if (fetchError) {
    console.error("Supabase Fetch Error:", fetchError);
    return { statusCode: 500, body: JSON.stringify({ message: "Database fetch failed" }) };
  }

  const agentExists = existingAgent && existingAgent.length > 0;

  if (action === "register") {
    if (agentExists) {
      return { statusCode: 409, body: JSON.stringify({ message: "Codename already exists" }) };
    }

    const { error: insertError } = await supabase
      .from("global_scores")
      .insert([{ agent_name: safeName, cipher_key: safeKey, rank_class: "UNRANKED", time_ms: 999999999 }]);

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return { statusCode: 500, body: JSON.stringify({ message: "Agent creation failed" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Agent registered successfully" }) };
  }

  if (action === "login") {
    if (!agentExists) {
      return { statusCode: 404, body: JSON.stringify({ message: "Codename not found" }) };
    }

    if (existingAgent[0].cipher_key !== safeKey) {
      return { statusCode: 403, body: JSON.stringify({ message: "Invalid cipher key" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Login successful" }) };
  }

  return { statusCode: 400, body: JSON.stringify({ message: "Invalid action" }) };
};
