---
sidebar_position: 4
title: MCP Server Setup
---

# MCP Server Setup

> **MCP servers are already configured.** This page explains what's pre-configured, what you'll be prompted for the first time you use each one, and how to verify they're working.

## What Are MCP Servers?

MCP (Model Context Protocol) servers give Copilot Chat access to external tools — Teams transcripts, GitHub, Azure DevOps, Azure AI. They run as background processes and Copilot calls them through tools prefixed with `mcp_`.

In this framework, MCP servers are defined in `.vscode/mcp.json` at the root of your engagement repo. When you open the repo in VS Code, they start automatically.

## First-Time Setup (Once, ~2 Minutes)

When you open a fresh engagement repo:

1. Open Copilot Chat (`Ctrl+Shift+I`).
2. Click the **🔧 tools icon** at the top of the chat panel — you'll usually see a notification badge on it.
3. **Enable all the VIBE tools** in the list. This gives the AI access to GitHub, Azure DevOps, Teams transcripts, and Azure AI Foundry.
4. The first time you use a tool that needs credentials, you'll be prompted to sign in or enter a value — see the per-server notes below.

That's it. You don't need to edit any JSON.

## What's Pre-Configured

### GitHub MCP

| What it does | PR creation, repository operations, code search |
| ----- | ----- |
| Used by | `/vibe-new` (engagement repo creation), general dev tasks |
| First-use prompt | Sign in via GitHub if you aren't already |
| Prerequisites | A GitHub account with access to where you want to create engagement repos |

### work-iq (Teams Transcripts)

| What it does | Pulls Teams meeting transcripts so `/vibe-transcript` can extract context automatically |
| ----- | ----- |
| Used by | `/vibe-transcript`, `/vibe-check-in source=transcript`, `@VIBE Transcript Analyst` |
| First-use prompt | Accept the EULA, then sign in with your Microsoft 365 account |
| Prerequisites | Your M365 tenant must have Teams meeting transcription enabled. If you can see a **Transcript** tab on a recorded meeting in Teams, you're good |
| Note | ~30 query budget per chat session. If you hit the limit, start a new Copilot Chat session |

### Azure DevOps MCP

| What it does | Creates Epics → Features → User Stories in ADO from the engagement backlog |
| ----- | ----- |
| Used by | `/vibe-backlog-gen` |
| First-use prompt | You'll be asked for your **ADO organization name** (e.g., `contoso` from `https://dev.azure.com/contoso`) — VS Code remembers it for the workspace |
| Prerequisites | You need to be signed in to Azure DevOps in your browser. The MCP server uses your existing browser session for auth — no PAT required |

### Azure AI Foundry MCP

| What it does | Discover/deploy AI models when concepts call for them |
| ----- | ----- |
| Used by | `@VIBE Ideate` when proposing AI model choices |
| First-use prompt | Sign in to Azure when first invoked |
| Prerequisites | An Azure subscription with access to AI Foundry / Azure OpenAI |

## Verifying It's Working

After clicking the 🔧 icon and enabling tools, type into Copilot Chat:

```
What MCP tools do you have available?
```

You should see tool names prefixed `mcp_github_*`, `mcp_workiq_*`, `mcp_ado_*`, and `mcp_foundry_*`. If a category is missing, that server didn't start — check [Troubleshooting](/reference/troubleshooting).

## External Agents (Prompt-and-Paste Pattern)

Not every helpful agent runs as an MCP server. Some live inside other Microsoft products (M365 Copilot, Copilot Studio, Microsoft Spark) and can't be called directly from VS Code. For these, the framework uses a **prompt-and-paste pattern**: it generates the perfect prompt as a file in your repo, you run it externally, and you save the output back into `sources/` so the agents here can use it.

### M365 Copilot — Researcher agent

The **Researcher agent inside M365 Copilot** is one of the most valuable external agents because it can read **tenant-only signal** that the public web cannot see: account-team emails to/from the customer over the last 18 months, OneNote notes from the account team, Teams chats and prior meetings, prior engagement docs in SharePoint, and CRM-style content in Outlook.

Used by `/vibe-research` during the Preparation phase (Path B). The flow:

1. `/vibe-research` runs in this CLI and generates `sources/research/m365-researcher-prompt.md` — a single fenced block of ready-to-paste text designed for Researcher.
2. You open [https://m365.cloud.microsoft](https://m365.cloud.microsoft), switch to the **Researcher** agent, and paste the prompt.
3. When Researcher returns its response, you save the full output to `sources/research/m365-researcher-results.md`.
4. You re-run `/vibe-research` (or talk to `@VIBE Preparation`) and it synthesises Path A (public) + Path B (tenant) into `sources/research/research-summary.md`.

**Why not an MCP integration?** Researcher executes inside the M365 Copilot UI with your tenant identity; there's no public API surface for an MCP server to call. The paste-back loop is the correct integration pattern today — same model as Microsoft Spark and Copilot Studio Maker prompts.

**Reference**: Microsoft Learn — [Researcher agent in M365 Copilot](https://learn.microsoft.com/copilot/researcher/overview)

### Microsoft Spark and Copilot Studio Maker

These follow the same pattern. The `/vibe-ideate` flow produces `spark-prompts.md` and Copilot Studio Maker prompts that you paste into the relevant Microsoft tool, and the returned artifacts (UI mockups, agent definitions) come back as sources or are surfaced directly in the prototype.

## Adding More MCP Servers (Optional)

If you need a server that isn't pre-configured (e.g., Playwright for screenshots, Microsoft Graph), add it to `.vscode/mcp.json` and reload VS Code. See [the MCP servers gallery](https://github.com/modelcontextprotocol/servers) for options.

Keep additions in `.vscode/mcp.json` (workspace-level) rather than the global user config — that way every engagement repo created from this template inherits them.
