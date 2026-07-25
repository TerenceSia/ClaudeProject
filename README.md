# Meridian Marketing Site

A static, single-page marketing site for Meridian, a marketing consultancy. Plain HTML/CSS/JS — no framework, no build step, no package manager.

**Live site:** https://terencesia.github.io/ClaudeProject/ (deployed automatically via GitHub Actions on every push to `main`)

## Structure

- `index.html` — page content: nav, hero, testimonials, contact form, footer
- `styles.css` — all styling, driven by CSS custom properties defined in `:root`
- `script.js` — smooth-scroll for anchor links + contact form handling (validation, submit state, Formspree submission)

## Running locally

There's no build step — just open `index.html` directly in a browser.

## Contact form

The form posts to [Formspree](https://formspree.io) via `fetch()`. Replace the placeholder `FORMSPREE_ENDPOINT` in `script.js` with a real Formspree form ID before submissions will succeed in production.

## Customizing

Colors, fonts, spacing, radius, and max-width are all centralized as CSS custom properties at the top of `styles.css` — edit those rather than hunting for hardcoded values throughout the file.
