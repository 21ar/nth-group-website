export type Scenario = { title: string; situation: string; steps: string[]; outcome: string };
export type ProjectContext = { scenarios: Scenario[]; discussion: string[]; question: string; answer: string };
export const projectContext: Record<string, ProjectContext> = {
  'nrth-health': {
    scenarios: [
      { title: 'Preparing for the next appointment', situation: 'An individual has questions, notes, and information spread across different places.', steps: ['Gather the relevant information and the questions that need an answer.', 'Organize the appointment context in language the person understands.', 'Keep the agreed next steps visible after the conversation.'], outcome: 'A clearer conversation and a more understandable follow-up.' },
      { title: 'Keeping a care handoff understandable', situation: 'A care team needs to understand what has changed and who needs to take the next step.', steps: ['Identify the information necessary for this particular handoff.', 'Clarify responsibility, access, and the person’s preferences.', 'Present the next action alongside the context that supports it.'], outcome: 'A design direction for continuity that keeps the person at the center.' },
    ], discussion: ['The people and care setting involved', 'The information that needs to be organized', 'Consent, privacy, and access requirements', 'Existing tools and the boundaries of the proposed workflow'],
    question: 'Does NRTH Health replace professional care?', answer: 'The direction described here concerns information and coordination. It does not establish a clinical service, provide medical advice, or replace qualified professional care. Any specific health offering needs its own scope and appropriate review.',
  },
  'nrth-tms': {
    scenarios: [
      { title: 'From request to dispatch', situation: 'A dispatch team receives a transportation request with several requirements to coordinate.', steps: ['Capture the load, pickup, delivery, and operational constraints.', 'Review the people and vehicle resources that could support the work.', 'Keep the assignment, changes, and handoff information together.'], outcome: 'A coherent path from transportation request to assigned work.' },
      { title: 'Responding to a change in the plan', situation: 'A delay or updated requirement affects a shipment already being coordinated.', steps: ['Bring the change into the same context as the original plan.', 'Identify which assignments and parties are affected.', 'Record the updated next step and communicate the handoff.'], outcome: 'A clearer exception workflow for the people making dispatch decisions.' },
    ], discussion: ['How loads enter the operation today', 'Dispatch roles and assignment rules', 'Status, document, and communication needs', 'Existing transportation tools and possible integrations'],
    question: 'How does TMS differ from Fleet and Telematics?', answer: 'TMS focuses on transportation work and dispatch coordination. Fleet considers vehicles and resource planning. Telematics considers available vehicle signals and their context. A potential connection between them must be scoped around the actual tools and data available.',
  },
  'nrth-telematics': {
    scenarios: [
      { title: 'Understanding a vehicle signal', situation: 'A team has a location or activity update but needs to know why it matters.', steps: ['Check the source, timestamp, and limitations of the signal.', 'Relate the signal to a vehicle, assignment, or operational question.', 'Present relevant context to the team that can make a decision.'], outcome: 'Useful operational context rather than another disconnected data point.' },
      { title: 'Connecting information to dispatch', situation: 'A transportation team wants vehicle context to inform an active plan.', steps: ['Define which information would change a dispatch decision.', 'Agree on source access, freshness, and exception handling.', 'Explore how the context could appear in the existing workflow.'], outcome: 'A scoped connection between vehicle information and transportation planning.' },
    ], discussion: ['Vehicle types and existing hardware', 'Data providers and permitted access', 'Signal freshness and operational questions', 'Privacy, retention, and integration requirements'],
    question: 'Which hardware or data providers are supported?', answer: 'Compatibility has not been published. Share the hardware, provider, and access method you use so NRTH can discuss the practical fit. This site does not promise a particular integration, update interval, or tracking capability.',
  },
  'nrth-logistics': {
    scenarios: [
      { title: 'Making a partner handoff clear', situation: 'Goods move between organizations with different processes and information needs.', steps: ['Map the requirements and the parties responsible at each stage.', 'Identify documents and decisions that must travel with the work.', 'Define what confirms a handoff and what happens when it changes.'], outcome: 'A shared understanding of responsibilities across the wider journey.' },
      { title: 'Mapping a fragmented process', situation: 'An operations team coordinates movement through messages, files, and separate systems.', steps: ['Follow a representative movement from request to completion.', 'Find repeated entry, unclear ownership, and missing information.', 'Prioritize a useful connection before expanding the scope.'], outcome: 'A practical starting point for improving coordination between processes.' },
    ], discussion: ['Goods, routes, and operational boundaries', 'Partners and handoff responsibilities', 'Documentation and exception workflows', 'Existing systems and the information gaps between them'],
    question: 'Does NRTH Logistics currently arrange shipments?', answer: 'This page describes a venture direction, not a confirmed transportation service or carrier offering. Contact NRTH with the movement you need to discuss to establish current scope, availability, and the appropriate parties.',
  },
  'nrth-systems': {
    scenarios: [
      { title: 'Connecting an operational workflow', situation: 'A team repeats the same information across several tools to finish one piece of work.', steps: ['Map the existing workflow and identify the system of record.', 'Choose the connection with the clearest practical value.', 'Define access, failure handling, and ownership before building.'], outcome: 'A focused integration proposal grounded in the team’s actual work.' },
      { title: 'Turning a workflow into a product', situation: 'An organization has a clear problem but needs to establish what software should do.', steps: ['Define users, important decisions, and the smallest useful scope.', 'Prototype the key interactions and test the assumptions.', 'Plan implementation, support, and maintenance as one conversation.'], outcome: 'A product direction with understandable boundaries and next steps.' },
    ], discussion: ['Users and the workflow to improve', 'Existing systems and technical constraints', 'Access, reliability, and ownership expectations', 'Success criteria and a useful first scope'],
    question: 'Can Systems work with our existing tools?', answer: 'Existing tools are part of the discovery conversation. The right approach depends on their interfaces, permissions, data quality, and the workflow involved. Specific compatibility and delivery commitments should be agreed after that review.',
  },
  'nrth-labs': {
    scenarios: [
      { title: 'Testing a product assumption', situation: 'An idea sounds promising, but a critical user or technical assumption remains open.', steps: ['Write the uncertainty as a question that can be investigated.', 'Choose a small prototype, conversation, or technical test.', 'Record the evidence and decide whether to continue, change, or stop.'], outcome: 'A better-informed decision before committing to a wider build.' },
      { title: 'Exploring a cross-field connection', situation: 'An approach from one discipline may help solve a problem in another.', steps: ['Identify what transfers and what is specific to the original field.', 'Invite the relevant operational or technical perspective.', 'Test a narrow application and document its limitations.'], outcome: 'An experiment with a clear question and a useful record of learning.' },
    ], discussion: ['The question and what is already known', 'The assumption worth testing first', 'Available expertise, data, and constraints', 'How learning will guide the next decision'],
    question: 'Are Labs experiments available as products?', answer: 'Research and prototypes are distinct from released products. An experiment may result in a new direction, a narrower question, or a decision not to continue. Contact NRTH for the status and scope of any particular exploration.',
  },
  'nrth-chemicals': {
    scenarios: [
      { title: 'Starting with the application', situation: 'An industrial organization wants to explore a material requirement with potential partners.', steps: ['Define the intended application and operating conditions.', 'Identify the specifications and documentation needed for evaluation.', 'Discuss the relevant expertise and boundaries of a potential collaboration.'], outcome: 'A better-defined materials conversation before considering an offering.' },
      { title: 'Connecting technical and operational questions', situation: 'A material discussion involves both application requirements and practical handling needs.', steps: ['Separate technical criteria from sourcing and movement questions.', 'Identify who can validate each requirement and its documentation.', 'Explore how the research and logistics perspectives could support evaluation.'], outcome: 'Clearer responsibilities around a potential industrial collaboration.' },
    ], discussion: ['Intended application and specifications', 'Operating conditions and evaluation criteria', 'Relevant technical and safety documentation', 'Partner roles and the boundaries of the discussion'],
    question: 'Is there a product catalog or safety documentation?', answer: 'No chemical catalog or product-specific safety documentation is published here. Any eventual offering must have its own accurate specifications and appropriate documentation. Contact NRTH about your application rather than treating this overview as product guidance.',
  },
  'nrth-fleet': {
    scenarios: [
      { title: 'Understanding available resources', situation: 'A fleet team needs a consistent view of vehicles, responsibilities, and planned work.', steps: ['Establish the vehicle information and ownership that matter.', 'Clarify availability and the constraints around each resource.', 'Connect that view to planning and dispatch conversations.'], outcome: 'A clearer fleet perspective on the resources supporting the operation.' },
      { title: 'Keeping fleet information connected', situation: 'Vehicle updates are recorded separately from the teams planning transportation work.', steps: ['Identify the changes that affect operational decisions.', 'Agree on the source and responsibility for keeping information current.', 'Explore a connection to the relevant planning workflow.'], outcome: 'A scoped direction for continuity between fleet records and daily work.' },
    ], discussion: ['Fleet composition and vehicle responsibilities', 'Planning, availability, and recordkeeping practices', 'Existing fleet and telematics tools', 'The decisions that need more reliable context'],
    question: 'Does Fleet include vehicles or financing?', answer: 'Vehicle sales, leasing, financing, and maintenance services are not confirmed by this page. The direction described here concerns fleet information and operational coordination. Discuss your specific requirement with NRTH to establish the current scope.',
  },
  'nrth-events': {
    scenarios: [
      { title: 'Designing a purposeful gathering', situation: 'An organization wants to bring people together around an idea, community, or shared question.', steps: ['Define the audience and the reason for the gathering.', 'Shape the experience around participation and useful connections.', 'Map practical requirements, partner roles, and the next decisions.'], outcome: 'An experience direction aligned with the people attending.' },
      { title: 'Connecting an event with what follows', situation: 'A gathering should create useful conversations that continue after the day itself.', steps: ['Identify the kinds of connections the experience should encourage.', 'Consider how participants can exchange ideas and find the next step.', 'Discuss accessible communication and appropriate handling of attendee information.'], outcome: 'A considered journey before, during, and after the experience.' },
    ], discussion: ['Purpose, audience, and intended experience', 'Location, format, and timing considerations', 'Partner roles and practical requirements', 'Accessibility and participant communication needs'],
    question: 'Can we book an event or buy tickets here?', answer: 'No event calendar, booking service, or ticket sale is currently published on this site. Use the project inquiry to discuss a proposed gathering, partnership, or experience and establish what is available.',
  },
};
