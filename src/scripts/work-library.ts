import {emitDiscovery} from './prepared-inquiry';
for(const library of document.querySelectorAll<HTMLElement>('[data-work-library]')){
 const filter=library.querySelector<HTMLFieldSetElement>('[data-work-filter]');
 if(filter){
  const buttons=[...filter.querySelectorAll<HTMLButtonElement>('[data-work-kind]')];
  const entries=[...library.querySelectorAll<HTMLElement>('[data-work-entry]')];
  const status=library.querySelector<HTMLElement>('[data-work-status]');
  for(const button of buttons)button.addEventListener('click',()=>{
   const kind=button.dataset.workKind;
   let shown=0;
   for(const entry of entries){entry.hidden=kind!=='all'&&entry.dataset.workEntry!==kind;if(!entry.hidden)shown++;}
   for(const item of buttons)item.setAttribute('aria-pressed',String(item===button));
   if(status){status.hidden=false;status.textContent=shown+' '+(shown===1?'study':'studies')+' in view.';}
   emitDiscovery('study_filter_selected',{study:kind||'all'});
  });
  filter.hidden=false;
 }
}
// The artwork responds only while the pointer moves. No rendering or idle loop.
for(const art of document.querySelectorAll<HTMLElement>('[data-study-art]')){
 const motionOK=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('motion-paused');
 art.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch'||!motionOK())return;
  const rect=art.getBoundingClientRect();
  art.style.setProperty('--study-turn-x',((event.clientX-rect.left)/rect.width-.5)*5+'deg');
  art.style.setProperty('--study-turn-y',-((event.clientY-rect.top)/rect.height-.5)*5+'deg');
 });
 const reset=()=>{art.style.setProperty('--study-turn-x','0deg');art.style.setProperty('--study-turn-y','0deg');};
 art.addEventListener('pointerleave',reset);window.addEventListener('nrth:motion',reset);
}
for(const exhibit of document.querySelectorAll<HTMLElement>('[data-evidence-exhibit]')){
 let animation:Animation|undefined;
 exhibit.querySelectorAll<HTMLInputElement>('[data-exhibit-case]').forEach(input=>input.addEventListener('change',()=>{
  animation?.cancel();
  const panel=exhibit.querySelector<HTMLElement>('.evidence-case-'+input.value);
  if(panel&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('motion-paused'))animation=panel.animate([{opacity:.6,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});
 }));
 window.addEventListener('nrth:motion',()=>animation?.cancel());
}
