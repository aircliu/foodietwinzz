// Vercel Edge Function — /api/instagram
// Reads cached follower count (updated by GitHub Actions every 10 min)
// Falls back to live BlastUp scrape if cache is missing

export const config = { runtime: "edge" };

async function fetchCached(requestUrl) {
  // Read the static followers.json from the same deployment
  const url = new URL("/followers.json", requestUrl);
  const res = await fetch(url.href);
  if (!res.ok) return null;
  const data = await res.json();
  return data.followers ? data : null;
}

async function fetchFromBlastUp() {
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
  if (!pageRes.ok) return null;

  const html = await pageRes.text();
  const tokenMatch = html.match(/token:\s*"([^"]+)"/);
  if (!tokenMatch) return null;

  let cookies = "";
  if (pageRes.headers.getSetCookie) {
    cookies = pageRes.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
  }

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
  if (!data.success || !data.followers) return null;

  const followers = data.followers;
  let formatted;
  if (followers >= 1000000) formatted = (followers / 1000000).toFixed(1) + "M";
  else if (followers >= 10000) formatted = (followers / 1000).toFixed(1) + "K";
  else formatted = followers.toLocaleString();

  return {
    followers,
    formatted,
    lastUpdated: new Date().toISOString(),
    source: "blastup",
  };
}

export default async function handler(request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    // Try live BlastUp first (works from residential IPs / some cloud)
    let result = null;
    try {
      result = await fetchFromBlastUp();
      if (result) {
        headers["Cache-Control"] = "s-maxage=120, stale-while-revalidate=300";
        return new Response(JSON.stringify(result), { headers });
      }
    } catch {}

    // Fall back to cached value in public/followers.json (updated by GitHub Actions)
    result = await fetchCached(request.url);
    if (result) {
      headers["Cache-Control"] = "s-maxage=60, stale-while-revalidate=600";
      return new Response(JSON.stringify(result), { headers });
    }

    return new Response(
      JSON.stringify({ followers: null, error: "all_sources_failed" }),
      { headers: { ...headers, "Cache-Control": "s-maxage=0, no-cache" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ followers: null, error: error.message }),
      { headers: { ...headers, "Cache-Control": "s-maxage=0, no-cache" } }
    );
  }
}
