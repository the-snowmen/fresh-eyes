<!--
  APP CARD TEMPLATE — fresh-eyes
  Copied into a target repo as fresh-eyes/_app.md the first time you run /fresh-eyes:review there.
  This card is read by the ORCHESTRATOR. Only the "Public blurb" + a URL are ever passed to a persona.
  NEVER put internal architecture, schema names, or design rationale here — personas must stay naive.
-->

# App card: {App Name}

## Public blurb
{One short paragraph describing what the app is, the way you'd describe it to a stranger on its landing
page. Public-facing only. No tech stack internals, no "we use X under the hood", no known-limitation
excuses. This is the description every persona sees.}

## Domain
{The field this app serves + what a power user in it cares about — e.g. "GIS / spatial analysis;
practitioners care about projection correctness, export, and verifiable counts" or "personal finance;
users care about accuracy, reconciliation, and trust". The `domain-expert` persona reads this and becomes
a concrete expert from this field. One or two sentences. Leave as "general consumer app" if there's no
specialist audience.}

## URLs
- **Live:** {https://… or "none"}
- **Local:** {http://localhost:PORT or "none"}

> The orchestrator prefers the live URL. If only a local URL exists, it starts the dev server first.

## Start command (local only)
```
{e.g. cd apps/web && npm install && npm run dev   — or "n/a, use live URL"}
```
- **Ready signal:** {string/URL that means the server is up, e.g. "Local:   http://localhost:5173/"}

## Version stamp
- **Source:** {git short SHA + today's date  |  date only}

## What to test
- **Viewports:** {e.g. desktop 1440×900; mobile 390×844}
- **Auth:** {none  |  notes — keep credentials OUT of this file}
- **Entry point:** {which URL/path a first-time visitor lands on}

## Persona notes (optional)
{Anything a real outside user would legitimately know before arriving — e.g. "linked from a portfolio
site", "shared as a demo". Keep it to what a stranger would actually know. Leave blank for a cold visit.}

<!-- ============================================================================
  MAINTAINER-ONLY — read by /fresh-eyes:triage and /fresh-eyes:apply.
  NEVER passed to a persona (the review orchestrator only sends the blurb + a URL).
  Put product intent and build commands here freely; personas never see this file.
============================================================================ -->

## Target audience / non-goals
- **Audience:** {who this app is really for — e.g. "GIS professionals" / "non-technical managers" /
  "recruiters viewing a portfolio". This is how triage weighs conflicting persona feedback.}
- **Non-goals:** {things you deliberately are NOT optimizing for — e.g. "not a mobile-first tool",
  "domain jargon is acceptable for this audience". A persona complaint that hits a non-goal is a
  defensible WON'T-FIX.}

## Build / verify
```
{command(s) triage/apply run to confirm a change is sound — e.g. cd apps/web && npm run build}
```
- **Extra gates:** {any project check that must pass — e.g. a scrub/lint/pre-commit hook. Apply runs
  these and never bypasses them.}
- **Touch-the-engine tests:** {command to run only if a deeper layer is modified — or "n/a".}
