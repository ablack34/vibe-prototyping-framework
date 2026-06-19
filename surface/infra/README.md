# Deploying the VIBE surface to Azure

Infrastructure-as-code + CI/CD for the web surface (Shape B — hosted single-tenant on
Azure Container Apps). The big-picture plan and rationale live in
[`../DEPLOYMENT.md`](../DEPLOYMENT.md); this folder is the executable version.

## What gets deployed

`main.bicep` (subscription scope) creates a resource group `rg-<env>` containing:

| Resource | Module | Why |
|----------|--------|-----|
| Container Apps Environment + App | `container-app.bicep` | Runs the surface, pinned to **1 replica** (single shared store, no concurrent writers) |
| Azure Container Registry | `registry.bicep` | Holds the built image; pulled via managed identity (no admin user) |
| Key Vault | `keyvault.bicep` | Stores the Copilot service token; read at runtime via managed identity |
| Storage account + File share | `storage.bicep` | Durable `/data/.engagements.json` (survives revisions/restarts) |
| Log Analytics + Application Insights | `monitoring.bicep` | Logs + telemetry |
| User-assigned managed identity | `identity.bicep` | ACR pull + Key Vault secret read — no passwords |
| Entra "Easy Auth" wall *(optional)* | `container-app.bicep` | Restricts the surface to signed-in tenant users |

The pipeline `.github/workflows/deploy-surface.yml` runs three steps on every push to
`main` that touches `surface/**`: **provision** (`az deployment sub create`) →
**build** the image inside ACR (`az acr build`, no Docker on the runner) → **roll out**
(`az containerapp update`).

## One-time setup

Sign in to both clouds as a user who can create app registrations and assign roles:

```powershell
az login
gh auth login
```

Then run the bootstrap (creates the OIDC identity, grants it deploy rights, wires the
GitHub variables + secrets):

```powershell
./surface/infra/bootstrap.ps1 -SubscriptionId <your-subscription-id>
```

It will prompt for the **Copilot service token** — the GitHub token the surface runs as
(a fine-grained PAT with the *Copilot Requests* permission on a Copilot-seated account,
or a seat-holding user token). Paste it when asked; it is stored as a GitHub secret and
flows into Key Vault, never into source.

### What bootstrap configures on the repo

| GitHub | Name | Value |
|--------|------|-------|
| Variable | `SURFACE_DEPLOY_CONFIGURED` | `true` (the pipeline's run guard) |
| Variable | `AZURE_ENV_NAME` | environment name, e.g. `vibe-surface` |
| Variable | `AZURE_LOCATION` | region, e.g. `uksouth` |
| Variable | `SURFACE_PERSISTENT_STORE` | *(optional)* `false` to skip the durable `/data` mount where org policy disables storage shared keys (see note below) |
| Secret | `AZURE_CLIENT_ID` / `AZURE_TENANT_ID` / `AZURE_SUBSCRIPTION_ID` | OIDC login (not passwords) |
| Secret | `COPILOT_SERVICE_TOKEN` | the surface's GitHub identity |
| Secret | `AUTH_CLIENT_ID` / `AUTH_CLIENT_SECRET` | *(Part B only)* the sign-in wall |

## Deploy

```powershell
gh workflow run "Deploy Surface (Azure Container Apps)" --repo ablack34/vibe-prototyping-framework
```

The first run deploys **open** (no sign-in wall) so you can smoke-test. The run summary
prints the surface URL.

## Lock it down (Entra sign-in wall)

Once you have the URL, run **Part B** at the bottom of `bootstrap.ps1` to register the
auth app, then redeploy with the wall on:

```powershell
gh workflow run "Deploy Surface (Azure Container Apps)" --repo ablack34/vibe-prototyping-framework -f enableAuth=true
```

## Run it manually (without the pipeline)

```powershell
az deployment sub create `
  --location uksouth `
  --template-file surface/infra/main.bicep `
  --parameters environmentName=vibe-surface location=uksouth serviceToken=(gh auth token)
# then build + roll out the image:
az acr build --registry <acrName> --image vibe-surface:dev --file surface/Dockerfile .
az containerapp update -n ca-vibe-surface -g rg-vibe-surface --image <acrLoginServer>/vibe-surface:dev
```

## Durable store & org policy (shared-key access)

The durable `/data/.engagements.json` lives on an **Azure Files** share. Container Apps can
only authenticate that mount with the **storage account key**, so the share needs
**shared-key access enabled**. Many corporate subscriptions (e.g. Microsoft MCAPS) enforce
an Azure Policy that *disables* shared keys on every storage account — there the mount fails
with `mount error(13): Permission denied` and the revision is stuck **Activating**.

Where that policy applies, deploy **without** the mount:

```powershell
# pipeline: set the repo variable once
gh variable set SURFACE_PERSISTENT_STORE --body false --repo ablack34/vibe-prototyping-framework
# or manual run:
az deployment sub create --location uksouth --template-file surface/infra/main.bicep `
  --parameters environmentName=vibe-surface location=uksouth serviceToken=(gh auth token) `
               enablePersistentStore=false
```

`/data` is then **ephemeral** (in-container): the surface runs fine, but the engagement
*list* resets if the revision restarts. That list is just pointers — every engagement is a
real GitHub repo and the board re-reads live gate state from each repo, so nothing is truly
lost; designers just re-open repos by URL. For a durable store under such policy, get a
storage-account policy exemption (then leave `enablePersistentStore=true`), or back the store
with git (future work). This is acceptable for a watch-the-designers pilot.

## Cost & teardown

One always-on Container App replica + ACR Basic + Key Vault + a small file share +
Log Analytics is a low-single-digit-to-low-tens-of-pounds/month footprint for a pilot.
To scale to zero when idle (cheaper, at the cost of cold starts) set `minReplicas: 0` in
`modules/container-app.bicep`. Tear everything down with:

```powershell
az group delete --name rg-vibe-surface --yes
```
