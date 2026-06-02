---
sidebar_position: 7
title: "Ideate (legacy)"
---

# Ideate <span style={{opacity: 0.6}}>(legacy)</span>

> ⚠️ **Legacy path.** New engagements should use **[Phase 3: Disrupt](disrupt.md)** instead — `/vibe-concepts` (pre-workshop) + `/vibe-selected-concept` (post-workshop) replace this single-shot prompt with a customer-co-created flow. Ideate is kept available only for engagements that started before Disrupt existed.

**Who:** Anyone on the team · **Duration:** 1 day

Brainstorm AI-powered prototype concepts across different form factors. This is the creative bridge between requirements and engineering — and it's accessible to everyone.

## Why Ideate?

The prototype doesn't have to be a web dashboard. It could be:

| Form Factor | Example | Microsoft Tech |
|---|---|---|
| **Web app** | Dashboard, portal, workflow | React + Azure |
| **Conversational** | Chat assistant, Q&A bot | Copilot Studio, Azure OpenAI |
| **Agentic** | Autonomous AI acting on triggers | Foundry Agents, Semantic Kernel |
| **Copilot extension** | Embedded in M365 apps | Copilot extensibility |
| **Low-code** | Business user workflows | Power Platform |
| **Data-centric** | AI-powered insights | Power BI + Copilot, Fabric |

The Ideate phase explores these options before committing to one approach.

## How It Works

```
/vibe-ideate
```

The agent:

1. **Analyzes the AI opportunity** — what's possible with AI that isn't without it?
2. **Generates 2-3 concepts** across different form factors
3. **Compares them** on wow factor, complexity, mock data fit, and customer value
4. **Produces screen/interaction narratives** — "When Sarah opens the app, she sees..."
5. **Generates GitHub Spark prompts** — paste into Spark for instant visualization
6. **Produces an engineering brief** — structured handoff for the dev engineer

## Three Rules for Every Concept

1. **AI must be essential** — if you remove the AI, the concept falls apart
2. **Must work with mock data** — no live system connections
3. **Must be feasible with Microsoft technology** — Azure, M365, Power Platform

## Quick Visualization

Non-technical team members can paste the generated **Spark prompts** into GitHub Spark to create instant visual prototypes — no coding required. Show these to the customer before engineering starts.

## Output

| Artifact | Purpose | Who Uses It |
|----------|---------|------------|
| `ideation-concepts.md` | Full concept descriptions and comparison | Whole team |
| `selected-concept.md` | Chosen concept with detailed narrative | Customer review |
| `spark-prompts.md` | GitHub Spark and Copilot Studio prompts | Non-technical visualization |
| `engineering-brief.md` | Structured handoff for the engineer | Dev engineer |
