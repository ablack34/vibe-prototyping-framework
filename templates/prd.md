# Product Requirements Document — {{ENGAGEMENT_NAME}}

> **Derived artifact. Do not edit directly.**
>
> This document is **auto-generated** by `/vibe-prd` from:
>
> - [requirements-summary.md](../../templates/requirements-summary.md) — the **business half** (customer-signed)
> - [engineering-brief.md](engineering-brief.md) — the **technical half** (squad-signed)
>
> Any improvement that should land here must be folded back into one of those two halves and the PRD regenerated. Editing this file directly will be overwritten on the next regeneration.
>
> **How this document gets populated:**
> 1. `/vibe-prd` reads both halves and merges them into the structure below
> 2. `@PRD Builder` reviews the merged document and proposes improvements
> 3. The user accepts the improvements that add real value; accepted changes are written back to the appropriate half
> 4. `/vibe-prd` is re-run to regenerate this document with the updates
>
> **Last regenerated:** {{REGENERATION_TIMESTAMP}}
> **Source halves at regeneration:**
> - requirements-summary.md SHA: {{REQ_SHA}}
> - engineering-brief.md SHA: {{ENG_SHA}}

---

## 1. Executive Summary

A 3–5 sentence summary that combines the problem (from requirements-summary.md) with the proposed solution (from engineering-brief.md). Stakeholders who read nothing else read this.

{{EXECUTIVE_SUMMARY}}

## 2. Problem Statement

> Source: `requirements-summary.md` → Problem Statement

{{PROBLEM_STATEMENT}}

## 3. Target Users / Personas

> Source: `requirements-summary.md` → Target Users / Personas

| Persona | Role | Key Need |
|---------|------|----------|
| {{PERSONA_1}} | {{ROLE}} | {{NEED}} |

## 4. Proposed Solution

> Source: `engineering-brief.md` → Concept Summary

{{CONCEPT_SUMMARY}}

### 4.1 Form Factor & Stack

> Source: `engineering-brief.md` → Selected Form Factor

| Field | Value |
|-------|-------|
| Form factor | {{FORM_FACTOR}} |
| Primary stack | {{PRIMARY_STACK}} |
| Hosting target | {{HOSTING_TARGET}} |
| AI services used | {{AI_SERVICES}} |

## 5. Requirements

> Source: `requirements-summary.md` → Requirements (Must / Should / Could)

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

Each feature traces back to a Must-Have requirement in section 5.1.

1. **{{FEATURE_1}}** — {{DESCRIPTION}} (traces to req #{{REQ_ID}})
2. **{{FEATURE_2}}** — {{DESCRIPTION}} (traces to req #{{REQ_ID}})
3. **{{FEATURE_3}}** — {{DESCRIPTION}} (traces to req #{{REQ_ID}})

## 7. Success Criteria

> Source: `requirements-summary.md` → Success Criteria

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

> Sources: `requirements-summary.md` → Constraints AND `engineering-brief.md` → Hard Constraints

| Constraint | Source | Impact / Mitigation |
|------------|--------|---------------------|
| {{CONSTRAINT_1}} | business | {{IMPACT}} |
| {{CONSTRAINT_2}} | technical | {{IMPACT}} |

## 10. Integration Points

> Source: `requirements-summary.md` → Integration Points

| System | Purpose | Access Status |
|--------|---------|---------------|
| {{SYSTEM}} | {{PURPOSE}} | {{STATUS}} |

## 11. Out of Scope

> Source: `engineering-brief.md` → Explicit Non-Goals

Deliberately excluded from this prototype:

- {{NON_GOAL_1}}
- {{NON_GOAL_2}}

## 12. Demo Script

> Source: `engineering-brief.md` → Demo Script

1. Open at {{STARTING_SCREEN}}
2. Show {{INTERACTION}} — point out {{WHAT_IS_INTERESTING}}
3. Trigger {{SCENARIO}} — show how the AI {{BEHAVIOR}}
4. Close with {{SUMMARY_SCREEN}}

## 13. Open Questions

> Sources: `requirements-summary.md` → Open Questions AND `engineering-brief.md` → Open Questions for the Engineer

| # | Question | Owner | Due | Source |
|---|----------|-------|-----|--------|
| 1 | {{QUESTION}} | {{OWNER}} | {{DATE}} | business / technical |

---

## Sign-off

This combined PRD is valid when both halves are signed off. Editing this document does **not** count as sign-off — the halves are the source of truth.

| Half | Sign-off | Approver | Date |
|------|----------|----------|------|
| Business (`requirements-summary.md`) | ☐ | {{CUSTOMER_APPROVER}} | {{DATE}} |
| Technical (`engineering-brief.md`) | ☐ | {{SQUAD_LEAD}} | {{DATE}} |

---

## Validation history

Each row records a `@PRD Builder` validation pass and the improvements that were folded back to the halves.

| Date | Validator | Findings | Halves updated | Notes |
|------|-----------|----------|----------------|-------|
| {{DATE}} | @PRD Builder | {{FINDINGS}} | {{FILES}} | {{NOTES}} |
