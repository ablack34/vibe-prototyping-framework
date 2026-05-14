---
sidebar_position: 1
title: Prompt Reference
---

# Prompt Reference

All available `/vibe-*` prompts organized by phase.

## Essential Prompts (Core Flow)

These six prompts cover the main engagement flow:

| Prompt | Phase | What It Does |
|--------|-------|-------------|
| `/vibe-kickoff` | Discover | Creates the engagement, generates meeting templates and questionnaires |
| `/vibe-transcript` | Discover | Extracts context from Teams recordings automatically |
| `/vibe-ideate` | Ideate | Brainstorms 2-3 AI-powered prototype concepts |
| `/vibe-prototype-scaffold` | Build | Scaffolds the prototype from the engineering brief |
| `/vibe-deploy` | Build | Deploys to Azure so the customer can see it |
| `/vibe-handoff` | Deliver | Generates roadmap, backlog, and handoff package |

## All Prompts

### Discovery Phase

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-kickoff` | Start a new engagement | `customer` (required), `problem` (required), `size` (optional: XS/S/M/L) |
| `/vibe-questionnaire` | Generate Microsoft Forms questionnaires | `type` (optional: customer/account/both) |
| `/vibe-transcript` | Process Teams meeting transcripts | `engagement`, `dateRange`, `participants`, `type` (discovery/check-in) |
| `/vibe-capture` | Quick insight capture during meetings | `note` (required), `speaker`, `category` |
| `/vibe-check-in` | Process customer check-in feedback | `source` (notes/transcript) |
| `/vibe-consolidate` | Consolidate all findings | `engagement` |

### Ideation Phase

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-ideate` | Brainstorm AI-powered concepts | `engagement` |

### Build Phase

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-data-prep` | Prepare customer data files | `dataPath` |
| `/vibe-prototype-scaffold` | Scaffold the prototype from requirements | `engagement` |
| `/vibe-deploy` | Deploy to Azure (SWA + App Service) | `location`, `environment` |

### Deliver Phase

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-backlog-gen` | Generate ADO work items | `project` (required), `areaPath`, `iterationPath` |
| `/vibe-handoff` | Generate handoff package | `engagement` |

### Utility

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-new` | Create a new engagement repo from the template | `customer` (required), `engagement` (required), `size` |
