import {PDFDocument, rgb} from 'pdf-lib';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import fontkit from '@pdf-lib/fontkit';
import {glyphs} from '../src/data/brand';
import {getProjects, getContentRevision, getArticles, fetchContent} from '../src/data/content';
import {stageLabel} from '../src/data/projects';
import sharp from 'sharp';
const directory = 'public/resources';
const snapshot = await fetchContent();
await writeFile('.astro/published-content.json',JSON.stringify(snapshot));
process.env.NRTH_CONTENT_SNAPSHOT = '.astro/published-content.json';
await mkdir(directory, {recursive:true});
const svg = (outline = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5.2 -1.8 10.4 3.6"><title>NRTH wordmark</title><g ${outline ? 'fill="none" stroke="#18191d" stroke-width=".025" stroke-linejoin="round"' : 'fill="#17181a"'}>${glyphs.map(path => `<path d="${path}"/>`).join('')}</g></svg>`;
await writeFile(directory + '/nrth-wordmark.svg', svg());
await writeFile(directory + '/nrth-wordmark-outline.svg', svg(true));
await writeFile('public/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>NRTH</title><rect width="64" height="64" rx="12" fill="#0a0b0d"/><g fill="#f2f0e9" transform="translate(32 32) scale(5.8)">${glyphs.map(path=>`<path d="${path}"/>`).join('')}</g></svg>`);
const document = await PDFDocument.create();
document.setTitle('NRTH Inc. — Company overview');document.setAuthor('NRTH Inc.');document.setSubject('Public portfolio directions and company identity');
document.registerFontkit(fontkit);
// Static Inter 400 instance from Fontsource; its SIL OFL is included beside the TTF.
const regular = await document.embedFont(await readFile('src/assets/fonts/Inter-Regular.ttf'),{subset:true}), bold = regular;
const ink = rgb(.09,.10,.12), muted = rgb(.38,.39,.42), paper = rgb(.95,.94,.92), line = rgb(.82,.81,.79);
function addPage(number: number) {const page = document.addPage([595.28,841.89]); page.drawRectangle({x:0,y:0,width:595.28,height:841.89,color:paper});page.drawText('NRTH INC. / COMPANY OVERVIEW', {x:48,y:795,size:8,font:regular,color:muted});page.drawText('nrth.group', {x:48,y:38,size:9,font:regular,color:muted});page.drawText(String(number).padStart(2,'0'), {x:525,y:38,size:9,font:regular,color:muted}); return page;}
function paragraph(page: ReturnType<typeof addPage>, text: string, x: number, y: number, width: number, size = 11, color = muted) {const words = text.replace(/[’‘]/g,"'").replace(/[–—]/g,'-').split(/\s+/); let row = ''; for (const word of words) {const next = row ? row + ' ' + word : word; if (regular.widthOfTextAtSize(next,size) > width && row) {page.drawText(row,{x,y,size,font:regular,color}); y -= size * 1.55;row = word;} else row = next;} if (row) page.drawText(row,{x,y,size,font:regular,color}); return y - size * 1.55;}
const projects = await getProjects();
const first = addPage(1);
// These are the same path contours used by the website and favicon.
glyphs.forEach(path => first.drawSvgPath(path,{x:293,y:690,scale:47,color:ink}));
first.drawText('Build',{x:48,y:515,size:37,font:regular,color:ink});first.drawText('beyond.',{x:48,y:470,size:37,font:regular,color:ink});
let y = paragraph(first,'NRTH Inc. brings together nine venture directions across health, mobility, systems, materials, events, and research.',48,405,470,15,ink);
y = paragraph(first,'Independent thinking. Extraordinary possibilities. Each venture frames a different question about the work around us.',48,y-25,465);
first.drawLine({start:{x:48,y:245},end:{x:547,y:245},color:line,thickness:.7});
paragraph(first,'This public overview introduces venture directions. Research artwork and website visual studies are illustrative. Confirm development stages, product availability, evidence and specific commercial or investment information directly with NRTH.',48,212,460);
const second = addPage(2);second.drawText('The venture directions.',{x:48,y:735,size:28,font:regular,color:ink});
y = 677;
for (const project of projects) {second.drawLine({start:{x:48,y:y+18},end:{x:547,y:y+18},color:line,thickness:.7});second.drawText(project.name,{x:48,y,size:14,font:bold,color:ink});second.drawText(project.category,{x:400,y:y+1,size:9,font:regular,color:muted});paragraph(second,project.description,48,y-19,380,10);y -= 63;}
paragraph(second,'Explore venture directions and discuss scope: nrth.group/projects | Investor information: nrth.group/investors | Inquiries: nrth.group/contact',48,83,470,9);
await writeFile(directory + '/nrth-company-overview.pdf', await document.save());
await writeFile(directory + '/content-revision.json', JSON.stringify({...await getContentRevision(), commit:process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local', builtAt:new Date().toISOString(), stages:projects.map(project => ({slug:project.slug, label:stageLabel(project)}))}, null, 2));
console.log('Generated canonical wordmarks, company overview, and content revision.');
await mkdir(directory + '/social',{recursive:true});
const pages = [
  {path:'home',title:'Build beyond.',label:'NRTH INC.'},
  {path:'about',title:'Not one lane. A wider world.',label:'COMPANY'},
  {path:'approach',title:'Ask carefully. Make deliberately.',label:'APPROACH'},
  {path:'projects',title:'Choose your next question.',label:'VENTURES'},
  {path:'industries-mobility',title:'A world that moves takes coordination.',label:'MOBILITY / FOUR PERSPECTIVES'},
  {path:'industries',title:'Different worlds. Shared possibility.',label:'THE FIELDS OF NRTH'},
  {path:'industries-health',title:'Information meets the experience of care.',label:'HEALTH'},
  {path:'industries-systems',title:'Make complexity useful.',label:'SYSTEMS'},
  {path:'industries-materials',title:'The application starts at the material level.',label:'MATERIALS'},
  {path:'industries-events',title:'Give the gathering a purpose.',label:'EVENTS'},
  {path:'industries-research',title:'A focused question opens a possibility.',label:'RESEARCH'},
  {path:'investors',title:'Look beyond a single field.',label:'INVESTORS'},
  {path:'partnerships',title:'Bring something we do not see yet.',label:'PARTNERSHIPS'},
  {path:'press',title:'The name is NRTH. The outlook is open.',label:'PRESS & RESOURCES'},
  {path:'research',title:'What if is where it starts.',label:'NRTH LABS / RESEARCH'},
  {path:'insights',title:'Think out loud. Look a little deeper.',label:'JOURNAL'},
  {path:'contact',title:'Make an introduction.',label:'CONTACT'},
  {path:'privacy',title:'Website privacy.',label:'NRTH INC.'},
  {path:'terms',title:'Website terms.',label:'NRTH INC.'},
  {path:'404',title:'Find another direction.',label:'NRTH INC.'},
  ...projects.map(project=>({path:'projects-' + project.slug,title:project.headline,label:project.name.toUpperCase() + ' / ' + project.category.toUpperCase()})),
  ...(await getArticles()).map(article=>({path:'insights-' + article.slug,title:article.title,label:'JOURNAL / ' + article.category.toUpperCase()})),
];
const escape = (text: string) => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
for (const page of pages) {
  const venture = projects.find(project => page.path === 'projects-' + project.slug);
  const words = page.title.split(' '), lines: string[] = [];let line = '';
  for (const word of words) {if ((line + word).length > (venture ? 19 : 26) && line) {lines.push(line.trim());line = '';}line += word + ' ';}if(line) lines.push(line.trim());
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a0b0d"/><text x="64" y="75" font-family="sans-serif" font-size="14" letter-spacing="2" fill="#c1c0bb">${escape(page.label)}</text>${lines.slice(0,3).map((text,i)=>`<text x="64" y="${190+i*72}" font-family="sans-serif" font-size="64" letter-spacing="-3" fill="#f2f0e9">${escape(text)}</text>`).join('')}<g transform="translate(982 505) scale(28)" fill="#f2f0e9">${glyphs.map(path=>`<path d="${path}"/>`).join('')}</g><path d="M64 452H1136" stroke="#ff743b"/><text x="64" y="539" font-family="sans-serif" font-size="16" fill="#c1c0bb">nrth.group</text></svg>`;
  if (venture) {
    const image = await sharp('src/assets/ventures/' + venture.slug.replace('nrth-','') + '.png').resize(552,630,{fit:'cover'}).png().toBuffer();
    const overlay = markup.replace('<rect width="1200" height="630" fill="#0a0b0d"/>','<rect width="648" height="630" fill="#0a0b0d"/>').replace(/font-size="64"/g,'font-size="52"');
    await writeFile(directory + '/social/' + page.path + '.png',await sharp({create:{width:1200,height:630,channels:4,background:'#0a0b0d'}}).composite([{input:image,left:648,top:0},{input:Buffer.from(overlay),left:0,top:0}]).png().toBuffer());
  } else {
    await writeFile(directory + '/social/' + page.path + '.png',await sharp(Buffer.from(markup)).png().toBuffer());
  }
}
console.log('Generated ' + pages.length + ' page-specific social images.');
