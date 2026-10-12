/** Bounded, plain-text editorial records. No CMS HTML or script reaches a page. */
export const editorialKinds = ['health','mobility','systems','materials','events','research'] as const;
export const diagramKinds = ['attention','movement','experiment','provenance','specification','production','recovery','motion'] as const;
// Add repository-created resources here when introducing a new downloadable file.
export const approvedResourcePaths = ['/resources/nrth-company-overview.pdf','/resources/nrth-wordmark.svg','/resources/nrth-wordmark-outline.svg','/resources/editorial-reference.txt','/resources/content-revision.json'];
export const approvedWorkSlugs = ['one-population-six-readings','the-question-that-travels','conditions-change-the-question','room-between-the-moments'];
approvedResourcePaths.push('/resources/studies/design-study-reference.txt',...approvedWorkSlugs.flatMap(slug=>['/resources/studies/'+slug+'-worksheet.txt','/resources/studies/'+slug+'-record.json']),...editorialKinds.map(kind=>'/resources/studies/'+kind+'-context-worksheet.txt'));
export type EditorialSection = {id:string;title:string;paragraphs:string[];caption?:string;variant?:typeof editorialKinds[number]};
export type EditorialReference = {label:string;url:string;note?:string};
export type EditorialDownload = {label:string;href:string;description?:string;format?:string};
export type EditorialExample = {id:string;title:string;context:string;inputs:{label:string;value:string}[];steps:{title:string;text:string}[];output:string;limits:string;caption?:string;model?:string};
export type VentureScope = {currentScope:string;availability:string;reviewedAt?:string;owner?:string};
export type EditorialContent = {sections:EditorialSection[];examples:EditorialExample[];references:EditorialReference[];downloads:EditorialDownload[];related:{ventures:string[];industries:string[];articles:string[]}};
export type ArticleDiagram = {kind:typeof editorialKinds[number];diagram:typeof diagramKinds[number];idea:string;caption:string;sections:{id:string;title:string;startsAt:number}[];lenses:{key:'purpose'|'context'|'continuation';label:string;title:string;text:string}[];application:{title:string;text:string;href:string;link:string}};
export type ArticleEditorial = EditorialContent & {diagram?:ArticleDiagram};
export type VentureEditorial = EditorialContent & {scope:VentureScope};
type LinkContext = {ventures:readonly string[];articles:readonly string[];industries:readonly string[]};
const object = (value:unknown):Record<string,unknown> => value && typeof value==='object' && !Array.isArray(value) ? value as Record<string,unknown> : {};
const list = (value:unknown,limit=12):unknown[] => Array.isArray(value) ? value.slice(0,limit) : [];
export function editorialText(value:unknown,limit=2000):string|undefined {
  if(typeof value!=='string') return undefined;
  const text=value.trim();
  return text && text.length<=limit && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text) ? text : undefined;
}
export function editorialDate(value:unknown):string|undefined {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date=new Date(value+'T12:00:00Z');
  return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value ? value : undefined;
}
export function editorialHttps(value:unknown):string|undefined {
  const text=editorialText(value,1800); if(!text) return undefined;
  try {const url=new URL(text);return url.protocol==='https:'&&!url.username&&!url.password ? url.href : undefined;} catch {return undefined;}
}
export function editorialHref(value:unknown,context:LinkContext,resourceOnly=false):string|undefined {
  const text=editorialText(value,1800);if(!text) return undefined;
  const external=editorialHttps(text);if(external) return external;
  if(!text.startsWith('/')||text.startsWith('//')||/[\\\s]/.test(text)||/%(?:2e|2f|5c)/i.test(text)) return undefined;
  const path=text.split(/[?#]/)[0];
  if(path.split('/').some(part=>part==='.'||part==='..')) return undefined;
  if(approvedResourcePaths.includes(path)) return text;
  if(resourceOnly) return undefined;
  if(['/', '/about','/approach','/research','/investors','/partnerships','/press','/contact','/projects','/industries','/insights','/work','/privacy','/terms'].includes(path)) return text;
  if(approvedWorkSlugs.some(slug=>path==='/work/'+slug)) return text;
  if(context.ventures.some(slug=>path==='/projects/'+slug)||context.articles.some(slug=>path==='/insights/'+slug)||context.industries.some(slug=>path==='/industries/'+slug)) return text;
  return undefined;
}
export function emptyEditorial():EditorialContent {return {sections:[],examples:[],references:[],downloads:[],related:{ventures:[],industries:[],articles:[]}};}
export function sanitizeEditorial(value:unknown,context:LinkContext):EditorialContent {
  const source=object(value),result=emptyEditorial();
  result.sections=list(source.sections,8).flatMap((entry,index)=>{
    const item=object(entry),title=editorialText(item.title,160),paragraphs=list(item.paragraphs,8).map(value=>editorialText(value,2400)).filter((value):value is string=>!!value);
    if(!title||!paragraphs.length)return [];
    const id=typeof item.id==='string'&&/^[a-z][a-z0-9-]{0,70}$/.test(item.id)?item.id:'editorial-section-'+index;
    const variant=editorialKinds.find(kind=>kind===item.variant);
    return [{id,title,paragraphs,caption:editorialText(item.caption,600),variant}];
  });
  // Duplicate IDs would make document navigation ambiguous.
  result.sections=result.sections.filter((item,index,array)=>array.findIndex(other=>other.id===item.id)===index);
  result.examples=list(source.examples,4).flatMap((entry,index)=>{
    const item=object(entry),title=editorialText(item.title,160),contextText=editorialText(item.context,1600),output=editorialText(item.output,1200),limits=editorialText(item.limits,1200);
    if(!title||!contextText||!output||!limits)return [];
    const id=typeof item.id==='string'&&/^[a-z][a-z0-9-]{0,70}$/.test(item.id)?item.id:'editorial-example-'+index;
    const inputs=list(item.inputs,8).flatMap(entry=>{const pair=object(entry),label=editorialText(pair.label,120),value=editorialText(pair.value,500);return label&&value?[{label,value}]:[];});
    const steps=list(item.steps,6).flatMap(entry=>{const pair=object(entry),title=editorialText(pair.title,140),text=editorialText(pair.text,1400);return title&&text?[{title,text}]:[];});
    return [{id,title,context:contextText,inputs,steps,output,limits,caption:editorialText(item.caption,600),model:context.ventures.find(slug=>slug===item.model)}];
  });
  result.references=list(source.references,12).flatMap(entry=>{const item=object(entry),label=editorialText(item.label,180),url=editorialHref(item.url,context),note=editorialText(item.note,700);return label&&url?[{label,url,note}]:[];});
  result.downloads=list(source.downloads,8).flatMap(entry=>{const item=object(entry),label=editorialText(item.label,180),href=editorialHref(item.href,context,true);return label&&href?[{label,href,description:editorialText(item.description,700),format:editorialText(item.format,30)}]:[];});
  const related=object(source.related);
  for(const key of ['ventures','industries','articles'] as const) result.related[key]=[...new Set(list(related[key],12).filter((item):item is string=>typeof item==='string'&&context[key].includes(item)))];
  return result;
}
export function sanitizeArticleDiagram(value:unknown,context:LinkContext,paragraphCount:number):ArticleDiagram|undefined {
  const source=object(value),kind=editorialKinds.find(item=>item===source.kind),diagram=diagramKinds.find(item=>item===source.diagram),idea=editorialText(source.idea,500),caption=editorialText(source.caption,700);
  if(!kind||!diagram||!idea||!caption)return undefined;
  const sections=list(source.sections,8).flatMap(entry=>{const item=object(entry),id=editorialText(item.id,70),title=editorialText(item.title,160),startsAt=item.startsAt;return id&&/^[a-z][a-z0-9-]*$/.test(id)&&title&&typeof startsAt==='number'&&Number.isInteger(startsAt)&&startsAt>=0&&startsAt<paragraphCount?[{id,title,startsAt}]:[];}).sort((a,b)=>a.startsAt-b.startsAt);
  if(!sections.length||sections[0].startsAt!==0||new Set(sections.map(item=>item.id)).size!==sections.length||new Set(sections.map(item=>item.startsAt)).size!==sections.length)return undefined;
  const lenses=list(source.lenses,3).flatMap(entry=>{const item=object(entry),key=['purpose','context','continuation'].find(key=>key===item.key) as 'purpose'|'context'|'continuation'|undefined,label=editorialText(item.label,100),title=editorialText(item.title,160),text=editorialText(item.text,1200);return key&&label&&title&&text?[{key,label,title,text}]:[];});
  if(lenses.length!==3||new Set(lenses.map(item=>item.key)).size!==3)return undefined;
  const app=object(source.application),title=editorialText(app.title,180),text=editorialText(app.text,1600),href=editorialHref(app.href,context),link=editorialText(app.link,100);
  if(!title||!text||!href||!link)return undefined;
  return {kind,diagram,idea,caption,sections,lenses,application:{title,text,href,link}};
}
