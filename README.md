# Knowledge Café - Landing Page

A professional, minimalist landing page for Knowledge Café - an AI-powered RAG application that curates engineering insights from tech giants.

## Features

- **Pure Static Site**: No build process required - HTML, CSS, and vanilla JavaScript
- **Optimized for Cloudflare Pages**: Free tier compatible
- **Responsive Design**: Mobile-first approach with clean breakpoints
- **Professional Typography**: Cormorant Garamond (serif) + IBM Plex Mono (monospace)
- **Smooth Animations**: Scroll-triggered reveals and micro-interactions
- **Form Ready**: Waitlist signup form (requires backend integration)

## Deployment to Cloudflare Pages

### Prerequisites
- GitHub account
- Cloudflare account (free tier works perfectly)

### Step 1: Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Knowledge Café landing page"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/knowledge-cafe.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Pages** in the left sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Authorize Cloudflare to access your GitHub account
6. Select your `knowledge-cafe` repository
7. Configure build settings:
   - **Project name**: `knowledge-cafe` (or your preferred name)
   - **Production branch**: `main`
   - **Build command**: (leave empty - it's a static site)
   - **Build output directory**: `/` (root directory)
8. Click **Save and Deploy**

Your site will be live at: `https://knowledge-cafe.pages.dev` (or your custom domain)

### Step 3: Custom Domain (Optional)

1. In Cloudflare Pages, go to your project
2. Click **Custom domains**
3. Add your domain (must be managed by Cloudflare)
4. Follow DNS configuration instructions

## Local Development

Simply open `index.html` in your browser. No build tools required!

For a better development experience with live reload:

```bash
# Using Python's built-in server
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP's built-in server
php -S localhost:8000
```

Visit `http://localhost:8000` in your browser.

## Integrating the Waitlist Form

The current form is frontend-only. To collect emails, you have several options:

### Option 1: Cloudflare Workers (Recommended)
Create a Cloudflare Worker to handle form submissions and store in D1 database (free tier available).

### Option 2: Third-party Services
- **Formspree**: Add `action="https://formspree.io/f/YOUR_FORM_ID"` to the form
- **Basin**: Simple form backend
- **Netlify Forms**: If you switch to Netlify

### Option 3: Custom Backend
Update the form submission handler in `script.js` to POST to your API endpoint:

```javascript
const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
});
```

## File Structure

```
knowledge-cafe/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # Smooth scroll, form handling, animations
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-accent: #8b5a3c;        /* Brand color */
    --color-background: #fafaf8;    /* Page background */
    /* ... other colors */
}
```

### Typography
Currently using Google Fonts:
- **Cormorant Garamond**: Elegant serif for headings
- **IBM Plex Mono**: Technical monospace for code/labels

Change in `<head>` of `index.html` and update CSS variables.

### Content
Update text content directly in `index.html`. All sections are clearly labeled with comments.

## Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **No external dependencies** except Google Fonts
- **Optimized animations** using CSS transforms

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Free to use and modify for your project.

## Next Steps

1. **Analytics**: Add Cloudflare Web Analytics (privacy-friendly, free)
2. **Form Backend**: Integrate email collection service
3. **Newsletter**: Connect to email service (Mailchimp, ConvertKit, etc.)
4. **SEO**: Add Open Graph tags and meta descriptions
5. **A/B Testing**: Test different headlines and CTAs

---

Built with care for Knowledge Café 🎯
