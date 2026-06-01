---
sidebar_position: 1
title: Prompt Reference
---

# Prompt Reference

All available `/vibe-*` prompts organized by phase.

## Essential Prompts (Core Flow)

These cover the main engagement flow:

| Prompt | Phase | What It Does |
|--------|-------|-------------|
| `/vibe-kickoff` | Preparation | Creates the engagement, drafts both briefs (S42-internal + customer voice), generates the full 4-week meeting schedule |
| `/vibe-research` | Preparation | Dual-path deep research — public web (auto, in-CLI) plus a ready-to-paste prompt for M365 Copilot's Researcher agent |
| `/vibe-questionnaire` | Discover | Generates M365 Copilot prompts for the account team and customer questionnaires |
| `/vibe-transcript` | Discover | Extracts context from Teams recordings automatically |
| `/vibe-ideate` | Ideate | Brainstorms 2-3 AI-powered prototype concepts |
| `/vibe-deploy` | Build | Form-factor-aware deployment guidance for the engineer |
| `/vibe-handoff` | Deliver | Generates roadmap, backlog, and handoff package |

:::note Build-phase prompts
`/vibe-data-prep` and `/vibe-prototype-scaffold` are useful when the chosen concept is a web-app. Other form factors (conversational, agentic, Copilot extension, low-code) skip them — the engineer scaffolds directly in Copilot Studio, Foundry Agents, M365 Agents Toolkit, or Power Platform.
:::

## All Prompts

### Preparation Phase (Week 0)

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-kickoff` | Start a new engagement — creates folders, drafts both briefs, generates the 4-week meeting schedule | `customer` (required), `problem` (required) |
| `/vibe-customer-brief` | Generate or refresh `templates/customer-brief.md` (the customer's own voice) from sources | `engagement` (optional) |
| `/vibe-research` | Dual-path deep customer research — runs `@Task Researcher` for public web (Path A) and generates a paste-back prompt for **M365 Copilot's Researcher** agent (Path B). Synthesises both into `sources/research/research-summary.md` when both inputs exist | `engagement` (optional) |
| `/vibe-schedule` | Generate the full 4-week meeting schedule (kickoff, 2× discover, disrupt workshop, 2× check-in, handoff) into `sources/meeting-templates.md` | `engagement` (optional) |
| `/vibe-prep-check` | Focused 7-field readiness check before moving to Discover (strict subset of `/vibe-doctor`) | `engagement` (optional) |

### Discovery Phase

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-questionnaire` | Generate Microsoft Forms questionnaires | `type` (optional: customer/account/both) |
| `/vibe-transcript` | Process Teams meeting transcripts | `engagement`, `dateRange`, `participants`, `type` (discovery/check-in) |
| `/vibe-capture` | Quick insight capture during meetings | `note` (required), `speaker`, `category` |
| `/vibe-personas` | Generate `engagement/<name>/personas.md` from sources — one persona per H2, sourced quotes, A/B/C grading per persona. **Required Discover deliverable #1.** Run before `/vibe-problem-statement` and `/vibe-current-journey` (both anchor to the primary persona) | `engagement` (optional) |
| `/vibe-problem-statement` | Generate `engagement/<name>/problem-statement.md` in the formal "I am / I'm trying to / But / Because / which results in" shape, with cited evidence per blank. **Required Discover deliverable #2.** Fails fast if `personas.md` doesn't exist yet | `engagement` (optional) |
| `/vibe-current-journey` | Generate `engagement/<name>/current-state-journey.md` — Mermaid flowchart + stages table + Top 3 ranked pain points (the ranked pains feed the Disrupt workshop). **Required Discover deliverable #3.** Fails fast if `personas.md` doesn't exist yet | `engagement` (optional) |
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

### Optional (Derived Artifacts)

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-prd` | Generate a combined PRD from `requirements-summary.md` (business half) + `engineering-brief.md` (technical half). Optionally validates via `@PRD Builder`. Only run when a stakeholder needs a single PRD document — the two halves are the canonical source. | `engagement` (optional), `validate` (optional: `true`/`false`, default `false`) |

### Utility

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-new` | Create a new engagement repo from the template | `customer` (required), `engagement` (required), `size` |
| `/vibe-demo` | Seed the engagement with the Contoso Field Services fixture so every phase can be demonstrated end-to-end without a real customer | `demo` (optional, defaults to `contoso`) |
| `/vibe-doctor` | Health-check the engagement (missing artifacts, stale state, form-factor mismatches) and recommend the single highest-value next step | `engagement` (optional) |
