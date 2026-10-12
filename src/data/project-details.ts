import {projects} from './projects';
import {venturePerspectives} from './venture-perspectives';
export type ProjectDetails={statement:string;audience:string[];capabilities:{title:string;text:string}[];journey:{title:string;text:string}[];connection:string;};
// Preserve the editable Sanity contract while supplying specific repository defaults.
export const projectDetails:Record<string,ProjectDetails>=Object.fromEntries(projects.map(project=>{
 const perspective=venturePerspectives[project.slug];
 return [project.slug,{statement:perspective.question,audience:perspective.audience,capabilities:project.focus,journey:perspective.preparation,connection:perspective.connection}];
}));
