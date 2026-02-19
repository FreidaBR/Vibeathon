# Vibeathon - Start both servers
Write-Host "Starting Vibeathon..." -ForegroundColor Cyan
Write-Host ""

# Start API server in background
$serverPath = Join-Path $PSScriptRoot "server"
Write-Host "[1/2] Starting API server on http://localhost:3001" -ForegroundColor Blue
$serverJob = Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory $serverPath -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 2

# Start Vite
Write-Host "[2/2] Starting web app on http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "Both servers running. Open http://localhost:5173 in your browser." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot
npx vite

# Cleanup on exit
if ($serverJob) { Stop-Process -Id $serverJob.Id -Force -ErrorAction SilentlyContinue }
