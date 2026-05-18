---
sidebar_position: 4
title: What to Expect (Walkthrough)
---

# What to Expect — A Phase-by-Phase Walkthrough

This page shows you what each phase **actually looks like** when you run it against the Contoso Field Services demo fixture. No video required — just realistic excerpts of what each agent produces so you know what "good" looks like before your first real engagement.

:::tip Run it yourself
Everything below comes from running `/vibe-demo` in a fresh engagement repo, then following the buttons through Discover → Disrupt → Ideate → Build → Deliver. Try it.
:::

---

## Phase 0 · Kickoff

You run:

```
/vibe-kickoff customer="Contoso Field Services" problem="HVAC dispatcher AI to reduce SLA breaches" size=S
```

What you see in Copilot Chat:

```
📍 Contoso Field Services — dispatcher-ai · Phase: discover · Discovery readiness: 1/9 · Sources: 0 files

✅ Engagement created: Contoso Field Services — dispatcher-ai

📁 Files created:
  • .copilot-tracking/vibe/contoso-dispatcher-ai/state.json (per-user, gitignored)
  • engagement/contoso-dispatcher-ai/ (committed — agent outputs land here)
  • templates/PROJECT-CONTEXT.md (filled in)
  • sources/meeting-templates.md (4 meeting invite templates)

👉 NEXT: Click "🎙️ Process Transcript" once you have meeting recordings.
   Or click "🔍 Start Discovery" to fill PROJECT-CONTEXT.md from sources/.
```

**Time spent:** ~10 seconds.

---

## Phase 1 · Discover

You drop the demo fixtures into `sources/` (or run `/vibe-demo` and they're already there), then type `@VIBE Discover`.

What the agent does in the background:

1. Lists `sources/` — finds `customer-brief.md`, two questionnaire response files, two Teams transcripts, three CSVs
2. Reads everything in parallel
3. Cross-references the answers to detect contradictions
4. Grades each of the 9 readiness fields A/B/C
5. Writes `engagement/contoso-dispatcher-ai/discovery-summary.md`

What you see (excerpt):

```
📍 Contoso Field Services — dispatcher-ai · Phase: discover · Discovery readiness: 9/9 · Sources: 7 files

Discovery summary written to engagement/contoso-dispatcher-ai/discovery-summary.md.

Highlights:
  • Sandra (COO) framed the win as €4M penalties + €6M lost renewals — a $50M problem
  • Bartosz (front-line dispatcher) and Sandra both prioritised "tell me which tech" over everything else
  • Surprise insight from Workshop 1: Anya (customer service) says 80 of 120 weekly escalations
    are "you didn't tell me" — suggests SLA early-warning may be a stronger first deliverable
    than the assignment recommender
  • Hard constraint: refrigerant > 3kg requires non-expired CAT I or II certification (Klaus, F-Gas)
  • Unionised dispatchers — framing must be "augmentation not automation"

Grades:
  Problem statement      A   Target users           A
  Business impact        A   Current state          A
  Desired outcome        A   Data inventory         A
  Stakeholder map        A   Success criteria       B (need quantified targets)
  Constraints            A

👉 NEXT: Click "💡 Frame the Problem" to move to the Disrupt phase.
```

**Time spent:** ~3 minutes of agent runtime + ~2 minutes for you to read it.

---

## Phase 2 · Disrupt

You click **💡 Frame the Problem**. The Disrupt agent reads the discovery summary and writes `templates/requirements-summary.md`.

What you see (excerpt):

```
📍 Contoso Field Services — dispatcher-ai · Phase: disrupt · Discovery readiness: 9/9

requirements-summary.md written. Top-line framing:

  💰 The opportunity: $50M problem
  ─────────────────────────────────
  €4.1M  annual SLA-breach penalties (on books)
  €6.3M  annual lost renewals attributed to repeat breaches
  €1.7M  overtime from last-minute re-routes
  €1-2M  customer-service escalation cost (Anya's data)
  ─────────────────
  ~€13M / year addressable, expanding to €30M+/yr into adjacent BU over 3 years.

  🎯 Prioritised use cases (1 = highest):
    1. SLA early-warning  ────  derisks renewals, low workflow disruption
    2. Assignment recommender  ──  bigger prize, needs more change management
    3. Audit trail for F-Gas  ──  regulatory future-proofing, table stakes by Q3

  ✋ Out-of-scope for prototype: full agentic dispatcher (customer parked this)

  ✅ Success metrics:
    - >30% reduction in Platinum+Gold SLA breaches within 6 months of go-live
    - Dispatcher decision time from ~6 min to <60 sec per work order
    - Customer-facing audit trail for every assignment

👉 NEXT: Click "💡 Ideate Concepts" to brainstorm AI-powered prototype concepts.
```

**Time spent:** ~2 minutes of agent runtime + ~5 minutes for you and the squad to review and approve.

---

## Phase 3 · Ideate

You click **💡 Ideate Concepts**. The Ideate agent reads the requirements summary and produces three artifacts:

- [`engagement/contoso-dispatcher-ai/ideation-concepts.md`](/reference/templates) — all concepts compared
- `engagement/contoso-dispatcher-ai/selected-concept.md` — the chosen one
- `engagement/contoso-dispatcher-ai/spark-prompts.md` — paste into GitHub Spark for instant mockups
- `engagement/contoso-dispatcher-ai/engineering-brief.md` — the engineer's primary input

What the concepts table looks like:

```
| #  | Concept                          | Form factor              | AI essential? | Wow | Complexity |
|----|----------------------------------|--------------------------|---------------|-----|------------|
| C1 | Dispatcher Radar (web app)       | React + .NET on Azure    | Yes — risk    | ⭐⭐⭐ | Medium     |
|    |                                  |                          | scoring +     |     |            |
|    |                                  |                          | recommender   |     |            |
| C2 | Dispatcher Co-pilot (Teams)      | Copilot Studio bot       | Yes — same    | ⭐⭐⭐ | Low        |
|    |                                  |                          | logic, chat   |     |            |
|    |                                  |                          | surface       |     |            |
| C3 | Auto-router (agentic)            | Foundry Agents           | Yes — full    | ⭐⭐⭐⭐| High       |
|    |                                  |                          | autonomous    |     |            |
|    |                                  |                          | routing       |     |            |
|    |                                  |                          | + escalation  |     |            |
```

The Spark prompts file gives the squad copy-paste-ready prompts for [GitHub Spark](https://spark.github.com) so a non-technical TPM can produce clickable mockups of all three in 20 minutes:

```
Build a single-page web app called "Dispatcher Radar" for HVAC field-service dispatchers.
Layout: a queue panel on the left with 12 work orders, each card colour-coded by SLA risk
(green/amber/red). Click a card to see a right-hand panel showing the order detail and a
top-3 ranked list of suggested technicians, each with a confidence score, a one-line
explanation, and a single "Assign" button. Use Microsoft Fluent design colours, dense
information layout, no marketing chrome. Mock data only.
```

The engineering brief is the structured handoff to the dev. Excerpt:

```
# Engineering Brief — Dispatcher Radar (C1, selected concept)

## Concept summary
A dispatcher-facing web app that scores live work orders for SLA-breach risk and
recommends the top-3 technicians per order with a one-line explanation.

## Form factor & stack
- React 19 + TypeScript + Vite + Tailwind + Zustand (frontend)
- .NET 9 Minimal API + CsvHelper (backend) — serves typed records from CSV
- Azure Static Web Apps + Azure App Service (deploy)
- Optional: Azure OpenAI for the per-order explanation text

## Mock data
Already prepared in scaffold/data/ by /vibe-data-prep:
- 25 technicians (with F-Gas cert + expiry)
- 20 sites (Platinum/Gold/Silver tiers)
- 40 historical work orders with breach outcomes (training/validation signal)

## Must-have features (in priority order)
1. Live queue view with risk colour-coding
2. Per-order technician recommender with explanation
3. Hard constraint: refrigerant > 3kg requires non-expired CAT I/II tech
4. Single-click assign with audit trail entry
5. Drive-time annotation inline (no alt-tab to Google Maps)

## Explicit non-goals for the prototype
- Real-time data feed (mock only)
- Mobile app for technicians
- Auto-routing without dispatcher approval

## Demo script
[detailed walkthrough of the 8-minute live demo the customer will see]
```

**Time spent:** ~5 minutes of agent runtime + ~15-30 minutes for the squad to review, pick the concept, and have the designer iterate Spark mockups.

---

## Phase 4 · Build (Engineer)

The engineer `git pull`s, reads [`engagement/contoso-dispatcher-ai/engineering-brief.md`](/reference/templates), then:

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

…wires the brief's features into the existing React + .NET scaffold. (For concepts C2 or C3, the engineer would skip scaffold and go straight to Copilot Studio or Foundry Agents — `/vibe-deploy` covers that branch.)

When ready to share with the customer:

```
/vibe-deploy
```

This is an engineer-facing deployment **plan**, not an auto-deploy. For C1 it walks through Azure SWA + App Service via the existing Bicep in `scaffold/infra/`. For C2 it routes the engineer to "Publish" inside Copilot Studio. For C3 it walks through Foundry Agents publishing.

**Time spent:** 5-10 working days for a single engineer (per the engagement-size guide).

---

## Phase 5 · Deliver

You click **📦 Generate Deliverables**. The Deliver agent walks you through the handoff package one section at a time — you approve each one:

```
📍 Contoso Field Services — dispatcher-ai · Phase: deliver · Build complete

I'll build engagement/contoso-dispatcher-ai/handoff-data.json with you,
one section at a time. We'll do:

  1. Vision  →  2. Roadmap  →  3. Backlog  →  4. Limitations  →  5. About

Starting with #1 (Vision). Here's a draft based on requirements-summary.md,
selected-concept.md, and check-in feedback:

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
| Discover | ~5 min | 1-3 days |
| Disrupt | ~10 min | 1-2 days |
| Ideate | ~25 min | 1 day |
| Build (web app) | ~30 min to scaffold | 5-10 days |
| Deliver | ~45 min | 1-2 days |

The framework's value isn't speed in the demo — it's that the framework keeps the **real** engagement on rails so no one has to remember what comes next.
