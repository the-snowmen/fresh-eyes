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
excuses. This is the ONLY description a persona sees.}

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
