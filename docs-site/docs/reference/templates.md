---
sidebar_position: 3
title: Template Reference
---

# Template Reference

Document templates used throughout a VIBE engagement.

## Engagement Templates

These live in `templates/` and are populated as you progress through phases.

| Template | Created In | Purpose |
|----------|-----------|---------|
| `PROJECT-CONTEXT.md` | Discover | Single source of truth — problem, personas, stakeholders, data, decisions |
| `engagement-brief.md` | Pre-engagement | Intake form with customer info, problem space, and team |
| `requirements-summary.md` | Disrupt | Customer-facing requirements with acceptance criteria — needs sign-off |
| `engineering-brief.md` | Ideate (reference template) | Structural reference for the engineer-facing brief the Ideate agent generates into `engagement/<name>/engineering-brief.md` |
| `solution-design.md` | Build | Internal technical document — architecture, tech stack, build phases |
| `CHECK-IN-NOTES.md` | Ongoing | Append-only log of customer check-in feedback and decisions |
| `PROTOTYPE-LIMITATIONS.md` | Deliver | Honest scoping of what the prototype does and doesn't do |

## Tracking Artifacts

These are auto-generated in `engagement/{{engagement-name}}/` (committed) and `.copilot-tracking/vibe/{{engagement-name}}/` (per-user state):

| File | Created By | Purpose |
|------|-----------|---------|
| `state.json` | `/vibe-kickoff` | Engagement state, readiness tracking, phase progress |
| `transcript-analysis.md` | `/vibe-transcript` | Extracted requirements, decisions, pain points from meetings |
| `discovery-summary.md` | `@VIBE Discover` | Consolidated discovery findings |
| `ideation-concepts.md` | `/vibe-ideate` | 2-3 prototype concepts with comparison |
| `selected-concept.md` | `/vibe-ideate` | Chosen concept with detailed narrative |
| `spark-prompts.md` | `/vibe-ideate` | GitHub Spark and Copilot Studio prompts |
| `engineering-brief.md` | `/vibe-ideate` | Structured handoff for the dev engineer |

## Source Materials

Drop these in `sources/`:

| Type | Examples |
|------|---------|
| Customer documents | Slide decks, RFPs, process diagrams |
| Questionnaire responses | Exported from Microsoft Forms |
| Workshop notes | Auto-created by `/vibe-capture` |
| Meeting agendas | Auto-created by `/vibe-kickoff` |
