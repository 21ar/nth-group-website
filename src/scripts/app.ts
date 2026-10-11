export {};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let manualPause=false;
try{manualPause=localStorage.getItem('nrth-motion')==='paused';}catch{}
function syncMotion(){
 const paused=manualPause||reduced.matches;
 document.documentElement.classList.toggle('motion-paused',paused);
 document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach(button=>{button.hidden=false;button.textContent=reduced.matches?'Reduced motion enabled':paused?'Enable motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));});
 window.dispatchEvent(new CustomEvent('nrth:motion',{detail:{paused}}));
}
document.querySelectorAll('[data-motion-toggle]').forEach(button=>button.addEventListener('click',()=>{if(reduced.matches)return;manualPause=!manualPause;try{localStorage.setItem('nrth-motion',manualPause?'paused':'enabled');}catch{}syncMotion();}));
reduced.addEventListener('change',syncMotion);syncMotion();
const menu=document.querySelector<HTMLDetailsElement>('[data-site-menu]');
if(menu){
 const summary=menu.querySelector<HTMLElement>('summary')!,panel=menu.querySelector<HTMLElement>('.menu-panel')!;
 menu.addEventListener('toggle',()=>{
  document.documentElement.classList.toggle('menu-open',menu.open);
  document.querySelector<HTMLElement>('main')!.inert=menu.open;document.querySelector<HTMLElement>('footer')!.inert=menu.open;document.querySelector<HTMLElement>('.skip-link')!.inert=menu.open;
  summary.textContent=menu.open?'Close':'Menu';summary.setAttribute('aria-expanded',String(menu.open));
  if(menu.open)panel.querySelector<HTMLAnchorElement>('.menu-company a')?.focus({preventScroll:true});else summary.focus({preventScroll:true});
 });
 document.addEventListener('keydown',event=>{
  if(!menu.open)return;
  if(event.key==='Escape'){event.preventDefault();menu.open=false;return;}
  if(event.key==='Tab'){
   const controls=[summary,...panel.querySelectorAll<HTMLElement>('a,button')],first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 panel.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));
}
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-entered');observer.unobserve(entry.target);}},{threshold:.09,rootMargin:'0px 0px 20px 0px'});
 document.querySelectorAll('[data-enter],[data-image-reveal]').forEach(element=>observer.observe(element));document.documentElement.classList.add('js-reveal');
}
document.querySelectorAll<HTMLElement>('[data-venture-index]').forEach(index=>{
 const tools=index.querySelector<HTMLElement>('[data-index-tools]');if(tools)tools.hidden=false;
 const rows=[...index.querySelectorAll<HTMLAnchorElement>('[data-index-row]')],filters=[...index.querySelectorAll<HTMLButtonElement>('[data-index-filter]')],search=index.querySelector<HTMLInputElement>('[data-index-search]');
 let category='All';
 function update(){
  let count=0;const query=search?.value.trim().toLowerCase()||'';
  rows.forEach(row=>{row.hidden=(category!=='All'&&row.dataset.category!==category)||!(row.dataset.search||'').includes(query);if(!row.hidden)count++;});
  const empty=index.querySelector<HTMLElement>('[data-index-empty]');if(empty)empty.hidden=count>0;
  const result=index.querySelector('[data-index-result]');if(result)result.textContent=count+' '+(count===1?'venture':'ventures');
 }
 filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.indexFilter||'All';filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));update();}));search?.addEventListener('input',update);
 const requested=new URLSearchParams(location.search).get('field');if(requested)filters.find(button=>button.dataset.indexFilter===requested)?.click();
 rows.forEach(row=>{
  const select=()=>{const art=row.dataset.category==='Research'||row.dataset.category==='Materials'?2:row.dataset.category==='Health'||row.dataset.category==='Events'?1:0;index.querySelectorAll<HTMLElement>('[data-index-art]').forEach(image=>image.classList.toggle('is-active',image.dataset.indexArt===String(art)));const caption=index.querySelector('[data-index-caption]');if(caption)caption.textContent='NRTH '+row.querySelector('.index-name')?.textContent;};
  row.addEventListener('pointerenter',select);row.addEventListener('focus',select);
 });
});
document.querySelectorAll<HTMLElement>('[data-focus-explorer]').forEach(explorer=>{
 explorer.querySelector<HTMLElement>('.focus-choices')!.hidden=false;
 const tabs=[...explorer.querySelectorAll<HTMLButtonElement>('[data-focus-choice]')],panels=[...explorer.querySelectorAll<HTMLElement>('[data-focus-panel]')];
 function choose(index:number,focus=false){const selected=(index+tabs.length)%tabs.length;tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===selected));tab.tabIndex=i===selected?0:-1;});panels.forEach((panel,i)=>{panel.hidden=i!==selected;if(i===selected&&!reduced.matches&&!manualPause)panel.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)'});});if(focus)tabs[selected].focus();}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>choose(i));tab.addEventListener('keydown',e=>{const delta=['ArrowRight','ArrowDown'].includes(e.key)?1:['ArrowLeft','ArrowUp'].includes(e.key)?-1:0;if(delta){e.preventDefault();choose(i+delta,true);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();choose(e.key==='Home'?0:tabs.length-1,true);}});});
});
