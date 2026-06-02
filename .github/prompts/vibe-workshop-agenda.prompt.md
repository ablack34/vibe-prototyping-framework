---
description: "Generate the Disrupt workshop agenda from Discover deliverables — Disrupt deliverable (Wk 2, pre-workshop)"
agent: "VIBE Disrupt"
argument-hint: "[engagement=...]"
---

# VIBE Workshop Agenda

Produce `engagement/{{engagement-kebab}}/workshop-agenda.md` — the facilitator's run-of-show for the Disrupt workshop. Each section of the agenda is **anchored** to a real Discover deliverable (a named persona, a ranked pain, the actual problem statement) so the workshop has concrete material to work with — not a generic skeleton.

The agenda lands 48 hours before the workshop and is shared with the customer.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read all sources

- `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` (engagement metadata, stakeholders)
- `engagement/{{engagement-kebab}}/engagement-brief.md` (S42 view — success metrics, scope, duration, attendees)
- `engagement/{{engagement-kebab}}/customer-brief.md` (customer's voice — what they expect to leave with)
- `engagement/{{engagement-kebab}}/personas.md` — the personas to review in section 4
- `engagement/{{engagement-kebab}}/problem-statement.md` — the statement to refine in section 2
- `engagement/{{engagement-kebab}}/current-state-journey.md` — the Top 3 pains feed the ideation opener; the journey itself feeds section 6
- Any prior `engagement/{{engagement-kebab}}/workshop-agenda.md` (preserve facilitator edits — only re-draft sections that have changed inputs)

### Step 2 — Validate the gate

The agenda CANNOT be drafted unless every Discover deliverable is at **Grade B or higher** AND signed off. If any is below grade or unsigned, stop and respond with:

```
👉 BLOCKED: Cannot draft the Disrupt workshop agenda yet.
{deliverable} is at Grade {grade} (need B+) and {signed/unsigned}.
Re-run /vibe-{prompt} after the next customer check-in, then come back.
```

This protects the customer from a workshop built on shaky inputs.

### Step 3 — Identify the workshop shape

Read the engagement brief for:

- Total duration (typical: full day = 6-7 working hours)
- Attendee count and roles (3-person customer team needs different pacing than 10-person)
- Format (in-person / hybrid / remote — affects timing and live-prototyping approach)

Apportion time across the 8 sections using this default mix, then adjust per the brief:

| Section | Default % of total | Notes |
|---|---|---|
| 1. Intros & expectations | 8% | Fixed — don't compress |
| 2. Refine vision | 10% | Compress if problem statement is Grade A |
| 3. Refine OKRs | 10% | Compress if engagement brief metrics already concrete |
| 4. Review personas + research | 12% | One slide per persona — fixed time per persona |
| 5. Ideation | 20% | Protect this — it's where new ideas land |
| 6. Future-state journey | 15% | Scales with current-state journey complexity |
| 7. Live prototyping | 18% | Protect this — it's the wow moment |
| 8. Next steps & close | 7% | Fixed — don't compress |

### Step 4 — Draft the agenda

Copy `templates/workshop-agenda.md` to `engagement/{{engagement-kebab}}/workshop-agenda.md` and fill it in. Critical anchoring rules:

- **Section 2** must quote the actual problem statement (don't write "refine the vision" — write "refine: 'I am {persona}, I'm trying to {objective}…'")
- **Section 3** must list the actual OKRs from the engagement brief (don't write "review OKRs" — write the OKRs)
- **Section 4** must name the actual personas (one per slide, with the sourced quote)
- **Section 5's opening prompt** must include the literal Top 3 ranked pains from `current-state-journey.md` (e.g. "We've named these as the Top 3 pains: {{PAIN_1}}, {{PAIN_2}}, {{PAIN_3}}. For each, what could AI do that would actually move the needle?")
- **Section 6** must reference the current-state journey by stage count ("the 7 stages of {{PRIMARY_PERSONA}}'s journey — which disappear, which get faster?")
- **Section 7** must pick ONE scene to live-prototype (suggest the highest-impact future-state stage)
- **Pre-reads list** must point at the three Discover deliverable files

If the agent cannot fill a `{{PLACEHOLDER}}` from sources, leave the literal placeholder and flag it under "Open questions" with the missing input named.

### Step 5 — Grade the agenda

Grade A / B / C using the rubric in the template. Write the grade at the top.

### Step 6 — Update state.json

Update `state.json.readiness.disrupt.workshopAgenda`:

```json
{
  "status": "filled" | "partial" | "empty",
  "grade": "A" | "B" | "C",
  "path": "engagement/{{engagement-kebab}}/workshop-agenda.md",
  "lastUpdated": "<ISO timestamp>"
}
```

If `readiness.disrupt` does not yet exist in state.json, create it with this single field.

### Step 7 — Present and ask for review

Present:

- Workshop date, duration, attendees
- Section-by-section timings (total must equal the booked duration)
- Anchors used (which persona names, which Top 3 pains, which OKRs)
- Any placeholders that couldn't be filled (with the missing input named)

End with one of these directives:

- If Grade A: `👉 NEXT: Workshop agenda is ready. Send pre-reads to attendees 48 hours before {{WORKSHOP_DATE}}. After the workshop, run /vibe-workshop-record.`
- If Grade B: `👉 NEXT: Agenda is workable. To lift to A: {missing element}. Send pre-reads 48 hours before {{WORKSHOP_DATE}}.`
- If Grade C: `👉 NEXT: Agenda has {N} placeholders that source material doesn't fill — {list}. Add the missing sources or hand-edit the agenda, then re-run /vibe-workshop-agenda.`

## Notes

- Re-running `/vibe-workshop-agenda` is safe — facilitator hand-edits between sections marked `<!-- facilitator-edited -->` are preserved.
- This prompt does NOT modify any Discover deliverable. If the agenda surfaces a gap (e.g. a missing persona), the agent recommends re-running the relevant Discover prompt rather than editing Discover output directly.
- The workshop agenda is the **first** Disrupt deliverable. The workshop itself produces `selected-concept.md`, `storyboard.md`, `future-state-journey.md`, and `workshop-record.md` — each has its own prompt.
