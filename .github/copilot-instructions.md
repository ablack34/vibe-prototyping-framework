# VIBE Prototyping Framework

This repo is a reusable IP framework for Studio 42 VIBE Prototyping engagements. It provides custom agents, prompts, instructions, templates, and a prototype scaffold for running repeatable AI-first envisioning and prototyping engagements.

## Quick Start (for all team members)

1. **Start a new engagement**: Type `/vibe-kickoff` in Copilot Chat
2. **Process meeting transcripts**: Type `/vibe-transcript`
3. **Process check-in feedback**: Type `/vibe-check-in`
4. **Consolidate findings**: Type `/vibe-consolidate`
5. **Scaffold a prototype**: Type `/vibe-prototype-scaffold`
6. **Generate ADO backlog**: Type `/vibe-backlog-gen`
7. **Deploy to Azure**: Type `/vibe-deploy`
8. **Generate final handoff**: Type `/vibe-handoff`

## Engagement Phases

This framework follows the VIBE Prototyping methodology:

| Phase | Focus | Key Prompts |
|-------|-------|-------------|
| **Discover** | User needs, business goals, AI opportunities | `/vibe-kickoff`, `/vibe-transcript` |
| **Disrupt** | Problem framing, use case prioritization, success metrics | `/vibe-consolidate` |
| **Design & Develop** | Rapid prototyping with cross-functional collaboration | `/vibe-prototype-scaffold`, `/vibe-deploy` |
| **Deliver** | Validation, feedback, roadmap, handoff | `/vibe-backlog-gen`, `/vibe-handoff` |

## Repo Structure

- `.github/agents/` — Custom VIBE agents for each engagement phase
- `.github/prompts/` — Quick-launch prompts for common actions
- `.github/instructions/` — Auto-applied conventions for docs and code
- `.github/workflows/` — GitHub Actions CI/CD for deployment
- `templates/` — Engagement document templates (copy per engagement)
- `scaffold/` — React + .NET prototype starter code
- `docs/` — Playbook, HVE-Core guide, MCP setup guide

## Conventions

- **Engagement state** lives in `.copilot-tracking/vibe/{{engagement-name}}/` (gitignored)
- **Templates** use `{{placeholder}}` syntax for customer-specific values
- **Data files** go in `scaffold/data/` with a README documenting the schema
- **Prototypes** deploy to Azure Static Web Apps (frontend) + App Service (API)

## Required MCP Servers

| Server | Purpose | Priority |
|--------|---------|----------|
| GitHub MCP | Repo operations, PR creation | Core |
| ADO MCP | Work item tracking, backlog generation | Core |
| work-iq-mcp | Teams meeting transcript analysis | Core |
| Playwright MCP | Screenshot capture for documentation | Recommended |

## Tech Stack Defaults

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query + Zustand
- **Backend**: .NET 9 Minimal APIs + CsvHelper
- **Infrastructure**: Bicep (Azure SWA + App Service + Log Analytics)
- **CI/CD**: GitHub Actions
- **Tracking**: Azure DevOps
