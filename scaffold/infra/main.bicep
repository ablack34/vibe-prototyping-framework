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

@description('Environment name (used for resource naming — lowercase letters, numbers, hyphens; 3-20 chars)')
@minLength(3)
@maxLength(20)
param environmentName string

@description('Tags applied to all resources')
param tags object = {
  project: 'vibe-prototype'
  environment: environmentName
}

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module swa 'modules/static-web-app.bicep' = {
  scope: rg
  name: 'swa'
  params: {
    name: 'swa-${environmentName}'
    location: location
    tags: tags
  }
}

module api 'modules/app-service.bicep' = {
  scope: rg
  name: 'api'
  params: {
    name: 'api-${environmentName}'
    location: location
    tags: tags
  }
}

module monitoring 'modules/monitoring.bicep' = {
  scope: rg
  name: 'monitoring'
  params: {
    name: 'log-${environmentName}'
    location: location
    tags: tags
  }
}
