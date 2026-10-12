import {connectionStories} from './connections';
const records:Record<string,{record:string;owner:string;check:string}>={
 'nrth-tms':{record:'The requested movement, collection and delivery windows, fixed constraints and unresolved assignment assumptions.',owner:'The planner responsible for confirming the commitment.',check:'Can this assignment still support the original window, and which change needs approval?'},
 'nrth-telematics':{record:'The observed activity, its source and timestamp, freshness limit and the uncertainty around what it means.',owner:'The operations person interpreting the observation.',check:'Is this observation fresh enough to change the decision, or does it need confirmation?'},
 'nrth-fleet':{record:'The resource, suitability factors, availability, condition information and the responsibility for checking readiness.',owner:'The person who can confirm readiness for the proposed work.',check:'Does available also mean suitable and ready for this particular assignment?'},
 'nrth-logistics':{record:'The commitment, receiving team, acknowledgement, next action and the exception that needs attention.',owner:'The named person at the receiving handoff.',check:'Has responsibility been accepted, and what happens if the receiving team cannot meet the commitment?'},
 'nrth-health':{record:'An administrative question, authorized information context, an accessible next step and its responsible person.',owner:'The appropriate coordinator for the information task.',check:'Can the person explain the next administrative step without revealing information outside the intended access boundary?'},
 'nrth-systems':{record:'The agreed information contract, source of truth, access boundary, version and failure or recovery expectation.',owner:'The team accountable for that system boundary.',check:'Does the receiving side understand the source, permission and recovery path if this exchange is incomplete?'},
 'nrth-labs':{record:'The bounded question, proposed method, observable result, limits and the decision that learning could change.',owner:'The person responsible for the study and its interpretation.',check:'Would the proposed observation distinguish the alternatives without claiming more than the method supports?'},
 'nrth-chemicals':{record:'The intended application, operating conditions, relevant properties, documentation provenance and open technical requirements.',owner:'The qualified technical reviewer for the intended application.',check:'Which requirement has supporting documentation, and which still needs qualified assessment?'},
 'nrth-events':{record:'The audience purpose, arrival needs, sequence of shared moments, transition constraints and production responsibility.',owner:'The host or producer accountable for the relevant audience moment.',check:'Does this production decision support the intended experience and leave a clear contingency?'},
};
export function connectionHandoffFor(from:string,to:string){
 if(!connectionStories.find(story=>story.slug===from)?.links.some(link=>link.slug===to))return null;
 return records[to]||null;
}
