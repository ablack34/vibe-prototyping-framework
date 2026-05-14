---
sidebar_position: 2
title: Your First Engagement
---

# Your First Engagement

A step-by-step walkthrough of running a complete VIBE engagement.

## Step 1: Create the Workspace

Open Copilot Chat in any VS Code window and type:

```
/vibe-new customer="Contoso" engagement="field-scheduling"
```

This creates a private GitHub repo with the full framework and opens it in VS Code.

## Step 2: Kick Off

```
/vibe-kickoff customer="Contoso" problem="Field technicians waste 2hrs/day on manual scheduling" size=S
```

**What happens:**
- Creates the engagement tracking structure
- Generates meeting invite templates (copy into Outlook)
- Tells you what to do next

## Step 3: Send Questionnaires

```
/vibe-questionnaire
```

Generates prompts you paste into M365 Copilot to create Microsoft Forms — one for the account team (internal) and one for the customer (pre-workshop). Send both immediately.

## Step 4: Record and Process Meetings

**Name every meeting:** `[VIBE] Contoso — Kickoff`

After each meeting:

```
/vibe-transcript
```

During workshops, capture quick insights:

```
/vibe-capture "Customer said errors cost $2M in overtime"
```

## Step 5: Run Discovery

```
@VIBE Discover
```

The agent automatically reads everything in `sources/`, processes transcripts, and checks your questionnaire responses. It shows you what's known and **only asks about gaps**.

## Step 6: Frame the Problem

Click **"💡 Frame the Problem"** or type:

```
@VIBE Disrupt
```

Frames the business value, prioritizes use cases, and produces requirements for customer sign-off.

## Step 7: Brainstorm Concepts

Click **"💡 Ideate Concepts"** or type:

```
/vibe-ideate
```

Generates 2-3 AI-powered prototype concepts across different form factors. Paste the Spark prompts into GitHub Spark for instant visualization.

## Step 8: Build (Engineer)

The engineer picks up the engineering brief and:

```
/vibe-data-prep
/vibe-prototype-scaffold
/vibe-deploy
```

## Step 9: Deliver

```
/vibe-backlog-gen project="Contoso Scheduling"
/vibe-handoff
```

:::tip The Golden Rule
**If you're ever lost, click "❓ What's Next?"** — the engagement lead reads your progress and tells you exactly what to do.
:::
