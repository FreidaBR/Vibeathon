import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateSkillGaps } from './dreamRoleAnalyzer.js';
import { isDemoMode, MOCK_ROADMAP } from './mockData.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Helper function to generate personalized roadmap from extracted skills (demo mode)
function generatePersonalizedRoadmapFromSkills(currentSkills) {
  const allSkills = [
    ...(currentSkills.frameworks || []),
    ...(currentSkills.languages || []),
    ...(currentSkills.tools || []),
  ].filter(s => s && s.trim());

  const skillsText = allSkills.length > 0 ? allSkills.join(', ') : 'foundational web development';
  
  const milestones = [
    {
      title: 'Update GitHub portfolio with projects',
      description: `Add your latest work using ${allSkills.slice(0, 2).join(', ')} to your GitHub. Document project architecture and technologies used.`,
      days: 2,
    },
    {
      title: 'Create updated resume with resume',
      description: `Add ${allSkills.length > 0 ? allSkills.join(', ') : 'new technologies'} to your resume. Include recent projects and achievements.`,
      days: 2,
    },
    {
      title: 'Optimize LinkedIn profile',
      description: `Update headline, about section, and projects. Add ${allSkills.slice(0, 1).join('')} as featured skill.`,
      days: 1,
    },
    {
      title: 'Build practice project',
      description: `Create a small project using ${allSkills.slice(0, 2).join(' and ')} to strengthen portfolio.`,
      days: 3,
    },
    {
      title: 'Research target companies',
      description: 'Identify 20 companies hiring for your skill set. Follow their tech blogs and learn their tech stack.',
      days: 2,
    },
    {
      title: 'Contribute to open source',
      description: `Find ${allSkills[0] || 'relevant'} projects on GitHub. Make 2-3 meaningful contributions.`,
      days: 4,
    },
    {
      title: 'Network with professionals',
      description: 'Connect with 15 professionals in your field on LinkedIn. Personalize each message.',
      days: 3,
    },
    {
      title: 'Practice interview questions',
      description: 'Prepare answers for behavioral and technical questions specific to your skill set.',
      days: 3,
    },
    {
      title: 'Polish cover letters',
      description: 'Write 5 tailored cover letters for target roles. Highlight relevant projects.',
      days: 2,
    },
    {
      title: 'Study system design',
      description: 'If aiming for senior role, practice system design interviews relevant to your tech stack.',
      days: 3,
    },
    {
      title: 'Apply to job postings',
      description: 'Apply to 15 positions matching your skills. Track applications and follow ups.',
      days: 3,
    },
    {
      title: 'Prepare technical demo',
      description: 'Build a live demo of your best project highlighting ${allSkills[0]} implementation.',
      days: 2,
    },
    {
      title: 'Schedule informational interviews',
      description: 'Connect with 5 people in roles you aspire to. Ask about career path and skills needed.',
      days: 2,
    },
    {
      title: 'Review and refine portfolio',
      description: 'Ensure all portfolio items have clear documentation, README, and live links.',
      days: 1,
    },
    {
      title: 'Follow up on applications',
      description: 'Send follow-up emails to companies after applications. Show continued interest.',
      days: 1,
    },
  ];

  return milestones;
}

// Helper function to generate Demo roadmap with specific skill gaps
function generateDemoRoadmapWithGaps(skillGaps, dreamRole, currentSkills) {
  const baseSkills = [
    ...(currentSkills.frameworks || []),
    ...(currentSkills.languages || []),
  ].filter(s => s && s.trim()).slice(0, 2);

  const missingFrameworks = skillGaps.missingFrameworks.slice(0, 2);
  const missingLanguages = skillGaps.missingLanguages.slice(0, 2);
  
  const milestones = [
    {
      title: `Learn ${missingFrameworks[0] || 'new framework'}`,
      description: `${missingFrameworks[0] || 'Learn a new framework'} is required for ${dreamRole.role}. Complete tutorials and build 2 practice projects. Time: 7-10 days.`,
      days: 5,
    },
    {
      title: 'Master missing backend skills',
      description: `${missingLanguages[0] ? 'Learn ' + missingLanguages[0] : 'Strengthen backend skills'} needed for this role. Complete online course, focus on practical applications.`,
      days: 4,
    },
    {
      title: 'Build full-stack demo project',
      description: `Combine your ${baseSkills.join(' + ')} knowledge with new ${missingFrameworks[0] ? missingFrameworks[0] + ' ' : ''}skills. Create production-ready project for portfolio.`,
      days: 5,
    },
    {
      title: 'Deploy to cloud platform',
      description: 'Deploy your project to AWS, Azure, or Google Cloud. Practice CI/CD pipeline setup.',
      days: 3,
    },
    {
      title: 'Write technical blog post',
      description: 'Document your learning journey. Write about challenges faced and solutions implemented.',
      days: 2,
    },
    {
      title: 'Contribute to open source',
      description: `Find open-source projects using ${missingFrameworks[0] || 'your target tech'}. Make meaningful contributions.`,
      days: 3,
    },
    {
      title: 'Prepare technical interview',
      description: `Study algorithms, system design, and ${dreamRole.role}-specific questions. Mock interview with peer.`,
      days: 4,
    },
    {
      title: 'Research companies hiring for role',
      description: 'Identify 25 companies hiring for this role. Analyze their tech stack and requirements.',
      days: 2,
    },
    {
      title: 'Network in tech community',
      description: `Join Discord/Slack communities focused on ${missingFrameworks[0] || 'your tech stack'}. Engage daily.`,
      days: 3,
    },
    {
      title: 'Polish GitHub presence',
      description: 'Update all repos with READMEs, descriptions, and live demos. Pin best projects.',
      days: 2,
    },
    {
      title: 'Tailor resume for target role',
      description: `Highlight projects and skills relevent to ${dreamRole.role}. Include metrics and accomplishments.`,
      days: 1,
    },
    {
      title: 'Write targeted cover letters',
      description: 'Customize cover letters for top 5 positions. Reference their tech stack and values.',
      days: 2,
    },
    {
      title: 'Apply to positions',
      description: 'Submit applications to 20+ positions. Follow up after 1 week if no response.',
      days: 2,
    },
    {
      title: 'Schedule interviews',
      description: 'Once invitations come, prepare thoroughly. Do mock interviews and company research.',
      days: 3,
    },
    {
      title: 'Negotiate offer',
      description: 'Research market rates. Prepare to negotiate salary, benefits, and role scope professionally.',
      days: 1,
    },
  ];

  return milestones;
}

const ROADMAP_PROMPT_BASE = `You are an expert career coach. Create a personalized 30-day career roadmap based STRICTLY on the resume data provided.

CRITICAL RULES - FOLLOW EXACTLY:
1. Base EVERY milestone on the person's ACTUAL skills, tools, frameworks, and experience from the data. Never suggest generic tasks.
2. A frontend developer with React experience gets React-specific tasks. A data analyst gets analytics tasks. Match advice to their real skills.
3. Infer experience level from job titles and years. Junior vs senior get different milestone difficulty.
4. If they have GitHub validated: include repo/portfolio tasks. If LinkedIn: include networking tasks.
5. Return: { "milestones": [ {...}, {...} ] } with EXACTLY 15 milestones.
6. Each: { "title": "short action", "description": "specific how-to", "days": 1-7 }
7. Total days ~30. Order: resume/portfolio first, then outreach, applications, interview prep.
8. Milestones must be concrete and achievable. Reference their actual tools (e.g., "Update your React projects on GitHub" if they use React).

Return ONLY valid JSON. No markdown. If resumeAnalysis is provided (experienceLevel, keyStrengths, areasForImprovement, recommendations), use it to tailor milestones.`;

const ROADMAP_WITH_DREAM_ROLE_PROMPT = `You are an expert career coach creating a HYPER-PERSONALIZED 30-day learning roadmap. Your goal is to bridge the gap between the user's current skills and their dream role with 100% accuracy and maximum effectiveness.

CRITICAL REQUIREMENTS FOR ACCURACY:
1. READ skillGaps data carefully - these are CALCULATED, NOT estimated
2. Order milestones by IMPACT: High-value gaps first (affect job prospects most)
3. Each milestone should build on previous learning
4. Reference ACTUAL missing skills from skillGaps, not generic advice
5. Be specific: "Learn Python basics" → "Complete Python Fundamentals on Codecademy (3 days)"
6. Include realistic time estimates (verify they sum to ~30 days total)

MILESTONE PRIORITIZATION (in order):
1. High-priority technical gaps (Days 1-7): Most impactful for landing dream role
2. Popular framework/tool gaps (Days 8-12): Common requirements with payoff
3. Project building (Days 13-20): Combine learned + existing skills for portfolio
4. Portfolio enhancement (Days 21-25): GitHub, profile updates
5. Networking & applications (Days 26-30): LinkedIn, outreach, job applications

ACCURACY RULES:
- Reference exact skills from skillGaps data provided
- If user has GitHub: include specific portfolio tasks
- If user has LinkedIn: include specific networking tasks  
- If user already has a framework: leverage it (don't repeat)
- Experience level matters: Junior gets basics first, Senior gets advanced
- Days per milestone realistic: 1-7, average 2

SKILL-SPECIFIC GUIDANCE:
- Missing frontend framework? Build visible project using it
- Missing backend? Create API with that tech
- Missing database? Include database design task
- Missing deployment/DevOps? Include cloud deployment
- Missing soft skills? Include portfolio/communication tasks

Return: { "milestones": [...] } with EXACTLY 15 milestones.
Each milestone: { "title": "short action (5 words max)", "description": "specific, detailed how-to", "days": 1-7 }

NO GENERIC ADVICE. Every task must be traceable to their specific gaps and current skills.
Return ONLY valid JSON. No markdown.`;

export async function generateRoadmap(skills, profileData = {}) {
  const context = {
    currentSkills: {
      skills: skills.skills || [],
      languages: skills.languages || [],
      tools: skills.tools || [],
      frameworks: skills.frameworks || [],
      extracurricular: skills.extracurricular || [],
    },
    resumeAnalysis: skills.analysis || null,
    profileInfo: {
      hasGitHub: !!profileData.githubValid,
      hasLinkedIn: !!profileData.linkedInValid,
    },
  };

  let fullContext = { ...context };
  let prompt = ROADMAP_PROMPT_BASE;

  // If demo mode and no dream role, generate basic roadmap from current skills
  if (isDemoMode() && (!profileData.dreamRole || Object.keys(profileData.dreamRole).length === 0)) {
    return generatePersonalizedRoadmapFromSkills(context.currentSkills);
  }

  // If dream role is provided, include detailed gap analysis
  if (profileData.dreamRole && Object.keys(profileData.dreamRole).length > 0) {
    const allCurrentSkills = [
      ...(skills.skills || []),
      ...(skills.languages || []),
      ...(skills.tools || []),
      ...(skills.frameworks || []),
    ];

    const skillGaps = calculateSkillGaps(allCurrentSkills, profileData.dreamRole);
    
    fullContext.dreamRole = profileData.dreamRole;
    fullContext.skillGaps = {
      shortSummary: `
SKILL GAP ANALYSIS:
- Match Level: ${skillGaps.matchPercentage}% of required skills already acquired
- Total Gaps: ${skillGaps.totalGaps} skills to develop
- Missing Technical Skills: ${skillGaps.missingTechnical.length} (${skillGaps.missingTechnical.join(', ')})
- Missing Frameworks: ${skillGaps.missingFrameworks.length} (${skillGaps.missingFrameworks.join(', ')})
- Missing Tools: ${skillGaps.missingTools.length} (${skillGaps.missingTools.join(', ')})
- Missing Languages: ${skillGaps.missingLanguages.length} (${skillGaps.missingLanguages.join(', ')})
- Missing Soft Skills: ${skillGaps.missingNonTechnical.length} (${skillGaps.missingNonTechnical.join(', ')})
- Already Matched: ${skillGaps.matchedSkills.length} skills (${skillGaps.matchedSkills.join(', ')})
      `.trim(),
      detailed: skillGaps,
    };
    
    prompt = ROADMAP_WITH_DREAM_ROLE_PROMPT;
    
    // If in demo mode, generate personalized roadmap without AI
    if (isDemoMode()) {
      return generateDemoRoadmapWithGaps(skillGaps, profileData.dreamRole, context.currentSkills);
    }
  }

  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn('GOOGLE_GEMINI_API_KEY not set, using local roadmap');
    if (fullContext.dreamRole) {
      const skillGaps = calculateSkillGaps(
        [...(skills.skills || []), ...(skills.languages || []), ...(skills.tools || []), ...(skills.frameworks || [])],
        fullContext.dreamRole
      );
      return generateDemoRoadmapWithGaps(skillGaps, fullContext.dreamRole, context.currentSkills);
    }
    return generatePersonalizedRoadmapFromSkills(context.currentSkills);
  }

  const contextStr = JSON.stringify(fullContext, null, 2);

  try {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const response = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{
        text: `${prompt}\n\n--- USER PROFILE DATA ---\n${contextStr}\n--- END ---\n\nReturn ONLY valid JSON with exactly 15 milestones. No other text.`
      }]
    }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 3000 }
  });

  const content = response.response.text();
  if (!content) throw new Error('No roadmap from AI');

  let parsed;
  try {
    const clean = content.replace(/```json?\s*|\s*```/g, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    throw new Error('Invalid roadmap format');
  }

  let milestones = parsed.milestones || parsed.items || parsed;
  if (!Array.isArray(milestones)) milestones = [];

  // Validate and clean milestone data
  return milestones.slice(0, 15).map((m, idx) => ({
    title: (m.title || 'Task').substring(0, 80),
    description: (m.description || '').substring(0, 500),
    days: Math.min(7, Math.max(1, parseInt(m.days, 10) || 2)),
  }));
  } catch (err) {
    console.warn('AI roadmap failed, falling back to local:', err?.message);
    if (fullContext.dreamRole) {
      const skillGaps = calculateSkillGaps(
        [...(skills.skills || []), ...(skills.languages || []), ...(skills.tools || []), ...(skills.frameworks || [])],
        fullContext.dreamRole
      );
      return generateDemoRoadmapWithGaps(skillGaps, fullContext.dreamRole, context.currentSkills);
    }
    return generatePersonalizedRoadmapFromSkills(context.currentSkills);
  }
}
