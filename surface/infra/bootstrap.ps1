<#
.SYNOPSIS
  One-time setup for the VIBE surface deploy pipeline (.github/workflows/deploy-surface.yml).

.DESCRIPTION
  Creates the Entra application + service principal the GitHub Actions pipeline uses to
  authenticate to Azure via OIDC (federated credentials — no stored passwords), grants it
  rights to deploy, and wires the required GitHub repo variables + secrets.

  Run this ONCE, signed in to both Azure (`az login`) and GitHub (`gh auth login`) as a
  user with rights to create app registrations and assign roles on the subscription.

  Part B (the Entra sign-in wall) is at the bottom — run it AFTER the first deployment,
  once the surface has a public URL to register as a redirect.

.EXAMPLE
  ./bootstrap.ps1 -SubscriptionId dcb5598b-744e-4810-8f2f-7b6116aa5bb7
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)] [string] $SubscriptionId,
  [string] $RepoFullName = 'ablack34/vibe-prototyping-framework',
  [string] $EnvName      = 'vibe-surface',
  [string] $Location     = 'uksouth',
  [string] $AppName      = 'vibe-surface-deployer'
)

$ErrorActionPreference = 'Stop'

Write-Host "==> Setting subscription $SubscriptionId" -ForegroundColor Cyan
az account set --subscription $SubscriptionId | Out-Null
$tenantId = az account show --query tenantId -o tsv

# --- 1. Entra app + service principal for the pipeline -------------------------------
Write-Host "==> Ensuring Entra app registration '$AppName'" -ForegroundColor Cyan
$appId = az ad app list --display-name $AppName --query "[0].appId" -o tsv
if (-not $appId) {
  $appId = az ad app create --display-name $AppName --query appId -o tsv
  Write-Host "    created app $appId"
} else {
  Write-Host "    reusing app $appId"
}

# Ensure a service principal exists for the app (idempotent).
$spId = az ad sp list --filter "appId eq '$appId'" --query "[0].id" -o tsv
if (-not $spId) {
  $spId = az ad sp create --id $appId --query id -o tsv
  Write-Host "    created service principal $spId"
}

# --- 2. Federated credential trusting this repo's main branch ------------------------
Write-Host "==> Adding federated credential for $RepoFullName (main)" -ForegroundColor Cyan
$ficName = 'github-main'
$existingFic = az ad app federated-credential list --id $appId --query "[?name=='$ficName'] | [0].name" -o tsv
if (-not $existingFic) {
  $fic = @{
    name      = $ficName
    issuer    = 'https://token.actions.githubusercontent.com'
    subject   = "repo:${RepoFullName}:ref:refs/heads/main"
    audiences = @('api://AzureADTokenExchange')
  } | ConvertTo-Json -Compress
  $ficPath = New-TemporaryFile
  Set-Content -Path $ficPath -Value $fic -Encoding utf8
  az ad app federated-credential create --id $appId --parameters "@$ficPath" | Out-Null
  Remove-Item $ficPath
  Write-Host "    added $ficName"
} else {
  Write-Host "    $ficName already present"
}

# --- 3. Grant the pipeline rights to deploy -----------------------------------------
# Owner at subscription scope: the deployment creates the resource group AND role
# assignments (AcrPull, Key Vault Secrets User), which require role-assignment rights.
# Tighter alternative: pre-create rg-$EnvName, grant Owner only on that RG, and change
# main.bicep targetScope to 'resourceGroup'.
Write-Host "==> Granting Owner on the subscription to the pipeline identity" -ForegroundColor Cyan
az role assignment create `
  --assignee-object-id $spId `
  --assignee-principal-type ServicePrincipal `
  --role Owner `
  --scope "/subscriptions/$SubscriptionId" | Out-Null

# --- 4. Wire GitHub repo variables + secrets ----------------------------------------
Write-Host "==> Setting GitHub repo variables on $RepoFullName" -ForegroundColor Cyan
gh variable set SURFACE_DEPLOY_CONFIGURED --repo $RepoFullName --body "true"
gh variable set AZURE_ENV_NAME            --repo $RepoFullName --body $EnvName
gh variable set AZURE_LOCATION            --repo $RepoFullName --body $Location

Write-Host "==> Setting GitHub repo secrets on $RepoFullName" -ForegroundColor Cyan
gh secret set AZURE_CLIENT_ID       --repo $RepoFullName --body $appId
gh secret set AZURE_TENANT_ID       --repo $RepoFullName --body $tenantId
gh secret set AZURE_SUBSCRIPTION_ID --repo $RepoFullName --body $SubscriptionId

# The Copilot service token (the gh token the surface runs as). Paste when prompted; it
# is read as a secret string and never echoed. Skip with Enter to set it later.
$tokenSecure = Read-Host "Copilot service-account token (COPILOT_SERVICE_TOKEN), or Enter to skip" -AsSecureString
$token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($tokenSecure))
if ($token) {
  $token | gh secret set COPILOT_SERVICE_TOKEN --repo $RepoFullName
  Write-Host "    COPILOT_SERVICE_TOKEN set"
} else {
  Write-Host "    skipped — set COPILOT_SERVICE_TOKEN before deploying" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. Trigger the pipeline with:  gh workflow run 'Deploy Surface (Azure Container Apps)' --repo $RepoFullName" -ForegroundColor Green
Write-Host "The first run deploys OPEN (no sign-in wall). Run Part B below to lock it down."

# =====================================================================================
# PART B — Entra sign-in wall (run AFTER the first deploy, once you have the surface URL)
# =====================================================================================
# Replace <FQDN> with the deployed Container App URL (the pipeline prints it; or:
#   az containerapp show -n ca-$EnvName -g rg-$EnvName --query properties.configuration.ingress.fqdn -o tsv)
#
#   $fqdn   = '<FQDN>'
#   $authApp = az ad app create --display-name 'vibe-surface-auth' `
#       --web-redirect-uris "https://$fqdn/.auth/login/aad/callback" `
#       --enable-id-token-issuance true --query appId -o tsv
#   az ad app update --id $authApp --identifier-uris "api://$authApp"
#   $secret = az ad app credential reset --id $authApp --append --query password -o tsv
#   gh secret set AUTH_CLIENT_ID     --repo $RepoFullName --body $authApp
#   $secret | gh secret set AUTH_CLIENT_SECRET --repo $RepoFullName
#
# Then redeploy with the wall on:
#   gh workflow run 'Deploy Surface (Azure Container Apps)' --repo $RepoFullName -f enableAuth=true
