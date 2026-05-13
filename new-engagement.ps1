<#
.SYNOPSIS
    Create a new VIBE Prototyping engagement from the framework template.
.DESCRIPTION
    One command to go from zero to a ready-to-use engagement workspace:
    1. Creates a new private GitHub repo from the VIBE framework template
    2. Clones it locally
    3. Opens it in VS Code
    
    Prerequisites: gh CLI (authenticated), VS Code, Node.js, .NET 9 SDK
.PARAMETER Customer
    Customer name (e.g., "Contoso")
.PARAMETER Engagement
    Short engagement name (e.g., "field-scheduling"). Used for the repo name.
.PARAMETER Owner
    GitHub org or username to create the repo under. Defaults to current user.
.PARAMETER Location
    Local directory to clone into. Defaults to ~/repos/
.EXAMPLE
    .\new-engagement.ps1 -Customer "Contoso" -Engagement "field-scheduling"
.EXAMPLE
    .\new-engagement.ps1 -Customer "Northwind" -Engagement "inventory-ai" -Owner "my-org"
#>

param(
    [Parameter(Mandatory)]
    [string]$Customer,

    [Parameter(Mandatory)]
    [string]$Engagement,

    [string]$Owner = "",

    [string]$Location = (Join-Path $env:USERPROFILE "repos")
)

$ErrorActionPreference = "Stop"

$repoName = "$($Customer.ToLower() -replace '\s+','-')-$($Engagement.ToLower() -replace '\s+','-')"
$templateRepo = "ablack34/vibe-prototyping-framework"
$localPath = Join-Path $Location $repoName

Write-Host ""
Write-Host "  VIBE Prototyping — New Engagement Setup" -ForegroundColor Cyan
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Customer:    $Customer" -ForegroundColor White
Write-Host "  Engagement:  $Engagement" -ForegroundColor White
Write-Host "  Repo name:   $repoName" -ForegroundColor White
Write-Host "  Local path:  $localPath" -ForegroundColor White
Write-Host ""

# --- Step 1: Check prerequisites ---
Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow

$missing = @()
if (-not (Get-Command "gh" -ErrorAction SilentlyContinue)) { $missing += "gh (GitHub CLI)" }
if (-not (Get-Command "code" -ErrorAction SilentlyContinue)) { $missing += "VS Code" }
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) { $missing += "Node.js" }
if (-not (Get-Command "dotnet" -ErrorAction SilentlyContinue)) { $missing += ".NET SDK" }

if ($missing.Count -gt 0) {
    Write-Host "  Missing: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "  Install these and try again." -ForegroundColor Red
    exit 1
}

# Check gh auth
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  GitHub CLI not authenticated. Run: gh auth login" -ForegroundColor Red
    exit 1
}

Write-Host "  All prerequisites found" -ForegroundColor Green

# --- Step 2: Create repo from template ---
Write-Host "[2/5] Creating repo from VIBE framework template..." -ForegroundColor Yellow

$createArgs = @(
    "repo", "create", $repoName,
    "--template", $templateRepo,
    "--private",
    "--clone",
    "--description", "VIBE Prototyping engagement: $Customer - $Engagement"
)

if ($Owner) {
    # If owner specified, prefix the repo name with the org
    $createArgs[2] = "$Owner/$repoName"
}

# Ensure parent directory exists
if (-not (Test-Path $Location)) {
    New-Item -ItemType Directory -Path $Location -Force | Out-Null
}

Push-Location $Location
try {
    gh @createArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Failed to create repo. Check your permissions." -ForegroundColor Red
        exit 1
    }
}
finally {
    Pop-Location
}

Write-Host "  Repo created and cloned to: $localPath" -ForegroundColor Green

# --- Step 3: Install web dependencies ---
Write-Host "[3/5] Installing frontend dependencies..." -ForegroundColor Yellow

Push-Location "$localPath/scaffold/web"
npm install --silent 2>&1 | Out-Null
Pop-Location

Write-Host "  npm install complete" -ForegroundColor Green

# --- Step 4: Restore .NET packages ---
Write-Host "[4/5] Restoring .NET packages..." -ForegroundColor Yellow

Push-Location "$localPath/scaffold/api"
dotnet restore --verbosity quiet 2>&1 | Out-Null
Pop-Location

Write-Host "  dotnet restore complete" -ForegroundColor Green

# --- Step 5: Open in VS Code ---
Write-Host "[5/5] Opening in VS Code..." -ForegroundColor Yellow

code $localPath

Write-Host ""
Write-Host "  ✓ Engagement workspace ready!" -ForegroundColor Green
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open Copilot Chat (Ctrl+Shift+I) in Agent mode" -ForegroundColor White
Write-Host "  2. Type: /vibe-kickoff customer=`"$Customer`" problem=`"describe the problem`" size=S" -ForegroundColor White
Write-Host "  3. Follow the playbook: docs/playbook.md" -ForegroundColor White
Write-Host ""
Write-Host "  MCP servers needed: work-iq-mcp (transcripts), ADO MCP (backlog)" -ForegroundColor Gray
Write-Host "  Setup guide: docs/mcp-setup.md" -ForegroundColor Gray
Write-Host ""
