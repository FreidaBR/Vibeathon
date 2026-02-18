# Quick Start Guide

Get the Career Navigator running in 5 minutes.

## Prerequisites
- Node.js 18+ installed
- OpenAI API key (get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys))

## Step 1: Setup (1 min)

```bash
# In project root
npm install

# In server folder
cd server
npm install
cp env.example .env
```

Edit `server/.env`:
```
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3001
```

## Step 2: Start Servers (1 min)

**Terminal 1:**
```bash
cd server && npm run dev
# Should show: Server running on http://localhost:3001
```

**Terminal 2:**
```bash
npm run dev
# Should show: Local: http://localhost:5173/
```

## Step 3: Test the App (3 min)

1. Open [http://localhost:5173](http://localhost:5173)
2. Try "Full Stack Developer" → Click Analyze
3. Upload a sample resume (PDF or Word)
4. See your skills extracted
5. Get your 30-day roadmap!

## What Each Step Does

| Step | What Happens | Why |
|------|-------------|-----|
| Dream Role Input | AI analyzes job market requirements | Identifies what you need to learn |
| Resume Upload | Extracts your current skills | Shows what you already know |
| Skill Analysis | Compares current vs required | Finds gaps |
| Roadmap | Creates 30-day learning plan | Prioritizes your learning |

## Common Issues

**"Cannot reach server"**
→ Check if backend running on http://localhost:3001

**"OPENAI_API_KEY not set"**
→ Add real key to server/.env and restart

**"Resume upload fails"**
→ Use PDF or Word files, max 5MB

## Next Steps

- Read full [README.md](README.md) for all features
- Check [API_KEYS.md](API_KEYS.md) for optional keys
- Run it, test it, and start your career journey!
