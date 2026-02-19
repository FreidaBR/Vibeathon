# Start Personal Career Navigator - Backend and Frontend
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "Starting backend on http://localhost:3001 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\server'; npm.cmd run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting frontend (Vite) ..." -ForegroundColor Cyan
Set-Location $root
npm.cmd run dev
