---
description: "Map the future-state user journey from current-state + selected concept — Disrupt deliverable (Wk 2)"
agent: "VIBE Disrupt"
argument-hint: "[engagement=...]"
---

# VIBE Future-State Journey

Produce `engagement/{{engagement-kebab}}/future-state-journey.md` — the journey the primary persona walks once the prototype exists. Counterpart to `current-state-journey.md`: same persona, same task, redesigned with the prototype in place.

This is one of the inputs the engineer reads (alongside the storyboard) to write the engineering brief.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read all sources

- `engagement/{{engagement-kebab}}/current-state-journey.md` — the journey we're disrupting (this prompt rewrites it stage by stage)
- `engagement/{{engagement-kebab}}/personas.md` — must be the same primary persona as current-state
- `engagement/{{engagement-kebab}}/selected-concept.md` — what we're building (defines what changes in the journey)
- `engagement/{{engagement-kebab}}/workshop-record.md` — the workshop literally redrew the journey on a whiteboard; this captures those decisions
- `sources/workshop/` — sticky-note photos from the future-state activity, Miro exports
- Any prior `engagement/{{engagement-kebab}}/future-state-journey.md` (preserve signed-off stages; only re-draft non-signed-off ones when new sources arrive)

### Step 2 — Confirm the prerequisites

This prompt CANNOT run without `current-state-journey.md` AND `selected-concept.md`. If either is missing, stop:

```
👉 BLOCKED: Cannot draft future-state journey without {missing file}.
{Re-run /vibe-current-journey in Discover | Capture the workshop's selected concept in selected-concept.md} first.
```

The future-state journey is a *delta* on the current-state — without both inputs the delta has nothing to anchor to.

### Step 3 — Identify the persona and the task

Use the SAME primary persona as `current-state-journey.md`. If the workshop selected a concept that serves a different primary persona, flag at the end — the team likely needs to run `/vibe-current-journey` for that persona first.

### Step 4 — Draft each stage

Copy `templates/future-state-journey.md` to `engagement/{{engagement-kebab}}/future-state-journey.md` and fill it. Critical rules:

- **Re-use unchanged stages verbatim** from current-state — if Stage 1 ("Sarah arrives at her desk and opens her queue") is the same after the prototype, copy it across and mark the delta column as "unchanged"
- **Mark every stage's delta vs. current-state** in the rightmost column. Possible values: `unchanged`, `faster: <how>`, `removed`, `new: <why>`. If "What's different" would be `unchanged` for every stage, the prototype isn't disrupting anything — stop and flag the selected concept as too weak
- **Removed stages** go in the "What's gone" section, not as ghost stages in the diagram (keeps the picture clean)
- **New stages** (ones the prototype introduces) get the `newStage` class in the Mermaid diagram (rendered green)
- **Top 3 improvements** must map 1:1 to the Top 3 ranked pains from `current-state-journey.md` — pain #1 → improvement #1. If a current-state pain ISN'T resolved by the prototype, flag it as an open question rather than silently dropping it

### Step 5 — Source every stage and improvement

Each stage in the table and each improvement in the Top 3 list MUST cite a source:

- A stage that came from the workshop cites the workshop record + the sticky-note photo
- An improvement that maps to a current-state pain cites that pain's line in `current-state-journey.md`
- A new stage introduced by the concept cites `selected-concept.md`

If a stage has no source, mark it explicitly: `> _Inferred from selected-concept.md — validate with customer at next check-in._` Never silently invent.

### Step 6 — Grade the journey

Grade A / B / C using the rubric in the template. Write the grade at the top.

| Grade | Criteria |
|---|---|
| A | ≥5 stages, every stage has the delta marked + sourced, Mermaid renders, Top 3 improvements present and tied to Top 3 current-state pains |
| B | ≥3 stages with delta + Top 3 improvements present |
| C | Fewer than 3 stages, OR delta column blank, OR Top 3 improvements missing |

### Step 7 — Update state.json

Update `state.json.readiness.disrupt.futureStateJourney`:

```json
{
  "status": "filled" | "partial" | "empty",
  "grade": "A" | "B" | "C",
  "path": "engagement/{{engagement-kebab}}/future-state-journey.md",
  "stageCount": <number of stages>,
  "lastUpdated": "<ISO timestamp>"
}
```

If `readiness.disrupt` does not yet exist in state.json, create it.

### Step 8 — Present and ask for review

Present:

- Stage count, with which stages are new / faster / unchanged / removed
- Overall grade
- Any current-state pains that AREN'T resolved by the prototype (open questions)
- Sources missing per stage (if any)

End with one of these directives:

- If Grade A: `👉 NEXT: Future-state journey is solid. Run /vibe-storyboard to produce the scene-by-scene narrative for the engineer.`
- If Grade B: `👉 NEXT: Journey is workable. To lift to A: {missing element}. Or run /vibe-storyboard now and revisit.`
- If Grade C: `👉 NEXT: Journey has {gaps}. Capture more workshop detail in workshop-record.md and re-run /vibe-future-journey.`

## Notes

- Re-running `/vibe-future-journey` is safe — signed-off stages are preserved.
- If the workshop record names changes to the current-state journey (new stages discovered, mis-mapped systems), the agent surfaces them as "current-state edits" but does NOT change current-state itself — re-run `/vibe-current-journey` separately if needed.
- The Mermaid diagram is best-effort — if the future-state journey has complex branching, the agent omits the diagram and leaves a note suggesting Miro/Figma.
