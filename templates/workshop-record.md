# Disrupt Workshop Record

> **Disrupt deliverable (post-workshop).** **Auto-generated** by `/vibe-workshop-record` from the workshop transcript (if recorded), `sources/workshop/`, and the workshop agenda. Captures what was actually decided — distinct from the agenda (what we *planned* to do).
>
> **How this document gets populated:**
> 1. During the workshop, captures land in `sources/workshop/` (sticky-note photos, Miro exports, `workshop-notes.md`, Teams recording transcript)
> 2. `/vibe-workshop-record` reads everything in `sources/workshop/`, the agenda, and the Discover deliverables for context
> 3. Drafts: decisions made, attendees, key quotes, parked items, action items
> 4. Facilitator reviews within 24 hours — anything misremembered or missed gets corrected before the customer reads it
> 5. Customer receives the record within 48 hours of the workshop

---

## Workshop metadata

| Field | Value |
|---|---|
| **Customer** | {{CUSTOMER_NAME}} |
| **Engagement** | `engagement/{{engagement-kebab}}/` |
| **Date** | {{WORKSHOP_DATE}} |
| **Duration (actual)** | {{ACTUAL_DURATION}} (planned: {{PLANNED_DURATION}}) |
| **Format** | {{IN_PERSON_OR_HYBRID_OR_REMOTE}} |
| **Facilitator** | {{FACILITATOR_NAME}} |
| **Recording** | {{LINK_OR_NOT_RECORDED}} |

---

## Attendees

| Name | Role | Org | Joined / Left |
|---|---|---|---|
| {{NAME}} | {{ROLE}} | {{ORG}} | {{TIMING}} |

> Note anyone who joined late or left early — the record sets the boundary on whose voice is in which decision.

---

## Decisions made

Each decision links to the Disrupt deliverable it landed in. If a decision didn't make it into a deliverable, that's a gap — flag it in "Open questions" below.

| # | Decision | Section it affected | Landed in deliverable |
|---|---|---|---|
| 1 | {{DECISION}} | Vision / OKRs / Personas / Ideation / Future-state / Live prototype / Next steps | {{DELIVERABLE_FILE}} |
| 2 | {{DECISION}} | … | {{DELIVERABLE_FILE}} |

---

## Key quotes

The lines worth remembering. Each quote MUST cite a speaker and a `sources/workshop/` reference. If no quote can be sourced, drop the row — don't fabricate.

| Speaker | Quote | Source |
|---|---|---|
| {{SPEAKER}} | "{{QUOTE}}" | `sources/workshop/{{file}}` line {{N}} |
| {{SPEAKER}} | "{{QUOTE}}" | `sources/workshop/{{file}}` line {{N}} |

---

## Parked items

Things raised that didn't land in a Disrupt deliverable. Each item gets a disposition.

| # | Item | Why it's parked | Disposition |
|---|---|---|---|
| 1 | {{ITEM}} | {{REASON}} | Out of scope / Carried to next engagement / Open question / Resolved offline |
| 2 | {{ITEM}} | {{REASON}} | … |

---

## Action items

| # | Owner | Action | Due | Status |
|---|---|---|---|---|
| 1 | {{OWNER}} | {{ACTION}} | {{DUE}} | Open / In progress / Done |
| 2 | {{OWNER}} | {{ACTION}} | {{DUE}} | … |

---

## What changed in the Discover deliverables

The workshop will often surface edits to Discover artefacts (refined problem statement, new persona detail, missing journey stages). Capture them here so the agent can re-run the relevant prompts after the workshop:

- [ ] `personas.md` — {{EDITS_OR_NONE}}
- [ ] `problem-statement.md` — {{EDITS_OR_NONE}}
- [ ] `current-state-journey.md` — {{EDITS_OR_NONE}}

> Each edit listed above means re-running the corresponding prompt with `sources/workshop/workshop-notes.md` as an additional input.

---

## Open questions

Questions the workshop raised but didn't answer. These need follow-up before Design & Develop starts.

- {{QUESTION_1}} — owner: {{OWNER}}, deadline: {{DATE}}
- {{QUESTION_2}} — owner: {{OWNER}}, deadline: {{DATE}}

---

## Customer feedback on the workshop itself

Captured in the close. Short and honest.

| Question | Response |
|---|---|
| Did we deliver what you asked for in section 1 of the agenda? | {{RESPONSE}} |
| What's the one thing you'd change about today? | {{RESPONSE}} |
| Anything you expected us to cover that we missed? | {{RESPONSE}} |

---

## Next steps confirmed

- **V1 prototype review date:** {{DATE}}
- **Final handoff date:** {{DATE}}
- **Next customer touchpoint:** {{DATE}} — purpose: {{PURPOSE}}

---

## Sign-off

| Reviewed by | Role | Date | Signature / approval note |
|---|---|---|---|
| {{FACILITATOR_NAME}} | Facilitator | {{DATE}} | {{SIGNATURE}} |
| {{CUSTOMER_LEAD}} | Customer lead | {{DATE}} | {{SIGNATURE}} (confirmed the record is accurate) |

> Customer confirmation here is the gate from Disrupt into Design & Develop — without it, decisions captured here are S42-only and won't survive contact with the next customer review.
