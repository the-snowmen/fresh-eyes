---
name: fresh-eyes-add-persona
description: Interactively create a new fresh-eyes review persona — interview the user for the character (who they are, the one question they obsess over, pet peeves, voice), then scaffold the agent file from the template with the isolation contract intact. Invoke with /fresh-eyes:fresh-eyes-add-persona.
disable-model-invocation: true
---

# fresh-eyes: add a persona

Build a new reviewer persona by interviewing the user, then write the agent file correctly — the
`tools:` isolation line and the shared "Operating rules" block are the things that are easy to break by
hand, so this skill exists to get them right.

## 1. Choose where it lands (confirm with the user)

- **Project mode (default):** write to `./.claude/agents/<slug>.md` in the user's current repo. Best for a
  persona tailored to *this* app — it survives plugin updates and is invoked by slug. The persona still
  gets the browser tools (the plugin's MCP tool names resolve globally while fresh-eyes is installed).
- **Shipped-cast mode:** only if the cwd IS the fresh-eyes plugin repo (there's a
  `./.claude-plugin/plugin.json` whose `name` is `fresh-eyes`, and a `skills/fresh-eyes-review/` dir).
  Then offer to write to `agents/<slug>.md` and add the persona to the default cast (step 4). This ships
  to everyone on the next release.

Detect which applies, state your assumption, and let the user override.

## 2. Interview (a few focused rounds)

Gather everything the template needs. Push for what makes this persona's review *unique* — a persona only
earns its place if its review couldn't have come from any other. Ask for:

- **Name** and a kebab-case **slug** (the slug is what you type after the review command).
- **Who they are** — age, role, background, and temperament (patient/blunt, what they respect, what they
  won't tolerate).
- **The one question** they want answered when they open the app — their lens, theirs alone.
- **How they explore** — the first thing they reach for; what they push on / try to break; what they
  notice that others wouldn't.
- **Pet peeves**, **what makes them rage-quit**, **what delights them**.
- **Their voice** — cadence, vocabulary, how blunt, what they quote.
- **Domain** (if a specialist) and **viewport focus** (desktop / mobile / both).

If the user is vague, offer a concrete draft from the app context and let them refine — don't ship a
generic persona.

## 3. Scaffold the file

Read the template `${CLAUDE_PLUGIN_ROOT}/skills/fresh-eyes-review/templates/persona.md` and produce the
new agent file:

- **Frontmatter:** `name: <slug>`; `description:` in the standard form — `External reviewer persona —
  {Name}, a {one-line who} who judges {their lens}. Use when running a fresh-eyes review as the {lens}
  lens.`; **copy the `tools:` line verbatim** (`mcp__plugin_fresh-eyes_chrome-devtools__*`) — it is the
  isolation wall.
- **Body:** fill every `{placeholder}` section (Who you are / Why you opened this / How you explore / Pet
  peeves / What makes you rage-quit / What delights you / Your voice) from the interview, in the
  persona's own voice.
- **Keep the entire "Operating rules (every review)" block verbatim** — it's the same contract for every
  persona (browser-only, start clean, ground every issue, output format).
- Remove the template's `HOW TO ADD A CAST MEMBER` comment.

Write it to the destination chosen in step 1.

## 4. Shipped-cast mode only — register it

Add a row to the cast table in `${CLAUDE_PLUGIN_ROOT}/skills/fresh-eyes-review/SKILL.md`:
`| `<slug>` | <one-line lens> |`. (Project-mode personas are not added to the table — they're invoked by
slug.)

## 5. Report

Give the file path and how to run it:
```
/fresh-eyes:fresh-eyes-review <slug>            # this persona alone
/fresh-eyes:fresh-eyes-review <slug> marcus-bell  # with others
```
Note that a no-arg `/fresh-eyes:fresh-eyes-review` runs only the default cast, so a project-mode persona
is invoked explicitly by slug.

## Notes
- **Never weaken the isolation contract.** The `tools:` line and Operating rules are non-negotiable —
  a persona that could read the repo isn't a fresh-eyes persona.
- You write the persona file only; you don't run a review here. Point the user at the review command.
