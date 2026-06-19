@description('Storage account name (globally unique, 3-24 lowercase alphanumeric)')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('File share name mounted at /data in the container')
param shareName string

resource sa 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

resource fileService 'Microsoft.Storage/storageAccounts/fileServices@2023-05-01' = {
  parent: sa
  name: 'default'
}

resource share 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-05-01' = {
  parent: fileService
  name: shareName
  properties: {
    shareQuota: 5
  }
}

output accountName string = sa.name
output shareName string = shareName
