---
name: fresh-eyes-loop
description: Run the whole fresh-eyes cycle end to end, hands-off — review (personas test the app) → triage (decide fix/defer/won't-fix) → apply (implement on a branch) → auto re-review (personas confirm). The conductor that chains the other three skills. Use when you want one command to take feedback all the way to fixed-and-verified. Invoke explicitly with /fresh-eyes:fresh-eyes-loop.
disable-model-invocation: true
---

# fresh-eyes: the full loop

This is the **conductor**. It runs the complete cycle by invoking the other three skills in order. Use it
when you want the hands-off path: feedback in, fixes-on-a-branch out. For the controlled path (inspecting
the decision doc before any code changes), run `review`, `triage`, and `apply` separately instead.

## What it chains

```
review  →  triage  →  apply  →  (apply auto-re-reviews)
strangers   maintainer  maintainer    strangers come back
find it     decides     fixes it      and confirm
```

The skills hand off through files in `./fresh-eyes/`, not through each other directly:
- `review` writes `<persona>/<version>.md` + `_synthesis-<version>.md`
- `triage` reads those, writes `_decisions-<version>.md`
- `apply` reads the decisions, edits code on a branch, updates the "Applied" table, then re-runs `review`

So the decision doc IS the bridge between deciding and doing — and you can stop the loop at any seam.

## Procedure

1. **Review (unless fresh).** If `./fresh-eyes/` has no review for today's version, run `/fresh-eyes:fresh-eyes-review`
   first. If a current-version review already exists, skip straight to triage (don't burn the browser
   agents twice).
2. **Triage.** Run `/fresh-eyes:fresh-eyes-triage` to produce `_decisions-<version>.md`.
3. **Checkpoint (announce, don't block).** Print the triage tally (X fix / Y defer / Z won't-fix) and the
   branch that's about to be created, so the user can interrupt if they want to edit verdicts. Then
   proceed — this skill is the hands-off path by design.
4. **Apply.** Run `/fresh-eyes:fresh-eyes-apply`, which implements the FIX-now items on `fresh-eyes/fixes-<version>`,
   verifies/builds, records what shipped, and auto re-reviews against the branch build.
5. **Report the arc.** Summarize: pre-fix scoreboard → post-fix scoreboard, what shipped, what was
   deferred/rejected, and the branch to review/merge.

## Notes
- **Stop anywhere.** Because every handoff is a file in `./fresh-eyes/`, you can run the loop once and
  then take over manually — edit `_decisions-*.md`, re-run just `apply`, etc.
- **Cost.** A full loop spends the browser-driving persona agents twice (initial + re-review) plus the
  code edits. For a quick decision-only pass, run `/fresh-eyes:fresh-eyes-triage` alone.
- Same isolation model as the parts: `review` is walled off; `triage`/`apply` are the internal maintainer.
