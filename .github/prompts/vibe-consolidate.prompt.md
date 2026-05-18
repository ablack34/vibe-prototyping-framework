---
description: "Consolidate all engagement findings into structured decisions and requirements"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...]"
---

# VIBE Consolidate

Reads all engagement artifacts and consolidates them into a structured decision log and updated requirements. This addresses the core pain point of synthesizing scattered information.

:::tip When to use this vs Start Discovery
- **🔍 Start Discovery** is the *first pass* — read raw `sources/` and questionnaire responses, populate `PROJECT-CONTEXT.md` and `discovery-summary.md`. Use it when entering the Discover phase.
- **`/vibe-consolidate`** is the *reconciliation pass* — after several check-ins, multiple workshops, or contradictory updates have piled up. It looks across `PROJECT-CONTEXT.md`, `CHECK-IN-NOTES.md`, `requirements-summary.md`, transcripts, and discovery output to dedupe, flag contradictions, and refresh the decision log.
:::

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Read all engagement artifacts:
   - `templates/PROJECT-CONTEXT.md`
   - `templates/CHECK-IN-NOTES.md`
   - `templates/requirements-summary.md` (if exists)
   - `engagement/{{engagement-name}}/transcript-analysis.md` (if exists)
   - `engagement/{{engagement-name}}/discovery-summary.md` (if exists)
   - Any research files in `.copilot-tracking/research/`
2. Identify all decisions made across artifacts and consolidate into the Decision Log in PROJECT-CONTEXT.md, deduplicating and resolving conflicts.
3. Identify all requirements mentioned across artifacts, deduplicate, and update the Requirements Summary section of PROJECT-CONTEXT.md.
4. Flag contradictions between sources (e.g., check-in feedback that conflicts with original requirements).
5. List all open questions with their source and status.
6. Present a summary: total decisions, requirements (by priority), open questions, and any contradictions found.
7. Recommend next steps based on the engagement phase.
