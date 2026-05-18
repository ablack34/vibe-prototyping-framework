---
sidebar_position: 1
title: Setup
---

# One-Time Setup

Get your machine ready for VIBE engagements. **5 minutes for non-engineers, 10 minutes for engineers.**

## For Everyone (TPMs, Designers, Account Teams)

### 1. VS Code + GitHub Copilot

You probably already have this. If not:

- [Download VS Code](https://code.visualstudio.com/)
- Sign in with your Microsoft account to activate GitHub Copilot

### 2. HVE-Core Extension

Install from the VS Code marketplace:

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search for **"HVE Core"**
4. Install the extension (v3.2+)

### 3. Get Comfortable With Copilot Chat Modes

VIBE prompts only work in **Agent mode**. Open Copilot Chat (`Ctrl+Shift+I`) and look at the mode picker at the top:

| Mode | What it does | Use it for |
|------|-------------|-----------|
| **Ask** | Quick Q&A, code explanations | Asking general questions |
| **Plan** | Read-only planning and analysis | When you don't want the AI to change files |
| **Agent** | Run prompts, talk to agents, create/edit files | **All VIBE work** |

If you type `/` and don't see `/vibe-*` prompts, you're in the wrong mode — switch to Agent.

### 4. (Engineers only) Tooling for Build

Engineers also need these for the Build phase, but they can install on demand:

- **Node.js 22+** — `winget install OpenJS.NodeJS.LTS`
- **.NET 9 SDK** — `winget install Microsoft.DotNet.SDK.9`
- **Azure CLI** — `winget install Microsoft.AzureCLI` (only if deploying a web-app form factor; other form factors have their own tooling — see `/vibe-deploy`)

## Configure MCP Tools (First Engagement Only)

When you open your first engagement repo, click the **🔧 tools icon** in Copilot Chat and enable all tools. This gives Copilot access to Teams transcripts, GitHub, Azure DevOps, and Azure AI Foundry.

You only need to do this once per machine. Full details: [MCP Server Setup](/reference/mcp).

## Verify Your Setup

Open VS Code, open Copilot Chat, switch to **Agent mode**, and type:

```
What MCP tools do you have available?
```

You should see tools prefixed with `mcp_workiq_`, `mcp_github_`, `mcp_ado_`, and `mcp_foundry_`. If any are missing, check [Troubleshooting](/reference/troubleshooting).

:::tip
You don't need an engagement repo open to verify Copilot itself works — but to test the VIBE prompts you need an engagement repo created from the template (see [Your First Engagement](/getting-started/first-engagement)).
:::

:::info Want to see what the framework looks like end-to-end before you start?
See [What to Expect](/getting-started/walkthrough) for realistic agent output from every phase, run against the Contoso demo fixture.
:::
