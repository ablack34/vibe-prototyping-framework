---
sidebar_position: 5
title: Troubleshooting
---

# Troubleshooting

Common issues and fixes when running a VIBE engagement.

## First-run confusion

Real questions from real first runs. If you're new to the harness, skim these before anything else.

### "The agent said proceed from VIBE Discover but I just ran VIBE Preparation"

The orchestrator doesn't remember prior chat turns. It derives progress from `state.json` plus the files on disk in `engagement/<kebab>/`. If `state.json` says Discover is in progress (perhaps from an earlier session or another teammate), it'll suggest proceeding from there.

To get the orchestrator's recommendation back in sync:

1. Re-run `@VIBE Engagement Lead` — it reconciles `state.json` against the actual files in `engagement/<kebab>/` and re-derives "what's next".
2. If the recommendation still seems wrong, run `/vibe-doctor` — it does a deeper health check and surfaces the single highest-value next action.
3. As a last resort, delete `.copilot-tracking/vibe/<kebab>/state.json` (it's per-user and gitignored — your committed work in `engagement/<kebab>/` is safe) and let `@VIBE Engagement Lead` rebuild it from your filesystem.

### "The NEXT directive said `@VIBE Preparation` but there was no button"

`@`-mentions are **typed inputs, not buttons**. Click into the Copilot Chat input, type `@VIBE Preparation`, hit `Enter`. Only the handoff actions named in quotes (e.g. `Click "🛠 Begin Preparation"`) render as buttons — `@`-mentions and `/`-commands are always typed.

### "I typed into `templates/personas.md` and the agent didn't see my edits"

That's expected. Templates are AI scaffolds — agents read them for structure but write *populated* files to `engagement/<kebab>/`. Your edits to a template don't show up anywhere downstream.

**Fix:** move your edits into `engagement/<kebab>/personas.md`. Or — better — drop the underlying sources (e.g. a transcript) into `sources/` and let the agent regenerate.

### "Nothing happened even though the agent said it did something"

Two common causes:

1. **Wrong Copilot mode** — VIBE only works in Agent mode. Check the mode picker at the top of Copilot Chat and switch from Ask or Plan.
2. **Multiple engagements in one repo** — if you have several `engagement/<kebab>/` folders, the agent may have written to a different one than you expected. Pass `engagement="..."` explicitly on `/vibe-*` prompts to disambiguate, or rely on the orchestrator (which always names the active engagement at the top of its response).

### "The agent ran the post-workshop prompts in the wrong order"

That was a real bug, fixed in PR #14. Post-workshop order is now **strict**: `/vibe-workshop-record` → `/vibe-selected-concept` → `/vibe-future-journey` → `/vibe-storyboard`. If you see the orchestrator suggesting `/vibe-storyboard` before `/vibe-future-journey` on a current version, file an issue.

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
