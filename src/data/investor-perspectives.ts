/** Public discussion prompts, not claims of product availability or commercial results. */
export interface InvestorPerspective {
  audience: string;
  question: string;
  dependency: string;
  examine: string;
}

export const investorPerspectives: Record<string, InvestorPerspective> = {
  'nrth-health': {
    audience: 'People navigating care, the teams coordinating it and organizations responsible for health information.',
    question: 'Where could clearer information or a better handoff remove avoidable effort from a care journey?',
    dependency: 'Appropriate access, privacy, accessible design and evidence suited to the intended use. Clinical applications require separate review.',
    examine: 'Define one user group and workflow. Ask what has been tested, what remains uncertain and what evidence a next step would require.'
  },
  'nrth-tms': {
    audience: 'Transportation planners, dispatch teams and organizations coordinating shipment requirements with available resources.',
    question: 'How could a transport plan remain useful as assignments, constraints and exceptions change?',
    dependency: 'Reliable shipment and resource information, explicit decision ownership and a clear connection between planning and dispatch.',
    examine: 'Review a representative planning decision, its constraints and the exception path. Confirm the current scope and any intended integrations.'
  },
  'nrth-telematics': {
    audience: 'Vehicle operators, fleet teams and people using activity signals to understand an operational situation.',
    question: 'Which vehicle signal, with which context, would help someone make a better operational decision?',
    dependency: 'Signal freshness, coverage, device compatibility, lawful information handling and an honest representation of uncertainty.',
    examine: 'Identify the decision before discussing the data feed. Ask about signal sources, gaps, access arrangements and the limits of an observation.'
  },
  'nrth-logistics': {
    audience: 'Organizations moving goods, coordination teams and partners responsible for successive steps in a delivery process.',
    question: 'What needs to become clearer when responsibility for moving goods passes between people or organizations?',
    dependency: 'Shared expectations, practical partner coordination and visible ownership of information, commitments and exceptions.',
    examine: 'Map one handoff and its failure cases. Establish who owns the next action, what information is missing and how a proposed change would be assessed.'
  },
  'nrth-systems': {
    audience: 'Teams whose work spans software tools, information flows and organizational boundaries.',
    question: 'Which boundary or workflow needs a clearer structure before adding another tool or integration?',
    dependency: 'Defined access and responsibilities, maintainable interfaces, observability and a realistic understanding of existing systems.',
    examine: 'Review a specific workflow, the systems it touches and the awkward cases. Ask who would maintain a change and how its usefulness would be evaluated.'
  },
  'nrth-labs': {
    audience: 'Researchers, technical collaborators and teams looking to investigate a focused uncertainty across disciplines.',
    question: 'What is the smallest experiment whose result could change the next decision?',
    dependency: 'A bounded research question, suitable methods, access to relevant expertise and a clear record of results and limitations.',
    examine: 'Ask for the hypothesis, method and current evidence. Agree on what would justify continuing, changing direction or stopping an experiment.'
  },
  'nrth-chemicals': {
    audience: 'Industrial users, material specialists and potential partners who understand a particular application.',
    question: 'Which material requirement is central to an industrial application, and what would demonstrate suitability?',
    dependency: 'Application expertise, appropriate material information, safety and regulatory review, and qualified partners where required.',
    examine: 'Specify the application and requirements first. Confirm the scope of any material work, the evidence available and the reviews needed before use.'
  },
  'nrth-fleet': {
    audience: 'Fleet managers, asset coordinators and teams responsible for vehicle readiness and operational capacity.',
    question: 'How could readiness, maintenance needs and assigned work inform the same resource decision?',
    dependency: 'Trustworthy asset records, clear responsibility for maintenance and a useful connection to operational planning.',
    examine: 'Trace one readiness decision from the underlying record to its operational consequence. Ask about data ownership, exceptions and current scope.'
  },
  'nrth-events': {
    audience: 'Organizers, collaborators and teams coordinating the people, information and timing behind an event.',
    question: 'What would make a shared event plan clearer as the experience moves from preparation to delivery?',
    dependency: 'Defined roles, practical coordination, accessible information and a plan that accounts for timing changes and participant needs.',
    examine: 'Choose an event context and one coordination problem. Review responsibilities, change handling and how the proposed approach would be assessed.'
  }
};

export const investorReadingQuestions = [
  {
    title: 'What is established today?',
    text: 'Confirm the current development stage and the scope behind it. Ask which work can be reviewed, when it was last assessed and what remains a direction rather than a demonstrated capability.',
    request: 'Current scope, supporting work and the date of review.'
  },
  {
    title: 'Whose problem is being examined?',
    text: 'Identify the intended user and the decision or workflow that matters to them. Discuss how the need has been investigated and distinguish an assumption from evidence of demand.',
    request: 'A defined audience, a concrete use case and evidence supporting the need.'
  },
  {
    title: 'What does progress depend on?',
    text: 'Discuss the information, expertise, partners and reviews a next step needs. Separate dependencies NRTH can control from those that require another party or a specific approval.',
    request: 'Dependencies, responsibilities and unresolved constraints.'
  },
  {
    title: 'What would change the next decision?',
    text: 'Ask what a focused milestone would establish and how its result would be evaluated. Include the conditions for revising the approach or setting an idea aside.',
    request: 'A bounded next step, evaluation criteria and decision ownership.'
  },
  {
    title: 'What needs a private discussion?',
    text: 'Company financial information, capital needs, ownership and any proposed investment terms require direct discussion and appropriate documentation. The public portfolio is an introduction to venture directions.',
    request: 'The relevant company information and terms, if an opportunity is being considered.'
  }
];
