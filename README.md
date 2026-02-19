# Personal Career Navigator

Your AI-powered Career Co-Pilot dashboard with intelligent resume analysis and personalized 30-day roadmaps. This application uses agentic AI to analyze your current skills, understand your dream role, identify skill gaps, and generate an adaptive learning roadmap.

## 🎯 Core Features

- **Dream Role Analysis** – Input your target job title and get AI analysis of required skills, tools, and experience level
- **Resume Upload** – Drag & drop PDF or Word documents for AI-powered skill extraction
- **Skill Gap Analysis** – Automatically identifies missing skills between your current profile and dream role requirements
- **GitHub & LinkedIn Validation** – Verifies profile URLs (GitHub via API, LinkedIn format + optional Proxycurl)
- **Smart Skill Analysis** – AI extracts skills, languages, tools, frameworks, and extracurricular activities from your resume
- **Personalized 30-Day Roadmap** – AI-generated career milestones prioritizing skill gaps and aligned with your dream role
- **Interactive Tracking** – Mark milestones as complete with celebration confetti animations
- **Light/Dark Theme** – Beautiful animated toggle with tailored aesthetics for both modes

## 🏗️ How It Works

1. **Dream Role Input** → Specify your target career position
2. **Profile Upload** → Add your resume (PDF/DOCX)
3. **Profile Links** → Optionally validate GitHub and LinkedIn profiles
4. **AI Analysis** → System analyzes:
   - Your current skills from resume
   - Required skills for dream role
   - Skill gaps and priorities
5. **Roadmap Generation** → Creates 15 personalized milestones focusing on:
   - Learning priority missing skills first
   - Building projects combining learned + existing skills
   - Portfolio enhancement
   - Networking for dream role
   - Job applications

## 🛠️ Tech Stack

**Frontend**: React 19, Vite 7, TailwindCSS v4, Framer Motion, Lucide Icons  
**Backend**: Node.js, Express, OpenAI GPT-4o, pdf-parse, mammoth, cors

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (required) – [Get it here](https://platform.openai.com/api-keys)

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

### 2. Configure Environment Variables

```bash
cd server
cp env.example .env
```

Edit `server/.env`:
```env
# REQUIRED - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-key-here

# OPTIONAL - Get from https://github.com/settings/tokens
GITHUB_TOKEN=

# OPTIONAL - Get from https://nubela.co/proxycurl/
PROXYCURL_API_KEY=

# Server configuration
PORT=3001
```

### 3. Run the Application

**Terminal 1 – Start Backend Server:**
```bash
cd server
npm run dev
```

Expected output:
```
Server running on http://localhost:3001
```

**Terminal 2 – Start Frontend Server:**
```bash
npm run dev
```

Expected output:
```
VITE v7.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 4. Open in Browser

Navigate to [http://localhost:5173](http://localhost:5173)

## 📖 Usage Guide

### Step 1: Specify Your Dream Role
1. Enter your target job title (e.g., "Full Stack Web Developer", "Product Manager")
2. Click "Analyze" to get AI-generated requirements for that role
3. System will identify:
   - Required technical skills
   - Programming languages needed
   - Tools and frameworks
   - Soft skills and experience level

### Step 2: Upload Your Resume
1. Drag and drop your resume (PDF or Word document)
2. The system will extract:
   - Current skills
   - Languages and programming experience
   - Tools and frameworks you've used
   - Extracurricular activities and certifications

### Step 3: Add Profile Links (Optional)
- **GitHub**: Paste your GitHub profile URL for portfolio recommendations
- **LinkedIn**: Paste your LinkedIn profile URL for networking suggestions

### Step 4: View Your Roadmap
The system generates a personalized 30-day roadmap that:
- **Days 1-7**: High-priority skill learning (based on gaps)
- **Days 8-15**: Project building with new + existing skills
- **Days 16-22**: Portfolio enhancement and contributions
- **Days 23-30**: Networking and job application strategies

Each milestone shows:
- Clear action title
- Specific how-to description
- Estimated completion time (1-7 days)
- Checkmark to track progress

## 🔄 The Agentic Workflow

The "Career Co-Pilot" uses agentic AI reasoning:

```
[Dream Role Input]
        ↓
[AI Analyzes Required Skills]
        ↓
[Resume Upload & Skill Extraction]
        ↓
[Calculate Skill Gaps]
        ↓
[Adaptive Roadmap Generation]
        ↓
[Prioritize High-Impact Learning]
        ↓
[30-Day Personalized Roadmap]
```

This differs from static advice because:
- ✅ Analyzes YOUR actual skills, not just job title
- ✅ Identifies REAL gaps between current and target state
- ✅ Prioritizes learning based on job market demand
- ✅ Generates concrete, actionable milestones
- ✅ Adapts recommendations to your profile

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload` | POST | Analyze resume and extract skills |
| `/api/analyze-dream-role` | POST | Analyze target role requirements |
| `/api/roadmap` | POST | Generate personalized 30-day roadmap |
| `/api/validate/github` | POST | Verify GitHub profile URL |
| `/api/validate/linkedin` | POST | Verify LinkedIn profile URL |
| `/api/health` | GET | Check server status and API keys |

## 📦 API Keys & Configuration

| Key | Required | Cost | Purpose |
|-----|----------|------|---------|
| **OPENAI_API_KEY** | ✅ Yes | ~$0.02-0.05 per request | Resume analysis + roadmap generation using GPT-4o |
| **GITHUB_TOKEN** | ❌ No | Free | Higher rate limit for GitHub validation (5000 req/hr vs 60) |
| **PROXYCURL_API_KEY** | ❌ No | Paid plan | Verify LinkedIn profile actually exists |

### Getting Your API Keys

**OpenAI API Key:**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy and paste into `server/.env`

**GitHub Token (Optional):**
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. No scopes needed for public profile lookup
4. Copy and paste into `server/.env`

**Proxycurl API Key (Optional):**
1. Visit [nubela.co/proxycurl](https://nubela.co/proxycurl/)
2. Sign up for free plan
3. Copy and paste into `server/.env`

## ⚠️ Troubleshooting

### "Cannot reach server" Error
- Check if backend is running: `cd server && npm run dev`
- Verify backend is on `http://localhost:3001`
- Check for port conflicts

### "OPENAI_API_KEY not set" Error
- Edit `server/.env`
- Add your actual OpenAI API key
- Restart backend server

### Resume Upload Fails
- Ensure file is PDF or Word (.doc, .docx)
- File size must be under 5MB
- PDFs must not be image-based (must have extractable text)

### GitHub/LinkedIn Validation Fails
- Check URL format: `https://github.com/username` (no trailing slash)
- LinkedIn: `https://linkedin.com/in/profilename`
- For LinkedIn: Add PROXYCURL_API_KEY for full verification

## 📝 Sample Test Scenario

Try this example to test the full workflow:

1. **Dream Role**: "Full Stack Developer"
2. **Resume**: [Use `gpt_dataset.csv` as reference - create a simple resume with:
   - Skills: Python, JavaScript, React, Node.js
   - Tools: Git, VS Code, Figma
   - Experience: 2 years

3. **GitHub**: https://github.com/your-username
4. **LinkedIn**: https://linkedin.com/in/your-profile

Expected output:
- ✅ 5 missing framework skills (Vue, Angular, GraphQL, etc.)
- ✅ 3 missing tool skills (Docker, Kubernetes, AWS, etc.)
- ✅ 30-day roadmap focusing on backend skills first

## 🚀 Deployment

For production deployment:

**Build Frontend:**
```bash
npm run build
# Output: dist/ folder
```

**Deploy Frontend (Vercel, Netlify, etc.):**
```bash
# Configure API_BASE in src/lib/api.js to production backend URL
```

**Deploy Backend (Heroku, Railway, etc.):**
```bash
cd server
npm run start
```

## 📊 Key Implemented Features

- ✅ Agentic AI workflow for career planning
- ✅ Dream role analysis and skill gap identification
- ✅ Multi-format resume parsing (PDF + Word)
- ✅ Smart skill extraction and categorization
- ✅ Profile validation (GitHub + LinkedIn)
- ✅ Adaptive 30-day learning roadmap
- ✅ Interactive milestone tracking with animations
- ✅ Dark/Light theme support
- ✅ Responsive mobile design
- ✅ Comprehensive error handling

## 📄 License

MIT

## 🤝 Contributing

Feel free to fork, modify, and improve! This is an educational project demonstrating agentic AI for career planning.

## ❓ FAQs

**Q: How accurate is the skill extraction?**
A: Uses GPT-4o with strict extraction rules. Accuracy depends on resume quality and formatting.

**Q: Can I change my dream role after uploading resume?**
A: Yes, refresh the page and start over. Dream role analysis only runs once per session.

**Q: How often should I use this?**
A: Consider 30-day cycles. After completing a roadmap, upload your updated resume to get a new roadmap.

**Q: Is my data saved?**
A: No. All processing is done server-side for current session only. Resume data is not stored.

**Q: Can I use my own job posting?**
A: Currently limited to job title analysis. You can manually extract skills from a job posting and mention them as missing skills in your roadmap prompt.

