export type VentureDepth = {
  headline: string;
  introduction: string;
  feature: { eyebrow: string; title: string; paragraphs: string[] };
  audiences: { title: string; text: string }[];
  contexts: {
    id: string;
    label: string;
    title: string;
    summary: string;
    inputs: string[];
    flow: { title: string; text: string }[];
    decision: string;
    connection: { slug: string; label: string; text: string };
  }[];
  boundaries: { title: string; text: string }[];
  questions: { question: string; answer: string }[];
};

/** Render once beside the context explorer, rather than on every example. */
export const ventureIllustrationNote = 'Illustrative work contexts for exploring a venture direction. Specific capabilities and delivery scope are agreed with NRTH.';

export const ventureDepth: Record<string, VentureDepth> = {
  'nrth-health': {
    headline: 'A clearer way through care.',
    introduction: 'The experience includes the questions before a visit, the information that passes between teams and the practical next step someone can understand. NRTH Health explores those connections from the person’s point of view.',
    feature: {
      eyebrow: 'The health experience',
      title: 'The practical details are part of care.',
      paragraphs: [
        'Someone preparing for a visit may need a location, an arrival time, a clear explanation or a way to ask an administrative question. Each detail can live in a different message or tool. The opportunity begins by bringing the relevant context into an understandable order.',
        'For the team behind that experience, clarity also means knowing where a request came from, what remains unanswered and who can resolve it. NRTH Health considers the interface and the handoff together, with appropriate access and accessibility shaping both.',
      ],
    },
    audiences: [
      { title: 'People navigating care', text: 'An understandable view of the practical next step, the source of its information and the route to the right administrative support.' },
      { title: 'Coordination teams', text: 'A clearer relationship between the incoming request, the outstanding question and the person responsible for its resolution.' },
      { title: 'Health organizations', text: 'A focused way to examine information journeys across existing tools, permissions, organizational boundaries and access needs.' },
    ],
    contexts: [
      {
        id: 'visit-preparation', label: 'Before a visit', title: 'Help the person arrive prepared.',
        summary: 'A visit creates practical questions before anyone arrives. This context examines how preparation information can be organized around the person’s immediate task.',
        inputs: ['An anonymized appointment journey', 'The approved information sources', 'The administrative contact route'],
        flow: [
          { title: 'Find the immediate question', text: 'Identify what someone needs to understand now: where to go, when to arrive or who can clarify an administrative requirement.' },
          { title: 'Give the answer its context', text: 'Connect the relevant information to its source, applicability and last update, using language suited to the person reading it.' },
          { title: 'Leave a clear route for uncertainty', text: 'Make the responsible contact and next action understandable when the preparation information does not resolve the question.' },
        ],
        decision: 'Which question should the experience answer directly, and which needs the responsible care team to respond?',
        connection: { slug: 'nrth-labs', label: 'Examine comprehension with NRTH Labs', text: 'A focused study can investigate whether people find and understand the intended practical step.' },
      },
      {
        id: 'care-coordination', label: 'Across teams', title: 'Keep the purpose with the request.',
        summary: 'A coordination request can cross departments or organizations. The important context is the unresolved question, the necessary information and the owner of the next action.',
        inputs: ['The handoff and its participants', 'Role-specific information needs', 'The existing acknowledgment process'],
        flow: [
          { title: 'Describe the request precisely', text: 'Separate the administrative question, its current status and the information needed by the next authorized team.' },
          { title: 'Confirm the receiving responsibility', text: 'Identify who accepts the request and how the originating team knows it has reached the appropriate owner.' },
          { title: 'Close the administrative loop', text: 'Return an acknowledgment or next-step explanation so the person and coordinating team know what remains unresolved.' },
        ],
        decision: 'What must remain visible when the request changes hands, and what should remain restricted to its source?',
        connection: { slug: 'nrth-systems', label: 'Define the boundary with NRTH Systems', text: 'Systems examines access, information ownership and the meaning of an acknowledged exchange.' },
      },
      {
        id: 'accessible-information', label: 'Everyday access', title: 'Design for the circumstances around the task.',
        summary: 'A useful information experience needs to work in the setting where someone encounters it, including a small screen, assistive technology or unfamiliar terminology.',
        inputs: ['The task and its setting', 'Known accessibility and language needs', 'A representative information sample'],
        flow: [
          { title: 'Understand the access conditions', text: 'Describe the device, environment and interaction needs before assuming how someone will navigate or read.' },
          { title: 'Make the hierarchy understandable', text: 'Organize the essential answer, supporting detail and contact route in a clear reading order with meaningful headings.' },
          { title: 'Observe the practical task', text: 'Examine whether people can locate the next step using the relevant input methods and access conditions.' },
        ],
        decision: 'Which access barrier changes the experience most, and what evidence should a focused study collect?',
        connection: { slug: 'nrth-labs', label: 'Study the interaction with NRTH Labs', text: 'The research question can concentrate on navigation or comprehension without implying a clinical outcome.' },
      },
    ],
    boundaries: [
      { title: 'Permission follows purpose', text: 'Identify the role, the task and the minimum information needed. Access to one part of a workflow should not silently grant access to every record around it.' },
      { title: 'A source for the answer', text: 'Preparation and coordination information needs an identifiable owner. Updates, corrections and unanswered questions need a route back to that source.' },
      { title: 'Clinical decisions have their own requirements', text: 'An administrative experience is different from diagnosis, treatment or clinical decision support. Intended use determines the expertise, evidence and review required.' },
    ],
    questions: [
      { question: 'What could a focused health project examine?', answer: 'One preparation journey, an administrative handoff or the comprehensibility of a specific information experience. Start with the task, its audience and the point where someone loses clarity; that provides a more useful scope than a broad request to redesign care.' },
      { question: 'How would existing health systems fit into the discussion?', answer: 'Begin by identifying where the relevant information is held, who owns it and which exchange is actually needed. Data formats, access conditions, interoperability requirements and integration scope follow from that workflow; support for a particular health system is not assumed.' },
      { question: 'How can accessibility be examined early?', answer: 'Use representative content and the relevant devices, input methods and assistive technology in a focused study. Examine reading order, language, control labels and recovery from confusion alongside the practical task people are trying to complete.' },
      { question: 'What is appropriate to share in a first inquiry?', answer: 'An anonymized process description, the people involved, intended use and known constraints. Keep personal health information and identifiable records out of the general inquiry form; a suitable information-sharing arrangement can be discussed if the work progresses.' },
    ],
  },
  'nrth-tms': {
    headline: 'The plan is a living commitment.',
    introduction: 'A transportation plan joins a request to resources, timing and the people who make the movement possible. NRTH TMS explores that planning thread as work is assigned, revised and handed over.',
    feature: {
      eyebrow: 'Transportation planning', title: 'Think beyond a route on a map.',
      paragraphs: [
        'The route is one part of the job. Loading windows, equipment needs, receiving arrangements and later commitments influence whether a proposed movement is practical. A useful planning experience keeps these dependencies close to the decision.',
        'The direction also considers how a plan changes. A revision needs an owner, a reason and a path to the people acting on it. That thread connects planning and dispatch without assuming that every new observation should automatically change the operation.',
      ],
    },
    audiences: [
      { title: 'Planning and dispatch', text: 'The relationship between an incoming job, its constraints and the assignment that can be responsibly confirmed.' },
      { title: 'Shippers and coordinators', text: 'A way to examine recurring requirements, changed commitments and the information that should travel with a movement request.' },
      { title: 'Operations partners', text: 'A shared planning discussion around resource context, receiving arrangements and the ownership of a revision.' },
    ],
    contexts: [
      {
        id: 'recurring-movements', label: 'Recurring work', title: 'Keep the useful pattern. Notice the difference.',
        summary: 'A repeated movement can still carry a changed requirement. Explore how a familiar planning pattern retains the details that make today’s job different.',
        inputs: ['A representative recurring job', 'Pickup and receiving requirements', 'The owner of each confirmation'],
        flow: [
          { title: 'Separate the pattern from the instance', text: 'Identify the requirements that repeat and the dates, quantities or arrangements that need confirmation for this job.' },
          { title: 'Check the fit with available resources', text: 'Compare the current requirement with the resource and receiving commitments rather than relying on the previous assignment.' },
          { title: 'Confirm the version being dispatched', text: 'Make the agreed job details and outstanding questions clear to the team accepting the assignment.' },
        ],
        decision: 'Which parts of a recurring job can be reused, and which must be reconfirmed each time?',
        connection: { slug: 'nrth-fleet', label: 'Bring the resource context from NRTH Fleet', text: 'A repeated planning pattern still needs current information about the resource proposed for the work.' },
      },
      {
        id: 'connected-stops', label: 'Connected stops', title: 'A stop changes the work that follows.',
        summary: 'A multi-stop movement links several appointments and practical requirements. Examine how the dependencies between stops shape a workable planning discussion.',
        inputs: ['The sequence of stops', 'Time and access constraints', 'Partner confirmation requirements'],
        flow: [
          { title: 'Describe each commitment', text: 'Identify what must happen at every stop, the allowed window and the person who can confirm the arrangement.' },
          { title: 'Trace the dependency', text: 'Make the later stop’s assumptions visible when it depends on the completion, timing or information from an earlier one.' },
          { title: 'Agree a path for revision', text: 'Identify the planning owner and the partners who need to accept a changed sequence or commitment.' },
        ],
        decision: 'Which later commitment needs attention when one stop’s conditions change?',
        connection: { slug: 'nrth-logistics', label: 'Trace the handoffs with NRTH Logistics', text: 'Logistics examines the partner arrangements and evidence needed as the job passes between people and locations.' },
      },
      {
        id: 'planning-handover', label: 'Across shifts', title: 'Pass on the reasoning behind the plan.',
        summary: 'When responsibility changes, the next planner needs more than the current assignment. Open questions and the reasons behind a commitment belong with the handover.',
        inputs: ['The current plan and its revision', 'Unresolved planning questions', 'The next responsible team'],
        flow: [
          { title: 'Identify what is committed', text: 'Separate confirmed assignments from tentative arrangements and information that is still awaiting a response.' },
          { title: 'Keep the reasoning attached', text: 'Explain the constraint behind an unusual assignment and the downstream commitment that depends on it.' },
          { title: 'Confirm the next planning owner', text: 'Make the handover and the next action explicit so an unresolved question does not become an unnoticed assumption.' },
        ],
        decision: 'What does the next planner need to understand before revising or confirming the assignment?',
        connection: { slug: 'nrth-systems', label: 'Clarify the exchange with NRTH Systems', text: 'Systems considers version ownership, acknowledgment and the information a receiving workflow can rely on.' },
      },
    ],
    boundaries: [
      { title: 'The planning record', text: 'Establish where a job’s agreed details live and how revisions are distinguished. A copied request should not silently become a competing plan.' },
      { title: 'Observations and commitments', text: 'A signal may inform planning; the authorized person confirms the operational response. Keep the observation, interpretation and accepted revision distinct.' },
      { title: 'The integration has a purpose', text: 'Map the information needed from orders, vehicles or partner tools. Specific exchanges and supported systems depend on a defined workflow.' },
    ],
    questions: [
      { question: 'Can a transportation discussion begin with one workflow?', answer: 'Yes. A recurring movement, a multi-stop assignment or a planning handover provides enough context to examine the current process. Identify the decisions, the people making them and the information they use before broadening the scope.' },
      { question: 'How should planning exceptions be prioritized?', answer: 'Begin with the commitment affected and the decision waiting for an owner. A missing requirement, an unaccepted revision and a fresh vehicle observation create different kinds of work; the planning experience should preserve those differences.' },
      { question: 'Does this imply automated dispatch or route optimization?', answer: 'The page describes a planning direction and illustrative workflows. Specific automation, optimization methods and dispatch capabilities are not established here. Any proposed implementation needs a defined intended use, operational ownership and validation.' },
      { question: 'What helps define an integration scope?', answer: 'A sample job using fictional or anonymized details, the tools that currently hold each part of it and the exchanges required for planning and dispatch. Include ownership, update timing and the way a receiving team confirms a change.' },
    ],
  },
  'nrth-telematics': {
    headline: 'From an observation to understanding.',
    introduction: 'Vehicle information becomes useful when someone can interpret it in the context of work. NRTH Telematics explores the relationship between an observation, its quality and the operational question behind it.',
    feature: {
      eyebrow: 'Vehicle information', title: 'The timestamp is part of the story.',
      paragraphs: [
        'A precise point can still be an incomplete answer. Its age, source and relationship to the assigned job influence what an operations team can reasonably conclude. This direction keeps the evidence around an observation visible alongside the activity itself.',
        'The aim of an information experience is a useful question answered with appropriate confidence. That might mean understanding a departure, placing a stop in context or recognizing that a signal gap needs confirmation rather than an assumption.',
      ],
    },
    audiences: [
      { title: 'Operations teams', text: 'A clearer connection between vehicle observations, job context and the practical question that needs a response.' },
      { title: 'Fleet coordinators', text: 'An information-quality perspective on movement history, observation gaps and the asset being discussed.' },
      { title: 'Data and device partners', text: 'A focused discussion about signal definitions, update expectations and the boundaries of an exchange.' },
    ],
    contexts: [
      {
        id: 'departure-context', label: 'A departure', title: 'Connect movement to the commitment.',
        summary: 'An operations team wants to understand whether a vehicle’s activity relates to the next planned movement. The question joins observed activity to an agreed assignment.',
        inputs: ['The assigned job and next handoff', 'Observation times and sources', 'The responsible operations contact'],
        flow: [
          { title: 'Identify the question being asked', text: 'Describe the commitment the team is checking and what a vehicle observation would help them understand.' },
          { title: 'Read the observation in context', text: 'Examine the recorded activity and its freshness beside the assignment, expected sequence and available confirmations.' },
          { title: 'Confirm what remains uncertain', text: 'Separate the evidence of activity from any conclusion about completion or readiness that needs the responsible person.' },
        ],
        decision: 'Does the observation answer the planning question, or does the commitment still need confirmation?',
        connection: { slug: 'nrth-tms', label: 'Connect the observation to NRTH TMS', text: 'The transportation plan gives the observed movement its relevant job and next commitment.' },
      },
      {
        id: 'stop-context', label: 'A stop', title: 'Understand the pause before responding.',
        summary: 'A stop can be expected work, a planned pause or an unresolved question. Its meaning comes from the surrounding assignment and confirmed operating context.',
        inputs: ['The observed activity interval', 'Expected stops and job context', 'Known gaps in the observations'],
        flow: [
          { title: 'Describe what is actually observed', text: 'State the recorded activity, time interval and source without adding a reason that the evidence does not establish.' },
          { title: 'Compare the operating context', text: 'Read the interval alongside expected stops, partner arrangements and the information already known to the team.' },
          { title: 'Direct the remaining question', text: 'Identify the person who can verify the situation and the commitment that may need attention if it changes.' },
        ],
        decision: 'What additional context is needed before the team treats the stop as an exception?',
        connection: { slug: 'nrth-logistics', label: 'Understand the handoff with NRTH Logistics', text: 'A loading or receiving arrangement can explain the operational context around the observation.' },
      },
      {
        id: 'signal-continuity', label: 'Signal continuity', title: 'Make the unknown interval visible.',
        summary: 'Data does not always arrive continuously. A useful experience distinguishes the last known observation from the situation the team wants to understand now.',
        inputs: ['Source update expectations', 'The last available observation', 'The decision affected by the gap'],
        flow: [
          { title: 'Show the age of the evidence', text: 'Keep the last observation’s time and source visible rather than presenting an older value as the current state.' },
          { title: 'Explain the uncertainty', text: 'Distinguish an expected update interval from a missing observation and identify which conclusion the gap limits.' },
          { title: 'Choose a verification route', text: 'Determine whether another source, a fresh observation or the responsible person can answer the operational question.' },
        ],
        decision: 'How should the team proceed when the available observation no longer supports the decision?',
        connection: { slug: 'nrth-systems', label: 'Define the data exchange with NRTH Systems', text: 'Systems considers source contracts, failure visibility and the meaning of a received update.' },
      },
    ],
    boundaries: [
      { title: 'Purpose and access', text: 'Define why observations are used, who may see them and the retention needed for that purpose. Vehicle information can affect people as well as assets.' },
      { title: 'Source and freshness', text: 'A data exchange needs clear signal definitions, timestamps and update expectations. Coverage and reliability are questions to establish for the intended use.' },
      { title: 'Interpretation and response', text: 'Keep observed activity separate from assumptions about cause or completion. Identify who confirms an operational response and what information supports it.' },
    ],
    questions: [
      { question: 'What makes one signal more useful than another?', answer: 'Its relevance to a defined question, its source, freshness and the context available to interpret it. More data is not automatically more useful; begin with the decision and identify the observations that would help the responsible person make it.' },
      { question: 'How should historical activity be distinguished from live information?', answer: 'Make observation times and coverage visible, and use language that matches the evidence. A history of recorded points describes those observations; it should not be presented as uninterrupted knowledge of the vehicle’s current state.' },
      { question: 'Can an observation confirm delivery or completion?', answer: 'That depends on the agreed evidence for the handoff. Vehicle activity and a partner’s confirmation can describe different things. Define what completion means and which source the responsible team accepts for that decision.' },
      { question: 'What should a device or data partner bring?', answer: 'Signal definitions, source and timestamp behavior, expected update intervals and known coverage limits. Use non-sensitive examples to explain the exchange and the operational question it is intended to support.' },
    ],
  },
  'nrth-logistics': {
    headline: 'Keep the commitment moving.',
    introduction: 'A movement depends on more than transport. NRTH Logistics explores the information, acknowledgments and responsibilities that hold a chain of partner commitments together.',
    feature: {
      eyebrow: 'Partner coordination', title: 'Between one team and the next.',
      paragraphs: [
        'At a handoff, one team’s completion becomes another team’s starting point. Documents, receiving conditions and the meaning of an acknowledgment influence whether the next party can act with confidence.',
        'This direction follows the work across those boundaries. It considers who needs what, how acceptance is established and how a changed arrangement reaches the commitments that depend on it. The practical unit is a clear handoff with an owner and a purpose.',
      ],
    },
    audiences: [
      { title: 'Shippers and receivers', text: 'The information and confirmation needed to align the commitment at both ends of a handoff.' },
      { title: 'Partner coordinators', text: 'A view of the dependencies between people, places, documents and the next agreed action.' },
      { title: 'Exception owners', text: 'A traceable question with the affected commitments and the person able to resolve it.' },
    ],
    contexts: [
      {
        id: 'partner-onboarding', label: 'A new partner', title: 'Agree the handoff before relying on it.',
        summary: 'A new receiving or coordination partner introduces different expectations. Explore how those expectations become explicit before the first movement depends on them.',
        inputs: ['The parties and their responsibilities', 'Required information and documents', 'The meaning of partner acceptance'],
        flow: [
          { title: 'Name each side’s requirements', text: 'Describe what the originating and receiving parties need, including timing, contacts and the information used to proceed.' },
          { title: 'Identify the confirmation', text: 'Agree which acknowledgment shows the arrangement has been accepted and which questions still require a response.' },
          { title: 'Make the first handoff reviewable', text: 'Keep the agreed requirements and responsible contacts available to the people coordinating the actual work.' },
        ],
        decision: 'What needs to be accepted by both parties before the new arrangement becomes part of the plan?',
        connection: { slug: 'nrth-tms', label: 'Connect the agreement to NRTH TMS', text: 'Partner conditions can become constraints that the transportation plan needs to preserve.' },
      },
      {
        id: 'document-thread', label: 'The document thread', title: 'Keep the evidence with its purpose.',
        summary: 'Several parties may need different documents for the same movement. Examine how each requirement stays connected to its source, version and intended handoff.',
        inputs: ['The required document types', 'Source and version ownership', 'The receiving party’s review process'],
        flow: [
          { title: 'Map the requirement', text: 'Identify which party requests the information, why it is needed and which transition depends on it.' },
          { title: 'Trace the source and version', text: 'Keep the document’s owner and current version visible, distinguishing receipt from approval or acceptance.' },
          { title: 'Close the outstanding request', text: 'Confirm whether the receiving party has the information it needs or identify the precise gap and its owner.' },
        ],
        decision: 'Which missing or changed document affects the next handoff, and who can resolve the requirement?',
        connection: { slug: 'nrth-systems', label: 'Clarify record ownership with NRTH Systems', text: 'Systems considers the authoritative version, access boundaries and the acknowledgment of an exchange.' },
      },
      {
        id: 'post-handoff', label: 'After the handoff', title: 'Completion needs a shared meaning.',
        summary: 'Work can appear complete to one party while another still has an unresolved question. Explore the evidence and acknowledgment that make the handoff understandable to everyone involved.',
        inputs: ['The agreed completion criteria', 'The available acknowledgments', 'The downstream commitment'],
        flow: [
          { title: 'Compare the recorded states', text: 'Identify what each party means by sent, received or accepted and which state the next commitment requires.' },
          { title: 'Locate the unresolved question', text: 'Separate a missing acknowledgment from a disagreement or an incomplete task, then identify the responsible owner.' },
          { title: 'Return the useful confirmation', text: 'Communicate the resolved state and any remaining action to the people planning the next handoff.' },
        ],
        decision: 'What evidence tells the next party that it can act on the completed handoff?',
        connection: { slug: 'nrth-telematics', label: 'Compare observations with NRTH Telematics', text: 'Vehicle activity can inform a handoff while remaining distinct from a partner’s acceptance.' },
      },
    ],
    boundaries: [
      { title: 'Commitment ownership', text: 'Identify which party can accept or revise an arrangement. A notification should not be mistaken for another organization’s agreement.' },
      { title: 'Necessary information', text: 'Keep a partner exchange focused on its purpose, with appropriate access to documents and a clear source for updates.' },
      { title: 'Operating scope', text: 'Coordination concepts do not establish transport capacity, brokerage authority or service coverage. A commercial arrangement needs its own confirmed responsibilities and terms.' },
    ],
    questions: [
      { question: 'How can several partners describe the same handoff?', answer: 'Start with the states each party recognizes and the evidence that changes those states. A useful shared description names the request, acknowledgment, accepted responsibility and the next action without assuming every partner uses the same software.' },
      { question: 'What belongs in a coordination map?', answer: 'People, organizations, places, commitments and the information required between them. Include the actual owner and confirmation at each transition, then add a representative exception to reveal where the ideal process loses clarity.' },
      { question: 'How can document work become more understandable?', answer: 'Connect a document to the requirement it answers, its source, its current version and the receiving party’s response. This makes it easier to identify a missing piece without treating every shared file as an accepted part of the handoff.' },
      { question: 'Where should a first logistics discussion begin?', answer: 'Choose one handoff with a practical consequence: a partner arrangement, a document requirement or a completion that another team cannot confirm. Explain what each party needs and how they currently know the work is ready to proceed.' },
    ],
  },
  'nrth-systems': {
    headline: 'Make the connections understandable.',
    introduction: 'Software supports work through its rules, boundaries and exceptions. NRTH Systems explores foundations that keep those relationships clear for the people using, operating and changing them.',
    feature: {
      eyebrow: 'Software foundations', title: 'Good systems explain what happens next.',
      paragraphs: [
        'A tool can be simple on its own while the work between tools remains difficult. Competing records, uncertain access and silent failures create questions that an interface alone cannot settle.',
        'The Systems direction begins at those edges. It considers who owns the information, what an exchange means and how the workflow recovers when reality differs from the ideal path. Maintenance and operation belong in the conversation from the start.',
      ],
    },
    audiences: [
      { title: 'Operational teams', text: 'An experience that makes the next action, ownership and recovery route clear when work crosses tools.' },
      { title: 'Technical owners', text: 'Explicit information contracts, useful failure visibility and a foundation that remains explainable as requirements change.' },
      { title: 'Integration partners', text: 'A focused boundary with an agreed source of truth, access conditions and acknowledgment behavior.' },
    ],
    contexts: [
      {
        id: 'access-lifecycle', label: 'Access over time', title: 'Let access follow the responsibility.',
        summary: 'People join a workflow, change roles and leave it. Explore how the access needed for a task stays aligned with the responsibility the person actually holds.',
        inputs: ['The roles and their tasks', 'The authoritative role information', 'Approval and review responsibilities'],
        flow: [
          { title: 'Describe the task boundary', text: 'Identify what a role needs to view or change and why that access is necessary for the work.' },
          { title: 'Connect the change to an owner', text: 'Map who approves a new or changed responsibility and which system records the authoritative state.' },
          { title: 'Plan the end of access', text: 'Include role changes, departures and review in the workflow rather than leaving removal as an unrelated manual task.' },
        ],
        decision: 'Which owner can authorize the change, and how does each connected tool learn the new access state?',
        connection: { slug: 'nrth-health', label: 'Explore careful access with NRTH Health', text: 'Health information workflows make the relationship between purpose, role and appropriate access especially important.' },
      },
      {
        id: 'record-ownership', label: 'Shared records', title: 'Give each decision an authoritative source.',
        summary: 'Several tools can hold overlapping information. Explore how field ownership and revision rules keep a useful exchange from creating competing versions of the same work.',
        inputs: ['The records and fields in scope', 'Current update responsibilities', 'A representative conflicting change'],
        flow: [
          { title: 'Map ownership at the useful level', text: 'Identify which source is authoritative for each decision rather than assuming one tool owns every part of the record.' },
          { title: 'Describe the exchange', text: 'Specify which change is shared, how its origin and version are preserved and what the receiving workflow may rely on.' },
          { title: 'Give conflicts a recovery path', text: 'Identify the person or agreed rule that resolves a disagreement and how the result returns to the connected records.' },
        ],
        decision: 'What should happen when an incoming update disagrees with the record the receiving team trusts?',
        connection: { slug: 'nrth-tms', label: 'See planning revisions in NRTH TMS', text: 'Transportation work provides a concrete setting where a copied request and a committed plan may have different owners.' },
      },
      {
        id: 'exchange-recovery', label: 'Reliable handoffs', title: 'Design the recovery with the exchange.',
        summary: 'A request may be delayed, repeated or acknowledged incompletely. Explore the recovery behavior and visibility needed around a practical information boundary.',
        inputs: ['The request and expected response', 'Duplicate and failure behavior', 'The operations owner'],
        flow: [
          { title: 'Define the meaningful states', text: 'Distinguish created, sent, received and accepted so the workflow reflects the acknowledgment it actually has.' },
          { title: 'Preserve the original context', text: 'Keep the request identity and relevant evidence available when an exchange is retried or investigated.' },
          { title: 'Make recovery actionable', text: 'Explain which action is appropriate, what requires verification and who owns the unresolved boundary.' },
        ],
        decision: 'What can be safely repeated, and what needs confirmation before another action changes the work?',
        connection: { slug: 'nrth-telematics', label: 'Examine changing observations in NRTH Telematics', text: 'Vehicle feeds create useful questions about update timing, missing observations and source semantics.' },
      },
    ],
    boundaries: [
      { title: 'Responsibility before connection', text: 'Identify the authoritative owner and the permission to exchange information. A technical connection does not itself establish a business responsibility.' },
      { title: 'Defined failure behavior', text: 'Describe duplicates, timeouts, disagreements and recovery. The receiving workflow needs to know which state has actually been confirmed.' },
      { title: 'A maintainable scope', text: 'Establish the existing environment, operational owner and change process. Supported technologies, service commitments and delivery arrangements are agreed for the specific work.' },
    ],
    questions: [
      { question: 'Can a small boundary be a complete starting scope?', answer: 'Yes. One information exchange, role change or recovery workflow can expose enough of the underlying rules to support a useful discussion. Define the task and its owners before deciding how much of the surrounding system needs to change.' },
      { question: 'How does design connect to technical architecture?', answer: 'An interface’s language and states should reflect what the underlying workflow knows. A successful request, a received message and an accepted task are different states; matching the experience to those distinctions helps users make appropriate decisions.' },
      { question: 'What should an operations owner be able to understand?', answer: 'Where the work is in its lifecycle, which information is authoritative, what failed and the appropriate recovery route. A useful design preserves enough context to investigate the boundary without requiring the team to guess what an earlier action did.' },
      { question: 'What technical material is useful initially?', answer: 'A workflow sketch, a list of tools and owners, representative record shapes and an example of a difficult case. Use sanitized examples and share credentials or production access only through a suitable arrangement if the engagement requires them.' },
    ],
  },
  'nrth-labs': {
    headline: 'Make the unknown worth investigating.',
    introduction: 'Research is useful when it sharpens the next decision. NRTH Labs explores focused studies and prototypes that make an unfamiliar direction concrete enough to examine together.',
    feature: {
      eyebrow: 'Experiments and prototypes', title: 'Give the question a form.',
      paragraphs: [
        'A broad idea often contains several uncertainties. One may concern whether people understand an interface; another whether information can cross a technical boundary; another whether the available evidence supports a material question.',
        'Labs creates space to distinguish those questions and choose a small, useful investigation. The result includes what happened, what that observation supports and what remains unresolved. A reason to change direction can be as valuable as a reason to continue.',
      ],
    },
    audiences: [
      { title: 'Researchers', text: 'A specific question, an explicit observation and a record that separates the result from its interpretation.' },
      { title: 'Builders', text: 'A bounded prototype that can expose an uncertainty before committing to a larger implementation.' },
      { title: 'Potential collaborators', text: 'A practical starting point around a shared decision, the evidence missing and the expertise needed to investigate it.' },
    ],
    contexts: [
      {
        id: 'interaction-study', label: 'An interaction', title: 'Observe the task, not just the preference.',
        summary: 'A team wants to understand whether an interface communicates a practical next step. Explore a study organized around a task people can attempt and an uncertainty the team can examine.',
        inputs: ['The task and intended audience', 'A focused prototype', 'The observation to record'],
        flow: [
          { title: 'State the uncertainty', text: 'Identify the misunderstanding or navigation question that could change the next design decision.' },
          { title: 'Choose an observable task', text: 'Use a representative task and record what participants do, where they hesitate and what they explain in their own words.' },
          { title: 'Separate observation from explanation', text: 'Compare the behavior with the starting assumption and identify which interpretation needs a narrower follow-up.' },
        ],
        decision: 'What change or further study is supported by the behavior actually observed?',
        connection: { slug: 'nrth-health', label: 'Explore comprehension with NRTH Health', text: 'A health information journey provides a concrete question about understandable preparation and next steps.' },
      },
      {
        id: 'technical-prototype', label: 'A technical boundary', title: 'Prototype the uncertain connection.',
        summary: 'A proposed system depends on an unfamiliar exchange or behavior. Explore a small prototype that examines this uncertainty without pretending to be a production implementation.',
        inputs: ['The proposed exchange', 'Known technical constraints', 'A defined success observation'],
        flow: [
          { title: 'Bound the prototype', text: 'Select the uncertain behavior, representative inputs and the conditions the study will examine.' },
          { title: 'Observe the useful edge cases', text: 'Include delays, missing information or conflicting states that affect the proposed connection’s meaning.' },
          { title: 'Record the implementation gap', text: 'Document what the prototype demonstrates and which operational, access or reliability questions remain for later work.' },
        ],
        decision: 'Which assumption has been examined, and what remains necessary before a production discussion?',
        connection: { slug: 'nrth-systems', label: 'Carry the boundary into NRTH Systems', text: 'Systems brings a perspective on ownership, recovery and the operating requirements beyond the prototype.' },
      },
      {
        id: 'evidence-review', label: 'An evidence question', title: 'Understand what the sources support.',
        summary: 'A team has documents and claims around a possible direction. Explore how a structured review distinguishes available evidence from an assumption that still needs specialist investigation.',
        inputs: ['The question and intended use', 'The relevant source documents', 'The expertise needed for interpretation'],
        flow: [
          { title: 'Define the evidence question', text: 'State the claim or uncertainty and the decision the review is intended to inform.' },
          { title: 'Keep the source with the statement', text: 'Record provenance, version and relevance beside the information used to address the question.' },
          { title: 'Identify the unanswered part', text: 'Distinguish what the documents establish from what requires new evidence or an appropriately qualified assessment.' },
        ],
        decision: 'Does the evidence answer the question, or does it define a more focused investigation?',
        connection: { slug: 'nrth-chemicals', label: 'Explore application evidence with NRTH Chemicals', text: 'A material application brings specific questions about specifications, provenance and appropriate technical review.' },
      },
    ],
    boundaries: [
      { title: 'A defined observation', text: 'Choose what the study can observe and how that observation relates to the question. An attractive prototype alone is not evidence for a broad claim.' },
      { title: 'Responsible study inputs', text: 'Establish the appropriate permissions, participant arrangements and information handling before the investigation uses real people or data.' },
      { title: 'A result with limits', text: 'Keep the setup, findings and unresolved questions together. A limited study should not be presented as proof of performance in a different context.' },
    ],
    questions: [
      { question: 'What can make a prototype worth building?', answer: 'A specific uncertainty whose answer would influence a real decision. The prototype should expose that uncertainty through an observable task or technical behavior, with a scope small enough to understand what the result does and does not establish.' },
      { question: 'How can different disciplines collaborate on one study?', answer: 'Agree on the question and decision first, then identify the expertise needed for the inputs, observation and interpretation. A shared record of assumptions and limits helps each collaborator understand what the others can reasonably conclude.' },
      { question: 'What should remain after an experiment?', answer: 'The original question, the setup, the observation, its interpretation and the rationale for the next step. Preserve inconclusive results and changes of direction when they explain an important constraint or prevent the same uncertainty being rediscovered.' },
      { question: 'How does a study move toward a venture?', answer: 'A useful result can define the next scope, but it does not automatically establish a product. The follow-up may be another study, a technical investigation, a partner discussion or a decision to set the direction aside.' },
    ],
  },
  'nrth-chemicals': {
    headline: 'The application gives the material meaning.',
    introduction: 'Material questions begin with the work a substance is intended to do. NRTH Chemicals explores the application, evidence and specialist conversations needed to make an industrial direction discussable.',
    feature: {
      eyebrow: 'Chemicals and applications', title: 'Look closely at what the use requires.',
      paragraphs: [
        'A material name does not describe its suitability for every environment. The intended application, operating conditions and required evidence shape the question a technical team needs to ask.',
        'The Chemicals direction considers how to make that question precise: a clear brief, traceable documents and the right expertise around the review. It also looks at the information that would need to remain attached if an application discussion later becomes a partner or supply conversation.',
      ],
    },
    audiences: [
      { title: 'Application owners', text: 'A brief that explains intended use, operating conditions and the technical questions the responsible team needs answered.' },
      { title: 'Technical specialists', text: 'An organized evidence picture with source documents, versions and unresolved questions clearly distinguished.' },
      { title: 'Prospective partners', text: 'A discussion grounded in the application and the expertise needed before further material or commercial commitments.' },
    ],
    contexts: [
      {
        id: 'application-brief', label: 'An application brief', title: 'Describe the conditions behind the requirement.',
        summary: 'An industrial team is exploring a material direction for a defined use. The first useful work is a brief that lets the relevant specialists identify what must be understood.',
        inputs: ['The intended industrial use', 'Known operating constraints', 'The responsible technical reviewers'],
        flow: [
          { title: 'State the application', text: 'Describe the role of the material, its environment and the requirement that prompted the inquiry.' },
          { title: 'Identify the technical questions', text: 'Ask the responsible specialists which properties, compatibility questions and documentation matter for that use.' },
          { title: 'Define the review scope', text: 'Record the evidence requested, the unanswered questions and the expertise needed before the discussion can progress.' },
        ],
        decision: 'What does the technical team need to establish about the application before considering a material direction?',
        connection: { slug: 'nrth-labs', label: 'Frame the evidence question with NRTH Labs', text: 'Labs offers a perspective on defining a focused question and keeping observations within their limits.' },
      },
      {
        id: 'evidence-comparison', label: 'Comparable evidence', title: 'Compare the documentation on equal terms.',
        summary: 'Several documents may use different definitions, test conditions or versions. Explore how a review makes those differences visible instead of flattening them into a single comparison.',
        inputs: ['The relevant specifications', 'Source and revision information', 'The reviewer’s comparison criteria'],
        flow: [
          { title: 'Preserve the original terms', text: 'Keep a reported property beside its source, units, stated conditions and the document version in which it appears.' },
          { title: 'Identify the comparison limits', text: 'Ask the appropriate reviewer which statements address the same requirement and which need further context or evidence.' },
          { title: 'Return the gaps to their source', text: 'Assign unresolved documentation questions to the partner or specialist able to clarify them.' },
        ],
        decision: 'Which comparison is supported by the available documents, and which needs qualified interpretation or additional evidence?',
        connection: { slug: 'nrth-systems', label: 'Keep evidence traceable with NRTH Systems', text: 'Systems examines document ownership, versions and the information boundaries of a review workflow.' },
      },
      {
        id: 'partner-handoff', label: 'A partner handoff', title: 'Keep the technical context with the inquiry.',
        summary: 'A material discussion can involve application, technical and coordination partners. Explore the information and responsibility needed when the discussion passes between them.',
        inputs: ['The agreed application scope', 'Requested technical documentation', 'The parties and review responsibilities'],
        flow: [
          { title: 'Identify the next responsible party', text: 'Describe the question being handed over and which expertise or source the next participant brings.' },
          { title: 'Carry the relevant evidence', text: 'Keep the application brief, current documents and unanswered questions connected to their respective owners.' },
          { title: 'Agree what remains unconfirmed', text: 'Separate a received inquiry from an accepted technical conclusion or commercial commitment.' },
        ],
        decision: 'What must the next party review or confirm before the material discussion moves further?',
        connection: { slug: 'nrth-logistics', label: 'Explore the coordination with NRTH Logistics', text: 'Logistics considers the acknowledgments and information needed across a sequence of partner responsibilities.' },
      },
    ],
    boundaries: [
      { title: 'Application-specific review', text: 'Material suitability is an assessment for the intended use by appropriate specialists. A conceptual comparison cannot establish that conclusion.' },
      { title: 'Documentation with provenance', text: 'Specifications and relevant safety documentation need their original source and version. Keep missing or unverified information visible to the reviewer.' },
      { title: 'Commercial and handling responsibilities', text: 'Availability, supply terms, handling arrangements and regulatory obligations require confirmation for a defined offering. This showcase does not establish a chemical catalogue or certification.' },
    ],
    questions: [
      { question: 'Why begin with the application rather than a product list?', answer: 'The intended use determines which properties, conditions and evidence matter. A specific application brief lets the responsible specialists frame a meaningful review instead of assuming that a material name alone answers the technical question.' },
      { question: 'How can specifications be compared responsibly?', answer: 'Preserve source documents, versions, stated conditions and units, then identify the question each statement supports. Qualified reviewers determine which evidence is comparable and what additional assessment is required for the specific application.' },
      { question: 'What should remain visible when the brief changes?', answer: 'The revised intended use, the reasons for the change and the evidence collected for the earlier brief. The responsible specialists can then identify which questions, documents and review criteria need reconsideration.' },
      { question: 'What belongs in a first materials inquiry?', answer: 'The industrial application, known constraints, questions to resolve and the technical expertise already involved. A high-level, non-confidential description is sufficient to begin discussing a suitable scope and information-sharing arrangement.' },
    ],
  },
  'nrth-fleet': {
    headline: 'An asset is part of a wider plan.',
    introduction: 'A vehicle’s use connects today’s assignments with handovers, maintenance responsibilities and future demand. NRTH Fleet explores the information that helps those decisions stay connected.',
    feature: {
      eyebrow: 'Vehicles and readiness', title: 'Availability needs context.',
      paragraphs: [
        'An empty space on a schedule is one piece of information. The proposed work also depends on the asset’s recorded condition, existing commitments and the person responsible for confirming its status.',
        'The Fleet direction brings those perspectives together as an operating conversation. It considers what changes across a shift, how maintenance and planning owners coordinate and where unconfirmed information should remain visible instead of becoming a planning assumption.',
      ],
    },
    audiences: [
      { title: 'Fleet managers', text: 'A connected view of assets, assigned work and the ownership of a current status or constraint.' },
      { title: 'Maintenance coordinators', text: 'The relationship between planned maintenance commitments, operational use and the confirmations both teams need.' },
      { title: 'Planning teams', text: 'The resource context behind an assignment, including what is known and what still needs a responsible person’s confirmation.' },
    ],
    contexts: [
      {
        id: 'shift-handover', label: 'A shift handover', title: 'Pass on the current responsibility.',
        summary: 'As an asset passes between people or shifts, the next owner needs the useful context rather than a disconnected status label.',
        inputs: ['The asset and planned next use', 'Open status or maintenance questions', 'The receiving responsible person'],
        flow: [
          { title: 'Describe the recorded state', text: 'Identify the source and time of the status information, the current commitments and any unresolved question attached to the asset.' },
          { title: 'Connect the next responsibility', text: 'Clarify what the receiving person needs to verify and which team owns a question that cannot be settled at handover.' },
          { title: 'Return the relevant update', text: 'Make the confirmed change available to the planning or maintenance owners whose work depends on the asset.' },
        ],
        decision: 'What does the next responsible person need to confirm before the asset is included in the next commitment?',
        connection: { slug: 'nrth-tms', label: 'Connect readiness to NRTH TMS', text: 'The planning perspective identifies the specific assignment that depends on the asset’s confirmed context.' },
      },
      {
        id: 'maintenance-coordination', label: 'Maintenance planning', title: 'Put both commitments in the same conversation.',
        summary: 'Operational use and a maintenance arrangement can compete for the same asset. Explore how the responsible teams understand and revise those commitments together.',
        inputs: ['The planned use of the asset', 'The maintenance arrangement and owner', 'The confirmation needed for any revision'],
        flow: [
          { title: 'Map the competing commitments', text: 'Place the operational assignment and maintenance arrangement beside their times, requirements and responsible owners.' },
          { title: 'Identify the decision boundary', text: 'Clarify which team can revise each commitment and what confirmation is needed before another team relies on the change.' },
          { title: 'Update the dependent plan', text: 'Return the accepted arrangement to the planners and coordinators whose next work is affected.' },
        ],
        decision: 'Who can agree the revised arrangement, and which later assignments need to be reconsidered?',
        connection: { slug: 'nrth-logistics', label: 'Trace later commitments with NRTH Logistics', text: 'A changed resource arrangement can affect receiving appointments and partner handoffs beyond the immediate job.' },
      },
      {
        id: 'capacity-conversation', label: 'Future capacity', title: 'Keep assumptions visible in the outlook.',
        summary: 'A future resource discussion combines known commitments with information that is still provisional. Explore how the outlook keeps those levels of confidence distinct.',
        inputs: ['Known future assignments', 'Recorded resource commitments', 'Unconfirmed availability assumptions'],
        flow: [
          { title: 'Separate confirmed from provisional', text: 'Identify which assignments and resource arrangements are accepted and which remain an assumption in the outlook.' },
          { title: 'Trace shared dependencies', text: 'Make the jobs or periods relying on the same asset or unresolved status visible to the responsible team.' },
          { title: 'Name the next confirmation', text: 'Identify the owner and information needed to turn one planning assumption into a better-supported commitment.' },
        ],
        decision: 'Which uncertainty most affects the proposed resource plan, and who can clarify it?',
        connection: { slug: 'nrth-telematics', label: 'Read asset observations with NRTH Telematics', text: 'Vehicle information can inform context while remaining distinct from a responsible readiness confirmation.' },
      },
    ],
    boundaries: [
      { title: 'Recorded status and responsible confirmation', text: 'Keep an observation or status record separate from a decision about fitness for work. The appropriate owners and procedures establish operating readiness.' },
      { title: 'Shared planning context', text: 'Identify the authoritative commitments and how changes reach both operational and maintenance teams. A copied calendar entry should not become an unverified new arrangement.' },
      { title: 'Purposeful asset information', text: 'Define which asset records and observations support the workflow, their update expectations and who is authorized to use them.' },
    ],
    questions: [
      { question: 'How is resource availability different from readiness?', answer: 'Availability describes one planning condition, such as an open time window. Readiness depends on the intended work, recorded condition and the responsible people and procedures that confirm suitability. A useful workflow keeps those questions connected without treating them as interchangeable.' },
      { question: 'What makes a handover useful to the next team?', answer: 'The current commitment, the source and time of the status information, open questions and the owner of the next confirmation. The receiving team should be able to understand both the recorded state and what still needs attention.' },
      { question: 'Can this direction examine maintenance coordination?', answer: 'It can provide a starting point for discussing the information and responsibilities between maintenance and operational planning. Maintenance work, inspections and operating clearance require their appropriate professionals, procedures and evidence.' },
      { question: 'What belongs in a fleet scoping conversation?', answer: 'The asset types, one representative assignment or handover, the source of current status information and the people confirming changes. Include a typical competing commitment so the discussion reflects the real coordination problem.' },
    ],
  },
  'nrth-events': {
    headline: 'Give the gathering a lasting shape.',
    introduction: 'An experience is built from the purpose of the gathering and the way people move through it. NRTH Events explores the connection between programming, participation and the practical work behind the moment.',
    feature: {
      eyebrow: 'Gatherings and experiences', title: 'Design the space between the moments.',
      paragraphs: [
        'A gathering begins before the first shared session. Invitations, arrival and orientation shape how confidently people take part. Informal conversations and transitions can matter as much as the programmed moments.',
        'The Events direction considers that whole rhythm alongside the production decisions that support it. The audience, access needs and intended exchange guide the format, so the practical details serve a coherent experience rather than an isolated schedule.',
      ],
    },
    audiences: [
      { title: 'Organizations', text: 'A gathering with a clear purpose, a defined audience and a participant journey connected to that intention.' },
      { title: 'Communities and collaborators', text: 'Space for a useful exchange, an unfamiliar idea or a connection that can continue after the event.' },
      { title: 'Production partners', text: 'An understandable relationship between programming, venue, timing and the responsibilities behind each transition.' },
    ],
    contexts: [
      {
        id: 'arrival-orientation', label: 'Arrival', title: 'Make the first moments welcoming.',
        summary: 'Participants arrive with different familiarity and needs. Explore how the information before and at arrival helps people understand the setting and begin taking part.',
        inputs: ['The audience and access needs', 'Arrival and orientation information', 'The participant support route'],
        flow: [
          { title: 'Set the useful expectation', text: 'Explain the purpose, practical arrival details and what participants should expect without overwhelming the invitation.' },
          { title: 'Orient people in the setting', text: 'Connect the first point of contact with the spaces, shared moments and support that people need to find.' },
          { title: 'Create a route into participation', text: 'Shape the first introduction or activity around the audience’s familiarity and the exchange the gathering is meant to enable.' },
        ],
        decision: 'What should a participant understand or feel able to do before the first programmed moment?',
        connection: { slug: 'nrth-systems', label: 'Shape participant information with NRTH Systems', text: 'Systems offers a perspective on understandable information flows and the responsibilities behind support.' },
      },
      {
        id: 'ideas-demonstration', label: 'A shared idea', title: 'Give the demonstration room for conversation.',
        summary: 'A gathering can bring people around an emerging idea. Explore how context, demonstration and discussion support a useful exchange rather than a one-way presentation.',
        inputs: ['The idea and intended exchange', 'Audience familiarity with the subject', 'Demonstration and discussion requirements'],
        flow: [
          { title: 'Give the idea an accessible introduction', text: 'Identify the context people need to understand the question and what the demonstration is meant to show.' },
          { title: 'Shape the shared moment', text: 'Choose how people encounter the demonstration and where time for questions or different interpretations belongs.' },
          { title: 'Carry the conversation onward', text: 'Decide what material, contact route or next invitation helps the exchange continue after the programmed moment.' },
        ],
        decision: 'Which format helps this audience understand the idea and contribute something useful to the conversation?',
        connection: { slug: 'nrth-labs', label: 'Find a question worth sharing in NRTH Labs', text: 'A prototype or study can give the gathering a specific question to discuss, with its limits made understandable.' },
      },
      {
        id: 'format-transitions', label: 'Transitions', title: 'Keep the experience coherent as it changes.',
        summary: 'A change in room, timing or participation format affects several people at once. Explore how the transition preserves the purpose and keeps responsibilities understandable.',
        inputs: ['The planned participant journey', 'Venue and production dependencies', 'The parties owning the transition'],
        flow: [
          { title: 'Trace the affected moments', text: 'Identify where the revised arrangement changes arrival, participation, informal space or the next shared session.' },
          { title: 'Coordinate the practical owners', text: 'Connect programming, venue and production responsibilities around the same change and its access implications.' },
          { title: 'Communicate the participant’s next step', text: 'Give attendees the information they need at the point of transition, using a format they can understand and access.' },
        ],
        decision: 'Which practical change needs coordination so the participant experience still serves the gathering’s purpose?',
        connection: { slug: 'nrth-logistics', label: 'Explore the handoffs with NRTH Logistics', text: 'Logistics brings a perspective on accepted responsibilities and the dependencies between practical commitments.' },
      },
    ],
    boundaries: [
      { title: 'Participant information has a purpose', text: 'Collect and share the details needed for the gathering and support. Invitations, attendance and follow-up need understandable permissions and ownership.' },
      { title: 'Production responsibilities are explicit', text: 'Identify the programming, venue and operational owners. Practical delivery, accessibility provisions and event requirements need agreement for the specific gathering.' },
      { title: 'The purpose guides the format', text: 'A demonstration, conversation or community gathering has different needs. Define the intended exchange before making commitments about a venue, schedule or production approach.' },
    ],
    questions: [
      { question: 'What could make a gathering distinctive?', answer: 'A clear reason for the people in the room to be together, supported by a coherent rhythm of introduction, shared moments and informal exchange. The format should follow that purpose and the audience’s needs rather than begin with a generic schedule.' },
      { question: 'How can research and events connect?', answer: 'A focused question, prototype or study can give participants something concrete to discuss. The experience should explain what the work shows, leave room for different perspectives and make the limits of an emerging idea understandable.' },
      { question: 'What should be considered beyond the program?', answer: 'Invitations, arrival, orientation, access, transitions, support and the material or conversation that remains afterward. These details determine how people encounter the program and whether they can participate with confidence.' },
      { question: 'What is useful in an initial event brief?', answer: 'The purpose, audience, intended exchange, approximate timing and known venue or format constraints. Include relevant access needs and potential partners so the discussion can connect the participant experience with the practical responsibilities behind it.' },
    ],
  },
};

export const ventureDepthRecord = ventureDepth;
