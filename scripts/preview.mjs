// Serve the built static pages and the actual Vercel Node handler for local QA.
import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createGzip} from 'node:zlib';
const root=resolve('.vercel/output/static');
const {default:handler}=await import('../.vercel/output/functions/_render.func/dist/server/entry.mjs');
const arguments_=process.argv.slice(2), option=(name,fallback)=>{const index=arguments_.indexOf(name);return index>=0?arguments_[index+1]||fallback:fallback;};
const port=Number(option('--port','4173')),host=option('--host','0.0.0.0');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf','.xml':'application/xml','.json':'application/json','.txt':'text/plain; charset=utf-8'};
createServer(async(request,response)=>{
 try {
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if(pathname.startsWith('/api/') || pathname==='/preview' || pathname.startsWith('/preview/') || pathname==='/_image') {request.headers['x-forwarded-proto']='http';await handler(request,response);return;}
  let file=resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+'/')) {response.writeHead(403);response.end();return;}
  let metadata=await stat(file).catch(()=>null);
  if(metadata?.isDirectory()) {file=resolve(file,'index.html');metadata=await stat(file).catch(()=>null);}
  let status=200;
  if(!metadata?.isFile()) {file=resolve(root,'404.html');metadata=await stat(file);status=404;}
  const extension=extname(file),type=types[extension] || 'application/octet-stream';
  const compress=/html|javascript|css|svg|xml|json/.test(type)&&request.headers['accept-encoding']?.includes('gzip');
  response.writeHead(status,{'Content-Type':type,'Cache-Control':pathname.startsWith('/_astro/')?'public, max-age=31536000, immutable':'no-cache',...(compress?{'Content-Encoding':'gzip','Vary':'Accept-Encoding'}:{})});
  if(request.method==='HEAD') {response.end();return;}
  const source=createReadStream(file);source.on('error',()=>response.destroy());if(compress)source.pipe(createGzip()).pipe(response);else source.pipe(response);
 } catch {if(!response.headersSent)response.writeHead(500);response.end('Preview request failed.');}
}).listen(port,host,()=>console.log(`NRTH production build preview: http://${host}:${port}`));
