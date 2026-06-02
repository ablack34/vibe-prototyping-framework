---
description: "Reconciliation pass — flag contradictions and refresh the decision log without rewriting signed-off artifacts"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...]"
---

# VIBE Consolidate

Reads engagement artifacts across phases and **reconciles** them — updates ONLY the Decision Log and Open Questions sections of `PROJECT-CONTEXT.md`, and flags conflicts that need human resolution. **Never silently rewrites signed-off artifacts** (personas, problem statement, current/future-state journeys, selected concept, storyboard, engineering brief).

:::tip When to use this vs Start Discovery
- **🔍 Start Discovery** is the *first pass* — read raw `sources/` and questionnaire responses, populate `PROJECT-CONTEXT.md` and `discovery-summary.md`. Use it when entering the Discover phase.
- **`/vibe-consolidate`** is the *reconciliation pass* — after several check-ins, multiple workshops, or contradictory updates have piled up. It looks across all engagement artifacts to refresh the decision log, surface open questions, and flag contradictions for the team to resolve.
:::

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.

## Requirements

1. Read all engagement artifacts (skip any that don't exist — do not fabricate content for missing files):
   - `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md`
   - `engagement/{{engagement-kebab}}/CHECK-IN-NOTES.md` (or `templates/CHECK-IN-NOTES.md` on older engagements)
   - `engagement/{{engagement-kebab}}/discovery-summary.md`
   - `engagement/{{engagement-kebab}}/transcript-analysis.md`
   - `engagement/{{engagement-kebab}}/personas.md`
   - `engagement/{{engagement-kebab}}/problem-statement.md`
   - `engagement/{{engagement-kebab}}/current-state-journey.md`
   - `engagement/{{engagement-kebab}}/workshop-record.md`
   - `engagement/{{engagement-kebab}}/selected-concept.md`
   - `engagement/{{engagement-kebab}}/future-state-journey.md`
   - `engagement/{{engagement-kebab}}/storyboard.md`
   - `engagement/{{engagement-kebab}}/engineering-brief.md`
   - Any research files in `sources/research/` and `.copilot-tracking/research/`

2. **Reconcile the Decision Log.** Walk every artifact and extract decisions (explicit `Decision:` lines, sign-off lines, workshop-record decisions, check-in-note resolutions). Deduplicate by topic. Update ONLY the Decision Log section of `PROJECT-CONTEXT.md` to reflect the merged set. Preserve attribution (source artifact + date).

3. **Reconcile the Open Questions list.** Walk every artifact and extract open questions (parked items, `TODO:` flags, unresolved sponsor questions, engineering brief questions, workshop-record action items). Deduplicate. Update ONLY the Open Questions section of `PROJECT-CONTEXT.md` to reflect the merged set with source + owner + status.

4. **Flag contradictions** — do NOT silently resolve them. Surface conflicts where two artifacts disagree (e.g. selected-concept says "AI summarises", check-in notes say "AI generates"; problem-statement target user differs from personas primary persona; engineering-brief must-have feature not traceable to a storyboard scene). List each contradiction with:
   - **Topic** — what disagrees
   - **Source A** — file + line/section + the claim
   - **Source B** — file + line/section + the claim
   - **Suggested resolution** — a recommendation, but **the user picks**
   - **Owner** — who should resolve it (CPM / PM / UXE / Engineer)

5. **Do NOT modify any of these signed-off artifacts:**
   - `personas.md`, `problem-statement.md`, `current-state-journey.md`
   - `selected-concept.md`, `storyboard.md`, `future-state-journey.md`, `workshop-record.md`
   - `engineering-brief.md`
   - If a contradiction implies one of these files should change, flag it as an open question and tell the user which prompt to re-run (e.g. `/vibe-personas`, `/vibe-selected-concept`, or "have the engineer update engineering-brief.md").

6. **Present a summary** at the end:
   - Total decisions (new vs existing)
   - Total open questions (new vs existing)
   - Total contradictions (with a one-line tldr each)
   - Files read vs files skipped (missing)
   - Recommended next step — usually either "resolve contradiction X" or the phase-appropriate next button.

7. End with a specific NEXT directive pointing at the highest-priority follow-up (resolve a contradiction, re-run a Discover/Disrupt prompt to refresh a stale artifact, or move forward to the next phase if everything reconciled cleanly).
