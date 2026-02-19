const LINKEDIN_URL_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]{3,100})\/?(\?.*)?$/i;

function extractUsername(url) {
  const m = url.trim().match(LINKEDIN_URL_REGEX);
  return m ? m[2] : null;
}

export async function validateLinkedIn(url) {
  const username = extractUsername(url);
  if (!username) {
    return {
      valid: false,
      error: 'Invalid LinkedIn URL. Use: https://linkedin.com/in/yourprofile',
      profileUrl: null,
    };
  }

  const profileUrl = `https://www.linkedin.com/in/${username}`;

  if (process.env.PROXYCURL_API_KEY) {
    return validateWithProxycurl(profileUrl);
  }

  return {
    valid: true,
    profileUrl,
    message: 'URL format is valid. Add PROXYCURL_API_KEY to verify profile exists.',
  };
}

async function validateWithProxycurl(profileUrl) {
  try {
    const params = new URLSearchParams({ url: profileUrl });
    const urlWithParams = `https://nubela.co/proxycurl/api/v2/linkedin?${params}`;

    const fetchRes = await fetch(urlWithParams, {
      headers: {
        Authorization: `Bearer ${process.env.PROXYCURL_API_KEY}`,
      },
    });

    if (fetchRes.status === 404 || fetchRes.status === 400) {
      const errData = await fetchRes.json().catch(() => ({}));
      return {
        valid: false,
        error: errData.message || 'LinkedIn profile not found or not accessible',
        profileUrl,
      };
    }

    if (!fetchRes.ok) {
      const errData = await fetchRes.json().catch(() => ({}));
      return {
        valid: false,
        error: errData.message || `Proxycurl error: ${fetchRes.status}`,
        profileUrl,
      };
    }

    const data = await fetchRes.json();
    return {
      valid: true,
      profileUrl,
      fullName: data.full_name,
      headline: data.headline,
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message || 'Failed to verify LinkedIn profile',
      profileUrl,
    };
  }
}
