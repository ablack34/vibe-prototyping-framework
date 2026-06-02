---
description: "Capture the Disrupt workshop record from notes + recording — Disrupt deliverable (Wk 2, post-workshop)"
agent: "VIBE Disrupt"
argument-hint: "[engagement=...]"
---

# VIBE Workshop Record

Produce `engagement/{{engagement-kebab}}/workshop-record.md` — what actually happened in the workshop (distinct from the agenda, which is what we planned). Decisions made, key quotes, parked items, action items, edits surfaced to Discover deliverables.

This is the SECOND Disrupt prompt run (after the workshop itself). Its outputs feed `/vibe-future-journey` and `/vibe-storyboard`.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read all workshop captures

- `engagement/{{engagement-kebab}}/workshop-agenda.md` — what was planned (used to measure what was actually delivered)
- `sources/workshop/` — everything captured during the workshop:
  - `workshop-notes.md` (live notes from `/vibe-capture` calls during the session)
  - Sticky-note photos
  - Miro / FigJam exports
  - Teams recording transcript (if recorded)
  - Spark prompts / screenshots used in live prototyping
- `engagement/{{engagement-kebab}}/personas.md`, `problem-statement.md`, `current-state-journey.md` — context for which Discover deliverables a workshop edit affects
- Any prior `engagement/{{engagement-kebab}}/workshop-record.md` (re-running is safe — preserves customer-signed records, adds new captures)

### Step 2 — Confirm captures exist

If `sources/workshop/` is empty or contains only the agenda, stop:

```
👉 BLOCKED: Cannot draft workshop record — no captures found in sources/workshop/.
Drop transcripts, sticky-note photos, Miro exports, or /vibe-capture notes into sources/workshop/, then re-run.
```

### Step 3 — Reconstruct the day

Walk through `sources/workshop/` chronologically. For each capture, identify:

- Which agenda section it came from (1–8)
- Whether it's a **decision**, a **quote worth keeping**, a **parked item**, or an **action item**
- Whether it implies an **edit** to a Discover deliverable (e.g. workshop refined the problem statement, surfaced a missing persona)

### Step 4 — Draft the record

Copy `templates/workshop-record.md` to `engagement/{{engagement-kebab}}/workshop-record.md` and fill it. Critical rules:

- **Decisions** must link to the Disrupt deliverable they landed in (or flag "didn't land in a deliverable" as a gap)
- **Quotes** MUST be sourced. Each row in the quotes table requires a `sources/workshop/` reference. If a remembered quote can't be sourced, drop the row — don't fabricate
- **Parked items** must each get a disposition (Out of scope / Carried / Open question / Resolved)
- **Action items** must have an owner AND a due date — anything without both is an "open question" instead
- **Discover edits** — list each Discover deliverable that the workshop changed (often: problem statement refined, a persona's pains expanded, journey stages adjusted). For each, name the source line in the workshop record so the agent can later re-run the relevant Discover prompt with `sources/workshop/workshop-notes.md` as additional input
- **Customer feedback on the workshop itself** — capture the close-of-workshop quotes verbatim if recorded; if not, mark as "not captured"

### Step 5 — Identify Disrupt-deliverable inputs

This record feeds the next three Disrupt prompts. Surface explicitly what's now ready:

- For `/vibe-selected-concept` (**run this first** — future-journey and storyboard both depend on selected-concept.md existing): the concept the customer voted for in agenda section 5. This MUST be captured in the decisions table — be explicit about whether it's one of the pre-workshop concepts, a hybrid, or a new concept that emerged.
- For `/vibe-future-journey` (run after selected-concept): the future-state stages decided in agenda section 6
- For `/vibe-storyboard` (run **after** future-journey — storyboard cross-references the redesigned journey stages; running it before future-journey produces a Grade B concept-only artifact that has to be re-done): the live-prototyping captures from agenda section 7 (Spark prompts, screenshots, customer reactions)

The workshop record IS the source of truth for which concept won. Without a clear concept-selection decision row, `/vibe-selected-concept` will block. Be explicit.

### Step 6 — Update state.json

Update `state.json.readiness.disrupt.workshopRecord`:

```json
{
  "status": "filled" | "partial" | "empty",
  "path": "engagement/{{engagement-kebab}}/workshop-record.md",
  "decisionsCount": <number of decisions captured>,
  "lastUpdated": "<ISO timestamp>"
}
```

The workshop record isn't graded A / B / C — capture is what it is. Either the workshop produced enough material to write the record (`filled`), some sections lacked captures (`partial`), or there's nothing to record (`empty`).

If `readiness.disrupt` does not yet exist in state.json, create it.

### Step 7 — Present and ask for review

Present:

- Decisions count, parked items count, action items count
- Discover deliverables the workshop edited (and the recommended `/vibe-*` prompt to re-run for each)
- Which Disrupt prompts are now unblocked — in this strict order: `/vibe-selected-concept` first, then `/vibe-future-journey`, then `/vibe-storyboard` (storyboard cross-references the redesigned journey stages so it MUST come last)
- Sections of the agenda where captures were thin (and the cost of that gap)

End with this directive:

```
👉 NEXT: Workshop record drafted. Recommended order:
  1. Re-run any Discover prompts named above with sources/workshop/ as additional input
  2. /vibe-selected-concept — locks the chosen concept into selected-concept.md
     (REQUIRED before future-journey and storyboard — both anchor to it)
  3. /vibe-future-journey — turns the workshop's whiteboarded future-state into the document
  4. /vibe-storyboard — turns the selected concept + future-state into the engineer's brief
  5. Customer sign-off on this record within 48 hours
```

## Notes

- Re-running `/vibe-workshop-record` is safe — signed-off rows are preserved; new captures append.
- This prompt does NOT modify Discover deliverables directly. It RECOMMENDS edits; re-running the Discover prompt with the new sources is what actually changes them.
- If the workshop happened across multiple days, run this prompt once per day and let the agent merge them into a single record (the metadata table captures cumulative duration).
