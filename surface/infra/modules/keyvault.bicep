@description('Key Vault name (globally unique, 3-24 chars, starts with a letter)')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Copilot service-account token to store as a secret')
@secure()
param serviceToken string

@description('Principal ID granted Key Vault Secrets User (the surface managed identity)')
param kvReaderPrincipalId string

@description('Optional GitHub OAuth App client secret for per-user sign-in. Empty = not stored.')
@secure()
param oauthClientSecret string = ''

var enableOAuthSecret = !empty(oauthClientSecret)

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenant().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
  }
}

resource tokenSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'copilot-service-token'
  properties: {
    value: serviceToken
  }
}

// Per-user GitHub sign-in: the OAuth App client secret (only when supplied).
resource oauthSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (enableOAuthSecret) {
  parent: kv
  name: 'github-oauth-client-secret'
  properties: {
    value: oauthClientSecret
  }
}

// Key Vault Secrets User — lets the surface managed identity read the token at runtime.
var secretsUserRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')

resource secretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(kv.id, kvReaderPrincipalId, secretsUserRoleId)
  scope: kv
  properties: {
    roleDefinitionId: secretsUserRoleId
    principalId: kvReaderPrincipalId
    principalType: 'ServicePrincipal'
  }
}

output name string = kv.name
// Unversioned secret URI so Key Vault rotation is picked up without a redeploy.
output serviceTokenSecretUri string = '${kv.properties.vaultUri}secrets/${tokenSecret.name}'
// Empty string when no OAuth secret was supplied → container-app stays in legacy mode.
output oauthClientSecretUri string = enableOAuthSecret ? '${kv.properties.vaultUri}secrets/${oauthSecret.name}' : ''
