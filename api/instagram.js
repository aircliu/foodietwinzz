// Vercel Serverless Function — /api/instagram
// Fetches live follower count from Instagram's web profile API
// CDN-cached for 5 minutes, serves stale up to 24h if API is down

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 10000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const apiRes = await fetch(
      "https://i.instagram.com/api/v1/users/web_profile_info/?username=foodietwinzz",
      {
        headers: {
          "User-Agent": "Instagram 275.0.0.27.98 Android",
          "X-IG-App-ID": "936619743392459",
        },
      }
    );
    if (!apiRes.ok) throw new Error(`Instagram API ${apiRes.status}`);

    const data = await apiRes.json();
    const count = data?.data?.user?.edge_followed_by?.count;
    if (count === undefined || count === null)
      throw new Error("No follower count in response");

    // Cache for 5 minutes, serve stale up to 24 hours
    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=86400"
    );
    return res.json({
      followers: count,
      formatted: formatCount(count),
      lastUpdated: new Date().toISOString(),
      source: "instagram",
    });
  } catch (error) {
    // No static fallback — return error so the CDN serves stale cache instead
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
