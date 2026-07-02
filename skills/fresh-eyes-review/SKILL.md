---
name: fresh-eyes-review
description: Run a fresh-eyes external-user review. A cast of fictional outside-user personas open the target app in a real browser, use it, and each writes an honest review (liked / issues / improvements / 1–5 scores); then a synthesis with a scoreboard is produced. Personas are isolated from the repo, so feedback stays uncontaminated. Invoke explicitly with /fresh-eyes:fresh-eyes-review.
disable-model-invocation: true
---

# fresh-eyes: external-user review

You are the **orchestrator**. You run in the main loop of whatever repo the user is in. You have full
tool access (Bash, Read, Write, git, and the ability to launch subagents). The **personas** are separate
bundled subagents that can ONLY drive a browser — they never touch the filesystem. Your job is to set
the stage, run each persona, collect what they return, write it to disk, and synthesize.

## The cast (default: the four below)

| Slug | Lens |
|---|---|
| `domain-expert` | **Adaptive** power-user — becomes an SME for the app's field (from the card's Domain) |
| `marcus-bell` | Non-technical stakeholder — clarity, onboarding, jargon |
| `priya-nair` | Recruiter / hiring manager — first impression, console health, polish |
| `dev-okafor` | Accessibility & mobile — keyboard, screen-reader, contrast, touch |
| `ada-reyes` | *(example)* a concrete GIS analyst — a worked instance of `domain-expert` for spatial apps |

`/fresh-eyes:fresh-eyes-review` with no args runs the default four (`domain-expert`, `marcus-bell`, `priya-nair`,
`dev-okafor`). `domain-expert` adapts to any field; **`ada-reyes` is a shipped example** you can swap in
for GIS/spatial apps (`/fresh-eyes:fresh-eyes-review ada-reyes marcus-bell …`) or copy as a model for your own
named expert. The user may name any subset or pass `--version <label>` to override the version stamp.

## Where things live

- **Templates** (read these from the plugin): `${CLAUDE_PLUGIN_ROOT}/skills/fresh-eyes-review/templates/`
  — `app-card.md`, `review.md`, `synthesis.md`, `persona.md`.
- **Outputs** (write these into the *target* repo, never the plugin):
  `./fresh-eyes/_app.md`, `./fresh-eyes/<slug>/<version>.md`, `./fresh-eyes/_synthesis-<version>.md`.

## The isolation contract — do not break it

Personas must react like strangers. When you build a persona's task prompt, pass **only**:
- the app's **public blurb** and a **URL**, the **viewport(s)** to test, the **review template**, the
  **version label**, and that **persona's own prior reviews** (if any).
- **For `domain-expert` only:** also include the card's **Domain** line, so it can become the right kind
  of specialist. (The Domain describes the app's field — it's public-facing context, not internals.)

Never pass a persona: the repo's code, `CLAUDE.md`, READMEs, design docs, your own knowledge of how the
app works, another persona's reviews, or any internal vocabulary. If you know an explanation for a
behavior, keep it to yourself — the persona's confusion is the data. Each persona starts a clean browser
session (fresh page + cleared localStorage) so it never sees another persona's leftover state.

## Procedure

### 0. Preflight
- Confirm you're in the target repo (a git repo is expected for the version stamp; if not, you'll stamp
  by date only).
- Confirm the browser MCP is available (this plugin bundles `chrome-devtools`; persona tools are named
  `mcp__plugin_fresh-eyes_chrome-devtools__*`). If the browser server isn't reachable, tell the user how
  to enable it and stop.

### 1. App card — find or scaffold
- Read `./fresh-eyes/_app.md`. If it exists, use it.
- If it's missing: create `./fresh-eyes/`, copy `${CLAUDE_PLUGIN_ROOT}/skills/fresh-eyes-review/templates/app-card.md`
  into `./fresh-eyes/_app.md`, and fill it by **asking the user** for: app name, a one-paragraph public
  blurb (landing-page voice, no internals), live URL and/or local URL, the local start command + ready
  signal, viewports to test, and any auth notes. Write the completed card.
- Ensure `./fresh-eyes/` is gitignored in the target repo. If `.gitignore` doesn't already cover it, add
  a `/fresh-eyes/` line (tell the user you did). Reviews are for the maker, not the public repo.

### 2. Make the app reachable
- Prefer the **live URL**. Do a quick reachability check.
- If only a local URL exists, run the card's **start command in the background**, then poll until the
  **ready signal** appears (or the URL responds). Record the URL the personas will use.

### 3. Version stamp
- `version` = today's date `YYYY-MM-DD` (run `date +%F` if unsure), unless the user passed `--version`.
- If in a git repo, capture `git rev-parse --short HEAD` and include it in each file's header. If the
  working tree is dirty, note `(dirty)` so the stamp isn't misleading.
- **Overwrite warning:** if `./fresh-eyes/_decisions-<version>.md` already exists for this version label,
  warn the user before proceeding — re-running the cycle and then `/fresh-eyes:fresh-eyes-decide` will
  regenerate that doc, losing any hand-edited verdicts. Suggest either backing up the doc or passing
  `--version <label>-2` (or a `-postfix` label) so the old decisions stay intact.

### 4. Run each persona — SEQUENTIALLY
Personas share one browser, so never run two at once. For each selected slug, in order:
1. Read that persona's prior reviews from `./fresh-eyes/<slug>/` (newest first), if any exist.
2. Read the review template `${CLAUDE_PLUGIN_ROOT}/skills/fresh-eyes-review/templates/review.md`.
3. Launch the persona subagent (its **agent type is the slug**, e.g. `ada-reyes`). Its task prompt =
   the **public blurb + URL**, the **viewport(s)**, the **review template**, the **version label**, and
   its **own prior reviews** (or "first visit"). Instruct it to start a clean session, use the app for
   real, and **return its completed review as text**.
4. Take the text the persona returns and write it verbatim to `./fresh-eyes/<slug>/<version>.md`
   (create the folder if needed). Do not edit its voice; you may only fix an obviously malformed header.
5. If a persona reports it could not reach or load the app, save what it returned and continue — that
   failure is itself a finding (especially for `priya-nair`).

### 5. Synthesize
- Read every `<slug>/<version>.md` you just wrote, plus the most recent prior `_synthesis-*.md` (for the
  trend), and the template `${CLAUDE_PLUGIN_ROOT}/skills/fresh-eyes-review/templates/synthesis.md`.
- Write `./fresh-eyes/_synthesis-<version>.md`: one-paragraph verdict, the **scoreboard** (per-persona
  axes + averages, plus each persona's **Δ overall vs their last review**), **trend vs previous version**, **top issues ranked** by (#personas-hit × max
  severity) deduped across personas, **file-ready issue blocks** for the top items, **improvement
  themes**, and **fixed-since-last-version** wins.

### 6. Report
Tell the user, briefly: the scoreboard, the top 3 issues, the biggest score delta vs last version (if
any), and the paths to the new files. Don't paste whole reviews — point to them.

## Notes
- **Sequential is intentional.** It keeps the browser sane and gives each persona a clean session.
- **Re-runs build the story.** Running again later writes new dated files; personas see their own past
  reviews and call out what you fixed. The scoreboard trend is the payoff — encourage re-runs after
  changes.
- **Adding personas:** easiest is `/fresh-eyes:fresh-eyes-add-persona` — it interviews you and scaffolds
  the agent file with the `tools:` isolation line + Operating-rules block intact. Manual: drop a new
  `agents/<slug>.md` (copy `templates/persona.md`) and add the slug to the cast table above.
