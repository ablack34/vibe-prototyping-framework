---
description: "Quick capture of insights during workshops and customer meetings"
argument-hint: "note=... [speaker=...] [category={problem|pain|requirement|decision|value|observation}]"
---

# VIBE Capture

Quick in-chat capture during workshops. Type a note and the agent classifies it, timestamps it, and appends it to `sources/workshop-notes.md` for the discovery agent to pick up later. **Zero friction by design** — no follow-up questions, no deep formatting, just "✅ captured" and the meeting moves on.

## Inputs

- ${input:note}: (Required) The insight, observation, or quote to capture.
- ${input:speaker}: (Optional) Who said it (name or role).
- ${input:category}: (Optional) Category: `problem`, `pain`, `requirement`, `decision`, `value`, `observation`. Auto-classified if not provided.

## Requirements

1. Classify the note into one of these categories (if not provided by the user):
   - **problem** — A problem statement or challenge described by the customer
   - **pain** — A specific pain point or frustration
   - **requirement** — A stated need or feature request
   - **decision** — A decision made during the meeting
   - **value** — A business value signal (cost, revenue, time, scale)
   - **observation** — A behavioral observation (body language, group reaction, emphasis)

2. Append to `sources/workshop-notes.md` using this format. Create the file if it does not exist:

   ```markdown
   ### {{TIMESTAMP}} — {{CATEGORY}}
   {{NOTE_TEXT}}
   **Speaker:** {{SPEAKER or "Not specified"}}
   **Confidence:** High / Medium (based on whether speaker and context are clear)
   ```

3. Keep the response minimal — just confirm the capture:

   ```
   ✅ Captured: [category] — "first 10 words of note..."
   ```

4. Do NOT ask follow-up questions. The purpose is zero-friction capture during a live meeting. Speed matters more than completeness.

5. If the user submits multiple notes in rapid succession, handle each independently.
