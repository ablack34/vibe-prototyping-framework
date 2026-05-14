# Getting Started with VIBE Prototyping

> The one doc you need to read. Everything else is reference material.

---

## What Is This?

A framework that guides you through running a VIBE Prototyping engagement using AI assistants in VS Code. You type commands, the AI does the heavy lifting.

**You don't need to be technical, you just need a +1.** The AI tells you what to do at every step.

---

## The Five Phases

```
  1. DISCOVER         2. DISRUPT          3. IDEATE
  ┌──────────┐       ┌──────────┐       ┌──────────┐
  │ Understand│──────▶│ Frame the│──────▶│ Brainstorm│
  │ the       │       │ value &  │       │ AI-powered│
  │ problem   │       │ scope    │       │ concepts  │
  └──────────┘       └──────────┘       └──────────┘
  Anyone              Anyone              Anyone
  1-3 days            1-2 days            1 day
       │                                       │
       │         4. BUILD              5. DELIVER
       │         ┌──────────┐       ┌──────────┐
       └────────▶│ Engineer │──────▶│ Hand off  │
                 │ the      │       │ to the    │
                 │ prototype│       │ customer  │
                 └──────────┘       └──────────┘
                 Engineer            Anyone
                 5-10 days           1-2 days
```

**Key insight:** Phases 1-3 don't require an engineer. A TPM or designer can run the entire front half of the engagement.

---

## Before Your First Engagement

### One-time setup (do this once, takes 10 minutes)

1. **Install VS Code** with GitHub Copilot (you probably already have this)
2. **Install HVE-Core extension** from the VS Code marketplace
3. **Install GitHub CLI**: `winget install GitHub.cli`, then `gh auth login`
4. **Configure work-iq-mcp** for Teams transcript analysis — see [MCP Setup](mcp-setup.md)

Engineers also need: Node.js, .NET 9 SDK, Azure Developer CLI (`azd`)

---

## Running an Engagement

### Day 0: Create the workspace

Open VS Code and type in Copilot Chat:

```
/vibe-new customer="Contoso" engagement="field-scheduling"
```

This creates a private repo with everything you need.

### Day 1: Kick off

```
/vibe-kickoff customer="Contoso" problem="Field techs waste 2hrs/day on manual scheduling" size=S
```

**What happens:**
- Creates your engagement tracking structure
- Generates meeting invite templates (copy into Outlook)
- Tells you what to do next

**Then immediately run:**

```
/vibe-questionnaire
```

This generates prompts you paste into M365 Copilot to create Microsoft Forms:
- One for the **account team** (internal context)
- One for the **customer** (pre-workshop questions)

Send both out right away.

### Day 1 onwards: Record EVERY customer meeting

**This is the most important thing.** Name every meeting:

```
[VIBE] Contoso — Kickoff
[VIBE] Contoso — Workshop 1
[VIBE] Contoso — Check-in 1
```

After each meeting, run:

```
/vibe-transcript
```

The AI pulls the recording and extracts everything — problem statements, decisions, pain points, business value signals. **No manual note-taking needed.**

During workshops, capture quick insights:

```
/vibe-capture "Customer sponsor said errors cost $2M in overtime. Everyone nodded."
```

### After Discovery: Check readiness

Ask the engagement lead:

```
@VIBE Engagement Lead what's next?
```

You'll see a readiness dashboard showing what's known and what's missing. The agent tells you exactly how to close each gap.

### Frame the Problem

Click **"💡 Frame the Problem"** (or type `/vibe-disrupt`):

- Frames the "$50K vs $50M" business value
- Prioritizes use cases
- Produces requirements-summary.md for customer sign-off
- **No technology discussion** — that comes later

### Brainstorm Concepts

Click **"💡 Ideate Concepts"** (or type `/vibe-ideate`):

- Generates 2-3 AI-powered prototype concepts
- Different form factors: web app, chat assistant, AI agents, Copilot extension, etc.
- Each concept explains how AI is essential and how it works with mock data
- Produces **GitHub Spark prompts** you can paste to visualize concepts instantly
- Produces an **engineering brief** for the dev engineer

**Non-technical team members:** Use the Spark prompts to create quick visual mockups. Show these to the customer before engineering starts.

### Build Phase (Engineer Takes Over)

The engineer reads the engineering brief and:

1. `/vibe-data-prep` — prepares customer data
2. `/vibe-prototype-scaffold` — scaffolds the prototype (shaped by the concept, not a template)
3. Builds features using `/task-plan` → `/task-implement`
4. `/vibe-deploy` — deploys to Azure

### After Each Customer Demo

```
/vibe-check-in source=transcript
```

(or `source=notes` if you paste raw notes)

### Deliver

```
/vibe-handoff
/vibe-backlog-gen project="Contoso Scheduling"
```

Produces: product roadmap, prototype limitations, ADO backlog (Epics → Features → Stories), and the full handoff package.

---

## The Golden Rule

**If you don't know what to do, click "❓ What's Next?"**

The engagement lead reads your progress and tells you exactly which button to click.

---

## Tips

- **Record every meeting in Teams** — the transcript analysis replaces manual notes
- **Send questionnaires early** — responses auto-fill discovery fields
- **Drop customer docs in `sources/`** — the discover agent reads them automatically
- **Don't skip Ideate** — it's where creative concepts emerge that go beyond "another dashboard"
- **Use Spark prompts** — non-technical team members can visualize concepts without coding

---

## Quick Reference

| Phase | Key Prompts | Who |
|-------|------------|-----|
| **Discover** | `/vibe-kickoff`, `/vibe-transcript`, `/vibe-capture`, `/vibe-questionnaire` | Anyone |
| **Disrupt** | `@VIBE Disrupt`, `/vibe-consolidate` | Anyone |
| **Ideate** | `/vibe-ideate` | Anyone |
| **Build** | `/vibe-data-prep`, `/vibe-prototype-scaffold`, `/vibe-deploy` | Engineer |
| **Deliver** | `/vibe-backlog-gen`, `/vibe-handoff` | Anyone |
| **Anytime** | `@VIBE Engagement Lead`, `/vibe-check-in` | Anyone |
