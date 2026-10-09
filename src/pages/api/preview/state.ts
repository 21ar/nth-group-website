import type {APIRoute} from 'astro';
import {cookieName, validPreviewSession} from '../../../server/preview';
import {fetchContent} from '../../../data/content';
import {createHash} from 'node:crypto';
export const prerender = false;
export const GET: APIRoute = async ({cookies}) => {
  const headers = {'Cache-Control':'private, no-store','Content-Type':'application/json'};
  if (!validPreviewSession(cookies.get(cookieName)?.value)) return new Response(JSON.stringify({error:'Preview session expired.'}), {status:401,headers});
  try {const source = await fetchContent(true); const revision = createHash('sha256').update(JSON.stringify((source.revisions || []).sort((a,b)=>a.id.localeCompare(b.id)))).digest('hex');return new Response(JSON.stringify({revision}),{headers});}
  catch {return new Response(JSON.stringify({error:'Draft content could not be refreshed.'}),{status:503,headers});}
};
