import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

async function fetchFromInstagram() {
  const res = await fetch('https://www.instagram.com/foodietwinzz/', {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1',
      'Accept': 'text/html',
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/content="([\d,.]+[KMkm]?)\s*Followers?/i);
  if (!match) return null;
  let raw = match[1].replace(/,/g, '');
  if (/k/i.test(raw)) return Math.round(parseFloat(raw) * 1000);
  if (/m/i.test(raw)) return Math.round(parseFloat(raw) * 1000000);
  const num = parseInt(raw, 10);
  return num > 0 && num < 1000000000 ? num : null;
}

async function fetchFromBlastUp() {
  const pageRes = await fetch(
    'https://blastup.com/instagram-follower-count?foodietwinzz',
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept': 'text/html' } }
  );
  if (!pageRes.ok) return null;
  const html = await pageRes.text();
  const tokenMatch = html.match(/token:\s*"([^"]+)"/);
  if (!tokenMatch) return null;
  const rawCookies = pageRes.headers.getSetCookie ? pageRes.headers.getSetCookie() : [];
  const cookies = rawCookies.map(c => c.split(';')[0]).join('; ');
  const apiRes = await fetch('https://blastup.com/instagram-follower-count', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Referer': 'https://blastup.com/instagram-follower-count?foodietwinzz',
      'Cookie': cookies,
    },
    body: JSON.stringify({ _token: tokenMatch[1], username: 'foodietwinzz' }),
  });
  if (!apiRes.ok) return null;
  const data = await apiRes.json();
  return data.success && data.followers ? data.followers : null;
}

async function getFollowers() {
  // Try Instagram direct first, then BlastUp fallback
  try {
    const ig = await fetchFromInstagram();
    if (ig) return { count: ig, source: 'instagram' };
  } catch {}
  try {
    const bu = await fetchFromBlastUp();
    if (bu) return { count: bu, source: 'blastup' };
  } catch {}
  return null;
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== '/api/instagram' && req.url !== '/api/followers') {
            return next();
          }

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');

          const result = await getFollowers();
          if (result) {
            const { count, source } = result;
            let formatted;
            if (count >= 1000000) formatted = (count / 1000000).toFixed(1) + 'M';
            else if (count >= 10000) formatted = (count / 1000).toFixed(1) + 'K';
            else formatted = count.toLocaleString();

            res.statusCode = 200;
            res.end(JSON.stringify({
              followers: count,
              formatted,
              lastUpdated: new Date().toISOString(),
              source,
            }));
          } else {
            res.statusCode = 200;
            res.end(JSON.stringify({ followers: null, error: 'fetch_failed' }));
          }
        });
      },
    },
  ],
})
