---
description: "Process customer check-in feedback (from notes or transcript)"
agent: "VIBE Engagement Lead"
argument-hint: "[source={notes|transcript}] [engagement=...]"
---

# VIBE Check-in

Process feedback from a customer check-in meeting. Supports two input modes:

- **From transcript**: Pulls the meeting transcript from Teams and auto-extracts feedback
- **From notes**: Takes pasted notes and structures them into the check-in format

## Inputs

- ${input:source:notes}: (Optional, defaults to notes) Input source: `notes` or `transcript`.
- ${input:engagement}: (Optional) Engagement name. Auto-detected from `.copilot-tracking/vibe/` if only one engagement exists.

## Requirements

1. If `source=transcript`: delegate to `VIBE Transcript Analyst` with `type=check-in`. The agent finds the most recent `[VIBE]` meeting for this engagement. Then append extracted findings to `templates/CHECK-IN-NOTES.md`.
2. If `source=notes`: ask the user to paste their raw notes, then structure them into the CHECK-IN-NOTES.md check-in log format (What Was Shown, Customer Feedback, Decisions Made, New Requests, Action Items).
3. If `templates/CHECK-IN-NOTES.md` doesn't exist yet (first check-in), create it from the template. For subsequent check-ins, append a new entry.
4. In both modes, update `templates/PROJECT-CONTEXT.md` with any new decisions or requirements discovered.
5. Update the engagement `state.json` with a check-in timestamp.
6. Present a summary of extracted items and recommend next actions.

## If Transcript Not Found

If `source=transcript` but the agent can't find the meeting:
- Check the meeting was named with `[VIBE]` prefix
- Try providing a date range: `/vibe-check-in source=transcript dateRange="today"`
- Fall back to `source=notes` and paste your raw notes instead
