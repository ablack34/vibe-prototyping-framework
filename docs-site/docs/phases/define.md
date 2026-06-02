---
sidebar_position: 6
title: "Define (legacy)"
---

# Define <span style={{opacity: 0.6}}>(legacy)</span>

> ⚠️ **Legacy path.** New engagements should use **[Phase 3: Disrupt](disrupt.md)** instead, which replaces Define + Ideate with a single customer co-creation workshop. Define is kept available only for engagements that started before Disrupt existed.

**Who:** Anyone on the team · **Duration:** 1-2 days

Frame the business value, prioritize use cases, and define success criteria. This phase is **deliberately non-technical** — no architecture or tech stack discussion.

## The Key Question

> "Are we solving a $50,000 problem? Could we be solving a **$50 million** problem?"

## How It Works

1. **Review discovery outputs** — the agent reads PROJECT-CONTEXT.md and the three required Discover deliverables (`personas.md`, `problem-statement.md`, `current-state-journey.md`). If any deliverable is missing or below Grade B, Define stops and sends you back to Discover.
2. **Value framing** — anchors to the "which results in" line of `problem-statement.md` for quantified impact
3. **Use case prioritization** — score and rank use cases by user value, business value, and feasibility (the Top 3 ranked pain points from `current-state-journey.md` set the opening prioritisation)
4. **Success metrics** — define what the customer needs to see to say "yes"
5. **Requirements documentation** — produce `requirements-summary.md` for customer sign-off

## Key Commands

| Command | What It Does |
|---------|-------------|
| `@VIBE Define` | Guides you through value framing and prioritization |
| `/vibe-consolidate` | Synthesizes all findings before definition |

## Output: Requirements Summary

The Define phase produces `requirements-summary.md` — a customer-facing document with:

- Must-have, should-have, and could-have requirements
- Acceptance criteria (what the user sees, not how it's built)
- Success criteria
- Constraints and open questions

**Get customer sign-off on this before proceeding.**

## What This Phase Is NOT

- Not a technology discussion (that's in Build)
- Not an architecture review (that's in Build)
- Not wireframing or prototyping (that's in Ideate)

The focus is purely on **the problem, the value, and what needs to be true** for the prototype to succeed.
