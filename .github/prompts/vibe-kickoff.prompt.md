---
description: "Start a new VIBE Prototyping engagement"
agent: "VIBE Engagement Lead"
argument-hint: "customer=... problem=..."
---

# VIBE Kickoff

Start a new VIBE Prototyping engagement. Creates the engagement tracking structure, initialises both briefs (Studio 42 internal + customer voice), generates the full 4-week meeting schedule, and hands off to the Preparation phase agent.

## Inputs

- ${input:customer}: (Required) Customer name.
- ${input:problem}: (Required) High-level problem statement (even a rough one is fine).
- ${input:squad}: (Optional) Squad members and roles.

## Requirements

0. **Check for existing engagement first.** Look in `engagement/` for any existing engagement directories. If one already exists:
   - Tell the user: "An engagement already exists: {{existing-name}}. Each repo should have ONE engagement."
   - Ask: "Do you want to continue with the existing engagement, or replace it with a new one?"
   - If continuing: skip to showing the readiness dashboard and next steps
   - If replacing: delete the old directory before creating the new one

1. Create `engagement/{{engagement-kebab}}/` (committed shared artifacts) and `.copilot-tracking/vibe/{{engagement-kebab}}/` (gitignored per-user state), using a kebab-case name derived from the customer and project.
2. Fill `templates/PROJECT-CONTEXT.md` with the provided inputs (this is the canonical copy — don't duplicate it).
3. **Generate both briefs** from the inputs:
   - Copy `templates/engagement-brief.md` and fill known fields (the Studio 42 internal view: commercial context, squad, risks).
   - Copy `templates/customer-brief.md` and fill known fields **in the customer's voice** based on the kickoff inputs. Mark the doc `[DRAFT — needs customer validation]` at the top since this is generated, not customer-authored. Mark unknown fields with `[needs follow-up]` rather than fabricating.
4. Initialize `state.json` with engagement metadata, readiness tracking, and set `currentPhase` to **`preparation`** (not `discover` — Preparation runs first now).
5. **Generate the full 4-week meeting schedule** in `sources/meeting-templates.md` covering all 7 meetings (Kickoff, Discover Working Session 1, Discover Working Session 2, Disrupt Workshop, Check-in 1, Check-in 2, Handoff). Each entry uses the `[VIBE] {{Customer}} — {{Type}}` naming convention and includes a copy-paste-ready Outlook invite body. This replaces the older "4 generic templates" approach. (See `/vibe-schedule` for the canonical schedule structure.)
6. Present a summary of what was created and recommend handing off to the Preparation agent:

```
✅ Engagement created: {{customer}} — {{engagement}}

⚠️ FIRST TIME SETUP (do this once):
  If you see a 🔧 tools icon in Copilot Chat with a notification badge,
  click it and enable all tools. This gives the AI access to Teams
  transcripts, GitHub, and other services. You only need to do this once.

📁 Files created:
  • .copilot-tracking/vibe/{{engagement-kebab}}/state.json (per-user, gitignored)
  • engagement/{{engagement-kebab}}/ (committed — agent outputs land here)
  • templates/PROJECT-CONTEXT.md (filled in)
  • templates/engagement-brief.md (S42 internal, draft)
  • templates/customer-brief.md (customer voice, [DRAFT — needs customer validation])
  • sources/meeting-templates.md (full 4-week schedule — 7 meetings, copy into Outlook)

📋 Next steps (in order):
  1. Click "🛠 Begin Preparation" — the VIBE Preparation agent will:
     • Run /vibe-research (public web + paste-back prompt for M365 Copilot's Researcher agent)
     • Refresh both briefs as more sources arrive
     • Show the Preparation readiness dashboard (7 fields)
  2. While Prep is running, copy the meeting invites into Outlook (start with the Disrupt Workshop)
  3. Send customer-brief.md to {{sponsor}} for validation
  4. Drop the account-team handover notes into sources/

💡 Tip: Record all customer meetings in Teams — the framework extracts
   context automatically so you don't have to take notes.

👉 NEXT: Click "🛠 Begin Preparation"
```
