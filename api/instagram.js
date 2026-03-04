// Vercel Edge Function — /api/instagram
// Fetches live follower count from BlastUp

export const config = { runtime: "edge" };

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 10000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default async function handler() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Cache-Control": "s-maxage=120, stale-while-revalidate=300",
  };

  try {
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

    let cookies = "";
    if (pageRes.headers.getSetCookie) {
      cookies = pageRes.headers
        .getSetCookie()
        .map((c) => c.split(";")[0])
        .join("; ");
    }

    const apiRes = await fetch(
      "https://blastup.com/instagram-follower-count",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
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
      throw new Error("No follower data in response");

    return new Response(
      JSON.stringify({
        followers: data.followers,
        formatted: formatCount(data.followers),
        lastUpdated: new Date().toISOString(),
        source: "blastup",
      }),
      { headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ followers: null, error: error.message }),
      {
        headers: {
          ...headers,
          "Cache-Control": "s-maxage=0, no-cache",
        },
      }
    );
  }
}
