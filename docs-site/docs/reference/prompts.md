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
| `/vibe-questionnaire` | Discover | Generates M365 Copilot prompts for the account team and customer questionnaires |
| `/vibe-transcript` | Discover | Extracts context from Teams recordings automatically |
| `/vibe-ideate` | Ideate | Brainstorms 2-3 AI-powered prototype concepts |
| `/vibe-deploy` | Build | Form-factor-aware deployment guidance for the engineer |
| `/vibe-handoff` | Deliver | Generates roadmap, backlog, and handoff package |

:::note Build-phase prompts
`/vibe-data-prep` and `/vibe-prototype-scaffold` are useful when the chosen concept is a web-app. Other form factors (conversational, agentic, Copilot extension, low-code) skip them — the engineer scaffolds directly in Copilot Studio, Foundry Agents, M365 Agents Toolkit, or Power Platform.
:::

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
| `/vibe-deploy` | Deployment guidance per form factor (web app, Copilot Studio, Foundry Agents, M365 plugin, Power Platform) | `formFactor` |

### Deliver Phase

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-backlog-gen` | Generate ADO work items | `project` (required), `areaPath`, `iterationPath` |
| `/vibe-handoff` | Generate handoff package | `engagement` |

### Utility

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-new` | Create a new engagement repo from the template | `customer` (required), `engagement` (required), `size` |
| `/vibe-demo` | Seed the engagement with the Contoso Field Services fixture so every phase can be demonstrated end-to-end without a real customer | `demo` (optional, defaults to `contoso`) |
| `/vibe-doctor` | Health-check the engagement (missing artifacts, stale state, form-factor mismatches) and recommend the single highest-value next step | `engagement` (optional) |
