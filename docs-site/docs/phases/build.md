---
sidebar_position: 4
title: "Phase 4: Build"
---

# Phase 4: Build (Design & Develop)

**Who:** Engineer (with squad support) · **Duration:** 5-10 days

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

Drop customer data files in `scaffold/data/` and the agent:

- Analyzes column headers and data types
- Cleans and normalizes the data
- Generates TypeScript interfaces and C# record types
- Creates a data dictionary

### 3. Scaffold the Prototype

```
/vibe-prototype-scaffold
```

The scaffold is **shaped by the requirements**, not a template. The agent:

- Reads the engineering brief and requirements
- Proposes a UI plan appropriate to the problem
- Generates only what the requirements call for

### 4. Build Features

Use the HVE-Core task pipeline for each feature:

```
/task-research → /task-plan → /task-implement → /task-review
```

### 5. Deploy

```
/vibe-deploy
```

Checks Azure auth, builds both projects, deploys to SWA + App Service, and gives you the live URL.

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
