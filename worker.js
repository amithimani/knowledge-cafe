export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Change to your specific domain for production security
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        const { email } = await request.json();

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          return new Response(JSON.stringify({ error: "Invalid email format." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Insert into D1 database
        // Ensure you have created the table: 
        // CREATE TABLE waitlist (id INTEGER PRIMARY KEY, email TEXT UNIQUE, created_at TEXT);
        try {
          await env.DB.prepare(
            "INSERT INTO waitlist (email, created_at) VALUES (?, datetime('now'))"
          ).bind(email).run();
        } catch (dbError) {
          // Detect duplicate email via UNIQUE constraint
          if (dbError.message.includes("UNIQUE constraint")) {
            return new Response(JSON.stringify({ error: "This email is already on the list!" }), {
              status: 409,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          throw dbError;
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: "Internal server error." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  }
};