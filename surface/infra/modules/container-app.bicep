@description('Container App name')
param name string

@description('Container Apps Environment name')
param envName string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Log Analytics workspace name (for the environment log sink)')
param logAnalyticsName string

@description('Application Insights connection string')
param appInsightsConnectionString string

@description('Resource ID of the user-assigned managed identity (ACR pull + KV secret read)')
param userAssignedIdentityId string

@description('ACR login server, e.g. acrxxxx.azurecr.io')
param acrLoginServer string

@description('Container image to run')
param containerImage string

@description('Container target port')
param containerPort int

@description('Unversioned Key Vault secret URI holding the Copilot service token')
param serviceTokenSecretUri string

@description('Storage account name backing the /data file share')
param storageAccountName string

@description('File share name mounted at /data')
param storageShareName string

@description('When true, mount the Azure Files share at /data; when false, /data is ephemeral in-container storage')
param enablePersistentStore bool = true

@description('Optional Entra app (client) ID for the sign-in wall')
param authClientId string = ''

@description('Optional Entra app client secret')
@secure()
param authClientSecret string = ''

@description('Tenant allowed to sign in')
param authTenantId string

var storageMountName = 'engagements'
var enableAuth = !empty(authClientId)

resource law 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
  name: logAnalyticsName
}

resource sa 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: storageAccountName
}

resource env 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: envName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: law.properties.customerId
        sharedKey: law.listKeys().primarySharedKey
      }
    }
  }
}

// Azure Files mount for the durable engagement store (survives revisions/restarts).
// Skipped where org policy disables storage shared-key access — /data is then ephemeral.
resource envStorage 'Microsoft.App/managedEnvironments/storages@2024-03-01' = if (enablePersistentStore) {
  parent: env
  name: storageMountName
  properties: {
    azureFile: {
      accountName: storageAccountName
      accountKey: sa.listKeys().keys[0].value
      shareName: storageShareName
      accessMode: 'ReadWrite'
    }
  }
}

var dataVolumes = enablePersistentStore ? [
  {
    name: 'data'
    storageType: 'AzureFile'
    storageName: storageMountName
  }
] : []
var dataVolumeMounts = enablePersistentStore ? [
  {
    volumeName: 'data'
    mountPath: '/data'
  }
] : []

var baseSecrets = [
  {
    name: 'gh-token'
    keyVaultUrl: serviceTokenSecretUri
    identity: userAssignedIdentityId
  }
]
var authSecrets = enableAuth ? [
  {
    name: 'auth-client-secret'
    value: authClientSecret
  }
] : []

resource app 'Microsoft.App/containerApps@2024-03-01' = {
  name: name
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityId}': {}
    }
  }
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: containerPort
        transport: 'auto'
        allowInsecure: false
      }
      registries: [
        {
          server: acrLoginServer
          identity: userAssignedIdentityId
        }
      ]
      secrets: concat(baseSecrets, authSecrets)
    }
    template: {
      containers: [
        {
          name: 'surface'
          image: containerImage
          resources: {
            cpu: json('1.0')
            memory: '2Gi'
          }
          env: [
            {
              name: 'PORT'
              value: string(containerPort)
            }
            {
              name: 'STORE'
              value: '/data/.engagements.json'
            }
            {
              name: 'GH_TOKEN'
              secretRef: 'gh-token'
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: appInsightsConnectionString
            }
          ]
          volumeMounts: dataVolumeMounts
        }
      ]
      // Pinned to a single replica: one shared JSON store, no concurrent writers.
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
      volumes: dataVolumes
    }
  }
  dependsOn: enablePersistentStore ? [
    envStorage
  ] : []
}

// Entra "Easy Auth" — when an app registration is supplied, every request must be
// signed in; unauthenticated users are redirected to the Microsoft login page.
resource auth 'Microsoft.App/containerApps/authConfigs@2024-03-01' = if (enableAuth) {
  parent: app
  name: 'current'
  properties: {
    platform: {
      enabled: true
    }
    globalValidation: {
      unauthenticatedClientAction: 'RedirectToLoginPage'
      redirectToProvider: 'azureactivedirectory'
    }
    identityProviders: {
      azureActiveDirectory: {
        enabled: true
        registration: {
          clientId: authClientId
          clientSecretSettingName: 'auth-client-secret'
          openIdIssuer: '${environment().authentication.loginEndpoint}${authTenantId}/v2.0'
        }
        validation: {
          allowedAudiences: [
            'api://${authClientId}'
          ]
        }
      }
    }
  }
}

output name string = app.name
output fqdn string = app.properties.configuration.ingress.fqdn
