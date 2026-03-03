import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api',
      configureServer(server) {
        server.middlewares.use('/api/followers', async (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const response = await fetch(
              'https://i.instagram.com/api/v1/users/web_profile_info/?username=foodietwinzz',
              {
                headers: {
                  'User-Agent': 'Instagram 275.0.0.27.98 Android',
                  'X-IG-App-ID': '936619743392459',
                },
              }
            );
            const data = await response.json();
            const count = data?.data?.user?.edge_followed_by?.count;
            if (count > 0) {
              res.end(JSON.stringify({ followers: count, source: 'live' }));
              return;
            }
          } catch {}
          res.end(JSON.stringify({ followers: 4650, source: 'fallback' }));
        });
      },
    },
  ],
})
