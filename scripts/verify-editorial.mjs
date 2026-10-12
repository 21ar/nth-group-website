import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir,writeFile,rm} from 'node:fs/promises';
await mkdir('.astro',{recursive:true});
await build({stdin:{contents:"export * from './src/data/editorial-content';export {getCompanyFacts,getVentureEditorial,getArticleEditorial,getPageEditorial,getArticles,fetchContent} from './src/data/content';export {articles} from './src/data/articles';export {journalGuide} from './src/data/journal-guides';export {privatePreviewRedirect} from './src/server/preview';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'.astro/editorial-test.mjs',define:{'import.meta.env':'process.env'}});
const api=await import('../.astro/editorial-test.mjs');let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const context={ventures:['nrth-tms'],industries:['mobility'],articles:['connecting-the-parts-of-movement']};
const previewRedirect=api.privatePreviewRedirect();
check(previewRedirect.status===302&&previewRedirect.headers.get('Location')==='/preview','Unauthenticated private routes return to the editor sign-in.');
check(previewRedirect.headers.get('Cache-Control')==='private, no-store','Private preview redirects cannot preserve a stale sign-in state in shared caches.');
for(const path of ['javascript:alert(1)','http://example.com','//example.com','https://user:secret@example.com','/preview/home','/api/inquiries','/resources/../private.txt','/resources/%2e%2e/private.txt','/projects/unknown','/insights/unknown','/resources/unknown-file.pdf'])check(!api.editorialHref(path,context),'Unapproved link rejected: '+path);
for(const path of ['https://example.com/reference','/projects/nrth-tms#focus','/industries/mobility','/insights/connecting-the-parts-of-movement','/resources/nrth-company-overview.pdf','/work/the-question-that-travels','/resources/studies/health-context-worksheet.txt'])check(api.editorialHref(path,context)===path,'Approved public reading path retained.');
check(!api.editorialDate('2026-02-30')&&api.editorialDate('2026-10-12')==='2026-10-12','Impossible scope dates rejected.');
check(!api.editorialText('x'.repeat(2001))&&!api.editorialText('bad\u0000text'),'Unbounded and control-character text rejected.');
const clean=api.sanitizeEditorial({sections:[{id:'scope',title:'A scope',paragraphs:['Plain text']},{id:'scope',title:'Duplicate',paragraphs:['Other text']}],examples:[{id:'example',title:'Window changes',context:'Illustrative',output:'Next responsible person',limits:'No real operation',model:'unknown',inputs:[{label:'Window',value:'Changed'}],steps:[{title:'Review',text:'Read the condition'}]}],references:[{label:'Source',url:'javascript:alert(1)'},{label:'Public',url:'/projects/nrth-tms'}],related:{ventures:['nrth-tms','private-venture','nrth-tms'],industries:['mobility','unknown'],articles:['unknown']}},context);
check(clean.sections.length===1&&clean.examples.length===1&&clean.examples[0].model===undefined,'Duplicate document IDs and unknown visual models rejected.');
check(clean.references.length===1&&clean.related.ventures.length===1&&clean.related.industries.length===1&&clean.related.articles.length===0,'Reading relationships preserve canonical public identities.');
const original=api.articles.find(article=>article.slug==='connecting-the-parts-of-movement'),guide=api.journalGuide(original.slug);
check(!!api.sanitizeArticleDiagram(guide,context,original.paragraphs.length),'Authored diagram contract validates independently of paragraph wording.');
check(!api.sanitizeArticleDiagram({...guide,sections:[{id:'late',title:'Missing opening',startsAt:3}]},context,original.paragraphs.length),'A structured reading guide must include its opening paragraphs.');
check(!api.sanitizeArticleDiagram({...guide,lenses:[guide.lenses[0],guide.lenses[0],guide.lenses[0]]},context,original.paragraphs.length),'Duplicate lens keys cannot replace a usable interactive guide.');
const snapshotPath='.astro/editorial-fixture.json';
const fixture={site:{companyFacts:[{label:'Company',value:'NRTH Inc.'}],pages:[{page:'company',editorial:{sections:[{id:'purpose',title:'Edited section',paragraphs:['A bounded, plain-text paragraph.']}]}}]},ventures:[{slug:'nrth-tms',editorial:{scope:{currentScope:'A specific reviewed public scope.',reviewedAt:'2026-10-12'},references:[{label:'Mobility context',url:'/industries/mobility'}]}}],articles:[{...original,paragraphs:original.paragraphs.map((text,index)=>index===0?text+' An editorial revision.':text),editorial:{diagram:guide}}]};
await writeFile(snapshotPath,JSON.stringify(fixture));process.env.NRTH_CONTENT_SNAPSHOT=snapshotPath;
try{
 const [facts,venture,article,page]=await Promise.all([api.getCompanyFacts(),api.getVentureEditorial('nrth-tms'),api.getArticleEditorial(original.slug),api.getPageEditorial('company')]);
 check(facts.length===1&&facts[0].value==='NRTH Inc.','Approved CMS company facts reach the public API.');
 check(venture.scope.currentScope===fixture.ventures[0].editorial.scope.currentScope&&venture.scope.reviewedAt==='2026-10-12','Structured scope and review date reach a venture page.');
 check(venture.scope.availability.includes('directly')&&venture.related.ventures.includes('nrth-fleet'),'Omitted structured fields retain useful repository context.');
 check(article.diagram?.diagram==='movement'&&page.sections[0].title==='Edited section','Edited writing retains its model and structured page fields load.');
 await writeFile(snapshotPath,JSON.stringify({site:{companyFacts:[{label:'Company',value:'A different snapshot'}]}}));
 check((await api.getCompanyFacts())[0].value==='NRTH Inc.','All public reads use the same frozen build snapshot.');
 process.env.SANITY_PROJECT_ID='localtest';process.env.SANITY_DATASET='test';process.env.SANITY_API_READ_TOKEN='mock-read-token';
 const savedFetch=globalThis.fetch;let requestUrl;
 globalThis.fetch=async url=>{requestUrl=new URL(url);return new Response(JSON.stringify({result:{site:{companyFacts:[{label:'Company',value:'Private draft title'}]},articles:[null],ventures:'invalid'}}),{headers:{'Content-Type':'application/json'}});};
 try{
  const drafts=await api.getCompanyFacts(true);
  check(drafts[0].value==='Private draft title'&&requestUrl.searchParams.get('perspective')==='drafts','Private draft reading remains separate from the immutable public snapshot.');
  check((await api.getCompanyFacts())[0].value==='NRTH Inc.','Draft reading never overwrites the public snapshot.');
  check(requestUrl.searchParams.get('query').includes('editorial')&&!/\bsource\b/.test(requestUrl.searchParams.get('query')),'Structured queries include public editorial records and exclude internal reviewer evidence.');
 }finally{globalThis.fetch=savedFetch;}
}finally{await rm(snapshotPath,{force:true});delete process.env.NRTH_CONTENT_SNAPSHOT;}
console.log(checks+' structured editorial checks passed. CMS calls were mocked; no external content was changed.');
