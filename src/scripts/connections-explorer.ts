export {};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = document.documentElement.classList.contains('motion-paused');
try { paused ||= localStorage.getItem('nrth-motion') === 'paused'; } catch {}
const animations = new Set<Animation>();
function stopAnimations() { animations.forEach(animation => animation.cancel()); animations.clear(); }
window.addEventListener('nrth:motion', event => {
  paused = Boolean((event as CustomEvent<{paused: boolean}>).detail.paused);
  if (paused) stopAnimations();
});
reduced.addEventListener('change', () => { if (reduced.matches) stopAnimations(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAnimations(); });

for (const explorer of document.querySelectorAll<HTMLElement>('[data-connections-explorer]')) {
  const choices = [...explorer.querySelectorAll<HTMLButtonElement>('[data-connection-choice]')];
  const fields = [...explorer.querySelectorAll<HTMLButtonElement>('[data-connection-field]')];
  const stories = [...explorer.querySelectorAll<HTMLElement>('[data-connection-story]')];
  const groups = [...explorer.querySelectorAll<SVGGElement>('[data-connection-path-group]')];
  const status = explorer.querySelector<HTMLElement>('[data-connection-status]');
  let selected = 'nrth-tms';
  let entered = false;

  function animate(element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    if (paused || reduced.matches || document.hidden || !element.animate) return;
    const animation = element.animate(keyframes, options);
    animations.add(animation);
    animation.addEventListener('finish', () => animations.delete(animation), {once: true});
    animation.addEventListener('cancel', () => animations.delete(animation), {once: true});
  }

  function trace(group: SVGGElement) {
    group.querySelectorAll<SVGPathElement>('[data-connection-path]').forEach((path, index) => {
      const length = path.getTotalLength();
      animate(path, [{strokeDasharray: `${length}`, strokeDashoffset: length, opacity: .1}, {strokeDasharray: `${length}`, strokeDashoffset: 0, opacity: .94}], {duration: 920, delay: index * 65, easing: 'cubic-bezier(.16,1,.3,1)'});
    });
  }

  function preview(slug?: string) {
    explorer.toggleAttribute('data-connection-preview', Boolean(slug));
    explorer.querySelectorAll<SVGPathElement>('[data-connection-target]').forEach(path => path.classList.toggle('is-emphasized', path.dataset.connectionTarget === slug));
    explorer.querySelectorAll<HTMLElement>('[data-connection-node]').forEach(node => node.classList.toggle('is-previewed', node.dataset.connectionNode === slug));
  }

  function select(slug: string, announce = true) {
    const story = stories.find(panel => panel.dataset.connectionStory === slug);
    const choice = choices.find(button => button.dataset.connectionChoice === slug);
    if (!story || !choice) return;
    const changed = selected !== slug;
    selected = slug;
    // Interrupt from the visible state; there is no idle animation loop.
    stopAnimations();
    preview();
    const related = new Set([...story.querySelectorAll<HTMLAnchorElement>('.connections-related a')].map(link => link.pathname.split('/').pop()));
    for (const button of choices) {
      const active = button === choice;
      button.setAttribute('aria-pressed', String(active));
      button.tabIndex = active ? 0 : -1;
      button.closest<HTMLElement>('[data-connection-node]')?.classList.toggle('is-connected', related.has(button.dataset.connectionChoice));
    }
    fields.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.connectionField === story.dataset.connectionStoryField)));
    stories.forEach(panel => { panel.hidden = panel !== story; });
    groups.forEach(group => {
      const active = group.dataset.connectionPathGroup === slug;
      group.dataset.connectionPathActive=String(active);
      if (active && changed) trace(group);
    });
    if (changed) animate(story, [{opacity: .2, transform: 'translateY(14px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 540, easing: 'cubic-bezier(.16,1,.3,1)'});
    if (announce && status) status.textContent = `${choice.dataset.connectionName} selected. ${related.size} possible connections. ${story.querySelector('h3')?.textContent || ''}`;
    explorer.dataset.connectionSelected = slug;
  }

  choices.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => select(button.dataset.connectionChoice!));
    button.addEventListener('keydown', event => {
      const directions: Record<string, {x: number; y: number}> = {ArrowRight: {x: 1, y: 0}, ArrowLeft: {x: -1, y: 0}, ArrowDown: {x: 0, y: 1}, ArrowUp: {x: 0, y: -1}};
      const direction = directions[event.key];
      let next: HTMLButtonElement | undefined;
      if (direction) {
        const x = Number(button.dataset.connectionX), y = Number(button.dataset.connectionY);
        next = choices.filter(candidate => candidate !== button).map(candidate => {
          const dx = Number(candidate.dataset.connectionX) - x, dy = Number(candidate.dataset.connectionY) - y;
          const forward = dx * direction.x + dy * direction.y;
          const across = Math.abs(dx * direction.y - dy * direction.x);
          return {candidate, score: forward > 0 ? Math.hypot(dx, dy) + across * 1.8 : Infinity};
        }).sort((a, b) => a.score - b.score).find(item => Number.isFinite(item.score))?.candidate;
      } else if (event.key === 'Home') next = choices[0];
      else if (event.key === 'End') next = choices[choices.length - 1];
      if (direction || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        if (next) { select(next.dataset.connectionChoice!); next.focus({preventScroll: true}); }
      }
    });
  });
  fields.forEach(button => button.addEventListener('click', () => select(button.dataset.connectionSource!)));
  explorer.querySelectorAll<HTMLElement>('[data-connection-related]').forEach(item => {
    item.addEventListener('pointerenter', () => preview(item.dataset.connectionRelated));
    item.addEventListener('pointerleave', () => { if (!item.contains(document.activeElement)) preview(); });
    item.addEventListener('focusin', () => preview(item.dataset.connectionRelated));
    item.addEventListener('focusout', event => { if (!item.contains(event.relatedTarget as Node | null)) preview(); });
  });
  explorer.querySelectorAll<HTMLDetailsElement>('[data-connection-handoff]').forEach(item=>item.addEventListener('toggle',()=>{
    if(item.open){preview(item.dataset.connectionHandoff);explorer.dataset.connectionHandoff=item.dataset.connectionHandoff;}
    else if(explorer.dataset.connectionHandoff===item.dataset.connectionHandoff){preview();delete explorer.dataset.connectionHandoff;}
  }));
  explorer.querySelectorAll<HTMLElement>('[data-connection-static]').forEach(element => { element.hidden = true; });
  explorer.querySelector<HTMLElement>('[data-connection-controls]')!.hidden = false;
  explorer.querySelector<HTMLElement>('[data-connection-stories]')!.hidden = false;
  explorer.querySelector<HTMLElement>('[data-connection-caption]')!.hidden = false;
  explorer.classList.add('is-interactive');
  select(selected, false);
  // The map assembles once as it enters the native scroll flow, then rests.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entered || !entries.some(entry => entry.isIntersecting)) return;
      entered = true;
      observer.disconnect();
      const group = groups.find(item => item.dataset.connectionPathGroup === selected);
      if (group) trace(group);
      choices.forEach((button, index) => {
        const point = button.querySelector('.connection-node-point');
        if (point) animate(point, [{opacity: .15, transform: 'scale(.55)'}, {opacity: 1, transform: 'scale(1)'}], {duration: 620, delay: index * 45, easing: 'cubic-bezier(.16,1,.3,1)'});
      });
    }, {threshold: .14, rootMargin: '0px 0px -5% 0px'});
    observer.observe(explorer.querySelector('.connections-map')!);
  }
}
