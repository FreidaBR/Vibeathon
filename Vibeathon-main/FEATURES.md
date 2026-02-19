# Features Guide

Detailed explanation of all Career Navigator features and how they work together.

## 🤖 Agentic AI System

Unlike traditional career advice tools, the Career Navigator uses **agentic AI reasoning** to:

1. **Observe** your current state (resume, skills)
2. **Reason** about the target state (dream role requirements)
3. **Plan** concrete steps to bridge the gap
4. **Execute** through personalized roadmap

This creates a dynamic system that adapts to your unique profile.

## Core Features

### 1. Dream Role Analysis

**What it does:**
- Takes a job title as input (e.g., "Data Scientist", "CTO")
- Uses OpenAI GPT-4o to analyze current market requirements
- Returns detailed job role profile with:
  - Experience level (Entry/Mid/Senior/Lead)
  - Required technical skills
  - Programming languages needed
  - Essential tools and frameworks
  - Soft skills and competencies
  - Average salary and career progression

**Why it matters:**
- Gives you concrete target to work toward
- Reflects real market demands, not generalized advice
- Identifies both technical and non-technical gaps

**How it works:**
```
User Input: "Full Stack Web Developer"
        ↓
GPT-4o Analysis Agent
        ↓
Market Intelligence (current job requirements)
        ↓
Output: {
  role: "Full Stack Web Developer",
  requiredSkills: ["RESTful APIs", "Database Design", ...],
  technicalSkills: ["Backend development", "Frontend development", ...],
  tools: ["Docker", "Git", "Kubernetes", ...],
  frameworks: ["React", "Node.js", "Express", ...],
  level: "Mid",
  experience: "2-4 years"
}
```

### 2. Resume Upload & Skill Extraction

**What it does:**
- Accepts PDF or Word documents
- Extracts text using industry-standard parsers
- Uses GPT-4o to categorize skills
- Returns structured skill profile matching dream role categories

**Extraction Categories:**
1. **Skills** - General abilities (Project Management, Problem Solving)
2. **Languages** - Programming + Natural languages
3. **Tools** - Software & platforms (Figma, Jira, Git, etc.)
4. **Frameworks** - Technical frameworks & methodologies
5. **Extracurricular** - Certifications, projects, volunteer work

**Why it matters:**
- Creates baseline of your current capabilities
- Enables skill gap analysis
- Feeds into roadmap personalization

**Accuracy Notes:**
- Only extracts explicitly mentioned skills
- No inference or guessing
- Quality depends on resume formatting
- Works with scanned text but not image-only PDFs

### 3. Skill Gap Analysis

**What it does:**
- Compares extracted resume skills with dream role requirements
- Identifies missing capabilities in each category
- Highlights matched skills
- Prioritizes gaps by importance for target role

**Gap Categories:**
```
Current Skills:     JavaScript, React, Node.js, HTML/CSS, Git
Dream Role Skills:  JavaScript, Python, React, Vue.js, Docker, Kubernetes, GraphQL

Gap Analysis:
  missingLanguages: [Python]
  missingFrameworks: [Vue.js, GraphQL]
  missingTools: [Docker, Kubernetes]
  matchedSkills: [JavaScript, React]
```

**Why it matters:**
- Prevents wasted time on skills you already have
- Focuses learning on highest-impact areas
- Creates personalized learning priorities

### 4. Profile Validation

**GitHub Integration:**
- Validates profile URL format
- Checks if account actually exists via GitHub API
- Retrieves optional stats (repos count, followers)
- Triggers portfolio-focused roadmap recommendations

**LinkedIn Integration:**
- Basic URL format validation
- Optional deep verification via Proxycurl API
- Enables networking-focused roadmap tasks

**Why it matters:**
- Prevents typos in profile URLs
- Provides confidence your profiles are accessible
- Enables networking and portfolio recommendations

### 5. Personalized 30-Day Roadmap

**What it does:**
- Generates 15 actionable milestones over ~30 days
- Prioritizes based on skill gaps identified
- References your actual tools and frameworks
- Includes GitHub/LinkedIn tasks if profiles validated

**Roadmap Structure:**

**Phase 1: Foundation (Days 1-7)**
- Learn highest-priority missing skills
- Focus on "Show vs Tell" - build proof of learning
- Example: If missing Python → "Build simple Python CLI tool"

**Phase 2: Integration (Days 8-15)**
- Build projects combining NEW + existing skills
- Creates portfolio pieces demonstrating gap closure
- Example: "Rebuild your React app backend in Node.js"

**Phase 3: Portfolio & Outreach (Days 16-22)**
- Update GitHub with enhanced projects
- If LinkedIn validated → write posts about learning
- Network with people in target role

**Phase 4: Job Applications (Days 23-30)**
- Target companies hiring for dream role
- Special focus on startups vs enterprises
- Interview preparation specific to role

**Each Milestone Includes:**
```
{
  "title": "Build Python API with FastAPI",
  "description": "Create a simple REST API using FastAPI (Python framework you need to learn). 
                  Expose 3 endpoints and deploy to Heroku. This bridges your Node.js 
                  knowledge to Python backend development.",
  "days": 4
}
```

**Why it matters:**
- Concrete, achievable goals (not vague advice)
- Time-bound (1-7 days per milestone)
- Builds portfolio while learning
- Adapts to YOUR specific skills, not generic path

### 6. Interactive Milestone Tracking

**What it does:**
- Displays roadmap as visual timeline
- Allows marking milestones as complete
- Shows progress with animations
- Celebration confetti on completion

**Features:**
- Checkboxes for each milestone
- Crossed-out styling for completed tasks
- Progress persistence (per session)
- Confetti animation on completion

**Why it matters:**
- Keeps you motivated with visual progress
- Provides accountability
- Creates celebration moments
- Helps track actual work done vs plan

### 7. Dark & Light Themes

**What it does:**
- Toggles between light (pastels) and dark (navy) themes
- Persists preference in localStorage
- Smooth animated transitions
- Different color palettes for accessibility

**Color Scheme:**

Light Theme:
- Background: Lavender, Peach, Yellow gradients
- Text: Dark gray/navy
- Accents: Orange (#F97316), Mint green (#34D399)

Dark Theme:
- Background: Navy, Charcoal gradients
- Text: Light gray/white
- Accents: Same vibrant orange and mint

**Why it matters:**
- Reduces eye strain (especially dark for night use)
- Improves accessibility
- Better visual distinction between light/dark environments

## Advanced Features

### Adaptive Roadmap Generation

The roadmap adapts based on:

1. **Experience Level** (from job title inference)
   - Junior dev → simpler problems first
   - Senior dev → leadership/architecture tasks

2. **Skill Gaps** (from analysis)
   - High-priority skills → earlier in roadmap
   - Easy-to-learn skills → build momentum early

3. **Profile Status** (GitHub/LinkedIn)
   - GitHub validated → portfolio tasks included
   - LinkedIn missing → networking in roadmap

4. **Existing Strengths**
   - Leverages what you know
   - Doesn't repeat already-learned skills

### Smart Skill Extraction

The system uses intelligent matching:
- Recognizes variations: "React JS" = "React", "JS" = "JavaScript"
- Extracts implied skills from context
- Avoids extracting non-technical terms
- Validates against common tools/frameworks list

### Reasoning about Growth Path

The roadmap understands:
```
If user is: Python Dev wanting Full Stack
Current: Python, Django, Flask
Target: Full Stack Developer

Then roadmap priorities:
  1. Frontend framework (React/Vue/Angular)
  2. Database design (SQL/NoSQL)
  3. Deployment (Docker, Cloud)
  4. DevOps basics
  5. System design

NOT things they already know:
  x Backend development
  x Database  queries
  x Python
```

## Integration Points

### How Features Connect

```
1. Dream Role Analysis
   ↓
2. Skill Gap Identified (what user needs)
   ↓
3. Resume Upload & Extract
   ↓
4. Skill Gap Comparison (current vs target)
   ↓
5. Profile Validation (GitHub/LinkedIn bonus)
   ↓
6. Roadmap Generation (using all above data)
   ↓
7. Milestone Tracking (user progress)
   ↓
Loop back: Update resume after 30 days
```

### API Feature Map

| Feature | Endpoint | Input | Output |
|---------|----------|-------|--------|
| Dream Role Analysis | `/api/analyze-dream-role` | Job title | Role requirements |
| Resume Extraction | `/api/upload` | PDF/Word file | Extracted skills |
| GitHub Validation | `/api/validate/github` | GitHub URL | Valid/Invalid + stats |
| LinkedIn Validation | `/api/validate/linkedin` | LinkedIn URL | Valid/Invalid status |
| Roadmap Generation | `/api/roadmap` | Skills + dream role | 15 milestones |
| Health Check | `/api/health` | None | Server + API status |

## Limitations & Edge Cases

### Known Limitations

1. **Resume Parsing**
   - Works best with text PDFs (not scanned images)
   - Formatting variations may cause issues
   - Some exotic fonts might confuse parser

2. **Dream Role Analysis**
   - Trained on typical job market
   - Niche roles may get generic analysis
   - Different roles with same title may vary

3. **Skill Matching**
   - Case-sensitive matching for technical terms
   - Acronyms need exact match (AI = not matched to Artificial Intelligence)

4. **Roadmap Timing**
   - Day estimates are guidelines, not guarantees
   - Complex topics may need more time
   - Your pace depends on experience

### Recommended Practices

1. **Before using:**
   - Clean up your resume formatting
   - Use standard font (Arial, Calibri, Times)
   - List skills explicitly (not hidden in descriptions)

2. **For best results:**
   - Use recent role titles from your dream job
   - Include both technical and soft skills in resume
   - Be specific about tools/versions used

3. **After roadmap:**
   - Follow milestones in order (build on each other)
   - Document your progress
   - Share learning on GitHub/LinkedIn for credibility

## Future Enhancements

Potential additions (not yet implemented):
- [ ] Batch resume upload for skill aggregation
- [ ] Multi-year roadmap with career progressions
- [ ] Integration with job boards for real postings
- [ ] AI code reviews for milestone projects
- [ ] Community benchmarking (compare with peers)
- [ ] Learning resource recommendations (courses, tutorials)
- [ ] Interview prep specialized for target role
- [ ] Salary negotiation guidance
