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
| `/vibe-customer-brief` | Generate or refresh `engagement/{{engagement-kebab}}/customer-brief.md` (the customer's own voice) from sources | `engagement` (optional) |
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

### Disrupt Phase (Week 2 workshop)

The Disrupt phase is the one phase where the customer is in the room co-creating with us. Pre-workshop prompts produce the agenda + candidate concepts; post-workshop prompts capture the record and produce the deliverables the engineer needs.

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-workshop-agenda` | Generate `engagement/<name>/workshop-agenda.md` — the facilitator's run-of-show, anchored to the actual personas, problem statement, OKRs, and Top 3 pains. Blocks if any Discover deliverable is below Grade B or unsigned | `engagement` (optional) |
| `/vibe-concepts` | Generate 2-3 candidate concepts (`ideation-concepts.md`) + `spark-prompts.md` **before** the workshop. The customer reacts to these in the room. Paste the Spark prompts into spark.github.com to create the visual mockups. Re-runnable with new direction if the customer rejects all candidates. | `engagement` (optional) |
| `/vibe-workshop-record` | Generate `engagement/<name>/workshop-record.md` after the workshop from `sources/workshop/` (notes, sticky-note photos, Miro exports, transcript). Captures decisions, key quotes, parked items, action items, and Discover edits that need re-running | `engagement` (optional) |
| `/vibe-selected-concept` | Generate `engagement/<name>/selected-concept.md` — the canonical chosen concept (one of the candidates, a hybrid, or something new that emerged in the workshop). Reads `workshop-record.md` decisions. **Must run before `/vibe-future-journey` and `/vibe-storyboard`** — both anchor to it. | `engagement` (optional) |
| `/vibe-future-journey` | Generate `engagement/<name>/future-state-journey.md` — counterpart to `current-state-journey.md`. Same persona, redesigned journey with the prototype in place. Top 3 improvements map 1:1 to the Top 3 current-state pains | `engagement` (optional) |
| `/vibe-storyboard` | Generate `engagement/<name>/storyboard.md` — scene-by-scene visual narrative (Setup → Challenge → Encounter → Solution → Impact). **The contract between Disrupt and Design & Develop** — the engineer reads this to write the engineering brief | `engagement` (optional) |

### Define Phase (legacy)

> ⚠️ Legacy path. New engagements should use the Disrupt phase above (single customer co-creation workshop) instead of the Define → Ideate sequence.

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-define` | Frame the "$50K vs $50M" business value, prioritise use cases, and produce `engagement/<name>/requirements-summary.md` for customer sign-off. Reads the three required Discover deliverables (`personas.md`, `problem-statement.md`, `current-state-journey.md`) and stops with a "go back to Discover" message if any are missing or below Grade B | `engagement` (optional) |

### Ideation Phase (legacy)

> ⚠️ Legacy path. Disrupt's `/vibe-concepts` + `/vibe-selected-concept` replace this in new engagements.

| Prompt | Description | Inputs |
|--------|-------------|--------|
| `/vibe-ideate` | Brainstorm AI-powered concepts (legacy single-shot — generates concepts, picks one, writes engineering-brief.md in one pass) | `engagement` |

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
