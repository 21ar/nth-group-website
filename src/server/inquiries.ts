import {projects} from '../data/projects';
export type InquiryConfig = {apiKey?: string; from?: string; general?: string; partnerships?: string; investors?: string; siteOrigin?: string};
const attempts = new Map<string, {count: number; expires: number}>();
const json = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), {status, headers: {'Content-Type':'application/json', 'Cache-Control':'no-store'}});
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
async function readBounded(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 20000) throw new Error('large');
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {const {value, done} = await reader.read(); if (done) break; size += value.byteLength; if (size > 20000) {await reader.cancel(); throw new Error('large');} chunks.push(value);}
  const result = new Uint8Array(size); let offset = 0; for (const part of chunks) {result.set(part, offset); offset += part.length;}
  return new TextDecoder().decode(result);
}
export async function handleInquiry(request: Request, config: InquiryConfig, deliver: typeof fetch = fetch) {
  if (request.method !== 'POST') return json(405, {error:'Use POST to submit an inquiry.'});
  const origin = request.headers.get('origin');
  // The canonical site can sit behind a proxy whose upstream URL is the Vercel host.
  // Trust only the configured site origin and the request origin, never forwarded headers.
  if (!origin || (origin !== new URL(request.url).origin && origin !== config.siteOrigin)) return json(403, {error:'Please send your inquiry from the NRTH website.'});
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json(415, {error:'The inquiry format was not recognized.'});
  let input: Record<string, unknown>;
  try {input = JSON.parse(await readBounded(request));} catch {return json(400, {error:'Please check the inquiry and try again.'});}
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json(400, {error:'Please check the inquiry and try again.'});
  const fields = ['name','email','organization','project','message','website','requestId'] as const;
  const values = Object.fromEntries(fields.map(key => [key, typeof input[key] === 'string' ? input[key].trim() : ''])) as Record<typeof fields[number], string>;
  if (values.website) return json(400, {error:'The inquiry could not be accepted.'});
  if (!values.name || values.name.length > 120 || !emailPattern.test(values.email) || values.email.length > 254 || /[\r\n]/.test(values.email) || values.organization.length > 180 || values.message.length < 10 || values.message.length > 5000) return json(422, {error:'Please provide a name, a valid email address, and a message of 10–5,000 characters.'});
  if (!['general','partnership','investor', ...projects.map(project => project.slug)].includes(values.project)) return json(422, {error:'Please choose a valid inquiry topic.'});
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(values.requestId)) return json(422, {error:'Please refresh the page before sending.'});
  const destination = values.project === 'investor' ? config.investors : values.project === 'partnership' ? config.partnerships : config.general;
  if (!config.apiKey || !config.from || !destination || !emailPattern.test(destination)) return json(503, {error:'Website delivery is currently unavailable. Please open your email app below or save your inquiry.'});
  // Per-instance protection supplements provider idempotency and Vercel Firewall rules.
  // It is deliberately not represented as a distributed rate limiter.
  const identity = (request.headers.get('x-vercel-forwarded-for') || 'local').split(',')[0].trim();
  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.expires < now) attempts.delete(key);
  const record = attempts.get(identity) || {count:0, expires:now + 600000};
  if (record.count >= 5) return json(429, {error:'Please wait a few minutes before sending another inquiry.'});
  record.count++; attempts.set(identity, record);
  const reference = 'NRTH-' + values.requestId.slice(0,8).toUpperCase();
  const topic = projects.find(project => project.slug === values.project)?.name || ({general:'General inquiry', partnership:'Partnership', investor:'Investor inquiry'} as Record<string,string>)[values.project];
  try {
    const response = await deliver('https://api.resend.com/emails', {
      method:'POST', signal:AbortSignal.timeout(12000), headers:{Authorization:'Bearer ' + config.apiKey, 'Content-Type':'application/json', 'Idempotency-Key':'nrth-inquiry-' + values.requestId},
      body:JSON.stringify({from:config.from, to:[destination], reply_to:values.email, subject:`${reference} / ${topic}`, text:`${reference}\nTopic: ${topic}\nName: ${values.name}\nEmail: ${values.email}\nOrganization: ${values.organization || 'Not specified'}\n\n${values.message}`})
    });
    if (!response.ok) return json(502, {error:'The email service could not accept your inquiry. Your message is still here; please retry or use your email app.'});
    const receipt = await response.json();
    if (typeof receipt.id !== 'string' || !receipt.id) return json(502, {error:'The email service did not confirm acceptance. Please retry or use your email app.'});
    return json(200, {reference, message:'The email service accepted your inquiry for delivery.'});
  } catch {return json(502, {error:'Delivery could not be confirmed. Your message is still here. Retrying uses the same reference to prevent duplicate submissions.'});}
}
