import {geometry} from '../data/geometry-baked';
export function startStudy(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-lab-canvas]')!;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const bytes = Uint8Array.from(atob(geometry), c => c.charCodeAt(0)), data = new Int16Array(bytes.buffer);
  const connection = root.querySelector<HTMLInputElement>('[data-lab-connection]')!;
  const perspective = root.querySelector<HTMLInputElement>('[data-lab-perspective]')!;
  function draw() {
    if (!ctx) return;
    const box = canvas.getBoundingClientRect(), ratio = Math.min(devicePixelRatio, 1.4);
    canvas.width = Math.max(1, Math.round(box.width * ratio)); canvas.height = Math.max(1, Math.round(box.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, box.width, box.height);
    const blend = Number(connection.value) / 100, angle = Number(perspective.value) / 180 * Math.PI;
    const scale = Math.min(box.width / 10.5, box.height / 5.2);
    const metal = ctx.createLinearGradient(0, 0, box.width, box.height); metal.addColorStop(0, '#777f8b'); metal.addColorStop(.25, '#e7e9ec'); metal.addColorStop(.5, '#abb1bb'); metal.addColorStop(.7, '#f2f1ef'); metal.addColorStop(1, '#7e8796');
    ctx.strokeStyle = metal; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let strand = 0; strand < 4; strand++) {
      ctx.beginPath();
      for (let j = 0; j <= 192; j++) {
        const p = j % 192, a = ((4 + strand) * 192 + p) * 3, b = ((8 + strand) * 192 + p) * 3;
        const x = (data[a] * (1 - blend) + data[b] * blend) / 1000, y = (data[a + 1] * (1 - blend) + data[b + 1] * blend) / 1000, z = (data[a + 2] * (1 - blend) + data[b + 2] * blend) / 1000;
        const xx = (x * Math.cos(angle) + z * Math.sin(angle)) * scale + box.width / 2, yy = -y * scale + box.height / 2;
        j === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
      }
      ctx.closePath(); ctx.stroke();
    }
    root.querySelector('[data-lab-connection-value]')!.textContent = connection.value + '%';
    root.querySelector('[data-lab-perspective-value]')!.textContent = perspective.value + '°';
    canvas.dataset.connection = connection.value; canvas.dataset.perspective = perspective.value;
  }
  connection.addEventListener('input', draw); perspective.addEventListener('input', draw);
  new ResizeObserver(draw).observe(canvas); draw();
}
