<#
.SYNOPSIS
    Deploy VIBE Prototype to Azure (Static Web App + App Service API).
.EXAMPLE
    pwsh deploy.ps1 -Location uksouth -EnvironmentName my-engagement
#>
param(
    [string]$Location = "uksouth",
    [string]$EnvironmentName = "vibe-proto"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "`n=== VIBE Prototype Deployment ===" -ForegroundColor Cyan

# 1. Check prerequisites
Write-Host "`n[1/3] Checking prerequisites..." -ForegroundColor Yellow
$missing = @()
if (-not (Get-Command "dotnet" -ErrorAction SilentlyContinue)) { $missing += "dotnet" }
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) { $missing += "node" }
if (-not (Get-Command "azd" -ErrorAction SilentlyContinue)) { $missing += "azd (Azure Developer CLI)" }
if ($missing.Count -gt 0) {
    Write-Host "Missing: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}
Write-Host "  All prerequisites found" -ForegroundColor Green

# 2. Initialize azd if needed
Write-Host "`n[2/3] Configuring Azure deployment..." -ForegroundColor Yellow
$envExists = azd env list 2>&1 | Select-String $EnvironmentName
if (-not $envExists) {
    azd env new $EnvironmentName
    azd env set AZURE_LOCATION $Location
}
Write-Host "  Environment: $EnvironmentName ($Location)" -ForegroundColor Green

# 3. Deploy
Write-Host "`n[3/3] Deploying to Azure..." -ForegroundColor Yellow
Write-Host "  This will create: Static Web App, App Service, Log Analytics" -ForegroundColor Gray
azd up --environment $EnvironmentName
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nDeployment failed. Try: azd auth login" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green
Write-Host "Run 'azd show' to see the app URL" -ForegroundColor Cyan
