---
description: "Generate the combined VIBE PRD from the Discover deliverables (problem-statement, personas) + Disrupt deliverables (selected-concept, storyboard, future-state-journey) + engineering-brief, and run an optional @PRD Builder validation pass"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...] [validate=true|false]"
---

# VIBE PRD

Generates the combined Product Requirements Document — a **derived artifact** that merges:

- [`engagement/{{engagement-name}}/problem-statement.md`](../../engagement) — the framed problem (Discover, customer-signed)
- [`engagement/{{engagement-name}}/personas.md`](../../engagement) — target users (Discover, customer-signed)
- [`engagement/{{engagement-name}}/selected-concept.md`](../../engagement) — chosen concept + form factor + success criteria (Disrupt, customer-signed)
- [`engagement/{{engagement-name}}/storyboard.md`](../../engagement) — scene-by-scene narrative (Disrupt, customer-signed)
- [`engagement/{{engagement-name}}/future-state-journey.md`](../../engagement) — redesigned journey (Disrupt, customer-signed)
- [`engagement/{{engagement-name}}/engineering-brief.md`](../../engagement) — must-haves, data, constraints, non-goals, demo script (engineer-written, squad-signed)

into one file at `engagement/{{engagement-name}}/prd.md`, using the structure defined in [`templates/prd.md`](../../templates/prd.md).

:::info Derived artifact
The combined PRD is **never edited directly.** If a stakeholder wants a change, the change lands in the appropriate source file and `/vibe-prd` is re-run. This is what stops the source documents from drifting apart.
:::

## When to use this

| Situation | Use `/vibe-prd`? |
|-----------|-------------------|
| Customer/PMO/governance requires a single PRD document | **Yes** |
| Vendor onboarding or procurement gate needs a formal PRD | **Yes** |
| Squad just wants the source documents and the engineer is happy | No — skip it |
| Disrupt deliverables aren't all populated yet | No — finish Disrupt first |
| The engineer hasn't written `engineering-brief.md` yet | No — Design & Develop's first task is to write it |

## Inputs

- `${input:engagement}`: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.
- `${input:validate}`: (Optional, default `false`) When `true`, hand the generated PRD to `@PRD Builder` for a validation pass.

## Prerequisites

Before running, all of these must be true. If any is missing, stop and tell the user what to do first.

| Prerequisite | How to check | If missing |
|--------------|--------------|------------|
| Discover deliverables exist | `personas.md` and `problem-statement.md` exist in `engagement/{{engagement-name}}/` with real content | Run `@VIBE Discover` first |
| Disrupt deliverables exist | `selected-concept.md`, `storyboard.md`, `future-state-journey.md` exist in `engagement/{{engagement-name}}/` with real content (signed off) | Run `@VIBE Disrupt` first |
| Engineering brief exists | `engagement/{{engagement-name}}/engineering-brief.md` exists with real content (Concept Summary not a placeholder, must-haves filled in) | Engineer's first Design & Develop task is to write this — ask them to draft it from selected-concept.md + storyboard.md + future-state-journey.md |
| Engagement folder exists | `engagement/{{engagement-name}}/` is present | Run `/vibe-kickoff` first |

## Required Steps

### Step 1: Resolve engagement and validate prerequisites

1. Resolve the engagement name (use `${input:engagement}` or auto-detect if only one folder under `engagement/`).
2. Run the prerequisite checks above. If any fails, stop with a single clear error pointing at the corrective action.

### Step 2: Read the source documents

Read all 6 source files in full:

- `engagement/{{engagement-name}}/problem-statement.md`
- `engagement/{{engagement-name}}/personas.md`
- `engagement/{{engagement-name}}/selected-concept.md`
- `engagement/{{engagement-name}}/storyboard.md`
- `engagement/{{engagement-name}}/future-state-journey.md`
- `engagement/{{engagement-name}}/engineering-brief.md`

If any of these looks like an unfilled template (contains more than 3 `{{PLACEHOLDER}}` tokens), stop and report which fields are missing.

### Step 3: Compute source SHAs

Compute SHA-1 hashes (first 8 characters) of the **two anchor sources** that drive sign-off:

- `selected-concept.md` SHA → `{{CONCEPT_SHA}}` (the customer's signed-off scope)
- `engineering-brief.md` SHA → `{{ENG_SHA}}` (the engineer's signed-off technical plan)

These get embedded in the generated PRD's header so anyone reading it can tell whether the canonical halves have changed since the last regeneration. The `/vibe-doctor` freshness check compares these two SHAs.

### Step 4: Generate the combined PRD

Read `templates/prd.md` as the structural template. Produce `engagement/{{engagement-name}}/prd.md` by merging the source documents into the template's 13 sections:

| PRD Section | Sourced from |
|-------------|--------------|
| 1. Executive Summary | **Synthesized** — 3-5 sentences combining the framed problem (`problem-statement.md`), the chosen concept (`selected-concept.md` → Concept Summary), and the engineering plan (`engineering-brief.md` → Concept Summary). This is the only section that requires LLM synthesis; everything else is structural merging. |
| 2. Problem Statement | `problem-statement.md` (verbatim block — the 5-blank format) |
| 3. Target Users / Personas | `personas.md` (one row per persona — name, role, key need) |
| 4. Proposed Solution | `selected-concept.md` → Concept Summary (or `engineering-brief.md` → Concept Summary if it adds technical clarification) |
| 4.1 Form Factor & Stack | `selected-concept.md` → Form Factor + `engineering-brief.md` → Selected Form Factor (engineering-brief wins on stack/hosting; selected-concept wins on form-factor choice) |
| 5.1 Must Have | `engineering-brief.md` → Must-Have Features (priority order) — each entry frames the feature as a requirement with acceptance criteria derived from the corresponding storyboard scene |
| 5.2 Should Have | `engineering-brief.md` → "Should Have" section if present; otherwise omit the table and add "_No Should-Have requirements captured — Disrupt deliberately scoped to Must-Haves._" |
| 5.3 Could Have | `engineering-brief.md` → "Could Have" section if present; otherwise omit the table and add "_No Could-Have requirements captured — the parked items in `workshop-record.md` are candidates for the post-prototype backlog._" |
| 6. Must-Have Features (Build Order) | `engineering-brief.md` → Must-Have Features. **Annotate each feature with the storyboard scene # it demonstrates.** If a feature cannot be traced to a storyboard scene, flag it as an issue rather than silently emitting it. |
| 7. Success Criteria | `selected-concept.md` → Success Criteria (preferred — the customer signed off on these). Fall back to `problem-statement.md` → "which results in [impact]" if `selected-concept.md` doesn't have a Success Criteria section. |
| 8. Data | `engineering-brief.md` → Mock Data |
| 9. Constraints | **Merged** — `selected-concept.md` → Constraints (business) + `engineering-brief.md` → Hard Constraints (technical). Tag each row with `business` or `technical` in the Source column. |
| 10. Integration Points | `engineering-brief.md` → Integration Points if present; otherwise omit the table and add "_No external integrations — the prototype is self-contained on mock data (per VIBE prototype rule)._" |
| 11. Out of Scope | `engineering-brief.md` → Explicit Non-Goals |
| 12. Demo Script | `engineering-brief.md` → Demo Script (should mirror the storyboard scene order) |
| 13. Open Questions | **Merged** — `engineering-brief.md` → Open Questions for the Engineer (technical) + `workshop-record.md` → Parked Items / Action Items if available (business). Tag each row with `business` or `technical` in the Source column. |

**Header substitutions:**

- `{{ENGAGEMENT_NAME}}` → the engagement display name (from `state.json` or kebab-case folder name)
- `{{REGENERATION_TIMESTAMP}}` → ISO-8601 UTC timestamp
- `{{CONCEPT_SHA}}`, `{{ENG_SHA}}` → the SHAs computed in Step 3

**Hard rules:**

- Do not invent content that is not in one of the source files (except the Executive Summary, which is synthesized).
- Do not silently drop content from the source files. If a section in a source file does not map to a PRD section, surface it as an "Unmapped content" warning in the post-generation summary.
- Append a new row to the **Validation history** table only when Step 5 actually runs.

### Step 5: Optional — `@PRD Builder` validation pass

If `${input:validate}` is `true`, do this. Otherwise skip to Step 6.

1. Tell the user a validation pass is starting and what `@PRD Builder` will do (completeness audit, cohesion audit, narrative polish suggestions).
2. Hand the generated `engagement/{{engagement-name}}/prd.md` to `@PRD Builder` for review. Frame the request as: *"Review this derived PRD for completeness, cohesion, and narrative quality. Do not edit the file. Return a list of suggested improvements, each tagged with which source file it should be folded back into (`personas.md`, `problem-statement.md`, `selected-concept.md`, `storyboard.md`, `future-state-journey.md`, `engineering-brief.md`, or `derived-only` for synthesis improvements like the executive summary)."*
3. Present each suggestion to the user as a single Yes/No/Defer prompt. Accumulate the accepted suggestions.
4. For each accepted suggestion:
   - If tagged with a Discover or Disrupt source file (`personas.md`, `problem-statement.md`, `selected-concept.md`, `storyboard.md`, `future-state-journey.md`): apply the change ONLY after warning the user that these are customer-signed-off artifacts — confirm with the user that the change is significant enough to warrant re-sign-off. Do NOT write the change into `prd.md` directly.
   - If tagged `engineering-brief.md`: apply the change directly (it's an engineering deliverable; engineer + squad lead sign off, not customer).
   - If tagged `derived-only` (e.g., a better executive summary phrasing): hold it, then re-emit the PRD in step 6 with that improvement incorporated as part of the synthesis.
5. After all accepted suggestions are applied, re-run Step 4 (regenerate the PRD with fresh SHAs and timestamp). Append a Validation history row recording the date, findings count, source files updated, and a one-line note.

### Step 6: Present and direct next step

Present a summary to the user with:

- Path to the generated PRD
- Word count and section count
- The source SHAs that were embedded (CONCEPT_SHA + ENG_SHA)
- Any "Unmapped content" warnings from Step 4
- If validation ran: how many suggestions were proposed, accepted, deferred, rejected; which source files were updated
- A reminder that future edits must land in the source files, not in `prd.md`

End with a `👉 NEXT` directive:

- If validation did not run: `👉 NEXT: Share engagement/{{engagement-name}}/prd.md with the stakeholder who requested it. If you want @PRD Builder to review it for quality improvements, re-run with /vibe-prd validate=true.`
- If validation ran and source files were updated: `👉 NEXT: Review the updates in the source files, get re-sign-off if material (customer for Discover/Disrupt files, squad lead for engineering-brief.md), then share the updated PRD with the stakeholder.`
- If validation ran but no changes were accepted: `👉 NEXT: The PRD is validated and ready. Share engagement/{{engagement-name}}/prd.md with the stakeholder.`

## Out of scope

- This prompt does not modify `templates/prd.md` (that is the structural template — engagement-specific changes go to the generated file under `engagement/`).
- This prompt does not perform customer sign-off. Sign-off remains on the source documents (Discover deliverables, Disrupt deliverables, engineering brief).
- This prompt does not auto-publish the PRD anywhere (no email, no SharePoint upload). Distribution is manual.
