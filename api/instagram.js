// Vercel Serverless Function — /api/instagram
// Fetches LIVE follower count from Instagram. No hardcoded fallbacks.

import https from "https";

function fetchInstagram() {
  return new Promise((resolve, reject) => {
    https.get(
      {
        hostname: "i.instagram.com",
        path: "/api/v1/users/web_profile_info/?username=foodietwinzz",
        headers: {
          "User-Agent": "Instagram 275.0.0.27.98 Android",
          "X-IG-App-ID": "936619743392459",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(data);
            resolve(j?.data?.user?.edge_followed_by?.count || null);
          } catch {
            resolve(null);
          }
        });
      }
    ).on("error", () => resolve(null));
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
  res.setHeader("Content-Type", "application/json");

  const followers = await fetchInstagram();

  if (followers) {
    let formatted;
    if (followers >= 1000000) formatted = (followers / 1000000).toFixed(1) + "M";
    else if (followers >= 10000) formatted = (followers / 1000).toFixed(1) + "K";
    else formatted = followers.toLocaleString();

    return res.status(200).json({
      followers,
      formatted,
      lastUpdated: new Date().toISOString(),
    });
  }

  console.log("Instagram fetch returned null");
  return res.status(200).json({ followers: null, error: "fetch_failed" });
}
