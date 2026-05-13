# VIBE Prototyping Framework

> Accelerating presales with AI prototyping to unlock business potential at speed.

A reusable IP framework for Studio 42 **VIBE Prototyping** engagements (Visualize, Ideate, Build, Evaluate). Provides custom AI agents, prompt workflows, document templates, a React+.NET prototype scaffold, and CI/CD pipelines — all integrated with GitHub Copilot and HVE-Core.

## How It Works

This repo is a **GitHub Template Repository** — the source of truth for all VIBE engagements. You don't work in this repo directly. Each engagement gets its own repo created from this template.

Only the framework maintainer (Adam) modifies this repo. Everyone else creates engagement repos from it.

## Quick Start: New Engagement

There are two ways to create a new engagement. Pick whichever is easier for you.

### Option A: From Copilot Chat (Easiest)

Open Copilot Chat in **any** VS Code workspace (or even an empty window), switch to **Agent mode**, and type:

```
/vibe-new customer="Contoso" engagement="field-scheduling"
```

It walks you through creating the repo, cloning, installing, and opening — all from chat.

### Option B: From GitHub.com

1. Go to [github.com/ablack34/vibe-prototyping-framework](https://github.com/ablack34/vibe-prototyping-framework)
2. Click the green **"Use this template"** button → **"Create a new repository"**
3. Name it `contoso-field-scheduling` (customer-engagement), set to **Private**, click **Create**
4. Clone your new repo and open in VS Code:

```powershell
gh repo clone contoso-field-scheduling
cd contoso-field-scheduling
code .
```

### Option C: From terminal (Power users)

```powershell
.\new-engagement.ps1 -Customer "Contoso" -Engagement "field-scheduling"
```

### Prerequisites

- VS Code with **GitHub Copilot** and **HVE-Core extension** (v3.2+)
- **GitHub CLI** (`gh`) — authenticated (`gh auth login`)
- **Node.js** 22+, **.NET 9 SDK**, **Azure Developer CLI** (`azd`)
- MCP servers configured — see [docs/mcp-setup.md](docs/mcp-setup.md)

### Then start the engagement

1. Open Copilot Chat (**Ctrl+Shift+I**) in **Agent mode**
2. Type: `/vibe-kickoff customer="Contoso" problem="describe the problem" size=S`
3. Follow the [playbook](docs/playbook.md)

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
