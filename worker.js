export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allows any website to call this Worker
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // 1. Handle the OPTIONS (Preflight) request correctly
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Handle the POST request (The actual form submission)
    if (request.method === "POST") {
      try {
        const { email } = await request.json();

        // Check if D1 binding 'DB' exists
        if (!env.DB) {
          return new Response(JSON.stringify({ error: "D1 Binding 'DB' not found" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Insert into D1
        await env.DB.prepare(
          "INSERT INTO waitlist (email, created_at) VALUES (?, datetime('now'))"
        ).bind(email).run();

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (err) {
        // Handle duplicate emails (Unique constraint in D1)
        const isDuplicate = err.message.includes("UNIQUE");
        return new Response(JSON.stringify({ 
          error: isDuplicate ? "Already registered" : err.message 
        }), {
          status: isDuplicate ? 409 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 3. Reject any other method (GET, PUT, etc.)
    return new Response("Method Not Allowed", { 
      status: 405, 
      headers: corsHeaders 
    });
  }
};