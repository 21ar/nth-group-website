import mineral from '../assets/matterfield/matter-hero.png';
import architecture from '../assets/matterfield/matter-architecture.png';
import study from '../assets/matterfield/matter-research.png';
import health from '../assets/ventures/health.png';
import tms from '../assets/ventures/tms.png';
import telematics from '../assets/ventures/telematics.png';
import logistics from '../assets/ventures/logistics.png';
import systems from '../assets/ventures/systems.png';
import labs from '../assets/ventures/labs.png';
import chemicals from '../assets/ventures/chemicals.png';
import fleet from '../assets/ventures/fleet.png';
import events from '../assets/ventures/events.png';
const physical={src:mineral,alt:'Conceptual sculpture of interlocking chrome mineral fragments with orange reflections'};
const spatial={src:architecture,alt:'Conceptual graphite architecture illuminated by a narrow orange passage'};
const material={src:study,alt:'Conceptual crystalline silver lattice emerging from dark stone'};
export const artwork={health:physical,mobility:spatial,systems:spatial,materials:material,events:physical,telematics:spatial,fleet:spatial,labs:material,logistics:spatial};
const ventureArtwork={
 'nrth-health':{src:health,alt:'Conceptual chrome ribbon and glass shells surrounding a warm amber core, a study of continuity in care'},
 'nrth-tms':{src:tms,alt:'Conceptual silver route weaving between graphite waypoints toward a warm architectural opening'},
 'nrth-telematics':{src:telematics,alt:'Conceptual machined chrome sensor held within three precise silver sensing rings'},
 'nrth-logistics':{src:logistics,alt:'Conceptual chrome pathway connecting monumental graphite bridges and an orange-lit passage'},
 'nrth-systems':{src:systems,alt:'Conceptual precision-fitted chrome and graphite modules forming a connected arch'},
 'nrth-labs':{src:labs,alt:'Conceptual open chrome lattice surrounding an amber seed above dark stone'},
 'nrth-chemicals':{src:chemicals,alt:'Conceptual silver crystalline structure meeting a translucent amber droplet'},
 'nrth-fleet':{src:fleet,alt:'Conceptual coordinated silver capsules on a graphite platform, one revealing a warm inner seam'},
 'nrth-events':{src:events,alt:'Conceptual continuous chrome ribbon framing a circular stage in a warm graphite space'},
};
export function projectArtwork(slug:string,custom?:{coverImage?:string;coverAlt?:string}){
 if(custom?.coverImage&&custom.coverAlt)return {src:custom.coverImage,alt:custom.coverAlt};
 if(slug in ventureArtwork)return ventureArtwork[slug as keyof typeof ventureArtwork];
 if(slug==='nrth-health'||slug==='nrth-events')return physical;
 if(slug==='nrth-labs'||slug==='nrth-chemicals')return material;
 return spatial;
}
