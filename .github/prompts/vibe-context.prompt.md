---
description: "Synthesize or refresh PROJECT-CONTEXT.md from sources — the single source of truth the Discover deliverables ground in"
agent: "VIBE Discover"
argument-hint: "[engagement=...]"
---

# VIBE Project Context

Produce `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` — the engagement's **single source of truth**. Every Discover deliverable (`personas.md`, `problem-statement.md`, `current-state-journey.md`) reads this file, so it must be synthesized **before** them. This is the headless, web-surface equivalent of what `/vibe-kickoff` seeds and `@VIBE Discover` fills: read every source and fill the context, don't ask the user to type it in.

This is **source-first**: read everything in `sources/` (plus both briefs if present) before writing any field. Never fabricate. Where the sources don't answer a field, mark it `[needs follow-up]` rather than inventing a value.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read all sources

Read everything that could ground the context:

- Any prior `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` (amend it — never discard fields that are already filled and correct)
- `engagement/{{engagement-kebab}}/customer-brief.md` (the customer's voice — names, problem framing, desired outcomes in their language)
- `engagement/{{engagement-kebab}}/engagement-brief.md` (the Studio 42 internal view — squad, commercial context, stakeholders, risks)
- Every transcript, questionnaire response, and document in `sources/` (named people, roles, current process, pains, systems, data)
- `sources/research/research-summary.md` (industry/customer research from Preparation)
- `sources/meeting-templates.md` (dates, participants)

### Step 2 — Synthesize the context

Copy `templates/PROJECT-CONTEXT.md` to `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` (if it doesn't already exist) and fill every section the sources support:

- **§1 Engagement Overview** — customer, project name, dates, lead, status (`Discover`). Pull names/dates from the briefs and `sources/meeting-templates.md`.
- **§2 Squad** — only roles the sources actually name. Leave unknown rows as `[needs follow-up]`.
- **§3 Problem Statement** — the one-line summary, target users, business impact, current state, desired outcome. Ground each in a source. (The canonical formal statement stays in `problem-statement.md` — link to it, don't duplicate it.)
- **§5 Data Available** — any customer data files mentioned in sources. If none yet, `[needs follow-up]`.
- **§6 Stakeholders** — named individuals + authority tier, from the briefs/transcripts.
- **§7 Key Decisions** — any decisions captured in sources, with their source.
- **§9 Requirements Summary** — Must/Should/Could + constraints the sources support.
- **§10 Open Questions** — genuine gaps you hit while synthesizing (anything you marked `[needs follow-up]` becomes a row here).
- **§11 Session Resume Prompt** — fill the customer/project names.

**Leave §4 Tech Stack untouched** — it is determined after the Disrupt workshop and filled by the engineer in Design & Develop. Leave the **§8 personas summary** and **§8.5 journey summary** as links to their canonical files; those tables are maintained by `/vibe-personas` and `/vibe-current-journey` once those deliverables exist.

### Step 3 — Ground every claim

For any non-obvious field, keep a short source trace (e.g. a trailing `— sources/kickoff-call.md`) so the designer can see where it came from. Do not invent customer names, metrics, dates, or quotes. If the sources conflict, prefer the customer-authored source and note the conflict in §10 Open Questions.

### Step 4 — Present and ask for review

Summarize what you synthesized: how many sections you filled, which fields are still `[needs follow-up]`, and the single most useful source to add next to close the biggest gap. End with one directive:

- If the core fields (§1, §3, §6) are filled: `👉 NEXT: Project context is synthesized. Generate your Discover deliverables — start with Personas — and they'll ground in this file.`
- If key fields are still open: `👉 NEXT: Context is synthesized but {field(s)} are open. Add {the most useful missing source} to sources/ and re-synthesize, or proceed to Personas and refine later.`

## Notes

- This is the **prerequisite** for the three Discover deliverables — their prompts read `PROJECT-CONTEXT.md` "if filled", so synthesize it first to ground them.
- Re-running is safe — already-filled, correct fields are preserved; new sources amend or extend them.
- This prompt **only** writes `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md`. It never modifies `templates/PROJECT-CONTEXT.md` (the blank scaffold) and never grades a gate — PROJECT-CONTEXT.md is the input the graded deliverables build on, not a gated deliverable itself.
