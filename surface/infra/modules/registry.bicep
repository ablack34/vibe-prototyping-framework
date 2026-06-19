@description('Container registry name (globally unique, alphanumeric)')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Principal ID granted AcrPull (the surface managed identity)')
param pullPrincipalId string

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Basic'
  }
  properties: {
    // Pull is via managed identity (AcrPull below); the admin user stays off.
    adminUserEnabled: false
  }
}

// AcrPull — lets the surface managed identity pull the image without a password.
var acrPullRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')

resource acrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, pullPrincipalId, acrPullRoleId)
  scope: acr
  properties: {
    roleDefinitionId: acrPullRoleId
    principalId: pullPrincipalId
    principalType: 'ServicePrincipal'
  }
}

output name string = acr.name
output loginServer string = acr.properties.loginServer
