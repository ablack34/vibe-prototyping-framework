---
description: "Start a new VIBE Prototyping engagement"
agent: "VIBE Engagement Lead"
argument-hint: "customer=... problem=... [size={XS|S|M|L}]"
---

# VIBE Kickoff

Start a new VIBE Prototyping engagement. Creates the engagement tracking structure, initializes PROJECT-CONTEXT.md, and guides you through the first steps.

## Inputs

- ${input:customer}: (Required) Customer name.
- ${input:problem}: (Required) High-level problem statement (even a rough one is fine).
- ${input:size:S}: (Optional, defaults to S) Engagement size: XS, S, M, or L.
- ${input:squad}: (Optional) Squad members and roles.

## Requirements

0. **Check for existing engagement first.** Look in `.copilot-tracking/vibe/` for any existing engagement directories. If one already exists:
   - Tell the user: "An engagement already exists: {{existing-name}}. Each repo should have ONE engagement."
   - Ask: "Do you want to continue with the existing engagement, or replace it with a new one?"
   - If continuing: skip to showing the readiness dashboard and next steps
   - If replacing: delete the old directory before creating the new one

1. Create the engagement tracking directory at `.copilot-tracking/vibe/` using a kebab-case name derived from the customer and project.
2. Copy `templates/PROJECT-CONTEXT.md` into the engagement directory and fill in the provided inputs.
3. Copy `templates/engagement-brief.md` and populate known fields.
4. Initialize `state.json` with engagement metadata, readiness tracking, and set phase to `discover`.
5. Generate meeting invite templates in `sources/meeting-templates.md` with 4 meeting types (Kickoff, Workshop, Check-in, Handoff) using the `[VIBE] {{Customer}} — {{Type}}` naming convention. Each template has a title, description, suggested talking points, and recommended duration — ready to copy-paste into Outlook.
6. Present a summary of what was created and the recommended next steps:

```
✅ Engagement created: {{customer}} — {{engagement}}

⚠️ FIRST TIME SETUP (do this once):
  If you see a 🔧 tools icon in Copilot Chat with a notification badge,
  click it and enable all tools. This gives the AI access to Teams
  transcripts, GitHub, and other services. You only need to do this once.

📁 Files created:
  • .copilot-tracking/vibe/{{engagement-kebab}}/state.json
  • .copilot-tracking/vibe/{{engagement-kebab}}/PROJECT-CONTEXT.md
  • sources/meeting-templates.md (4 meeting invite templates — copy into Outlook)

📋 Next steps (do these in order):
  1. Schedule meetings: Copy invite templates from sources/meeting-templates.md
  2. Send questionnaires: Run /vibe-questionnaire to generate Forms prompts
  3. Drop customer docs: Put any shared files in sources/
  4. Process transcripts: Run /vibe-transcript if meetings have been recorded
  5. Start discovery: Talk to @VIBE Discover when ready

💡 Tip: Record all customer meetings in Teams — the framework extracts
   context automatically so you don't have to take notes.
```
