import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // Serve /api/followers locally by scraping Instagram
    {
      name: 'local-api',
      configureServer(server) {
        server.middlewares.use('/api/followers', async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const response = await fetch('https://www.instagram.com/foodietwinzz/', {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html',
                'Accept-Language': 'en-US,en;q=0.9',
              },
            });
            const html = await response.text();

            // Try og:description: "1,234 Followers, 56 Following..."
            const ogMatch = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]+)"/i)
              || html.match(/content="([^"]+)"\s+(?:property|name)="og:description"/i);
            if (ogMatch) {
              const m = ogMatch[1].match(/([\d,.]+[KMB]?)\s+[Ff]ollowers/);
              if (m) {
                const cleaned = m[1].replace(/,/g, '');
                const suffix = cleaned.slice(-1).toUpperCase();
                const multipliers = { K: 1000, M: 1000000, B: 1000000000 };
                const count = multipliers[suffix]
                  ? Math.round(parseFloat(cleaned.slice(0, -1)) * multipliers[suffix])
                  : parseInt(cleaned, 10);
                res.end(JSON.stringify({ followers: count, source: 'live' }));
                return;
              }
            }

            // Try JSON patterns
            const jsonMatch = html.match(/"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)/)
              || html.match(/"follower_count"\s*:\s*(\d+)/);
            if (jsonMatch) {
              res.end(JSON.stringify({ followers: parseInt(jsonMatch[1], 10), source: 'live' }));
              return;
            }

            res.end(JSON.stringify({ followers: 4200, source: 'fallback' }));
          } catch {
            res.end(JSON.stringify({ followers: 4200, source: 'fallback' }));
          }
        });
      },
    },
  ],
})
