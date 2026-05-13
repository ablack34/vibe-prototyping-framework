# HVE-Core Guide for Studio 42

> A practical guide to using HVE-Core extension features in VIBE Prototyping engagements.

---

## What Is HVE-Core?

HVE-Core is a VS Code extension that adds specialized AI agents, reusable prompts, coding instructions, and skills to GitHub Copilot Chat. Instead of writing long prompts from scratch, you invoke pre-built workflows.

It's already installed — you just need to know how to use it.

---

## Key Concepts

### Agents

Agents are specialized AI assistants. Each one has a defined role, protocol, and set of tools. You invoke them by typing `@AgentName` in Copilot Chat.

**VIBE agents we built:**

| Agent | What It Does |
|-------|-------------|
| `@VIBE Engagement Lead` | Orchestrates the full engagement — start here when unsure |
| `@VIBE Discover` | Guides discovery research and stakeholder analysis |
| `@VIBE Transcript Analyst` | Extracts context from Teams meeting transcripts |
| `@VIBE Disrupt` | Frames problems and prioritizes use cases |
| `@VIBE Data Prep` | Prepares customer data for the prototype |
| `@VIBE Deliver` | Generates final deliverables and handoff |

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
| `/vibe-check-in` | Processes customer check-in feedback |
| `/vibe-consolidate` | Consolidates all findings |
| `/vibe-data-prep` | Prepares customer data |
| `/vibe-prototype-scaffold` | Scaffolds the prototype |
| `/vibe-deploy` | Deploys to Azure |
| `/vibe-backlog-gen` | Generates ADO backlog |
| `/vibe-handoff` | Generates final deliverables |

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
