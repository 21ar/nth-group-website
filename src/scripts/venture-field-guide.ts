export {};

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = document.documentElement.classList.contains('motion-paused');
const animations = new Set<Animation>();

function stopAnimations() {
  animations.forEach(animation => animation.cancel());
  animations.clear();
}

function trackAnimation(animation: Animation) {
  animations.add(animation);
  animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
}

window.addEventListener('nrth:motion', event => {
  paused = (event as CustomEvent<{ paused: boolean }>).detail.paused;
  if (paused) stopAnimations();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) stopAnimations();
});

document.querySelectorAll<HTMLElement>('[data-venture-field-guide]').forEach(section => {
  const areas = [...section.querySelectorAll<HTMLDetailsElement>('[data-vfg-area]')];
  const status = section.querySelector<HTMLElement>('[data-vfg-status]');
  const openStates = new WeakMap<HTMLDetailsElement, boolean>();

  function resetShare(area: HTMLDetailsElement) {
    const share = area.querySelector<HTMLButtonElement>('[data-vfg-share]');
    const fallback = area.querySelector<HTMLElement>('[data-vfg-share-fallback]');
    if (share) share.textContent = 'Copy this area';
    if (fallback) fallback.hidden = true;
  }

  function restoreArea() {
    const url = new URL(location.href);
    const requested = areas.find(area => area.dataset.vfgArea === url.searchParams.get('guide'));
    const anchor = areas.find(area => '#' + area.id === url.hash);
    const selected = requested || anchor || areas[0];
    areas.forEach(area => {
      area.open = area === selected;
      openStates.set(area, area.open);
      resetShare(area);
    });
  }

  // Setting native open properties can queue toggle events. Remember the
  // restored state before listening so those events cannot rewrite the URL.
  restoreArea();
  window.addEventListener('popstate', restoreArea);
  window.addEventListener('hashchange', restoreArea);

  areas.forEach(area => {
    const share = area.querySelector<HTMLButtonElement>('[data-vfg-share]');
    const fallback = area.querySelector<HTMLElement>('[data-vfg-share-fallback]');
    const input = area.querySelector<HTMLInputElement>('[data-vfg-share-input]');
    area.addEventListener('toggle', () => {
      const changed = openStates.get(area) !== area.open;
      openStates.set(area, area.open);
      resetShare(area);
      if (!changed) return;
      const url = new URL(location.href);
      if (area.open) {
        url.searchParams.set('guide', area.dataset.vfgArea || '');
      } else if (url.searchParams.get('guide') === area.dataset.vfgArea) {
        const otherOpen = areas.find(candidate => candidate.open);
        if (otherOpen) url.searchParams.set('guide', otherOpen.dataset.vfgArea || '');
        else url.searchParams.delete('guide');
      }
      // replaceState preserves the current reading position and all other
      // venture selections; native disclosures remain independently usable.
      history.replaceState(history.state, '', url);
    });
    if (!share) return;
    share.hidden = false;
    share.addEventListener('click', async () => {
      const url = new URL(location.href);
      url.searchParams.set('guide', area.dataset.vfgArea || '');
      url.hash = area.id;
      try {
        await navigator.clipboard.writeText(url.href);
        if (!area.open) return;
        share.textContent = 'Link copied';
        if (status) status.textContent = 'The link to ' + area.querySelector('.vfg-area-title')?.textContent?.trim() + ' has been copied.';
      } catch {
        if (!area.open) return;
        if (fallback && input) {
          fallback.hidden = false;
          input.value = url.href;
          input.focus({ preventScroll: true });
          input.select();
          if (status) status.textContent = 'Select and copy the area link below.';
        }
      }
    });
  });

  const choices = section.querySelector<HTMLElement>('[data-vfg-art-choices]');
  const tabs = [...section.querySelectorAll<HTMLButtonElement>('[data-vfg-art-choice]')];
  const panels = [...section.querySelectorAll<HTMLElement>('[data-vfg-art-panel]')];
  const image = section.querySelector<HTMLImageElement>('[data-vfg-art-window] img');
  const fullView = section.querySelector<HTMLButtonElement>('[data-vfg-full-view]');
  if (!choices || !image || !tabs.length || tabs.length !== panels.length) return;
  image.dataset.vfgImage = '';
  let selected = -1;
  let wholeVisual = false;
  let imageAnimation: Animation | undefined;
  let panelAnimation: Animation | undefined;

  function focusTransform(index: number) {
    const scale = Math.max(1, Math.min(2, Number(tabs[index].dataset.vfgScale) || 1));
    const x = Math.max(0, Math.min(100, Number(tabs[index].dataset.vfgFocusX) || 50)) / 100;
    const y = Math.max(0, Math.min(100, Number(tabs[index].dataset.vfgFocusY) || 50)) / 100;
    const allowance = (scale - 1) / 2;
    const translateX = Math.max(-allowance, Math.min(allowance, scale * (0.5 - x))) * 100;
    const translateY = Math.max(-allowance, Math.min(allowance, scale * (0.5 - y))) * 100;
    return `translate3d(${translateX}%, ${translateY}%, 0) scale(${scale})`;
  }

  function frameArtwork(animate: boolean) {
    const from = getComputedStyle(image!).transform;
    imageAnimation?.cancel();
    const target = wholeVisual ? 'translate3d(0, 0, 0) scale(1)' : focusTransform(selected);
    image!.style.transform = target;
    if (animate && !paused && !reducedMotion.matches) {
      imageAnimation = image!.animate([{ transform: from }, { transform: target }], { duration: 800, easing: 'cubic-bezier(.16,1,.3,1)' });
      trackAnimation(imageAnimation);
    }
    if (fullView) {
      fullView.setAttribute('aria-pressed', String(wholeVisual));
      fullView.textContent = wholeVisual ? 'Return to the detail' : 'View the whole visual';
    }
  }

  function choose(requested: number, focus = false) {
    const next = (requested + tabs.length) % tabs.length;
    const initial = selected < 0;
    const changed = selected !== next;
    panelAnimation?.cancel();
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
    wholeVisual = false;
    frameArtwork(!initial && changed);
    if (changed && !initial && !paused && !reducedMotion.matches) {
      panelAnimation = panels[next].animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      trackAnimation(panelAnimation);
    }
    if (focus) tabs[next].focus({ preventScroll: true });
    if (changed && !initial && status) status.textContent = 'Artwork detail: ' + tabs[next].textContent?.trim() + '.';
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(index));
    tab.addEventListener('keydown', event => {
      const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
      if (direction) {
        event.preventDefault();
        choose(index + direction, true);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        choose(event.key === 'Home' ? 0 : tabs.length - 1, true);
      }
    });
  });
  choices.hidden = false;
  section.classList.add('is-enhanced');
  choose(0);
  if (fullView) {
    fullView.hidden = false;
    fullView.addEventListener('click', () => {
      wholeVisual = !wholeVisual;
      frameArtwork(true);
      if (status) status.textContent = wholeVisual ? 'The whole artwork is visible.' : 'Returned to the selected artwork detail.';
    });
  }
});
