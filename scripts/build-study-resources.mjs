import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('.astro',{recursive:true});
await build({entryPoints:['scripts/study-resources.ts'],bundle:true,platform:'node',format:'esm',target:'node22',outfile:'.astro/study-resources-builder.mjs'});
await import('../.astro/study-resources-builder.mjs');
