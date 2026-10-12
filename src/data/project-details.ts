export type ProjectDetails = {
  statement: string;
  audience: string[];
  capabilities: { title: string; text: string }[];
  journey: { title: string; text: string }[];
  connection: string;
};

/** Venture directions. Specific delivery scope is established with NRTH. */
export const projectDetails: Record<string, ProjectDetails> = {
  'nrth-health': {
    statement: 'Care deserves less friction.',
    audience: ['People navigating care', 'Care coordinators and administrative teams', 'Health organizations and software partners'],
    capabilities: [
      { title: 'Information people can use', text: 'Explore appointment preparation, practical next steps and understandable explanations around the questions a person brings. The useful unit is a clear answer with a source and an owner, rather than another page of disconnected information.' },
      { title: 'Workflows that respect attention', text: 'Trace requests between reception, coordination and the receiving team. Examine what needs acknowledgment, where someone must repeat themselves and how an unresolved administrative question can stay visible until it reaches the right person.' },
      { title: 'Trust from the outset', text: 'Design around appropriate access, understandable permissions, accessible interaction and the minimum information needed for a task. Separate a communication or workflow study from clinical use, which requires its own evidence and review.' },
    ],
    journey: [
      { title: 'Begin with a person’s question', text: 'Describe the setting, the immediate task and the information someone needs to understand before taking a practical next step.' },
      { title: 'Follow the question across the handoff', text: 'Map the source of the answer, the responsible team and the access conditions that apply as a request changes hands.' },
      { title: 'Test understanding, then define the scope', text: 'Use a focused interface or coordination study to examine clarity and accessibility before deciding what a supported implementation would require.' },
    ],
    connection: 'NRTH Systems brings an information-boundary perspective; NRTH Labs brings ways to examine comprehension, navigation and the assumptions behind an experience.',
  },
  'nrth-tms': {
    statement: 'Make every move count.',
    audience: ['Transportation planners and dispatch teams', 'Shippers coordinating recurring movements', 'Operations and integration partners'],
    capabilities: [
      { title: 'Plan around the job', text: 'Explore how pickup and delivery commitments, equipment needs, resource availability and the next assignment belong in one planning conversation. Make the conditions behind a proposed movement explicit before treating it as a committed plan.' },
      { title: 'Keep decisions connected', text: 'Follow the job from the planning request through assignment and dispatch. Study how a revision reaches the responsible people, what needs acknowledgment and which later commitments depend on the original arrangement.' },
      { title: 'Know what needs attention', text: 'Distinguish a changed plan from a missing confirmation, an unresolved requirement or an observation that needs verification. A useful exception explains the affected job, the owner and the decision waiting to be made.' },
    ],
    journey: [
      { title: 'Capture the movement requirement', text: 'Identify the shipment, the agreed windows, the resources it needs and the people who can confirm those requirements.' },
      { title: 'Expose the planning dependencies', text: 'Compare the proposed assignment with loading, receiving and resource commitments; make unresolved assumptions visible.' },
      { title: 'Agree how change travels', text: 'Define who approves a revision, who receives it and what acknowledgment closes the planning loop.' },
    ],
    connection: 'TMS connects job planning with NRTH Fleet’s resource perspective, NRTH Telematics’ observations and NRTH Logistics’ partner handoffs.',
  },
  'nrth-telematics': {
    statement: 'Signals that tell a bigger story.',
    audience: ['Operations teams interpreting vehicle activity', 'Fleet coordinators and dispatch teams', 'Device, data and integration partners'],
    capabilities: [
      { title: 'Understand the signal', text: 'Look at an observation’s timestamp, source and coverage before deciding what it describes. Explore how freshness, missing intervals and uncertainty can remain visible instead of being hidden behind a precise-looking point.' },
      { title: 'Read activity in context', text: 'Connect vehicle activity to the assigned work, expected stops and the question an operations team needs answered. The same observation can mean different things at a loading point, during a planned pause or near a receiving commitment.' },
      { title: 'Connect with purpose', text: 'Begin with a decision that needs better evidence. Determine which observations help, which add noise and when a responsible person must confirm the situation before an operational response is agreed.' },
    ],
    journey: [
      { title: 'Name the operational question', text: 'Identify the job, the person asking and the decision a vehicle observation is meant to support.' },
      { title: 'Read quality alongside activity', text: 'Examine source, observation time and gaps together with the vehicle’s work context and expected next handoff.' },
      { title: 'Design the response around an owner', text: 'Define who verifies an unexpected observation, what may be concluded and how the confirmed information returns to the plan.' },
    ],
    connection: 'NRTH TMS supplies the planning question, NRTH Fleet the asset context, and NRTH Systems a perspective on how observations cross information boundaries.',
  },
  'nrth-logistics': {
    statement: 'Get the handoffs right.',
    audience: ['Shippers and receiving teams', 'Logistics coordinators and partner organizations', 'Teams responsible for documents and exceptions'],
    capabilities: [
      { title: 'Map the dependencies', text: 'Follow the sequence from an initial request to the final receiving arrangement. Identify the documents, timings, partner commitments and decisions that make each transition possible, including the work that happens outside a transportation plan.' },
      { title: 'Make responsibility visible', text: 'Explore how each handoff carries the necessary context and a clear next owner. Separate “sent,” “received” and “accepted” so that a message being delivered does not silently stand in for an agreed commitment.' },
      { title: 'Learn from the exceptions', text: 'Examine a document gap, changed receiving arrangement or disputed handoff as a connected process. Trace the effect on later commitments and record what the responsible teams needed to resolve it.' },
    ],
    journey: [
      { title: 'Trace one movement end to end', text: 'Name the parties, places and commitments involved, including the information required at each change of responsibility.' },
      { title: 'Describe what acceptance means', text: 'Agree which acknowledgment or evidence tells each partner that a handoff has reached its intended state.' },
      { title: 'Give exceptions a path', text: 'Define the owner, the affected downstream work and the confirmation that closes a revised arrangement.' },
    ],
    connection: 'NRTH TMS examines the transportation plan, NRTH Fleet the resources behind it, and NRTH Systems the information exchange between partners.',
  },
  'nrth-systems': {
    statement: 'Give complexity a useful structure.',
    audience: ['Teams connecting existing software', 'Operators and administrators managing shared work', 'Technical owners and delivery partners'],
    capabilities: [
      { title: 'Define the boundaries', text: 'Explore which team owns a record, who may change it and what another system is allowed to rely on. Keep responsibilities, permissions and the meaning of exchanged information explicit before joining tools together.' },
      { title: 'Design for the real workflow', text: 'Study the task people perform across screens and organizational boundaries. Include duplicate requests, conflicting edits, missing acknowledgments and the practical recovery steps that make an interface useful beyond its ideal path.' },
      { title: 'Build for the next change', text: 'Consider how maintainers can understand a system’s rules, observe a failed exchange and change a workflow without losing its purpose. A useful foundation leaves a clear record of decisions and a manageable path for evolution.' },
    ],
    journey: [
      { title: 'Identify the system of record', text: 'Map the people, tools and information involved, then establish which owner is authoritative for each decision.' },
      { title: 'Specify the exchange and its failure', text: 'Describe the input, expected acknowledgment, access conditions and recovery behavior at a useful boundary.' },
      { title: 'Make operation part of the design', text: 'Agree how owners observe, investigate and revise the workflow after the first implementation.' },
    ],
    connection: 'Systems can support questions from across NRTH, with Health informing careful access, Telematics exposing changing data and Labs examining unfamiliar interactions.',
  },
  'nrth-labs': {
    statement: 'Follow the question further.',
    audience: ['Researchers and builders', 'Organizations examining an unfamiliar direction', 'Partners with a specific question to investigate'],
    capabilities: [
      { title: 'Ask something specific', text: 'Turn a broad possibility into a question that influences a real decision. Identify the assumption, what is already known and the observation that would make a follow-up discussion better informed.' },
      { title: 'Make a small experiment', text: 'Explore an interface prototype, a technical study or a structured evidence review with a defined scope. Select the simplest study that can reveal the uncertainty rather than making a complete product before the question is understood.' },
      { title: 'Keep what is learned', text: 'Record the setup, the observation and its limits separately from the interpretation. Preserve an inconclusive or unexpected result when it explains why a direction should be revised, studied further or put aside.' },
    ],
    journey: [
      { title: 'Write the decision and its uncertainty', text: 'State what the collaborators need to decide and which missing evidence prevents a useful choice.' },
      { title: 'Choose the narrowest useful study', text: 'Define the inputs, observation and stopping conditions, with the expertise and permissions the work needs.' },
      { title: 'Turn the result into the next question', text: 'Compare what was observed with the starting assumption and document the reason to continue, change course or stop.' },
    ],
    connection: 'Labs creates a place for questions to cross between NRTH Systems, Health and Chemicals without assuming that every study should become a product.',
  },
  'nrth-chemicals': {
    statement: 'Start at the material level.',
    audience: ['Industrial teams describing an application', 'Technical specialists reviewing material evidence', 'Prospective suppliers and application partners'],
    capabilities: [
      { title: 'Begin with the application', text: 'Explore the intended use, operating environment and constraints that give a material question meaning. Keep the application brief specific enough for qualified specialists to identify which properties and evidence deserve attention.' },
      { title: 'Ask for the right evidence', text: 'Organize specifications, provenance, document versions and the questions they support. Distinguish a supplier statement from a verified assessment, and identify gaps before treating a material direction as established.' },
      { title: 'Connect expertise', text: 'Frame a conversation between application owners, material specialists and potential partners. Any later suitability review, handling arrangement or commercial offering needs the relevant expertise, documentation and agreed responsibilities.' },
    ],
    journey: [
      { title: 'Describe the use before the material', text: 'Capture the application, its environment and the technical questions the responsible team needs to resolve.' },
      { title: 'Build an evidence picture', text: 'Identify requested properties, source documents and unresolved gaps, keeping versions and provenance attached.' },
      { title: 'Define the specialist review', text: 'Agree who can assess the application, what evidence is needed and which questions must be resolved before further commitments.' },
    ],
    connection: 'NRTH Labs offers a perspective on focused evidence questions, while NRTH Logistics considers the information and responsibilities around later material handoffs.',
  },
  'nrth-fleet': {
    statement: 'Keep the whole operation in view.',
    audience: ['Fleet and asset managers', 'Maintenance coordinators and operational teams', 'Partners planning resource use across an operation'],
    capabilities: [
      { title: 'Readiness before assignment', text: 'Explore what a planner needs to know about a vehicle beyond its calendar availability. Bring together job requirements, existing reservations, recorded status and the responsible person who can confirm suitability for the intended work.' },
      { title: 'Ownership through the day', text: 'Follow the asset across shifts, assignments and maintenance responsibilities. Investigate how a change is recorded, who accepts the next responsibility and which teams need a shared understanding of the current state.' },
      { title: 'Plan beyond the next job', text: 'Connect everyday assignments with maintenance windows and future demand. Examine the dependencies behind a capacity discussion without turning unconfirmed availability into a promise of operating readiness.' },
    ],
    journey: [
      { title: 'Put the asset beside the work', text: 'Identify the vehicle, its commitments, the information available and the owner responsible for confirming its status.' },
      { title: 'Make competing commitments visible', text: 'Compare planned use with maintenance, handover and other constraints that affect the same resource.' },
      { title: 'Agree the confirmation loop', text: 'Define how an updated status reaches planners and who acknowledges the revised assignment or maintenance arrangement.' },
    ],
    connection: 'Fleet brings the resource perspective to NRTH TMS planning, NRTH Telematics observations and NRTH Logistics’ chain of commitments.',
  },
  'nrth-events': {
    statement: 'Make a moment matter.',
    audience: ['Organizations shaping a gathering', 'Communities and prospective collaborators', 'Programming, venue and production partners'],
    capabilities: [
      { title: 'Give the gathering a purpose', text: 'Explore who is attending and the exchange that makes their time together worthwhile. A purpose can guide introductions, demonstrations, conversations and the material people take away after the gathering.' },
      { title: 'Design the rhythm', text: 'Consider arrival, orientation, shared moments, informal space and transitions as one participant journey. Explore how the experience changes for people with different familiarity, access needs or ways of taking part.' },
      { title: 'Connect the practical work', text: 'Bring programming, partner responsibilities and production decisions back to the participant experience. Make dependencies visible so a change in timing, venue or format reaches the people who need to reshape the plan.' },
    ],
    journey: [
      { title: 'Define who the experience serves', text: 'Describe the audience, the intended exchange and what participants should carry away from their time together.' },
      { title: 'Shape the journey through the gathering', text: 'Map arrival, participation, transitions and departure around that purpose and the relevant access needs.' },
      { title: 'Connect the production responsibilities', text: 'Agree who owns the practical decisions and how a change reaches programming, partners and participants.' },
    ],
    connection: 'NRTH Labs can provide a question worth gathering around, while NRTH Systems brings a perspective on the information and coordination supporting the experience.',
  },
};
