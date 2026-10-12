import type {APIRoute} from 'astro';
import {getSearchRecords} from '../data/search';
export const prerender=true;
export const GET:APIRoute=async()=>new Response(JSON.stringify({version:1,records:await getSearchRecords()}),{headers:{'Content-Type':'application/json; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'public, max-age=300'}});
