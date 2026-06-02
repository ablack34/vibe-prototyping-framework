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

1. Confirms with the user that loading the demo will populate `sources/` and `engagement/contoso-dispatcher-ai/` (pre-filled Preparation outputs only — Discover deliverables get generated fresh by the agents).
2. Copies `demo/<demo>/*.md` (excluding the demo's own README) into `sources/` so the agents pick them up just like real customer-supplied sources.
3. Copies `demo/<demo>/sample-data/*.csv` into `sources/sample-data/` (so `/vibe-data-prep` can later typify them into `scaffold/data/`).
4. Creates `engagement/contoso-dispatcher-ai/` with three pre-filled Preparation artifacts (`PROJECT-CONTEXT.md`, `customer-brief.md`, and an empty `engagement-brief.md` scaffold that `@VIBE Preparation` will fill).
5. Creates `.copilot-tracking/vibe/contoso-dispatcher-ai/state.json` exactly as `/vibe-kickoff` would.
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
├── customer-brief.md                    → sources/customer-brief.md   AND  → engagement/contoso-dispatcher-ai/customer-brief.md
├── meeting-templates.md                 → sources/meeting-templates.md (full 7-meeting schedule)
├── questionnaire-account-team.md        → sources/questionnaire-account-team.md
├── questionnaire-customer-pre.md        → sources/questionnaire-customer-pre.md
├── transcript-kickoff.md                → sources/transcript-kickoff.md
├── transcript-workshop-1.md             → sources/transcript-workshop-1.md
├── research/customer-public.md          → sources/research/customer-public.md
├── research/m365-researcher-prompt.md   → sources/research/m365-researcher-prompt.md
├── research/m365-researcher-results.md  → sources/research/m365-researcher-results.md
├── research/research-summary.md         → sources/research/research-summary.md
├── discover-outputs/                    (do NOT copy — these are reference examples
│   ├── personas.md                       only. The whole point of the demo is to
│   ├── problem-statement.md              watch @VIBE Discover generate these from
│   └── current-state-journey.md          sources/. If you want to compare, open
│                                         them side-by-side after Discover runs.)
└── sample-data/*.csv                    → sources/sample-data/*.csv
```

### Step 2 — Copy

Copy every file listed above into `sources/` (preserve filenames). Create `sources/sample-data/` and `sources/research/` if they don't exist.

`customer-brief.md` is special: copy it into BOTH `sources/customer-brief.md` (so `@VIBE Discover` and `@VIBE Disrupt` see it as a source) AND `engagement/contoso-dispatcher-ai/customer-brief.md` (so `@VIBE Preparation` sees a populated brief without re-running `/vibe-customer-brief`). **Never write into `templates/`** — `templates/customer-brief.md` is a blank scaffold and must stay untouched.

**Do NOT copy `discover-outputs/*` anywhere.** Those files in `demo/contoso/discover-outputs/` are reference examples only — they show what `@VIBE Discover` is expected to produce when it runs against the demo's `sources/`. The whole point of the demo is that the user invokes `@VIBE Discover` and watches it generate `personas.md`, `problem-statement.md`, and `current-state-journey.md` fresh in `engagement/contoso-dispatcher-ai/`. Pre-seeding them would short-circuit Discover and route the user straight to Disrupt with nothing to look at — defeating the purpose of the demo.

### Step 3 — Pre-fill engagement artifacts

For the `contoso` demo, create `engagement/contoso-dispatcher-ai/PROJECT-CONTEXT.md` by copying `templates/PROJECT-CONTEXT.md` and filling it with:

- Customer: `Contoso Field Services`
- Engagement: `Dispatcher AI`
- Problem statement: `SLA breaches on premium HVAC service contracts (Platinum 2hr / Gold 4hr) cost ~€4M/year in penalties and another ~€6M/year in lost renewals. 14 dispatchers manually match ~180 work orders/day to 280 EMEA technicians using a 2008 ASP.NET system. Customer wants AI to suggest the best technician per work order, flag SLA risk early, and free dispatcher attention.`
- Sponsor: `Sandra Holtz, COO`
- Technical contact: `Matthias Köhler, Director of Operations Tech`
- Account team contact: `Priya Raman`

Also copy `templates/engagement-brief.md` to `engagement/contoso-dispatcher-ai/engagement-brief.md` as a blank scaffold (placeholders intact) so `@VIBE Preparation` has something to populate when it runs. Don't pre-fill it — Preparation generating the brief from sources is the demo's first real piece of agent work.

Leave the remaining PROJECT-CONTEXT fields empty — they'll fill in as the discovery and disrupt agents process the sources.

**Never modify any file in `templates/`** — those are blank scaffolds. Every filled artifact lives in `engagement/contoso-dispatcher-ai/`.

### Step 4 — Initialize engagement structure

Create:

- `engagement/contoso-dispatcher-ai/` (committed shared artifacts — empty for now, agents will populate)
- `.copilot-tracking/vibe/contoso-dispatcher-ai/state.json` with the following shape (uses `currentPhase`, not `phase`, to match the Engagement Lead schema):
  - `customer: "Contoso Field Services"`
  - `engagement: "Dispatcher AI"`
  - `engagementKebab: "contoso-dispatcher-ai"`
  - `currentPhase: "preparation"` — Preparation runs first. The readiness block below is pre-filled at Grade A because the brief/research/schedule files are seeded, so running `@VIBE Preparation` will print a 7/7 dashboard and hand off to Discover. **Discover deliverables are NOT pre-seeded** — `@VIBE Discover` is expected to generate them fresh, which is where the user sees real agent work for the first time.
  - `createdAt: <now>`
  - `demoFixture: "contoso"`
  - `phases.preparation.status: "complete"`, `artifacts: ["engagement-brief.md", "customer-brief.md", "meeting-templates.md", "research/customer-public.md", "research/m365-researcher-prompt.md", "research/m365-researcher-results.md", "research/research-summary.md"]`
  - `phases.discover.status: "ready"` (the other phases default to `not-started`). The engagement folder is empty — Discover will create `personas.md`, `problem-statement.md`, and `current-state-journey.md` when invoked. The engagement-lead reconciliation logic (file system wins) will then flip the readiness fields as each file appears.
  - `readiness.preparation` with all 7 fields graded:
    - `engagementBrief: { "status": "filled", "grade": "A" }`
    - `customerBrief: { "status": "filled", "grade": "A" }`
    - `customerResearch: { "status": "filled", "grade": "A", "public": "filled", "m365": "filled" }`
    - `meetingSchedule: { "status": "complete", "grade": "A", "weeks": { "kickoff": "scheduled", "discover-1": "scheduled", "discover-2": "scheduled", "disrupt-workshop": "scheduled", "checkin-1": "scheduled", "checkin-2": "scheduled", "handoff": "scheduled" } }`
    - `existingDocs: { "status": "filled", "grade": "A", "count": 4 }`
    - `priorTranscripts: { "status": "filled", "grade": "A", "count": 2 }`
    - `kickoffComplete: { "status": "filled", "grade": "A" }`
  - `readiness.discover` — leave this block OUT entirely (or set all sub-fields to `{ "status": "empty", "grade": null }`). The deliverables don't exist yet; the file-system reconciliation logic will populate them as Discover writes each file.
  - 9 Discovery readiness fields — leave OUT entirely (or set all to `{ "status": "empty", "grade": null }`). They'll be populated as Discover processes sources/ and writes deliverables.

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

📁 Reference (NOT copied — these are example outputs Discover should produce):
   • demo/contoso/discover-outputs/personas.md
   • demo/contoso/discover-outputs/problem-statement.md
   • demo/contoso/discover-outputs/current-state-journey.md
   (Open these side-by-side when @VIBE Discover runs, to compare its output to the
   reference. They're the answer key, not pre-populated state.)

📁 Initialized:
   • engagement/contoso-dispatcher-ai/PROJECT-CONTEXT.md  pre-filled with Contoso details
   • engagement/contoso-dispatcher-ai/customer-brief.md   seeded with Sandra's customer-voice brief
   • engagement/contoso-dispatcher-ai/engagement-brief.md blank scaffold — @VIBE Preparation fills this
   • .copilot-tracking/vibe/contoso-dispatcher-ai/state.json  per-user state
     (phase=preparation, prep readiness 7/7 at Grade A since the briefs and research
      are pre-seeded. Discover readiness is empty — that's where you'll see real
      agent work happen first.)

🎬 Recommended demo flow (each step takes 1-5 minutes to run):

   1. @VIBE Preparation                  Reads everything, confirms the 7-field
                                         Preparation readiness dashboard (all green
                                         because the briefs/research/schedule are
                                         pre-seeded), and recommends moving to Discover.
                                         This step is mostly a dashboard view — the
                                         real agent work begins at Step 2.

   2. @VIBE Discover                     Reads sources/ + briefs + transcripts and
                                         generates the 3 deliverables fresh:
                                           /vibe-personas         → personas.md
                                           /vibe-problem-statement → problem-statement.md
                                           /vibe-current-journey  → current-state-journey.md
                                         You'll see each deliverable graded A/B/C
                                         against the rubric. Compare to the reference
                                         files in demo/contoso/discover-outputs/ — they
                                         should land close.

   3. @VIBE Disrupt                      The one phase the customer co-creates with us
                                         (Week 2 workshop). Run this sequence:
                                           Pre-workshop:  /vibe-workshop-agenda → /vibe-concepts
                                                          (paste Spark prompts into spark.github.com
                                                          to pre-build visuals)
                                           Workshop:      facilitate; capture notes to sources/workshop/
                                                          (the fixture transcript-workshop-1.md is
                                                          already in sources/ — copy it into
                                                          sources/workshop/ to simulate)
                                           Post-workshop: /vibe-workshop-record → /vibe-selected-concept
                                                          → /vibe-future-journey → /vibe-storyboard
                                         The storyboard is the contract handed to engineering.

   4. /vibe-data-prep                    Typifies the three CSVs into models for the .NET API.
                                         (Only meaningful for the web-app concept path.)

   5. /vibe-deploy                       Form-factor-aware engineer guidance for whichever
                                         concept the squad picks.

   6. /vibe-handoff                      Generates roadmap, backlog, limitations, vision.
                                         Step by step — approve each section before moving on.

   (Legacy alternative for Step 3: @VIBE Define → /vibe-ideate instead of @VIBE Disrupt.
   The legacy path still works for in-flight engagements that started before Disrupt existed.)

💡 The fixture is realistic enough that every agent should produce believable output.
   Reset the demo at any time by deleting engagement/, sources/, and scaffold/data/,
   then re-running /vibe-demo.

👉 NEXT: Click "🛠 Begin Preparation" to start the Week 0 setup.
```

## Notes for the agent

- **Don't auto-run** `@VIBE Discover` after seeding. The user wants to see each phase fire individually — that's the whole point of the demo.
- The demo is identified by the `demoFixture` field in `state.json` — other prompts can branch on this if they want demo-specific behaviour later.
- If the user runs `/vibe-demo` twice, treat the second run as a reset (with confirmation).
