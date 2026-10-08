const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const story = document.querySelector<HTMLElement>('[data-story]');
const chapters = [...document.querySelectorAll<HTMLElement>('[data-story-chapter]')];
const nav = story?.querySelector<HTMLElement>('.industry-nav');
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (a: number, b: number, v: number) => {const p = clamp((v - a) / (b - a)); return p * p * (3 - 2 * p);};
let disabled = reduce.matches || root.classList.contains('motion-paused');
let progress = 0, target = 0, frame = 0, lastPaint = 0, currentChapter = -1;
let storyStart = 0, storyRange = 1;
let chapterAnimation: Animation | undefined;
const features = [...document.querySelectorAll<HTMLElement>('[data-scroll-feature]')];
let featureMetrics: {element: HTMLElement; top: number; height: number}[] = [];
function measure() {
  if (story) {storyStart = story.getBoundingClientRect().top + scrollY; storyRange = Math.max(1, story.offsetHeight - innerHeight);}
  featureMetrics = features.map(element => ({element, top: element.getBoundingClientRect().top + scrollY, height: element.offsetHeight}));
}
function showChapter(active: number, animate: boolean) {
  if (active === currentChapter) return;
  const direction = active < currentChapter ? -1 : 1;
  chapterAnimation?.cancel();
  chapters.forEach((chapter, i) => {chapter.classList.toggle('is-current', i === active); chapter.inert = i !== active; chapter.setAttribute('aria-hidden', String(i !== active));});
  currentChapter = active;
  if (story) story.dataset.chapter = String(active);
  // Copy stays opaque at every resting scroll position. Only its position moves.
  if (animate && !disabled) chapterAnimation = chapters[active]?.querySelector('h1,h2')?.animate([{transform: 'translateY(' + direction * 14 + 'px)'}, {transform: 'translateY(0)'}], {duration: 480, easing: 'cubic-bezier(.22,1,.36,1)'});
}
function palette(dark: number, inView: boolean) {
  const bg = [243, 241, 236].map((v, i) => Math.round(v + ([22, 24, 30][i] - v) * dark));
  const onDark = dark > .57;
  const fg = onDark ? Math.round(255 - 11 * smooth(.7, 1, dark)) : Math.round(23 * (1 - smooth(0, .35, dark)));
  const muted = onDark ? Math.round(255 - 66 * smooth(.7, 1, dark)) : Math.round(94 * (1 - smooth(0, .32, dark)));
  story?.style.setProperty('--story-bg', 'rgb(' + bg.join(' ') + ')');
  story?.style.setProperty('--story-fg', 'rgb(' + [fg, fg, fg].join(' ') + ')');
  story?.style.setProperty('--story-muted', 'rgb(' + [muted, muted, muted].join(' ') + ')');
  root.classList.toggle('story-in-view', inView);
  if (inView) {
    root.style.setProperty('--header-surface', 'rgb(' + bg.join(' ') + ' / .88)');
    root.style.setProperty('--header-ink', 'rgb(' + [fg, fg, fg].join(' ') + ')');
    root.style.setProperty('--header-icon-filter', onDark ? 'invert(1)' : 'none');
  } else ['--header-surface', '--header-ink', '--header-icon-filter'].forEach(name => root.style.removeProperty(name));
}
function paint(time: number) {
  frame = 0;
  if (disabled) return;
  const delta = lastPaint ? Math.min(time - lastPaint, 100) : 16; lastPaint = time;
  progress += (target - progress) * (1 - Math.exp(-delta / 75));
  if (Math.abs(target - progress) < .00015) progress = target;
  if (story) {
    const dark = smooth(.13, .22, progress) * (1 - smooth(.88, .985, progress));
    palette(dark, scrollY < storyStart + storyRange + innerHeight - 100);
    story.style.setProperty('--story-progress', String(progress)); showChapter(Math.round(progress * 9), true);
    if (nav) {const shown = smooth(.055, .115, progress); nav.style.opacity = String(shown); nav.inert = shown < .95; nav.setAttribute('aria-hidden', String(shown < .95)); nav.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-current', String(currentChapter === i + 3)));}
    const bar = story.querySelector<HTMLElement>('[data-story-progress]'); if (bar) bar.style.transform = 'scaleX(' + progress + ')';
    const label = story.querySelector('[data-story-label]'); if (label) label.textContent = currentChapter < 3 ? 'Scroll to discover' : currentChapter < 9 ? 'Explore the industries' : 'Continue to the ventures';
    story.dataset.motionProgress = progress.toFixed(4);
    window.dispatchEvent(new CustomEvent('nrth:story', {detail: {progress, dark}}));
  }
  featureMetrics.forEach(({element, top, height}) => {if (top + height < scrollY || top > scrollY + innerHeight) return; element.style.setProperty('--feature-progress', String(clamp((innerHeight - top + scrollY) / (innerHeight + height))));});
  if (Math.abs(target - progress) > .00015) frame = requestAnimationFrame(paint);
}
function update() {if (disabled) return; if (story) target = clamp((scrollY - storyStart) / storyRange); if (!frame) frame = requestAnimationFrame(paint);}
function sync() {
  const wasDisabled = disabled, wasProgress = progress, previousEnd = storyStart + storyRange + innerHeight;
  disabled = reduce.matches || root.classList.contains('motion-paused'); root.classList.toggle('motion-active', !disabled); measure();
  if (disabled) {if (frame) cancelAnimationFrame(frame); frame = 0; progress = target = 0; chapterAnimation?.cancel(); currentChapter = -1; showChapter(0, false); palette(0, false); if(story) story.dataset.motionProgress = '0'; window.dispatchEvent(new CustomEvent('nrth:story',{detail:{progress:0,dark:0}})); if (!wasDisabled && wasProgress > .01 && story && scrollY < previousEnd) scrollTo({top: story.offsetTop, behavior: 'instant'});} else update();
}
window.addEventListener('scroll', update, {passive: true});
window.addEventListener('resize', () => {measure(); update();});
window.addEventListener('nrth:motion', sync); reduce.addEventListener('change', sync);
window.addEventListener('pageshow', () => {measure(); update();});
document.querySelectorAll<HTMLButtonElement>('[data-industry]').forEach(button => button.addEventListener('click', () => {if (disabled) return; measure(); scrollTo({top: storyStart + storyRange * (Number(button.dataset.industry) + 3) / 9, behavior: 'smooth'});}));
const fine = matchMedia('(hover:hover) and (pointer:fine)');
document.querySelectorAll<HTMLElement>('.explorer-image,.project-card-image,.editorial-image,.venture-art').forEach(element => {
  let id = 0, px = 0, py = 0, x = 0, y = 0, last = 0;
  function tick(time: number) {id = 0; if (disabled || !fine.matches) return; const t = 1 - Math.exp(-Math.min(time - last || 16, 100) / 120); last = time; x += (px - x) * t; y += (py - y) * t; element.style.setProperty('--pointer-x', String(x)); element.style.setProperty('--pointer-y', String(y)); if (Math.abs(px - x) + Math.abs(py - y) > .002) id = requestAnimationFrame(tick);}
  element.addEventListener('pointermove', event => {if (disabled || !fine.matches) return; const box = element.getBoundingClientRect(); px = clamp((event.clientX - box.left) / box.width) - .5; py = clamp((event.clientY - box.top) / box.height) - .5; if (!id) id = requestAnimationFrame(tick);});
  element.addEventListener('pointerleave', () => {px = py = 0; if (!id && !disabled) id = requestAnimationFrame(tick);});
  window.addEventListener('nrth:motion', () => {if (!disabled) return; if (id) cancelAnimationFrame(id); id = 0; x = y = px = py = 0; element.style.removeProperty('--pointer-x'); element.style.removeProperty('--pointer-y');});
});
measure(); sync(); document.fonts.ready.then(() => {measure(); update();});
if (document.querySelector('main')) new ResizeObserver(() => {measure(); update();}).observe(document.querySelector('main')!);
export {};
