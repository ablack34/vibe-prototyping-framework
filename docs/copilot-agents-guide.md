# Copilot Agents & Prompts Guide

> How the AI agents and prompts work in the VIBE framework.

---

## What Powers the VIBE Framework?

The VIBE framework runs on **GitHub Copilot** with the **HVE-Core extension** — a VS Code extension that adds specialized AI agents, reusable prompts, and coding instructions. Instead of writing long prompts from scratch, you invoke pre-built workflows.

It's already installed — you just need to know how to use it.

---

## Key Concepts

### Agents

Agents are specialized AI assistants. Each one has a defined role, protocol, and set of tools. You invoke them by typing `@AgentName` in Copilot Chat.

**VIBE agents we built:**

| Agent | Phase | What It Does |
|-------|-------|-------------|
| `@VIBE Engagement Lead` | All | Orchestrates the full engagement — start here when unsure. Has "❓ What's Next?" |
| `@VIBE Discover` | Discover | Source-first context gathering — reads docs, transcripts, questionnaires, then asks about gaps |
| `@VIBE Transcript Analyst` | Discover | Extracts context from Teams meeting transcripts (local files or via work-iq) |
| `@VIBE Disrupt` | Disrupt | Frames the $50K vs $50M value, prioritizes use cases, produces requirements |
| `@VIBE Ideate` | Ideate | Brainstorms AI-powered concepts across form factors, produces Spark prompts + engineering brief |
| `@VIBE Data Prep` | Build | Prepares customer data — generates TypeScript/C# models from CSV files |
| `@VIBE Deliver` | Deliver | Step-by-step handoff: vision → roadmap → backlog → limitations → validation → `handoff-data.json` |

**Built-in HVE-Core agents we use:**

| Agent | What It Does |
|-------|-------------|
| `@UX UI Designer` | Creates JTBD analyses and journey maps |
| `@PRD Builder` | Builds Product Requirements Documents |
| `@Agile Coach` | Helps write clear user stories |
| `@Task Researcher` | Deep research on any topic |
| `@Task Planner` | Creates implementation plans |
| `@Task Implementor` | Executes implementation plans |
| `@Task Reviewer` | Reviews completed work |

### Prompts

Prompts are one-click workflows. Type `/` in Copilot Chat to see available prompts. They run a defined workflow and produce output.

**Our VIBE prompts:**

| Prompt | What It Does |
|--------|-------------|
| `/vibe-kickoff` | Starts a new engagement |
| `/vibe-transcript` | Processes meeting transcripts |
**Our VIBE prompts:**

| Prompt | Phase | What It Does |
|--------|-------|-------------|
| `/vibe-kickoff` | Discover | Starts the engagement, generates meeting templates |
| `/vibe-questionnaire` | Discover | Generates Forms prompts for account team + customer questionnaires |
| `/vibe-transcript` | Discover | Extracts context from Teams transcripts (local files or work-iq) |
| `/vibe-capture` | Discover | Quick insight capture during workshops |
| `/vibe-check-in` | Build | Processes customer check-in feedback |
| `/vibe-consolidate` | Discover | Consolidates all findings from sources |
| `/vibe-disrupt` | Disrupt | Frames value and prioritizes use cases |
| `/vibe-ideate` | Ideate | Brainstorms AI-powered prototype concepts |
| `/vibe-data-prep` | Build | Prepares customer data, generates typed models |
| `/vibe-prototype-scaffold` | Build | Scaffolds the prototype from engineering brief |
| `/vibe-deploy` | Build | Deploys or shares the prototype (adapts to form factor) |
| `/vibe-handoff` | Deliver | Step-by-step handoff package → `handoff-data.json` (includes backlog) |
| `/vibe-backlog-gen` | Deliver | Optional: push backlog from handoff-data.json into ADO |
| `/vibe-new` | Setup | Creates a new engagement repo from the template |

**Built-in HVE-Core prompts we use:**

| Prompt | When To Use |
|--------|------------|
| `/task-research` | Research a technical approach before building |
| `/task-plan` | Create an implementation plan from research |
| `/task-implement` | Execute a plan phase by phase |
| `/task-review` | Review completed work for quality |
| `/pull-request` | Generate PR descriptions |
| `/git-commit` | Generate conventional commit messages |

### Instructions

Instructions files (`.instructions.md`) apply automatically when you edit matching files. You don't invoke them — they run in the background.

Our instructions:

- `vibe-engagement.instructions.md` — Applies when editing `templates/**`
- `vibe-prototype.instructions.md` — Applies when editing `scaffold/**`
- `vibe-data.instructions.md` — Applies when editing `**/data/**`

### Handoff Buttons

Agents show handoff buttons in Chat that let you jump to the next step. For example, after discovery, you'll see a "Move to Disrupt" button. Click it to transition.

---

## Common Workflows

### "I don't know what to do next"

Talk to `@VIBE Engagement Lead`. It reads the engagement state and tells you exactly what step to take.

### "I need to build a feature"

Use the HVE-Core task pipeline:

1. `/task-research` — Understand the approach
2. `/task-plan` — Break it into steps
3. `/task-implement` — Build it
4. `/task-review` — Check quality

### "I need to write user stories"

Talk to `@Agile Coach`. It guides you through writing clear, testable stories with acceptance criteria.

### "I want to create a PR"

Use `/pull-request`. It reads your branch diff and generates a structured PR description.

---

## Modes in Copilot Chat

| Mode | When To Use |
|------|------------|
| **Ask** | Quick questions, code explanations |
| **Agent** | Running prompts, talking to agents, creating files |
| **Plan** | Read-only planning and analysis (can't edit files) |

**Most VIBE work happens in Agent mode.**

---

## Tips

- Use handoff buttons to flow between agents naturally
- `/compact` summarizes the conversation if context gets long
- Agents track state in `.copilot-tracking/` — this is gitignored
- If an agent seems confused, start a new chat and reference your engagement by name
