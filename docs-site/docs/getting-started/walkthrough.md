---
sidebar_position: 4
title: What to Expect (Walkthrough)
---

# What to Expect — A Phase-by-Phase Walkthrough

This page shows you what each phase **actually looks like** when you run it against the Contoso Field Services demo fixture. No video required — just realistic excerpts of what each agent produces so you know what "good" looks like before your first real engagement.

:::tip Run it yourself
Everything below comes from running `/vibe-demo` in a fresh engagement repo, then following the buttons through **Preparation → Discover → Disrupt → Build → Deliver**. Try it.
:::

:::info Prefer M365 Notebook?
This walkthrough is for the **VS Code** surface — the primary way to run VIBE.
:::

---

## Phase 0 · Kickoff

You run:

```
/vibe-kickoff customer="Contoso Field Services" problem="HVAC dispatcher AI to reduce SLA breaches"
```

What you see in Copilot Chat:

```
📍 Contoso Field Services — dispatcher-ai · Phase: preparation · Preparation readiness: 1/7 · Sources: 0 files

✅ Engagement created: Contoso Field Services — dispatcher-ai

📁 Files created:
  • .copilot-tracking/vibe/contoso-dispatcher-ai/state.json (per-user, gitignored)
  • engagement/contoso-dispatcher-ai/ (committed — agent outputs land here)
  • engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md (filled in)
  • engagement/{{engagement-kebab}}/engagement-brief.md (S42-internal — drafted from the inputs)
  • engagement/{{engagement-kebab}}/customer-brief.md (customer-voice — placeholder for the customer to fill or for /vibe-customer-brief to draft from sources)
  • sources/meeting-templates.md (full 4-week schedule: kickoff + 2× discover + disrupt workshop + 2× check-in + handoff)

👉 NEXT: Click "🛠 Begin Preparation" — the Prep agent will draft both briefs from any sources/, kick off dual-path research, and walk you to a 7/7 readiness gate before Discover.
```

**Time spent:** ~10 seconds.

---

## Phase 1 · Preparation (Week 0)

You click **🛠 Begin Preparation** (or type `@VIBE Preparation`). The Preparation agent reads `sources/` and `templates/` and shows you what's filled vs missing on the 7-field Preparation readiness dashboard, then drafts the gaps and kicks off dual-path research.

What you see (excerpt):

```
📍 Contoso Field Services — dispatcher-ai · Phase: preparation · Preparation readiness: 2/7 · Sources: 0 files

Preparation readiness:
  Engagement brief        B   Drafted from /vibe-kickoff inputs — needs commercial/squad context
  Customer brief          C   Placeholder — no customer voice yet
  Customer research       C   Neither path A (public) nor path B (M365) has run
  Meeting schedule        A   All 7 meetings in sources/meeting-templates.md
  Existing docs           C   sources/ is empty
  Prior transcripts       C   No earlier touchpoints processed yet
  Kickoff complete        C   Kickoff meeting not yet logged

To close the gaps I'll:
  1. Run /vibe-research to start path A (public web via @Task Researcher) and generate
     the path B paste-back prompt for M365 Copilot's Researcher.
  2. Wait for you to paste any customer-authored materials into sources/ — then re-draft
     customer-brief.md from them.

👉 NEXT: Click "🔬 Run /vibe-research" (Path A starts immediately; Path B gives you a
   prompt to paste into M365 Copilot's Researcher agent).
```

After both research paths complete and the customer-brief gets a real voice (via `/vibe-customer-brief` or pasting the customer's own materials), the readiness flips to 7/7 at Grade B+ and the agent surfaces the **🚪 Begin Discover** button.

**Time spent:** ~3-5 days of calendar time (most of it waiting for the customer's materials and the M365 Researcher result). Active agent time is ~10 minutes total.

---

## Phase 2 · Discover

You drop the demo fixtures into `sources/` (or run `/vibe-demo` and they're already there), then type `@VIBE Discover`.

What the agent does in the background:

1. Lists `sources/` — finds `customer-brief.md`, two questionnaire response files, two Teams transcripts, three CSVs
2. Reads everything in parallel
3. Cross-references the answers to detect contradictions
4. Grades each of the 9 readiness fields A/B/C
5. Writes `engagement/contoso-dispatcher-ai/discovery-summary.md`
6. Checks whether the three required Discover deliverables already exist (the demo fixture pre-seeds them)

What you see (excerpt):

```
📍 Contoso Field Services — dispatcher-ai · Phase: discover · Discovery readiness: 8/9 · Discover deliverables: 3/3 at B+

Discovery summary written to engagement/contoso-dispatcher-ai/discovery-summary.md.

Highlights:
  • Sandra (COO) framed the win as €4M/yr penalties + ~€3M/yr lost renewals
    (€6.3M over 2 years per customer-brief.md) — a $50M problem
  • Bartosz (front-line dispatcher) and Sandra both prioritised "tell me which tech" over everything else
  • Surprise insight from Workshop 1: Anya (customer service) says 80 of 120 weekly escalations
    are "you didn't tell me" — suggests SLA early-warning may be a stronger first deliverable
    than the assignment recommender
  • Hard constraint: refrigerant > 3kg requires non-expired CAT I or II certification (Klaus, F-Gas)
  • Unionised dispatchers — framing must be "augmentation not automation"

Grades — 9 readiness fields:
  Problem statement      A   Target users           A
  Business impact        A   Current state          A
  Desired outcome        B   Data inventory         B
  Stakeholder map        A   Success criteria       C (customer hasn't signed off on
                                                       quantified targets yet — carry
                                                       this into Disrupt as the first
                                                       thing to lock with the customer)
  Constraints            A

Grades — 3 required Discover deliverables:
  personas.md                 B   3 personas (Bartosz A, Anya B, Marek B) — lowest wins
                                  ("Anya and Marek lack direct quotes; ride-along scheduled")
  problem-statement.md        A   Signed off by Sandra and Bartosz
  current-state-journey.md    A   8 stages, Mermaid + table, signed off by Bartosz

👉 NEXT: Both Discover gates are green (7+/9 readiness at B+, 3/3 deliverables at B+).
   Click "🎬 Begin Disrupt Workshop" to start the Week 2 customer co-creation
   workshop — successCriteria stays a C for now and Disrupt will surface it
   as the first thing to lock with the customer.
```

If you want to see the three deliverable prompts fire fresh instead of using the pre-seeded files, delete `personas.md`, `problem-statement.md`, and `current-state-journey.md` from `engagement/contoso-dispatcher-ai/` and run them in order:

```
/vibe-personas              # always first — Bartosz, Anya, Marek personas with sourced quotes
/vibe-problem-statement     # anchors to the primary persona; fails fast if personas.md missing
/vibe-current-journey       # Mermaid + stages + Top 3 ranked pains (feeds the Disrupt workshop)
```

**Time spent:** ~3 minutes of agent runtime + ~2 minutes for you to read it. Running the three deliverable prompts fresh adds ~5 minutes total.

---

## Phase 3 · Disrupt (Week 2 — Customer Co-Creation Workshop)

You click **🎬 Begin Disrupt Workshop** (or type `@VIBE Disrupt`). Disrupt is the **one phase where the customer is in the room co-creating with us**. The `@VIBE Disrupt` agent walks you through six prompts split across pre-workshop / in-workshop / post-workshop. See [Phases → Disrupt](/phases/disrupt) for the full step-by-step; the excerpts below show what each step actually produces.

### Pre-workshop — `/vibe-workshop-agenda` then `/vibe-concepts`

The agenda is anchored to the actual Discover deliverables (no generic activities), and the concepts file holds 2-3 candidate prototype concepts across different form factors that the customer reacts to in the room.

```
| #  | Concept                          | Form factor              | AI essential? | Wow |
|----|----------------------------------|--------------------------|---------------|-----|
| C1 | Dispatcher Radar (web app)       | React + .NET on Azure    | Yes — risk    | ⭐⭐⭐ |
|    |                                  |                          | scoring +     |     |
|    |                                  |                          | recommender   |     |
| C2 | Dispatcher Co-pilot (Teams)      | Copilot Studio bot       | Yes — chat    | ⭐⭐⭐ |
| C3 | Auto-router (agentic)            | Foundry Agents           | Yes — full    | ⭐⭐⭐⭐|
|    |                                  |                          | autonomous    |     |
```

The `/vibe-concepts` prompt also writes `spark-prompts.md` — copy-paste-ready prompts the facilitator drops into [GitHub Spark](https://spark.github.com) live in the workshop so the customer sees clickable mockups of all 2-3 candidates within 20 minutes.

### In-workshop

No agent runs. Humans co-create. The facilitator captures notes, sticky-note photos, Miro exports, and (ideally) a recording into `sources/workshop/`.

### Post-workshop — `/vibe-workshop-record`, `/vibe-selected-concept`, `/vibe-future-journey`, `/vibe-storyboard`

The post-workshop sequence is strict: workshop-record first → selected-concept (future-journey + storyboard both anchor to it) → future-journey (storyboard cross-references the redesigned stages, so it has to run first) → storyboard (last; the engineering contract).

The **storyboard** is the flagship Disrupt deliverable — scene-by-scene narrative (Setup → Challenge → Encounter → Solution → Impact) that the engineer reads to write the engineering brief as their first Build task.

```
# Storyboard — Dispatcher Radar (selected concept)

Scene 1 · Setup — 07:42 Monday
  Bartosz arrives. 142 work orders in the queue, 18 with weekend escalations.
  The "what do I look at first?" problem is the daily pain.

Scene 2 · Challenge — 07:45
  Three Platinum sites breaching SLA within 4 hours. Bartosz has to triage
  manually across Salesforce + WhatsApp + the route-optimization tool —
  ~6 minutes per order × 18 escalations = an hour gone before coffee.

Scene 3 · Encounter — 07:46 (with Dispatcher Radar)
  Dispatcher Radar shows the queue colour-coded by SLA risk. The three
  Platinum breaches are red, sorted to the top, with a 1-line explanation:
  "Site 4421, F-Gas tech needed, only Marek/Tomasz qualified in zone."

Scene 4 · Solution — 07:47-07:52
  Bartosz clicks the top red card. Top-3 technician recommendation shows
  with confidence scores and travel time. Marek is #1 — Bartosz assigns
  in one click. Audit-trail entry is written automatically.

Scene 5 · Impact
  18 escalations triaged in ~9 minutes (vs ~110 today). Sandra's metric
  ">30% reduction in Platinum+Gold breaches" becomes plausible.
```

**Time spent (post-workshop):** ~10-15 minutes of agent runtime for all four post-workshop prompts, plus ~30-45 minutes for the team to review, edit, and customer-sign the workshop-record and selected-concept.

---

## Phase 4 · Build (Engineer)

The engineer `git pull`s and reads `engagement/contoso-dispatcher-ai/storyboard.md` (the Disrupt contract), `selected-concept.md` (the chosen form factor), and `future-state-journey.md` (the redesigned user flow). Their **first Build task** is to write `engagement/contoso-dispatcher-ai/engineering-brief.md` from those three files using `templates/engineering-brief.md` as the scaffold. Every must-have feature in the brief has to trace to a scene in the storyboard. Squad lead signs it off.

Then:

```
/vibe-data-prep
```

…which scans `sources/sample-data/*.csv` and produces:

- `scaffold/web/src/types/contoso.ts` — TypeScript interfaces matching the CSV columns
- `scaffold/api/Models/Contoso.cs` — C# records
- `scaffold/api/Services/ContosoDataService.cs` — typed CSV loaders
- `scaffold/data/README.md` — schema doc

Then:

```
/vibe-prototype-scaffold
```

…wires the brief's must-have features into the existing React + .NET scaffold. (For non-web-app concepts like C2 Copilot Studio bot or C3 Foundry Agents, the engineer skips scaffold and goes straight to the chosen platform — `/vibe-deploy` covers that branch.)

When ready to share with the customer:

```
/vibe-deploy
```

This is an engineer-facing deployment **plan**, not an auto-deploy. For C1 it walks through Azure SWA + App Service via the existing Bicep in `scaffold/infra/`. For C2 it routes the engineer to "Publish" inside Copilot Studio. For C3 it walks through Foundry Agents publishing.

**Time spent:** 5-10 working days for a single engineer.

---

## Phase 5 · Deliver

You click **📦 Generate Deliverables**. The Deliver agent walks you through the handoff package one section at a time — you approve each one:

```
📍 Contoso Field Services — dispatcher-ai · Phase: deliver · Build complete

I'll build engagement/contoso-dispatcher-ai/handoff-data.json with you,
one section at a time. We'll do:

  1. Vision  →  2. Roadmap  →  3. Backlog  →  4. Limitations  →  5. About

Starting with #1 (Vision). Here's a draft based on selected-concept.md,
storyboard.md, engineering-brief.md, and check-in feedback:

  "Eliminate SLA-breach surprises and put dispatchers back in control of
   complex assignment decisions. Within 6 months, reduce Platinum+Gold
   breaches by >30%, cut dispatcher decision-time per order from ~6 min
   to <60 sec, and produce a regulator-ready audit trail for every
   refrigerant-related assignment. Augmentation, not automation."

Does this read right? Edit suggestions welcome before we lock it in.

👉 NEXT: Reply with edits or "looks good — next section" to move to Roadmap.
```

Once approved, the final `handoff-data.json` contains everything the customer's team needs to take the prototype forward. To also push the backlog to Azure DevOps:

```
/vibe-backlog-gen project="Contoso Field Services"
```

…creates the Epic / Feature / User Story hierarchy in ADO directly.

**Time spent:** ~30 minutes for the whole handoff package, ~10 minutes for ADO backlog push.

---

## End-to-end timing (against the demo fixture)

| Phase | Demo time | Real engagement time |
|-------|-----------|---------------------|
| Kickoff | < 1 min | < 1 hour |
| Preparation | ~5 min | Week 0 (~3-5 days) |
| Discover | ~5 min | Week 1 (1-3 days) |
| Disrupt | ~15 min | Week 2 (1 day workshop + ~1 day synthesis) |
| Build (web app) | ~30 min to scaffold | 5-10 days |
| Deliver | ~45 min | Week 4 (1-2 days) |

The framework's value isn't speed in the demo — it's that the framework keeps the **real** engagement on rails so no one has to remember what comes next.
