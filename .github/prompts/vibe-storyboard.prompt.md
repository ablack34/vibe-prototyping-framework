---
description: "Generate the storyboard from the selected concept + future-state journey — Disrupt flagship deliverable (Wk 2)"
agent: "VIBE Disrupt"
argument-hint: "[engagement=...]"
---

# VIBE Storyboard

Produce `engagement/{{engagement-kebab}}/storyboard.md` — the scene-by-scene visual narrative that becomes the **contract between Disrupt and Design & Develop**. The engineer reads this storyboard and writes the engineering brief from it.

This is Josephine's flagship Disrupt deliverable. Get it right and the engineer's first day in D&D is unblocked.

## Inputs

- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists under `engagement/`.

## Requirements

### Step 1 — Read all sources

- `engagement/{{engagement-kebab}}/personas.md` — the primary persona is the main character
- `engagement/{{engagement-kebab}}/problem-statement.md` — the "But / Because / which results in" lines anchor the challenge scenes
- `engagement/{{engagement-kebab}}/current-state-journey.md` — the Top 3 pains anchor the setup and challenge scenes
- `engagement/{{engagement-kebab}}/selected-concept.md` — the concept being demonstrated (if it exists; if not, see Step 2)
- `engagement/{{engagement-kebab}}/future-state-journey.md` — the after-picture (if it exists; otherwise generate from the workshop record)
- `engagement/{{engagement-kebab}}/workshop-record.md` — captures from the live workshop (which scenes the customer reacted strongest to)
- `sources/workshop/` — sticky-note photos, Spark screenshots, Miro exports captured during live prototyping
- Any prior `engagement/{{engagement-kebab}}/storyboard.md` (preserve signed-off scenes; only re-draft non-signed-off scenes when new sources arrive)

### Step 2 — Confirm the inputs exist

The storyboard NEEDS the selected concept and (ideally) the future-state journey. If `selected-concept.md` doesn't exist, stop:

```
👉 BLOCKED: Cannot draft storyboard without selected-concept.md.
The Disrupt workshop produces the selected concept — run the workshop first, then capture the chosen direction in selected-concept.md.
```

If `future-state-journey.md` doesn't exist but `selected-concept.md` does, proceed but flag at the end: "Storyboard generated from concept alone — to lift to Grade A, run /vibe-future-journey first."

### Step 3 — Identify the arc

Every storyboard tells the same 5-stage shape. Map scenes to stages:

| Stage | Question the scene answers |
|---|---|
| Setup | Who is the persona and what's their world today? |
| Challenge | What's the pain — the moment things go wrong or get hard? |
| Encounter | The prototype appears. What does it look like? |
| Solution | How does the prototype turn the pain into progress? |
| Impact | What's different at the end? What did the persona just save / unlock / avoid? |

Aim for **4-6 scenes total** — typically one per arc stage, sometimes two if Challenge or Solution needs more space. Fewer than 4 is thin; more than 6 the engineer can't hold in their head.

### Step 4 — Draft each scene

Copy `templates/storyboard.md` to `engagement/{{engagement-kebab}}/storyboard.md` and fill one block per scene. For each scene:

- **Title** — short, narrative (e.g. "Sarah opens her morning queue"), NOT feature-named ("Dashboard view")
- **Arc stage** — one of: Setup / Challenge / Encounter / Solution / Impact
- **Visual** — link to or describe what's drawn. PR 1 of the storyboard usually has placeholder descriptions; visuals get attached after the team sketches them
- **Caption** — one line of narration. The Impact scene's caption is often the most quotable line of the whole storyboard
- **Persona pain addressed** — which pain from `personas.md` or `current-state-journey.md` does this scene speak to? (Setup scenes may not address a pain — that's fine)
- **Sourced from** — every scene MUST cite at least one source (a persona quote, a journey stage, a workshop sticky-note, a Spark screenshot). If no source can be cited, mark explicitly: `> _No source yet — anchored from {{PERSONA_NAME}}'s general context. Validate at next check-in._` Never invent quotes.
- **Detail (what to draw / show)** — 2-4 sentences describing the visual concretely enough that a designer or whiteboarder can produce it without further questions
- **Why this scene exists** — one sentence explaining what this scene contributes to the arc (cuttable scenes are usually missing this)

### Step 5 — Grade the storyboard

Grade A / B / C using the rubric in the template. Write the grade at the top.

| Grade | Criteria |
|---|---|
| A | 4-6 scenes, every scene sourced + visual attached + clear arc + persona pain identified per scene |
| B | 4-6 scenes with captions, sourced, arc complete; visuals may be placeholders |
| C | Fewer than 4 scenes, OR arc incomplete, OR scenes don't anchor to persona's actual pains |

### Step 6 — Update state.json

Update `state.json.readiness.disrupt.storyboard`:

```json
{
  "status": "filled" | "partial" | "empty",
  "grade": "A" | "B" | "C",
  "path": "engagement/{{engagement-kebab}}/storyboard.md",
  "sceneCount": <number of scenes>,
  "lastUpdated": "<ISO timestamp>"
}
```

If `readiness.disrupt` does not yet exist in state.json, create it.

### Step 7 — Present and ask for review

Present:

- 1-line summary per scene with arc stage
- Overall grade and what would lift any C-graded scene to B
- Source citations missing (if any)

End with one of these directives:

- If Grade A: `👉 NEXT: Storyboard is the contract — get customer sign-off, then the engineer can start Design & Develop. The engineer's first Build task: write engineering-brief.md from storyboard.md + selected-concept.md + future-state-journey.md.`
- If Grade B: `👉 NEXT: Storyboard is workable. To lift to A: attach visuals (sketches, Figma frames, or Spark screenshots) for scenes {list}. Customer sign-off can happen in parallel.`
- If Grade C: `👉 NEXT: Storyboard needs more scenes / better sourcing — {specific gaps}. Run the gap-fix prompt(s) and re-run /vibe-storyboard.`

## Notes

- Re-running `/vibe-storyboard` is safe — signed-off scenes (with a non-empty Sign-off row) are preserved.
- This prompt is **mock-data-aware**: scenes that depict the persona using the prototype MUST be consistent with the mock data available in `sources/sample-data/` (don't show a feature that needs data the engineer can't fake).
- The storyboard is the LAST Disrupt deliverable that runs before Design & Develop. Order: `/vibe-workshop-agenda` → workshop happens → `/vibe-workshop-record` → `/vibe-future-journey` → `/vibe-storyboard` → (sign-off) → enter D&D.
- If the customer wants a single PDF/slide deck of the storyboard, export from this markdown — the structure maps cleanly to one scene per slide.
