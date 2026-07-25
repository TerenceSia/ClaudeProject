# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, single-page marketing site for a marketing consultancy ("Meridian"). Plain HTML/CSS/JS — no framework, no build step, no package manager.

- `index.html` — all page content (nav, hero, testimonials, contact form, footer)
- `styles.css` — all styling, using CSS custom properties defined in `:root`
- `script.js` — smooth-scroll for anchor links + contact form handling

## Running / testing

There is no build step. Open `index.html` directly in a browser to view/test changes.

The contact form posts to Formspree via `fetch()`. The endpoint in `script.js` (`FORMSPREE_ENDPOINT`) is a placeholder (`https://formspree.io/f/{YOUR_FORM_ID}`) — submissions will fail with a 404 until a real Formspree form ID is substituted. This is expected; when testing form behavior, the "Sending…" state and inline error path are the observable success criteria unless a real form ID has been configured.

## Architecture notes

- **Styling is centralized in `:root` custom properties** at the top of `styles.css` (colors, fonts, spacing scale, radius, max-width). Change the palette/typography by editing these variables rather than hunting for hardcoded values throughout the file.
- **Mobile-first CSS**: base rules target mobile; the `@media (min-width: 768px)` breakpoint promotes the testimonial grid from 1 to 3 columns and adjusts nav layout. A secondary `@media (max-width: 480px)` breakpoint tightens nav spacing on very small screens.
- **`script.js` has two independent concerns**: (1) a generic smooth-scroll handler that intercepts all `a[href^="#"]` clicks and calls `scrollIntoView`, and (2) contact-form logic (client-side validation, submit-state toggling, Formspree `fetch`). Form validation errors are written into `<span class="field-error" data-error-for="...">` elements matched by field name, and invalid fields get an `.invalid` class on their parent `.form-row` for styling.
- Fonts are loaded from Google Fonts via `<link>` tags in `index.html`'s `<head>` (Playfair Display for headings, Inter for body) — there is no local font fallback bundling.
