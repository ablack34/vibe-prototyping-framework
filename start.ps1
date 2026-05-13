<#
.SYNOPSIS
    VIBE Prototype — Local Dev Launcher
.DESCRIPTION
    Starts both the .NET API and Vite dev server for local development.
.EXAMPLE
    pwsh start.ps1
#>

Write-Host "`n  VIBE Prototype — starting locally...`n" -ForegroundColor Cyan

$root = $PSScriptRoot

# Install web deps if needed
if (-not (Test-Path "$root/scaffold/web/node_modules")) {
    Write-Host "  Installing web dependencies..." -ForegroundColor Yellow
    Push-Location "$root/scaffold/web"
    npm install
    Pop-Location
}

# Start API in background
Write-Host "  Starting API (http://localhost:5264)..." -ForegroundColor Green
$api = Start-Process -PassThru -NoNewWindow -FilePath "dotnet" `
    -ArgumentList "run", "--project", "$root/scaffold/api", "--urls", "http://localhost:5264"

# Give API a moment to boot
Start-Sleep -Seconds 3

# Start Vite dev server (foreground — Ctrl+C stops everything)
Write-Host "  Starting frontend (http://localhost:5173)..." -ForegroundColor Green
Write-Host "  Open http://localhost:5173 in your browser`n" -ForegroundColor Cyan

try {
    Push-Location "$root/scaffold/web"
    npm run dev
}
finally {
    Pop-Location
    if ($api -and -not $api.HasExited) {
        Write-Host "`n  Stopping API..." -ForegroundColor Yellow
        $api.Kill()
    }
    Write-Host "  Done." -ForegroundColor Green
}
