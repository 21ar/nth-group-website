import {getArticles, getIndustries, getProjects} from './content';
import type {SearchRecord} from './search-engine';
import {designStudies,studyTitle} from './design-studies';

const ventureAliases: Record<string, string[]> = {
 'nrth-health':['healthcare','care','patient','administration','health information'],
 'nrth-tms':['transport management system','transportation','dispatch','shipment','loads','planning'],
 'nrth-telematics':['gps','vehicle signals','tracking','telemetry','location','freshness'],
 'nrth-logistics':['supply chain','handoff','delivery','movement','responsibility'],
 'nrth-systems':['software','infrastructure','integration','access','recovery'],
 'nrth-labs':['research','experiments','investigation','prototypes','questions'],
 'nrth-chemicals':['materials','chemistry','industrial','specification','application'],
 'nrth-fleet':['vehicles','equipment','availability','maintenance','condition'],
 'nrth-events':['gatherings','experience','production','audience','transitions'],
};
const pages: SearchRecord[] = [
 {id:'company',type:'company',title:'NRTH Inc.',description:'The company, its nine venture directions and the relationships around the work.',url:'/about',aliases:['about','company','north','nrth group','portfolio']},
 {id:'approach',type:'company',title:'How we approach the work',description:'Frame a question, examine the context and make the next decision clear.',url:'/approach',aliases:['approach','methods','working','process','worked example']},
 {id:'investors',type:'company',title:'Investor perspectives',description:'Compare venture directions, prepare a public reading pack and start a considered conversation.',url:'/investors',aliases:['investment','investor','capital','portfolio','comparison']},
 {id:'partnerships',type:'company',title:'Partnerships',description:'Prepare a shared question, contribution and next step with a partnership outline.',url:'/partnerships',aliases:['partner','collaboration','brief','outline']},
 {id:'press',type:'company',title:'Press and identity',description:'Company descriptions, the actual NRTH wordmark and resources for editorial use.',url:'/press',aliases:['media','press','logo','brand','wordmark']},
 {id:'contact',type:'company',title:'Connect with NRTH',description:'Make an introduction to the company, a venture, partnership or investor conversation.',url:'/contact',aliases:['email','contact','inquiry','enquiry','hello']},
 {id:'research',type:'research',title:'Research at NRTH',description:'Explore visual studies, prepare a research outline and examine what a question needs.',url:'/research',aliases:['research','experiment','labs','investigation','notebook']},
 {id:'work',type:'research',title:'NRTH work and design studies',description:'Inspect documented visual and information design studies, with artifacts, methods, observations and limits.',url:'/work',aliases:['work','library','design studies','case studies','notebook','artifact']},
 {id:'matter-lab',type:'research',title:'The visual structure lab',description:'Shape six arrangements. Change structure and perspective, then save your own study.',url:'/research#visual-study',aliases:['3d','interactive','graphics','form','shape','chrome','visual study']},
 {id:'experiment',type:'research',title:'Prepare a research outline',description:'Choose a field, starter question and method. Record observations, limits and a next decision.',url:'/research#experiment',aliases:['research outline','questions','method','starter','experiment planner']},
 {id:'company-overview',type:'resource',title:'NRTH company overview',description:'Download the public company and venture overview as a PDF.',url:'/resources/nrth-company-overview.pdf',aliases:['pdf','download','overview','portfolio','investor materials']},
 {id:'wordmark',type:'resource',title:'NRTH wordmark',description:'The canonical NRTH logo in an SVG file.',url:'/resources/nrth-wordmark.svg',aliases:['logo','brand','svg','identity','download']},
 {id:'wordmark-outline',type:'resource',title:'NRTH outline wordmark',description:'The canonical N, R, T and H contours in an outline SVG file.',url:'/resources/nrth-wordmark-outline.svg',aliases:['outline logo','svg','identity','download']},
 {id:'editorial-reference',type:'resource',title:'NRTH editorial reference',description:'Plain-text company descriptions, venture names and guidance for referring to NRTH.',url:'/resources/editorial-reference.txt',aliases:['press','text','download','company descriptions','reference']},
 {id:'portfolio-reading-guide',type:'resource',title:'NRTH portfolio reading guide',description:'A public reading guide to the company, venture directions and scope questions for an investor conversation.',url:'/resources/portfolio-reading-guide.txt',aliases:['investor','reading pack','public materials','download','portfolio','scope']},
];

/** Only intentionally public records enter the downloadable index. */
export async function getSearchRecords(): Promise<SearchRecord[]> {
 const [ventures, fields, articles] = await Promise.all([getProjects(),getIndustries(),getArticles()]);
 return [
  ...pages,
  ...designStudies.map(study=>({id:'study-'+study.slug,type:'research' as const,title:studyTitle(study),description:study.description,url:'/work/'+study.slug,aliases:study.aliases})),
  ...ventures.map(venture=>({id:venture.slug,type:'venture' as const,title:venture.name,description:venture.description,url:'/projects/'+venture.slug,aliases:ventureAliases[venture.slug]||[]})),
  ...fields.map(field=>({id:'field-'+field.name.toLowerCase(),type:'industry' as const,title:field.name+' at NRTH',description:field.copy,url:'/industries/'+field.name.toLowerCase(),aliases:[field.name,...field.ventures,...(field.name==='Materials'?['chemicals','chemistry']:field.name==='Mobility'?['transport','fleet','logistics','telematics']:[])]})),
  ...articles.map(article=>({id:'writing-'+article.slug,type:'writing' as const,title:article.title,description:article.description,url:'/insights/'+article.slug,aliases:[article.category,...article.related]})),
 ];
}
