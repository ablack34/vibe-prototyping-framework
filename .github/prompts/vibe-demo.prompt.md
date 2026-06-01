---
description: "Seed the engagement with the Contoso Field Services demo fixtures so you can run a full VIBE engagement end-to-end without a real customer"
agent: "VIBE Engagement Lead"
argument-hint: "[demo=contoso]"
---

# VIBE Demo

Seed the engagement with a complete fixture so you can demonstrate every phase of VIBE end-to-end without needing a real customer.

## Inputs

- ${input:demo:contoso}: (Optional, defaults to `contoso`) Which demo fixture to load. Today only `contoso` (Field Services Dispatcher AI) is available.

## What this does

1. Confirms with the user that loading the demo will populate `sources/`, `templates/PROJECT-CONTEXT.md`, and `engagement/contoso-dispatcher-ai/`.
2. Copies `demo/<demo>/*.md` (excluding the demo's own README) into `sources/` so the agents pick them up just like real customer-supplied sources.
3. Copies `demo/<demo>/sample-data/*.csv` into `sources/sample-data/` (so `/vibe-data-prep` can later typify them into `scaffold/data/`).
4. Fills `templates/PROJECT-CONTEXT.md` with the demo customer's details (customer name, problem statement, sponsor).
5. Creates `engagement/contoso-dispatcher-ai/` and `.copilot-tracking/vibe/contoso-dispatcher-ai/state.json` exactly as `/vibe-kickoff` would.
6. Tells the user the recommended sequence to demonstrate every phase.

## Requirements

### Step 0 — Confirm

If `engagement/` already contains any directory other than what we're about to create, **stop** and ask the user whether to:

- Continue and overwrite (delete the existing engagement folder and proceed)
- Cancel

Do not proceed silently — demos overwrite work.

### Step 1 — Locate the fixture

The demo files live in `demo/${input:demo}/`. If that directory doesn't exist, list the available demos under `demo/` and stop.

For the `contoso` demo specifically, the layout is:

```
demo/contoso/
├── README.md                            (do NOT copy — it's the demo's own docs)
├── customer-brief.md                    → sources/customer-brief.md   AND  → templates/customer-brief.md
├── meeting-templates.md                 → sources/meeting-templates.md (full 7-meeting schedule)
├── questionnaire-account-team.md        → sources/questionnaire-account-team.md
├── questionnaire-customer-pre.md        → sources/questionnaire-customer-pre.md
├── transcript-kickoff.md                → sources/transcript-kickoff.md
├── transcript-workshop-1.md             → sources/transcript-workshop-1.md
├── research/customer-public.md          → sources/research/customer-public.md
├── research/m365-researcher-prompt.md   → sources/research/m365-researcher-prompt.md
├── research/m365-researcher-results.md  → sources/research/m365-researcher-results.md
├── research/research-summary.md         → sources/research/research-summary.md
└── sample-data/*.csv                    → sources/sample-data/*.csv
```

### Step 2 — Copy

Copy every file listed above into `sources/` (preserve filenames). Create `sources/sample-data/` and `sources/research/` if they don't exist.

`customer-brief.md` is special: copy it into BOTH `sources/customer-brief.md` (so Discover and Define agents see it) AND `templates/customer-brief.md` (so the Preparation agent sees a populated brief without re-running `/vibe-customer-brief`).

### Step 3 — Pre-fill PROJECT-CONTEXT.md

For the `contoso` demo, fill `templates/PROJECT-CONTEXT.md` with:

- Customer: `Contoso Field Services`
- Engagement: `Dispatcher AI`
- Problem statement: `SLA breaches on premium HVAC service contracts (Platinum 2hr / Gold 4hr) cost ~€4M/year in penalties and another ~€6M/year in lost renewals. 14 dispatchers manually match ~180 work orders/day to 280 EMEA technicians using a 2008 ASP.NET system. Customer wants AI to suggest the best technician per work order, flag SLA risk early, and free dispatcher attention.`
- Sponsor: `Sandra Holtz, COO`
- Technical contact: `Matthias Köhler, Director of Operations Tech`
- Account team contact: `Priya Raman`

Leave other fields empty — they'll fill in as the discovery and define agents process the sources.

### Step 4 — Initialize engagement structure

Create:

- `engagement/contoso-dispatcher-ai/` (committed shared artifacts — empty for now, agents will populate)
- `.copilot-tracking/vibe/contoso-dispatcher-ai/state.json` with the following shape (uses `currentPhase`, not `phase`, to match the Engagement Lead schema):
  - `customer: "Contoso Field Services"`
  - `engagement: "Dispatcher AI"`
  - `engagementKebab: "contoso-dispatcher-ai"`
  - `currentPhase: "preparation"` — Preparation runs first now. The readiness block below is pre-filled at Grade A so demos can immediately progress to Discover after talking to `@VIBE Preparation` once.
  - `createdAt: <now>`
  - `demoFixture: "contoso"`
  - `phases.preparation.status: "complete"`, `artifacts: ["engagement-brief.md", "customer-brief.md", "meeting-templates.md", "research/customer-public.md", "research/m365-researcher-prompt.md", "research/m365-researcher-results.md", "research/research-summary.md"]`
  - `phases.discover.status: "ready"` (the other phases default to `not-started`)
  - `readiness.preparation` with all 7 fields graded:
    - `engagementBrief: { "status": "filled", "grade": "A" }`
    - `customerBrief: { "status": "filled", "grade": "A" }`
    - `customerResearch: { "status": "filled", "grade": "A", "public": "filled", "m365": "filled" }`
    - `meetingSchedule: { "status": "complete", "grade": "A", "weeks": { "kickoff": "scheduled", "discover-1": "scheduled", "discover-2": "scheduled", "disrupt-workshop": "scheduled", "checkin-1": "scheduled", "checkin-2": "scheduled", "handoff": "scheduled" } }`
    - `existingDocs: { "status": "filled", "grade": "A", "count": 4 }`
    - `priorTranscripts: { "status": "filled", "grade": "A", "count": 2 }`
    - `kickoffComplete: { "status": "filled", "grade": "A" }`
  - 9 Discovery readiness fields all set to `{ "status": "empty", "grade": null }` (they'll fill as Discover runs)

### Step 5 — Tell the user what to do next

Show this summary:

```
✅ Contoso Field Services demo loaded.

📁 Files in sources/ (the agents read these automatically):
   • customer-brief.md          Customer-voice brief from Sandra Holtz (COO)
   • meeting-templates.md       Full 4-week schedule (7 meetings, copy into Outlook)
   • questionnaire-account-team.md   Pre-filled S42 intake
   • questionnaire-customer-pre.md   Pre-filled customer pre-workshop responses
   • transcript-kickoff.md      Fixture Teams transcript (52 min kickoff)
   • transcript-workshop-1.md   Fixture Teams transcript (41 min workshop)
   • research/customer-public.md          Public-web research (Task Researcher fixture)
   • research/m365-researcher-prompt.md   The Path B prompt — copy-paste into M365 Copilot's Researcher
   • research/m365-researcher-results.md  Paste-back result from M365 Researcher (fixture)
   • research/research-summary.md         Synthesis of public + M365 with per-fact attribution
   • sample-data/technicians.csv, sites.csv, work-orders.csv

📁 Initialized:
   • templates/PROJECT-CONTEXT.md     pre-filled with Contoso details
   • templates/customer-brief.md      seeded with Sandra's customer-voice brief
   • engagement/contoso-dispatcher-ai/  ready for agent outputs
   • .copilot-tracking/vibe/contoso-dispatcher-ai/state.json  per-user state
     (phase=preparation, preparation readiness 7/7 — ready to move to Discover)

🎬 Recommended demo flow (each step takes 1-5 minutes to run):

   1. @VIBE Preparation                  Reads everything, synthesises the two
                                         research paths into research-summary.md,
                                         and shows the 7-field Preparation readiness
                                         dashboard (all green for the demo).

   2. @VIBE Discover                     Reads sources/, produces discovery-summary.md.
                                         Shows how the agent extracts a populated picture
                                         from questionnaires + transcripts automatically.

   3. @VIBE Define                       Frames the $50M problem, prioritizes use cases.
                                         Watch it surface "SLA early-warning" as the
                                         sequenced first deliverable (per workshop transcript).

   4. /vibe-ideate                       Generates 2-3 form-factor concepts (web app for
                                         dispatchers, conversational for customer service,
                                         agentic option — which Bartosz parks in the transcript).

   5. /vibe-data-prep                    Typifies the three CSVs into models for the .NET API.
                                         (Only meaningful for the web-app concept path.)

   6. /vibe-deploy                       Form-factor-aware engineer guidance for whichever
                                         concept the squad picks.

   7. /vibe-handoff                      Generates roadmap, backlog, limitations, vision.
                                         Step by step — approve each section before moving on.

💡 The fixture is realistic enough that every agent should produce believable output.
   Reset the demo at any time by deleting engagement/, sources/, and scaffold/data/,
   then re-running /vibe-demo.

👉 NEXT: Run @VIBE Preparation
```

## Notes for the agent

- **Don't auto-run** `@VIBE Discover` after seeding. The user wants to see each phase fire individually — that's the whole point of the demo.
- The demo is identified by the `demoFixture` field in `state.json` — other prompts can branch on this if they want demo-specific behaviour later.
- If the user runs `/vibe-demo` twice, treat the second run as a reset (with confirmation).
