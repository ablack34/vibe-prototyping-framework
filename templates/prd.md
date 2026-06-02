# Product Requirements Document — {{ENGAGEMENT_NAME}}

> **Derived artifact. Do not edit directly.**
>
> This document is **auto-generated** by `/vibe-prd` from:
>
> - [problem-statement.md](problem-statement.md) — framed problem (Discover, customer-signed)
> - [personas.md](personas.md) — target users (Discover, customer-signed)
> - [selected-concept.md](selected-concept.md) — chosen concept + form factor + success criteria (Disrupt, customer-signed)
> - [storyboard.md](storyboard.md) — scene-by-scene narrative (Disrupt, customer-signed)
> - [future-state-journey.md](future-state-journey.md) — redesigned journey (Disrupt, customer-signed)
> - [engineering-brief.md](engineering-brief.md) — must-haves, data, constraints, demo script (engineer-written, squad-signed)
>
> Any improvement that should land here must be folded back into one of those source files and the PRD regenerated. Editing this file directly will be overwritten on the next regeneration.
>
> **How this document gets populated:**
> 1. `/vibe-prd` reads the source files and merges them into the structure below
> 2. `@PRD Builder` reviews the merged document and proposes improvements
> 3. The user accepts the improvements that add real value; accepted changes are written back to the appropriate source file
> 4. `/vibe-prd` is re-run to regenerate this document with the updates
>
> **Last regenerated:** {{REGENERATION_TIMESTAMP}}
> **Source anchors at regeneration:**
> - selected-concept.md SHA: {{CONCEPT_SHA}}
> - engineering-brief.md SHA: {{ENG_SHA}}

---

## 1. Executive Summary

A 3–5 sentence summary that combines the framed problem (from `problem-statement.md`), the chosen concept (from `selected-concept.md`), and the engineering plan (from `engineering-brief.md`). Stakeholders who read nothing else read this.

{{EXECUTIVE_SUMMARY}}

## 2. Problem Statement

> Source: `problem-statement.md`

{{PROBLEM_STATEMENT}}

## 3. Target Users / Personas

> Source: `personas.md`

| Persona | Role | Key Need |
|---------|------|----------|
| {{PERSONA_1}} | {{ROLE}} | {{NEED}} |

## 4. Proposed Solution

> Source: `selected-concept.md` → Concept Summary (with technical clarification from `engineering-brief.md` → Concept Summary if available)

{{CONCEPT_SUMMARY}}

### 4.1 Form Factor & Stack

> Source: `selected-concept.md` → Form Factor + `engineering-brief.md` → Selected Form Factor (engineering-brief wins on stack/hosting; selected-concept wins on form-factor choice)

| Field | Value |
|-------|-------|
| Form factor | {{FORM_FACTOR}} |
| Primary stack | {{PRIMARY_STACK}} |
| Hosting target | {{HOSTING_TARGET}} |
| AI services used | {{AI_SERVICES}} |

## 5. Requirements

> Source: `engineering-brief.md` → Must / Should / Could Have

### 5.1 Must Have

| # | Requirement | Acceptance Criteria | User Value |
|---|-------------|---------------------|------------|
| 1 | {{REQUIREMENT}} | {{CRITERIA}} | {{USER_VALUE}} |

### 5.2 Should Have

| # | Requirement | Acceptance Criteria | User Value |
|---|-------------|---------------------|------------|
| 1 | {{REQUIREMENT}} | {{CRITERIA}} | {{USER_VALUE}} |

### 5.3 Could Have

| # | Requirement | Notes |
|---|-------------|-------|
| 1 | {{REQUIREMENT}} | {{NOTES}} |

## 6. Must-Have Features (Build Order)

> Source: `engineering-brief.md` → Must-Have Features

Each feature traces back to a Must-Have requirement in section 5.1 AND to a scene in `storyboard.md`.

1. **{{FEATURE_1}}** — {{DESCRIPTION}} (traces to req #{{REQ_ID}} · storyboard scene #{{SCENE_ID}})
2. **{{FEATURE_2}}** — {{DESCRIPTION}} (traces to req #{{REQ_ID}} · storyboard scene #{{SCENE_ID}})
3. **{{FEATURE_3}}** — {{DESCRIPTION}} (traces to req #{{REQ_ID}} · storyboard scene #{{SCENE_ID}})

## 7. Success Criteria

> Source: `selected-concept.md` → Success Criteria (fall back to `problem-statement.md` → impact statement if missing)

How we know the prototype is successful:

1. {{SUCCESS_CRITERION_1}}
2. {{SUCCESS_CRITERION_2}}
3. {{SUCCESS_CRITERION_3}}

## 8. Data

> Source: `engineering-brief.md` → Mock Data

| Dataset | Source file | Rows | Notes |
|---------|-------------|------|-------|
| {{DATASET_1}} | {{FILE}} | {{N}} | {{NOTES}} |

## 9. Constraints

> Sources: `selected-concept.md` → Constraints (business) AND `engineering-brief.md` → Hard Constraints (technical)

| Constraint | Source | Impact / Mitigation |
|------------|--------|---------------------|
| {{CONSTRAINT_1}} | business | {{IMPACT}} |
| {{CONSTRAINT_2}} | technical | {{IMPACT}} |

## 10. Integration Points

> Source: `engineering-brief.md` → Integration Points (if any — VIBE prototypes use mock data by default)

| System | Purpose | Access Status |
|--------|---------|---------------|
| {{SYSTEM}} | {{PURPOSE}} | {{STATUS}} |

## 11. Out of Scope

> Source: `engineering-brief.md` → Explicit Non-Goals

Deliberately excluded from this prototype:

- {{NON_GOAL_1}}
- {{NON_GOAL_2}}

## 12. Demo Script

> Source: `engineering-brief.md` → Demo Script (mirrors `storyboard.md` scene order)

1. Open at {{STARTING_SCREEN}}
2. Show {{INTERACTION}} — point out {{WHAT_IS_INTERESTING}}
3. Trigger {{SCENARIO}} — show how the AI {{BEHAVIOR}}
4. Close with {{SUMMARY_SCREEN}}

## 13. Open Questions

> Sources: `engineering-brief.md` → Open Questions for the Engineer (technical) AND `workshop-record.md` → Parked Items / Action Items (business)

| # | Question | Owner | Due | Source |
|---|----------|-------|-----|--------|
| 1 | {{QUESTION}} | {{OWNER}} | {{DATE}} | business / technical |

---

## Sign-off

This combined PRD is valid when the source documents are signed off. Editing this document does **not** count as sign-off — the source documents are the source of truth.

| Source | Sign-off | Approver | Date |
|--------|----------|----------|------|
| Discover (`problem-statement.md` + `personas.md`) | ☐ | {{CUSTOMER_APPROVER}} | {{DATE}} |
| Disrupt (`selected-concept.md` + `storyboard.md` + `future-state-journey.md`) | ☐ | {{CUSTOMER_APPROVER}} | {{DATE}} |
| Engineering (`engineering-brief.md`) | ☐ | {{SQUAD_LEAD}} | {{DATE}} |

---

## Validation history

Each row records a `@PRD Builder` validation pass and the improvements that were folded back to the source files.

| Date | Validator | Findings | Source files updated | Notes |
|------|-----------|----------|----------------------|-------|
| {{DATE}} | @PRD Builder | {{FINDINGS}} | {{FILES}} | {{NOTES}} |
