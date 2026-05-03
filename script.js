// Smooth scroll for anchor links[cite: 2]
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- UPDATED WAITLIST FORM HANDLING FOR CLOUDFLARE D1 ---
const waitlistForm = document.getElementById('waitlistForm');
const successMessage = document.getElementById('successMessage');
const emailInput = document.getElementById('email');

// Replace with your actual Worker URL from Step 3
const WORKER_URL = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev';

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        submitBtn.disabled = false;
        submitBtn.innerText = 'Request Access';
        return; // Stop the submission
        }
        const submitBtn = waitlistForm.querySelector('.btn-submit');
        
        // 1. Disable button and show loading state
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Requesting...';
        
        try {
            // 2. Send POST request to Cloudflare Worker
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            const result = await response.json();

            if (response.ok) {
                // 3. Show success message on status 200[cite: 1, 2]
                waitlistForm.style.display = 'none';
                successMessage.classList.add('show');
            } else {
                // 4. Handle specific errors like "Email already registered"
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

// Intersection Observer for fade-in animations[cite: 2]
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and architecture steps[cite: 2]
document.querySelectorAll('.feature-card, .architecture-step, .usp-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add stagger delay to grid items[cite: 2]
document.querySelectorAll('.features-grid .feature-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

document.querySelectorAll('.architecture-step').forEach((step, index) => {
    step.style.transitionDelay = `${index * 0.15}s`;
});

document.querySelectorAll('.usp-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});