---
sidebar_position: 2
title: "Phase 2: Discover"
---

# Phase 2: Discover

**Who:** Anyone on the team · **Duration:** 1-3 days

Understand the customer's problem through multiple sources — transcripts, documents, questionnaires, and workshop observations. The framework ingests these sources automatically and only asks you about gaps.

## How It Works

The Discover agent uses a **source-first, gap-fill** approach:

1. **Checks `sources/` folder** — customer docs, questionnaire responses
2. **Processes Teams transcripts** — via work-iq-mcp
3. **Reads the engagement brief** — account team context
4. **Shows what's known vs missing** — readiness dashboard
5. **Only asks about gaps** — no 20-question interviews

## Key Commands

| Command | When | What It Does |
|---------|------|-------------|
| `/vibe-kickoff` | Week 0 (Preparation) | Creates the engagement and drafts both briefs — see [Phase 1: Preparation](preparation.md) |
| `/vibe-questionnaire` | Day 1 | Generates Microsoft Forms questionnaires for customer and account team |
| `/vibe-transcript` | After each meeting | Extracts context from Teams recordings |
| `/vibe-capture` | During meetings | Quick-capture insights in real time |
| `@VIBE Discover` | After sources arrive | Ingests everything and shows the readiness dashboard |
| `/vibe-consolidate` | End of discovery | Synthesizes all findings into one view |

## Readiness Dashboard

The engagement lead tracks nine fields. Discovery is complete when 7 of 9 are filled:

| Field | What It Answers |
|-------|----------------|
| Problem statement | What problem are we solving? |
| Target users | Who has this problem? |
| Business impact | $50K problem or $50M problem? |
| Current state | How is this handled today? |
| Desired outcome | What does "great" look like? |
| Data inventory | What data is available? |
| Stakeholder map | Who are the key people? |
| Success criteria | How do we know the prototype worked? |
| Constraints | Timeline, tech, data limitations? |

## Tips

- **Record every meeting** — `/vibe-transcript` replaces manual note-taking
- **Send questionnaires early** — responses auto-fill multiple fields
- **Drop customer docs in `sources/`** — the agent reads them automatically
- **Use `/vibe-capture` during workshops** — type quick notes without stopping the conversation
