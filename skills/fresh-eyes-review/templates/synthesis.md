<!--
  SYNTHESIS TEMPLATE — fresh-eyes
  The orchestrator writes this after all personas finish, to
  <target-repo>/fresh-eyes/_synthesis-<version>.md
  It reads every persona review for this version + the previous synthesis (for trend).
-->

# fresh-eyes synthesis — {App Name} · {YYYY-MM-DD}

- **Version:** {YYYY-MM-DD} · commit `{short-sha}`
- **Cast:** {Persona A, Persona B, …}
- **Previous version:** {YYYY-MM-DD or "none — first run"}

## Verdict in one paragraph

{2–4 sentences: the cross-persona takeaway. What's the single most important thing the maker should
do next, and what's clearly working. Plain, honest, no praise padding.}

## Scoreboard

| Reviewer | First impr. | Usability | Recommend | Overall | Δ Overall |
|---|---|---|---|---|---|
| {Persona A} | {n} | {n} | {n} | {n} | {↑/↓/— vs their last review} |
| {Persona B} | {n} | {n} | {n} | {n} | {↑/↓/—} |
| … | | | | | |
| **Average** | **{avg}** | **{avg}** | **{avg}** | **{avg}** | **{net}** |

<!-- Δ Overall = this persona's overall minus their previous-version overall (↑/↓ with the delta, — if unchanged or first run). Shows WHO moved, not just the average. -->

### Trend vs previous version
{Average overall {prev} → {now} ({+/-}). Call out the biggest mover per axis, and any persona who
regressed despite fixes. Omit if first run.}

## Top issues (ranked)

<!-- Dedupe across personas. Rank by (# personas who hit it) × (max severity). -->

| # | Issue | Severity | Hit by | Notes |
|---|---|---|---|---|
| 1 | {…} | {BLOCKER/HIGH/…} | {N personas: names} | {…} |
| 2 | {…} | {…} | {…} | {…} |

## File-ready issues

<!-- Copy-paste-able GitHub issues for the top items. One block each. -->

### Issue: {title}
```
**Reported by fresh-eyes personas:** {names}
**Severity:** {…}

**Steps to reproduce**
1. …

**Expected:** …
**Actual:** …

**Notes:** surfaced by {N} of {M} reviewers.
```

## Improvement themes

- {Theme that multiple personas asked for, with who asked.}
- {…}

## Fixed since last version

<!-- Wins to celebrate — issues that personas confirmed resolved this round. Omit if first run. -->

- ✓ {issue} — confirmed gone by {persona(s)}
