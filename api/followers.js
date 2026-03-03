// Vercel Serverless Function — /api/followers
// Scrapes Instagram's public profile page every 10 minutes (cached at CDN).
// Falls back to INSTAGRAM_FOLLOWERS env var if scraping fails.

const INSTAGRAM_URL = "https://www.instagram.com/foodietwinzz/";
const FALLBACK = 4200;

async function scrapeFollowerCount() {
  const res = await fetch(INSTAGRAM_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Accept": "text/html",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) return null;

  const html = await res.text();

  // Method 1: Parse og:description meta tag
  // Format: "1,234 Followers, 56 Following, 78 Posts - See Instagram photos..."
  const ogMatch = html.match(
    /<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i
  ) || html.match(
    /content="([^"]+)"\s+(?:property|name)="og:description"/i
  );

  if (ogMatch) {
    const followerMatch = ogMatch[1].match(/([\d,.]+[KMB]?)\s+[Ff]ollowers/);
    if (followerMatch) {
      return parseCount(followerMatch[1]);
    }
  }

  // Method 2: Look for follower count in embedded JSON data
  const jsonMatch = html.match(/"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)/);
  if (jsonMatch) {
    return parseInt(jsonMatch[1], 10);
  }

  // Method 3: Check for newer JSON format
  const altMatch = html.match(/"follower_count"\s*:\s*(\d+)/);
  if (altMatch) {
    return parseInt(altMatch[1], 10);
  }

  return null;
}

function parseCount(str) {
  // Handle "1,234" or "1.2K" or "1.5M" formats
  const cleaned = str.replace(/,/g, "");
  const multipliers = { K: 1000, M: 1000000, B: 1000000000 };
  const suffix = cleaned.slice(-1).toUpperCase();

  if (multipliers[suffix]) {
    return Math.round(parseFloat(cleaned.slice(0, -1)) * multipliers[suffix]);
  }
  return parseInt(cleaned, 10);
}

export default async function handler(req, res) {
  // Cache at Vercel CDN for 10 minutes, serve stale while revalidating
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=120");

  try {
    const count = await scrapeFollowerCount();
    if (count && count > 0) {
      return res.status(200).json({ followers: count, source: "live" });
    }
  } catch (e) {
    console.error("Instagram scrape failed:", e.message);
  }

  // Fallback to env var
  const fallback = parseInt(process.env.INSTAGRAM_FOLLOWERS || String(FALLBACK), 10);
  res.status(200).json({ followers: fallback, source: "fallback" });
}
