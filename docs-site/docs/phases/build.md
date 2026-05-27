---
sidebar_position: 4
title: "Phase 4: Build"
---

# Phase 4: Build (Design & Develop)

**Who:** Engineer (with TPM/designer support) · **Duration:** 5-10 days

This is where technology enters the picture. The engineer picks up the engineering brief from Ideate and builds the prototype.

## How It Works

### 1. Solution Design

The engineer produces `solution-design.md` covering:

- Architecture decisions (informed by the selected concept)
- Technology choices (confirmed or adjusted from concept suggestions)
- Data model based on available customer data
- Build phases ordered by customer value
- Risk inventory

### 2. Prepare Data

```
/vibe-data-prep
```

Drop customer data files in `sources/sample-data/` and the agent:

- Analyzes column headers and data types
- Cleans and normalizes the data
- Generates TypeScript interfaces and C# record types into [`scaffold/web/src/types/`](/reference/templates) and [`scaffold/api/Models/`](/reference/templates)
- Creates a data dictionary in [`scaffold/data/README.md`](/reference/templates)

### 3. Scaffold the Prototype (web-app concepts only)

```
/vibe-prototype-scaffold
```

The scaffold is **shaped by the requirements**, not a template. The agent:

- Pre-checks the form factor declared in `selected-concept.md` and stops with routing guidance if it's not a web app
- Reads the engineering brief and requirements
- Proposes a UI plan appropriate to the problem
- Generates only what the requirements call for

:::info Non-web-app concepts
For conversational (Copilot Studio), agentic (Foundry Agents), Copilot extension (M365 Agents Toolkit), or low-code (Power Platform) concepts, **skip steps 2 and 3** — author directly in the chosen platform. Run `/vibe-deploy` to see the form-factor-specific path.
:::

### 4. Build Features

Use the HVE-Core task pipeline for each feature:

```
/task-research → /task-plan → /task-implement → /task-review
```

### 5. Deploy

```
/vibe-deploy
```

This produces a **deployment plan** for the engineer based on the chosen form factor (web app via SWA + App Service, conversational via Copilot Studio publish, agentic via Foundry Agents endpoint, etc.). It does not auto-deploy — the engineer reviews and runs the steps themselves.

## After Customer Demos

```
/vibe-check-in source=transcript
```

Process customer feedback from the check-in meeting and iterate.

## Key Constraints

- All data is **mock data** — no live system connections
- CORS is permissive (prototype only)
- No authentication (prototype only)
- Prototypes prioritize speed and clarity over production hardening
