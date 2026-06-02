---
description: "Capture the concept the customer chose in the Disrupt workshop — post-workshop deliverable"
agent: "VIBE Disrupt"
argument-hint: "[engagement=...]"
---

# VIBE Selected Concept (Post-Workshop)

Produce `engagement/{{engagement-kebab}}/selected-concept.md` — the formal record of which concept the customer chose (or composed) during the Disrupt workshop. This is **the** concept the rest of the engagement builds, demos, and signs off on.

The chosen concept might be:

- One of the pre-workshop candidates from `ideation-concepts.md` (Concept A, B, or C) unchanged
- A **hybrid** ("Concept B's surface + Concept A's AI core + the customer's idea of adding voice")
- An **entirely new concept** that emerged in the room, with none of the pre-workshop candidates surviving
- A **"rejected all pre-workshop concepts and need another round"** outcome — in which case this prompt doesn't write the file, it tells you to re-run `/vibe-concepts` with new direction

## Inputs

- `${input:engagement}`: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Prerequisites (block early if missing)

This prompt reads the workshop record as the canonical source of what the customer decided. Block with `👉 BLOCKED:` if any are missing:

- `engagement/{{engagement-kebab}}/workshop-record.md` — must exist with at least one entry in the decisions table (this is the source of truth for "what won")
- `engagement/{{engagement-kebab}}/personas.md` — the primary persona anchors the narrative
- `engagement/{{engagement-kebab}}/problem-statement.md` — the formal problem the selected concept solves

If `ideation-concepts.md` doesn't exist (workshop produced an entirely new concept and the pre-workshop /vibe-concepts step was skipped), proceed but warn — the pre-workshop concepts are useful comparison context.

## Required Steps

### Step 1 — Read the decision

Read `workshop-record.md` and find the decision(s) that name the concept:

- Scan the **Decisions** table for rows that reference a concept name (e.g. "Concept B", "the inventory assistant", "Sarah's morning brief")
- Scan the **Action Items** table for tasks like "Document selected concept" or "Build [name]"
- Cross-reference with the pre-workshop `ideation-concepts.md` if it exists — does the decision name a Concept A/B/C, or does it describe something new?

Determine the **selection mode**:

| Mode | Signal | What to write |
|---|---|---|
| **Single concept chosen** | Decision names exactly one of the pre-workshop concepts | Lift that concept's content as the spine, mark `> Selection mode: chosen from candidates` |
| **Hybrid** | Decision names 2+ pre-workshop concepts OR adds features | Compose the spine from the cited concepts, annotate which parts came from which, mark `> Selection mode: hybrid` |
| **New concept** | Decision describes something not in `ideation-concepts.md` | Build the spine from the workshop record + Discover deliverables, mark `> Selection mode: new (emerged in workshop)` |
| **No decision** | Decisions table has no concept selection | STOP — output the "no decision captured" guidance below |

If selection mode is "No decision": end with `👉 BLOCKED: workshop-record.md has no decision identifying which concept won. Either (a) edit workshop-record.md to add the missing decision row, or (b) re-run /vibe-concepts and schedule a follow-up workshop session.`

### Step 2 — Compose the selected-concept spine

Write to `engagement/{{engagement-kebab}}/selected-concept.md` using this structure (sections are stable so downstream prompts can rely on them):

```markdown
> **Auto-generated** by `/vibe-selected-concept` from `workshop-record.md` decisions and pre-workshop `ideation-concepts.md`.
> Re-running this prompt regenerates the file from the latest workshop-record. Manual edits to signed-off rows are preserved.

# Selected Concept — {{Concept Name}}

> **Selection mode:** [chosen from candidates | hybrid | new (emerged in workshop)]
> **Workshop date:** {{date from workshop-record.md}}
> **Decided by:** {{customer attendees from workshop-record.md}}

## One-line pitch

{{One sentence — what this concept is.}}

## Why this concept won

{{2-3 paragraphs sourced from workshop-record.md decisions + key quotes. Cite quote sources.}}

## The user experience

{{2-3 paragraph narrative. "When {primary persona name} opens the app at 7am, she sees..." — same structure as ideation-concepts.md narratives.}}

## How AI powers it

- {{Specific AI capability 1 and what it enables}}
- {{Specific AI capability 2 and what it enables}}

> Without AI, this concept wouldn't work because: {{the AI Essentiality justification}}

## Form factor and Microsoft technology

- **Form factor:** {{from the concept origin}}
- **Microsoft tech stack:** {{Azure services, M365 components, model choices}}
- **Mock data sources:** {{what data the prototype needs — file names, formats, volume}}

## Composition (if hybrid)

| Element | Came from | Notes |
|---|---|---|
| {{e.g. dashboard layout}} | Concept A | {{rationale}} |
| {{e.g. chat agent}} | Concept B | {{rationale}} |
| {{e.g. voice input}} | Customer suggestion in workshop | {{rationale}} |

(Omit this section for single-concept selections or pure new concepts.)

## What's IN scope for the prototype

- {{Bullet list of features the prototype WILL demonstrate. Each must be sourced from a workshop decision or pre-workshop concept feature the customer endorsed.}}

## What's OUT of scope (parked for V2 / production)

- {{Bullet list of features explicitly deferred. Sourced from workshop-record.md parked items.}}

## Success criteria (how we know the demo lands)

- {{What customer needs to see in check-ins to say "this works"}}
- {{Specific metrics or behaviours from current-state-journey.md Top 3 pains that this prototype must reduce}}

## Top-3 pain coverage

| Top-3 pain (from current-state-journey.md) | How this concept addresses it |
|---|---|
| Pain 1: {{...}} | {{...}} |
| Pain 2: {{...}} | {{...}} |
| Pain 3: {{...}} | {{... or "not addressed — parked"}} |

## Open questions for engineering

- {{Questions the engineer needs answered before they can write engineering-brief.md. Examples: "Confirm Azure OpenAI model — gpt-4o or gpt-4-turbo?", "Need sample data — request inventory.csv from customer"}}

## Sign-off

| Role | Name | Date |
|---|---|---|
| Customer lead | {{name from workshop-record.md attendees}} | |
| S42 PM | | |
| S42 engineer | | |
```

### Step 3 — Cross-reference everything

Every claim in `selected-concept.md` must be traceable:

- Why this concept won → cite workshop-record.md decision row + (if present) the key quote that swung it
- User experience narrative → anchor to the primary persona from `personas.md`
- Pain coverage → cite the exact pain text from `current-state-journey.md`
- Out-of-scope → cite the workshop-record.md parked-items table

If a section can't be sourced, leave it `{{TODO — needs source}}` and flag in the presentation, don't fabricate.

### Step 4 — Update PROJECT-CONTEXT.md briefly

Update Section 8.5 (or equivalent) in `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` with a one-line summary:

> **Selected concept:** {{Concept Name}} — {{one-line pitch}} (full doc at `engagement/{{engagement-kebab}}/selected-concept.md`)

Do NOT duplicate the full content there. PROJECT-CONTEXT.md is the index; this file is the canonical record.

### Step 5 — Update state.json

Update `state.json.readiness.disrupt.selectedConcept`:

```json
{
  "status": "filled" | "partial" | "empty",
  "grade": "A" | "B" | "C",
  "path": "engagement/{{engagement-kebab}}/selected-concept.md",
  "signedOffBy": null,
  "lastUpdated": "<ISO timestamp>"
}
```

Grade rubric:

| Grade | Criteria |
|---|---|
| **A** | Every section sourced (decision cited, quote cited, pain coverage 3/3), customer sign-off row filled, no `{{TODO}}` markers |
| **B** | Decision cited, narrative anchored to primary persona, pain coverage 2/3, no `{{TODO}}` markers in required sections |
| **C** | Concept named but `Why this won` is thin, OR pain coverage 1/3, OR open questions block engineering |

If `readiness.disrupt` does not yet exist in state.json, create it.

### Step 6 — Present and ask for review

Present:

- The concept name + selection mode
- Top-3 pain coverage summary (3/3, 2/3, etc.)
- Any `{{TODO}}` sections that need follow-up
- The grade

End with one of these directives:

- If Grade A or B and storyboard not yet drafted: `👉 NEXT: Selected concept captured. Click "🎬 Draft Storyboard" — this is the contract handed to engineering. Then "🗺️ Map Future Journey" to complete the Disrupt deliverable set.`
- If Grade A or B and storyboard already drafted: `👉 NEXT: Selected concept captured. Storyboard already exists — re-run /vibe-storyboard if any details changed, otherwise click "❓ What's Next?" to check Disrupt phase gates.`
- If Grade C: `👉 NEXT: Selected concept is at Grade C — {specific missing piece}. Re-read workshop-record.md and decide whether to (a) edit the workshop record to add the missing decision/quote, or (b) schedule a 30-min customer call to clarify, then re-run /vibe-selected-concept.`
- If selection mode is "no decision": `👉 BLOCKED:` (see Step 1 — don't write the file)

## Notes

- Re-running `/vibe-selected-concept` is safe — signed-off rows are preserved; non-signed-off rows are regenerated from the latest workshop-record.
- This prompt does NOT write `engineering-brief.md`. That's a Design & Develop deliverable — the engineer reads `selected-concept.md` + `storyboard.md` + `future-state-journey.md` and writes the engineering brief as their first build-phase task.
- If the workshop produced no decision (selection mode = "no decision"), do not write the file. Surface the gap and recommend the next call.
- **Hybrid concepts are valid and common.** Don't force the customer into picking one of A/B/C — composition is part of co-creation.
- If the customer rejected all pre-workshop concepts and a new round of `/vibe-concepts` produced a new shortlist that they then chose from in a follow-up session, the workshop-record from that follow-up session is the source of truth — earlier records are historical.
