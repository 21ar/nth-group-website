import {projects, type Project} from './projects';
import {articles} from './articles';
import {projectDetails, type ProjectDetails} from './project-details';
import {siteContent} from './site-content';
import {industries} from './industries';
import {readFile} from 'node:fs/promises';

export type Milestone = {title: string; date: string; text: string; venture?: string};
export type ContentSnapshot = {
  ventures?: (Partial<Project> & {slug: string; details?: Partial<ProjectDetails>})[];
  articles?: typeof articles;
  site?: {opening?: typeof siteContent.opening; investors?: typeof siteContent.investors; companyFacts?: {label: string; value: string}[]};
  milestones?: Milestone[];
  industries?: {name: string; title: string[]; copy: string}[];
  revisions?: {id: string; revision: string; updatedAt: string}[];
};
const query = `{
  "ventures": *[_type == "venture"]{slug, headline, description, introduction, stage, reviewedAt, productUrl, demoUrl, "coverImage": coverImage.asset->url, coverAlt, "details": {statement, audience, capabilities, journey, connection}},
  "articles": *[_type == "article"] | order(publishedAt desc){"slug": slug.current, category, title, description, paragraphs, related, author, publishedAt, prompts},
  "site": *[_type == "siteSettings"][0]{opening, investors, companyFacts},
  "milestones": *[_type == "milestone"] | order(date desc){title, date, text, venture},
  "industries": *[_type == "industry"]{name, title, copy},
  "revisions": *[_type in ["venture", "article", "siteSettings", "milestone", "industry"]]{"id": _id, "revision": _rev, "updatedAt": _updatedAt}
}`;
let published: Promise<ContentSnapshot> | undefined;
let draftSnapshot: {promise: Promise<ContentSnapshot>; expires: number} | undefined;
const env = (key: string) => import.meta.env[key] || process.env[key] || '';
export function cmsConfigured() {return Boolean(env('SANITY_PROJECT_ID') && env('SANITY_DATASET'));}
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
  return json.result;
}
async function snapshot(draft = false): Promise<ContentSnapshot> {
  if (draft) {if (!draftSnapshot || draftSnapshot.expires < Date.now()) draftSnapshot = {promise:fetchContent(true), expires:Date.now()+2000}; return draftSnapshot.promise;}
  // A deployment's HTML, PDF, and revision manifest share one frozen build input.
  if (process.env.NRTH_CONTENT_SNAPSHOT) return published ||= readFile(process.env.NRTH_CONTENT_SNAPSHOT,'utf8').then(text=>JSON.parse(text));
  return published ||= fetchContent();
}
export function mergeProjects(content: ContentSnapshot) {
  return projects.map(original => {
    const record = content.ventures?.find(item => item.slug === original.slug);
    if (!record) return original;
    const updated = {...original};
    for (const key of ['headline', 'description', 'introduction', 'reviewedAt'] as const) if (typeof record[key] === 'string' && record[key]?.trim()) updated[key] = record[key];
    if (record.stage && ['overview', 'research', 'prototype', 'pilot', 'available'].includes(record.stage) && (record.stage === 'overview' || /^\d{4}-\d{2}-\d{2}$/.test(record.reviewedAt || ''))) updated.stage = record.stage;
    if (record.coverImage?.startsWith('https://cdn.sanity.io/images/') && record.coverAlt?.trim()) {updated.coverImage = record.coverImage; updated.coverAlt = record.coverAlt;}
    for (const key of ['productUrl', 'demoUrl'] as const) {
      if (!record[key]) continue;
      try {const url = new URL(record[key]); if (url.protocol === 'https:') updated[key] = url.href;} catch { /* Invalid links never reach the public site. */ }
    }
    return updated;
  });
}
export async function getProjects(draft = false) {return mergeProjects(await snapshot(draft));}
export async function getProjectDetails(slug: string, draft = false) {
  const defaults = projectDetails[slug], record = (await snapshot(draft)).ventures?.find(item => item.slug === slug)?.details;
  if (!record) return defaults;
  const merged = {...defaults};
  for (const key of ['statement','connection'] as const) if (typeof record[key] === 'string' && record[key]?.trim()) merged[key] = record[key];
  if (Array.isArray(record.audience) && record.audience.length && record.audience.every(value=>typeof value === 'string' && value)) merged.audience = record.audience;
  for (const key of ['capabilities','journey'] as const) if (Array.isArray(record[key]) && record[key]?.length === 3 && record[key]?.every(item=>typeof item.title === 'string' && typeof item.text === 'string')) merged[key] = record[key];
  return merged;
}
export async function getArticles(draft = false) {
  const records = (await snapshot(draft)).articles;
  if (!records?.length) return articles;
  // Invalid or incomplete documents cannot replace usable published content.
  const valid = records.filter(item => /^[a-z0-9-]+$/.test(item.slug) && item.title && item.description && item.paragraphs?.length && item.author && /^\d{4}-\d{2}-\d{2}/.test(item.publishedAt));
  const overrides = valid.map(item => ({...item, related: item.related || [], prompts: item.prompts || []}));
  return [...articles.filter(original=>!overrides.some(item=>item.slug === original.slug)),...overrides].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
export async function getSiteContent(draft = false) {const source = (await snapshot(draft)).site; return {...siteContent, ...source, opening: {...siteContent.opening, ...source?.opening}, investors: {...siteContent.investors, ...source?.investors}};}
export async function getMilestones(draft = false) {return (await snapshot(draft)).milestones || [];}
export async function getIndustries(draft = false) {const records = (await snapshot(draft)).industries; return industries.map(industry => {const record = records?.find(item => item.name === industry.name); return record ? {...industry, title:record.title?.length === 2 ? record.title : industry.title, copy:record.copy || industry.copy} : industry;});}
export async function getContentRevision() {return {source: cmsConfigured() ? 'sanity' : 'repository', documents: (await snapshot()).revisions || []};}
