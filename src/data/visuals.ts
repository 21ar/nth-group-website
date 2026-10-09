import health from '../assets/fold-health.png';
import mobility from '../assets/fold-hero.png';
import systems from '../assets/fold-systems.png';
import materials from '../assets/fold-materials.png';
import events from '../assets/fold-events.png';
import labs from '../assets/fold-research.png';

const mobilityArt={src:mobility,alt:'Coral, lavender and ivory sheets unfold into a connected architectural landscape'};
export const artwork={
  health:{src:health,alt:'An open coral and ivory fold embraces a small satin sphere, with a lavender sheet behind'},
  mobility:mobilityArt,
  systems:{src:systems,alt:'Translucent curved sheets form a connected open framework in coral, lavender and ivory'},
  materials:{src:materials,alt:'Softly curled coral, lavender and ivory sheets form connected cellular spaces'},
  events:{src:events,alt:'Concentric coral and ivory folds frame an open space for gathering'},
  telematics:mobilityArt,
  fleet:mobilityArt,
  labs:{src:labs,alt:'A shared root opens into a fan of curved ivory, lavender and coral sheets'},
  logistics:mobilityArt,
};
export function projectArtwork(slug:string,custom?:{coverImage?:string;coverAlt?:string}){
  if(custom?.coverImage && custom.coverAlt)return {src:custom.coverImage,alt:custom.coverAlt};
  if(slug==='nrth-health')return artwork.health;
  if(slug==='nrth-chemicals')return artwork.materials;
  if(slug==='nrth-events')return artwork.events;
  if(slug==='nrth-labs')return artwork.labs;
  if(['nrth-tms','nrth-telematics','nrth-logistics','nrth-fleet'].includes(slug))return artwork.mobility;
  return artwork.systems;
}
