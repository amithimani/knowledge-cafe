export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // Handle OPTIONS (Preflight) request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Handle POST request (Email submission)
    if (request.method === "POST") {
      try {
        const { email } = await request.json();

        if (!env.DB) {
          return new Response(JSON.stringify({ error: "D1 Binding 'DB' not found" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await env.DB.prepare(
          "INSERT INTO waitlist (email, created_at) VALUES (?, datetime('now'))"
        ).bind(email).run();

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (err) {
        const isDuplicate = err.message.includes("UNIQUE");
        return new Response(JSON.stringify({
          error: isDuplicate ? "Already registered" : err.message
        }), {
          status: isDuplicate ? 409 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders
    });
  }
};
