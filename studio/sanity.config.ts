import {defineConfig, type DocumentActionComponent} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schema';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error('Set SANITY_STUDIO_PROJECT_ID before starting the NRTH Studio.');
const site = process.env.SANITY_STUDIO_PREVIEW_URL || 'https://nrth.group';
const Preview: DocumentActionComponent = ({draft,published}) => {
  const document = draft || published;
  const type = document?._type;
  const slug = document?.slug as string | {current:string} | undefined;
  const field=typeof document?.name==='string'?document.name.toLowerCase():undefined;
  const path = type === 'venture' && typeof slug === 'string' ? '/preview/venture/' + slug : type === 'article' && typeof slug === 'object' ? '/preview/article/' + slug.current : type==='industry'&&field?'/preview/industry/'+field:type === 'milestone' ? '/preview/investors' : type==='siteSettings'?'/preview/company':'/preview/home';
  return {label:'Preview on website',onHandle:()=>window.open(new URL(path,site).href,'_blank','noopener,noreferrer')};
};
export default defineConfig({
  name:'nrth',title:'NRTH / Editorial Studio',projectId,dataset:process.env.SANITY_STUDIO_DATASET || 'production',
  plugins:[structureTool()],schema:{types:schemaTypes},document:{actions:previous=>[...previous,Preview]},
});
