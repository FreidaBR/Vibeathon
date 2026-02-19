const GITHUB_URL_PATTERNS = [
  /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})\/?$/,
  /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?$/,
];

function extractUsername(url) {
  const cleaned = url.trim().toLowerCase();
  for (const regex of GITHUB_URL_PATTERNS) {
    const m = cleaned.match(regex);
    if (m) return m[2];
  }
  if (/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

export async function validateGitHub(url) {
  const username = extractUsername(url);
  if (!username) {
    return {
      valid: false,
      error: 'Invalid GitHub URL format. Use: https://github.com/username',
      username: null,
    };
  }

  const headers = {};
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    headers['X-GitHub-Api-Version'] = '2022-11-28';
  }

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      redirect: 'follow',
    });

    if (res.status === 404) {
      return {
        valid: false,
        error: 'GitHub profile not found',
        username,
      };
    }

    if (!res.ok) {
      if (res.status === 403) {
        return {
          valid: false,
          error: 'GitHub API rate limit exceeded. Try again later.',
          username,
        };
      }
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    return {
      valid: true,
      username: data.login,
      name: data.name,
      avatar: data.avatar_url,
      profileUrl: data.html_url,
    };
  } catch (err) {
    throw new Error(err.message || 'Failed to verify GitHub profile');
  }
}
