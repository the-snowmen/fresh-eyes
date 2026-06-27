<!--
  DECISION DOC TEMPLATE — fresh-eyes :triage
  Written to <target-repo>/fresh-eyes/_decisions-<version>.md
  This doc is the contract /fresh-eyes:apply implements. The maker may edit verdicts before applying.
-->

# fresh-eyes decisions — {App Name} · {version}

- **Source reviews:** `_synthesis-{version}.md` + {N} persona reviews
- **Target audience (from app card):** {who this app is for / non-goals — how feedback was weighed}
- **Tally:** {X} FIX-now · {Y} DEFER · {Z} WON'T-FIX

## Decisions

| # | Issue | Sev | Hit by | Verdict | Effort | Target files | Rationale |
|---|---|---|---|---|---|---|---|
| 1 | {…} | {BLOCKER/HIGH/…} | {personas} | {FIX-now/DEFER/WON'T-FIX} | {S/M/L} | {path(s) or —} | {one line} |
| 2 | … | | | | | | |

## Won't-fix, and why

<!-- The honest no's. Every one gets a real reason tied to the audience/non-goals or a design choice. -->

- **{Issue}** — {why this isn't worth implementing for THIS product. Be specific and fair.}

## Deferred backlog

<!-- Real and worth doing, but too big or design-heavy for this pass. -->

- **{Issue}** — {what it would take; why it's later, not now.}

## Fix plan

<!-- One block per FIX-now item. Concrete enough that :apply just executes it. -->

### FIX {#}: {short title}
- **Finding:** {the persona finding, condensed}
- **Files:** {exact path(s)}
- **Change:** {the specific edit / approach — what to add or modify, reusing existing patterns}
- **Verify:** {how to confirm it worked — build, a11y snapshot, a specific interaction}

### FIX {#}: …

## Applied

<!-- :apply fills this in after implementing, so the arc is traceable. Leave empty after triage. -->

| # | Status | Commit | Files changed |
|---|---|---|---|
| | | | |
