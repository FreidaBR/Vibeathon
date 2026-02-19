# API Keys Setup

The backend requires API keys for full functionality. Copy `server/env.example` to `server/.env` and add your keys.

## Required

### OpenAI API Key
- **Purpose**: Resume analysis (skill extraction) and AI-generated 30-day roadmap
- **Get it**: https://platform.openai.com/api-keys
- **Steps**: Sign up → API Keys → Create new secret key
- **Cost**: ~$0.02–0.05 per resume analysis (GPT-4o)
- **Variable**: `OPENAI_API_KEY=sk-...`

## Optional

### GitHub Token
- **Purpose**: Higher rate limit for GitHub profile validation (5000 req/hr vs 60 without)
- **Get it**: https://github.com/settings/tokens
- **Steps**: Generate new token (classic) → No scopes needed for public profile lookup
- **Variable**: `GITHUB_TOKEN=ghp_...`

### Proxycurl API Key
- **Purpose**: Verify LinkedIn profile actually exists (without it, only URL format is validated)
- **Get it**: https://nubela.co/proxycurl/
- **Variable**: `PROXYCURL_API_KEY=...`

## Quick Start

```bash
cd server
cp env.example .env
# Edit .env and add your OPENAI_API_KEY
```
