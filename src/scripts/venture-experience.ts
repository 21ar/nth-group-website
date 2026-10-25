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
  let selectedStep = 0;
  const stageSets = panels.map(panel => ({
    flow: panel.querySelector<HTMLOListElement>('[data-ve-step-choices]'),
    buttons: [...panel.querySelectorAll<HTMLButtonElement>('[data-ve-step]')],
    rows: [...panel.querySelectorAll<HTMLElement>('[data-ve-flow-step]')],
    readings: [...panel.querySelectorAll<HTMLElement>('[data-ve-step-panel]')],
    inquiry: panel.querySelector<HTMLAnchorElement>('[data-ve-inquiry]'),
    current: -1,
  }));

  function updateUrl() {
    const url = new URL(location.href);
    url.searchParams.set('context', tabs[selected].dataset.veChoice || '');
    url.searchParams.set('step', String(selectedStep + 1));
    history.replaceState(history.state, '', url);
  }

  function resetShare() {
    if (shareFallback) shareFallback.hidden = true;
    if (share) share.textContent = 'Copy this context';
  }

  function updateProgress() {
    stageSets.forEach(stage => {
      if (!stage.flow || stage.current < 0) return;
      const first = stage.rows[0];
      const active = stage.rows[stage.current];
      if (first && active) stage.flow.style.setProperty('--ve-flow-progress', (active.offsetTop - first.offsetTop) + 'px');
    });
  }

  function chooseStage(panelIndex: number, requested: number, options: { focus?: boolean; updateUrl?: boolean; announce?: boolean; animate?: boolean } = {}) {
    const stage = stageSets[panelIndex];
    if (!stage.flow || stage.buttons.length !== stage.readings.length || !stage.buttons.length) return;
    const next = (requested + stage.buttons.length) % stage.buttons.length;
    const changed = stage.current !== next;
    const initial = stage.current < 0;
    const previousReading = stage.readings[stage.current];
    const restoreFocus = previousReading?.contains(document.activeElement);
    stage.buttons.forEach((button, index) => {
      button.setAttribute('aria-selected', String(index === next));
      button.tabIndex = index === next ? 0 : -1;
      stage.rows[index]?.setAttribute('data-ve-step-state', index === next ? 'current' : index < next ? 'passed' : 'upcoming');
    });
    stage.readings.forEach((reading, index) => {
      reading.setAttribute('aria-hidden', String(index !== next));
      reading.inert = index !== next;
      reading.tabIndex = index === next ? 0 : -1;
    });
    stage.current = next;
    if (panelIndex === selected) selectedStep = next;
    updateProgress();
    if (stage.inquiry) {
      const decision = stage.inquiry.dataset.veDecision || '';
      const stepLabel = ' · step ' + (next + 1) + ': ';
      // Preserve the full decision. Only the context label is shortened if a
      // later editorial change brings the draft near the form's 179 limit.
      const label = (stage.inquiry.dataset.veContextLabel || '').slice(0, Math.max(0, 179 - stepLabel.length - decision.length));
      const url = new URL(stage.inquiry.href);
      url.searchParams.set('topic', label + stepLabel + decision);
      stage.inquiry.href = url.pathname + url.search;
    }
    if (changed && !initial && options.animate !== false && !motionPreference.matches && !motionPaused) {
      rememberAnimation(stage.readings[next].animate([
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }));
    }
    if (panelIndex === selected && options.updateUrl !== false) updateUrl();
    if (options.focus || (changed && restoreFocus)) stage.buttons[next].focus({ preventScroll: true });
    if (panelIndex === selected && changed && !initial && options.announce !== false && status) status.textContent = 'Step ' + (next + 1) + ' of ' + stage.buttons.length + ': ' + stage.buttons[next].textContent?.trim() + '.';
    resetShare();
  }

  stageSets.forEach((stage, panelIndex) => {
    if (!stage.flow || !stage.buttons.length || stage.buttons.length !== stage.readings.length) return;
    stage.flow.setAttribute('role', 'tablist');
    stage.flow.setAttribute('aria-orientation', 'vertical');
    stage.flow.setAttribute('aria-label', 'Explore the stages for ' + (stage.inquiry?.dataset.veContextLabel || 'this work context'));
    stage.rows.forEach(row => row.setAttribute('role', 'presentation'));
    stage.buttons.forEach((button, stepIndex) => {
      button.hidden = false;
      button.setAttribute('role', 'tab');
      button.parentElement?.querySelector<HTMLElement>('[data-ve-step-title]')?.setAttribute('hidden', '');
      const reading = stage.readings[stepIndex];
      reading.setAttribute('role', 'tabpanel');
      reading.setAttribute('aria-labelledby', button.id);
      button.addEventListener('click', () => {
        cancelAnimations();
        chooseStage(panelIndex, stepIndex);
      });
      button.addEventListener('keydown', event => {
        const delta = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0;
        if (delta) {
          event.preventDefault();
          cancelAnimations();
          chooseStage(panelIndex, stepIndex + delta, { focus: true });
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          cancelAnimations();
          chooseStage(panelIndex, event.key === 'Home' ? 0 : stage.buttons.length - 1, { focus: true });
        }
      });
    });
    chooseStage(panelIndex, 0, { updateUrl: false, announce: false, animate: false });
  });

  function choose(requested: number, options: { focus?: boolean; updateUrl?: boolean; announce?: boolean; step?: number } = {}) {
    const next = (requested + tabs.length) % tabs.length;
    const changed = selected !== next;
    const initial = selected < 0;
    const previousPanel = panels[selected];
    const restoreFocus = previousPanel?.contains(document.activeElement);
    const nextStep = options.step ?? (changed ? 0 : selectedStep);
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
    chooseStage(next, nextStep, { updateUrl: false, announce: false, animate: false });
    if (changed && !initial && !motionPreference.matches && !motionPaused) {
      rememberAnimation(panels[next].animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }));
    }
    if (options.updateUrl !== false) updateUrl();
    if (options.focus || (changed && restoreFocus)) tabs[next].focus({ preventScroll: true });
    if (changed && !initial && options.announce !== false && status) status.textContent = 'Work context: ' + tabs[next].textContent?.trim() + '. Step ' + (selectedStep + 1) + ' of 3.';
    resetShare();
  }

  function readUrl() {
    const url = new URL(location.href);
    const context = url.searchParams.get('context');
    const index = tabs.findIndex(tab => tab.dataset.veChoice === context);
    const step = url.searchParams.get('step') || '';
    choose(index < 0 ? 0 : index, { step: index >= 0 && /^[123]$/.test(step) ? Number(step) - 1 : 0, updateUrl: false, announce: false });
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
  window.addEventListener('resize', updateProgress, { passive: true });
  document.fonts.ready.then(updateProgress);

  if (share) {
    share.hidden = false;
    share.addEventListener('click', async () => {
      const context = tabs[selected].dataset.veChoice || '';
      const step = selectedStep;
      const url = new URL(location.href);
      url.searchParams.set('context', context);
      url.searchParams.set('step', String(step + 1));
      url.hash = experience.querySelector<HTMLElement>('[data-ve-context]')?.id || '';
      try {
        await navigator.clipboard.writeText(url.href);
        if (tabs[selected].dataset.veChoice !== context || selectedStep !== step) return;
        share.textContent = 'Link copied';
        if (status) status.textContent = 'The link to this work context and step ' + (step + 1) + ' has been copied.';
      } catch {
        if (tabs[selected].dataset.veChoice !== context || selectedStep !== step) return;
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
