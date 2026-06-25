# Engineering Brief

> **Technical deliverable. Written by the engineer as their first Design & Develop task.**
>
> Pair with the Disrupt customer-signed artifacts — [selected-concept.md](selected-concept.md), [storyboard.md](storyboard.md), [future-state-journey.md](future-state-journey.md) — and the Discover deliverables (personas + problem-statement) for a complete picture of what to build.
>
> **Reference template.** The actual engineering brief for an engagement lives at `engagement/{{engagement-kebab}}/engineering-brief.md`. The engineer drafts it by hand from the Disrupt outputs above (the contract handed by the workshop). This file in `templates/` exists so engineers know what a good brief looks like — fields, ordering, and tone.
>
> **How to use:**
> 1. Read `selected-concept.md`, `storyboard.md`, and `future-state-journey.md` (the Disrupt contract)
> 2. Copy this scaffold into `engagement/{{engagement-kebab}}/engineering-brief.md`
> 3. Fill it in. Every must-have feature must trace to a storyboard scene.
> 4. Squad lead signs off. The combined PRD (`/vibe-prd`) consumes this as the technical anchor.

---

## Concept Summary

A 2-3 sentence description of what the prototype demonstrates, written for engineers. Build on the concept summary in `selected-concept.md` and add technical clarification — e.g. clarify which AI capability is in scope and what data path it follows.

{{CONCEPT_SUMMARY}}

## Selected Form Factor

> The form factor was chosen during the Disrupt workshop; this section captures the engineering implications.

| Field | Value |
|-------|-------|
| **Form factor** | One of: `webapp` / `conversational` / `agentic` / `copilot-extension` / `low-code` / `other` — should match `selected-concept.md` |
| **Primary stack** | e.g. React 19 + .NET 9 / Copilot Studio / Azure AI Foundry Agents / M365 Agents Toolkit / Power Platform |
| **Hosting target** | e.g. Azure SWA + App Service / Studio-published / Foundry endpoint / Teams app / Power Platform env |
| **AI services used** | e.g. Azure OpenAI gpt-4.1 / Foundry built-in / Copilot Studio generative answers / none (rules only) |

## Mock Data

The data the prototype will operate against. Each entry should match what `/vibe-data-prep` will produce (or what already exists in `scaffold/data/`).

| Dataset | Source file | Rows | Notes |
|---------|-------------|------|-------|
| {{DATASET_1}} | sources/sample-data/{{file}} | {{N}} | {{notes}} |
| {{DATASET_2}} | sources/sample-data/{{file}} | {{N}} | {{notes}} |

## Must-Have Features (in priority order)

Each must-have feature must trace to a scene in `storyboard.md`. If a feature can't be tied to a storyboard scene, either drop it or surface it as an open question.

| # | Feature | What it does | Data touched | Demo success | Traces to scene |
|---|---------|--------------|--------------|--------------|------------------|
| 1 | {{FEATURE_1}} | {{description}} | {{datasets}} | {{success_signal}} | scene #{{N}} |
| 2 | {{FEATURE_2}} | {{description}} | {{datasets}} | {{success_signal}} | scene #{{N}} |
| 3 | {{FEATURE_3}} | {{description}} | {{datasets}} | {{success_signal}} | scene #{{N}} |

## Should-Have Features (next-pass scope)

If the squad has runway after the must-haves land, these are the next features to add. Leave empty if the engagement is deliberately scoped to must-haves only.

| # | Feature | What it adds | Why deferred |
|---|---------|--------------|--------------|
| 1 | {{FEATURE}} | {{description}} | {{reason}} |

## Could-Have Features (parking lot)

Aspirational items that won't ship in the prototype but are worth recording for the post-prototype backlog. Often surface from `workshop-record.md` → Parked Items.

| # | Feature | Why it's not in the prototype |
|---|---------|--------------------------------|
| 1 | {{FEATURE}} | {{reason}} |

## Hard Constraints

Things the prototype must enforce even though they're not visible features. Often derived from regulatory or business rules captured during Discover or Disrupt.

- {{CONSTRAINT_1}}
- {{CONSTRAINT_2}}

## Integration Points

External systems the prototype reads from or writes to. **VIBE prototypes use mock data by default** — leave this empty unless the customer has explicitly approved a live integration for the prototype.

| System | Purpose | Access status |
|--------|---------|---------------|
| {{SYSTEM}} | {{purpose}} | {{status: mocked / live / TBD}} |

## Explicit Non-Goals

Things deliberately excluded from the prototype scope. Knowing what's *out* prevents scope creep. Cross-reference `selected-concept.md` → Non-Goals + anything the workshop record flagged as out of scope.

- {{NON_GOAL_1}}
- {{NON_GOAL_2}}

## Demo Script

A walkthrough the engineer can follow to demonstrate the prototype in 5-10 minutes. Mirror the storyboard scene order — the storyboard IS the demo narrative.

1. Open at {{starting screen}}
2. Show {{interaction}} — point out {{what's interesting}}
3. Trigger {{scenario}} — show how the AI {{behaviour}}
4. Close with {{summary screen}}

## Open Questions for the Engineer

Things the Disrupt deliverables couldn't resolve and the engineer needs to decide. Surface anything ambiguous — better to ask now than discover mid-build.

- {{QUESTION_1}}
- {{QUESTION_2}}

## Acceptance for Handoff to Design & Develop

The brief is complete when:

- [ ] Form factor matches `selected-concept.md`
- [ ] Every must-have feature traces to a storyboard scene
- [ ] Data sources exist (in `sources/sample-data/` or are noted as TBD with a fallback)
- [ ] Hard constraints are explicit
- [ ] Demo script mirrors the storyboard scene order
- [ ] Non-goals are agreed by the squad
- [ ] Squad lead has signed off
