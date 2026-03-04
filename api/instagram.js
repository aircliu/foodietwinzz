// Vercel Serverless Function — /api/instagram
// Fetches live follower count from BlastUp
// CDN-cached for 1 hour, serves stale up to 24h if BlastUp is down

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 10000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    // Step 1: Fetch BlastUp page to get CSRF token + cookies
    const pageRes = await fetch(
      "https://blastup.com/instagram-follower-count?foodietwinzz",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
      }
    );
    if (!pageRes.ok) throw new Error(`BlastUp page ${pageRes.status}`);

    const html = await pageRes.text();
    const tokenMatch = html.match(/token:\s*"([^"]+)"/);
    if (!tokenMatch) throw new Error("No CSRF token found");

    // Parse cookies properly — use getSetCookie() if available (Node 18+),
    // otherwise fall back to raw header parsing that handles commas in cookie values
    let cookies;
    if (typeof pageRes.headers.getSetCookie === "function") {
      cookies = pageRes.headers
        .getSetCookie()
        .map((c) => c.split(";")[0].trim())
        .filter(Boolean)
        .join("; ");
    } else {
      // Fallback: get raw set-cookie and split carefully
      const raw = pageRes.headers.get("set-cookie") || "";
      // Split on ", " followed by a cookie name (word=) to avoid breaking on date commas
      cookies = raw
        .split(/,\s*(?=\w+=)/)
        .map((c) => c.split(";")[0].trim())
        .filter(Boolean)
        .join("; ");
    }

    // Step 2: POST to BlastUp API with token + cookies
    const apiRes = await fetch(
      "https://blastup.com/instagram-follower-count",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Referer:
            "https://blastup.com/instagram-follower-count?foodietwinzz",
          Cookie: cookies,
        },
        body: JSON.stringify({
          _token: tokenMatch[1],
          username: "foodietwinzz",
        }),
      }
    );
    if (!apiRes.ok) throw new Error(`BlastUp API ${apiRes.status}`);

    const data = await apiRes.json();
    if (!data.success || !data.followers)
      throw new Error(data.msg || "No follower data in response");

    // Cache for 5 minutes, serve stale up to 24 hours
    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=86400"
    );
    return res.json({
      followers: data.followers,
      formatted: formatCount(data.followers),
      lastUpdated: new Date().toISOString(),
      source: "blastup",
    });
  } catch (error) {
    // No static fallback — return error so the CDN serves stale cache instead
    // If there's no cached response, the client shows the last known value
    res.setHeader(
      "Cache-Control",
      "s-maxage=0, stale-while-revalidate=86400"
    );
    return res.status(502).json({
      followers: null,
      error: error.message,
      lastUpdated: new Date().toISOString(),
      source: "error",
    });
  }
}
