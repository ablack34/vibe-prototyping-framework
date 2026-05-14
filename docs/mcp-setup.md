# MCP Server Setup Guide

> Configure MCP servers to unlock the full VIBE framework capabilities.

---

## What Are MCP Servers?

MCP (Model Context Protocol) servers give Copilot Chat access to external tools — Azure DevOps, Teams transcripts, GitHub, Playwright, and more. They run as background processes that Copilot communicates with.

---

## Required Servers

### 1. GitHub MCP (Likely Already Active)

**Purpose**: PR creation, repository operations, code search.

If you're using GitHub Copilot, this is usually pre-configured. Check your VS Code `mcp.json`:

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

### 2. ADO MCP (Azure DevOps)

**Purpose**: Create and query work items, sprint planning, backlog generation. Required for `/vibe-backlog-gen`.

**Setup**:

1. Go to [dev.azure.com](https://dev.azure.com) → Your profile (top right) → **Personal access tokens**
2. Click **New Token**, give it a name like "VIBE Framework"
3. Set scope: **Work Items** → Read & Write
4. Copy the token (you won't see it again)
5. Add to your VS Code `mcp.json` (found at `%APPDATA%\\Code\\User\\mcp.json`):

```json
{
  "servers": {
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-ado"],
      "env": {
        "ADO_ORG_URL": "https://dev.azure.com/your-org",
        "ADO_PAT": "${input:ado_pat}"
      }
    }
  },
  "inputs": [
    {
      "id": "ado_pat",
      "type": "promptString",
      "description": "Azure DevOps Personal Access Token",
      "password": true
    }
  ]
}
```

### 3. work-iq-mcp (Teams Transcripts)

**Purpose**: Extract requirements from Teams meeting transcripts. Required for `/vibe-transcript`.

**Prerequisites**: Your Microsoft 365 tenant must have Teams meeting transcription enabled. If you're not sure, try recording a Teams meeting — if you see a "Transcript" tab afterwards, it's enabled. If not, ask your IT admin to enable it.

**Setup**:

1. Add to your VS Code `mcp.json`:

```json
{
  "servers": {
    "workiq": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-workiq"]
    }
  }
}
```

3. On first use, accept the EULA when prompted
4. Sign in with your Microsoft 365 account when prompted

**Note**: The work-iq-mcp server has a query budget of approximately 30 queries per session. If you hit the limit, start a new Copilot Chat session to reset it.

**If transcripts aren't found**: Make sure meetings were named with the `[VIBE]` prefix (e.g., `[VIBE] <Your Customer> — Kickoff`). The transcript agent searches by customer name, participant names, and date range — the more specific you are, the better the results.

---

## Recommended Servers

### 4. Playwright MCP (Screenshots)

**Purpose**: Capture screenshots of the prototype for documentation and check-in decks.

```json
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-playwright"]
    }
  }
}
```

---

## Already Configured (Check Your mcp.json)

These are commonly pre-configured:

| Server | Purpose |
|--------|---------|
| Azure AI Foundry MCP | Model deployment for AI-powered prototype features |
| Azure MCP | Azure resource management and validation |

---

## Verification

After configuring, verify MCP servers are working:

1. Open Copilot Chat in VS Code
2. Type: "What MCP tools do you have available?"
3. You should see tools prefixed with `mcp_` for each configured server

If a server isn't showing up:

- Check the `mcp.json` configuration for typos
- Restart VS Code
- Check the MCP output panel (View → Output → select the MCP server)

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| ADO MCP: "Unauthorized" | Regenerate your PAT with the correct scopes |
| work-iq-mcp: No transcripts found | Verify Teams recording is enabled for your meetings |
| Playwright: Command not found | Run `npm install -g playwright` |
| Server not appearing in tools | Restart VS Code after editing mcp.json |
