export {};

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = document.documentElement.classList.contains('motion-paused');
const animations = new Set<Animation>();

function stopAnimations() {
  animations.forEach(animation => animation.cancel());
  animations.clear();
}

window.addEventListener('nrth:motion', event => {
  paused = (event as CustomEvent<{ paused: boolean }>).detail.paused;
  if (paused) stopAnimations();
});
reduced.addEventListener('change', () => { if (reduced.matches) stopAnimations(); });

document.querySelectorAll<HTMLElement>('[data-venture-stories]').forEach(stories => {
  const choices = stories.querySelector<HTMLElement>('[data-scenario-choices]');
  const tabs = [...stories.querySelectorAll<HTMLButtonElement>('[data-scenario-choice]')];
  const panels = [...stories.querySelectorAll<HTMLElement>('[data-scenario-panel]')];
  const announcement = stories.querySelector<HTMLElement>('[data-scenario-announcement]');
  if (!choices || !tabs.length || tabs.length !== panels.length) return;

  let selected = 0;
  function choose(requested: number, focus = false, announce = true) {
    const next = (requested + tabs.length) % tabs.length;
    const changed = next !== selected;
    stopAnimations();
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === next));
      tab.tabIndex = index === next ? 0 : -1;
    });
    panels.forEach((panel, index) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabs[index].id);
      panel.setAttribute('aria-hidden', String(index !== next));
      panel.inert = index !== next;
      panel.tabIndex = index === next ? 0 : -1;
    });
    selected = next;
    if (changed && !paused && !reduced.matches) {
      const animation = panels[next].animate([
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    }
    if (announce && changed && announcement) announcement.textContent = 'Scenario changed: ' + tabs[next].textContent?.trim() + '.';
    if (focus) tabs[next].focus({ preventScroll: true });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(index));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
      if (delta) { event.preventDefault(); choose(index + delta, true); }
      else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); choose(event.key === 'Home' ? 0 : tabs.length - 1, true); }
    });
  });
  stories.classList.add('is-enhanced');
  choose(0, false, false);
  choices.hidden = false;
});
