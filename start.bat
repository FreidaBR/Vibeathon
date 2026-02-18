@echo off
echo Starting Vibeathon...
echo.
echo [1/2] Starting API server on http://localhost:3001
start "Vibeathon API" cmd /k "cd /d "%~dp0server" && node index.js"
timeout /t 2 /nobreak >nul
echo [2/2] Starting web app on http://localhost:5173
echo.
echo Both servers are running. Open http://localhost:5173 in your browser.
echo Press Ctrl+C to stop the web server. Close the API window to stop the server.
echo.
cd /d "%~dp0"
npx vite
