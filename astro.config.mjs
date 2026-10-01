import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nrth.group',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  server: { host: '0.0.0.0', port: 4173 },
  vite: {
    server: { allowedHosts: ['terminal.local'], strictPort: true },
    
  },
});
