---
description: "Engineer guidance for deploying the prototype (form-factor aware)"
argument-hint: "[formFactor={webapp|conversational|agentic|copilot-extension|low-code|other}]"
---

# VIBE Deploy

Deployment guidance for the engineer. Because VIBE prototypes can take many forms (web app, conversational bot, agentic AI, Copilot extension, low-code), there is no single "deploy" command. This prompt routes you to the right Microsoft hosting path for your chosen form factor.

**This prompt does NOT auto-deploy.** It produces a deployment plan you review and run yourself.

## Inputs

- ${input:formFactor}: (Optional) Form factor. If omitted, the agent reads `engineering-brief.md` to detect it.

## Requirements

### Step 1: Detect the Form Factor

Read `engagement/{{engagement-kebab}}/selected-concept.md` (and `storyboard.md` if it exists) to determine which form factor was chosen during the Disrupt workshop. Confirm with the user.

### Step 2: Present the Deployment Plan for That Form Factor

Use the table below. Present the steps inline, ask the user to confirm before running anything.

| Form Factor | Hosting | Deploy Method | Auth | Custom Domain |
|----|----|----|----|----|
| **Web app** (React/Vue/Blazor + API) | Azure Static Web Apps + App Service / Container Apps | Per-engagement Bicep + GitHub Actions, or `az deployment sub create` against the engagement's `infra/` | Anonymous for prototype; Entra ID for production | SWA built-in custom domain |
| **Conversational** (chat / Q&A bot) | [Copilot Studio](https://copilotstudio.microsoft.com) | Built-in publish from Studio (Teams, web channel, etc.). No Azure deploy needed for the prototype | Studio-managed | Studio-managed |
| **Agentic** (autonomous AI agents) | Azure AI Foundry Agents | Foundry portal: create agent → publish → get endpoint | Foundry-managed | Endpoint URL only |
| **Copilot extension** (M365 Copilot plugin) | Teams App / Declarative Agent manifest | M365 Agents Toolkit (`teamsapp provision` + `teamsapp deploy`) | M365 SSO | M365-managed |
| **Low-code** (Power Apps / Automate) | Power Platform environment | Export solution from maker.powerapps.com, import to target environment | Dataverse-managed | N/A |
| **Other** (custom Azure stack) | Engineer's choice | Engineer writes Bicep/Terraform; deploy with `az deployment` or `terraform apply` | Engineer's choice | Engineer's choice |

### Step 3: Web App Path (Detail)

If form factor is **web app**, the engineer typically needs:

- An `azure.yaml` at the repo root (if using `azd`) OR a per-engagement deploy script using `az deployment sub create --template-file infra/main.bicep`.
- Static Web Apps deployment token in GitHub secrets as `SWA_DEPLOYMENT_TOKEN` (the workflow at `.github/workflows/deploy-swa.yml` will then run on push to main).
- App Service publish profile for the API (or use the deploy-api workflow).

The framework's `infra/main.bicep` provisions SWA + App Service + Log Analytics. The engineer wires it up per-engagement — there's no one-size-fits-all deploy script.

### Step 4: Verify & Update State

After the engineer deploys, capture:

- The live URL(s)
- A simple health check (e.g., `curl https://<api>/health`)
- Update `state.json` in the engagement tracking directory with the deployment URL

### Step 5: Present the Result

```
─────────────────────────────────────────
👉 NEXT: Share the URL with the customer.
   Run /vibe-check-in after their feedback session.
─────────────────────────────────────────
```

## Notes

- **Prerequisites are form-factor specific.** For web app: Azure subscription + `az` CLI signed in. For Copilot Studio: Studio license. For Foundry Agents: AI Foundry resource. For Power Platform: maker.powerapps.com access. The engineer verifies prerequisites for the chosen path.
- **`azd` is not pre-configured.** If the engineer wants to use Azure Developer CLI, they need to author `azure.yaml` for their specific stack. Plain `az deployment` against `infra/main.bicep` works without it.
- **Local dev shortcut.** For web-app form factor, `start.ps1` at the repo root runs the .NET API and Vite dev server together for local iteration.
