// Vercel Serverless Function — /api/followers
// Fetches live Instagram follower count every 10 minutes (cached at CDN).

const FALLBACK = 4650;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=30");

  try {
    const response = await fetch(
      "https://i.instagram.com/api/v1/users/web_profile_info/?username=foodietwinzz",
      {
        headers: {
          "User-Agent": "Instagram 275.0.0.27.98 Android",
          "X-IG-App-ID": "936619743392459",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const count = data?.data?.user?.edge_followed_by?.count;
      if (count && count > 0) {
        return res.status(200).json({ followers: count, source: "live" });
      }
    }
  } catch (e) {
    console.error("Instagram fetch failed:", e.message);
  }

  const fallback = parseInt(process.env.INSTAGRAM_FOLLOWERS || String(FALLBACK), 10);
  res.status(200).json({ followers: fallback, source: "fallback" });
}
