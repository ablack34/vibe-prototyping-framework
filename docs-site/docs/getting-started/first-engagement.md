---
sidebar_position: 2
title: Your First Engagement
---

# Your First Engagement

A step-by-step walkthrough of running a complete VIBE engagement.

## Step 1: Create the Workspace

On the [framework's GitHub page](https://github.com/ablack34/vibe-prototyping-framework), click **["Use this template" → "Create a new repository"](https://github.com/ablack34/vibe-prototyping-framework/generate)**. Name it `<customer>-<engagement>` (e.g., `contoso-field-scheduling`) and make it private.

Then clone it locally and open in VS Code:

```powershell
git clone https://github.com/<your-org>/contoso-field-scheduling
code contoso-field-scheduling
```

:::tip Already inside another engagement?
You can also create a sibling engagement from inside Copilot Chat with `/vibe-new customer="..." engagement="..."` — it runs `gh repo create` for you.
:::

## Step 2: Kick Off (Preparation)

Open Copilot Chat (`Ctrl+Shift+I`), switch to **Agent mode**, and type:

```
/vibe-kickoff customer="<your-customer>" problem="<describe the problem>"
```

:::tip New to the UI mechanics?
If you're not sure how to invoke `@`-agents, what the `👉 NEXT:` directive looks like, or which folder each generated file lands in, read [How to Use VIBE Day-to-Day](/getting-started/how-to-use) first. It's a 5-minute orientation that prevents the most common first-engagement confusion.
:::

**What happens:**
- Fills `engagement/{{engagement-kebab}}/PROJECT-CONTEXT.md` with the inputs
- Creates `engagement/<your-engagement>/` (shared with the team, committed)
- Creates `.copilot-tracking/vibe/<your-engagement>/state.json` (per-user, gitignored) with `currentPhase: preparation`
- Drafts `engagement/{{engagement-kebab}}/engagement-brief.md` (S42-internal) and `engagement/{{engagement-kebab}}/customer-brief.md` (customer-voice placeholder) from the inputs
- Generates the full **4-week meeting schedule** (kickoff, 2× discover, disrupt workshop, 2× check-in, handoff) into `sources/meeting-templates.md`
- Tells you what to do next

Then close the Preparation gate before moving to Discover:

```
@VIBE Preparation
```

The Preparation agent ingests anything you've dropped into `sources/`, drafts the gaps, and kicks off `/vibe-research` (dual-path: public web via `@Task Researcher`, plus a paste-back prompt for **M365 Copilot's Researcher** so you can pull in tenant signal). Run `/vibe-prep-check` at the end of Week 0 to verify all 7 readiness fields are at Grade B+ before you switch into Discover mode.

## Step 3: Send Questionnaires

```
/vibe-questionnaire
```

Generates prompts you paste into M365 Copilot (in [Microsoft Forms](https://forms.cloud.microsoft.com)) — one for the account team (internal) and one for the customer (pre-workshop). Send both immediately, ideally 3+ days before the first workshop.

## Step 4: Record and Process Meetings

**Name every meeting:** `[VIBE] <Your Customer> — Kickoff` (and Workshop 1, Check-in 1, etc.)

After each meeting:

```
/vibe-transcript
```

During workshops, capture quick insights without breaking your facilitation flow:

```
/vibe-capture "Customer said errors cost $2M in overtime"
```

## Step 5: Run Discovery

```
@VIBE Discover
```

The agent automatically reads everything in `sources/`, processes transcripts, and checks your questionnaire responses. It shows you what's known and **only asks about gaps** — grading each of the 9 discovery fields A/B/C.

The agent writes `engagement/<your-engagement>/discovery-summary.md`.

Once the 9-field readiness sits at 7+ at Grade B+, run the three required Discover deliverable prompts in order — Discover cannot close until all three exist at Grade B or higher:

```
/vibe-personas              # one persona per H2, sourced quotes, A/B/C grade per persona
/vibe-problem-statement     # formal "I am / trying to / But / Because / which results in" with cited evidence
/vibe-current-journey       # Mermaid + stages table + Top 3 ranked pain points (feeds the Disrupt workshop)
```

The latter two anchor to the primary persona and will fail fast if `personas.md` doesn't exist yet, so always run them in this order. Each template includes a customer sign-off block — get the sign-off before moving to Disrupt (unsigned problem statements are the #1 cause of workshop rework). Run `/vibe-doctor` at any point to see whether the deliverables (or the 9 readiness fields) are blocking the gate.

## Step 6: Co-create the Concept (Disrupt Workshop — Week 2)

Click **"🎬 Begin Disrupt Workshop"** or type:

```
@VIBE Disrupt
```

Disrupt is the **one phase where the customer is in the room co-creating with us**. The Disrupt agent walks you through 6 prompts (`/vibe-workshop-agenda`, `/vibe-concepts`, `/vibe-workshop-record`, `/vibe-selected-concept`, `/vibe-future-journey`, `/vibe-storyboard`) split across pre-workshop prep and post-workshop synthesis. See [Phases → Disrupt](/phases/disrupt) for the full step-by-step.

Outputs land in `engagement/<your-engagement>/`:

- `workshop-agenda.md` — the runbook the facilitator uses in the room
- `spark-prompts.md` — pre-vetted prompts for [GitHub Spark](https://spark.github.com) / [Copilot Studio](https://copilotstudio.microsoft.com), produced **before** the workshop
- `workshop-record.md` — the structured synthesis of what happened
- `selected-concept.md` — the concept the customer picked
- `future-state-journey.md` — Mermaid diagram of the post-prototype journey
- `storyboard.md` — **the engineer's primary input for Build**

## Step 7: Build (Engineer)

The engineer `git pull`s and reads `engagement/<your-engagement>/storyboard.md` (the contract from Disrupt) plus `selected-concept.md` (the chosen form factor) and `future-state-journey.md` (the redesigned user flow). Their first Build task is to write `engagement/<your-engagement>/engineering-brief.md` from those three files (template at `templates/engineering-brief.md`) and get squad-lead sign-off.

Build steps vary by form factor — but typically:

```
/vibe-data-prep
```

…to prepare any customer data into typed models. Then the engineer scaffolds the prototype in whichever framework matches the chosen form factor (React + .NET starter is in [`scaffold/`](/reference/templates) for web-app concepts; other form factors use Copilot Studio, Foundry Agents, Power Platform, or M365 Agents Toolkit directly).

When ready to share:

```
/vibe-deploy
```

This isn't an auto-deploy — it's an engineer-facing **deployment plan** that branches on form factor (web app → Azure SWA + App Service, conversational → publish from Copilot Studio, agentic → Foundry Agents, etc.).

## Step 8: Deliver

```
/vibe-handoff
```

Produces `engagement/<your-engagement>/handoff-data.json` step by step — you approve each section: vision → roadmap → backlog → limitations → validation → final package.

To also push the backlog to Azure DevOps:

```
/vibe-backlog-gen project="<your ADO project name>"
```

:::tip The Golden Rule
**If you're ever lost, click "❓ What's Next?"** — the engagement lead reads your committed engagement artifacts and tells you exactly what to do.
:::
