# VIBE Prototyping Framework

> Accelerating presales with AI prototyping to unlock business potential at speed.

A reusable IP framework for Studio 42 **VIBE Prototyping** engagements (Visualize, Ideate, Build, Evaluate). Provides custom AI agents, prompt workflows, document templates, a React+.NET prototype scaffold, and CI/CD pipelines — all integrated with GitHub Copilot and HVE-Core.

## Quick Start

1. Open this repo in VS Code with GitHub Copilot + HVE-Core extension
2. Type `/vibe-kickoff` in Copilot Chat to start a new engagement
3. Follow the [playbook](docs/playbook.md) for step-by-step guidance

## What's Included

| Component | Description |
|-----------|-------------|
| **6 Custom Agents** | VIBE Engagement Lead, Discover, Transcript Analyst, Disrupt, Data Prep, Deliver |
| **9 Prompt Workflows** | Kickoff, Transcript, Check-in, Consolidate, Data Prep, Scaffold, Deploy, Backlog Gen, Handoff |
| **3 Instruction Sets** | Engagement docs, prototype code, and data handling conventions |
| **6 Document Templates** | Project Context, Requirements, Solution Design, Check-in Notes, Limitations, Engagement Brief |
| **Prototype Scaffold** | React 19 + Vite + Tailwind frontend, .NET 9 Minimal API backend, Bicep infra |
| **CI/CD Pipelines** | GitHub Actions for build validation and Azure deployment |
| **Documentation** | Playbook, HVE-Core guide, MCP setup guide |

## Engagement Phases

```
Discover → Disrupt → Design & Develop → Deliver
   │          │            │                │
   │          │            │                ├── /vibe-handoff
   │          │            │                └── /vibe-backlog-gen
   │          │            ├── /vibe-data-prep
   │          │            ├── /vibe-prototype-scaffold
   │          │            └── /vibe-deploy
   │          └── @VIBE Disrupt
   ├── /vibe-transcript
   └── @VIBE Discover
```

## Documentation

- [Playbook](docs/playbook.md) — How to run a VIBE engagement end-to-end
- [HVE-Core Guide](docs/hve-core-guide.md) — How to use agents, prompts, and instructions
- [MCP Setup](docs/mcp-setup.md) — Configure MCP servers for full functionality

## Local Development

```powershell
pwsh start.ps1
```

Starts both the .NET API (port 5264) and Vite dev server (port 5173).

## Deployment

```powershell
pwsh deploy.ps1 -EnvironmentName my-engagement -Location uksouth
```

Or push to `main` for automatic deployment via GitHub Actions.

## License

Internal Microsoft — Studio 42
