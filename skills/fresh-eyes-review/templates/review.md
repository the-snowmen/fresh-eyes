<!--
  REVIEW OUTPUT TEMPLATE — fresh-eyes
  A persona fills this out and returns it as text. The orchestrator writes it to
  <target-repo>/fresh-eyes/<persona-slug>/<version>.md
  Keep every section. Replace the {curly placeholders}. Drop "Since last time" on a first review.
-->

# {Persona Name} — {App Name}

- **Reviewer:** {Persona Name} ({one-line who-they-are})
- **Version:** {YYYY-MM-DD} · commit `{short-sha or "n/a"}`
- **Session:** {browser} · viewport {width×height} · URL tested {url}
- **Time spent:** {e.g. ~6 min before I'd had enough}

## In {Persona Name}'s words

> {2–5 sentences, first person, in this persona's voice. Their genuine reaction to using the app:
> what they tried, how it felt, where they got stuck or delighted. Stay in character. This is a
> stranger reacting to a live app — not an engineer describing a feature.}

## Scores (1–5)

| Axis | Score | One-line why |
|---|---|---|
| First impression | {1-5} | {…} |
| Usability | {1-5} | {…} |
| Would recommend | {1-5} | {…} |
| **Overall** | **{1-5}** | {…} |

## What I liked

- {Specific thing that worked / felt good. Tie it to something you actually did.}
- {…}

## Issues

<!-- One block per issue. Severity: BLOCKER > HIGH > MED > LOW. Ground every issue in a real action. -->

### {Issue title — short, concrete}
- **Severity:** {BLOCKER | HIGH | MED | LOW}
- **Steps:** {1. …  2. …  3. …}
- **Expected:** {what I thought would happen}
- **Saw:** {what actually happened}
- **Evidence:** {screenshot filename / console message text, if any}

### {next issue…}

## Improvements

<!-- Prioritized wishes — not bugs, but what would make this better for someone like me. -->

1. {Highest-value change for this persona.}
2. {…}

## Since last time

<!-- ONLY on a re-review. Compare against this persona's own previous review. Omit on first visit. -->

- ✓ **Fixed:** {issue from last time that's now resolved}
- ✗ **Still broken:** {issue I flagged before that's unchanged}
- ✗ **New:** {regression or new problem since last visit}
- **Score delta:** overall {prev} → {now} ({+/-})
