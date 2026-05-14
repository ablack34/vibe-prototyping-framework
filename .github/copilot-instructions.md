# VIBE Prototyping Framework

This repo is a VIBE Prototyping engagement workspace. It provides AI agents, prompts, templates, and a prototype scaffold for running AI-first envisioning and prototyping engagements.

## The Process (5 Phases)

```
Discover → Disrupt → Ideate → Design & Develop → Deliver
```

## Essential Prompts

| Phase | Prompt | What It Does |
|-------|--------|-------------|
| Discover | `/vibe-kickoff` | Start the engagement |
| Discover | `/vibe-transcript` | Extract context from Teams recordings |
| Discover | `/vibe-capture` | Quick-capture insights during workshops |
| Disrupt | `/vibe-consolidate` | Synthesize all findings |
| Ideate | `/vibe-ideate` | Brainstorm AI-powered prototype concepts |
| Build | `/vibe-prototype-scaffold` | Scaffold the prototype from the concept |
| Build | `/vibe-deploy` | Deploy to Azure |
| Deliver | `/vibe-backlog-gen` | Generate ADO backlog |
| Deliver | `/vibe-handoff` | Final deliverables package |
| Anytime | `@VIBE Engagement Lead` | Tells you what to do next |

## Key Rules

- **Discover and Disrupt are non-technical** — no architecture or tech stack discussion
- **Ideate explores multiple form factors** — not just web apps. Conversational, agentic, Copilot extensions, low-code, etc.
- **AI must be essential in every concept** — not bolted on
- **All prototypes use mock data** — no live system connections
- **All technology must be Microsoft** — Azure, M365, Power Platform, etc.
- **Engagement state** lives in `.copilot-tracking/vibe/{{engagement-name}}/` (gitignored)
- **Customer sources** go in `sources/` — the discover agent reads them automatically
- **Every agent response ends with a specific next-step directive** pointing at a button
