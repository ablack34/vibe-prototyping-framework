# VIBE Prototyping Playbook

> Step-by-step guide for running a VIBE Prototyping engagement using this framework.

---

## Before You Start

### Prerequisites

- VS Code with GitHub Copilot Chat enabled
- HVE-Core extension installed (v3.2+)
- MCP servers configured (see [mcp-setup.md](mcp-setup.md))
- Azure subscription for deployment
- Access to Azure DevOps for backlog tracking

### Day-One Checklist

- [ ] **Record all customer meetings in Teams** — this is the single most important thing. The framework extracts context automatically.
- [ ] **Use the naming convention** for all meetings: `[VIBE] Customer Name — Meeting Type` (e.g., `[VIBE] Contoso — Kickoff`). This ensures transcript search works reliably.
- [ ] **Send questionnaires early** — run `/vibe-questionnaire` and send the customer pre-workshop questionnaire 3-5 days before the first session.
- [ ] **Drop customer docs in `sources/`** — any decks, RFPs, or briefs shared by the customer or account team.

### Meeting Naming Convention

All engagement meetings should follow this pattern:

```
[VIBE] {{Customer}} — {{Meeting Type}}
```

Examples:

- `[VIBE] Contoso — Kickoff`
- `[VIBE] Contoso — Workshop 1`
- `[VIBE] Contoso — Check-in 2`
- `[VIBE] Contoso — Handoff`

The `[VIBE]` prefix + customer name makes every meeting findable by the transcript analysis agent. Meeting invite templates are auto-generated during `/vibe-kickoff` — just copy them into Outlook.

---

## Engagement Flow

### Week 0: Pre-Engagement

1. Run `/vibe-kickoff` to create the engagement workspace
2. Run `/vibe-questionnaire` to generate questionnaire prompts — paste into M365 Copilot to create Forms
3. Send the **account team intake** form to the account team
4. Send the **customer pre-workshop** form to the customer sponsor
5. Schedule meetings using the invite templates in `sources/meeting-templates.md`
6. Drop any customer-shared documents into `sources/`

### Week 1: Discover

#### Day 1: Kickoff

In Copilot Chat, type:

```
/vibe-kickoff customer="Contoso" problem="Field technicians waste 2hrs/day on manual scheduling" size=S
```

This creates the engagement tracking structure, initialises PROJECT-CONTEXT.md, and generates meeting invite templates.

#### Days 1-3: Gather Context (Sources Come to You)

Context flows in from multiple sources — you don't need to collect it all manually:

| Source | How It Arrives | What You Do |
|--------|---------------|-------------|
| Customer questionnaire | Customer fills the Microsoft Form | Drop responses in `sources/` |
| Account team intake | Account team fills the internal Form | Drop responses in `sources/` |
| Customer documents | Customer emails decks/briefs | Drop in `sources/` |
| Meeting transcripts | Meetings recorded in Teams | Run `/vibe-transcript` |
| Workshop observations | You notice something in a meeting | Run `/vibe-capture "observation text"` |

#### During workshops: Quick capture

Don't stop facilitating to take notes. Just type quick captures:

```
/vibe-capture "Customer sponsor said scheduling errors cost $2M in overtime. 3 people nodded."
/vibe-capture "They have an API for scheduling but it's SOAP-based and undocumented" speaker="Dave Wilson"
/vibe-capture "Non-negotiable: demo by end of week 2 for board presentation" category=decision
```

#### After each customer meeting: Process the transcript

```
/vibe-transcript engagement=contoso-scheduling
```

This pulls the Teams meeting transcript and extracts:

- Problem statements (in the customer's own words)
- Business value signals ("$400K in overtime costs")
- Pain points (for JTBD analysis)
- Requirements and decisions
- Action items

#### Days 2-3: Run Discovery (Source-First)

Talk to `@VIBE Discover`. It will:

1. **Automatically ingest** everything in `sources/` (customer docs, questionnaire responses, workshop notes)
2. **Process transcripts** if work-iq-mcp is configured
3. **Read the engagement brief** for account team context
4. **Show a readiness dashboard** — what's known vs what's missing
5. **Only ask about gaps** — not the 20 questions it already has answers to
6. Optionally delegate to `@UX UI Designer` (JTBD analysis) and `@Task Researcher` (domain research) to enrich findings

#### Day 3-4: Check Readiness

Ask `@VIBE Engagement Lead` "what's next?" to see the readiness dashboard. It shows which of the 9 discovery fields are filled and which gaps remain. Close the gaps, then move to Disrupt.

### Week 1-2: Disrupt

#### Frame the Problem

Talk to `@VIBE Disrupt` to:

- Frame the business value ("Are we solving a $50K or $50M problem?")
- Prioritize use cases for the prototype
- Define success metrics

#### Document Requirements

The Disrupt agent produces:

- `templates/requirements-summary.md` — Get customer sign-off on this
- `templates/solution-design.md` — Internal technical decisions

### Week 2-3: Design & Develop

#### Prepare Data

Place customer data files in `scaffold/data/`, then:

```
/vibe-data-prep
```

This analyzes the data, generates TypeScript/C# models, and creates the data dictionary.

#### Scaffold the Prototype

```
/vibe-prototype-scaffold
```

Generates customer-specific pages, personas, and routes from your requirements.

#### Build Iteratively

Use the HVE-Core task pipeline for feature development:

1. `/task-research` — Research a technical approach
2. `/task-plan` — Create an implementation plan
3. `/task-implement` — Execute the plan
4. `/task-review` — Validate the work

#### Process Check-ins

After each customer check-in:

```
/vibe-check-in source=transcript
```

Or paste raw notes:

```
/vibe-check-in source=notes
```

#### Deploy

```
/vibe-deploy
```

Deploy to Azure SWA + App Service. Share the URL with the customer.

### Week 3-4: Deliver

#### Generate Deliverables

```
/vibe-handoff
```

Produces the roadmap, limitations doc, and handoff package.

#### Generate ADO Backlog

```
/vibe-backlog-gen project="Contoso Scheduling"
```

Creates Epics → Features → User Stories in Azure DevOps.

---

## Quick Reference

| What To Do | Command | When |
|-----------|---------|------|
| Start engagement | `/vibe-kickoff` | Day 1 |
| Generate questionnaires | `/vibe-questionnaire` | Day 1 (send before first workshop) |
| Capture workshop insight | `/vibe-capture "note"` | During any meeting |
| Process meeting recording | `/vibe-transcript` | After any customer meeting |
| Process check-in notes | `/vibe-check-in` | After each check-in |
| Consolidate findings | `/vibe-consolidate` | End of discovery |
| Prepare data | `/vibe-data-prep` | Before scaffolding |
| Scaffold prototype | `/vibe-prototype-scaffold` | Start of build |
| Deploy to Azure | `/vibe-deploy` | When ready to share |
| Generate backlog | `/vibe-backlog-gen` | Before handoff |
| Generate handoff | `/vibe-handoff` | End of engagement |
| Create new engagement repo | `/vibe-new` | Before anything else |
| Ask what to do next | Talk to `@VIBE Engagement Lead` | Anytime |

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Transcript extraction fails | Check work-iq-mcp is configured (see [mcp-setup.md](mcp-setup.md)) |
| API not connecting | Run `start.ps1` to start both servers locally |
| Deployment fails | Run `azd auth login` and ensure Azure subscription is active |
| ADO work item creation fails | Check ADO MCP server is configured with the right PAT and project |
| Agent not responding | Make sure you're in Agent mode (not Plan mode) in Copilot Chat |
