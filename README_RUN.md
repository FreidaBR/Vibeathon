# How to Run Vibeathon

## Quick Start (Single Command)

```bash
npm run dev
```

This starts **both** the API server and the web app. Open **http://localhost:5173** in your browser.

---

## Alternative: Windows Double-Click

1. Double-click **`start.bat`** in the project folder
2. A new window will open for the API server
3. The web app will start in the current window
4. Open http://localhost:5173 in your browser

---

## If You See "Port already in use"

Another process is using port 3001 or 5173. To fix:

**Windows (PowerShell):**
```powershell
# Find what's using port 3001
netstat -ano | findstr :3001

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

**Or** close any other terminals running the app, then try again.

---

## Manual Start (Two Terminals)

If `npm run dev` has issues, use two terminals:

**Terminal 1 - API Server:**
```bash
cd server
npm run dev
```
Wait for: `Server running on http://localhost:3001`

**Terminal 2 - Web App:**
```bash
npm run dev:web
```
Or just: `npx vite`

Then open http://localhost:5173
