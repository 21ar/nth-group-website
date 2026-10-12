import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
await mkdir('.astro', {recursive:true});
process.env.XDG_CACHE_HOME ||= resolve('.astro/cache');
await mkdir(process.env.XDG_CACHE_HOME,{recursive:true});
await build({entryPoints:['scripts/resources.ts'], bundle:true, platform:'node', format:'esm', target:'node22', outfile:'.astro/resources-builder.mjs', external:['pdf-lib','sharp','@pdf-lib/fontkit'], define:{'import.meta.env':'process.env'}});
await import('../.astro/resources-builder.mjs');
await import('./build-study-resources.mjs');
