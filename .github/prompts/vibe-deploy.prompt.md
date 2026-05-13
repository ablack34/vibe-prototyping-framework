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

1. Check prerequisites:
   - `dotnet` CLI installed
   - `node` / `npm` installed
   - `azd` (Azure Developer CLI) installed — if not, provide install instructions
   - User is authenticated (`azd auth login`)
2. Verify both projects build cleanly:
   - `cd scaffold/web && npm ci && npm run build`
   - `cd scaffold/api && dotnet build`
3. Run deployment:
   - If GitHub Actions are configured: instruct the user to push to main for auto-deploy
   - If manual deployment: run `azd up` with the provided location and environment
4. Verify deployment succeeded and present the live URLs (SWA frontend + API endpoint).
5. Run a basic health check against the deployed API (`/health` endpoint).
6. Update the engagement `state.json` with the deployment URL.

---

Present each step with confirmation gates so non-technical users can follow along.
