# Meridian Marketing Site

A static, single-page marketing site for Meridian, a marketing consultancy. Plain HTML/CSS/JS — no framework, no build step, no package manager.

**Live site:** https://terencesia.github.io/ClaudeProject/ (deployed automatically via GitHub Actions on every push to `main`)

![Screenshot of the Meridian marketing site](assets/screenshot.png)

## Structure

- `index.html` — page content: nav, hero, testimonials, contact form, footer
- `styles.css` — all styling, driven by CSS custom properties defined in `:root`
- `script.js` — smooth-scroll for anchor links + contact form handling (validation, submit state, FormSubmit submission)

## Running locally

There's no build step — just open `index.html` directly in a browser.

## Contact form

The form posts to [FormSubmit](https://formsubmit.co) via `fetch()`, delivering enquiries to the address configured in `FORMSUBMIT_ENDPOINT` in `script.js`. FormSubmit requires a one-time confirmation: the first real submission to a given address triggers an activation email that must be clicked before further submissions are delivered.

## Customizing

Colors, fonts, spacing, radius, and max-width are all centralized as CSS custom properties at the top of `styles.css` — edit those rather than hunting for hardcoded values throughout the file.
