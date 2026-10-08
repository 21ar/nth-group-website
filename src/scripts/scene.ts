// Progressive graphics: the canonical SVG and HTML work before this module loads.
const host = document.querySelector<HTMLElement>('[data-hero-scene]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let started = false;
async function start() {
  if (!host || started || reduced.matches || document.documentElement.classList.contains('motion-paused')) return;
  started = true;
  try {
    const {startScene} = await import('./scene-webgl');
    if (!await startScene(host)) await import('./scene-canvas');
  } catch {
    host.querySelector('.scene-canvas')?.replaceChildren();
    host.dataset.sceneState = 'fallback';
    await import('./scene-canvas');
  }
}
window.addEventListener('nrth:motion', start);
reduced.addEventListener('change', start);
void start();
export {};
