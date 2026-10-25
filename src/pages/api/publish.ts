import type {APIRoute} from 'astro';
import {equalSecret} from '../../server/preview';
export const prerender = false;
export const POST: APIRoute = async ({request}) => {
  const secret = process.env.SANITY_WEBHOOK_SECRET || import.meta.env.SANITY_WEBHOOK_SECRET;
  if (!equalSecret(request.headers.get('x-nrth-publish-secret') || '',secret || '')) return new Response('Unauthorized',{status:401});
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL || import.meta.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook?.startsWith('https://api.vercel.com/v1/integrations/deploy/')) return new Response('Publishing is not configured.',{status:503});
  try {const result = await fetch(hook,{method:'POST',signal:AbortSignal.timeout(10000)});if (!result.ok) return new Response('Deployment could not be queued.',{status:502});return new Response(JSON.stringify({message:'Deployment queued. The live site changes after a successful build.'}),{status:202,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
  catch {return new Response('Deployment could not be confirmed.',{status:502});}
};
