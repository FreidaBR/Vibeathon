import { GoogleGenerativeAI } from '@google/generative-ai';
import { isDemoMode, MOCK_DREAM_ROLE } from './mockData.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

const DREAM_ROLE_ANALYSIS_PROMPT = `You are a career analysis expert with deep knowledge of current job market requirements. Analyze the given job title and provide ACCURATE, REALISTIC analysis based on 2024-2025 market data.

Return a JSON object with EXACTLY this structure:
{
  "role": "job title as provided",
  "level": "Entry/Mid/Senior/Lead",
  "summary": "concise description of primary responsibilities",
  "requiredSkills": ["skill1", "skill2"],
  "technicalSkills": ["tech1", "tech2"],
  "softSkills": ["soft1", "soft2"],
  "tools": ["tool1", "tool2"],
  "frameworks": ["framework1", "framework2"],
  "languages": ["language1", "language2"],
  "experience": "X-Y years",
  "avgSalary": "$X,000 - $Y,000 USD",
  "growthPath": "typical career progression"
}

ACCURACY REQUIREMENTS:
1. Base all recommendations on actual CURRENT job postings (2024-2025)
2. Include ONLY skills that are genuinely required/highly desired for this role
3. Distinguish between "must-have" vs "nice-to-have" technologies
4. Provide realistic salary ranges for US market (adjust if different region obvious)
5. Include both obvious and commonly-required skills (don't miss the obvious ones)

SKILL DEPTH:
- requiredSkills: 8-12 items - core competencies absolutely needed
- technicalSkills: 6-10 items - specific technical domains
- softSkills: 5-7 items - essential non-technical abilities
- tools: 6-10 items - actual tools/platforms used daily
- frameworks: Include version info when standard (e.g., "React 18+", "Python 3.10+")
- languages: Include versions for programming languages

REQUIREMENTS BY LEVEL:
- Entry: 0-2 years, simpler responsibilities, foundational skills
- Mid: 2-5 years, independent contributions, specialized skills
- Senior: 5-10 years, mentoring, architecture/design, strategic thinking
- Lead: 10+ years, team leadership, business impact, advanced skills

ACCURACY CHECKS:
- Skills must match actual job postings for this role
- Salary must reflect actual market rates
- Experience level progression must be realistic
- No skills invented or marginally relevant
- Growth path must reflect actual career trajectories

Return ONLY valid JSON. No markdown, no explanations. Triple-check accuracy.`;

export async function analyzeDreamRole(roleTitle) {
  if (!roleTitle || typeof roleTitle !== 'string' || roleTitle.trim().length === 0) {
    throw new Error('Invalid role title provided');
  }

  if (isDemoMode()) {
    // Return mock data for demo mode
    return {
      ...MOCK_DREAM_ROLE,
      role: roleTitle.trim(),
    };
  }

  const cleanTitle = roleTitle.trim();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${DREAM_ROLE_ANALYSIS_PROMPT}\n\nAnalyze this role: "${cleanTitle}"\n\nReturn ONLY valid JSON, no other text.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const content = response.response.text();
    if (!content) {
      throw new Error('No response from Gemini API');
    }

    let parsed;
    try {
      const clean = content.replace(/```json?\s*|\s*```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error('Failed to parse Gemini response:', e, 'Content:', content);
      throw new Error('Invalid AI response format');
    }

    // Validate and sanitize response
    return {
      role: parsed.role || cleanTitle,
      level: parsed.level || 'Mid',
      summary: parsed.summary || '',
      requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
      technicalSkills: Array.isArray(parsed.technicalSkills) ? parsed.technicalSkills : [],
      softSkills: Array.isArray(parsed.softSkills) ? parsed.softSkills : [],
      tools: Array.isArray(parsed.tools) ? parsed.tools : [],
      frameworks: Array.isArray(parsed.frameworks) ? parsed.frameworks : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
      experience: parsed.experience || 'Varies',
      avgSalary: parsed.avgSalary || 'Market dependent',
      growthPath: parsed.growthPath || '',
    };
  } catch (err) {
    console.error('Dream role analysis error:', err);
    throw new Error(err.message || 'Failed to analyze dream role');
  }
}

// Enhanced skill matching with synonyms and variations
const SKILL_SYNONYMS = {
  'react': ['react.js', 'react js', 'reactjs'],
  'vue': ['vue.js', 'vue js', 'vuejs'],
  'angular': ['angular.js', 'angularjs'],
  'node': ['node.js', 'nodejs'],
  'express': ['express.js', 'expressjs'],
  'django': ['django framework'],
  'flask': ['flask framework'],
  'python': ['py', 'python3', 'python 3'],
  'javascript': ['js', 'es6', 'es2020'],
  'typescript': ['ts'],
  'sql': ['mysql', 'postgresql', 'postgres', 'sql server', 'mariadb'],
  'nosql': ['mongodb', 'dynamodb', 'firebase', 'cassandra', 'couchdb'],
  'mongodb': ['mongo', 'nosql database'],
  'postgresql': ['postgres', 'psql'],
  'aws': ['amazon web services', 'amazon aws'],
  'gcp': ['google cloud', 'google cloud platform'],
  'azure': ['microsoft azure'],
  'docker': ['containerization', 'containers'],
  'kubernetes': ['k8s', 'container orchestration'],
  'git': ['version control', 'github', 'gitlab', 'bitbucket'],
  'rest api': ['restful api', 'rest apis'],
  'graphql': ['graph ql'],
  'agile': ['agile development', 'scrum', 'kanban', 'sprint'],
  'html': ['html5', 'semantic html'],
  'css': ['css3', 'sass', 'scss', 'less'],
  'tailwind': ['tailwindcss', 'tailwind css'],
  'bootstrap': ['bootstrap framework'],
  'junit': ['java unit testing'],
  'testing': ['unit testing', 'integration testing', 'test automation', 'jest', 'mocha'],
  'ci/cd': ['continuous integration', 'continuous deployment', 'github actions', 'jenkins', 'gitlab ci'],
};

function normalizeSkill(skill) {
  return skill.toLowerCase().trim();
}

function skillMatches(currentSkill, requiredSkill) {
  const current = normalizeSkill(currentSkill);
  const required = normalizeSkill(requiredSkill);

  // Exact match
  if (current === required) return true;

  // Check if one contains the other (minimum 4 chars to avoid false positives)
  if (current.length > 3 && required.length > 3) {
    if (current.includes(required) || required.includes(current)) {
      return true;
    }
  }

  // Check synonyms
  for (const [mainSkill, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    const mainNorm = normalizeSkill(mainSkill);
    if (current === mainNorm || required === mainNorm) {
      return (
        current === mainNorm ||
        synonyms.some((s) => normalizeSkill(s) === current) ||
        required === mainNorm ||
        synonyms.some((s) => normalizeSkill(s) === required)
      );
    }
  }

  return false;
}

export function calculateSkillGaps(currentSkills, dreamRoleRequirements) {
  const gaps = {
    missingTechnical: [],
    missingTools: [],
    missingFrameworks: [],
    missingLanguages: [],
    missingNonTechnical: [],
    matchedSkills: [],
    totalGaps: 0,
    matchPercentage: 0,
  };

  const currentSkillsLower = (currentSkills || []).map(normalizeSkill);

  const allRequired = [
    ...(dreamRoleRequirements.technicalSkills || []),
    ...(dreamRoleRequirements.tools || []),
    ...(dreamRoleRequirements.frameworks || []),
    ...(dreamRoleRequirements.languages || []),
    ...(dreamRoleRequirements.softSkills || []),
  ];

  // Check technical skills
  (dreamRoleRequirements.technicalSkills || []).forEach((skill) => {
    if (!currentSkillsLower.some((s) => skillMatches(s, skill))) {
      gaps.missingTechnical.push(skill);
      gaps.totalGaps++;
    } else {
      gaps.matchedSkills.push(skill);
    }
  });

  // Check tools
  (dreamRoleRequirements.tools || []).forEach((tool) => {
    if (!currentSkillsLower.some((s) => skillMatches(s, tool))) {
      gaps.missingTools.push(tool);
      gaps.totalGaps++;
    } else {
      gaps.matchedSkills.push(tool);
    }
  });

  // Check frameworks
  (dreamRoleRequirements.frameworks || []).forEach((framework) => {
    if (!currentSkillsLower.some((s) => skillMatches(s, framework))) {
      gaps.missingFrameworks.push(framework);
      gaps.totalGaps++;
    } else {
      gaps.matchedSkills.push(framework);
    }
  });

  // Check languages
  (dreamRoleRequirements.languages || []).forEach((lang) => {
    if (!currentSkillsLower.some((s) => skillMatches(s, lang))) {
      gaps.missingLanguages.push(lang);
      gaps.totalGaps++;
    } else {
      gaps.matchedSkills.push(lang);
    }
  });

  // Check soft skills
  (dreamRoleRequirements.softSkills || []).forEach((skill) => {
    if (!currentSkillsLower.some((s) => skillMatches(s, skill))) {
      gaps.missingNonTechnical.push(skill);
      gaps.totalGaps++;
    } else {
      gaps.matchedSkills.push(skill);
    }
  });

  // Calculate match percentage
  const totalRequired = Math.max(1, allRequired.length);
  gaps.matchPercentage = Math.round((gaps.matchedSkills.length / totalRequired) * 100);

  return gaps;
}
