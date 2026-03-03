// Vercel Serverless Function — /api/instagram
// Scrapes LIVE follower count from blastup.com. No hardcoded fallbacks.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
  res.setHeader("Content-Type", "application/json");

  try {
    // Step 1: GET the page to grab the CSRF token and cookies
    const pageRes = await fetch(
      "https://blastup.com/instagram-follower-count?foodietwinzz",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    if (!pageRes.ok) {
      console.log("BlastUp page returned status:", pageRes.status);
      return res.status(200).json({ followers: null, error: "page_fetch_failed" });
    }

    const html = await pageRes.text();

    // Extract CSRF token from window.__config
    const tokenMatch = html.match(/token:\s*"([^"]+)"/);
    if (!tokenMatch) {
      console.log("Could not find CSRF token. HTML preview:", html.substring(0, 2000));
      return res.status(200).json({ followers: null, error: "no_token" });
    }

    const token = tokenMatch[1];

    // Grab cookies from page response
    const rawCookies = pageRes.headers.getSetCookie ? pageRes.headers.getSetCookie() : [];
    const cookies = rawCookies.map(c => c.split(";")[0]).join("; ");

    // Step 2: POST to the API with token and cookies
    const apiRes = await fetch("https://blastup.com/instagram-follower-count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: "https://blastup.com/instagram-follower-count?foodietwinzz",
        Cookie: cookies,
      },
      body: JSON.stringify({
        _token: token,
        username: "foodietwinzz",
      }),
    });

    if (!apiRes.ok) {
      console.log("BlastUp API returned status:", apiRes.status);
      return res.status(200).json({ followers: null, error: "api_fetch_failed" });
    }

    const data = await apiRes.json();

    if (!data.success || !data.followers) {
      console.log("BlastUp API returned:", JSON.stringify(data));
      return res.status(200).json({ followers: null, error: "api_no_data" });
    }

    const followers = data.followers;

    // Format the number
    let formatted;
    if (followers >= 1000000) formatted = (followers / 1000000).toFixed(1) + "M";
    else if (followers >= 10000) formatted = (followers / 1000).toFixed(1) + "K";
    else formatted = followers.toLocaleString();

    return res.status(200).json({
      followers,
      formatted,
      lastUpdated: new Date().toISOString(),
      source: "blastup",
    });
  } catch (error) {
    console.log("Instagram scrape error:", error.message);
    return res.status(200).json({ followers: null, error: error.message });
  }
}
