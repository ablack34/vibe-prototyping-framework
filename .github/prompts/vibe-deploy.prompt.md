---
description: "Deploy the prototype to Azure (SWA + App Service)"
argument-hint: "[location=uksouth] [environment=...]"
---

# VIBE Deploy

Deploy the VIBE prototype to Azure. Verifies prerequisites, runs deployment, and provides the live URL.

## Inputs

- ${input:location:uksouth}: (Optional, defaults to uksouth) Azure region.
- ${input:environment}: (Optional) Environment name. Defaults to engagement-kebab-name.

## Requirements

### Step 1: Check Prerequisites

Run these checks in order. Stop and help the user fix any failures before continuing.

**Tool checks** (run each in terminal):

- `dotnet --version` — if missing, tell the user: "Install .NET 9 SDK from https://dot.net/download"
- `node --version` — if missing: "Install Node.js from https://nodejs.org"
- `azd version` — if missing: "Install Azure Developer CLI: run `winget install Microsoft.Azd`"

**Azure authentication check** (run in terminal):

```powershell
azd auth login --check-status 2>&1
```

If this returns an error or "Not logged in", present this to the user:

```
⚠️ You're not logged into Azure. Let's fix that.

Run this command and follow the browser prompt:

    azd auth login

This opens a browser window — sign in with your Microsoft account
that has access to an Azure subscription.

After signing in, come back here and I'll continue.
```

Wait for the user to confirm, then re-check.

If Bicep deployment is needed, also check `az` CLI:

```powershell
az account show 2>&1
```

If not logged in:

```
⚠️ Azure CLI also needs to be signed in.

Run:

    az login

Sign in with the same Microsoft account, then set your subscription:

    az account set --subscription "Your Subscription Name"
```

Do NOT proceed past Step 1 until all tools are installed and authenticated.

### Step 2: Verify Builds

Run in terminal:

```powershell
cd scaffold/web; npm ci; npm run build
cd ../api; dotnet build
```

If either fails, show the error and help debug.

### Step 3: Deploy

- If GitHub Actions are configured (check for `vars.SWA_CONFIGURED`): instruct user to push to main for auto-deploy
- Otherwise run `azd up` with the provided location and environment
- If deployment fails with auth errors: go back to Step 1

### Step 4: Verify & Share

- Present the live URLs (SWA frontend + API endpoint)
- Run a health check: `Invoke-RestMethod https://<api-url>/health`
- Update `state.json` with the deployment URL

Present each step with confirmation gates. Always end with:

```
─────────────────────────────────────────
👉 NEXT: Share the prototype URL with the customer.
   Then run /vibe-check-in after their feedback session.
─────────────────────────────────────────
```
