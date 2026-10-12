import {projects, type Project} from './projects';
import {articles,type Article} from './articles';
import {projectDetails, type ProjectDetails} from './project-details';
import {siteContent} from './site-content';
import {industries} from './industries';
import {readFile} from 'node:fs/promises';
import {companyFacts,defaultVentureEditorial} from './editorial-defaults';
import {editorialText,editorialDate,editorialHttps,sanitizeEditorial,sanitizeArticleDiagram,emptyEditorial,type ArticleEditorial,type VentureEditorial,type EditorialContent} from './editorial-content';

export type Milestone = {title: string; date: string; text: string; venture?: string};
export type ContentArticle = Article & {editorial?:ArticleEditorial};
export type EditorialPage = 'company'|'approach'|'research'|'investors'|'partnerships'|'press';
export type ContentSnapshot = {
  ventures?: (Partial<Project> & {slug: string; details?: Partial<ProjectDetails>;editorial?:unknown})[];
  articles?: ContentArticle[];
  site?: {opening?: typeof siteContent.opening; investors?: typeof siteContent.investors; companyFacts?: {label: string; value: string}[];pages?:{page:EditorialPage;editorial:unknown}[]};
  milestones?: Milestone[];
  industries?: {name: string; title: string[]; copy: string;editorial?:unknown}[];
  revisions?: {id: string; revision: string; updatedAt: string}[];
};
const query = `{
  "ventures": *[_type == "venture"]{slug, headline, description, introduction, stage, reviewedAt, productUrl, demoUrl, "coverImage": coverImage.asset->url, coverAlt, editorial, "details": {statement, audience, capabilities, journey, connection}},
  "articles": *[_type == "article"] | order(publishedAt desc){"slug": slug.current, category, title, description, paragraphs, related, author, publishedAt, prompts, editorial},
  "site": *[_type == "siteSettings"][0]{opening, investors, companyFacts, pages},
  "milestones": *[_type == "milestone"] | order(date desc){title, date, text, venture},
  "industries": *[_type == "industry"]{name, title, copy, editorial},
  "revisions": *[_type in ["venture", "article", "siteSettings", "milestone", "industry"]]{"id": _id, "revision": _rev, "updatedAt": _updatedAt}
}`;
let published: Promise<ContentSnapshot> | undefined;
let draftSnapshot: {promise: Promise<ContentSnapshot>; expires: number} | undefined;
const env = (key: string) => import.meta.env[key] || process.env[key] || '';
export function cmsConfigured() {return Boolean(env('SANITY_PROJECT_ID') && env('SANITY_DATASET'));}
function normalizeSnapshot(value:unknown):ContentSnapshot {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Content snapshot must be an object.');
  const source=value as Record<string,unknown>,normalized:Record<string,unknown>={};
  for(const key of ['ventures','articles','milestones','industries','revisions']){
    const values=source[key];if(Array.isArray(values))normalized[key]=values.slice(0,1000).filter(item=>item&&typeof item==='object'&&!Array.isArray(item));
  }
  if(source.site&&typeof source.site==='object'&&!Array.isArray(source.site)){
    const site={...source.site} as Record<string,unknown>;
    for(const key of ['companyFacts','pages'])if(Array.isArray(site[key]))site[key]=(site[key] as unknown[]).filter(item=>item&&typeof item==='object'&&!Array.isArray(item));else delete site[key];
    for(const key of ['opening','investors'])if(!site[key]||typeof site[key]!=='object'||Array.isArray(site[key]))delete site[key];
    normalized.site=site;
  }
  return normalized as ContentSnapshot;
}
export async function fetchContent(draft = false): Promise<ContentSnapshot> {
  if (!cmsConfigured()) return {};
  const projectId = env('SANITY_PROJECT_ID'), dataset = env('SANITY_DATASET');
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) throw new Error('Invalid Sanity project configuration.');
  const token = env('SANITY_API_READ_TOKEN');
  if (draft && !token) throw new Error('Draft preview needs a server-side Sanity read token.');
  const url = new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', draft ? 'drafts' : 'published');
  const response = await fetch(url, {headers: token ? {Authorization: `Bearer ${token}`} : {}, signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error(`Sanity content request failed (${response.status}).`);
  const json = await response.json();
  if (!json.result || typeof json.result !== 'object') throw new Error('Sanity returned invalid content.');
  return normalizeSnapshot(json.result);
}
async function snapshot(draft = false): Promise<ContentSnapshot> {
  if (draft) {if (!draftSnapshot || draftSnapshot.expires < Date.now()) draftSnapshot = {promise:fetchContent(true), expires:Date.now()+2000}; return draftSnapshot.promise;}
  // A deployment's HTML, PDF, and revision manifest share one frozen build input.
  if (process.env.NRTH_CONTENT_SNAPSHOT) return published ||= readFile(process.env.NRTH_CONTENT_SNAPSHOT,'utf8').then(text=>normalizeSnapshot(JSON.parse(text)));
  return published ||= fetchContent();
}
export function mergeProjects(content: ContentSnapshot) {
  return projects.map(original => {
    const record = Array.isArray(content.ventures)?content.ventures.find(item => item&&item.slug === original.slug):undefined;
    if (!record) return original;
    const updated = {...original};
    for (const key of ['headline', 'description', 'introduction'] as const) {const text=editorialText(record[key],key==='headline'?100:2400);if(text)updated[key]=text;}
    const reviewedAt=editorialDate(record.reviewedAt);if(reviewedAt)updated.reviewedAt=reviewedAt;
    if (record.stage && ['overview', 'research', 'prototype', 'pilot', 'available'].includes(record.stage) && (record.stage === 'overview' || reviewedAt)) updated.stage = record.stage;
    const cover=editorialHttps(record.coverImage),alt=editorialText(record.coverAlt,400);
    if (cover?.startsWith('https://cdn.sanity.io/images/') && alt) {updated.coverImage = cover; updated.coverAlt = alt;}
    for (const key of ['productUrl', 'demoUrl'] as const) {
      if (!record[key]) continue;
      const url=editorialHttps(record[key]);if(url)updated[key]=url;
    }
    return updated;
  });
}
export async function getProjects(draft = false) {return mergeProjects(await snapshot(draft));}
export async function getProjectDetails(slug: string, draft = false) {
  const defaults = projectDetails[slug], record = (await snapshot(draft)).ventures?.find(item => item.slug === slug)?.details;
  if (!record) return defaults;
  const merged = {...defaults};
  for (const key of ['statement','connection'] as const) {const text=editorialText(record[key],1600);if(text)merged[key]=text;}
  if (Array.isArray(record.audience) && record.audience.length<=5 && record.audience.length && record.audience.every(value=>editorialText(value,180))) merged.audience = record.audience.map(value=>value.trim());
  for (const key of ['capabilities','journey'] as const) if (Array.isArray(record[key]) && record[key]?.length === 3 && record[key]?.every(item=>item&&editorialText(item.title,160)&&editorialText(item.text,1800))) merged[key] = record[key];
  return merged;
}
function linkContext(content:ContentSnapshot) {return {ventures:projects.map(item=>item.slug),industries:industries.map(item=>item.name.toLowerCase()),articles:[...new Set([...articles.map(item=>item.slug),...(Array.isArray(content.articles)?content.articles.filter(item=>typeof item.slug==='string'&&/^[a-z0-9-]{1,100}$/.test(item.slug)).map(item=>item.slug):[])])]};}
export async function getArticles(draft = false):Promise<ContentArticle[]> {
  const source=await snapshot(draft),records=source.articles,context=linkContext(source);
  if (!Array.isArray(records)||!records.length) return [...articles].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  // Invalid or incomplete documents cannot replace usable published content.
  const overrides:ContentArticle[]=records.slice(0,100).flatMap(item=>{
    if(!item||typeof item.slug!=='string'||!/^[a-z0-9-]{1,100}$/.test(item.slug))return [];
    const title=editorialText(item.title,180),description=editorialText(item.description,700),author=editorialText(item.author,140),publishedAt=editorialDate(item.publishedAt),category=editorialText(item.category,80);
    const paragraphs=Array.isArray(item.paragraphs)&&item.paragraphs.length<=100?item.paragraphs.map(value=>editorialText(value,7000)):[];
    if(!title||!description||!author||!publishedAt||!category||paragraphs.length<2||paragraphs.some(value=>!value))return [];
    const plain=paragraphs as string[],editorial:ArticleEditorial={...sanitizeEditorial(item.editorial,context),diagram:sanitizeArticleDiagram(item.editorial?.diagram,context,plain.length)};
    const references=editorial.references.length?editorial.references.map(reference=>({title:reference.label,href:reference.url,note:reference.note||''})):articles.find(original=>original.slug===item.slug)?.references;
    return [{slug:item.slug,title,description,author,publishedAt,category,paragraphs:plain,related:Array.isArray(item.related)?[...new Set(item.related.filter(value=>context.ventures.includes(value)))]:[],prompts:Array.isArray(item.prompts)?item.prompts.slice(0,8).map(value=>editorialText(value,500)).filter((value):value is string=>!!value):[],references,editorial}];
  });
  return [...articles.filter(original=>!overrides.some(item=>item.slug === original.slug)),...overrides].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
export async function getSiteContent(draft = false) {
  const source=(await snapshot(draft)).site;
  const opening={...siteContent.opening},investors={...siteContent.investors};
  for(const [target,record] of [[opening,source?.opening],[investors,source?.investors]] as const){
    for(const key of ['label','copy'] as const){const value=editorialText(record?.[key],key==='label'?100:700);if(value)target[key]=value;}
    if(Array.isArray(record?.lines)&&record.lines.length===2&&record.lines.every(value=>editorialText(value,100)))target.lines=record.lines;
  }
  const link=editorialText(source?.investors?.link,100);if(link)investors.link=link;
  return {...siteContent,opening,investors,companyFacts:await getCompanyFacts(draft)};
}
export async function getCompanyFacts(draft=false) {
  const values=(await snapshot(draft)).site?.companyFacts;
  const valid=Array.isArray(values)?values.slice(0,12).flatMap(item=>{const label=editorialText(item.label,100),value=editorialText(item.value,400);return label&&value?[{label,value}]:[];}):[];
  return valid.length?valid:companyFacts;
}
export async function getVentureEditorial(slug:string,draft=false):Promise<VentureEditorial> {
  const source=await snapshot(draft),record=source.ventures?.find(item=>item.slug===slug),defaults=defaultVentureEditorial(slug),editorial=sanitizeEditorial(record?.editorial,linkContext(source));
  const raw=record?.editorial&&typeof record.editorial==='object'?record.editorial as {scope?:Record<string,unknown>}:undefined;
  const scope={...defaults.scope};
  for(const key of ['currentScope','availability','owner'] as const){const value=editorialText(raw?.scope?.[key],key==='owner'?140:1600);if(value)scope[key]=value;}
  const date=editorialDate(raw?.scope?.reviewedAt);if(date)scope.reviewedAt=date;
  return {...editorial,scope,related:{ventures:editorial.related.ventures.length?editorial.related.ventures:defaults.related.ventures,industries:editorial.related.industries.length?editorial.related.industries:defaults.related.industries,articles:editorial.related.articles}};
}
export async function getArticleEditorial(slug:string,draft=false):Promise<ArticleEditorial> {
  const article=(await getArticles(draft)).find(item=>item.slug===slug);
  return article?.editorial||emptyEditorial();
}
export async function getPageEditorial(page:EditorialPage,draft=false):Promise<EditorialContent> {
  const source=await snapshot(draft),record=source.site?.pages?.find(item=>item.page===page);
  return sanitizeEditorial(record?.editorial,linkContext(source));
}
export async function getIndustryEditorial(name:string,draft=false):Promise<EditorialContent> {
  const source=await snapshot(draft),record=source.industries?.find(item=>typeof item.name==='string'&&item.name.toLowerCase()===name.toLowerCase());
  return sanitizeEditorial(record?.editorial,linkContext(source));
}
export async function getMilestones(draft = false):Promise<Milestone[]> {
  const values=(await snapshot(draft)).milestones;
  return Array.isArray(values)?values.slice(0,50).flatMap(item=>{const title=editorialText(item.title,180),date=editorialDate(item.date),text=editorialText(item.text,1800),venture=projects.find(project=>project.slug===item.venture)?.slug;return title&&date&&text?[{title,date,text,venture}]:[];}):[];
}
export async function getIndustries(draft = false) {const records = (await snapshot(draft)).industries; return industries.map(industry => {const record = records?.find(item => item.name === industry.name);return record ? {...industry,title:Array.isArray(record.title)&&record.title.length===2&&record.title.every(value=>editorialText(value,100))?record.title:industry.title,copy:editorialText(record.copy,1600)||industry.copy}:industry;});}
export async function getContentRevision() {const records=(await snapshot()).revisions;return {source: cmsConfigured() ? 'sanity' : 'repository', documents:Array.isArray(records)?records.slice(0,1000).filter(item=>editorialText(item.id,300)&&editorialText(item.revision,300)&&editorialText(item.updatedAt,100)):[]};}
