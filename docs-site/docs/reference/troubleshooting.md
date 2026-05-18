---
sidebar_position: 5
title: Troubleshooting
---

# Troubleshooting

Common issues and fixes when running a VIBE engagement.

## Copilot Chat & Prompts

| Problem | Cause | Fix |
|---------|-------|-----|
| `/vibe-*` prompts don't appear when typing `/` | You're in Ask or Plan mode, not Agent mode | Click the mode picker at the top of Copilot Chat and select **Agent** |
| Agent says "I can't create files" | File editing tools are disabled | Click the 🔧 tools icon in Copilot Chat and enable file editing |
| Agent seems confused or has lost context | Conversation got too long | Start a new Copilot Chat session. Reference your engagement by name and the agent will re-read the engagement files |
| `.copilot-tracking/` or `engagement/` directory missing | First time running — directory needs to be created | Run `/vibe-kickoff` which creates both automatically |

## MCP Servers

| Problem | Cause | Fix |
|---------|-------|-----|
| No `mcp_*` tools appear at all | You haven't enabled them | Click the 🔧 tools icon in Copilot Chat and enable all tools |
| `mcp_workiq_*` missing after enabling | `npx` couldn't fetch the work-iq package | Check Node.js is installed (`node --version`). Reload VS Code (`Ctrl+Shift+P` → "Developer: Reload Window") |
| Transcript extraction fails | work-iq isn't signed in, or meetings weren't recorded with the `[VIBE]` prefix | Sign in to the work-iq tool when prompted. Use `[VIBE] <Customer> — <Type>` for meeting names |
| "Transcripts not available" | Teams transcription is disabled in your tenant | Ask your IT admin to enable Teams meeting transcription |
| work-iq says "query budget exceeded" | Hit the ~30 queries/session limit | Start a new Copilot Chat session |
| `mcp_ado_*` errors with "unauthorized" | Not signed in to Azure DevOps in your browser | Open [dev.azure.com](https://dev.azure.com) in your default browser and sign in |
| `mcp_ado_*` errors with "organization not found" | Wrong org name entered at first-use prompt | Reload VS Code to be prompted again |
| `mcp_foundry_*` missing | `uvx` not installed | Install `uv`: `winget install astral-sh.uv`, then reload VS Code |

## Build & Deploy (Engineer)

| Problem | Cause | Fix |
|---------|-------|-----|
| `npm install` fails in `scaffold/web` | Node.js version mismatch | Install Node 22+ (`winget install OpenJS.NodeJS.LTS`) |
| `dotnet build` fails in `scaffold/api` | .NET 9 SDK not installed | Install with `winget install Microsoft.DotNet.SDK.9` |
| Deployment fails with auth error | Not logged into Azure | Run `az login` in the terminal and sign in via browser |
| Azure quota exceeded | Subscription has resource limits | Check quotas in [Azure Portal](https://portal.azure.com) or try a different region |
| Don't know how to deploy this form factor | Concept isn't a web app | Run `/vibe-deploy` — it gives you a deployment plan per form factor (Copilot Studio, Foundry Agents, M365 plugin, Power Platform, etc.) |

## Team Collaboration

| Problem | Cause | Fix |
|---------|-------|-----|
| Engineer can't find the engineering brief | Was previously gitignored under `.copilot-tracking/` | It now lives in `engagement/<engagement-name>/engineering-brief.md` and is committed. Run `git pull` to get the TPM's work |
| Two team members get different "what's next?" answers | Each has a per-user `state.json` in their own `.copilot-tracking/` | Expected — state is per-user. The shared truth lives in `engagement/<engagement-name>/` and `templates/`. Anyone can ask "what's next?" and the agent reads the committed artifacts |
