import {inject, track} from '@vercel/analytics';
const enabled = import.meta.env.PUBLIC_ENABLE_ANALYTICS === 'true';
if (enabled && !location.pathname.startsWith('/preview')) {
  inject({mode:'production',beforeSend:event=>{const url=new URL(event.url);return {...event,url:url.origin+url.pathname};}});
  const ventures = new Set(['general','partnership','investor','nrth-health','nrth-tms','nrth-telematics','nrth-logistics','nrth-systems','nrth-labs','nrth-chemicals','nrth-fleet','nrth-events']);
  window.addEventListener('nrth:interaction', event => {
    const detail = (event as CustomEvent).detail;
    if (!ventures.has(detail?.venture)) return;
    if (!['demo-completed','inquiry_accepted','workflow-completed','agenda-saved','material-brief-saved','example_changed','example_inspected','example_dependencies'].includes(detail?.action)) return;
    track(detail.action,{venture:detail.venture});
  });
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/projects/nrth-"]').forEach(link=>link.addEventListener('click',()=>{const slug=new URL(link.href).pathname.split('/').pop();if(slug && ventures.has(slug)) track('venture_discovered',{venture:slug});}));
  document.querySelectorAll<HTMLAnchorElement>('a[href="/contact?project=investor"]').forEach(link=>link.addEventListener('click',()=>track('investor_information_requested')));
  const actions=new Set(['search_result_opened','inquiry_context_prepared','inquiry_reviewed','research_outline_saved','research_outline_shared','partnership_outline_saved','reading_pack_saved','visual_study_saved','visual_study_shared','example_explored','perspective_examined','field_explored','exhibit_explored','study_filter_selected']);
  const types=new Set(['venture','industry','writing','research','resource','company']);
  window.addEventListener('nrth:discovery',event=>{
    const detail=(event as CustomEvent).detail;if(!actions.has(detail?.action))return;
    // Only controlled enums are sent. Search text, page query strings, message
    // text, contact identity and arbitrary event properties are never copied.
    const properties:Record<string,string>={};
    if(ventures.has(detail.venture))properties.venture=detail.venture;
    if(types.has(detail.type))properties.type=detail.type;
    if(['Mobility','Health','Systems','Materials','Events','Research'].includes(detail.field))properties.field=detail.field;
    if(['all','form','handoff','conditions','rhythm'].includes(detail.study))properties.study=detail.study;
    track(detail.action,properties);
  });
  document.addEventListener('click',event=>{
    if(!(event.target instanceof Element))return;const target=event.target;
    const field=target.closest<HTMLElement>('[data-matter-field]')?.dataset.matterField;
    if(field&&['Mobility','Health','Systems','Materials','Events','Research'].includes(field))track('field_explored',{field});
    if(target.closest('[data-scenario-choice],[data-example-case],[data-example-part]')){const venture=location.pathname.split('/').pop();if(venture&&ventures.has(venture))track('example_explored',{venture});}
    if(target.closest('[data-inspector-tab],[data-story-inspect]'))track('perspective_examined');
  });
  document.addEventListener('change',event=>{if(event.target instanceof Element&&event.target.matches('[data-exhibit-case]'))track('exhibit_explored');});
}
