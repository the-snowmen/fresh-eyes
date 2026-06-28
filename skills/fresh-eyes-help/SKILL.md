---
name: fresh-eyes-help
description: Quick-reference card for the fresh-eyes plugin — every command, what it does, the order to run them, common args, and the files produced. One-shot display, not a workflow. Invoke with /fresh-eyes:fresh-eyes-help.
disable-model-invocation: true
---

# fresh-eyes — quick reference

Display this card to the user (adapt lightly if they asked about one specific command). Don't run any
review or touch files — this is help only.

---

**fresh-eyes** has a cast of fictional outside-user personas open your *running* app in a real browser,
use it, and write honest reviews — what they liked, bugs they hit, scores. Personas are walled off from
your code/docs, so the feedback stays uncontaminated.

## Commands (in workflow order)

| Command | Does | Output |
|---|---|---|
| `/fresh-eyes:fresh-eyes-review` | **Start here.** Personas test the running app, score it, write reviews + a synthesis scoreboard | `fresh-eyes/<persona>/<date>.md`, `_synthesis-<date>.md` |
| `/fresh-eyes:fresh-eyes-decide` | You (maintainer) read the reviews and rule each finding **FIX-now / DEFER / WON'T-FIX**, grounded in the code | `fresh-eyes/_decisions-<date>.md` |
| `/fresh-eyes:fresh-eyes-apply` | Implements the FIX-now items **on a branch**, builds/verifies, then auto re-reviews to confirm | branch `fresh-eyes/fixes-<date>` + updated scores |
| `/fresh-eyes:fresh-eyes-run` | **Hands-off:** runs review → decide → apply → re-review in one go | branch + final scoreboard |
| `/fresh-eyes:fresh-eyes-help` | This card | — |

## Typical flow

Controlled (recommended first time):
```
/fresh-eyes:fresh-eyes-review        # personas test the app
/fresh-eyes:fresh-eyes-decide        # rule each finding fix/defer/won't-fix
  → 👉 edit fresh-eyes/_decisions-<date>.md if you disagree with any verdict
/fresh-eyes:fresh-eyes-apply         # land the fixes on a branch + re-review
```
Hands-off:
```
/fresh-eyes:fresh-eyes-run           # all of the above in one command
```

## Args

- **Subset the cast:** `/fresh-eyes:fresh-eyes-review dev-okafor marcus-bell`
- **Override version label:** `/fresh-eyes:fresh-eyes-review --version 2026-07-01`
- **Re-apply after editing the decision doc:** `/fresh-eyes:fresh-eyes-apply --continue`

Default cast (no args): `domain-expert` (adapts to your app's field), `marcus-bell` (non-technical
clarity), `priya-nair` (recruiter / first impression), `dev-okafor` (a11y + mobile). `ada-reyes` is a
shipped GIS example you can swap in.

## First run

`/fresh-eyes:fresh-eyes-review` asks for an **app card** (name, public blurb, live/local URL, start
command, viewports) and saves it to `fresh-eyes/_app.md`. After that, just re-run.

## Good to know

- **Personas see only the public blurb + URL** — never your code, docs, or memory. Their confusion is the data.
- **The decision doc is your safety valve** — edit verdicts in `_decisions-<date>.md` before `apply`.
- **Re-runs build the story** — run again after fixes and personas call out what changed; the scoreboard trend is the payoff.
- **Add a persona:** copy `agents/<slug>.md`, edit it, add the slug to the cast table in the review skill.
- Everything is written under `./fresh-eyes/` (gitignored).
