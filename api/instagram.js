// Vercel Edge Function — /api/instagram
// Scrapes LIVE follower count from blastup.com. No hardcoded fallbacks.

export const config = { runtime: "edge" };

export default async function handler(request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
    "Content-Type": "application/json",
  };

  try {
    // Step 1: GET page for CSRF token + cookies
    const pageRes = await fetch(
      "https://blastup.com/instagram-follower-count?foodietwinzz",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
          Connection: "keep-alive",
        },
      }
    );

    if (!pageRes.ok) {
      console.log("BlastUp page status:", pageRes.status);
      return new Response(
        JSON.stringify({ followers: null, error: "page_fetch_failed", status: pageRes.status }),
        { headers }
      );
    }

    const html = await pageRes.text();

    // Extract CSRF token
    const tokenMatch = html.match(/token:\s*"([^"]+)"/);
    if (!tokenMatch) {
      console.log("No CSRF token. HTML preview:", html.substring(0, 2000));
      return new Response(
        JSON.stringify({ followers: null, error: "no_token", htmlLen: html.length }),
        { headers }
      );
    }

    // Grab cookies — Edge runtime merges set-cookie into one header
    let cookies = "";
    if (pageRes.headers.getSetCookie) {
      // Modern API: returns array of individual set-cookie values
      cookies = pageRes.headers
        .getSetCookie()
        .map((c) => c.split(";")[0])
        .join("; ");
    } else {
      // Fallback: parse the merged comma-separated header
      const raw = pageRes.headers.get("set-cookie") || "";
      cookies = raw
        .split(/,(?=\s*(?:XSRF|_session|laravel))/)
        .map((c) => c.trim().split(";")[0])
        .filter(Boolean)
        .join("; ");
    }

    // Step 2: POST for follower count
    const apiRes = await fetch("https://blastup.com/instagram-follower-count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: "https://blastup.com/instagram-follower-count?foodietwinzz",
        Origin: "https://blastup.com",
        Cookie: cookies,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        _token: tokenMatch[1],
        username: "foodietwinzz",
      }),
    });

    if (!apiRes.ok) {
      console.log("BlastUp API status:", apiRes.status);
      return new Response(
        JSON.stringify({ followers: null, error: "api_fetch_failed", status: apiRes.status }),
        { headers }
      );
    }

    const data = await apiRes.json();

    if (!data.success || !data.followers) {
      console.log("BlastUp API returned:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ followers: null, error: "api_no_data", debug: data }),
        { headers }
      );
    }

    const followers = data.followers;

    let formatted;
    if (followers >= 1000000) formatted = (followers / 1000000).toFixed(1) + "M";
    else if (followers >= 10000) formatted = (followers / 1000).toFixed(1) + "K";
    else formatted = followers.toLocaleString();

    return new Response(
      JSON.stringify({
        followers,
        formatted,
        lastUpdated: new Date().toISOString(),
        source: "blastup",
      }),
      { headers }
    );
  } catch (error) {
    console.log("Handler error:", error.message);
    return new Response(
      JSON.stringify({ followers: null, error: error.message }),
      { headers }
    );
  }
}
