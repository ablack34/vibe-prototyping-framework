---
description: "Start a new VIBE Prototyping engagement"
agent: "VIBE Engagement Lead"
argument-hint: "customer=... problem=... [size={XS|S|M|L}]"
---

# VIBE Kickoff

Start a new VIBE Prototyping engagement. Creates the engagement tracking structure, initializes PROJECT-CONTEXT.md, and guides you through the first steps.

## Inputs

- ${input:customer}: (Required) Customer name.
- ${input:problem}: (Required) High-level problem statement (even a rough one is fine).
- ${input:size:S}: (Optional, defaults to S) Engagement size: XS, S, M, or L.
- ${input:squad}: (Optional) Squad members and roles.

## Requirements

1. Create the engagement tracking directory at `.copilot-tracking/vibe/` using a kebab-case name derived from the customer and project.
2. Copy `templates/PROJECT-CONTEXT.md` into the engagement directory and fill in the provided inputs.
3. Copy `templates/engagement-brief.md` and populate known fields.
4. Initialize `state.json` with engagement metadata and set phase to `discover`.
5. Present a summary of what was created and recommend the next step (usually `/vibe-transcript` if meetings exist, or direct discovery).
