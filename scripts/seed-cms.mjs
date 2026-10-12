// Creates initial drafts only. It does not publish content or provision a project.
import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
const projectId=process.env.SANITY_PROJECT_ID,dataset=process.env.SANITY_DATASET,token=process.env.SANITY_API_WRITE_TOKEN;
if(!projectId||!dataset||!token)throw new Error('Set server-side Sanity project, dataset, and write-token variables before creating drafts.');
await mkdir('.astro',{recursive:true});
await build({stdin:{contents:"export {projects} from './src/data/projects';export {projectDetails} from './src/data/project-details';export {industries} from './src/data/industries';export {siteContent} from './src/data/site-content';export {articles} from './src/data/articles';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:'.astro/seed-content.mjs'});
const {projects,projectDetails,industries,siteContent,articles}=await import('../.astro/seed-content.mjs');
const keyed=items=>items.map((item,i)=>({...item,_key:'item-'+i}));
const documents=[
 ...projects.map(project=>({_id:'drafts.venture-'+project.slug,_type:'venture',slug:project.slug,headline:project.headline,description:project.description,introduction:project.introduction,...projectDetails[project.slug],capabilities:keyed(projectDetails[project.slug].capabilities),journey:keyed(projectDetails[project.slug].journey),stage:'overview'})),
 ...industries.map(industry=>({_id:'drafts.industry-'+industry.name.toLowerCase(),_type:'industry',name:industry.name,title:industry.title,copy:industry.copy})),
 {_id:'drafts.site-settings',_type:'siteSettings',...siteContent,companyFacts:keyed([{label:'Company',value:'NRTH Inc.'},{label:'Shared identity',value:'NRTH'},{label:'Venture directions',value:'Nine across six fields'},{label:'Website',value:'nrth.group'}])},
 ...articles.map(article=>({...article,_id:'drafts.article-'+article.slug,_type:'article',slug:{_type:'slug',current:article.slug}})),
];
const result=await fetch(`https://${projectId}.api.sanity.io/v2025-02-19/data/mutate/${dataset}`,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({mutations:documents.map(document=>({createIfNotExists:document}))})});
if(!result.ok)throw new Error('Draft initialization failed ('+result.status+').');
console.log('Created or retained '+documents.length+' draft documents. Nothing was published.');
