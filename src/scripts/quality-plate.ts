export {};

type PlateState = {element: HTMLElement; host: HTMLElement | null; inView: boolean; initialized: boolean; visible: boolean; assembly: number; target: number; x: number; y: number; targetX: number; targetY: number; frame: number; previous: number;};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const plates: PlateState[] = [...document.querySelectorAll<HTMLElement>('[data-quality-plate]')].map(element => ({element, host: element.closest<HTMLElement>('[data-index-art]'), inView: false, initialized: false, visible: false, assembly: 1, target: 1, x: 0, y: 0, targetX: 0, targetY: 0, frame: 0, previous: 0}));
let paused = reduced.matches || document.documentElement.classList.contains('motion-paused');
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);

function paint(state: PlateState) {
  state.element.style.setProperty('--plate-assembly', state.assembly.toFixed(4));
  state.element.style.setProperty('--plate-rest', (1 - state.assembly).toFixed(4));
  state.element.style.setProperty('--plate-x', `${state.x.toFixed(2)}px`);
  state.element.style.setProperty('--plate-y', `${state.y.toFixed(2)}px`);
}
function position(state: PlateState) {
  const rect = state.element.getBoundingClientRect();
  state.target = ease(clamp((innerHeight * .91 - rect.top) / (innerHeight * .6 + rect.height * .28)));
}
function wake(state: PlateState) {
  if (paused || !state.visible || document.hidden || state.frame) return;
  state.previous = 0;
  state.frame = requestAnimationFrame(time => draw(state, time));
}
function stop(state: PlateState) {
  if (state.frame) cancelAnimationFrame(state.frame);
  state.frame = 0;state.previous = 0;
}
function visibility(state: PlateState) {
  state.visible = state.inView && (!state.host || state.host.classList.contains('is-active'));
  if (!state.visible) {stop(state);return;}
  position(state);
  if (!state.initialized && !paused) {state.initialized = true;state.assembly = state.target;paint(state);}
  wake(state);
}
function draw(state: PlateState, time: number) {
  state.frame = 0;
  if (paused || !state.visible || document.hidden) return;
  const delta = state.previous ? Math.min(40, time - state.previous) : 16;
  state.previous = time;
  const smoothing = 1 - Math.exp(-delta * .012);
  state.assembly += (state.target - state.assembly) * smoothing;
  state.x += (state.targetX - state.x) * smoothing;
  state.y += (state.targetY - state.y) * smoothing;
  const settled = Math.abs(state.target - state.assembly) < .0008 && Math.abs(state.targetX - state.x) < .035 && Math.abs(state.targetY - state.y) < .035;
  if (settled) {state.assembly = state.target;state.x = state.targetX;state.y = state.targetY;}
  paint(state);
  if (!settled) state.frame = requestAnimationFrame(next => draw(state, next));
}
function settle() {
  paused = reduced.matches || document.documentElement.classList.contains('motion-paused');
  plates.forEach(state => {
    stop(state);
    if (paused) {state.assembly = 1;state.x = state.y = state.targetX = state.targetY = 0;paint(state);}
    else if (state.visible) {position(state);wake(state);}
  });
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const state = plates.find(item => item.element === entry.target);
    if (!state) return;
    state.inView = entry.isIntersecting;
    visibility(state);
  }), {rootMargin: '60px 0px', threshold: 0});
  plates.forEach(state => observer.observe(state.element));
}
// Portfolio previews overlap in one sticky area. Only the selected preview works.
const hosts = new Map<HTMLElement, PlateState>();
plates.forEach(state => {if (state.host) hosts.set(state.host, state);});
const hostObserver = new MutationObserver(changes => changes.forEach(change => {
  const state = hosts.get(change.target as HTMLElement);
  if (state) visibility(state);
}));
hosts.forEach((_, host) => hostObserver.observe(host, {attributes: true, attributeFilter: ['class']}));
plates.forEach(state => {
  state.element.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || paused) return;
    const rect = state.element.getBoundingClientRect();
    state.targetX = ((event.clientX - rect.left) / rect.width - .5) * 17;
    state.targetY = ((event.clientY - rect.top) / rect.height - .5) * 11;
    wake(state);
  });
  state.element.addEventListener('pointerleave', () => {state.targetX = state.targetY = 0;wake(state);});
  // Linked cards can carry focus; artwork itself adds no needless tab stop.
  state.element.closest('a')?.addEventListener('focus', () => {state.targetY = -3;wake(state);});
  state.element.closest('a')?.addEventListener('blur', () => {state.targetX = state.targetY = 0;wake(state);});
});
let scrollFrame = 0;
function updateVisible() {
  if (scrollFrame || paused || document.hidden) return;
  scrollFrame = requestAnimationFrame(() => {scrollFrame = 0;plates.forEach(state => {if (state.visible) {position(state);wake(state);}});});
}
addEventListener('scroll', updateVisible, {passive: true});
addEventListener('resize', updateVisible, {passive: true});
addEventListener('nrth:motion', settle);
reduced.addEventListener('change', settle);
document.addEventListener('visibilitychange', () => {if (document.hidden) plates.forEach(stop);else updateVisible();});
addEventListener('pagehide', () => {plates.forEach(stop);if(scrollFrame)cancelAnimationFrame(scrollFrame);});
settle();
