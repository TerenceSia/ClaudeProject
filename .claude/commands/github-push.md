---
description: Security-scan, commit, and push the repo to GitHub; sync README and repo About; deploy GitHub Pages via Actions
---

Run the following steps in order. Do not skip the security scan, and do not push if it turns up anything unresolved.

## 0. Setup

- Determine `owner/repo` from `git remote get-url origin`.
- Locate the GitHub CLI: try `gh --version` first; if not on PATH, fall back to `C:\Program Files\GitHub CLI\gh.exe` (or wherever `Get-Command gh` / a filesystem search turns it up). Use whichever path works for the rest of these steps.
- Run `git status` and `git diff` to see what's actually changed before touching anything.

## 1. Security scan (before staging anything)

Scan all new/modified files that are about to be committed for anything that shouldn't leave the machine:

- API keys, tokens, secrets (AWS `AKIA...`, generic `api_key`/`secret`/`token` assignments with real-looking values, private keys `-----BEGIN ... PRIVATE KEY-----`, `.env` file contents, database connection strings with embedded credentials, OAuth client secrets).
- Personal/sensitive data that doesn't belong in a public repo.
- Files that shouldn't be tracked at all (`.env`, `*.pem`, `*.key`, `credentials.json`, `id_rsa*`, editor/OS cruft).

If anything suspicious is found:
- Stop. Do not commit or push.
- Report exactly what file/line triggered it to the user and ask how to proceed (redact, remove from the diff, add to `.gitignore`, or confirm it's a placeholder and safe to keep — e.g. this repo's `FORMSPREE_ENDPOINT` placeholder is expected and fine).

If `.gitignore` is missing or doesn't already cover common secret-file patterns, add one covering at least `.env`, `.env.*`, `*.pem`, `*.key`.

Only proceed past this step once the working tree is clean of real secrets.

## 2. Create/update README.md

Read `CLAUDE.md` and the actual source files to confirm the README still matches reality (structure, run instructions, architecture notes, any Pages URL). Update it if the codebase has drifted from what's documented — don't just rubber-stamp the existing file.

## 3. Create/update the GitHub Actions Pages workflow

Ensure `.github/workflows/pages.yml` exists and deploys the static site via GitHub Actions (not the legacy branch-based Pages build):

- Trigger on push to the default branch (plus `workflow_dispatch`).
- Use `actions/upload-pages-artifact` to upload the site root (or build output, if this project ever gains a build step) and `actions/deploy-pages` to publish it.
- Grant the job `pages: write` and `id-token: write` permissions, and set the `github-pages` environment.

If the file already exists, review it against the current project structure and update rather than duplicate.

## 4. Commit and push

Stage the specific files that changed (README, workflow file, any other legitimate changes) — never `git add -A`/`git add .` blindly. Write a concise commit message describing the why. Push to the current branch's upstream.

## 5. Update the repo's About section

Using the GitHub CLI:
- Set/update the repo description (`gh repo edit <owner>/<repo> --description "..."`) to accurately reflect the project.
- Set relevant topics (`--add-topic`), replacing stale ones if the project's purpose changed.

## 6. Enable/switch GitHub Pages to Actions-based builds

- Check current Pages config: `gh api repos/<owner>/<repo>/pages`.
- If Pages isn't enabled yet, create it with `build_type=workflow` via `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow`.
- If Pages exists but is still on the legacy branch-based build, switch it: `gh api -X PUT repos/<owner>/<repo>/pages -f build_type=workflow`.
- Confirm the workflow run triggered by the push in step 4 completes (`gh run list`, `gh run watch` if useful), then re-fetch `gh api repos/<owner>/<repo>/pages` to get the live `html_url`.

## 7. Add the Pages link to the About section

Once you have the live Pages URL, set it as the repo homepage: `gh repo edit <owner>/<repo> --homepage "<pages-url>"`.

## 8. Confirm

Run `gh repo view <owner>/<repo> --json description,homepageUrl,repositoryTopics` and report back to the user: what was committed/pushed, the final description/topics/homepage, and the live Pages URL. Flag anything from the security scan that was skipped or needs follow-up.
