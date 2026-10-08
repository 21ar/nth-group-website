let revision: string | undefined;
let refreshing = false;
async function refresh() {
  if (document.hidden || refreshing) return;
  refreshing = true;
  try {
    const result = await fetch('/api/preview/state', {cache:'no-store'});
    const content = await result.json();
    const status = document.querySelector('[data-preview-status]');
    if (!result.ok) {if(status) status.textContent = content.error || 'Preview unavailable.';return;}
    if (revision && revision !== content.revision) {sessionStorage.setItem('nrth-preview-scroll',String(scrollY));location.reload();return;}
    revision = content.revision;if(status) status.textContent = 'Draft preview / Checking for changes every 5 seconds';
  } catch {const status = document.querySelector('[data-preview-status]');if(status) status.textContent = 'Connection interrupted. Draft preview will retry.';}
  finally {refreshing = false;}
}
try {const y = sessionStorage.getItem('nrth-preview-scroll');if(y) {scrollTo(0,Number(y));sessionStorage.removeItem('nrth-preview-scroll');}} catch { /* Storage is optional. */ }
const timer = setInterval(refresh,5000);void refresh();
addEventListener('pagehide',()=>clearInterval(timer));
