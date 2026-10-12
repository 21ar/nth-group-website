export {};

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = document.documentElement.classList.contains('motion-paused');

document.querySelectorAll<HTMLElement>('[data-venture-spotlight]').forEach(section => {
  const controls = section.querySelector<HTMLElement>('[data-spotlight-controls]');
  const tabs = [...section.querySelectorAll<HTMLButtonElement>('[data-spotlight-tab]')];
  const panels = [...section.querySelectorAll<HTMLElement>('[data-spotlight-panel]')];
  const images = [...section.querySelectorAll<HTMLElement>('[data-spotlight-image-motion]')];
  const announcement = section.querySelector<HTMLElement>('[data-spotlight-announcement]');
  const copyButton = section.querySelector<HTMLButtonElement>('[data-spotlight-copy]');
  const copyFeedback = section.querySelector<HTMLElement>('[data-spotlight-copy-feedback]');
  if (!controls || !tabs.length || tabs.length !== panels.length) return;

  let selected = 0;
  let frame = 0;
  let inView = false;
  let imagesWarmed = false;
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  const animations = new Set<Animation>();

  function warmImages() {
    if (imagesWarmed) return;
    imagesWarmed = true;
    section.querySelectorAll<HTMLImageElement>('.spotlight-image img').forEach(image => {
      image.loading = 'eager';
      image.decode().catch(() => {});
    });
  }

  function settle(resetImages = true) {
    animations.forEach(animation => animation.cancel());
    animations.clear();
    panels.forEach(panel => panel.classList.remove('is-leaving'));
    if (resetImages) images.forEach(image => image.style.removeProperty('transform'));
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function animate(element: HTMLElement, keyframes: Keyframe[], duration: number) {
    const animation = element.animate(keyframes, {duration, easing: 'cubic-bezier(.16,1,.3,1)'});
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    return animation;
  }

  function updateFocalPoint() {
    frame = 0;
    if (!inView || paused || reduced.matches || document.hidden) return;
    const figure = panels[selected].querySelector<HTMLElement>('.spotlight-image');
    const image = panels[selected].querySelector<HTMLElement>('[data-spotlight-image-motion]');
    if (!figure || !image) return;
    const bounds = figure.getBoundingClientRect();
    const distance = (bounds.top + bounds.height / 2 - innerHeight / 2) / (innerHeight + bounds.height);
    // The subject moves through the frame by a few pixels as its context comes into view.
    image.style.transform = `translate3d(0,${Math.max(-21, Math.min(21, distance * -42))}px,0)`;
  }

  function requestFocalPoint() {
    if (!frame && inView && !paused && !reduced.matches && !document.hidden) frame = requestAnimationFrame(updateFocalPoint);
  }

  function choose(requested: number, focus = false, updateURL = true, announce = true) {
    const next = (requested + tabs.length) % tabs.length;
    const previous = selected;
    const changed = next !== previous;
    settle(false);
    if (copyFeedback) copyFeedback.textContent = '';
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === next));
      tab.tabIndex = index === next ? 0 : -1;
    });
    panels.forEach((panel, index) => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabs[index].id);
      panel.setAttribute('aria-hidden', String(index !== next));
      panel.inert = index !== next;
      panel.classList.toggle('is-selected', index === next);
      panel.tabIndex = index === next ? 0 : -1;
    });
    selected = next;
    if (changed && !paused && !reduced.matches) {
      const oldFigure = panels[previous].querySelector<HTMLElement>('.spotlight-image');
      const newFigure = panels[next].querySelector<HTMLElement>('.spotlight-image');
      const copy = panels[next].querySelector<HTMLElement>('.spotlight-copy');
      if (oldFigure && newFigure) {
        panels[previous].classList.add('is-leaving');
        animate(oldFigure, [{opacity: 1}, {opacity: 0}], 650).finished.then(() => panels[previous].classList.remove('is-leaving'), () => panels[previous].classList.remove('is-leaving'));
        animate(newFigure, [{opacity: 0}, {opacity: 1}], 650);
      }
      if (copy) animate(copy, [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}], 550);
    }
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('lens', tabs[next].dataset.spotlightTab || 'health');
      history.replaceState(history.state, '', url);
    }
    if (changed && announce && announcement) announcement.textContent = 'Exploring ' + tabs[next].textContent?.trim() + '.';
    if (focus) tabs[next].focus({preventScroll: true});
    requestFocalPoint();
  }

  function restore() {
    const requested = new URLSearchParams(location.search).get('lens');
    const index = tabs.findIndex(tab => tab.dataset.spotlightTab === requested);
    choose(index < 0 ? 0 : index, false, false, false);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(index));
    tab.addEventListener('keydown', event => {
      const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (delta) {event.preventDefault(); choose(index + delta, true);}
      else if (event.key === 'Home' || event.key === 'End') {event.preventDefault(); choose(event.key === 'Home' ? 0 : tabs.length - 1, true);}
    });
  });

  copyButton?.addEventListener('click', async () => {
    const copiedDirection = selected;
    const url = new URL(location.href);
    url.searchParams.set('lens', tabs[selected].dataset.spotlightTab || 'health');
    url.hash = 'closer-to-the-work';
    try {
      await navigator.clipboard.writeText(url.href);
      if (copyFeedback && copiedDirection === selected) copyFeedback.textContent = 'Direction link copied.';
    } catch {
      // Keep the selected direction shareable even when clipboard access is unavailable.
      if (copiedDirection === selected) {
        history.replaceState(history.state, '', url);
        if (copyFeedback) copyFeedback.textContent = 'Direction saved in the address bar.';
      }
    }
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {if (copyFeedback) copyFeedback.textContent = '';}, 7000);
  });

  section.classList.add('is-enhanced');
  restore();
  controls.hidden = false;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      if (inView) warmImages();
      requestFocalPoint();
    }, {rootMargin: '350px 0px'});
    observer.observe(section);
  } else {
    inView = true;
    warmImages();
  }
  window.addEventListener('scroll', requestFocalPoint, {passive: true});
  window.addEventListener('resize', requestFocalPoint, {passive: true});
  window.addEventListener('popstate', restore);
  window.addEventListener('nrth:motion', event => {
    paused = (event as CustomEvent<{paused: boolean}>).detail.paused;
    if (paused) settle(); else requestFocalPoint();
  });
  reduced.addEventListener('change', () => {if (reduced.matches) settle(); else requestFocalPoint();});
  document.addEventListener('visibilitychange', () => {if (document.hidden) settle(); else requestFocalPoint();});
});
