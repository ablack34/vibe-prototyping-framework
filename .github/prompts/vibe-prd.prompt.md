---
description: "Generate the combined VIBE PRD from the two halves (requirements-summary.md + engineering-brief.md) and run an optional @PRD Builder validation pass"
agent: "VIBE Engagement Lead"
argument-hint: "[engagement=...] [validate=true|false]"
---

# VIBE PRD

Generates the combined Product Requirements Document — a **derived artifact** that merges:

- [`templates/requirements-summary.md`](../../templates/requirements-summary.md) (the business half — customer-signed)
- [`engagement/{{engagement-name}}/engineering-brief.md`](../../engagement) (the technical half — squad-signed)

into one file at `engagement/{{engagement-name}}/prd.md`, using the structure defined in [`templates/prd.md`](../../templates/prd.md).

:::info Derived artifact
The combined PRD is **never edited directly.** If a stakeholder wants a change, the change lands in `requirements-summary.md` or `engineering-brief.md` and `/vibe-prd` is re-run. This is what stops the three documents from drifting apart.
:::

## When to use this

| Situation | Use `/vibe-prd`? |
|-----------|-------------------|
| Customer/PMO/governance requires a single PRD document | **Yes** |
| Vendor onboarding or procurement gate needs a formal PRD | **Yes** |
| Squad just wants the two halves and the engineer is happy | No — skip it |
| Two halves aren't both populated yet | No — finish Define and Ideate first |

## Inputs

- `${input:engagement}`: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.
- `${input:validate}`: (Optional, default `false`) When `true`, hand the generated PRD to `@PRD Builder` for a validation pass.

## Prerequisites

Before running, all of these must be true. If any is missing, stop and tell the user what to do first.

| Prerequisite | How to check | If missing |
|--------------|--------------|------------|
| Business half exists and is populated | `templates/requirements-summary.md` has real content (no `{{PLACEHOLDER}}` tokens in the Problem Statement) | Run `@VIBE Define` first |
| Technical half exists and is populated | `engagement/{{engagement-name}}/engineering-brief.md` has real content (Concept Summary not a placeholder) | Run `/vibe-ideate` first |
| Engagement folder exists | `engagement/{{engagement-name}}/` is present | Run `/vibe-kickoff` first |

## Required Steps

### Step 1: Resolve engagement and validate prerequisites

1. Resolve the engagement name (use `${input:engagement}` or auto-detect if only one folder under `engagement/`).
2. Run the prerequisite checks above. If any fails, stop with a single clear error pointing at the corrective action.

### Step 2: Read the two halves

Read both source files in full:

- `templates/requirements-summary.md`
- `engagement/{{engagement-name}}/engineering-brief.md`

If either file looks like an unfilled template (contains more than 3 `{{PLACEHOLDER}}` tokens), stop and report which fields are missing.

### Step 3: Compute source SHAs

Compute SHA-1 hashes of both source files (first 8 characters is enough). These get embedded in the generated PRD's header so anyone reading it can tell whether the halves have changed since the last regeneration.

### Step 4: Generate the combined PRD

Read `templates/prd.md` as the structural template. Produce `engagement/{{engagement-name}}/prd.md` by merging the two halves into the template's 13 sections:

| PRD Section | Sourced from |
|-------------|--------------|
| 1. Executive Summary | **Synthesized** — 3-5 sentences combining the problem (req-summary §Problem Statement) and the proposed solution (eng-brief §Concept Summary). This is the only section that requires LLM synthesis; everything else is structural merging. |
| 2. Problem Statement | `requirements-summary.md` → Problem Statement |
| 3. Target Users / Personas | `requirements-summary.md` → Target Users / Personas |
| 4. Proposed Solution | `engineering-brief.md` → Concept Summary |
| 4.1 Form Factor & Stack | `engineering-brief.md` → Selected Form Factor |
| 5.1 Must Have | `requirements-summary.md` → Requirements / Must Have |
| 5.2 Should Have | `requirements-summary.md` → Requirements / Should Have |
| 5.3 Could Have | `requirements-summary.md` → Requirements / Could Have |
| 6. Must-Have Features | `engineering-brief.md` → Must-Have Features. **Annotate each feature with the requirement # it traces to.** If a feature cannot be traced to a Must-Have requirement, flag it as an issue rather than silently emitting it. |
| 7. Success Criteria | `requirements-summary.md` → Success Criteria |
| 8. Data | `engineering-brief.md` → Mock Data |
| 9. Constraints | **Merged** — both halves contribute. Tag each row with `business` or `technical` in the Source column. |
| 10. Integration Points | `requirements-summary.md` → Integration Points |
| 11. Out of Scope | `engineering-brief.md` → Explicit Non-Goals |
| 12. Demo Script | `engineering-brief.md` → Demo Script |
| 13. Open Questions | **Merged** — both halves contribute. Tag each row with `business` or `technical` in the Source column. |

**Header substitutions:**

- `{{ENGAGEMENT_NAME}}` → the engagement display name (from `state.json` or kebab-case folder name)
- `{{REGENERATION_TIMESTAMP}}` → ISO-8601 UTC timestamp
- `{{REQ_SHA}}`, `{{ENG_SHA}}` → the SHAs computed in Step 3

**Hard rules:**

- Do not invent content that is not in one of the halves (except the Executive Summary, which is synthesized).
- Do not silently drop content from the halves. If a section in a half does not map to a PRD section, surface it as an "Unmapped content" warning in the post-generation summary.
- Append a new row to the **Validation history** table only when Step 5 actually runs.

### Step 5: Optional — `@PRD Builder` validation pass

If `${input:validate}` is `true`, do this. Otherwise skip to Step 6.

1. Tell the user a validation pass is starting and what `@PRD Builder` will do (completeness audit, cohesion audit, narrative polish suggestions).
2. Hand the generated `engagement/{{engagement-name}}/prd.md` to `@PRD Builder` for review. Frame the request as: *"Review this derived PRD for completeness, cohesion, and narrative quality. Do not edit the file. Return a list of suggested improvements, each tagged with which source half it should be folded back into (`requirements-summary.md`, `engineering-brief.md`, or `derived-only` for synthesis improvements like the executive summary)."*
3. Present each suggestion to the user as a single Yes/No/Defer prompt. Accumulate the accepted suggestions.
4. For each accepted suggestion:
   - If tagged `requirements-summary.md` or `engineering-brief.md`: apply the change to the source half. Do NOT write the change into `prd.md` directly.
   - If tagged `derived-only` (e.g., a better executive summary phrasing): hold it, then re-emit the PRD in step 6 with that improvement incorporated as part of the synthesis.
5. After all accepted suggestions are applied, re-run Step 4 (regenerate the PRD with fresh SHAs and timestamp). Append a Validation history row recording the date, findings count, halves updated, and a one-line note.

### Step 6: Present and direct next step

Present a summary to the user with:

- Path to the generated PRD
- Word count and section count
- The source SHAs that were embedded
- Any "Unmapped content" warnings from Step 4
- If validation ran: how many suggestions were proposed, accepted, deferred, rejected; which halves were updated
- A reminder that future edits must land in the halves, not in `prd.md`

End with a `👉 NEXT` directive:

- If validation did not run: `👉 NEXT: Share engagement/{{engagement-name}}/prd.md with the stakeholder who requested it. If you want @PRD Builder to review it for quality improvements, re-run with /vibe-prd validate=true.`
- If validation ran and halves were updated: `👉 NEXT: Review the updates in requirements-summary.md / engineering-brief.md, get re-sign-off if material, then share the updated PRD with the stakeholder.`
- If validation ran but no changes were accepted: `👉 NEXT: The PRD is validated and ready. Share engagement/{{engagement-name}}/prd.md with the stakeholder.`

## Out of scope

- This prompt does not modify `templates/prd.md` (that is the structural template — engagement-specific changes go to the generated file under `engagement/`).
- This prompt does not perform customer sign-off. Sign-off remains on the two halves.
- This prompt does not auto-publish the PRD anywhere (no email, no SharePoint upload). Distribution is manual.
