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
| `engagement-brief.md` | Preparation | **S42-internal brief** — commercial context, squad, success metrics, risks, sponsor map |
| `customer-brief.md` | Preparation | **Customer-voice brief** — the problem in the customer's own words, who feels it, what "great" looks like, existing investments, constraints |
| `PROJECT-CONTEXT.md` | Discover | Single source of truth — problem, personas, stakeholders, data, decisions |
| `requirements-summary.md` | Define | **Business half of the PRD** — customer-facing requirements with acceptance criteria, needs sign-off |
| `engineering-brief.md` | Ideate (reference template) | **Technical half of the PRD** — structural reference for the engineer-facing brief the Ideate agent generates into `engagement/<name>/engineering-brief.md` |
| `solution-design.md` | Build | Internal technical document — architecture, tech stack, build phases |
| `CHECK-IN-NOTES.md` | Ongoing | Append-only log of customer check-in feedback and decisions |
| `PROTOTYPE-LIMITATIONS.md` | Deliver | Honest scoping of what the prototype does and doesn't do |

## What about a PRD?

VIBE produces a Product Requirements Document in **two parts** so each half can be signed off by its own audience:

| Half | File | Audience | Signed off by |
|------|------|----------|---------------|
| **Business** | `requirements-summary.md` | Customer / product owner | Customer approver before Ideate begins |
| **Technical** | `engineering-brief.md` | Build engineer | The squad before Build begins |

Together they cover everything a typical PRD does — problem, personas, prioritized requirements, acceptance criteria, success metrics, form factor, mock data, features, non-goals, demo script, and open questions. Keeping them separate means the customer signs off on *what* without needing to review *how*, and the engineer signs off on *how* without needing to re-read every requirement narrative.

### Need a single combined PRD?

When an engagement requires one polished document (governance gate, customer PMO, vendor onboarding), VIBE supports a **derived single-doc PRD** pattern. The two halves stay canonical — the combined PRD is generated from them, validated by `@PRD Builder`, and any improvements get folded back into the halves rather than the combined doc.

```
SOURCE OF TRUTH                    DERIVED ARTIFACT
───────────────────              ───────────────────────────────────
requirements-summary.md  ─┐
                          ├──▶  prd.md (single combined PRD)
engineering-brief.md     ─┘         ↑
                                    │
                              validated by
                                    │
                              @PRD Builder
                              (proposes improvements;
                               only those that add real
                               value are folded back to
                               the halves and the PRD is
                               regenerated)
```

**Design rule:** the combined PRD is a *derived artifact*. Never edit it directly. Edits land in `requirements-summary.md` or `engineering-brief.md` and the combined PRD is regenerated. This is what stops the three documents from drifting out of sync.

Generate the combined PRD with `/vibe-prd`. The structural template lives at `templates/prd.md`; the generated output lands at `engagement/<name>/prd.md` and embeds source SHAs so `/vibe-doctor` can warn if it's stale.

To also run a quality-review pass while generating, use `/vibe-prd validate=true` — this hands the generated PRD to `@PRD Builder`, which proposes improvements; accepted improvements are folded back into the appropriate half and the PRD is regenerated.

`@PRD Builder` is documented in [the agents reference](agents.md).

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
| `prd.md` | `/vibe-prd` (optional) | **Derived combined PRD** — merges `requirements-summary.md` + `engineering-brief.md` into a single document. Only generated when a stakeholder requires it. |

## Source Materials

Drop these in `sources/`:

| Type | Examples |
|------|---------|
| Customer documents | Slide decks, RFPs, process diagrams |
| Questionnaire responses | Exported from Microsoft Forms |
| Workshop notes | Auto-created by `/vibe-capture` |
| Meeting schedule | `sources/meeting-templates.md` — full 4-week schedule (kickoff, 2× discover, disrupt workshop, 2× check-in, handoff), auto-created by `/vibe-kickoff` or `/vibe-schedule` |
| Customer research | `sources/research/customer-public.md` (Task Researcher, public web) and `sources/research/m365-researcher-results.md` (paste-back from M365 Copilot's Researcher), synthesised by `/vibe-research` into `sources/research/research-summary.md` |
