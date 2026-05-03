export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allows any website to call this Worker
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // 1. Handle GET requests - serve the HTML page
    if (request.method === "GET") {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Knowledge Café - Learn from Tech Giants</title>
    <meta name="description" content="AI-powered platform curating engineering insights from Uber, Meta, Netflix, and other tech giants. Learn how they scale, solve challenges, and build world-class systems.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cormorant Garamond', serif; line-height: 1.6; color: #1a1a1a; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .header { padding: 2rem 0; border-bottom: 1px solid #e5e5e5; }
        .logo { display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem; font-weight: 600; }
        .nav { display: flex; gap: 2rem; margin-top: 1rem; }
        .nav-link { text-decoration: none; color: #1a1a1a; transition: color 0.2s; }
        .nav-link:hover { color: #666; }
        .hero { padding: 6rem 0; }
        .hero-title { font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem; }
        .hero-title-accent { color: #666; }
        .hero-description { font-size: 1.25rem; color: #666; max-width: 600px; margin-bottom: 2rem; }
        .btn { display: inline-block; padding: 1rem 2rem; background: #1a1a1a; color: white; text-decoration: none; border-radius: 4px; transition: background 0.2s; }
        .btn:hover { background: #333; }
        .waitlist { padding: 4rem 0; background: #f5f5f5; }
        .waitlist-title { font-size: 2rem; margin-bottom: 1rem; }
        .waitlist-form { display: flex; gap: 1rem; max-width: 500px; }
        .form-input { flex: 1; padding: 1rem; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 1rem; }
        .btn-submit { padding: 1rem 2rem; background: #1a1a1a; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .waitlist-success { display: none; color: #22c55e; margin-top: 1rem; }
        .waitlist-success.show { display: flex; align-items: center; gap: 0.5rem; }
        .footer { padding: 2rem 0; border-top: 1px solid #e5e5e5; margin-top: 4rem; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">☕ Knowledge Café</div>
            <nav class="nav">
                <a href="#waitlist" class="nav-link">Join Waitlist</a>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1 class="hero-title">
                    Learn from the<br>
                    <span class="hero-title-accent">architects of scale</span>
                </h1>
                <p class="hero-description">
                    An AI-powered knowledge companion delivering accurate, human-curated insights from engineering blogs at Uber, Meta, Netflix, Google Cloud, and other tech giants.
                </p>
                <a href="#waitlist" class="btn">Join the Waitlist</a>
            </div>
        </section>

        <section id="waitlist" class="waitlist">
            <div class="container">
                <h2 class="waitlist-title">Join the waitlist</h2>
                <p style="margin-bottom: 1.5rem; color: #666;">Sign up for early access and stay updated on our progress.</p>
                <form class="waitlist-form" id="waitlistForm">
                    <input type="email" id="email" name="email" placeholder="your.email@company.com" required class="form-input">
                    <button type="submit" class="btn-submit">Request Access</button>
                </form>
                <div class="waitlist-success" id="successMessage">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>Thank you! We'll be in touch soon.</p>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Knowledge Café. All rights reserved.</p>
        </div>
    </footer>

    <script>
        const waitlistForm = document.getElementById('waitlistForm');
        const successMessage = document.getElementById('successMessage');
        const emailInput = document.getElementById('email');
        const WORKER_URL = window.location.href;

        if (waitlistForm) {
            waitlistForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const email = emailInput.value.trim();
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

                if (!emailRegex.test(email)) {
                    alert("Please enter a valid email address.");
                    return;
                }

                const submitBtn = waitlistForm.querySelector('.btn-submit');
                submitBtn.disabled = true;
                const originalBtnText = submitBtn.innerText;
                submitBtn.innerText = 'Requesting...';

                try {
                    const response = await fetch(WORKER_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email })
                    });

                    const result = await response.json();

                    if (response.ok) {
                        waitlistForm.style.display = 'none';
                        successMessage.classList.add('show');
                    } else {
                        alert(result.error || 'Something went wrong. Please try again.');
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalBtnText;
                    }
                } catch (error) {
                    console.error('Waitlist error:', error);
                    alert('Failed to connect to the server. Please try again later.');
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            });
        }
    </script>
</body>
</html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      });
    }

    // 2. Handle the OPTIONS (Preflight) request correctly
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 3. Handle the POST request (The actual form submission)
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

    // 4. Reject any other method (PUT, DELETE, etc.)
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders
    });
  }
};