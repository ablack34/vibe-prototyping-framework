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
       │    4. DESIGN & DEVELOP        5. DELIVER
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

## How Sources Become Deliverables

The delivery person captures sources. The AI produces documents. You review and approve.

```
SOURCES YOU CAPTURE              AI PRODUCES                DELIVERED TO CUSTOMER
───────────────────              ───────────                ──────────────────────
                                 
Teams transcripts ──┐                                      
Customer docs    ──┤            PROJECT-                   
Questionnaires   ──┼──▶ DISCOVER ──▶ CONTEXT.md            
Workshop notes   ──┤                    │                  
Engagement brief ──┘                    │                  
                                        ▼                  
                                 DISRUPT ──▶ requirements- ──▶ Customer
                                              summary.md       sign-off
                                                   │           
                                                   ▼           
                                 IDEATE ──▶ concepts +     ──▶ Spark mockups
                                            engineering-       for customer
                                            brief.md           review
                                                   │           
                                                   ▼           
Customer data  ────────▶ BUILD ──▶ prototype    ──▶ Deployed
(CSVs/Excel)                      solution-         prototype URL
                                  design.md         
                                        │           
Check-in feedback ─────────────────────▶│           
                                        ▼           
                                 DELIVER ──▶ roadmap       ──▶ Handoff
                                            limitations        package
                                            ADO backlog        
```

**You never fill a document manually.** Every document is auto-generated from your sources.

---

## Before Your First Engagement

### One-time setup (do this once, takes 10 minutes)

1. **Install VS Code** with GitHub Copilot (you probably already have this)
2. **Install HVE-Core extension** from the VS Code marketplace
3. **Install GitHub CLI**: `winget install GitHub.cli`, then `gh auth login`
4. **MCP servers are pre-configured** — just enable tools on first use (click the 🔧 icon in Copilot Chat)

Engineers also need: Node.js, .NET 9 SDK, Azure Developer CLI (`azd`)

---

## Running an Engagement

### Day 0: Create the workspace

Open VS Code and type in Copilot Chat:

```
/vibe-new customer="<your-customer>" engagement="<short-name>"
```

This creates a private repo with everything you need.

### Day 1: Kick off

```
/vibe-kickoff customer="<your-customer>" problem="<describe the customer's problem>" size=S
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
[VIBE] <Your Customer> — Kickoff
[VIBE] <Your Customer> — Workshop 1
[VIBE] <Your Customer> — Check-in 1
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

### Build Phase (Roles Split)

The engineering brief is ready. Roles diverge:

**Engineer does:**

1. `/vibe-data-prep` — prepares customer data
2. `/vibe-prototype-scaffold` — scaffolds the prototype (shaped by the concept, not a template)
3. Builds features using `/task-plan` → `/task-implement`
4. `/vibe-deploy` — deploys to Azure

**TPM/Designer does:**

1. Share the engineering brief with the engineer (`.copilot-tracking/vibe/*/engineering-brief.md`)
2. Schedule check-in demos with the customer
3. `/vibe-check-in` after each demo to capture feedback

### After Each Customer Demo

```
/vibe-check-in source=transcript
```

(or `source=notes` if you paste raw notes)

### Deliver

```
/vibe-handoff
/vibe-backlog-gen project="<your ADO project name>"
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
- **Use [GitHub Spark](https://spark.github.com) prompts** — non-technical team members can visualize concepts without coding
- **Use [Copilot Studio](https://copilotstudio.microsoft.com)** — for conversational/chat-based concept prototyping

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `/vibe-*` prompts don't appear | You're in Chat or Plan mode, not Agent mode | Click the mode picker at the top of Copilot Chat and select **Agent** |
| Transcript extraction fails | work-iq-mcp isn't configured | Follow the [MCP Setup Guide](mcp-setup.md) to configure it |
| "Transcripts not available" | Teams transcription is disabled in your tenant | Ask your IT admin to enable Teams meeting transcription |
| Agent says "I can't create files" | File editing tools are disabled | Click the tools icon (wrench) in Copilot Chat and enable file editing |
| Deployment fails with auth error | Not logged into Azure | Run `azd auth login` in the terminal and sign in via browser |
| Azure quota exceeded | Your subscription has resource limits | Check your subscription quotas in [Azure Portal](https://portal.azure.com) or try a different region |
| Agent seems confused | Context window is full from a long conversation | Start a new Copilot Chat session and reference your engagement by name |
| `.copilot-tracking/` missing | First time running — directory needs to be created | Run `/vibe-kickoff` which creates it automatically |

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
