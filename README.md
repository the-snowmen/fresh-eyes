# fresh-eyes

**A cast of fictional outside users who review your app — honestly, and without ever seeing your code.**

fresh-eyes is a [Claude Code](https://claude.com/claude-code) plugin. Run `/fresh-eyes:review` in any
project and a cast of personas opens your running app **in a real browser**, actually uses it, and each
writes up:

- **what they liked**,
- **issues / bugs** they hit (with repro steps + severity), and
- **improvements** they want,

each with **1–5 scores**. A synthesis pass rolls it all into a **scoreboard** with the top issues and
file-ready GitHub issues.

## Why "fresh eyes"

The people who build an app can't un-know how it works. They use the right words, click the right things,
and excuse the rough edges they already know about. Real first-time users do none of that — and that's
exactly where the useful feedback lives.

So every persona here is **walled off from your project**:

- **No filesystem access.** Persona subagents are restricted to browser tools only — they *cannot* read
  your code, your `CLAUDE.md`, your README, or each other's notes. They judge only the live app.
- **No memory.** They don't carry your assistant's memory or context. Every reviewer is a stranger.
- **A clean session each.** Each persona opens a fresh page with cleared `localStorage`, so nobody
  inherits another's leftover state.

The orchestrator hands each persona only your app's **public blurb + a URL** — the same thing a stranger
on your landing page would have. Their confusion is the data.

## The cast

| Persona | Lens | Cares about |
|---|---|---|
| **Domain expert** *(adaptive)* | Power-user / SME | Becomes a specialist in **your app's field** (from the card's Domain) — correctness, export, the terms and standards that field lives by |
| **Marcus Bell** | Non-technical stakeholder | Clarity, onboarding, jargon — "what am I supposed to do here?" |
| **Priya Nair** | Recruiter / hiring manager | First impression, load speed, console errors, polish — portfolio signal |
| **Dev Okafor** | Accessibility & mobile | Keyboard nav, screen-reader labels, contrast, touch, responsive layout |
| **Ada Reyes** *(example)* | Concrete GIS analyst | A worked instance of the domain expert for spatial apps — swap in for GIS, or copy as a model for your own named SME |

The **domain expert** adapts to any field — point fresh-eyes at a tax app and it reviews like an
accountant; at a GIS app and it reviews like a spatial analyst. The card's **Domain** line tells it who
to become. **Ada Reyes** ships as a concrete, fully-written example of that pattern for GIS/spatial apps.

Each persona is a deep character with their own goals, pet peeves, and voice — so the reviews read like
four different humans, not one model wearing hats. [Add your own →](#adding-personas)

## Requirements

- Claude Code (v2.1.x or newer).
- **A browser MCP — already bundled, nothing to install or configure.** The plugin ships
  [`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp) inside its own
  `plugin.json` (`mcpServers`), so installing the plugin brings the browser engine with it (pulled via
  `npx` on first use). You do **not** wire up Playwright MCP or any other server yourself — and you don't
  need a pre-existing browser MCP in your setup. You only need a Chromium/Chrome binary on the machine for
  it to drive.
- The target app must be reachable: a live URL, or a local dev server fresh-eyes can start.
- For `triage`/`apply`: a git repo (fixes land on a branch) and a build/verify command in the app card.

## Install

```bash
# add this repo as a plugin marketplace, then install
/plugin marketplace add the-snowmen/fresh-eyes
/plugin install fresh-eyes
```

Then, from inside any project:

```bash
/fresh-eyes:review
```

The first run in a repo will ask you a few questions to create an **app card**
(`fresh-eyes/_app.md`) — the app's name, a public blurb, and a URL. After that, just re-run.

```bash
/fresh-eyes:review                       # whole cast reviews the running app
/fresh-eyes:review ada-reyes dev-okafor  # a subset
/fresh-eyes:review --version 2026-07-01  # override the version stamp

/fresh-eyes:triage                       # decide fix / defer / won't-fix → a decision doc
/fresh-eyes:apply                        # implement the keepers on a branch + auto re-review
/fresh-eyes:loop                         # run the whole cycle hands-off (review→triage→apply→re-review)
```

> Updating an existing install to get the new skills: `/plugin update fresh-eyes` (or
> `/plugin marketplace update fresh-eyes` then reload). The `triage`/`apply`/`loop` skills appear once the
> plugin is on **v0.2.0+**.

## What you get

Reviews are written into the **target repo** under a gitignored `fresh-eyes/` folder (your code repo
stays clean; the criticism stays private):

```
your-app/fresh-eyes/            # gitignored
  _app.md                       # the app card (name, public blurb, URLs)
  ada-reyes/2026-06-26.md       # one review per persona per version
  marcus-bell/2026-06-26.md
  priya-nair/2026-06-26.md
  dev-okafor/2026-06-26.md
  _synthesis-2026-06-26.md      # scoreboard + ranked issues + trend
```

Each review has a first-person narrative in the persona's voice, 1–5 scores, Liked / Issues /
Improvements, and — on repeat visits — a **"Since last time"** section.

## Act on the feedback

Reviews are only half the loop. Two companion skills read the feedback and *do something about it* — and
they are the deliberate **inverse of the personas**: where the personas are walled-off strangers, these
run as the **internal maintainer** with full repo access (read your `CLAUDE.md`, grep the code, edit
files, run git and your build). Trusted, opinionated, and allowed to say "no" with a reason.

```bash
/fresh-eyes:triage   # decide what to do about each finding, then…
/fresh-eyes:apply    # implement the keepers on a branch + auto re-review
```

- **`/fresh-eyes:triage`** reads the latest reviews, grounds each finding in your actual code, weighs it
  against your app's **target audience** (a maintainer-only section of the app card), and writes a
  decision doc — every finding marked **FIX-now**, **DEFER**, or **WON'T-FIX**, each with a rationale.
  The WON'T-FIX list is the point: not every piece of feedback is worth implementing, and the doc says
  so honestly. Edit the verdicts if you disagree.
- **`/fresh-eyes:apply`** implements the FIX-now items **on a new branch** (`fresh-eyes/fixes-<date>`),
  builds/verifies, records what shipped, then **auto re-runs `/fresh-eyes:review`** against the branch
  build so the personas confirm the fixes and the scoreboard updates.

The full loop: **review → triage → apply → (auto) re-review** — strangers find the problems, the
maintainer decides and fixes, the strangers come back and notice. Both halves are full-auto; the safety is
that triage and apply are separate steps (read the decision doc between them) and every fix lands on a
branch you review before merging.

## The story arc

fresh-eyes remembers **each persona's own past reviews of your app**. Run it again after you ship a fix
and the personas notice:

> ✓ **Fixed:** the buffer is accurate now.
> ✗ **Still broken:** still no export.
> **Score delta:** overall 2 → 3.

The synthesis scoreboard tracks the trend version over version — so you can watch the scores climb as you
improve. Re-run after changes; that's where the value compounds.

## How isolation actually works

| Guarantee | How it's enforced |
|---|---|
| Personas can't read your repo | Each persona subagent's `tools:` is locked to `mcp__plugin_fresh_eyes_chrome_devtools__*` — browser tools only. No Read/Write/Bash/Grep. |
| Personas have no memory | Subagents don't receive the assistant's auto-memory; each starts blank. |
| Personas don't see internals | The orchestrator passes only your public blurb + a URL — never code, docs, or rationale. |
| Personas don't contaminate each other | Sequential runs, fresh page + cleared `localStorage` per persona. |

One honest caveat: a project's `CLAUDE.md` can still be injected into any subagent's context by the
harness. Each persona's prompt explicitly orders it to disregard internal notes and stay in character as
an outsider. It's the one isolation that's instructed rather than hard-walled — so keep genuinely secret
material out of `CLAUDE.md`, as you should anyway.

## Adding personas

Copy [`skills/review/templates/persona.md`](skills/review/templates/persona.md) to
`agents/<your-slug>.md`, write a distinct human (keep the `tools:` line — it's the isolation wall), and
add the slug to the cast table in [`skills/review/SKILL.md`](skills/review/SKILL.md). A persona earns its
place only if its review couldn't have come from anyone else.

## Using it on a different app

fresh-eyes is app-agnostic. In a new repo, run `/fresh-eyes:review`, answer the app-card questions, and
the same cast reviews a completely different app — no plugin changes. The starter cast leans toward
data/GIS tools (Ada); swap or add personas to fit your domain.

## Layout

```
fresh-eyes/
  .claude-plugin/
    plugin.json          # manifest + bundled chrome-devtools MCP server
    marketplace.json     # lets this repo be installed directly as a 1-plugin marketplace
  agents/                # the cast — isolated, browser-only subagents
    ada-reyes.md  marcus-bell.md  priya-nair.md  dev-okafor.md
  skills/
    review/SKILL.md      # /fresh-eyes:review  — personas review the running app (external)
    triage/SKILL.md      # /fresh-eyes:triage  — decide fix / defer / won't-fix  (internal)
    apply/SKILL.md       # /fresh-eyes:apply   — implement fixes on a branch + re-review (internal)
    loop/SKILL.md        # /fresh-eyes:loop    — run the whole cycle hands-off (conductor)
    */templates/         # app-card, review, synthesis, persona, decisions templates
  LICENSE                # MIT
```

## Credits

Built by [@the-snowmen](https://github.com/the-snowmen) with **Claude Code** (Claude Opus 4.8) as a
pair-programming contributor — design, persona authoring, and the review/triage/apply loop.

## License

MIT — see [LICENSE](LICENSE).
