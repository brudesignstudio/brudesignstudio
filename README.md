# Bru Design Studio — website

A multi-page marketing site for Bru Design Studio, built as static HTML/CSS/JS (no build
step). Brand: tan `#c7a17a` + cream `#f7ead0`, the bulldog logo, Cormorant Garamond + Inter,
liquid-glass finish.

## Pages
| File | What it is |
|------|-----------|
| `index.html` | Home — the full pitch deck (hero showreel, story, work, services, FAQ) |
| `about.html` | About the studio (placeholder copy — send yours to finalize) |
| `blog.html` | Blog index (featured slot + post grid, ready for real posts) |
| `blog-post.html` | Article template — drop a post's title, body, and image in here |
| `contact.html` | Contact form (free consultation / book a demo) with spam check |
| `privacy.html` | Privacy policy (general template, not legal advice) |

Shared `styles.css` and `main.js` are loaded by every page, so a design tweak in one place
updates the whole site.

## ⭐ One thing to do: connect the contact form to your email

The contact form keeps your email address hidden — visitors never see it. To start receiving
submissions in your inbox:

1. Go to **https://web3forms.com**, enter your email, and copy the free **access key** (takes ~30 seconds, no account needed).
2. Open `contact.html`, find this line near the top of the form:
   `<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />`
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key. Save. Done.

Until then the form works but shows a friendly "not connected yet" message instead of sending.
Every submission then arrives in your inbox; your address never appears on the website.

**Spam protection:** the form has a math question ("quick spam check") plus a hidden honeypot
field. For even stronger protection later, Web3Forms can add hCaptcha.

## Filling in content
- **About:** send me your story / background and I'll replace the placeholder copy in `about.html`.
- **Blog:** send me a post (title, body, optional image) and I'll put it in `blog-post.html` and
  link it from `blog.html`. Optional images use these names in `assets/`: `blog-featured.jpg`,
  `blog-1.jpg`, `blog-post-hero.jpg` (missing images fall back gracefully).

## Hero showreel photos
Four example sites rotate in the home hero. Swap their photos by replacing these in `assets/`:
`shot-barbershop.jpg`, `shot-plumbing.jpg`, `shot-travel.jpg`, `shot-gym.jpg`.

## Hosting (free)
Static site — drag the whole folder onto **Netlify**, **Vercel**, or **Cloudflare Pages**, or
push to **GitHub Pages**. Keep all files together (the `assets/` folder, `styles.css`, `main.js`,
and the `.html` pages). The contact form works on any host once the access key is set.
