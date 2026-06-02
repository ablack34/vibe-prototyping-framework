---
description: "Generate ADO backlog (Epics → Features → User Stories) from engagement requirements"
agent: "VIBE Deliver"
argument-hint: "project=... [engagement=...]"
---

# VIBE Backlog Gen

Generate Azure DevOps work items from the engagement requirements and solution design.

## Inputs

- ${input:project}: (Required) Azure DevOps project name.
- ${input:engagement}: (Optional) Engagement name. Auto-detected if only one engagement exists.
- ${input:areaPath}: (Optional) ADO area path for the work items.
- ${input:iterationPath}: (Optional) ADO iteration path.

## Requirements

1. Read `engagement/{{engagement-kebab}}/selected-concept.md`, `engagement/{{engagement-kebab}}/storyboard.md`, `engagement/{{engagement-kebab}}/future-state-journey.md`, `engagement/{{engagement-kebab}}/engineering-brief.md`, and `templates/solution-design.md` for requirements and build phases.
2. Generate a work item hierarchy:
   - **Epics** — One per major capability area
   - **Features** — Specific feature areas within each epic
   - **User Stories** — Individual stories with acceptance criteria
3. Each user story follows the format: "As a [persona], I want [action], so that [outcome]"
4. Map priorities: Must Have → Priority 1, Should Have → Priority 2, Could Have → Priority 3
5. Tag all items: `vibe-prototype`, customer name, engagement name
6. Present the proposed hierarchy for user review before creating work items.
7. Use ADO MCP tools to create the approved work items.
