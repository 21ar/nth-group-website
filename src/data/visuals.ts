import health from '../assets/health-art.png';
import mobility from '../assets/mobility-art.png';
import systems from '../assets/systems-art.png';
import materials from '../assets/materials-art.png';
import events from '../assets/events-art.png';
import telematics from '../assets/telematics-art.png';
import fleet from '../assets/fleet-art.png';
import labs from '../assets/labs-art.png';
import logistics from '../assets/logistics-art.png';

export const artwork = {
  health: { src: health, alt: 'A flowing frosted glass ribbon joined by polished metal connections on a sage glass foundation' },
  mobility: { src: mobility, alt: 'A miniature freight vehicle moving across an interconnected sculptural network of chrome roads and terracotta terrain' },
  systems: { src: systems, alt: 'An interlocking architecture of chrome and translucent blue glass modules' },
  materials: { src: materials, alt: 'Precision glass and amber material structures with polished metal connections' },
  events: { src: events, alt: 'A sculptural gathering space made of translucent lilac glass and reflective architecture' },
  telematics: { src: telematics, alt: 'A mirrored sphere above a lime glass landscape of precise paths and connected signal nodes' },
  fleet: { src: fleet, alt: 'A precision graphite transport platform with three ivory freight vehicles and chrome lane dividers' },
  labs: { src: labs, alt: 'An experimental chrome ring intersecting a translucent amber glass sheet with a suspended reflective sphere' },
  logistics: { src: logistics, alt: 'Frosted amber freight-container structures connected by precise chrome bridges on ochre terrain' },
};
export function projectArtwork(slug: string) {
  if (slug === 'nrth-health') return artwork.health;
  if (slug === 'nrth-chemicals') return artwork.materials;
  if (slug === 'nrth-events') return artwork.events;
  if (slug === 'nrth-telematics') return artwork.telematics;
  if (slug === 'nrth-fleet') return artwork.fleet;
  if (slug === 'nrth-labs') return artwork.labs;
  if (slug === 'nrth-logistics') return artwork.logistics;
  if (slug === 'nrth-tms') return artwork.mobility;
  return artwork.systems;
}
