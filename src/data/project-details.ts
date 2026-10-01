export type ProjectDetails = {
  statement: string;
  audience: string[];
  capabilities: { title: string; text: string }[];
  journey: { title: string; text: string }[];
  connection: string;
};
export const projectDetails: Record<string, ProjectDetails> = {
  'nrth-health': {
    statement: 'Care is personal. The technology around it should feel that way too.',
    audience: ['Individuals', 'Care teams', 'Health organizations'],
    capabilities: [
      { title: 'Health information', text: 'A direction for organizing important information around a person, with clear language and thoughtful access.' },
      { title: 'Care coordination', text: 'A focus on the next step: appointments, conversations, and the information people need between them.' },
      { title: 'Everyday wellbeing', text: 'Useful routines and information designed around everyday life, with accessibility and privacy at the center.' },
    ],
    journey: [
      { title: 'Understand', text: 'Start with the person, their context, and the information they need.' },
      { title: 'Connect', text: 'Make the relationships between information and care easier to follow.' },
      { title: 'Support', text: 'Help people understand what comes next without overwhelming them.' },
    ],
    connection: 'Health asks human questions. Systems brings the technical foundations; Labs creates space to test new approaches.',
  },
  'nrth-tms': {
    statement: 'One shipment. Many moving parts. A clearer way to bring them together.',
    audience: ['Carriers', 'Dispatch teams', 'Transportation operators'],
    capabilities: [
      { title: 'Load planning', text: 'A direction for bringing transportation requests, load details, and planning decisions into a coherent workflow.' },
      { title: 'Dispatch coordination', text: 'A focus on the people and resources assigned to the work, with clear responsibilities and handoffs.' },
      { title: 'Shipment visibility', text: 'An operational view of progress, exceptions, and the information a team needs to act.' },
    ],
    journey: [
      { title: 'Plan', text: 'Bring the request, requirements, and available resources together.' },
      { title: 'Coordinate', text: 'Connect dispatch decisions with the people doing the work.' },
      { title: 'Follow through', text: 'Keep progress and the next handoff understandable.' },
    ],
    connection: 'TMS is the coordination layer. Telematics adds vehicle context, Fleet adds resource perspective, and Logistics connects the wider journey.',
  },
  'nrth-telematics': {
    statement: 'A location tells you where. Context helps you understand what happens next.',
    audience: ['Fleet teams', 'Transport operators', 'Connected-vehicle partners'],
    capabilities: [
      { title: 'Vehicle context', text: 'A direction for organizing location, activity, and vehicle information into an understandable operational picture.' },
      { title: 'Signals into decisions', text: 'A focus on relevant changes and patterns rather than a constant stream of disconnected data.' },
      { title: 'Connected workflows', text: 'A bridge between vehicle information and the transportation or fleet decisions it can inform.' },
    ],
    journey: [
      { title: 'Observe', text: 'Understand the available information and its limitations.' },
      { title: 'Interpret', text: 'Add the context that turns a signal into something useful.' },
      { title: 'Connect', text: 'Put that context in reach of the right operational workflow.' },
    ],
    connection: 'Telematics brings context to movement. Its strongest connections are with the planning in TMS and the vehicle perspective in Fleet.',
  },
  'nrth-logistics': {
    statement: 'The journey is only as clear as the handoffs that connect it.',
    audience: ['Shippers', 'Logistics partners', 'Operations teams'],
    capabilities: [
      { title: 'Partner coordination', text: 'A direction for understanding requirements, responsibilities, and the partners involved in moving goods.' },
      { title: 'Clear handoffs', text: 'Information and practical next steps that follow the work between teams and organizations.' },
      { title: 'End-to-end thinking', text: 'A broader view of the processes around movement, from the initial requirement to the final handoff.' },
    ],
    journey: [
      { title: 'Scope', text: 'Understand the goods, requirements, and people involved.' },
      { title: 'Coordinate', text: 'Give every handoff a clear owner and a useful next step.' },
      { title: 'Connect', text: 'Bring the individual processes into a wider operational picture.' },
    ],
    connection: 'Logistics looks across the journey. TMS contributes transportation coordination, Fleet contributes resources, and Systems connects the information.',
  },
  'nrth-systems': {
    statement: 'Good infrastructure makes room for the work that matters.',
    audience: ['Businesses', 'Product teams', 'Operational teams'],
    capabilities: [
      { title: 'Purposeful software', text: 'Software shaped around a real workflow, with attention to the people using it every day.' },
      { title: 'Integration', text: 'A focus on how information, processes, and existing tools connect across a business.' },
      { title: 'Durable foundations', text: 'Maintainability, reliability, and clear ownership considered from the beginning.' },
    ],
    journey: [
      { title: 'Map', text: 'Understand the workflow, constraints, and existing systems.' },
      { title: 'Build', text: 'Design a clear foundation and test it against the real work.' },
      { title: 'Connect', text: 'Make the new foundation fit the broader environment.' },
    ],
    connection: 'Systems is a shared technical perspective across NRTH: connecting health information, operational work, and experiments in Labs.',
  },
  'nrth-labs': {
    statement: 'Some of the best ideas begin as questions without a category.',
    audience: ['Researchers', 'Builders', 'Potential collaborators'],
    capabilities: [
      { title: 'Focused research', text: 'Turn a broad idea into a question that can be investigated, discussed, and understood.' },
      { title: 'Working prototypes', text: 'Make an early approach tangible enough to test the assumptions behind it.' },
      { title: 'Cross-field experiments', text: 'Look for useful knowledge and approaches that can travel between NRTH projects.' },
    ],
    journey: [
      { title: 'Question', text: 'Find an uncertainty worth learning more about.' },
      { title: 'Experiment', text: 'Choose a small, useful way to test the idea.' },
      { title: 'Learn', text: 'Record what changed, what remains open, and where to go next.' },
    ],
    connection: 'Labs creates room between disciplines. It brings experiments to Systems, human questions to Health, and material possibilities to Chemicals.',
  },
  'nrth-chemicals': {
    statement: 'A material is a starting point. Its application opens the possibilities.',
    audience: ['Industrial businesses', 'Materials partners', 'Potential collaborators'],
    capabilities: [
      { title: 'Material applications', text: 'A direction for understanding the practical requirements behind chemicals and materials used in industry.' },
      { title: 'Sector partnerships', text: 'Conversations with organizations that understand the needs, constraints, and opportunities of the sector.' },
      { title: 'Technical clarity', text: 'Recognizing the importance of accurate specifications and appropriate safety documentation for any eventual offering.' },
    ],
    journey: [
      { title: 'Understand', text: 'Start with the application and its requirements.' },
      { title: 'Explore', text: 'Connect materials knowledge with potential partners.' },
      { title: 'Evaluate', text: 'Assess the practical fit and documentation needs.' },
    ],
    connection: 'Chemicals connects industrial questions with the research mindset of Labs and the coordination perspective of Logistics.',
  },
  'nrth-fleet': {
    statement: 'Vehicles are assets. The people and processes around them make a fleet.',
    audience: ['Fleet operators', 'Vehicle managers', 'Transportation businesses'],
    capabilities: [
      { title: 'Vehicle operations', text: 'A direction for understanding responsibilities, activity, and the resources available across a fleet.' },
      { title: 'Operational planning', text: 'Connect everyday fleet work with the decisions that shape capacity and longer-term needs.' },
      { title: 'Information continuity', text: 'Make the relationship between fleet information, transportation planning, and vehicle context clearer.' },
    ],
    journey: [
      { title: 'Understand', text: 'Build a coherent view of vehicles and responsibilities.' },
      { title: 'Plan', text: 'Connect resources with the work they need to support.' },
      { title: 'Coordinate', text: 'Keep the fleet perspective connected to daily operations.' },
    ],
    connection: 'Fleet focuses on vehicles and resources; Telematics adds connected information, and TMS connects that perspective with dispatch work.',
  },
  'nrth-events': {
    statement: 'The best connections happen when there is a reason to come together.',
    audience: ['Organizations', 'Communities', 'Experience partners'],
    capabilities: [
      { title: 'Experience direction', text: 'A clear purpose for the gathering and a thoughtful perspective on the people attending.' },
      { title: 'Collaborative planning', text: 'Bring partners, practical requirements, and the experience itself into a shared conversation.' },
      { title: 'Meaningful connections', text: 'Consider the details that help people meet, exchange ideas, and leave with something useful.' },
    ],
    journey: [
      { title: 'Define', text: 'Understand why people are gathering and what matters to them.' },
      { title: 'Design', text: 'Connect the experience with its practical requirements.' },
      { title: 'Bring together', text: 'Keep every detail aligned with the reason for the event.' },
    ],
    connection: 'Events brings people into the NRTH conversation. Labs contributes new ideas, and Systems offers a perspective on connected experiences.',
  },
};
