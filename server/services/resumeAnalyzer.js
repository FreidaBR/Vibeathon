import { createRequire } from 'module';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';
import { isDemoMode, MOCK_RESUME_SKILLS } from './mockData.js';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const COMPREHENSIVE_ANALYSIS_PROMPT = `You are an expert career coach and resume analyst. Perform a COMPLETE, in-depth analysis of the resume. Extract skills AND provide a thorough professional assessment.

Return a SINGLE JSON object with this EXACT structure:
{
  "skills": ["skill1", "skill2"],
  "languages": ["language1", "language2"],
  "tools": ["tool1", "tool2"],
  "frameworks": ["framework1", "framework2"],
  "extracurricular": ["activity1", "activity2"],
  "analysis": {
    "experienceLevel": "Junior|Mid|Senior|Lead",
    "professionalSummary": "2-3 sentence overview of their profile",
    "keyStrengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
    "areasForImprovement": ["area1", "area2", "area3"],
    "recommendations": ["specific actionable recommendation1", "recommendation2", "recommendation3"],
    "industryFit": ["industry1", "industry2"]
  }
}

SKILL EXTRACTION RULES:
1. skills, languages, tools, frameworks, extracurricular: Extract EXPLICITLY mentioned items only. Do NOT infer.
2. analysis.experienceLevel: Infer from job titles, years of experience (Junior 0-2yr, Mid 2-5yr, Senior 5-10yr, Lead 10+).
3. analysis.professionalSummary: Concise, professional 2-3 sentence summary.
4. analysis.keyStrengths: 4-5 standout attributes based on experience, skills, and achievements.
5. analysis.areasForImprovement: 2-4 constructive areas to develop (specific, actionable).
6. analysis.recommendations: 3 specific, actionable next steps for career growth.
7. analysis.industryFit: 2-3 industries/roles they're well-suited for.

CRITICAL - Maximum Accuracy Rules:
- If uncertain, EXCLUDE rather than guess
- Return empty array [] for categories with no clear mention
- Use exact wording from resume
- Do NOT normalize or standardize names
- Do NOT add related skills user might have
- Every item MUST be traceable to resume text
- Do NOT include acronyms without explanation if not in resume
- If resume says "React JS", write "React JS" not "React"

Return ONLY valid JSON, no other text. Triple-check accuracy before responding.`;

function extractSkillsFromText(text) {
  const lowerText = text.toLowerCase();
  const found = {
    skills: [],
    languages: [],
    tools: [],
    frameworks: [],
    extracurricular: [],
  };

  // More flexible skill matching with word boundaries and variations
  const skillPatterns = {
    frameworks: [
      { name: 'React', patterns: ['react(\\.js)?', 'reactjs'] },
      { name: 'Vue', patterns: ['vue(\\.js)?', 'vuejs'] },
      { name: 'Angular', patterns: ['angular(\\.js)?', 'angularjs'] },
      { name: 'Django', patterns: ['django'] },
      { name: 'Flask', patterns: ['flask'] },
      { name: 'Spring', patterns: ['spring(\\s+boot)?'] },
      { name: 'Express', patterns: ['express(\\.js)?', 'expressjs'] },
      { name: 'Next.js', patterns: ['next(\\.js)?', 'nextjs'] },
      { name: 'Laravel', patterns: ['laravel'] },
      { name: 'FastAPI', patterns: ['fastapi'] },
      { name: 'NestJS', patterns: ['nestjs', 'nest(\\.js)?'] },
    ],
    languages: [
      { name: 'Python', patterns: ['\\bpython\\b', 'python\\s+\\d'] },
      { name: 'JavaScript', patterns: ['\\bjavascript\\b', 'js\\b'] },
      { name: 'TypeScript', patterns: ['\\btypescript\\b', 'ts\\b'] },
      { name: 'Java', patterns: ['\\bjava\\b'] },
      { name: 'C++', patterns: ['c\\+\\+', 'cpp'] },
      { name: 'C#', patterns: ['c#', 'csharp'] },
      { name: 'PHP', patterns: ['\\bphp\\b'] },
      { name: 'Ruby', patterns: ['\\bruby\\b'] },
      { name: 'Go', patterns: ['\\bgo\\b', 'golang'] },
      { name: 'Rust', patterns: ['\\brust\\b'] },
      { name: 'Swift', patterns: ['\\bswift\\b'] },
      { name: 'SQL', patterns: ['\\bsql\\b'] },
      { name: 'HTML', patterns: ['\\bhtml\\b', 'html\\s*\\d'] },
      { name: 'CSS', patterns: ['\\bcss\\b', 'css\\s*\\d'] },
    ],
    tools: [
      { name: 'Git', patterns: ['\\bgit\\b', 'github', 'gitlab'] },
      { name: 'Docker', patterns: ['\\bdocker\\b'] },
      { name: 'Kubernetes', patterns: ['kubernetes', 'k8s'] },
      { name: 'AWS', patterns: ['\\baws\\b', 'amazon\\s+(web\\s+)?services'] },
      { name: 'Azure', patterns: ['\\bazure\\b'] },
      { name: 'GCP', patterns: ['\\bgcp\\b', 'google\\s+cloud'] },
      { name: 'Jenkins', patterns: ['\\bjenkins\\b'] },
      { name: 'Jira', patterns: ['\\bjira\\b'] },
      { name: 'VS Code', patterns: ['vs\\s+code', 'visual\\s+studio\\s+code', 'vscode'] },
      { name: 'Git', patterns: ['\\bgit\\b'] },
      { name: 'npm', patterns: ['\\bnpm\\b'] },
      { name: 'Figma', patterns: ['\\bfigma\\b'] },
    ],
    softSkills: [
      { name: 'Leadership', patterns: ['leadership', 'leader'] },
      { name: 'Communication', patterns: ['communication'] },
      { name: 'Problem Solving', patterns: ['problem[\\s-]solving', 'problem[\\s-]solver'] },
      { name: 'Teamwork', patterns: ['teamwork', 'team\\s+player'] },
      { name: 'Project Management', patterns: ['project\\s+management'] },
      { name: 'Agile', patterns: ['\\bagile\\b'] },
      { name: 'Scrum', patterns: ['\\bscrum\\b'] },
    ],
  };

  // Function to check if any pattern matches
  function findMatches(category, patterns) {
    return patterns
      .filter(item => {
        for (const pattern of item.patterns) {
          const regex = new RegExp(`\\b${pattern}\\b`, 'i');
          if (regex.test(lowerText)) {
            return true;
          }
        }
        return false;
      })
      .map(item => item.name);
  }

  found.frameworks = findMatches('frameworks', skillPatterns.frameworks);
  found.languages = findMatches('languages', skillPatterns.languages);
  found.tools = findMatches('tools', skillPatterns.tools);
  found.skills = findMatches('softSkills', skillPatterns.softSkills);

  // Look for certifications in typical format
  const certPatterns = [
    /(?:certified|certification|aws certified|azure certified|aws|azure|gcp)[^\n.]{0,50}/gi,
  ];
  for (const pattern of certPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      found.extracurricular.push(...matches.slice(0, 3).map(m => m.trim()));
    }
  }

  // Remove duplicates
  found.skills = [...new Set(found.skills)];
  found.languages = [...new Set(found.languages)];
  found.tools = [...new Set(found.tools)];
  found.frameworks = [...new Set(found.frameworks)];
  found.extracurricular = [...new Set(found.extracurricular)];

  // If nothing found, return mock data
  if (Object.values(found).every(arr => arr.length === 0)) {
    console.log('[DEBUG] No skills found in resume text, returning mock data');
    return MOCK_RESUME_SKILLS;
  }

  return found;
}

export async function extractTextFromResume(buffer, mimetype) {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdf(buffer);
      return data?.text || '';
    }
    if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result?.value || '';
    }
    throw new Error('Unsupported file type. Use PDF or Word (.doc, .docx)');
  } catch (err) {
    if (err?.message?.includes('Unsupported')) throw err;
    console.error('Text extraction error:', err?.message || err);
    throw new Error(`Could not read file: ${err?.message || 'Try a different PDF or Word document'}`);
  }
}

export async function analyzeResume(buffer, mimetype) {
  const rawText = await extractTextFromResume(buffer, mimetype);

  if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 20) {
    throw new Error('Could not extract meaningful text from the resume. Try a different file or ensure it is not scanned/image-only.');
  }

  const addAnalysis = (extracted) => {
    extracted.analysis = {
      experienceLevel: 'Mid',
      professionalSummary: 'Your resume has been analyzed. Review your extracted skills and use the personalized roadmap below to advance your career.',
      keyStrengths: extracted.skills?.slice(0, 4) || [],
      areasForImprovement: ['Expand technical certifications', 'Add quantified achievements to experience', 'Highlight leadership examples'],
      recommendations: ['Update your portfolio with recent projects', 'Connect with professionals in your target industry', 'Consider contributing to open-source projects'],
      industryFit: extracted.frameworks?.length ? ['Software Development', 'Web Development'] : ['General Tech', 'Product Roles'],
    };
    return extracted;
  };

  if (isDemoMode()) {
    return addAnalysis(extractSkillsFromText(rawText));
  }

  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn('GOOGLE_GEMINI_API_KEY not set, using local analysis');
    return addAnalysis(extractSkillsFromText(rawText));
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `${COMPREHENSIVE_ANALYSIS_PROMPT}\n\n--- RESUME TEXT ---\n${rawText.slice(0, 12000)}\n--- END ---\n\nReturn ONLY valid JSON, no other text.`
        }]
      }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
    });

    const content = response?.response?.text?.();
    if (!content) throw new Error('No analysis result from AI');

    let parsed;
    try {
      const clean = content.replace(/```json?\s*|\s*```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      throw new Error('Invalid AI response format');
    }

    const result = {
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
      tools: Array.isArray(parsed.tools) ? parsed.tools : [],
      frameworks: Array.isArray(parsed.frameworks) ? parsed.frameworks : [],
      extracurricular: Array.isArray(parsed.extracurricular) ? parsed.extracurricular : [],
    };

    if (parsed.analysis && typeof parsed.analysis === 'object') {
      result.analysis = {
        experienceLevel: parsed.analysis.experienceLevel || 'Mid',
        professionalSummary: parsed.analysis.professionalSummary || '',
        keyStrengths: Array.isArray(parsed.analysis.keyStrengths) ? parsed.analysis.keyStrengths : [],
        areasForImprovement: Array.isArray(parsed.analysis.areasForImprovement) ? parsed.analysis.areasForImprovement : [],
        recommendations: Array.isArray(parsed.analysis.recommendations) ? parsed.analysis.recommendations : [],
        industryFit: Array.isArray(parsed.analysis.industryFit) ? parsed.analysis.industryFit : [],
      };
    } else {
      result.analysis = {
        experienceLevel: 'Mid',
        professionalSummary: 'Profile analyzed from resume.',
        keyStrengths: [],
        areasForImprovement: [],
        recommendations: [],
        industryFit: [],
      };
    }

    return result;
  } catch (aiErr) {
    console.warn('AI analysis failed, falling back to local extraction:', aiErr.message);
    return addAnalysis(extractSkillsFromText(rawText));
  }
}
