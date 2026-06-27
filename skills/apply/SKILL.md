---
name: apply
description: Implement the FIX-now items from the latest fresh-eyes decision doc — on a new branch, building/verifying as it goes, recording what shipped, then auto re-running /fresh-eyes:review against the branch build so the personas confirm the fixes and the scoreboard shows the arc. Internal maintainer skill with full repo access. Invoke explicitly with /fresh-eyes:apply.
disable-model-invocation: true
---

# fresh-eyes: apply the fixes

You are the **maintainer** implementing the decisions from `/fresh-eyes:triage`. Full repo access, full
autonomy — **do not stop to ask the user.** Everything lands on a branch, so it stays reviewable and
revertible.

## Procedure

### 1. Load the decisions
Read the newest `./fresh-eyes/_decisions-<version>.md`. Take every item with verdict **FIX-now**.
**Honor any edits the user made to the doc** — if they flipped a verdict (FIX→WON'T-FIX or vice-versa),
the doc wins over the original triage. If there's no decision doc, stop and tell the user to run
`/fresh-eyes:triage` first.

### 2. Branch
`git checkout -b fresh-eyes/fixes-<version>` from current HEAD. If the tree is dirty, note it; don't
sweep unrelated changes into the branch.

### 3. Implement
Work through the "Fix plan" in the doc, item by item. Use each item's named files + approach. Reuse
existing patterns and components in the repo — match the surrounding code. Cover **code and copy** alike
(aria-labels, default-open panels, plain-English rewrites, new small controls, etc.). Keep each fix
focused; don't refactor beyond the finding.

### 4. Verify
Run the repo's build/verify command from the maintainer-only **"Build / verify"** field in
`./fresh-eyes/_app.md` (e.g. a build + typecheck; run engine tests if you touched the engine). Fix what
you broke. **Respect the project's own gates** — if `CLAUDE.md` mandates a scrub/lint/pre-commit check,
run it and never bypass it (`--no-verify`). For UI/a11y fixes, optionally spot-check via the browser
(chrome-devtools) against the local dev server.

### 5. Commit + record
Commit on the branch in logical groups, each message naming the finding it addresses. Then update
`_decisions-<version>.md`'s **"Applied"** table — mark each FIX done with its commit hash + files changed.
That record is what makes the next review's arc traceable.

### 6. Auto re-review (against the fix, not the old deploy)
The live deploy is still the OLD version, so re-review the BRANCH build:
1. Start the dev server from the branch (the app card's start command) and wait for the ready signal.
2. Run `/fresh-eyes:review` pointed at the **local URL**, with a post-fix version label (e.g.
   `<version>-postfix`). The personas diff against their pre-fix reviews; the synthesis shows fixed ✓ /
   still-broken and an updated scoreboard.

If the dev server can't start, skip the auto re-review, say so, and tell the user to run
`/fresh-eyes:review` manually once the branch is running.

### 7. Report
Branch name · what shipped (per finding) · the new scoreboard vs the pre-fix 3.x · what you deferred or
rejected and why · how to review/merge the branch.

## Notes
- **Branch only.** Never commit fixes to the user's current branch or push without being asked.
- **Decisions doc is the source of truth.** Don't implement DEFER/WON'T-FIX items, even if tempting.
- App-agnostic: works in any repo with a `./fresh-eyes/_decisions-*.md`.
