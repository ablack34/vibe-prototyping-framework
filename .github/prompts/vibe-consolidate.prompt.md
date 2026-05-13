---
description: "Consolidate all engagement findings into structured decisions and requirements"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...]"
---

# VIBE Consolidate

Reads all engagement artifacts and consolidates them into a structured decision log and updated requirements. This addresses the core pain point of synthesizing scattered information.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Read all engagement artifacts:
   - `templates/PROJECT-CONTEXT.md`
   - `templates/CHECK-IN-NOTES.md`
   - `templates/requirements-summary.md` (if exists)
   - `.copilot-tracking/vibe/{{engagement-name}}/transcript-analysis.md` (if exists)
   - `.copilot-tracking/vibe/{{engagement-name}}/discovery-summary.md` (if exists)
   - Any research files in `.copilot-tracking/research/`
2. Identify all decisions made across artifacts and consolidate into the Decision Log in PROJECT-CONTEXT.md, deduplicating and resolving conflicts.
3. Identify all requirements mentioned across artifacts, deduplicate, and update the Requirements Summary section of PROJECT-CONTEXT.md.
4. Flag contradictions between sources (e.g., check-in feedback that conflicts with original requirements).
5. List all open questions with their source and status.
6. Present a summary: total decisions, requirements (by priority), open questions, and any contradictions found.
7. Recommend next steps based on the engagement phase.
