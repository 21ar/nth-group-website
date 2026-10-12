/** Original, deterministic vector material studies. No product data is represented. */
export type QualityKind = 'mobility' | 'health' | 'systems' | 'materials' | 'events' | 'research';
type Point3 = [number, number, number];
type Point2 = [number, number];
export interface MaterialPiece { path: string; width: number; depth: number; orange: boolean; x: number; y: number; rotation: number; }
export interface MaterialNode { x: number; y: number; radius: number; orange: boolean; }
export interface QualityGraphic { kind: QualityKind; name: string; description: string; pieces: MaterialPiece[]; nodes: MaterialNode[]; traces: string[]; }

const names: Record<QualityKind, [string, string]> = {
  mobility: ['Movement, connected.', 'Curved routes and shared junctions illustrate how planning, resources and information can meet.'],
  health: ['A clearer signal.', 'Interwoven silver forms illustrate the relationship between people, information and the coordination of care.'],
  systems: ['Space for structure.', 'An open architectural framework illustrates interfaces, boundaries and the connections between parts.'],
  materials: ['Possibility in the bonds.', 'Connected tetrahedral cells illustrate the relationship between material structure, application and evidence.'],
  events: ['Energy, in formation.', 'A folded spectrum illustrates how separate rhythms can become one shared experience.'],
  research: ['Room to branch.', 'An organic branching structure illustrates how a focused question can open several paths of inquiry.'],
};

const rotate = ([x, y, z]: Point3, kind: QualityKind): Point3 => {
  const angle = kind === 'systems' ? -.61 : -.28;
  const a = x * Math.cos(angle) + z * Math.sin(angle);
  const b = -x * Math.sin(angle) + z * Math.cos(angle);
  const tilt = kind === 'systems' ? -.35 : .18;
  return [a, y * Math.cos(tilt) - b * Math.sin(tilt), y * Math.sin(tilt) + b * Math.cos(tilt)];
};
const project = (point: Point3, kind: QualityKind): Point2 => {
  const [x, y, z] = rotate(point, kind), perspective = 8 / (8 - z);
  const scale = kind === 'systems' ? 103 : kind === 'research' ? 106 : 123;
  const center = kind === 'systems' || kind === 'research' ? 320 : 302;
  return [480 + x * scale * perspective, center - y * scale * perspective];
};
const round = (n: number) => Math.round(n * 100) / 100;
const pathThrough = (points: Point2[], closed = false): string => {
  if (points.length < 2) return '';
  if (closed && Math.hypot(points[0][0] - points.at(-1)![0], points[0][1] - points.at(-1)![1]) < .01) points = points.slice(0, -1);
  let path = `M${round(points[0][0])},${round(points[0][1])}`;
  const count = closed ? points.length : points.length - 1;
  for (let i = 0; i < count; i++) {
    const p0 = points[closed ? (i - 1 + points.length) % points.length : Math.max(0, i - 1)];
    const p1 = points[i], p2 = points[(i + 1) % points.length];
    const p3 = points[closed ? (i + 2) % points.length : Math.min(points.length - 1, i + 2)];
    path += ` C${round(p1[0] + (p2[0] - p0[0]) / 6)},${round(p1[1] + (p2[1] - p0[1]) / 6)} ${round(p2[0] - (p3[0] - p1[0]) / 6)},${round(p2[1] - (p3[1] - p1[1]) / 6)} ${round(p2[0])},${round(p2[1])}`;
  }
  return path + (closed ? ' Z' : '');
};

export function makeQualityGraphic(input: string, variant = ''): QualityGraphic {
  const kind = Object.hasOwn(names, input) ? input as QualityKind : 'systems';
  const [name, description] = names[kind];
  const pieces: MaterialPiece[] = [], nodes: MaterialNode[] = [], traces: string[] = [];
  let sequence = 0;
  const add = (points: Point3[], width = 18, orange = false, closed = false) => {
    const depth = points.reduce((total, point) => total + rotate(point, kind)[2], 0) / points.length;
    const index = sequence++;
    pieces.push({path: pathThrough(points.map(point => project(point, kind)), closed), width, depth, orange, x: Math.cos(index * 2.39) * (30 + index % 3 * 11), y: Math.sin(index * 2.39) * (21 + index % 4 * 7), rotation: (index % 2 ? -1 : 1) * (2 + index % 4)});
  };
  const node = (point: Point3, radius = 7, orange = false) => {
    const [x, y] = project(point, kind); nodes.push({x: round(x), y: round(y), radius, orange});
  };
  const trace = (points: Point3[], closed = false) => traces.push(pathThrough(points.map(point => project(point, kind)), closed));
  const samples = (count: number, fn: (t: number) => Point3) => Array.from({length: count}, (_, i) => fn(i / (count - 1)));

  if (kind === 'mobility') {
    if (variant.includes('telematics')) {
      for (let lane = 0; lane < 4; lane++) add(samples(42, t => {const x = (t - .5) * 5.25; return [x, Math.sin(t * Math.PI * 3.2 + lane * .46) * (.3 + lane * .16) + .15, Math.cos(t * Math.PI * 2 + lane * .65) * .8 + (lane - 1.5) * .27];}), lane === 1 ? 23 : 15, lane === 1);
      trace(samples(40, t => [(t - .5) * 5.5, Math.sin(t * 7.2) * .1 - 1.25, .4]));
      for (let i = 0; i < 6; i++) node([(i / 5 - .5) * 5.25, Math.sin(i / 5 * Math.PI * 3.2 + .46) * .46 + .15, Math.cos(i / 5 * Math.PI * 2 + .65) * .8 - .135], 7, i === 3);
    } else if (variant.includes('fleet')) {
      for (let lane = 0; lane < 6; lane++) add(samples(30, t => [(t - .5) * 4.75, (lane - 2.5) * .38 + Math.sin(t * Math.PI * 2) * .38, Math.sin(t * Math.PI) * 1.05 + (lane % 2 ? -.35 : .35)]), lane === 2 ? 21 : 14, lane === 2);
      for (let i = 0; i < 6; i++) node([-2.375, (i - 2.5) * .38, i % 2 ? -.35 : .35], 8, i === 2);
      trace(samples(35, t => [(t - .5) * 5.3, Math.sin(t * Math.PI * 2) * .4, -.95]));
    } else if (variant.includes('logistics')) {
      for (let lane = 0; lane < 3; lane++) add(samples(48, t => {const a = t * Math.PI * 2; return [Math.cos(a) * (2.1 - lane * .2), Math.sin(a) * (.78 + lane * .23) + (lane - 1) * .34, Math.sin(a * 2 + lane * .8) * .65 + (lane - 1) * .62];}), 18 + lane * 2, lane === 1, true);
      [[-2, .1, .4], [.05, -1.3, -.4], [1.8, .3, .5]].forEach((p, i) => node(p as Point3, 13, i === 1));
      trace(samples(38, t => {const a = t * Math.PI * 2; return [Math.cos(a) * 2.65, Math.sin(a) * 1.55, -.2];}), true);
    } else {
      for (let lane = 0; lane < 4; lane++) add(samples(36, t => {const x = (t - .5) * 4.8; return [x, Math.sin(t * Math.PI * 2 + lane * .55) * .82 + (lane - 1.5) * .38, Math.cos(t * Math.PI * 2 + lane * .5) * .74];}), lane === 1 ? 25 : 17, lane === 1);
      add([[-2.35, -1.1, -.3], [-1.1, -.7, .35], [0, -.18, .7], [1.4, .96, .4], [2.25, 1.27, -.3]], 12);
      [[-1.15, -.7, .35], [0, -.18, .7], [1.4, .96, .4]].forEach((p, i) => node(p as Point3, 10, i === 1));
      trace(samples(40, t => [(t - .5) * 5.2, Math.sin(t * Math.PI * 2) * 1.3, -.85]));
    }
  } else if (kind === 'health') {
    for (let strand = 0; strand < 5; strand++) add(samples(52, t => {const a = t * Math.PI * 2; return [Math.cos(a) * 2.07, Math.sin(a) * (1.15 + strand * .055), Math.sin(a * 2 + strand * .21) * .75 + (strand - 2) * .14];}), strand === 2 ? 25 : 15, strand === 2, true);
    add(samples(38, t => [(t - .5) * 4.55, Math.sin(t * Math.PI * 3) * .5, Math.cos(t * Math.PI * 2) * .75]), 13);
    for (let i = 0; i < 8; i++) {const a = i * Math.PI / 4; node([Math.cos(a) * 2.07, Math.sin(a) * 1.26, Math.sin(a * 2 + .42) * .75], 6, i === 2);}
    trace(samples(48, t => {const a = t * Math.PI * 2; return [Math.cos(a) * 2.7, Math.sin(a) * 1.74, -.55];}), true);
  } else if (kind === 'systems') {
    const cube = (center: Point3, size: number, orange = false) => {
      const vertices: Point3[] = Array.from({length: 8}, (_, i) => [center[0] + (i & 1 ? size : -size), center[1] + (i & 2 ? size : -size), center[2] + (i & 4 ? size : -size)]);
      vertices.forEach((p, i) => {for (const bit of [1, 2, 4]) if (!(i & bit)) add([p, vertices[i | bit]], 12, orange && bit === 2);});
    };
    cube([0, 0, 0], 1.48);
    cube([0, 0, 0], .78, true);
    for (const x of [-1.48, 1.48]) for (const y of [-1.48, 1.48]) for (const z of [-1.48, 1.48]) node([x, y, z], 9);
    add([[-2.23, -1.48, .8], [-2.23, .1, .8], [-1.48, .76, .8], [0, .76, .8]], 10, true);
    trace([[-2.4, -1.75, -1.7], [2.4, -1.75, -1.7], [2.4, -1.75, 1.7], [-2.4, -1.75, 1.7]], true);
  } else if (kind === 'materials') {
    const centers: Point3[] = [[-1.28, .15, -.2], [.72, .7, -.52], [.48, -.92, .65]];
    centers.forEach((c, ci) => {
      const size = ci === 0 ? 1.18 : .95;
      const vertices: Point3[] = [[c[0], c[1] + size, c[2]], [c[0] - size, c[1] - size * .6, c[2] + size * .55], [c[0] + size, c[1] - size * .6, c[2] + size * .55], [c[0], c[1] - size * .6, c[2] - size]];
      vertices.forEach((p, i) => {node(p, 11, ci === 1 && i === 0);for (let j = i + 1; j < 4; j++) add([p, vertices[j]], ci === 0 ? 18 : 14, ci === 1 && i === 0 && j === 2);});
    });
    add([[-1.28, .15, -.2], [-.35, .6, -.6], [.72, .7, -.52]], 10);
    trace(samples(48, t => {const a = t * Math.PI * 2; return [Math.cos(a) * 2.9, Math.sin(a) * 1.83, -.6];}), true);
  } else if (kind === 'events') {
    for (let band = 0; band < 9; band++) add(samples(46, t => [(t - .5) * 4.9, Math.sin(t * Math.PI * 2.35 + band * .1) * (.73 + band * .025) + (band - 4) * .225, Math.cos(t * Math.PI * 2.35 + band * .1) * .98 + (band - 4) * .09]), band === 4 ? 22 : 15, band === 4);
    trace(samples(48, t => [(t - .5) * 5.3, Math.sin(t * Math.PI * 2.35) * 1.9, -.9]));
    node([-2.45, -.58, .88], 8);
    node([2.45, .9, -.25], 9, true);
  } else {
    add([[0, -1.9, .25], [-.16, -1.1, .1], [.05, -.25, 0], [-.08, .55, .1], [.08, 1.63, -.1]], 24);
    const branches: Point3[][] = [
      [[-.12, -.9, .15], [-.6, -.62, .25], [-1.37, -.26, .05], [-2.2, .3, -.16]],
      [[-.02, -.1, .04], [.69, .06, .15], [1.36, .56, .26], [2.2, .92, .1]],
      [[-.03, .55, .05], [-.53, .86, .34], [-.98, 1.37, .12], [-1.28, 1.91, -.28]],
      [[-.13, -.87, .13], [.42, -.62, -.4], [1.16, -.45, -.58], [1.89, -.23, -.87]],
      [[0, -.2, .01], [-.43, -.07, -.47], [-.77, .54, -.69], [-1.32, 1.01, -.91]],
      [[-.07, .51, .1], [.57, .85, .35], [.73, 1.35, .48], [1.13, 1.82, .67]],
    ];
    branches.forEach((points, i) => {add(points, 16, i === 1);node(points.at(-1)!, 8, i === 1);});
    for (let i = 0; i < 6; i++) {
      const source = branches[i][2], direction = i % 2 ? 1 : -1;
      add([source, [source[0] + direction * .3, source[1] + .32, source[2] + .18], [source[0] + direction * .5, source[1] + .81, source[2] + .42]], 9);
    }
    trace(samples(48, t => {const a = t * Math.PI * 2; return [Math.cos(a) * 2.83, Math.sin(a) * 2.13, -.95];}), true);
  }
  // Painter ordering gives rear tubes an honest occlusion relationship to foreground tubes.
  pieces.sort((a, b) => a.depth - b.depth);
  return {kind, name, description, pieces, nodes, traces};
}
