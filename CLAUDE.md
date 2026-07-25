# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, single-page marketing site for a marketing consultancy ("Meridian"). Plain HTML/CSS/JS — no framework, no build step, no package manager.

- `index.html` — all page content (nav, hero, testimonials, contact form, footer)
- `styles.css` — all styling, using CSS custom properties defined in `:root`
- `script.js` — smooth-scroll for anchor links + contact form handling

## Running / testing

There is no build step. Open `index.html` directly in a browser to view/test changes.

The contact form posts to FormSubmit via `fetch()`. The endpoint in `script.js` (`FORMSUBMIT_ENDPOINT`) is `https://formsubmit.co/ajax/terence.sia@gmail.com` — no signup required, but FormSubmit holds the first submission to a new address pending a one-time confirmation email that must be clicked before delivery starts working. Until that confirmation happens, submissions will still return a success response from FormSubmit (or land pending) but won't reach the inbox yet.

## Architecture notes

- **Styling is centralized in `:root` custom properties** at the top of `styles.css` (colors, fonts, spacing scale, radius, max-width). Change the palette/typography by editing these variables rather than hunting for hardcoded values throughout the file.
- **Mobile-first CSS**: base rules target mobile; the `@media (min-width: 768px)` breakpoint promotes the testimonial grid from 1 to 3 columns and adjusts nav layout. A secondary `@media (max-width: 480px)` breakpoint tightens nav spacing on very small screens.
- **`script.js` has two independent concerns**: (1) a generic smooth-scroll handler that intercepts all `a[href^="#"]` clicks and calls `scrollIntoView`, and (2) contact-form logic (client-side validation, submit-state toggling, FormSubmit `fetch`). Form validation errors are written into `<span class="field-error" data-error-for="...">` elements matched by field name, and invalid fields get an `.invalid` class on their parent `.form-row` for styling.
- Fonts are loaded from Google Fonts via `<link>` tags in `index.html`'s `<head>` (Playfair Display for headings, Inter for body) — there is no local font fallback bundling.
