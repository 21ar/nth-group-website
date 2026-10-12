import {inject, track} from '@vercel/analytics';
const enabled = import.meta.env.PUBLIC_ENABLE_ANALYTICS === 'true';
if (enabled && !location.pathname.startsWith('/preview')) {
  inject({mode:'production',beforeSend:event=>({ ...event, url:event.url.split('?')[0] })});
  const ventures = new Set(['general','partnership','investor','nrth-health','nrth-tms','nrth-telematics','nrth-logistics','nrth-systems','nrth-labs','nrth-chemicals','nrth-fleet','nrth-events']);
  window.addEventListener('nrth:interaction', event => {
    const detail = (event as CustomEvent).detail;
    if (!ventures.has(detail?.venture)) return;
    if (!['demo-completed','inquiry_accepted','workflow-completed','agenda-saved','material-brief-saved'].includes(detail?.action)) return;
    track(detail.action,{venture:detail.venture});
  });
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/projects/nrth-"]').forEach(link=>link.addEventListener('click',()=>{const slug=new URL(link.href).pathname.split('/').pop();if(slug && ventures.has(slug)) track('venture_discovered',{venture:slug});}));
  document.querySelectorAll<HTMLAnchorElement>('a[href="/contact?project=investor"]').forEach(link=>link.addEventListener('click',()=>track('investor_information_requested')));
}
