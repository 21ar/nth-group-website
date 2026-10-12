export type VentureFieldArea = {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  details: { title: string; text: string }[];
  questions: string[];
  connection: { slug: string; label: string; text: string };
};

export type VentureArtworkAnnotation = {
  id: string;
  title: string;
  description: string;
};

export type VentureFieldGuide = {
  overview: string;
  areas: VentureFieldArea[];
  annotations: VentureArtworkAnnotation[];
  closing: string;
};

/** Practical discussion guides, rather than a catalogue of confirmed capabilities. */
export const ventureFieldGuides: Record<string, VentureFieldGuide> = {
  'nrth-health': {
    overview: 'Care information has a practical life: someone receives it, interprets it and decides what to do next. Explore the details that make that journey understandable, from an appointment instruction to the team responsible for correcting it.',
    areas: [
      {
        id: 'appointment-navigation', title: 'Finding the next step',
        summary: 'Appointment navigation begins with the information a person needs at a particular moment, rather than every detail an organization holds.',
        whyItMatters: 'A location, time or preparation instruction can be correct individually while leaving someone uncertain about how the pieces fit together.',
        details: [
          { title: 'The appointment essentials', text: 'Identify the date, arrival time, location, entrance and contact route. Distinguish an arrival instruction from the scheduled start of the appointment.' },
          { title: 'Preparation with a source', text: 'Keep approved instructions, their owner and their applicability together. Identify who reviews a changed instruction before it reaches the person attending.' },
          { title: 'A change people can understand', text: 'Describe which detail changed, what remains current and how someone can clarify it. Preserve the route to administrative support when the message is incomplete.' },
        ],
        questions: ['Which detail causes the most preparation questions?', 'Who confirms a change before it is communicated?', 'What happens when the person needs clarification?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'Connect approved instructions to their source, version and responsible owner.' },
      },
      {
        id: 'coordination-record', title: 'Keeping the request together',
        summary: 'A useful coordination record explains the unresolved administrative question and the next responsibility, without collecting unrelated information.',
        whyItMatters: 'Forwarding a message does not establish that another team accepted the request or knows which part still needs attention.',
        details: [
          { title: 'A bounded request', text: 'Name the administrative issue, originating team and expected response. Separate information needed for coordination from information belonging in a clinical record.' },
          { title: 'Acceptance and ownership', text: 'Identify the receiving role and what acknowledgment means. Record whether the request was received, accepted or redirected, using terms both teams understand.' },
          { title: 'An understandable closure', text: 'Describe the resolution, outstanding dependency and communication owner. Establish what the person should hear when the administrative question is answered.' },
        ],
        questions: ['What does the receiving team need to accept?', 'Which information can remain with its original owner?', 'Who communicates the resolution to the person?'],
        connection: { slug: 'nrth-logistics', label: 'NRTH Logistics', text: 'A handoff perspective helps distinguish sending information from accepting responsibility.' },
      },
      {
        id: 'information-access', title: 'Reading in real circumstances',
        summary: 'An information journey needs to account for language, input methods and the conditions in which someone is trying to read.',
        whyItMatters: 'A clear desktop page may become difficult on a small screen, with a screen reader or when unfamiliar language increases the effort.',
        details: [
          { title: 'The reading order', text: 'Place the immediate instruction before supporting detail. Use descriptive headings, meaningful link text and an order that remains coherent without the visual layout.' },
          { title: 'Alternative ways to participate', text: 'Document relevant keyboard, assistive technology and language needs. Identify a practical support route for people who cannot complete the digital task independently.' },
          { title: 'A comprehension check', text: 'Ask people to explain the next step in their own words. Observe where wording, layout or missing context changes their interpretation.' },
        ],
        questions: ['Can someone find the instruction without seeing the layout?', 'Which terms need an explanation in everyday language?', 'What support exists when the digital route fails?'],
        connection: { slug: 'nrth-labs', label: 'NRTH Labs', text: 'A focused task study can examine navigation and comprehension with representative content.' },
      },
      {
        id: 'information-stewardship', title: 'Knowing where the answer comes from',
        summary: 'Health information needs a recognizable source and a practical process for correction, review and retirement.',
        whyItMatters: 'A copied instruction can outlive its original purpose. Its audience needs to know whether it still applies and who can verify it.',
        details: [
          { title: 'A named content owner', text: 'Record who maintains the information, which audience it serves and when it should be reviewed. Make the correction route part of the publishing process.' },
          { title: 'Access suited to the task', text: 'Describe what each role needs to see and change. Review access when responsibilities change rather than relying on an old team membership.' },
          { title: 'A deliberate information lifecycle', text: 'Identify when an instruction expires, what replaces it and which records need to be retained for the agreed purpose. Keep retired content distinguishable from current guidance.' },
        ],
        questions: ['Who is accountable for the current instruction?', 'What triggers a review or withdrawal?', 'Which roles can approve a correction?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'Content ownership, access and change history are system-design questions as well as editorial ones.' },
      },
    ],
    annotations: [
      { id: 'attention-at-the-centre', title: 'Attention at the centre', description: 'The amber core places the person’s practical question at the centre of the information journey.' },
      { id: 'an-understandable-boundary', title: 'An understandable boundary', description: 'The glass shell suggests a careful boundary around information: visible enough to understand, shaped by purpose and access.' },
      { id: 'continuity', title: 'Continuity', description: 'The chrome ribbon represents a journey that stays connected as information passes between people and teams.' },
    ],
    closing: 'A useful first scope can be one appointment journey or one administrative request. Bring an anonymized example, its information owners and the question people currently struggle to answer.',
  },
  'nrth-tms': {
    overview: 'Transportation planning combines a job’s requirements with a resource, a sequence and a commitment. These details help frame the planning conversation before choosing an interface or an automation method.',
    areas: [
      {
        id: 'job-requirements', title: 'Describing the job completely',
        summary: 'A planning brief should distinguish firm requirements from assumptions that still need confirmation.',
        whyItMatters: 'An apparently simple movement can depend on equipment, loading arrangements and a receiving window that are absent from the initial request.',
        details: [
          { title: 'The movement brief', text: 'Describe origin, destination, quantities and required equipment using the operation’s own units. Record any access, loading or handling requirements supplied by responsible parties.' },
          { title: 'Windows and dependencies', text: 'Separate requested timing from confirmed appointments. Identify which stop, partner arrangement or later job depends on each proposed time.' },
          { title: 'Unanswered requirements', text: 'Keep missing details attached to the job with an owner. A planning assumption should remain visible until the appropriate party confirms it.' },
        ],
        questions: ['Which requirement can change the proposed resource?', 'What timing is confirmed rather than requested?', 'Who resolves the missing job details?'],
        connection: { slug: 'nrth-logistics', label: 'NRTH Logistics', text: 'Receiving arrangements and partner requirements supply context that the plan needs to preserve.' },
      },
      {
        id: 'dispatch-package', title: 'Turning a plan into an assignment',
        summary: 'The dispatch handoff carries the current job details and the expectations needed by the person accepting the work.',
        whyItMatters: 'A planner’s accepted arrangement and a dispatch team’s copied instructions can diverge unless the handoff identifies the agreed version.',
        details: [
          { title: 'One identifiable assignment', text: 'Connect the job reference, resource and agreed sequence. Identify the version of the instructions being dispatched and the person responsible for that commitment.' },
          { title: 'Acceptance with meaning', text: 'Agree what acknowledgment establishes: receipt, acceptance or readiness to act. Identify a separate response for an assignment that cannot be accepted as proposed.' },
          { title: 'Changes that reach the work', text: 'Describe how revised timing, stops or instructions reach the responsible people. Preserve the original commitment and the reason the revision was made.' },
        ],
        questions: ['What exactly does acceptance confirm?', 'How does a revision reach everyone acting on it?', 'Which instructions are authoritative during a disagreement?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'The exchange needs explicit states, revision ownership and a recovery route.' },
      },
      {
        id: 'exception-review', title: 'Giving an exception an owner',
        summary: 'An exception is useful when it identifies the affected commitment and the decision needed, rather than simply announcing a changed value.',
        whyItMatters: 'A missed window, an unconfirmed requirement and a vehicle observation raise different questions. Their consequences determine which team should respond.',
        details: [
          { title: 'The affected commitment', text: 'State which appointment, resource or partner arrangement may change. Keep the reported event separate from the proposed planning response.' },
          { title: 'The decision window', text: 'Identify when a response is needed and who has authority to revise the arrangement. Include the downstream people who need the accepted outcome.' },
          { title: 'The resolution record', text: 'Capture the accepted action and its reason. Distinguish an acknowledged alert from a resolved planning question and a revised operational commitment.' },
        ],
        questions: ['Which commitment is actually at risk?', 'Who can authorize the revised plan?', 'How will the operation know the question is resolved?'],
        connection: { slug: 'nrth-telematics', label: 'NRTH Telematics', text: 'Vehicle observations can inform the review when their freshness and operating context are clear.' },
      },
      {
        id: 'planning-history', title: 'Keeping the reasoning behind the plan',
        summary: 'Operational history can explain what changed and why without turning every earlier plan into an equally current record.',
        whyItMatters: 'A later planner needs to distinguish today’s commitment from a useful precedent, especially when recurring work contains an unusual constraint.',
        details: [
          { title: 'The revision thread', text: 'Retain the change, time, responsible role and stated reason. Make the current commitment easy to distinguish from superseded arrangements.' },
          { title: 'Patterns worth examining', text: 'Group repeated questions by the requirement or handoff involved. Review whether a recurring exception points to a missing planning detail or partner agreement.' },
          { title: 'Context for the next shift', text: 'Summarize unresolved decisions, tentative arrangements and the reason for unusual assignments. Include the next owner and the confirmation still needed.' },
        ],
        questions: ['What explains the last accepted revision?', 'Which recurring question deserves a process review?', 'What must the next planner understand first?'],
        connection: { slug: 'nrth-fleet', label: 'NRTH Fleet', text: 'Asset commitments and readiness history provide part of the reasoning behind a resource assignment.' },
      },
    ],
    annotations: [
      { id: 'connected-route', title: 'Connected route', description: 'The silver route represents a sequence of commitments whose meaning comes from the work around each stop.' },
      { id: 'the-waypoints', title: 'The waypoints', description: 'The graphite forms suggest the stops and constraints that need their own requirements and confirmations.' },
      { id: 'the-next-opening', title: 'The next opening', description: 'The orange opening is a metaphor for the next planning decision, where the route meets an accepted arrangement.' },
    ],
    closing: 'Start with a representative job and a revision that was difficult to coordinate. Its requirements, confirmations and planning history make a concrete foundation for the discussion.',
  },
  'nrth-telematics': {
    overview: 'A signal has a source, a timestamp and a meaning that depends on the work around it. Explore the information needed to make vehicle observations interpretable without presenting an inference as a confirmed event.',
    areas: [
      {
        id: 'signal-quality', title: 'Understanding the evidence',
        summary: 'Signal quality begins with knowing what was measured, when it was observed and what the source can establish.',
        whyItMatters: 'A recent delivery of an old observation can appear current unless the experience distinguishes observation time from arrival time.',
        details: [
          { title: 'Time with a definition', text: 'Record observation time and receipt time separately, including the relevant time zone or clock convention. Identify how the source reports delayed observations.' },
          { title: 'A clear measurement', text: 'Keep signal names, units and source definitions available. Distinguish a measured value from a derived estimate or a state inferred elsewhere.' },
          { title: 'Visible coverage limits', text: 'Describe expected update intervals and known gaps. Make it clear when a missing observation limits the question the team is trying to answer.' },
        ],
        questions: ['When was the value observed rather than received?', 'What does the source actually measure?', 'Which gap changes the operational interpretation?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'A source contract can preserve timestamps, definitions and the meaning of missing data.' },
      },
      {
        id: 'activity-interpretation', title: 'Reading activity carefully',
        summary: 'Recorded movement and pauses need definitions that remain understandable when observations are incomplete.',
        whyItMatters: 'A pattern in the data can raise a useful question without establishing the vehicle’s purpose, condition or reason for stopping.',
        details: [
          { title: 'A defined activity interval', text: 'Describe the observations included, the interval covered and any thresholds used to group activity. Keep the underlying evidence available for review.' },
          { title: 'Known and inferred states', text: 'Use language that distinguishes observed movement from inferred departure or arrival. Identify the confirmation required before treating an inference as an operational event.' },
          { title: 'Context for a pause', text: 'Compare the interval with known stops and the assigned sequence. Keep an unexplained pause as a question for the responsible team.' },
        ],
        questions: ['Which observations support the activity description?', 'What interpretation still needs confirmation?', 'Could a coverage gap explain the apparent pause?'],
        connection: { slug: 'nrth-fleet', label: 'NRTH Fleet', text: 'Asset identity and current responsibilities help teams interpret the recorded activity.' },
      },
      {
        id: 'job-relationship', title: 'Connecting the signal to work',
        summary: 'An observation becomes operationally useful when the team can connect it to the correct asset, assignment and commitment.',
        whyItMatters: 'A vehicle may have several planned or historical jobs. A position alone does not establish which one the team should discuss.',
        details: [
          { title: 'The assignment relationship', text: 'Identify the asset reference and the job relationship valid at the observation time. Explain how reassignment or a changed reference is recorded.' },
          { title: 'The question being checked', text: 'Name the commitment the observation might help explain: a departure, an expected stop or an upcoming handoff. Avoid collecting signals without a defined question.' },
          { title: 'A route to confirmation', text: 'Identify who can clarify the assignment and what evidence the receiving party accepts. Keep the planning response separate from the observation itself.' },
        ],
        questions: ['Which assignment was relevant at that time?', 'What commitment is the team checking?', 'Who confirms the meaning of the observation?'],
        connection: { slug: 'nrth-tms', label: 'NRTH TMS', text: 'The agreed transportation plan supplies the commitment an observation can help explain.' },
      },
      {
        id: 'signal-exchange', title: 'Designing a useful data exchange',
        summary: 'An exchange needs practical rules for identity, update order and access as well as a technical path for the information.',
        whyItMatters: 'Delayed, repeated or corrected observations can change how a receiving workflow understands its history and its current view.',
        details: [
          { title: 'Identity across sources', text: 'Map the provider’s device and asset references to the receiving workflow. Identify how device replacement or an ownership change affects that relationship.' },
          { title: 'Updates and corrections', text: 'Define duplicate handling, late arrival and correction behavior. Preserve the observation’s original time when a receiving system rebuilds a timeline.' },
          { title: 'Purpose and access', text: 'Specify who needs the observations, for which task and for how long. Establish responsibility for changing access and removing a source from the exchange.' },
        ],
        questions: ['How are repeated or corrected observations recognized?', 'What happens when the source identity changes?', 'Which roles need which part of the history?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'Exchange semantics and recovery behavior belong in the design before a feed is connected.' },
      },
    ],
    annotations: [
      { id: 'the-observation', title: 'The observation', description: 'The sensor lens represents a point of evidence: specific, bounded and connected to its source.' },
      { id: 'surrounding-context', title: 'Surrounding context', description: 'The outer rings suggest the job, timing and responsibilities needed to interpret a signal.' },
      { id: 'related-evidence', title: 'Related evidence', description: 'The small orbiting forms represent additional observations whose relevance depends on the operational question.' },
    ],
    closing: 'A useful telematics discussion starts with one operational question, a non-sensitive sample of the available observations and the definitions supplied by the data source.',
  },
  'nrth-logistics': {
    overview: 'Logistics joins people and organizations around a shared movement. These areas examine the practical agreement behind a handoff: its requirements, documents, acceptance and response when an arrangement changes.',
    areas: [
      {
        id: 'receiving-agreement', title: 'Agreeing the receiving conditions',
        summary: 'A handoff needs a shared understanding of where it happens, what is expected and who can accept the arrangement.',
        whyItMatters: 'The originating team’s definition of ready may differ from the receiving partner’s definition of acceptable.',
        details: [
          { title: 'The receiving brief', text: 'Record location, contact route, arrival arrangements and partner-supplied requirements. Identify which details must be confirmed before movement is committed.' },
          { title: 'Acceptance criteria', text: 'Ask both parties what evidence establishes an accepted handoff. Distinguish physical arrival, document receipt and confirmation that the receiving responsibility has begun.' },
          { title: 'A changed arrangement', text: 'Identify which parties must accept a new location, contact or window. Keep the previous arrangement recognizable until the revision is agreed.' },
        ],
        questions: ['What does each side mean by a completed handoff?', 'Which requirement still needs partner confirmation?', 'Who accepts a revised receiving arrangement?'],
        connection: { slug: 'nrth-tms', label: 'NRTH TMS', text: 'An accepted receiving arrangement becomes a constraint the transportation plan can use.' },
      },
      {
        id: 'document-requirements', title: 'Keeping documents purposeful',
        summary: 'Document coordination works best when every requested record has a purpose, a source and a receiving owner.',
        whyItMatters: 'A sent file, a received file and a reviewed file describe different states of the work.',
        details: [
          { title: 'The document register', text: 'List the required record, requesting party and handoff it supports. Identify the source owner and how the team recognizes the current version.' },
          { title: 'Review and acknowledgment', text: 'Describe whether the receiving party confirms receipt, checks completeness or approves a requirement. Make a missing or rejected item specific enough to resolve.' },
          { title: 'A correction thread', text: 'Keep a revised document connected to the request it answers. Identify which recipients need to review the correction and which earlier versions are superseded.' },
        ],
        questions: ['Why does the receiving party need this record?', 'What does its acknowledgment establish?', 'How does a correction reach every relevant recipient?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'Record ownership and acknowledgment states help keep the document thread coherent.' },
      },
      {
        id: 'handoff-status', title: 'Making the transition visible',
        summary: 'The status of a handoff should explain the responsibility already accepted and the confirmation still outstanding.',
        whyItMatters: 'A broad label such as in progress can hide whether the work is waiting for information, a physical transition or a partner response.',
        details: [
          { title: 'States people recognize', text: 'Describe the actual transitions in the operation. Agree which party can establish each state and the evidence supporting that change.' },
          { title: 'The next responsible party', text: 'Keep the next owner and expected action visible. An accepted responsibility should not depend on someone interpreting a long message history.' },
          { title: 'An outstanding dependency', text: 'Name what is missing, who can provide it and which commitment depends on it. Separate that dependency from a general comment about progress.' },
        ],
        questions: ['What transition has actually been confirmed?', 'Who owns the next action?', 'Which dependency prevents the handoff from progressing?'],
        connection: { slug: 'nrth-telematics', label: 'NRTH Telematics', text: 'Vehicle observations can add context while partner acceptance remains its own source of evidence.' },
      },
      {
        id: 'coordination-recovery', title: 'Responding across the chain',
        summary: 'When one arrangement changes, the coordination task is to identify the dependent commitments and obtain the necessary new agreements.',
        whyItMatters: 'Resolving the immediate issue can leave a later partner acting on an earlier assumption.',
        details: [
          { title: 'The consequence map', text: 'Trace the changed requirement through receiving arrangements, planned resources and later handoffs. Identify which dependencies are confirmed and which are only expected.' },
          { title: 'A revision with an owner', text: 'Name the party coordinating the response and the people authorized to accept each change. Record outstanding responses separately from the proposed resolution.' },
          { title: 'The restored agreement', text: 'Confirm what each party now relies on. Preserve the reason for the change and the communication that closes the original coordination question.' },
        ],
        questions: ['Which later commitment relies on the old arrangement?', 'Who coordinates acceptance of the revision?', 'What confirms that the chain is aligned again?'],
        connection: { slug: 'nrth-fleet', label: 'NRTH Fleet', text: 'A revised handoff can affect asset commitments and the resources available for later work.' },
      },
    ],
    annotations: [
      { id: 'a-connected-path', title: 'A connected path', description: 'The chrome path represents a movement that depends on a sequence of accepted commitments.' },
      { id: 'supported-transitions', title: 'Supported transitions', description: 'The graphite bridge join suggests the agreements and information that allow a handoff to hold together.' },
      { id: 'the-space-between', title: 'The space between', description: 'The orange passage draws attention to the transition itself, where ownership and acceptance need to be clear.' },
    ],
    closing: 'Choose one handoff with several participants. Its receiving conditions, document requirements and acknowledgment process provide enough detail to start mapping a better connection.',
  },
  'nrth-systems': {
    overview: 'A system becomes understandable through its rules: who owns a record, what an action means and how work recovers from a difficult case. These areas make those rules concrete before extending the technical scope.',
    areas: [
      {
        id: 'record-responsibility', title: 'Giving information a home',
        summary: 'Record responsibility identifies which source is authoritative for a particular field and which roles may change it.',
        whyItMatters: 'Two tools can contain a record without sharing the same responsibility for its contents or its lifecycle.',
        details: [
          { title: 'A field ownership map', text: 'Name the record, identifiers and fields in the exchange. Assign an authoritative source for each part rather than treating an entire copied record as equally authoritative.' },
          { title: 'A lifecycle people understand', text: 'Describe how a record is created, corrected, archived and referenced elsewhere. Identify which transitions affect related workflows and which remain local.' },
          { title: 'A disagreement route', text: 'Establish how conflicting values are recognized and who resolves them. Keep the disputed information and its sources available to the responsible reviewer.' },
        ],
        questions: ['Which source owns each decision-relevant field?', 'Who can correct the authoritative record?', 'What happens when the copies disagree?'],
        connection: { slug: 'nrth-health', label: 'NRTH Health', text: 'Approved information and administrative requests offer concrete examples of source ownership.' },
      },
      {
        id: 'task-and-permission', title: 'Matching access to the task',
        summary: 'Permissions are most useful when they follow the actual responsibility someone needs to carry out.',
        whyItMatters: 'A broad role label can conceal different rights to read information, change a record or approve a commitment.',
        details: [
          { title: 'The action inventory', text: 'List the decisions and actions a role performs. Separate viewing, editing and approval, including the specific records and conditions involved.' },
          { title: 'A change of responsibility', text: 'Describe how access follows team transfers, temporary assignments and departures. Identify who approves the change and which outstanding tasks need another owner.' },
          { title: 'An explainable restriction', text: 'Make restricted actions understandable to the user. Provide a practical route to the responsible role without exposing information outside the permitted task.' },
        ],
        questions: ['Which action requires approval rather than editing rights?', 'What access should change when responsibility moves?', 'Who can resolve an appropriate access request?'],
        connection: { slug: 'nrth-fleet', label: 'NRTH Fleet', text: 'Asset handovers expose the difference between viewing a status and confirming a responsibility.' },
      },
      {
        id: 'exchange-contract', title: 'Making a connection explicit',
        summary: 'An exchange contract defines the information being sent and the response the receiving workflow can reasonably rely on.',
        whyItMatters: 'A successful technical request may establish receipt without establishing that the business task has been accepted.',
        details: [
          { title: 'A representative message', text: 'Describe required fields, identifiers, units and version expectations. Include a sample with fictional values that both sending and receiving owners can interpret.' },
          { title: 'Acknowledgment semantics', text: 'Agree what sent, received, validated and accepted mean. Identify the state that permits the next action and the evidence needed to establish it.' },
          { title: 'A changed contract', text: 'Plan how a new field, definition or version reaches existing consumers. Identify the owner of compatibility decisions and the conditions for retiring an older exchange.' },
        ],
        questions: ['What does the receiving acknowledgment actually promise?', 'Which message version can each side interpret?', 'Who owns a change to the exchange?'],
        connection: { slug: 'nrth-telematics', label: 'NRTH Telematics', text: 'Signal definitions and update behavior make exchange semantics especially important.' },
      },
      {
        id: 'operating-recovery', title: 'Leaving a practical recovery route',
        summary: 'Operational design includes the information and authority needed when an exchange fails or its outcome is uncertain.',
        whyItMatters: 'Repeating an action without knowing its earlier outcome can create a second problem instead of resolving the first.',
        details: [
          { title: 'A recognizable failure', text: 'Distinguish rejection, timeout, missing acknowledgment and conflicting state. Preserve the request identity and relevant timing so the operation can investigate the right event.' },
          { title: 'Safe next actions', text: 'Define which operations can be repeated and which require verification. Identify the responsible person when the workflow cannot establish the current state.' },
          { title: 'An operating record', text: 'Describe what the team needs to diagnose and explain the event. Include the resolution and any rule change that affects future recovery.' },
        ],
        questions: ['What is known about the first action’s outcome?', 'Which recovery step is safe to repeat?', 'Who owns the unresolved state?'],
        connection: { slug: 'nrth-labs', label: 'NRTH Labs', text: 'A bounded prototype can examine difficult cases before the exchange becomes operational.' },
      },
    ],
    annotations: [
      { id: 'distinct-responsibilities', title: 'Distinct responsibilities', description: 'The graphite and silver modules suggest separate tools and roles, each with its own information responsibilities.' },
      { id: 'explicit-connections', title: 'Explicit connections', description: 'The amber seams bring attention to the exchanges between those parts and the rules that give each exchange meaning.' },
      { id: 'a-shared-structure', title: 'A shared structure', description: 'The arch span represents a coherent workflow supported by parts whose individual boundaries remain understandable.' },
    ],
    closing: 'A workflow sketch, a representative record and one awkward case can define a useful starting scope. The goal is to understand the boundary before deciding how much technology it needs.',
  },
  'nrth-labs': {
    overview: 'A focused investigation starts with a decision and ends with a record someone else can understand. Explore the practical ingredients of a study, from the first assumption to the reason for a next step.',
    areas: [
      {
        id: 'question-framing', title: 'Choosing an answerable question',
        summary: 'A research question should identify the uncertainty and the decision that would change if it were better understood.',
        whyItMatters: 'A broad ambition can contain several different uncertainties that need different methods and expertise.',
        details: [
          { title: 'The decision brief', text: 'State the choice facing the team, its current assumption and the consequence of being wrong. Identify which part is open to investigation now.' },
          { title: 'An observable question', text: 'Describe what can be seen, measured or reviewed. Separate a question about behavior from one about preference, feasibility or performance.' },
          { title: 'A useful stopping point', text: 'Agree what observation would justify continuing, revising or stopping. Include a possible inconclusive result so uncertainty is not mistaken for failure.' },
        ],
        questions: ['Which decision is the study intended to inform?', 'What observation could challenge the starting assumption?', 'What would make this investigation sufficient for now?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'A specific information boundary can turn a broad technical ambition into an answerable question.' },
      },
      {
        id: 'study-design', title: 'Designing the investigation',
        summary: 'A study needs a method suited to the question and conditions that keep the resulting observation interpretable.',
        whyItMatters: 'Changing the task, participant context and prototype at once can make it difficult to explain what produced the result.',
        details: [
          { title: 'A representative task', text: 'Choose the activity, input or sample that exposes the uncertainty. Document why it represents the intended context and where it differs.' },
          { title: 'The study conditions', text: 'Record the setup, instructions and relevant constraints. Identify the participant arrangements or specialist expertise needed before the work begins.' },
          { title: 'What will be recorded', text: 'Define the observations and their capture method in advance. Keep a practical place for unexpected behavior and evidence that contradicts the original idea.' },
        ],
        questions: ['Does the method examine the actual uncertainty?', 'Which condition could change the interpretation?', 'What unexpected evidence should be retained?'],
        connection: { slug: 'nrth-health', label: 'NRTH Health', text: 'Preparation information offers a bounded task for examining navigation and comprehension.' },
      },
      {
        id: 'prototype-scope', title: 'Making only what the question needs',
        summary: 'A prototype can be deliberately narrow while remaining realistic enough to expose the behavior under investigation.',
        whyItMatters: 'Visual polish and breadth can obscure the distinction between a study artifact and something ready for operational use.',
        details: [
          { title: 'The behavior to expose', text: 'Identify the interaction or technical boundary the prototype needs to demonstrate. Keep unrelated features outside the scope unless they affect that behavior.' },
          { title: 'Representative difficult cases', text: 'Include the confusing message, missing input or delayed response that matters to the question. Explain any simulated behavior to the study team.' },
          { title: 'The implementation gap', text: 'Record what the prototype omits, from information handling to operational recovery. Preserve these limits alongside any demonstration of the idea.' },
        ],
        questions: ['Which behavior needs to be realistic?', 'What difficult case could change the result?', 'What remains before an operational implementation?'],
        connection: { slug: 'nrth-events', label: 'NRTH Events', text: 'A focused gathering can provide a setting for explaining and discussing a prototype.' },
      },
      {
        id: 'research-record', title: 'Making the result reusable',
        summary: 'A useful research record keeps the observation, interpretation and next decision connected to the original question.',
        whyItMatters: 'A striking demonstration or a confident summary can lose the conditions that made the finding meaningful.',
        details: [
          { title: 'Observation before explanation', text: 'Describe what happened before stating why it may have happened. Keep examples and source material connected to the interpretation they support.' },
          { title: 'Limits and alternatives', text: 'Identify competing explanations and the conditions not examined. State which conclusion is supported and which remains an assumption for later work.' },
          { title: 'The next decision', text: 'Record the rationale for another study, a revised prototype or stopping. Make the unresolved question specific enough that a later collaborator can pick it up.' },
        ],
        questions: ['What did the study actually observe?', 'Which alternative explanation remains plausible?', 'Why is the proposed next step justified?'],
        connection: { slug: 'nrth-chemicals', label: 'NRTH Chemicals', text: 'Application evidence makes provenance, interpretation and the limits of a conclusion particularly important.' },
      },
    ],
    annotations: [
      { id: 'the-starting-question', title: 'The starting question', description: 'The amber seed represents the specific uncertainty at the centre of an investigation.' },
      { id: 'connected-observations', title: 'Connected observations', description: 'The open silver lattice suggests the relationships and unresolved spaces that give an observation its meaning.' },
      { id: 'a-grounded-investigation', title: 'A grounded investigation', description: 'The stone ground is a visual reminder to connect an unfamiliar possibility to an observable task and a practical decision.' },
    ],
    closing: 'Bring the question, the decision it affects and the evidence already available. A useful study may begin with a small prototype, a task observation or a structured review of existing sources.',
  },
  'nrth-chemicals': {
    overview: 'A material discussion needs a defined application and evidence that can be traced to its source. These areas organize the brief for the specialists responsible for assessing the intended use.',
    areas: [
      {
        id: 'application-conditions', title: 'Describing the operating context',
        summary: 'An application brief explains the role a material would play and the conditions the responsible technical team needs to examine.',
        whyItMatters: 'The same material description can be relevant to very different uses, each with its own requirements and review questions.',
        details: [
          { title: 'The intended role', text: 'Describe what the application requires the material to do and where it sits in the process. Use the application owner’s terminology and stated requirements.' },
          { title: 'The relevant conditions', text: 'Record known temperatures, contact conditions, process stages or exposure questions supplied by the technical team. Identify the conditions still awaiting clarification.' },
          { title: 'The assessment boundary', text: 'Name the intended application and responsible reviewers. Keep proposed uses outside that scope distinguishable until the appropriate specialists consider them.' },
        ],
        questions: ['What role must the material perform?', 'Which operating condition shapes the review?', 'Who is responsible for assessing the intended use?'],
        connection: { slug: 'nrth-labs', label: 'NRTH Labs', text: 'A defined application can reveal the specific evidence question worth investigating.' },
      },
      {
        id: 'specification-reading', title: 'Keeping a property in context',
        summary: 'A reported property needs its units, method and stated conditions to remain meaningful during comparison.',
        whyItMatters: 'Similar-looking values may describe different measurement methods, samples or operating conditions.',
        details: [
          { title: 'The original statement', text: 'Keep the property name, value, units and qualification with its source document. Avoid turning a range or conditional statement into an unqualified number.' },
          { title: 'Method and conditions', text: 'Record the stated test method and conditions where available. Identify omissions for the qualified reviewer rather than assuming that two values are directly comparable.' },
          { title: 'The review question', text: 'Connect each requested property to an application requirement. Ask the responsible specialist what additional evidence is needed before drawing a conclusion.' },
        ],
        questions: ['Are the reported values expressed on the same basis?', 'Which method or condition needs clarification?', 'What does this property establish for the intended use?'],
        connection: { slug: 'nrth-labs', label: 'NRTH Labs', text: 'Evidence review can separate an available statement from the conclusion it is being asked to support.' },
      },
      {
        id: 'documentation-provenance', title: 'Tracing the documentation',
        summary: 'A review needs identifiable sources and current revisions, including the relevant safety information requested by responsible specialists.',
        whyItMatters: 'An unattributed copy can leave reviewers unable to establish which application, source or version a statement belongs to.',
        details: [
          { title: 'The source register', text: 'Record issuer, document title, revision and the material reference used by the source. Identify which documents the reviewers require and which are still missing.' },
          { title: 'Current and superseded versions', text: 'Keep new documents linked to the earlier review. Ask the responsible technical team which changed statements need reconsideration for the agreed application.' },
          { title: 'Questions returned to the source', text: 'Assign unclear, missing or inconsistent documentation to the party able to resolve it. Preserve the response and its relation to the review question.' },
        ],
        questions: ['Can each statement be traced to its issuer?', 'Which revision is the team reviewing?', 'Who can clarify an incomplete document?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'Document identifiers, revisions and review responsibility can form a coherent information workflow.' },
      },
      {
        id: 'material-partner-brief', title: 'Preparing the partner conversation',
        summary: 'A partner brief keeps technical questions distinct from potential commercial and coordination arrangements.',
        whyItMatters: 'An exploratory inquiry does not establish suitability, availability or an accepted supply commitment.',
        details: [
          { title: 'The technical inquiry', text: 'Carry the defined application, requested evidence and responsible reviewers into the conversation. Make unresolved assessment questions clear to each participant.' },
          { title: 'The coordination questions', text: 'Identify the information needed for a possible next stage, including document ownership and relevant partner responsibilities. Commercial terms require their own confirmation.' },
          { title: 'A deliberate next step', text: 'Record what has been received, what remains under review and what the parties have actually agreed. Keep technical conclusions with the specialists responsible for them.' },
        ],
        questions: ['What expertise does the next partner need to provide?', 'Which commitment remains unconfirmed?', 'What must be reviewed before the discussion progresses?'],
        connection: { slug: 'nrth-logistics', label: 'NRTH Logistics', text: 'A partner handoff needs clear information requirements and an agreed acknowledgment.' },
      },
    ],
    annotations: [
      { id: 'different-perspectives', title: 'Different perspectives', description: 'The crystalline facets suggest the different properties and conditions a specialist may need to examine.' },
      { id: 'the-material-question', title: 'The material question', description: 'The amber droplet draws attention to the substance at the centre of an industrial application discussion.' },
      { id: 'application-and-evidence', title: 'Application and evidence', description: 'The connecting neck represents the relationship between a material question and its application; the image does not establish a material property.' },
    ],
    closing: 'Start with a high-level application brief and the technical questions it raises. Relevant source documents and the expertise already involved help define a focused next conversation.',
  },
  'nrth-fleet': {
    overview: 'Fleet work connects an asset’s identity with its commitments and the people responsible for confirming its status. Explore the practical records behind availability, handovers and planning beyond the next assignment.',
    areas: [
      {
        id: 'asset-identity', title: 'Knowing which asset is being discussed',
        summary: 'A shared asset reference keeps schedules, observations and maintenance conversations attached to the same vehicle or equipment.',
        whyItMatters: 'A nickname, registration reference and device identifier may refer to the same asset without being interchangeable in every system.',
        details: [
          { title: 'The asset record', text: 'Identify the asset reference, relevant resource attributes and the source that maintains them. Preserve distinctions between a vehicle, attached equipment and a tracking device.' },
          { title: 'Changing relationships', text: 'Describe how device replacement, equipment reassignment or a changed identifier is recorded. Keep historical relationships interpretable for the period in which they applied.' },
          { title: 'The responsible owner', text: 'Name the role that maintains the record and resolves discrepancies. Identify how an incorrect attribute reaches that owner for review.' },
        ],
        questions: ['Which reference does the operation rely on?', 'What relationships can change over time?', 'Who corrects an asset-record discrepancy?'],
        connection: { slug: 'nrth-telematics', label: 'NRTH Telematics', text: 'Device observations need an asset relationship that is valid for the observation time.' },
      },
      {
        id: 'readiness-evidence', title: 'Giving availability a basis',
        summary: 'Availability combines a planning window with the current information and responsibility needed to consider a resource for work.',
        whyItMatters: 'An open calendar interval does not itself establish condition, suitability or permission to operate.',
        details: [
          { title: 'The recorded status', text: 'Identify what the current status means, who supplied it and when it was confirmed. Keep an unresolved condition distinguishable from an accepted planning state.' },
          { title: 'The proposed assignment', text: 'Read the asset information beside the job’s required attributes and existing reservations. Identify which fit questions need the appropriate responsible person.' },
          { title: 'The confirmation route', text: 'Describe the team’s process for confirming readiness and suitability. Preserve the required human responsibilities rather than treating a display label as clearance.' },
        ],
        questions: ['What evidence supports the recorded status?', 'Which job requirement needs separate confirmation?', 'Who is responsible for the readiness decision?'],
        connection: { slug: 'nrth-tms', label: 'NRTH TMS', text: 'The transportation job defines the requirements against which a proposed resource is considered.' },
      },
      {
        id: 'asset-handover', title: 'Passing responsibility deliberately',
        summary: 'An asset handover should keep the current commitments, unresolved questions and next responsibility understandable.',
        whyItMatters: 'A shift change can separate the person accepting responsibility from the context that explains the asset’s recorded state.',
        details: [
          { title: 'The outgoing context', text: 'Summarize assigned work, reported issues and outstanding confirmations. Keep the source of each status visible rather than compressing different questions into one note.' },
          { title: 'An accepted responsibility', text: 'Identify who receives the handover and what they acknowledge. Distinguish possession, coordination responsibility and authority to confirm a particular status.' },
          { title: 'The unresolved thread', text: 'Assign an owner and next action to each open question. Make its effect on planned work clear to the incoming team.' },
        ],
        questions: ['Which responsibility is changing hands?', 'What does the incoming acknowledgment establish?', 'Which open question affects the next assignment?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'Role-specific states and permissions can reflect the actual meaning of an asset handover.' },
      },
      {
        id: 'future-commitments', title: 'Joining today to the next planning window',
        summary: 'Future capacity depends on the assumptions behind existing assignments, reservations and maintenance arrangements.',
        whyItMatters: 'A changed commitment can affect several later jobs even when the immediate resource question appears resolved.',
        details: [
          { title: 'The commitment calendar', text: 'Distinguish confirmed assignments, tentative holds and arrangements maintained by another responsible team. Identify which dates or durations still depend on an assumption.' },
          { title: 'Maintenance coordination', text: 'Make planned work and operational commitments visible to the relevant owners. Changes to maintenance arrangements remain decisions for the responsible people and procedures.' },
          { title: 'A revised capacity picture', text: 'Trace a changed asset commitment to later planning windows. Record which assignments need reconsideration and which planning owner accepts the revision.' },
        ],
        questions: ['Which future commitment rests on an unconfirmed date?', 'Who coordinates a competing reservation?', 'What later work needs review when the plan changes?'],
        connection: { slug: 'nrth-logistics', label: 'NRTH Logistics', text: 'Partner arrangements can create dependencies that extend beyond one asset’s immediate assignment.' },
      },
    ],
    annotations: [
      { id: 'individual-assets', title: 'Individual assets', description: 'The repeated capsules suggest distinct resources, each with its own identity and operating context.' },
      { id: 'a-visible-boundary', title: 'A visible boundary', description: 'The front orange seam draws attention to the handover, where a recorded status needs a clear source and responsibility.' },
      { id: 'a-shared-operation', title: 'A shared operation', description: 'The graphite platform represents the wider planning structure that connects individual assets and their commitments.' },
    ],
    closing: 'Bring a typical asset record and a planning conflict that needed several people to resolve. Its status sources, reservations and handover process reveal the useful starting scope.',
  },
  'nrth-events': {
    overview: 'An event is designed through the details people encounter before, during and after they gather. These areas connect the purpose of the occasion to participation, production and the exchange it should leave behind.',
    areas: [
      {
        id: 'participation-brief', title: 'Knowing who the gathering is for',
        summary: 'An audience brief explains what people bring to the occasion and what they need in order to participate confidently.',
        whyItMatters: 'A shared topic does not mean attendees arrive with the same background, expectations or access needs.',
        details: [
          { title: 'The participant perspective', text: 'Describe the intended audience, familiarity with the subject and reasons to attend. Identify which information should be understood before the gathering begins.' },
          { title: 'The invitation promise', text: 'State the exchange or experience the occasion is intended to support. Keep the invitation aligned with the format, time and practical arrangements being proposed.' },
          { title: 'Participation needs', text: 'Consider access, language, format and ways to contribute. Establish a clear contact route for questions the published information does not answer.' },
        ],
        questions: ['What do participants need to know before arriving?', 'What does the invitation lead them to expect?', 'Which participation need changes the proposed format?'],
        connection: { slug: 'nrth-labs', label: 'NRTH Labs', text: 'A specific research question can give a gathering a useful shared focus.' },
      },
      {
        id: 'experience-rhythm', title: 'Shaping the time together',
        summary: 'The rhythm of an event includes arrivals, shared sessions, informal exchanges and the transitions between them.',
        whyItMatters: 'A schedule can fit on a page while leaving too little time for people to understand, move or speak to each other.',
        details: [
          { title: 'The arrival experience', text: 'Describe how participants find the gathering, understand the space and join the first shared activity. Identify the information and support needed at that transition.' },
          { title: 'The programme arc', text: 'Connect introductions, demonstrations and discussion to the intended exchange. Leave deliberate time for reflection or conversation where the purpose calls for it.' },
          { title: 'Changes of pace', text: 'Consider travel between spaces, setup needs and different levels of participation. Make transitions part of the programme rather than spare minutes around it.' },
        ],
        questions: ['Where does the group need more context?', 'Which transition needs time or support?', 'What part of the occasion creates room for exchange?'],
        connection: { slug: 'nrth-health', label: 'NRTH Health', text: 'An information-access perspective helps examine clear instructions and understandable participation routes.' },
      },
      {
        id: 'production-coordination', title: 'Connecting the programme to production',
        summary: 'Production coordination identifies the practical dependencies and responsible people behind each shared moment.',
        whyItMatters: 'A change to the programme can affect the venue, contributors, technical arrangements and the information participants receive.',
        details: [
          { title: 'The working programme', text: 'Keep session timing, contributors, space requirements and responsible contacts together. Distinguish an agreed arrangement from an option still awaiting confirmation.' },
          { title: 'Dependency and readiness', text: 'Identify what each activity needs from the preceding one, including setup and transitions. Assign the practical confirmation to the person responsible for that part.' },
          { title: 'A coordinated revision', text: 'Trace a programme change to the teams and participants affected. Keep the current arrangement recognizable and identify who communicates the accepted update.' },
        ],
        questions: ['Which arrangement still needs confirmation?', 'Who owns the transition into this activity?', 'Who needs to hear about an accepted programme change?'],
        connection: { slug: 'nrth-logistics', label: 'NRTH Logistics', text: 'A handoff approach makes production dependencies and partner acknowledgments explicit.' },
      },
      {
        id: 'continuing-the-exchange', title: 'Leaving a useful thread afterward',
        summary: 'The end of a gathering can open a next conversation when its materials, permissions and follow-up responsibilities are clear.',
        whyItMatters: 'A useful exchange can lose its momentum if participants do not know where the promised material or next question belongs.',
        details: [
          { title: 'Agreed materials', text: 'Identify what may be shared after the occasion and who owns it. Establish contributor permission before publishing recordings, slides or participant contributions.' },
          { title: 'A practical next step', text: 'Describe the contact route, proposed follow-up or question left open. Keep the next action specific to the gathering’s purpose and agreed responsibilities.' },
          { title: 'Learning from the experience', text: 'Collect observations relevant to participation and the intended exchange. Review confusing transitions or missing information alongside comments about the overall occasion.' },
        ],
        questions: ['What material have participants been promised?', 'Who owns the follow-up conversation?', 'What should the next gathering learn from this one?'],
        connection: { slug: 'nrth-systems', label: 'NRTH Systems', text: 'Permissions, published materials and follow-up ownership benefit from a deliberate information workflow.' },
      },
    ],
    annotations: [
      { id: 'a-shared-stage', title: 'A shared stage', description: 'The circular stage suggests a shared focus: the people, ideas and purpose around which an occasion gathers.' },
      { id: 'rhythm-and-transition', title: 'Rhythm and transition', description: 'The continuous ribbon is a metaphor for the shifts between arrival, attention, conversation and reflection.' },
      { id: 'room-for-exchange', title: 'Room for exchange', description: 'The orange-lit space represents the attention and participation the programme should make room for.' },
    ],
    closing: 'Start with the audience, the intended exchange and the practical constraints already known. Those details can shape a programme whose production choices support the experience.',
  },
};
