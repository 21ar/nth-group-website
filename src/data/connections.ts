export type ConnectionStory = {
  slug: string;
  field: 'Mobility' | 'Health' | 'Systems' | 'Materials' | 'Events' | 'Research';
  title: string;
  introduction: string;
  links: {slug: string; reason: string}[];
};

/** A map of questions and possible handoffs, rather than a claim of live integrations. */
export const connectionStories: ConnectionStory[] = [
  {
    slug: 'nrth-tms', field: 'Mobility', title: 'A plan needs a wider picture.',
    introduction: 'A shipment plan is only useful when the signals, resources and people around it are understood. Follow three parts of that wider picture.',
    links: [
      {slug: 'nrth-telematics', reason: 'A vehicle observation could help a planner understand what has changed, provided its timing and uncertainty are clear.'},
      {slug: 'nrth-fleet', reason: 'The resource behind an assignment has its own condition, availability and responsibilities to consider.'},
      {slug: 'nrth-logistics', reason: 'A plan crosses team boundaries. The handoff needs a named owner and an understandable next step.'},
    ],
  },
  {
    slug: 'nrth-telematics', field: 'Mobility', title: 'A signal becomes a decision.',
    introduction: 'Location and activity become more useful when a specific operational question gives them context. Explore where that context might come from.',
    links: [
      {slug: 'nrth-tms', reason: 'An assigned job gives a vehicle observation a purpose: what does this change about the plan?'},
      {slug: 'nrth-fleet', reason: 'The same observation can raise a different question about readiness, resource use or a vehicle responsibility.'},
      {slug: 'nrth-systems', reason: 'Information needs explicit boundaries: who may use a signal, how fresh it is and what happens when it is missing.'},
    ],
  },
  {
    slug: 'nrth-fleet', field: 'Mobility', title: 'Readiness connects to everything.',
    introduction: 'A fleet is more than a list of vehicles. Its daily decisions sit between the work ahead and what its resources can responsibly support.',
    links: [
      {slug: 'nrth-tms', reason: 'Assignment begins with a question about suitability and availability, rather than a vehicle name alone.'},
      {slug: 'nrth-telematics', reason: 'Vehicle activity could add context to a readiness discussion while keeping observation separate from assessment.'},
      {slug: 'nrth-logistics', reason: 'A change in resources needs to reach the people who own the commitments affected by it.'},
    ],
  },
  {
    slug: 'nrth-logistics', field: 'Mobility', title: 'The space between commitments.',
    introduction: 'A handoff is where a plan meets another person’s work. Clarity about requirements, timing and ownership matters across disciplines.',
    links: [
      {slug: 'nrth-tms', reason: 'A transportation plan can make a commitment explicit before it passes to dispatch or another team.'},
      {slug: 'nrth-fleet', reason: 'Resource constraints change what a team can promise and when it needs to revisit that promise.'},
      {slug: 'nrth-chemicals', reason: 'Industrial materials introduce application-specific requirements that deserve qualified handling and partner expertise.'},
    ],
  },
  {
    slug: 'nrth-health', field: 'Health', title: 'Put the person before the process.',
    introduction: 'Useful health information is a design question as well as a technical one. A careful workflow starts with the people who must understand it.',
    links: [
      {slug: 'nrth-systems', reason: 'Access, ownership and information boundaries help define what a responsible care-related workflow would require.'},
      {slug: 'nrth-labs', reason: 'A small, non-clinical study can examine comprehension or coordination before making wider assumptions.'},
    ],
  },
  {
    slug: 'nrth-systems', field: 'Systems', title: 'Make the connections deliberate.',
    introduction: 'The useful part of a system is often the agreement at its edges: what is exchanged, who is responsible and what a person can understand.',
    links: [
      {slug: 'nrth-telematics', reason: 'Signals raise concrete questions about freshness, missing information and the permissions around an observation.'},
      {slug: 'nrth-health', reason: 'Care-related information brings privacy, accessibility and careful language into the system’s foundations.'},
      {slug: 'nrth-events', reason: 'A gathering has a temporary workflow: people, information and responsibilities that need to fit its purpose.'},
    ],
  },
  {
    slug: 'nrth-chemicals', field: 'Materials', title: 'An application starts a conversation.',
    introduction: 'Material properties only make sense alongside an intended use. The next useful step may be an experiment, a qualified partner or a clearer requirement.',
    links: [
      {slug: 'nrth-labs', reason: 'A focused technical question helps distinguish what is already known from what needs qualified investigation.'},
      {slug: 'nrth-logistics', reason: 'An eventual industrial offering would need to consider provenance, handling requirements and the movement of materials.'},
    ],
  },
  {
    slug: 'nrth-events', field: 'Events', title: 'A gathering creates new connections.',
    introduction: 'Events give an idea a shared setting. Purpose, rhythm and practical coordination shape what people can exchange and take away.',
    links: [
      {slug: 'nrth-labs', reason: 'A workshop or conversation can expose a better question and help an early idea meet a different perspective.'},
      {slug: 'nrth-systems', reason: 'Behind a shared moment are information, access and handoffs that need to support the experience.'},
    ],
  },
  {
    slug: 'nrth-labs', field: 'Research', title: 'Let the question cross boundaries.',
    introduction: 'A research direction can begin anywhere in the portfolio. The aim is a useful question, a limited experiment and an honest account of what was learned.',
    links: [
      {slug: 'nrth-systems', reason: 'A prototype can make a workflow assumption tangible enough for someone to examine.'},
      {slug: 'nrth-chemicals', reason: 'An application question can define the expertise and evidence needed for a material investigation.'},
      {slug: 'nrth-health', reason: 'A question about comprehension or coordination can be studied without implying clinical capability or outcomes.'},
    ],
  },
];

export const connectionFields = [
  {name: 'Mobility', slug: 'nrth-tms'},
  {name: 'Health', slug: 'nrth-health'},
  {name: 'Systems', slug: 'nrth-systems'},
  {name: 'Materials', slug: 'nrth-chemicals'},
  {name: 'Events', slug: 'nrth-events'},
  {name: 'Research', slug: 'nrth-labs'},
];

export const connectionPositions: Record<string, {x: number; y: number}> = {
  'nrth-tms': {x: 215, y: 112},
  'nrth-telematics': {x: 135, y: 306},
  'nrth-fleet': {x: 224, y: 536},
  'nrth-logistics': {x: 518, y: 617},
  'nrth-systems': {x: 485, y: 343},
  'nrth-labs': {x: 783, y: 345},
  'nrth-health': {x: 537, y: 101},
  'nrth-chemicals': {x: 824, y: 572},
  'nrth-events': {x: 824, y: 127},
};

export function connectionPath(from: string, to: string) {
  const a = connectionPositions[from], b = connectionPositions[to];
  const dx = b.x - a.x, dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  const bend = Math.min(90, length * .19) * (from < to ? 1 : -1);
  const cx = (a.x + b.x) / 2 - dy / length * bend;
  const cy = (a.y + b.y) / 2 + dx / length * bend;
  return `M ${a.x} ${a.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x} ${b.y}`;
}
