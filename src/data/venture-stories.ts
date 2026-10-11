export type VentureStory = {
  audience: string;
  workflow: { title: string; text: string }[];
  scenario: {
    title: string;
    introduction: string;
    options: { label: string; context: string; task: string; decision: string }[];
  };
  questions: { question: string; answer: string }[];
};

/** Editorial examples of venture directions, rather than claims of available products. */
export const ventureStories: Record<string, VentureStory> = {
  'nrth-health': {
    audience: 'People navigating care, care coordinators and administrative teams working across appointments, records and organizational boundaries.',
    workflow: [
      { title: 'Understand the next step.', text: 'Examine what someone needs to know before an appointment, who owns the request and where the information comes from.' },
      { title: 'Keep the context together.', text: 'Explore how appointment details, preparation information and outstanding administrative questions could remain connected.' },
      { title: 'Close the handoff.', text: 'Identify what the receiving team needs to acknowledge and how a person would know whether anything remains unresolved.' },
    ],
    scenario: {
      title: 'Care begins before the appointment.',
      introduction: 'A team is preparing an administrative handoff for a follow-up appointment. Change what is ready.',
      options: [
        { label: 'Information is complete', context: 'The receiving team confirms that the requested administrative information is present.', task: 'Organize the appointment details and source references around the next handoff.', decision: 'Who communicates the next administrative step to the person attending?' },
        { label: 'A document is missing', context: 'One administrative document requested by the receiving team has not arrived.', task: 'Make the outstanding request visible without treating an incomplete record as complete.', decision: 'Which team is responsible, and what is the permitted channel for obtaining the document?' },
        { label: 'The appointment changes', context: 'A new appointment time affects information that has already been issued.', task: 'Keep the rescheduled appointment connected to the original request and the information that depends on it.', decision: 'Which details need confirmation, and who will notify the person attending?' },
      ],
    },
    questions: [
      { question: 'Is NRTH Health a clinical service?', answer: 'This page presents an information and workflow direction. It does not establish a clinical service or provide medical advice. Clinical use would require its own evidence and appropriate review.' },
      { question: 'What could an early investigation focus on?', answer: 'A bounded administrative journey, such as understanding an appointment request or handing information between teams, could reveal where effort and uncertainty accumulate.' },
      { question: 'How does this connect with NRTH Systems?', answer: 'Health workflows raise questions about access, responsibility and information exchange. NRTH Systems provides a related direction for examining those foundations.' },
    ],
  },
  'nrth-tms': {
    audience: 'Dispatchers, transportation planners and operators balancing shipment requirements with the resources available to move them.',
    workflow: [
      { title: 'Understand the commitment.', text: 'Start with the pickup window, delivery requirements, equipment needs and the information still missing from the shipment.' },
      { title: 'Shape a workable plan.', text: 'Compare the job with available resources and make the tradeoffs visible before an assignment reaches dispatch.' },
      { title: 'Keep the plan answerable.', text: 'Bring a change back to the person who can act on it, with the original commitment still in view.' },
    ],
    scenario: {
      title: 'One shipment. A changing plan.',
      introduction: 'A planner is preparing a shipment for dispatch. Change the constraint to see how the next question changes.',
      options: [
        { label: 'Ready to assign', context: 'The pickup window and equipment requirement are confirmed. Two possible resources remain under consideration.', task: 'Put the shipment requirements beside each resource’s availability and existing commitments.', decision: 'Which assignment fits the whole plan, and who needs to confirm it before dispatch?' },
        { label: 'The window moves', context: 'The shipper changes the pickup window after an assignment has been discussed.', task: 'Identify the affected resource, delivery commitment and people who still have the earlier plan.', decision: 'Can the assignment still work, or does the planner need to agree a new commitment?' },
        { label: 'Equipment is unclear', context: 'A shipment is ready to plan, but its equipment requirement has not been confirmed.', task: 'Keep that unanswered requirement attached to the job instead of silently assuming a fit.', decision: 'Who can verify the requirement, and which planning decisions should wait for their answer?' },
      ],
    },
    questions: [
      { question: 'How is TMS different from Logistics or Fleet?', answer: 'TMS starts with planning and dispatch decisions for transportation work. Logistics looks at the wider chain of handoffs. Fleet focuses on the vehicles and assets that make the plan possible. These are connected directions within NRTH.' },
      { question: 'Would it connect to our existing operation?', answer: 'An integration discussion would begin with your current planning process, the information you exchange and the systems of record. Specific integrations, data formats and delivery scope would need to be agreed directly.' },
      { question: 'What should a first conversation include?', answer: 'Bring an example shipment, a typical change to the plan and the roles involved in resolving it. That gives us a concrete starting point without requiring a complete systems specification.' },
    ],
  },
  'nrth-telematics': {
    audience: 'Operations teams, fleet coordinators and system builders who need to understand what a vehicle signal actually tells them.',
    workflow: [
      { title: 'Know the observation.', text: 'Read the time, source and quality of a signal before treating it as a description of the present.' },
      { title: 'Connect the context.', text: 'Place the observation beside the vehicle’s assigned work and the question someone is trying to answer.' },
      { title: 'Choose the useful response.', text: 'Separate an actionable change from uncertainty that needs another observation or a human confirmation.' },
    ],
    scenario: {
      title: 'A point is only the beginning.',
      introduction: 'An operations team is checking a vehicle’s progress. Choose what is known about the observation.',
      options: [
        { label: 'A recent observation', context: 'A recent position is available and the vehicle has an assigned job.', task: 'Read the position together with the job’s next handoff and the observation’s timestamp.', decision: 'Does this answer the operational question, or is confirmation from the responsible person still needed?' },
        { label: 'An older signal', context: 'The latest recorded position is older than the team expects. It may no longer describe the vehicle’s location.', task: 'Make the age of the observation visible and avoid presenting a stale point as a live position.', decision: 'Should the team request a fresh observation or contact the person responsible for the job?' },
        { label: 'No job context', context: 'A vehicle position is available, but the team cannot connect it to an agreed assignment.', task: 'Find the missing relationship between the vehicle, the work and the owner of the next handoff.', decision: 'Who can establish the job context before the position is used to make an operational decision?' },
      ],
    },
    questions: [
      { question: 'Does this page describe live vehicle tracking?', answer: 'It describes an area of exploration. The examples on this page are illustrative and contain no live vehicle data. Device support, update frequency and any deployed tracking capabilities would be established directly with NRTH.' },
      { question: 'Which devices or data sources are supported?', answer: 'Support is not implied by this overview. A useful discussion starts with the devices or providers you use, the observations they expose and the operational decision those observations need to support.' },
      { question: 'How would access and privacy be considered?', answer: 'The scope would need to identify who is allowed to see which observations, why the data is collected, how long it is retained and how access is reviewed. Those requirements belong in the design from the outset.' },
    ],
  },
  'nrth-logistics': {
    audience: 'Shippers, coordinators and partner teams responsible for goods that pass through several people, places and commitments.',
    workflow: [
      { title: 'Map the journey.', text: 'Make the sequence of commitments explicit, including who is expecting goods and what each handoff requires.' },
      { title: 'Join the handoffs.', text: 'Keep the necessary information with the work as responsibility moves between teams and partners.' },
      { title: 'Resolve the exception.', text: 'Bring a missed assumption to its owner while making the consequences for the next commitment clear.' },
    ],
    scenario: {
      title: 'The space between two teams.',
      introduction: 'Goods are approaching their next handoff. Change what the receiving team knows.',
      options: [
        { label: 'Ready to receive', context: 'The receiving team has the agreed arrival window and the information required for the handoff.', task: 'Confirm the next owner and the evidence each side needs to consider the handoff complete.', decision: 'Who confirms receipt, and how does that confirmation reach the team responsible for the next step?' },
        { label: 'A document is missing', context: 'The goods are ready to move, but information requested by the receiving partner is incomplete.', task: 'Identify the missing document, the person able to provide it and the downstream work that depends on it.', decision: 'Can the handoff proceed under an agreed exception, or does it need to wait for the missing information?' },
        { label: 'The recipient changes', context: 'The receiving location or contact changes after the original arrangement has been shared.', task: 'Trace which teams and commitments still depend on the original recipient.', decision: 'Who must accept the revised handoff, and which related arrangements need to be reconfirmed?' },
      ],
    },
    questions: [
      { question: 'Is NRTH a freight carrier or brokerage?', answer: 'This page presents the NRTH Logistics venture direction. It does not establish carrier capacity, brokerage authority, service coverage or commercial availability. Any operating or service arrangement would be confirmed directly with NRTH.' },
      { question: 'Where does a logistics discussion begin?', answer: 'With one real handoff: what is moving, which parties are involved, what each party needs to know and where the current process loses clarity. A smaller concrete example is more useful than a broad request to connect everything.' },
      { question: 'Can this direction cover several partners?', answer: 'Multi-party coordination is part of the question being explored. A defined scope would need to establish responsibilities, information access and the commitments each partner is prepared to make.' },
    ],
  },
  'nrth-systems': {
    audience: 'Teams building software, connecting existing tools or replacing processes whose rules have become difficult to explain.',
    workflow: [
      { title: 'Name the boundary.', text: 'Establish which people and systems own the information, the rules and the decisions involved in the work.' },
      { title: 'Make the exchange explicit.', text: 'Describe what crosses the boundary, what a successful handoff means and what happens when it fails.' },
      { title: 'Leave room for change.', text: 'Keep the system understandable for the people who will maintain it, operate it and decide what comes next.' },
    ],
    scenario: {
      title: 'Two tools. One piece of work.',
      introduction: 'A team wants information to move between two tools. Choose the complication that matters most.',
      options: [
        { label: 'A clear exchange', context: 'Both tools have an agreed owner, and the information needed by the receiving workflow is understood.', task: 'Define the source of truth, the shape of the exchange and the confirmation of a successful handoff.', decision: 'What should the receiving team see, and how will it know the information is ready to use?' },
        { label: 'Competing records', context: 'Both tools contain a version of the same record, and the values sometimes disagree.', task: 'Identify who owns each field and how the team currently resolves conflicting changes.', decision: 'Which record is authoritative for this decision, and who is responsible when that authority is unclear?' },
        { label: 'A failed handoff', context: 'The receiving tool does not acknowledge an exchange that the sending tool considers complete.', task: 'Make the failure visible, preserve the original request and identify the person able to investigate it.', decision: 'What can safely be retried, and what needs a person to confirm the state of the work first?' },
      ],
    },
    questions: [
      { question: 'Is Systems a product or a delivery service?', answer: 'NRTH Systems is a venture direction around software foundations, interfaces and information flows. The appropriate form of an engagement, product or service depends on a defined context and is agreed directly with NRTH.' },
      { question: 'Would we need to replace everything?', answer: 'That is a scoping question rather than an assumption. Understanding the current system, its useful parts and its difficult boundaries helps determine whether a focused change is sufficient.' },
      { question: 'What is useful to bring to a technical discussion?', answer: 'A diagram of the current workflow, the tools involved, an example of a difficult case and any known access or data constraints. Avoid sending credentials or sensitive production data through the general inquiry form.' },
    ],
  },
  'nrth-fleet': {
    audience: 'Fleet managers, maintenance coordinators and operators responsible for the relationship between asset readiness and planned work.',
    workflow: [
      { title: 'See the asset in context.', text: 'Bring together the vehicle’s assigned work, the status information available and the person responsible for its readiness.' },
      { title: 'Understand the constraint.', text: 'Make a maintenance, availability or information gap visible before it becomes an assumption inside the plan.' },
      { title: 'Coordinate the next step.', text: 'Connect the people making operational and maintenance decisions around the same asset.' },
    ],
    scenario: {
      title: 'Readiness is a shared decision.',
      introduction: 'A vehicle is being considered for an assignment. Choose the question its readiness raises.',
      options: [
        { label: 'Available for planning', context: 'The vehicle’s recorded availability matches the planning window, and its responsible owner is identified.', task: 'Read that availability beside the job requirements and any existing reservations.', decision: 'Who confirms the vehicle is suitable for the assignment before the plan is committed?' },
        { label: 'Maintenance overlaps', context: 'A proposed assignment overlaps a planned maintenance window.', task: 'Make the competing commitments visible to both the operations and maintenance owners.', decision: 'Which assignment or maintenance arrangement needs to be revised by the responsible team?' },
        { label: 'Status is unconfirmed', context: 'The plan depends on a vehicle whose latest readiness status has not been confirmed.', task: 'Keep the uncertainty attached to the asset and identify the person able to verify its status.', decision: 'What confirmation is needed before the vehicle can be included in a committed plan?' },
      ],
    },
    questions: [
      { question: 'Does this provide maintenance or safety clearance?', answer: 'No. These examples illustrate coordination questions. Readiness, maintenance and safe operation require the appropriate responsible people, procedures and evidence. This website does not assess or certify a vehicle.' },
      { question: 'How does Fleet relate to Telematics?', answer: 'Fleet starts with the asset and the work planned around it. Telematics starts with observations from vehicles and the context that makes those observations useful. A defined workflow may connect both directions.' },
      { question: 'What fleet information would be needed?', answer: 'A discussion would start with the assets in scope, your current source of readiness information and how assignments and maintenance commitments are agreed. Specific integrations and data requirements follow from that workflow.' },
    ],
  },
  'nrth-labs': {
    audience: 'Researchers, builders and prospective collaborators with a question that can be investigated through a focused study or prototype.',
    workflow: [
      { title: 'Locate the uncertainty.', text: 'State the assumption, the decision it influences and the observation that would make that decision better informed.' },
      { title: 'Bound the experiment.', text: 'Choose a small study with explicit inputs, a defined observation and clear limits on what it can establish.' },
      { title: 'Make the result reusable.', text: 'Record what happened, what remains uncertain and the reasons to continue, revise or stop the investigation.' },
    ],
    scenario: {
      title: 'A sharper question changes the work.',
      introduction: 'A team is investigating whether an interface helps people understand a handoff. Change what the study reveals.',
      options: [
        { label: 'The question is clear', context: 'The team agrees on one uncertainty and one observable task.', task: 'Define the handoff and the misunderstanding the study will examine.', decision: 'What is the smallest prototype that can expose that uncertainty?' },
        { label: 'The observation is mixed', context: 'Participants interpret the prototype in different ways.', task: 'Separate the observed behavior from possible explanations and the assumptions behind them.', decision: 'Which assumption deserves a narrower follow-up study?' },
        { label: 'The idea changes', context: 'An early observation suggests the proposed interface addresses the wrong point in the workflow.', task: 'Preserve the original question and document the reason for revising it.', decision: 'Should the team change the experiment, redefine the question or set the idea aside?' },
      ],
    },
    questions: [
      { question: 'Are the website’s visual studies research findings?', answer: 'They are interactive explorations of form and behavior. They do not demonstrate product performance or establish scientific findings.' },
      { question: 'What makes a useful research proposal?', answer: 'A specific question, the decision it would inform, relevant context and the evidence currently missing help make a proposal discussable.' },
      { question: 'Does every experiment become a product?', answer: 'A study can be useful because it clarifies a constraint, changes a direction or gives a reason to stop. The purpose is to make a better-informed decision about the next step.' },
    ],
  },
  'nrth-chemicals': {
    audience: 'Industrial teams, technical specialists and potential partners exploring material requirements for a defined application.',
    workflow: [
      { title: 'Describe the application.', text: 'Establish the intended use, operating context and questions that a technical assessment would need to answer.' },
      { title: 'Organize the evidence.', text: 'Map requested specifications, provenance and relevant documentation to their sources, versions and outstanding gaps.' },
      { title: 'Define the review.', text: 'Identify which decisions require qualified expertise and what evidence would be needed before a commercial discussion could progress.' },
    ],
    scenario: {
      title: 'The application sets the question.',
      introduction: 'A technical team is reviewing an early material inquiry for an industrial application. Change what is understood.',
      options: [
        { label: 'The brief is defined', context: 'The intended use and review criteria are documented.', task: 'Connect the stated application to the evidence requested by the technical team.', decision: 'Which questions must a qualified assessment resolve before the discussion progresses?' },
        { label: 'Evidence is incomplete', context: 'A requested specification or source document is missing.', task: 'Distinguish documented properties from unverified statements and keep the evidence gap visible.', decision: 'Who should obtain the missing evidence before the review proceeds?' },
        { label: 'The application changes', context: 'A partner proposes a different operating context for the material.', task: 'Keep the revised use visible alongside the original brief and the evidence gathered for it.', decision: 'Which review criteria and documentation need reconsideration by the responsible specialists?' },
      ],
    },
    questions: [
      { question: 'Are chemicals available to purchase here?', answer: 'This overview does not publish a product catalogue or confirm supply availability. An inquiry can describe a specific application or partnership interest.' },
      { question: 'What makes a useful first conversation?', answer: 'The intended application, relevant constraints, questions to resolve and the expertise already involved provide a practical starting point.' },
      { question: 'Can the website determine material suitability?', answer: 'Material suitability requires evidence and review by appropriate specialists for the specific application. The examples here show how a review question can be framed, rather than assessing a material.' },
    ],
  },
  'nrth-events': {
    audience: 'Organizations, collaborators and communities considering gatherings with a clear purpose and a carefully shaped participant experience.',
    workflow: [
      { title: 'Define the exchange.', text: 'Establish who the gathering is for and what participants should be able to discuss, experience or explore together.' },
      { title: 'Shape the experience.', text: 'Consider how arrival, shared sessions, informal conversations and transitions support that purpose.' },
      { title: 'Coordinate the details.', text: 'Make responsibilities, participant information and the implications of a schedule change explicit.' },
    ],
    scenario: {
      title: 'Design for the people in the room.',
      introduction: 'Collaborators are planning a gathering to discuss and demonstrate an emerging idea. Change who will take part.',
      options: [
        { label: 'A focused audience', context: 'Participants share a working context and arrive with similar knowledge of the subject.', task: 'Build the experience around the conversations and demonstrations this group needs.', decision: 'How much time should support discussion, demonstrations and introductions?' },
        { label: 'The audience broadens', context: 'New attendees have different levels of familiarity with the subject.', task: 'Reconsider the information people need to participate confidently.', decision: 'Where do introductions or additional context belong without crowding the experience?' },
        { label: 'The format changes', context: 'Part of the gathering moves to a different format or location.', task: 'Revisit the relationship between venue, timing and participation.', decision: 'Which transitions, communications and responsibilities are affected by the change?' },
      ],
    },
    questions: [
      { question: 'Is there a published event calendar?', answer: 'No event calendar is confirmed here. This page describes a venture direction and offers a way to discuss a potential gathering.' },
      { question: 'What belongs in an event inquiry?', answer: 'Describe the audience, purpose, preferred format, approximate timing and any constraints already known. These details help frame a useful first conversation.' },
      { question: 'How could Events connect with other ventures?', answer: 'A gathering could create space to exchange ideas around research, systems or an industry question. A specific collaboration would have its own agreed purpose and scope.' },
    ],
  },
};
