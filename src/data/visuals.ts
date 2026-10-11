import mineral from '../assets/matterfield/matter-hero.png';
import architecture from '../assets/matterfield/matter-architecture.png';
import study from '../assets/matterfield/matter-research.png';
const physical={src:mineral,alt:'Conceptual sculpture of interlocking chrome mineral fragments with orange reflections'};
const spatial={src:architecture,alt:'Conceptual graphite architecture illuminated by a narrow orange passage'};
const material={src:study,alt:'Conceptual crystalline silver lattice emerging from dark stone'};
export const artwork={health:physical,mobility:spatial,systems:spatial,materials:material,events:physical,telematics:spatial,fleet:spatial,labs:material,logistics:spatial};
export function projectArtwork(slug:string,custom?:{coverImage?:string;coverAlt?:string}){
 if(custom?.coverImage&&custom.coverAlt)return {src:custom.coverImage,alt:custom.coverAlt};
 if(slug==='nrth-health'||slug==='nrth-events')return physical;
 if(slug==='nrth-labs'||slug==='nrth-chemicals')return material;
 return spatial;
}
