export {};
// The actual venture artwork persists into its detail page, where supported.
// Only the clicked artwork receives a name, avoiding duplicate snapshots.
const root=document.documentElement;
const enabled=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&!root.classList.contains('motion-paused');
const key='nrth-artwork-navigation';
function clear(){document.querySelectorAll<HTMLElement>('[data-transition-source]').forEach(element=>{element.style.viewTransitionName='none';delete element.dataset.transitionSource;});}
function name(element:HTMLElement,value:string){element.style.viewTransitionName=value;element.dataset.transitionSource='true';}
document.addEventListener('click',event=>{
 const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');
 if(!link||!enabled()||event.defaultPrevented||(event as MouseEvent).button!==0||(event as MouseEvent).metaKey||(event as MouseEvent).ctrlKey||link.target==='_blank')return;
 const url=new URL(link.href,location.href);if(url.origin!==location.origin)return;
 const slug=url.pathname.match(/^\/projects\/(nrth-[a-z]+)\/?$/)?.[1];
 const image=link.querySelector<HTMLElement>('img:not(.icon)')||link.closest('[data-project-panel]')?.querySelector<HTMLElement>('.explorer-image>img');
 if(!slug||!image)return;
 clear();name(image,'nrth-artwork');
 try{sessionStorage.setItem(key,JSON.stringify({slug,from:location.pathname,time:Date.now()}));}catch{/* Normal navigation remains available. */}
});
// Runs before pages are revealed; cached pages cannot retain an old selection.
window.addEventListener('pagereveal',()=>{
 if(!enabled())return;
 try{
  const saved=JSON.parse(sessionStorage.getItem(key)||'null');
  if(!saved||Date.now()-saved.time>15000)return;
  sessionStorage.removeItem(key);
  if(location.pathname.replace(/\/$/,'')!==`/projects/${saved.slug}`)return;
  const image=document.querySelector<HTMLElement>('.venture-art>img');
  if(image)name(image,'nrth-artwork');
 }catch{/* Optional navigation metadata. */}
});
window.addEventListener('pageshow',event=>{if(event.persisted)clear();});
window.addEventListener('nrth:motion',()=>{if(!enabled())clear();});
