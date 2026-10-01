const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
try { motionPaused ||= localStorage.getItem('nrth-motion') === 'paused'; } catch { /* Storage is optional. */ }

function syncMotion() {
  document.documentElement.classList.toggle('motion-paused', motionPaused || reducedMotion.matches);
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach(button => {
    button.textContent = motionPaused || reducedMotion.matches ? 'Enable motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(motionPaused || reducedMotion.matches));
  });
  window.dispatchEvent(new CustomEvent('nrth:motion', { detail: { paused: motionPaused || reducedMotion.matches } }));
}
document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
  if (reducedMotion.matches) {
    button.textContent = 'Reduced motion is on';
    return;
  }
  motionPaused = !motionPaused;
  try { localStorage.setItem('nrth-motion', motionPaused ? 'paused' : 'enabled'); } catch { /* Storage is optional. */ }
  syncMotion();
}));
reducedMotion.addEventListener('change', syncMotion);
syncMotion();

const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px 35px 0px' });
  revealElements.forEach(element => observer.observe(element));
  document.documentElement.classList.add('js-enabled');
}

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const menu = document.querySelector<HTMLElement>('#mobile-navigation');
function setMenu(open: boolean) {
  if (!menuButton || !menu) return;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) menu.querySelector<HTMLAnchorElement>('a')?.focus();
  else menuButton.focus();
}
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (!menu || menu.hidden || !menuButton) return;
  if (event.key === 'Escape') { setMenu(false); return; }
  if (event.key !== 'Tab') return;
  const controls = [menuButton, ...menu.querySelectorAll<HTMLAnchorElement>('a')];
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
window.matchMedia('(min-width: 768px)').addEventListener('change', event => {
  if (event.matches && menu && !menu.hidden) {
    menu.hidden = true;
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'Menu';
    document.body.style.overflow = '';
  }
});

const directory = document.querySelector<HTMLElement>('[data-project-directory]');
if (directory) {
  const filters = directory.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const search = directory.querySelector<HTMLInputElement>('[data-project-search]');
  const rows = directory.querySelectorAll<HTMLElement>('[data-project-category]');
  let category = 'All';
  function filterProjects() {
    const query = search?.value.trim().toLowerCase() || '';
    let count = 0;
    rows.forEach(row => {
      const visible = (category === 'All' || row.dataset.projectCategory === category) && (row.dataset.projectName || '').toLowerCase().includes(query);
      row.hidden = !visible;
      if (visible) count++;
    });
    const countElement = directory?.querySelector('[data-project-count]');
    if (countElement) countElement.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
    const empty = directory?.querySelector<HTMLElement>('[data-project-empty]');
    if (empty) empty.hidden = count !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter || 'All';
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filterProjects();
  }));
  search?.addEventListener('input', filterProjects);
  const selectedField = new URLSearchParams(location.search).get('field');
  if (selectedField) [...filters].find(button => button.dataset.filter === selectedField)?.click();
  directory.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.addEventListener('click', () => {
    directory.dataset.directoryView = button.dataset.view;
    directory.querySelectorAll('[data-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
}

const explorer = document.querySelector<HTMLElement>('[data-explorer]');
if (explorer) {
  const tabs = [...explorer.querySelectorAll<HTMLButtonElement>('[data-project-tab]')];
  const panels = [...explorer.querySelectorAll<HTMLElement>('[data-project-panel]')];
  const tablist = explorer.querySelector<HTMLElement>('[role="tablist"]');
  let active = 0;
  let transitionAnimations: Animation[] = [];
  let outgoing: HTMLElement | undefined;
  const stage = explorer.querySelector<HTMLElement>('.explorer-stage');
  const indicator=document.createElement('span');indicator.className='explorer-selection';indicator.setAttribute('aria-hidden','true');tablist?.prepend(indicator);
  let transitionVersion=0;
  function moveIndicator(){if(!tablist)return;const tab=tabs[active];indicator.style.translate=`${tab.offsetLeft}px ${tab.offsetTop}px`;indicator.style.width=`${tab.offsetWidth}px`;indicator.style.height=`${tab.offsetHeight}px`;}
  new ResizeObserver(moveIndicator).observe(explorer);
  function chooseProject(index: number, focus = false) {
    const previous = active;
    const next = (index + tabs.length) % tabs.length;
    const version=++transitionVersion;
    const direction=index<active?-1:1;
    explorer!.dataset.direction=direction>0?'forward':'backward';
    transitionAnimations.forEach(animation => animation.cancel());
    transitionAnimations = [];
    outgoing?.remove(); outgoing = undefined;
    if (next !== previous && !motionPaused && !reducedMotion.matches && stage) {
      outgoing = panels[previous].cloneNode(true) as HTMLElement;
      outgoing.removeAttribute('id'); outgoing.removeAttribute('role'); outgoing.removeAttribute('aria-labelledby');
      outgoing.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      outgoing.classList.add('explorer-outgoing'); outgoing.inert = true; outgoing.setAttribute('aria-hidden', 'true');
      outgoing.removeAttribute('data-project-panel'); outgoing.removeAttribute('data-active');
      stage.append(outgoing);
      const old = outgoing;
      const departure = old.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${-direction*40}px)`}],{duration:560,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
      transitionAnimations.push(departure);
      departure.finished.then(()=>{old.remove();if(outgoing===old)outgoing=undefined;}).catch(()=>{});
    }
    active = next;moveIndicator();
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === active));
      tab.tabIndex = i === active ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== active;
      if (i === active) panel.dataset.active = 'true';
      else delete panel.dataset.active;
    });
    if (next !== previous && !motionPaused && !reducedMotion.matches) {
      const image = panels[active].querySelector<HTMLElement>('.explorer-image');
      if(image) transitionAnimations.push(image.animate([{clipPath:direction>0?'inset(0 100% 0 0)':'inset(0 0 0 100%)',transform:`translateX(${direction*40}px) scale(1.03)`},{clipPath:'inset(0 0% 0 0)',transform:'translateX(0) scale(1)'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
      panels[active].querySelectorAll<HTMLElement>('.explorer-caption>div,.explorer-focus').forEach((element,i)=>transitionAnimations.push(element.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:120+i*85,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})));
      explorer!.dataset.transition = 'running';
      Promise.allSettled(transitionAnimations.map(animation=>animation.finished)).then(()=>{if(version===transitionVersion)explorer!.dataset.transition='idle';});
    }
    for(const neighbor of [active,(active+1)%panels.length,(active-1+panels.length)%panels.length]) {
      const image=panels[neighbor].querySelector<HTMLImageElement>('img');if(image){image.loading='eager';void image.decode().catch(()=>{});}
    }
    const count = explorer?.querySelector('[data-explorer-count]');
    if (count) count.textContent = `${String(active + 1).padStart(2, '0')} / 09`;
    if (focus) { tabs[active].focus({ preventScroll: true }); tabs[active].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' }); }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => chooseProject(i));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (delta) { event.preventDefault(); chooseProject(active + delta, true); }
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); chooseProject(event.key === 'Home' ? 0 : tabs.length - 1, true); }
    });
  });
  explorer.querySelector('[data-explorer-previous]')?.addEventListener('click', () => chooseProject(active - 1));
  explorer.querySelector('[data-explorer-next]')?.addEventListener('click', () => chooseProject(active + 1));
  const narrow = matchMedia('(max-width: 767px)');
  function syncOrientation() { tablist?.setAttribute('aria-orientation', narrow.matches ? 'horizontal' : 'vertical'); }
  narrow.addEventListener('change', syncOrientation);
  syncOrientation();document.fonts.ready.then(moveIndicator);
  const preload = new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){panels.forEach(panel=>{const image=panel.querySelector<HTMLImageElement>('img');if(image)image.loading='eager';});preload.disconnect();}},{rootMargin:'800px'});
  preload.observe(explorer);
  window.addEventListener('nrth:motion', () => {
    if (motionPaused || reducedMotion.matches) { transitionAnimations.forEach(animation => animation.cancel()); outgoing?.remove(); outgoing=undefined; }
  });
}

const form = document.querySelector<HTMLFormElement>('[data-inquiry-form]');
if (form) {
  const project = new URLSearchParams(location.search).get('project');
  const select = form.querySelector<HTMLSelectElement>('[name="project"]');
  if (project && select && [...select.options].some(option => option.value === project)) select.value = project;
  const result = form.querySelector<HTMLElement>('[data-inquiry-result]');
  const preview = form.querySelector<HTMLElement>('[data-inquiry-preview]');
  const status = form.querySelector<HTMLElement>('[data-inquiry-status]');
  let message = '';
  let objectUrl: string | undefined;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const selectedName = select?.selectedOptions[0]?.textContent || 'General inquiry';
    const subject = `NRTH inquiry — ${selectedName}`;
    message = `${subject}\n\nName: ${values.get('name')}\nEmail: ${values.get('email')}\nOrganization: ${values.get('organization') || 'Not specified'}\n\n${values.get('message')}\n`;
    if (preview) preview.textContent = message;
    if (result) { result.hidden = false; result.focus(); }
    if (status) status.textContent = '';
    const emailLink = form.querySelector<HTMLAnchorElement>('[data-inquiry-email]');
    const destination = select?.value === 'investor' ? form.dataset.investorsEmail || form.dataset.contactEmail : select?.value === 'partnership' ? form.dataset.partnershipsEmail || form.dataset.contactEmail : form.dataset.contactEmail;
    if (emailLink && destination) {
      emailLink.href = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      emailLink.hidden = false;
    }
    const download = form.querySelector<HTMLAnchorElement>('[data-inquiry-download]');
    if (download) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(new Blob([message], { type: 'text/plain;charset=utf-8' }));
      download.href = objectUrl;
    }
    result?.scrollIntoView({ behavior: motionPaused || reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
  });
  form.querySelector('[data-inquiry-copy]')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(message); if (status) status.textContent = 'Inquiry copied. Nothing has been sent.'; }
    catch { if (status) status.textContent = 'Copy is unavailable in this browser. You can select the text above or save a copy.'; }
  });
  form.querySelector('[data-inquiry-edit]')?.addEventListener('click', () => {
    if (result) result.hidden = true;
    form.querySelector<HTMLTextAreaElement>('textarea')?.focus();
  });
  window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
}
