export {};

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = document.documentElement.classList.contains('motion-paused');
const runningAnimations = new Set<Animation>();
const scenes = new Set<{ element: HTMLElement; image: HTMLImageElement }>();
let frame = 0;

function cancelAnimations() {
  runningAnimations.forEach(animation => animation.cancel());
  runningAnimations.clear();
}

function updateImages() {
  frame = 0;
  scenes.forEach(scene => {
    if (motionPaused || motionPreference.matches) {
      scene.image.style.removeProperty('transform');
      scene.image.style.removeProperty('will-change');
      scene.element.style.removeProperty('--ve-aperture');
      return;
    }
    const bounds = scene.element.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) {
      scene.image.style.removeProperty('will-change');
      return;
    }
    // The photograph gently opens as it enters the reader's view. The range is
    // intentionally small so that the artwork stays legible at every position.
    const progress = Math.max(0, Math.min(1, (innerHeight - bounds.top) / (innerHeight + bounds.height)));
    const drift = Math.min(22, bounds.height * 0.015);
    scene.image.style.willChange = 'transform';
    scene.image.style.transform = `translate3d(0, ${(0.5 - progress) * drift}px, 0) scale(${1.045 - progress * 0.025})`;
    scene.element.style.setProperty('--ve-aperture', `${Math.max(0, 3.4 - progress * 6.8)}%`);
  });
}

function scheduleImageUpdate() {
  if (!frame) frame = requestAnimationFrame(updateImages);
}

function rememberAnimation(animation: Animation) {
  runningAnimations.add(animation);
  animation.finished.then(() => runningAnimations.delete(animation), () => runningAnimations.delete(animation));
}

window.addEventListener('nrth:motion', event => {
  motionPaused = (event as CustomEvent<{ paused: boolean }>).detail.paused;
  if (motionPaused) cancelAnimations();
  scheduleImageUpdate();
});
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) cancelAnimations();
  scheduleImageUpdate();
});

document.querySelectorAll<HTMLElement>('[data-venture-experience]').forEach(experience => {
  const choices = experience.querySelector<HTMLElement>('[data-ve-choices]');
  const tabs = [...experience.querySelectorAll<HTMLButtonElement>('[data-ve-choice]')];
  const panels = [...experience.querySelectorAll<HTMLElement>('[data-ve-panel]')];
  const status = experience.querySelector<HTMLElement>('[data-ve-status]');
  const share = experience.querySelector<HTMLButtonElement>('[data-ve-share]');
  const shareFallback = experience.querySelector<HTMLElement>('[data-ve-share-fallback]');
  const shareInput = experience.querySelector<HTMLInputElement>('[data-ve-share-input]');
  const imageElement = experience.querySelector<HTMLElement>('[data-ve-image]');
  const image = imageElement?.querySelector<HTMLImageElement>('img');
  if (imageElement && image) scenes.add({ element: imageElement, image });
  const visualDialog = experience.querySelector<HTMLDialogElement>('[data-ve-image-dialog]');
  const visualOpen = experience.querySelector<HTMLButtonElement>('[data-ve-image-open]');
  const visualLink = experience.querySelector<HTMLAnchorElement>('[data-ve-image-link]');
  const visualClose = experience.querySelector<HTMLButtonElement>('[data-ve-image-close]');
  const visualViewport = experience.querySelector<HTMLElement>('[data-ve-image-viewport]');
  const zoom = experience.querySelector<HTMLInputElement>('[data-ve-image-zoom]');
  const zoomValue = experience.querySelector<HTMLOutputElement>('[data-ve-image-zoom-value]');
  if (visualDialog && visualOpen && visualClose && visualViewport && zoom && typeof visualDialog.showModal === 'function') {
    let previousOverflow = '';
    let magnification = 1;
    visualOpen.hidden = false;
    if (visualLink) visualLink.hidden = true;
    visualOpen.addEventListener('click', () => {
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      visualDialog.showModal();
      visualDialog.scrollTop = 0;
      visualViewport.scrollTo(0, 0);
    });
    visualClose.addEventListener('click', () => visualDialog.close());
    visualDialog.addEventListener('click', event => {
      const bounds = visualDialog.getBoundingClientRect();
      if (event.target === visualDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) visualDialog.close();
    });
    visualDialog.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow;
      magnification = 1;
      zoom.value = '100';
      zoom.setAttribute('aria-valuetext', '100 percent');
      if (zoomValue) zoomValue.value = '100%';
      visualViewport.style.removeProperty('--ve-zoom');
      visualOpen.focus({ preventScroll: true });
    });
    zoom.addEventListener('input', () => {
      const next = Number(zoom.value) / 100;
      const ratio = next / magnification;
      const centerX = visualViewport.scrollLeft + visualViewport.clientWidth / 2;
      const centerY = visualViewport.scrollTop + visualViewport.clientHeight / 2;
      visualViewport.style.setProperty('--ve-zoom', String(next));
      visualViewport.scrollLeft = centerX * ratio - visualViewport.clientWidth / 2;
      visualViewport.scrollTop = centerY * ratio - visualViewport.clientHeight / 2;
      magnification = next;
      zoom.setAttribute('aria-valuetext', zoom.value + ' percent');
      if (zoomValue) zoomValue.value = zoom.value + '%';
    });
  }
  if (!choices || !tabs.length || tabs.length !== panels.length) return;
  const verticalLayout = matchMedia('(max-width: 767px)');
  const updateOrientation = () => choices.setAttribute('aria-orientation', verticalLayout.matches ? 'vertical' : 'horizontal');
  updateOrientation();
  verticalLayout.addEventListener('change', updateOrientation);

  let selected = -1;
  function choose(requested: number, options: { focus?: boolean; updateUrl?: boolean; announce?: boolean } = {}) {
    const next = (requested + tabs.length) % tabs.length;
    const changed = selected !== next;
    const initial = selected < 0;
    cancelAnimations();
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
    if (changed && !initial && !motionPreference.matches && !motionPaused) {
      rememberAnimation(panels[next].animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }));
    }
    if (options.updateUrl !== false) {
      const url = new URL(location.href);
      url.searchParams.set('context', tabs[next].dataset.veChoice || '');
      history.replaceState(history.state, '', url);
    }
    if (options.focus) tabs[next].focus({ preventScroll: true });
    if (changed && !initial && options.announce !== false && status) status.textContent = 'Work context: ' + tabs[next].textContent?.trim() + '.';
    if (shareFallback) shareFallback.hidden = true;
    if (share) share.textContent = 'Copy this context';
  }

  function readUrl() {
    const context = new URL(location.href).searchParams.get('context');
    const index = tabs.findIndex(tab => tab.dataset.veChoice === context);
    choose(index < 0 ? 0 : index, { updateUrl: false, announce: false });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(index));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (delta) {
        event.preventDefault();
        choose(index + delta, { focus: true });
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        choose(event.key === 'Home' ? 0 : tabs.length - 1, { focus: true });
      }
    });
  });
  experience.classList.add('is-enhanced');
  choices.hidden = false;
  readUrl();
  window.addEventListener('popstate', readUrl);

  if (share) {
    share.hidden = false;
    share.addEventListener('click', async () => {
      const context = tabs[selected].dataset.veChoice || '';
      const url = new URL(location.href);
      url.searchParams.set('context', context);
      url.hash = experience.querySelector<HTMLElement>('[data-ve-context]')?.id || '';
      try {
        await navigator.clipboard.writeText(url.href);
        if (tabs[selected].dataset.veChoice !== context) return;
        share.textContent = 'Link copied';
        if (status) status.textContent = 'The link to this work context has been copied.';
      } catch {
        if (tabs[selected].dataset.veChoice !== context) return;
        if (shareFallback && shareInput) {
          shareFallback.hidden = false;
          shareInput.value = url.href;
          shareInput.focus({ preventScroll: true });
          shareInput.select();
          if (status) status.textContent = 'Select and copy the context link below.';
        }
      }
    });
  }
});

if (scenes.size) {
  addEventListener('scroll', scheduleImageUpdate, { passive: true });
  addEventListener('resize', scheduleImageUpdate, { passive: true });
  scheduleImageUpdate();
}
