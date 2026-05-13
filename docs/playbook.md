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

### Record Your Meetings

**This is the single most important thing you can do.** If customer workshops and check-ins are recorded in Teams, the framework can automatically extract all context — no manual note-taking required. Tell participants up front that meetings will be recorded for documentation purposes.

---

## Engagement Flow

### Week 0: Pre-Engagement

1. Complete `templates/engagement-brief.md` with account team input
2. Confirm squad, engagement size, and start date
3. Ensure customer data is obtainable (CSV/Excel preferred)

### Week 1: Discover

#### Day 1: Kickoff

In Copilot Chat, type:

```
/vibe-kickoff customer="Contoso" problem="Field technicians waste 2hrs/day on manual scheduling" size=S
```

This creates the engagement tracking structure and initializes your PROJECT-CONTEXT.md.

#### Days 1-2: Process Transcripts

After each customer meeting, type:

```
/vibe-transcript engagement=contoso-scheduling
```

This pulls the Teams meeting transcript and extracts:

- Problem statements (in the customer's own words)
- Business value signals ("$400K in overtime costs")
- Pain points (for JTBD analysis)
- Requirements and decisions
- Action items

#### Days 2-3: Deep Discovery

Talk to `@VIBE Discover` to:

- Review and enrich transcript findings
- Conduct JTBD analysis (delegates to `@UX UI Designer`)
- Run deep research on the problem domain (delegates to `@Task Researcher`)

#### Day 3-4: Stakeholder Alignment

Use `/vibe-consolidate` to synthesize all findings into a structured view and present to the customer.

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
| Process meeting recording | `/vibe-transcript` | After any customer meeting |
| Process check-in notes | `/vibe-check-in` | After each check-in |
| Consolidate findings | `/vibe-consolidate` | End of discovery |
| Prepare data | `/vibe-data-prep` | Before scaffolding |
| Scaffold prototype | `/vibe-prototype-scaffold` | Start of build |
| Deploy to Azure | `/vibe-deploy` | When ready to share |
| Generate backlog | `/vibe-backlog-gen` | Before handoff |
| Generate handoff | `/vibe-handoff` | End of engagement |
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
