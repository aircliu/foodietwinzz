// Vercel Serverless Function — /api/instagram
// Fetches LIVE follower count. No hardcoded fallbacks.
// Strategy 1: Instagram public page (works from cloud IPs via bot UA)
// Strategy 2: BlastUp API fallback (works from residential IPs)

async function fetchFromInstagram() {
  const res = await fetch("https://www.instagram.com/foodietwinzz/", {
    headers: {
      "User-Agent": "facebookexternalhit/1.1",
      Accept: "text/html",
    },
  });

  if (!res.ok) return null;

  const html = await res.text();

  // Parse follower count from og:description meta tag
  // Format: "1,059 Followers, 1 Following, 2 Posts - ..."
  const match = html.match(/content="([\d,.]+[KMkm]?)\s*Followers?/i);
  if (!match) {
    console.log("Instagram: no follower match. Preview:", html.substring(0, 1500));
    return null;
  }

  let raw = match[1].replace(/,/g, "");

  // Handle K/M suffixes
  if (/k/i.test(raw)) {
    return Math.round(parseFloat(raw) * 1000);
  }
  if (/m/i.test(raw)) {
    return Math.round(parseFloat(raw) * 1000000);
  }

  const num = parseInt(raw, 10);
  return num > 0 && num < 1000000000 ? num : null;
}

async function fetchFromBlastUp() {
  // Step 1: GET page for CSRF token + cookies
  const pageRes = await fetch(
    "https://blastup.com/instagram-follower-count?foodietwinzz",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    }
  );

  if (!pageRes.ok) return null;

  const html = await pageRes.text();
  const tokenMatch = html.match(/token:\s*"([^"]+)"/);
  if (!tokenMatch) return null;

  const rawCookies = pageRes.headers.getSetCookie
    ? pageRes.headers.getSetCookie()
    : [];
  const cookies = rawCookies.map((c) => c.split(";")[0]).join("; ");

  // Step 2: POST to API
  const apiRes = await fetch("https://blastup.com/instagram-follower-count", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Referer: "https://blastup.com/instagram-follower-count?foodietwinzz",
      Cookie: cookies,
    },
    body: JSON.stringify({
      _token: tokenMatch[1],
      username: "foodietwinzz",
    }),
  });

  if (!apiRes.ok) return null;

  const data = await apiRes.json();
  return data.success && data.followers ? data.followers : null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
  res.setHeader("Content-Type", "application/json");

  try {
    let followers = null;
    let source = null;

    // Strategy 1: Instagram direct (works from cloud IPs)
    try {
      followers = await fetchFromInstagram();
      if (followers) source = "instagram";
    } catch (e) {
      console.log("Instagram fetch error:", e.message);
    }

    // Strategy 2: BlastUp fallback (works from residential IPs)
    if (!followers) {
      try {
        followers = await fetchFromBlastUp();
        if (followers) source = "blastup";
      } catch (e) {
        console.log("BlastUp fetch error:", e.message);
      }
    }

    if (!followers) {
      return res.status(200).json({ followers: null, error: "all_sources_failed" });
    }

    // Format the number
    let formatted;
    if (followers >= 1000000) formatted = (followers / 1000000).toFixed(1) + "M";
    else if (followers >= 10000) formatted = (followers / 1000).toFixed(1) + "K";
    else formatted = followers.toLocaleString();

    return res.status(200).json({
      followers,
      formatted,
      lastUpdated: new Date().toISOString(),
      source,
    });
  } catch (error) {
    console.log("Handler error:", error.message);
    return res.status(200).json({ followers: null, error: error.message });
  }
}
