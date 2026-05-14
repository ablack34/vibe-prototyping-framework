---
sidebar_position: 1
title: Setup
---

# One-Time Setup

Get your machine ready for VIBE engagements. This takes about 10 minutes.

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

### 3. GitHub CLI

```powershell
winget install GitHub.cli
```

Then authenticate:

```powershell
gh auth login
```

Select: GitHub.com → HTTPS → Yes → Login with browser

### 4. work-iq-mcp (Teams Transcript Analysis)

This lets the framework automatically extract context from your Teams meeting recordings. See the [MCP Setup Guide](/reference/prompts) for detailed instructions.

## For Engineers Only

Engineers also need these for the Build phase:

### Node.js 22+

```powershell
winget install OpenJS.NodeJS.LTS
```

### .NET 9 SDK

```powershell
winget install Microsoft.DotNet.SDK.9
```

### Azure Developer CLI

```powershell
winget install Microsoft.Azd
```

## Verify Your Setup

Open VS Code, then open Copilot Chat (`Ctrl+Shift+I`). Switch to **Agent mode** and type:

```
What MCP tools do you have available?
```

You should see tools prefixed with `mcp_workiq_` (for transcript analysis) and `mcp_github_` (for repo operations).

:::tip
If tools are missing, restart VS Code after configuring MCP servers.
:::
