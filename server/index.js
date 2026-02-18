import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import { analyzeResume } from './services/resumeAnalyzer.js';
import { generateRoadmap } from './services/roadmapGenerator.js';
import { validateGitHub } from './services/githubValidator.js';
import { validateLinkedIn } from './services/linkedinValidator.js';
import { analyzeDreamRole } from './services/dreamRoleAnalyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  },
});

app.post('/api/upload', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: err.message || 'Invalid file. Use PDF or Word, max 5MB.' });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file provided' });
    }
    const result = await analyzeResume(req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (err) {
    console.error('Upload error:', err?.message || err);
    const msg = err?.message || 'Failed to analyze resume';
    res.status(500).json({ error: msg });
  }
});

app.post('/api/roadmap', async (req, res) => {
  try {
    const { skills, profileData } = req.body;
    if (!skills) {
      return res.status(400).json({ error: 'Skills data is required' });
    }
    const roadmap = await generateRoadmap(skills, profileData || {});
    res.json({ milestones: roadmap });
  } catch (err) {
    console.error('Roadmap error:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate roadmap',
    });
  }
});

app.post('/api/validate/github', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }
    const result = await validateGitHub(url.trim());
    res.json(result);
  } catch (err) {
    console.error('GitHub validation error:', err);
    res.status(500).json({
      valid: false,
      error: err.message || 'Validation failed',
    });
  }
});

app.post('/api/validate/linkedin', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'LinkedIn URL is required' });
    }
    const result = await validateLinkedIn(url.trim());
    res.json(result);
  } catch (err) {
    console.error('LinkedIn validation error:', err);
    res.status(500).json({
      valid: false,
      error: err.message || 'Validation failed',
    });
  }
});

app.post('/api/analyze-dream-role', async (req, res) => {
  try {
    const { roleTitle } = req.body;
    if (!roleTitle || typeof roleTitle !== 'string') {
      return res.status(400).json({ error: 'Role title is required' });
    }
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Dream role analysis is not configured. Add GOOGLE_GEMINI_API_KEY to .env',
      });
    }
    const result = await analyzeDreamRole(roleTitle.trim());
    res.json(result);
  } catch (err) {
    console.error('Dream role analysis error:', err);
    res.status(500).json({
      error: err.message || 'Failed to analyze dream role',
    });
  }
});

app.get('/api/health', (_, res) => {
  res.json({
    ok: true,
    gemini: !!process.env.GOOGLE_GEMINI_API_KEY,
    github: !!process.env.GITHUB_TOKEN,
    proxycurl: !!process.env.PROXYCURL_API_KEY,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn('⚠️  GOOGLE_GEMINI_API_KEY not set - resume analysis & roadmap will fail');
  }
});
