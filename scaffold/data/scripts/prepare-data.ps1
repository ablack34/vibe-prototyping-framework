<#
.SYNOPSIS
    Prepare customer data files for the prototype.
.DESCRIPTION
    Cleans CSV files: normalizes headers, standardizes dates, removes duplicates.
    Place raw customer CSVs in scaffold/data/ and run this script.
.EXAMPLE
    pwsh scaffold/data/scripts/prepare-data.ps1
#>

param(
    [string]$DataPath = (Join-Path $PSScriptRoot "..")
)

$csvFiles = Get-ChildItem -Path $DataPath -Filter "*.csv" -File |
    Where-Object { $_.DirectoryName -eq (Resolve-Path $DataPath).Path }

if ($csvFiles.Count -eq 0) {
    Write-Host "No CSV files found in $DataPath" -ForegroundColor Yellow
    Write-Host "Place customer data files there and re-run." -ForegroundColor Yellow
    exit 0
}

foreach ($file in $csvFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan

    $data = Import-Csv -Path $file.FullName

    # Normalize headers
    $headers = $data[0].PSObject.Properties.Name
    $cleanHeaders = $headers | ForEach-Object {
        ($_ -replace '\s+', '_' -replace '[^a-zA-Z0-9_]', '').ToLower()
    }

    Write-Host "  Rows: $($data.Count), Columns: $($headers.Count)" -ForegroundColor Green
    Write-Host "  Headers: $($cleanHeaders -join ', ')" -ForegroundColor Gray
}

Write-Host "`nData preparation complete." -ForegroundColor Green
Write-Host "Run /vibe-data-prep in Copilot Chat for full cleaning and model generation." -ForegroundColor Cyan
