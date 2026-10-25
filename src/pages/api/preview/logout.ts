import type {APIRoute} from 'astro';
import {cookieName} from '../../../server/preview';
export const prerender = false;
export const POST: APIRoute = ({request,cookies,redirect}) => {
  if (request.headers.get('origin') !== new URL(request.url).origin) return new Response('Forbidden',{status:403});
  cookies.delete(cookieName,{path:'/'});return redirect('/preview');
};
