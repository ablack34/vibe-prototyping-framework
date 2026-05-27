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

## Step 2: Kick Off

Open Copilot Chat (`Ctrl+Shift+I`), switch to **Agent mode**, and type:

```
/vibe-kickoff customer="<your-customer>" problem="<describe the problem>"
```

**What happens:**
- Fills `templates/PROJECT-CONTEXT.md` with the inputs
- Creates `engagement/<your-engagement>/` (shared with the team, committed)
- Creates `.copilot-tracking/vibe/<your-engagement>/state.json` (per-user, gitignored)
- Generates 4 meeting invite templates in `sources/meeting-templates.md`
- Tells you what to do next

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

## Step 6: Frame the Problem

Click **"💡 Frame the Problem"** or type:

```
@VIBE Define
```

Frames the business value ($50K vs $50M lens), prioritizes use cases, and produces `templates/requirements-summary.md` for customer sign-off.

## Step 7: Brainstorm Concepts

Click **"💡 Ideate Concepts"** or type:

```
/vibe-ideate
```

Generates 2-3 AI-powered prototype concepts across different form factors (web app, conversational, agentic, Copilot extension, low-code). Outputs land in `engagement/<your-engagement>/`:

- `ideation-concepts.md` — all concepts compared
- `selected-concept.md` — chosen concept with narrative
- `spark-prompts.md` — paste into [GitHub Spark](https://spark.github.com) or [Copilot Studio](https://copilotstudio.microsoft.com) for instant visualization
- `engineering-brief.md` — **the engineer's primary input**

## Step 8: Build (Engineer)

The engineer `git pull`s and reads `engagement/<your-engagement>/engineering-brief.md`.

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

## Step 9: Deliver

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
