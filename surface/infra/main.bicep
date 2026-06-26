// VIBE Web Surface — Azure infrastructure (Shape B: hosted single-tenant).
//
// Deploys the surface as an Azure Container App, with everything it needs to run
// the "as-you" model in the cloud:
//   - Azure Container Registry          — holds the built surface image
//   - Container Apps Environment + App  — runs the container, pinned to 1 replica
//   - Key Vault                         — stores the Copilot service token (gap #3)
//   - Storage account + File share      — durable /data/.engagements.json (gap #4),
//                                          optional: skipped where policy blocks shared keys
//   - Log Analytics + Application Insights — logs + telemetry
//   - User-assigned managed identity    — ACR pull + Key Vault secret read, no passwords
//   - (optional) Entra "Easy Auth" wall — only signed-in pilot users reach the surface
//
// Subscription-scope deployment (creates the resource group), matching the
// convention in scaffold/infra/main.bicep. Deployed by .github/workflows/
// deploy-surface.yml via `az deployment sub create`.

targetScope = 'subscription'

@description('Azure region for all resources')
@allowed([
  'uksouth'
  'ukwest'
  'westeurope'
  'northeurope'
  'eastus'
  'eastus2'
  'westus2'
  'westus3'
])
param location string = 'uksouth'

@description('Environment name (drives resource naming — lowercase letters, numbers, hyphens; 3-20 chars)')
@minLength(3)
@maxLength(20)
param environmentName string

@description('Container image for the surface. The deploy pipeline overrides this with the freshly built ACR image; the placeholder default lets the very first deployment stand the app up before the image exists.')
param containerImage string = 'mcr.microsoft.com/k8se/quickstart:latest'

@description('Copilot service-account GitHub token (a fine-grained PAT with the Copilot Requests permission on a Copilot-seated account, or a seat-holding user token). Passed from a GitHub Actions secret at deploy time, stored in Key Vault — never in source.')
@secure()
param serviceToken string

@description('Optional Entra application (client) ID for the sign-in wall. Leave empty to deploy open (for an initial smoke test), then redeploy with it set to lock the surface down to your tenant.')
param authClientId string = ''

@description('Entra application client secret — required only when authClientId is set.')
@secure()
param authClientSecret string = ''

@description('Tenant allowed to sign in (defaults to the deployment tenant).')
param authTenantId string = tenant().tenantId

@description('Port the surface listens on (server.mjs defaults to 4310).')
param containerPort int = 4310

@description('Mount a durable Azure Files store at /data. Requires storage-account shared-key access; set false where org policy disables shared keys (the store then falls back to ephemeral in-container storage).')
param enablePersistentStore bool = true

@description('Optional git-backed store: "owner/repo" of a private repo holding the engagement pointer list as committed JSON. Recommended when enablePersistentStore is false so the store survives restarts. Empty = local-file store.')
param storeRepo string = ''

@description('Path within storeRepo for the engagement store JSON.')
param storePath string = 'engagements.json'

@description('Optional GitHub OAuth App client ID for per-user GitHub sign-in. Empty = legacy single-user mode (everyone acts as the service token — today\'s behaviour).')
param oauthClientId string = ''

@description('GitHub OAuth App client secret — required only when oauthClientId is set. Stored in Key Vault and read by the surface managed identity.')
@secure()
param oauthClientSecret string = ''

@description('Public base URL of the surface (https://<fqdn>) used to build the OAuth redirect_uri. Set this to the deployed FQDN so it exactly matches the OAuth App callback. Empty = derive from the forwarded host header.')
param baseUrl string = ''

@description('Optional comma/space-separated allow-list of GitHub logins permitted to sign in. Empty = any GitHub user.')
param allowedLogins string = ''

@description('Optional comma/space-separated list of GitHub logins who are permanent admins (can manage the allow-list from the in-app Access screen and can never be removed there). Empty = no permanent admins (manage admins entirely in-app).')
param adminLogins string = ''

@description('Tags applied to all resources')
param tags object = {
  project: 'vibe-surface'
  environment: environmentName
}

var baseName = toLower(environmentName)
var suffix = uniqueString(subscription().id, environmentName)
// Globally-unique, provider-constrained names:
var acrName = take('acr${replace(baseName, '-', '')}${suffix}', 50)
var storageAccountName = take('st${replace(baseName, '-', '')}${suffix}', 24)
var keyVaultName = take('kv-${baseName}-${suffix}', 24)

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module identity 'modules/identity.bicep' = {
  scope: rg
  name: 'identity'
  params: {
    name: 'id-${environmentName}'
    location: location
    tags: tags
  }
}

module monitoring 'modules/monitoring.bicep' = {
  scope: rg
  name: 'monitoring'
  params: {
    name: 'log-${environmentName}'
    appInsightsName: 'appi-${environmentName}'
    location: location
    tags: tags
  }
}

module registry 'modules/registry.bicep' = {
  scope: rg
  name: 'registry'
  params: {
    name: acrName
    location: location
    tags: tags
    pullPrincipalId: identity.outputs.principalId
  }
}

module storage 'modules/storage.bicep' = {
  scope: rg
  name: 'storage'
  params: {
    name: storageAccountName
    location: location
    tags: tags
    shareName: 'engagements'
  }
}

module keyvault 'modules/keyvault.bicep' = {
  scope: rg
  name: 'keyvault'
  params: {
    name: keyVaultName
    location: location
    tags: tags
    serviceToken: serviceToken
    kvReaderPrincipalId: identity.outputs.principalId
    oauthClientSecret: oauthClientSecret
  }
}

module app 'modules/container-app.bicep' = {
  scope: rg
  name: 'containerApp'
  params: {
    name: 'ca-${environmentName}'
    envName: 'cae-${environmentName}'
    location: location
    tags: tags
    logAnalyticsName: monitoring.outputs.workspaceName
    appInsightsConnectionString: monitoring.outputs.appInsightsConnectionString
    userAssignedIdentityId: identity.outputs.id
    acrLoginServer: registry.outputs.loginServer
    containerImage: containerImage
    containerPort: containerPort
    serviceTokenSecretUri: keyvault.outputs.serviceTokenSecretUri
    storageAccountName: storage.outputs.accountName
    storageShareName: storage.outputs.shareName
    enablePersistentStore: enablePersistentStore
    storeRepo: storeRepo
    storePath: storePath
    authClientId: authClientId
    authClientSecret: authClientSecret
    authTenantId: authTenantId
    oauthClientId: oauthClientId
    oauthClientSecretUri: keyvault.outputs.oauthClientSecretUri
    baseUrl: baseUrl
    allowedLogins: allowedLogins
    adminLogins: adminLogins
  }
}

output resourceGroupName string = rg.name
output containerAppName string = app.outputs.name
output containerAppFqdn string = app.outputs.fqdn
output acrName string = registry.outputs.name
output acrLoginServer string = registry.outputs.loginServer
output keyVaultName string = keyvault.outputs.name
