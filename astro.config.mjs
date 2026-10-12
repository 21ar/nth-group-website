import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://nrth.group',
  integrations: [sitemap({filter:page=>!new URL(page).pathname.startsWith('/preview') && !new URL(page).pathname.startsWith('/api')})],
  output: 'static',
  adapter: vercel(),
  image: {domains: ['cdn.sanity.io']},
  security: {allowedDomains: [
    {hostname:'nrth.group',protocol:'https'}, {hostname:'www.nrth.group',protocol:'https'},
    {hostname:'nrth-nrth1.vercel.app',protocol:'https'},
    ...[process.env.VERCEL_URL,process.env.VERCEL_BRANCH_URL].filter(Boolean).map(hostname=>({hostname,protocol:'https'})),
    {hostname:'localhost',protocol:'http',port:'4173'}, {hostname:'127.0.0.1',protocol:'http',port:'4173'}, {hostname:'terminal.local',protocol:'http',port:'4173'},
  ]},
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  server: { host: '0.0.0.0', port: 4173 },
  vite: {
    optimizeDeps: { include: ['three', 'three/addons/environments/RoomEnvironment.js'] },
    server: { allowedHosts: ['terminal.local'], strictPort: true },
    
  },
});
