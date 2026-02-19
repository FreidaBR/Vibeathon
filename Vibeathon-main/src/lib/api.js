const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('fetch') || msg.includes('Network') || msg.includes('Connection')) {
      throw new Error('Cannot reach server. Start the backend: in the "server" folder run "npm run dev"');
    }
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed: ${res.status}`;
    if (res.status >= 502 && res.status <= 504) {
      throw new Error(`${msg} — Is the backend running? Start it with: cd server && npm run dev`);
    }
    throw new Error(msg);
  }
  return data;
}

export async function uploadResume(file) {
  const form = new FormData();
  form.append('resume', file);
  return request('/upload', {
    method: 'POST',
    body: form,
  });
}

export async function generateRoadmap(skills, profileData = {}) {
  return request('/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills, profileData }),
  });
}

export async function validateGitHub(url) {
  return request('/validate/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
}

export async function validateLinkedIn(url) {
  return request('/validate/linkedin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
}

export async function analyzeDreamRole(roleTitle) {
  return request('/analyze-dream-role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roleTitle }),
  });
}

export async function healthCheck() {
  return request('/health');
}
