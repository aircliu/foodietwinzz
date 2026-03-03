import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

function fetchInstagram() {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'i.instagram.com',
      path: '/api/v1/users/web_profile_info/?username=foodietwinzz',
      headers: {
        'User-Agent': 'Instagram 275.0.0.27.98 Android',
        'X-IG-App-ID': '936619743392459',
      },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          resolve(j?.data?.user?.edge_followed_by?.count || null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
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

          const count = await fetchInstagram();
          if (count) {
            let formatted;
            if (count >= 1000000) formatted = (count / 1000000).toFixed(1) + 'M';
            else if (count >= 10000) formatted = (count / 1000).toFixed(1) + 'K';
            else formatted = count.toLocaleString();

            res.statusCode = 200;
            res.end(JSON.stringify({
              followers: count,
              formatted,
              lastUpdated: new Date().toISOString(),
              source: 'live',
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
