---
sidebar_position: 5
title: "Phase 5: Deliver"
---

# Phase 5: Deliver

**Who:** Anyone on the squad · **Duration:** 1-2 days

Generate the final deliverables, roadmap, ADO backlog, and handoff package.

## Deliverables

### Product Roadmap

The handoff agent generates a three-phase roadmap:

| Phase | What It Covers |
|-------|---------------|
| **Prototype** (delivered) | What was built, key features, tech stack |
| **MVP** (recommended) | Production-readiness: auth, live data, testing |
| **Production** (future) | Full scale, operations, integrations |

### ADO Backlog

```
/vibe-backlog-gen project="<your ADO project name>"
```

Generates a work item hierarchy:

- **Epics** — Major capability areas
- **Features** — Specific feature areas
- **User Stories** — Individual stories with acceptance criteria

Every story follows: "As a [persona], I want [action], so that [outcome]"

### Prototype Limitations

Honest documentation of what the prototype does **not** do:

- No authentication (needs Entra ID)
- Static mock data (needs live API integration)
- No automated tests (needs test suites)
- Desktop-only (needs responsive design)

### Handoff Package

```
/vibe-handoff
```

Consolidates everything:

- Engagement overview
- What was delivered (deployed URL, key features)
- Customer feedback summary
- Recommended next steps
- All artifact locations

## Key Commands

| Command | What It Does |
|---------|-------------|
| `/vibe-backlog-gen` | Creates ADO work items from requirements |
| `/vibe-handoff` | Generates the full handoff package |
| `@VIBE Deliver` | Guides the full deliverables process |
