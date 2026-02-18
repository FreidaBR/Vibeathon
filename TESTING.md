# Testing Guide

Comprehensive testing guide for the Career Navigator application.

## Pre-Testing Setup

1. Ensure both servers are running:
   - Backend: http://localhost:3001
   - Frontend: http://localhost:5173

2. Check .env configuration:
   ```bash
   cat server/.env
   ```
   Must have `OPENAI_API_KEY` set to a valid key.

## Unit Tests

### 1. Health Check
**Test**: Backend is running and API keys are configured

```bash
curl http://localhost:3001/api/health
```

**Expected Response**:
```json
{
  "ok": true,
  "openai": true,
  "github": false,
  "proxycurl": false
}
```

### 2. Dream Role Analysis

**Test**: POST request with job title
```bash
curl -X POST http://localhost:3001/api/analyze-dream-role \
  -H "Content-Type: application/json" \
  -d '{"roleTitle":"Full Stack Developer"}'
```

**Expected Response** (should include):
```json
{
  "role": "Full Stack Developer",
  "level": "Mid",
  "summary": "...",
  "requiredSkills": [...],
  "technicalSkills": [...],
  "softSkills": [...],
  "tools": [...],
  "frameworks": [...]
}
```

### 3. Resume Upload

**Test**: Upload a PDF or Word document
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "resume=@path/to/resume.pdf"
```

**Expected Response** (should include):
```json
{
  "skills": ["Skill1", "Skill2"],
  "languages": ["Python", "JavaScript"],
  "tools": ["Git", "VS Code"],
  "frameworks": ["React", "Node.js"],
  "extracurricular": ["Certification", "Project"]
}
```

### 4. GitHub Validation

**Test**: Validate GitHub profile URL
```bash
curl -X POST http://localhost:3001/api/validate/github \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/torvalds"}'
```

**Expected Response**:
```json
{
  "valid": true,
  "username": "torvalds",
  "repos": 45,
  "followers": 100000
}
```

**Invalid URL:**
```bash
curl -X POST http://localhost:3001/api/validate/github \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/nonexistent-user-12345"}'
```

**Expected Response**:
```json
{
  "valid": false,
  "error": "GitHub profile not found"
}
```

### 5. LinkedIn Validation

**Test**: Validate LinkedIn profile URL
```bash
curl -X POST http://localhost:3001/api/validate/linkedin \
  -H "Content-Type: application/json" \
  -d '{"url":"https://linkedin.com/in/valid-profile"}'
```

**Expected Response**:
```json
{
  "valid": true,
  "profileUrl": "https://www.linkedin.com/in/valid-profile",
  "message": "URL format is valid..."
}
```

### 6. Roadmap Generation

**Test**: Generate roadmap with dream role
```bash
curl -X POST http://localhost:3001/api/roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "skills": {
      "skills": ["JavaScript", "React"],
      "languages": ["English"],
      "tools": ["Git"],
      "frameworks": ["React"],
      "extracurricular": []
    },
    "profileData": {
      "githubValid": true,
      "linkedInValid": false,
      "dreamRole": {
        "role": "Full Stack Developer",
        "technicalSkills": [...],
        "tools": [...]
      }
    }
  }'
```

**Expected Response**:
```json
{
  "milestones": [
    {
      "title": "Learn Python",
      "description": "Complete Python basics...",
      "days": 3
    },
    ...
  ]
}
```

## UI/UX Testing

### Test Scenario 1: Complete Workflow

1. **Open Application**
   - [ ] Load http://localhost:5173
   - [ ] Verify page loads without errors
   - [ ] Check Dark/Light theme toggle works

2. **Dream Role Analysis**
   - [ ] Enter "Product Manager" in role input
   - [ ] Click "Analyze" button
   - [ ] Wait for analysis (should take 5-10 seconds)
   - [ ] See success message
   - [ ] Button shows "Dream role analyzed!"

3. **Resume Upload**
   - [ ] Drag & drop a PDF or Word file
   - [ ] OR click to select file
   - [ ] See progress indicator
   - [ ] Verify skills are extracted
   - [ ] Check that skills appear in "Skill Analysis" section

4. **Validate Profiles**
   - [ ] Enter GitHub URL: https://github.com/your-username
   - [ ] Tab out or click away
   - [ ] Should show checkmark or error
   - [ ] Try LinkedIn URL: https://linkedin.com/in/your-profile
   - [ ] Should validate format

5. **View Roadmap**
   - [ ] Roadmap auto-scrolls into view
   - [ ] See 15 milestones
   - [ ] Each milestone has:
     - [ ] Title
     - [ ] Description
     - [ ] Days to complete
     - [ ] Checkbox to mark done
   - [ ] Click checkbox to mark milestone complete
   - [ ] See confetti animation
   - [ ] Milestone appears crossed out

### Test Scenario 2: Error Handling

1. **No Resume Upload**
   - [ ] Try to generate roadmap without resume
   - [ ] Should show error message

2. **Invalid Dream Role**
   - [ ] Try entering empty or whitespace-only role
   - [ ] Button should be disabled

3. **Invalid GitHub URL**
   - [ ] Try: https://github.com/invalid-user-99999
   - [ ] Should show error: "GitHub profile not found"

4. **Missing API Key**
   - [ ] Remove OPENAI_API_KEY from .env
   - [ ] Try to analyze dream role
   - [ ] Should show: "not configured" error

### Test Scenario 3: Responsiveness

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Verify:
- [ ] All text is readable
- [ ] Buttons are clickable
- [ ] Forms are usable
- [ ] No horizontal scroll

## Performance Testing

### Response Times
- Dream role analysis: < 30 seconds
- Resume upload: < 15 seconds
- Roadmap generation: < 20 seconds
- GitHub validation: < 5 seconds

### Test Large File
- [ ] Try 5MB PDF
- [ ] Should handle gracefully
- [ ] Try >5MB file
- [ ] Should reject with error

## Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)

## Network Testing

### Test Offline Scenario
1. Disconnect network
2. Try to upload resume
3. Should show: "Cannot reach server. Start the backend: ..."

### Test Backend Down
1. Stop backend server
2. Try any operation
3. Should show connection error

## Data Validation

### Resume with No Skills
- Upload a resume with no technical content
- Should show: empty or minimal skill arrays

### Nonsensical Dream Role
- Enter: "Xyz Abc Def"
- Should still try to analyze (AI will make reasonable attempt)

### Special Characters in URL
- GitHub: https://github.com/user-name_123
- Should validate correctly

## Accessibility Testing

- [ ] Tab through form elements - all focusable
- [ ] Dark mode accessibility - sufficient contrast
- [ ] Read roadmap with screen reader
- [ ] All icons have alt text / aria labels

## Security Testing

- [ ] Resume upload doesn't execute scripts
- [ ] Input fields sanitized against XSS
- [ ] API keys not exposed in network tab
- [ ] No sensitive data in browser console

## Final Checklist

Before deployment:
- [ ] All unit tests pass
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Dark/Light themes work
- [ ] Dream role → Resume → Roadmap workflow complete
- [ ] GitHub & LinkedIn validation work
- [ ] Error messages are helpful
- [ ] API key requirement clearly communicated

## Debugging Tips

### Enable Verbose Logging
Backend:
```bash
DEBUG=* npm run dev
```

Frontend (browser console):
```javascript
localStorage.setItem('debug', '*');
```

### Test with curl/Postman
Use provided curl commands to isolate API issues from UI issues.

### Check Network Tab
- Browser DevTools → Network tab
- Monitor all requests to /api/*
- Check response bodies for errors

### Monitor Server Logs
Terminal running backend:
- Watch for error messages
- Note API response times
- Check for OpenAI API errors

## Test Data (Example Resume)

Use this as a reference for manual testing:

```
JOHN DOE
john@example.com | github.com/johndoe | linkedin.com/in/johndoe

EXPERIENCE
Senior Software Engineer | Tech Corp | 2021-Present
- Built React-based dashboards using Redux
- Deployed Node.js microservices to AWS
- Led team of 3 engineers

Full Stack Developer | StartUp Inc | 2019-2021
- Developed Python Django backend APIs
- Created Vue.js frontend components
- Used PostgreSQL and MongoDB databases

SKILLS
Languages: JavaScript, Python, SQL, HTML/CSS
Frameworks: React, Node.js, Django, Vue.js
Tools: Git, Docker, Kubernetes, AWS, VS Code
Other: REST APIs, MongoDB, PostgreSQL, Agile

EDUCATION
B.S. Computer Science | University | 2019
```

Expected results:
- Languages: [JavaScript, Python, SQL]
- Tools: [Git, Docker, Kubernetes, AWS]
- Frameworks: [React, Node.js, Django, Vue.js]
