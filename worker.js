// OPTIONAL: Cloudflare Worker for Waitlist Form Submission
// Deploy this to Cloudflare Workers to handle form submissions
// Stores emails in Cloudflare D1 database (free tier)

export default {
  async fetch(request, env) {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Update with your domain in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      // Parse request body
      const { email } = await request.json();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return new Response(JSON.stringify({ 
          error: 'Invalid email address' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Insert into D1 database (you need to create this first)
      // Create table: CREATE TABLE waitlist (id INTEGER PRIMARY KEY, email TEXT UNIQUE, created_at TEXT);
      const stmt = env.DB.prepare(
        'INSERT INTO waitlist (email, created_at) VALUES (?, datetime("now"))'
      );
      
      try {
        await stmt.bind(email).run();
      } catch (dbError) {
        // Handle duplicate email
        if (dbError.message.includes('UNIQUE constraint')) {
          return new Response(JSON.stringify({ 
            error: 'Email already registered' 
          }), {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        throw dbError;
      }

      // Optional: Send confirmation email via Resend, SendGrid, etc.
      // await sendConfirmationEmail(email);

      // Optional: Send notification to your team
      // await sendSlackNotification(email);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Successfully joined the waitlist' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// DEPLOYMENT INSTRUCTIONS:
// 
// 1. Install Wrangler CLI:
//    npm install -g wrangler
//
// 2. Login to Cloudflare:
//    wrangler login
//
// 3. Create D1 database:
//    wrangler d1 create knowledge-cafe-waitlist
//
// 4. Create wrangler.toml file:
//    name = "knowledge-cafe-api"
//    main = "worker.js"
//    compatibility_date = "2024-01-01"
//    
//    [[d1_databases]]
//    binding = "DB"
//    database_name = "knowledge-cafe-waitlist"
//    database_id = "YOUR_DATABASE_ID" # From step 3
//
// 5. Create the table:
//    wrangler d1 execute knowledge-cafe-waitlist --command "CREATE TABLE waitlist (id INTEGER PRIMARY KEY, email TEXT UNIQUE, created_at TEXT);"
//
// 6. Deploy:
//    wrangler deploy
//
// 7. Update script.js to use the Worker endpoint:
//    const response = await fetch('https://knowledge-cafe-api.YOUR_SUBDOMAIN.workers.dev', {
//      method: 'POST',
//      headers: { 'Content-Type': 'application/json' },
//      body: JSON.stringify({ email })
//    });
