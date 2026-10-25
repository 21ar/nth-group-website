import type {APIRoute} from 'astro';
import {handleInquiry} from '../../server/inquiries';
export const prerender = false;
const settings = () => ({
  apiKey:process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY, from:process.env.CONTACT_FROM_EMAIL || import.meta.env.CONTACT_FROM_EMAIL,
  general:process.env.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL, partnerships:process.env.PARTNERSHIPS_EMAIL || import.meta.env.PARTNERSHIPS_EMAIL || process.env.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL,
  investors:process.env.INVESTORS_EMAIL || import.meta.env.INVESTORS_EMAIL || process.env.CONTACT_EMAIL || import.meta.env.CONTACT_EMAIL,
});
export const POST: APIRoute = ({request,site}) => handleInquiry(request,{...settings(),siteOrigin:site?.origin});
export const GET: APIRoute = () => {const config=settings();return new Response(JSON.stringify({delivery:Boolean(config.apiKey && config.from && config.general)}),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});};
