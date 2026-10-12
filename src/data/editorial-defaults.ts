import {projects} from './projects';
import {emptyEditorial,type VentureEditorial} from './editorial-content';

export const companyFacts = [
  {label:'Company',value:'NRTH Inc.'},
  {label:'Shared identity',value:'NRTH'},
  {label:'Venture directions',value:'Nine across six fields'},
  {label:'Website',value:'nrth.group'},
];
const scopes:Record<string,string>={
  'nrth-health':'Administrative information, access and the next responsible person in a care journey.',
  'nrth-tms':'Shipment constraints, planning windows, assignments and the exceptions that change a transportation decision.',
  'nrth-telematics':'Vehicle observations with a source, timestamp, freshness and the context needed to interpret a signal.',
  'nrth-logistics':'Commitments, acknowledgements and responsibility as work passes between people and organizations.',
  'nrth-systems':'Information boundaries, access, exchanges and recovery around a specific workflow.',
  'nrth-labs':'Bounded questions, methods, observations and the decisions a small experiment could inform.',
  'nrth-chemicals':'Application conditions, material requirements and the documentation that a qualified review would need.',
  'nrth-fleet':'Availability, suitability, condition and responsibility before committing a resource to work.',
  'nrth-events':'The intention, arrival, shared moments and production decisions behind a gathering.',
};
export function defaultVentureEditorial(slug:string):VentureEditorial {
  const project=projects.find(item=>item.slug===slug);
  return {...emptyEditorial(),scope:{currentScope:scopes[slug]||'A venture direction within NRTH Inc.',availability:'Specific capabilities, availability and commercial arrangements are established directly with NRTH.'},related:{ventures:project?.related||[],industries:project?[project.category.toLowerCase()]:[],articles:[]}};
}
