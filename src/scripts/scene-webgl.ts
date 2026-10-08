import {
  WebGLRenderer, Scene, OrthographicCamera, BufferGeometry, BufferAttribute,
  Mesh, MeshStandardMaterial, SphereGeometry, MeshBasicMaterial, PMREMGenerator,
  ACESFilmicToneMapping, SRGBColorSpace, Vector3, DynamicDrawUsage,
} from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {geometry} from '../data/geometry-baked';

const SAMPLES = 192, POINTS = 192, SIDES = 8, TAU = Math.PI * 2;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => {v = clamp(v); return v * v * v * (v * (v * 6 - 15) + 10);};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const names = ['Identity / N–R–T–H', 'Four independent forms', 'A shared connection', 'Health / care, connected', 'Mobility / four shared routes', 'Systems / a connected frame', 'Materials / a new composition', 'Events / a gathering place', 'Research / room to explore', 'The next connection'];

function decode() {
  const bytes = Uint8Array.from(atob(geometry), c => c.charCodeAt(0));
  const data = new Int16Array(bytes.buffer);
  return Array.from({length: 10}, (_, pose) => Array.from({length: 4}, (_, strand) => Array.from({length: SAMPLES}, (_, point) => {
    const offset = ((pose * 4 + strand) * SAMPLES + point) * 3;
    return new Vector3(data[offset] / 1000, data[offset + 1] / 1000, data[offset + 2] / 1000);
  })));
}

function makeTube() {
  const positions = new Float32Array((POINTS + 1) * SIDES * 3);
  const normals = new Float32Array(positions.length);
  const indices = new Uint16Array(POINTS * SIDES * 6);
  let offset = 0;
  for (let j = 0; j < POINTS; j++) for (let k = 0; k < SIDES; k++) {
    const a = j * SIDES + k, b = j * SIDES + (k + 1) % SIDES;
    indices.set([a, b, a + SIDES, b, b + SIDES, a + SIDES], offset); offset += 6;
  }
  const tube = new BufferGeometry();
  tube.setAttribute('position', new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
  tube.setAttribute('normal', new BufferAttribute(normals, 3).setUsage(DynamicDrawUsage));
  tube.setIndex(new BufferAttribute(indices, 1));
  return tube;
}

export async function startScene(host: HTMLElement) {
  const renderer = new WebGLRenderer({alpha: true, antialias: true, powerPreference: 'low-power'});
  const gl = renderer.getContext(), debug = gl.getExtension('WEBGL_debug_renderer_info');
  // Software rasterizers cannot sustain this material at useful resolution.
  // Select the same spline story before painting, rather than degrading mid-scroll.
  if (debug && /swiftshader|llvmpipe|software/i.test(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL))) {
    host.dataset.graphics = 'software';
    renderer.dispose();
    return false;
  }
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new Scene();
  const camera = new OrthographicCamera(-6, 6, 4, -4, .1, 100);
  const room = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .06);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  const metal = new MeshStandardMaterial({color: 0xc3c7ce, metalness: 1, roughness: .23, envMapIntensity: 1.25});
  const meshes = Array.from({length: 4}, () => {
    const mesh = new Mesh(makeTube(), metal); mesh.frustumCulled = false; scene.add(mesh); return mesh;
  });
  const dotGeometry = new SphereGeometry(.045, 10, 8);
  const dotMaterial = new MeshBasicMaterial({color: 0xd8bd94});
  const dots = Array.from({length: 4}, () => {const dot = new Mesh(dotGeometry, dotMaterial); scene.add(dot); return dot;});
  const poses = decode();
  const curves = Array.from({length: 4}, () => Array.from({length: POINTS}, () => new Vector3()));
  const tangent = new Vector3(), normal = new Vector3(), binormal = new Vector3();
  const around = Array.from({length: SIDES}, (_, k) => [Math.cos(k / SIDES * TAU), Math.sin(k / SIDES * TAU)]);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.querySelector('.scene-canvas')!.append(canvas);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const story = host.closest<HTMLElement>('[data-story]');
  let progress = Number(story?.dataset.motionProgress) || 0;
  let paused = reduced.matches || document.documentElement.classList.contains('motion-paused');
  let visible = true, disposed = false, frame = 0, last = 0, lastDraw = 0, slow = 0, quality = 1;
  let px = 0, py = 0, x = 0, y = 0, width = host.clientWidth, height = host.clientHeight;
  let chapterEnds: number[] = [], navTop = height - 150;

  function measure() {
    width = host.clientWidth; height = host.clientHeight;
    chapterEnds = [...document.querySelectorAll<HTMLElement>('[data-story-chapter]')].map(el => el.offsetTop + el.offsetHeight);
    navTop = document.querySelector<HTMLElement>('.industry-nav')?.offsetTop || height - 150;
    const top = Math.max((chapterEnds[0] || height * .4) + 24, height * .49);
    host.style.setProperty('--identity-top', top + 'px');
    const ratio = Math.min(devicePixelRatio, 1.25);
    renderer.setSize(Math.round(Math.min(width * ratio, 900) * quality), Math.round(Math.min(height * .7 * ratio, 540) * quality), false);
  }

  function render(time: number, delta: number) {
    const renderStart = performance.now();
    const phase = progress * 9, index = Math.min(8, Math.floor(phase)), blend = ease(phase - index);
    const travel = ease(clamp(phase));
    x += (px * .16 - x) * (1 - Math.exp(-delta / 160));
    y += (py * .1 - y) * (1 - Math.exp(-delta / 160));
    const turn = x + Math.sin(time * .00013) * .026 * travel;
    const tilt = y + Math.sin(time * .00011) * .018 * travel;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const radius = mix(.034, .05, travel);
    for (let strand = 0; strand < 4; strand++) {
      const from = poses[index][strand], to = poses[index + 1][strand];
      const points = curves[strand];
      for (let j = 0; j < POINTS; j++) {
        const pos = j / POINTS * SAMPLES, start = Math.floor(pos), u = pos - start;
        // Periodic cubic interpolation keeps tangent continuity through every morph.
        const a = (start - 1 + SAMPLES) % SAMPLES, b = start % SAMPLES, c = (start + 1) % SAMPLES, d = (start + 2) % SAMPLES;
        const out = points[j];
        for (let component = 0; component < 3; component++) {
          const p0 = mix(from[a].getComponent(component), to[a].getComponent(component), blend);
          const p1 = mix(from[b].getComponent(component), to[b].getComponent(component), blend);
          const p2 = mix(from[c].getComponent(component), to[c].getComponent(component), blend);
          const p3 = mix(from[d].getComponent(component), to[d].getComponent(component), blend);
          out.setComponent(component, .5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u));
        }
        const tx = out.x * Math.cos(turn) + out.z * Math.sin(turn), tz = -out.x * Math.sin(turn) + out.z * Math.cos(turn);
        const ty = out.y * Math.cos(tilt) - tz * Math.sin(tilt);
        out.z = out.y * Math.sin(tilt) + tz * Math.cos(tilt); out.x = tx; out.y = ty;
        minX = Math.min(minX, out.x - radius); maxX = Math.max(maxX, out.x + radius);
        minY = Math.min(minY, out.y - radius); maxY = Math.max(maxY, out.y + radius);
      }
      const g = meshes[strand].geometry;
      const positions = g.getAttribute('position'), normals = g.getAttribute('normal');
      for (let j = 0; j <= POINTS; j++) {
        const point = points[j % POINTS];
        tangent.subVectors(points[(j + 1) % POINTS], points[(j - 1 + POINTS) % POINTS]).normalize();
        normal.set(-tangent.y, tangent.x, 0).normalize();
        if (normal.lengthSq() < .001) normal.set(1, 0, 0);
        binormal.crossVectors(tangent, normal).normalize();
        for (let k = 0; k < SIDES; k++) {
          const [c, s] = around[k];
          const nx = normal.x * c + binormal.x * s, ny = normal.y * c + binormal.y * s, nz = normal.z * c + binormal.z * s;
          positions.setXYZ(j * SIDES + k, point.x + radius * nx, point.y + radius * ny, point.z + radius * nz);
          normals.setXYZ(j * SIDES + k, nx, ny, nz);
        }
      }
      positions.needsUpdate = true; normals.needsUpdate = true;
      const signal = (time * .000025 + strand / 4) % 1 * POINTS, point = Math.floor(signal);
      dots[strand].position.copy(points[point]).lerp(points[(point + 1) % POINTS], signal - point);
      dots[strand].visible = progress > .28 && progress < .93;
    }

    const mobile = width < 768;
    const openingTop = Math.max((chapterEnds[0] || height * .4) + 24, height * .49), openingBottom = height - (mobile ? 122 : 98);
    const current = Math.round(phase);
    // One reserved plane prevents camera jumps when mobile chapter heights differ.
    const copyBottom = Math.max(...chapterEnds.slice(1), height * .4);
    const destinationTop = mobile ? copyBottom + 24 : height * .18;
    const destinationBottom = mobile ? navTop - 24 : Math.min(navTop - 42, height * .75);
    const move = ease(clamp((phase - .34) / .66));
    const box = {left: mix(width * .035, mobile ? width * .08 : width * .55, move), right: mix(width * .965, mobile ? width * .92 : width * .94, move), top: mix(openingTop, destinationTop, move), bottom: mix(openingBottom, destinationBottom, move)};
    const bw = Math.max(80, box.right - box.left), bh = Math.max(70, box.bottom - box.top);
    canvas.style.width = bw + 'px'; canvas.style.height = bh + 'px'; canvas.style.left = box.left + 'px'; canvas.style.top = box.top + 'px';
    const aspect = bw / bh, objectWidth = maxX - minX, objectHeight = maxY - minY;
    const worldHeight = Math.max(objectHeight, objectWidth / aspect) * 1.06, worldWidth = worldHeight * aspect;
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    camera.left = -worldWidth / 2; camera.right = worldWidth / 2; camera.top = worldHeight / 2; camera.bottom = -worldHeight / 2;
    camera.position.set(cx, cy, 20); camera.lookAt(cx, cy, 0); camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    host.dataset.sceneState = 'ready'; host.dataset.renderer = 'webgl';
    host.dataset.renderedProgress = progress.toFixed(4); host.dataset.pose = String(current); host.dataset.blend = blend.toFixed(4);
    host.dataset.renderMs = (performance.now() - renderStart).toFixed(2);
    host.dataset.bounds = JSON.stringify({left: box.left + (bw - objectWidth / worldWidth * bw) / 2, right: box.right - (bw - objectWidth / worldWidth * bw) / 2, top: box.top + (bh - objectHeight / worldHeight * bh) / 2, bottom: box.top + (bh + objectHeight / worldHeight * bh) / 2});
    const caption = document.querySelector<HTMLElement>('.shape-caption'); if (caption) caption.style.opacity = String(ease(clamp((phase - .8) / .2)));
    const name = document.querySelector('[data-shape-name]'), number = document.querySelector('[data-shape-number]');
    if (name && name.textContent !== names[current]) name.textContent = names[current];
    if (number) number.textContent = String(current + 1).padStart(2, '0');
  }

  function stop() {if (frame) cancelAnimationFrame(frame); frame = 0; last = 0;}
  function loop(time: number) {
    frame = 0;
    if (disposed || paused || !visible || document.hidden) return;
    const delta = last ? Math.min(time - last, 120) : 16; last = time;
    slow = delta > 30 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 12 && quality === 1) {quality = .5; measure(); host.dataset.quality = 'adaptive';}
    if (quality === 1 || time - lastDraw >= 32) {render(time, Math.min(time - lastDraw || delta, 120)); lastDraw = time;}
    // The opening rests once its pointer response settles; later poses keep their
    // subtle travel and connection signals. Input starts the scene again.
    if (progress > .0001 || Math.abs(px * .16 - x) + Math.abs(py * .1 - y) > .0005) frame = requestAnimationFrame(loop);
    else last = 0;
  }
  function start() {if (!paused && visible && !document.hidden && !frame && !disposed) frame = requestAnimationFrame(loop);}
  function sync() {
    paused = reduced.matches || document.documentElement.classList.contains('motion-paused');
    if (paused) {stop(); host.dataset.sceneState = 'fallback';} else {measure(); start();}
  }
  window.addEventListener('nrth:story', ((event: CustomEvent<{progress: number}>) => {progress = event.detail.progress; start();}) as EventListener);
  window.addEventListener('nrth:motion', sync); reduced.addEventListener('change', sync);
  window.addEventListener('resize', () => {measure(); start();});
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  window.addEventListener('pagehide', stop); window.addEventListener('pageshow', sync);
  new ResizeObserver(() => {measure(); start();}).observe(host);
  new IntersectionObserver(entries => {visible = entries[0].isIntersecting; visible ? start() : stop();}, {threshold: .01}).observe(host);
  host.addEventListener('pointermove', event => {if (event.pointerType === 'touch') return; px = event.clientX / width - .5; py = event.clientY / height - .5; start();});
  host.addEventListener('pointerleave', () => {px = py = 0; start();});
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); disposed = true; stop(); canvas.remove(); host.dataset.sceneState = 'fallback';
    void import('./scene-canvas');
  });
  host.dataset.graphics = 'webgl';
  host.dataset.quality = 'continuous'; measure(); render(performance.now(), 16); start();
  document.fonts.ready.then(() => {measure(); start();});
  return true;
}
