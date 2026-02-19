@echo off
cd /d "%~dp0"
echo Starting backend on http://localhost:3001 ...
start "Backend" cmd /k "cd /d %~dp0server && npm.cmd run dev"
timeout /t 4 /nobreak >nul
echo Starting frontend...
cd /d "%~dp0"
npm.cmd run dev
