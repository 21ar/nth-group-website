export type ExperimentMethodId = 'conversation' | 'interface-prototype' | 'process-map' | 'document-review';
export type ExperimentFieldId = 'mobility' | 'health' | 'systems' | 'materials' | 'events' | 'research';
export type ExperimentMethod = {
 id: ExperimentMethodId; name: string; purpose: string; preparation: string; activity: string; limit: string;
};
export type ExperimentField = {
 id: ExperimentFieldId; name: string; context: string; starters: string[];
 inputs: Record<ExperimentMethodId, string[]>;
 observations: Record<ExperimentMethodId, string[]>;
 decisions: Record<ExperimentMethodId, string>;
};
export const experimentMethods: ExperimentMethod[] = [
 {
  id: 'conversation', name: 'Conversation',
  purpose: 'Understand how someone experiences the situation before proposing a change.',
  preparation: 'Invite a willing participant with relevant experience. Agree on the purpose and what, if anything, may be recorded. Use a recent example rather than hypothetical preferences.',
  activity: 'Ask them to walk through the example in their own words. Follow up on the moments they paused, improvised or needed help. Keep observed facts separate from your interpretation.',
  limit: 'One account can reveal a perspective. It cannot establish how common the experience is, prove that a proposed solution works or represent people who were not involved.',
 },
 {
  id: 'interface-prototype', name: 'Interface prototype',
  purpose: 'Find out whether a small information or interface idea is understandable in a specific task.',
  preparation: 'Create a low fidelity screen or paper sketch with invented, non-sensitive information. Write one realistic task and decide what successful understanding would look like before showing the sketch.',
  activity: 'Let a willing participant attempt the task without a tour. Ask what they expect to happen next. Note their first interpretation and the points where they need an explanation.',
  limit: 'A sketch can expose misunderstandings. It cannot establish production reliability, integration readiness, accessibility across all users, clinical benefit or safe operation.',
 },
 {
  id: 'process-map', name: 'Process mapping',
  purpose: 'Make a handoff and its dependencies visible before changing the workflow.',
  preparation: 'Choose one bounded example. Use a synthetic case or information you are permitted to discuss. Mark where the process begins, where it ends and whose perspective is represented.',
  activity: 'Place the steps in order, then add the owner, information needed and next decision at each handoff. Mark missing information and exceptions without filling them in by assumption.',
  limit: 'A map describes an example and a perspective. It does not verify every operation, measure savings or show that changing a step will cause a better outcome.',
 },
 {
  id: 'document-review', name: 'Document review',
  purpose: 'Check what existing material answers, contradicts or leaves uncertain.',
  preparation: 'Choose a small set of public, approved or synthetic documents. Record their source, date, audience and intended use. Define the question before collecting more material.',
  activity: 'Read for claims and definitions that relate to the question. Keep a short evidence table: the statement, its source, what it supports and what remains unknown.',
  limit: 'A document review can identify evidence gaps. It cannot independently verify every statement, certify compliance, validate technical performance or replace a qualified assessment.',
 },
];
export const experimentFields: ExperimentField[] = [
 {
  id: 'mobility', name: 'Mobility', context: 'Planning, vehicle signals and the handoffs that move a job forward.',
  starters: ['Where does a change to a transportation plan lose its context?', 'What would make an older vehicle signal easier to recognize?', 'What does the next team need to accept a handoff?'],
  inputs: {
   conversation: ['A recent, permitted example of a plan changing after assignment.', 'A planner or operations perspective, with the decisions and constraints they can describe.'],
   'interface-prototype': ['An invented job, one changed constraint and a clearly marked signal timestamp.', 'A sketch of the information a coordinator sees before deciding who needs an update.'],
   'process-map': ['One synthetic job from planning through an acknowledged handoff.', 'The teams involved, the update they receive and the decision each update supports.'],
   'document-review': ['A small set of approved handoff templates, field definitions or operating notes.', 'The meaning of a job status, its source and any freshness expectations already documented.'],
  },
  observations: {
   conversation: ['Which facts the person reconstructs or asks another team to repeat.', 'Where their account separates the original plan from the current situation.'],
   'interface-prototype': ['Whether the participant distinguishes a current signal from an older one.', 'Which information they use to choose the next person to inform, and where they hesitate.'],
   'process-map': ['The points where ownership changes without a shared acknowledgement.', 'Updates that arrive after the decision they were intended to support.'],
   'document-review': ['Status names that have different meanings in different sources.', 'Missing definitions for ownership, update timing or unresolved exceptions.'],
  },
  decisions: {
   conversation: 'Choose one recurring ambiguity to examine with another perspective before designing a change.',
   'interface-prototype': 'Revise the smallest unclear information element, then repeat the same task with the revised sketch.',
   'process-map': 'Select one uncertain handoff for a focused discussion with the people on both sides.',
   'document-review': 'Agree which definition needs clarification and who can confirm its operational meaning.',
  },
 },
 {
  id: 'health', name: 'Health', context: 'The clarity of information and coordination around everyday care experiences.',
  starters: ['What makes an information handoff hard to understand?', 'Can a person distinguish an action from information for reference?', 'Where does a care coordination explanation ask people to guess?'],
  inputs: {
   conversation: ['An invented or permitted non-clinical example of receiving an instruction or update.', 'A willing participant speaking about information clarity, without collecting health records.'],
   'interface-prototype': ['Synthetic administrative content: an appointment time, a contact and a next step.', 'A sketch that separates an action someone needs to take from information for reference.'],
   'process-map': ['A fictional administrative handoff such as an appointment update.', 'The information owner, recipient, acknowledgement and points requiring a human explanation.'],
   'document-review': ['Public or approved administrative instructions and explanations of information handling.', 'The audience, expected next step and any stated access or accessibility assumptions.'],
  },
  observations: {
   conversation: ['Words the participant needs explained before they can describe the next step.', 'The moment they seek a human contact or a second source of information.'],
   'interface-prototype': ['Whether the participant can explain the next administrative step in their own words.', 'Whether a reference item is mistaken for an action or an instruction appears more certain than intended.'],
   'process-map': ['Where an update changes hands without confirming that it has been understood.', 'Which steps rely on access, language or information that the example has not established.'],
   'document-review': ['Instructions that use undefined language or omit who to contact.', 'Assumptions about access, responsibility or consent that need a qualified review.'],
  },
  decisions: {
   conversation: 'Narrow the information question and seek another relevant perspective. Keep clinical decisions outside this exercise.',
   'interface-prototype': 'Revise the administrative wording or hierarchy. Any clinical use would need its own evidence and appropriate review.',
   'process-map': 'Choose one explanation or acknowledgement to clarify with the relevant team; do not change a care process from this map alone.',
   'document-review': 'Separate a wording improvement from questions that need privacy, accessibility or clinical expertise.',
  },
 },
 {
  id: 'systems', name: 'Systems', context: 'Software, information and the connections that make work coherent.',
  starters: ['Where do two teams use the same word for different things?', 'What does someone need to trust a status update?', 'Which dependency stays invisible until a task is blocked?'],
  inputs: {
   conversation: ['A recent permitted example of a task crossing a team or tool boundary.', 'The terms the participant uses for the same item at the beginning and end of the task.'],
   'interface-prototype': ['Synthetic items with an owner, source and update time.', 'A sketch of a status view that makes an unresolved dependency visible.'],
   'process-map': ['One bounded task across two teams or tools.', 'The inputs, owners and decisions at the points where information changes form.'],
   'document-review': ['Approved interface specifications, data definitions or workflow notes.', 'Versions and owners for the small set of terms or contracts under review.'],
  },
  observations: {
   conversation: ['The workarounds used to translate a term or reconcile two versions.', 'How the participant determines which source or person to trust.'],
   'interface-prototype': ['Whether the participant can distinguish blocked, unknown and complete states.', 'Which source or ownership detail they seek before acting on the status.'],
   'process-map': ['Steps that depend on information no one explicitly owns.', 'Where the same object is renamed, duplicated or passed on without its context.'],
   'document-review': ['Definitions that conflict across versions or teams.', 'A dependency or failure state that is implied rather than described.'],
  },
  decisions: {
   conversation: 'Agree which vocabulary or source-of-truth question to test next with another team.',
   'interface-prototype': 'Refine one status distinction or source cue before investing in a working interface.',
   'process-map': 'Select one boundary to clarify before adding a new integration or automation.',
   'document-review': 'Identify the owner who can resolve a specific contract or definition gap.',
  },
 },
 {
  id: 'materials', name: 'Materials', context: 'The questions and evidence around materials and possible industrial applications.',
  starters: ['What evidence is missing from a material application brief?', 'Do different readers interpret a material requirement the same way?', 'How does a requirement move from an idea into a qualified review?'],
  inputs: {
   conversation: ['A permitted application brief with no proprietary formulation or procedure.', 'A relevant perspective on how requirements and evidence are communicated.'],
   'interface-prototype': ['An invented material information card with source, date and explicitly unknown properties.', 'A sketch that separates a stated requirement from an unverified assumption.'],
   'process-map': ['A fictional application enquiry from initial question to qualified review.', 'The requirement, evidence owner and reviews that must be completed before any physical work.'],
   'document-review': ['Public or approved application descriptions and published reference material.', 'The source, date, intended conditions and stated limits of each claim being considered.'],
  },
  observations: {
   conversation: ['Terms whose meaning changes between the application and evidence perspectives.', 'Questions the participant would send to a qualified specialist before proceeding.'],
   'interface-prototype': ['Whether a reader distinguishes a requirement, a reported property and an unknown.', 'Where layout or wording makes a limited claim appear broader than its source.'],
   'process-map': ['Steps that depend on evidence or specialist review not yet present.', 'Where responsibility for a requirement or its supporting source becomes unclear.'],
   'document-review': ['Claims whose conditions do not match the proposed application.', 'Unknowns that need qualified investigation rather than a more persuasive brief.'],
  },
  decisions: {
   conversation: 'Write one evidence question for a qualified specialist; this outline does not authorize material handling or testing.',
   'interface-prototype': 'Clarify the distinction between requirements and evidence before presenting the information for review.',
   'process-map': 'Assign the unanswered requirement to the appropriate reviewer before considering any physical investigation.',
   'document-review': 'List the evidence gap and its qualified owner. Do not infer safety, suitability or performance from this exercise.',
  },
 },
 {
  id: 'events', name: 'Events', context: 'The intention, information and coordination behind a shared experience.',
  starters: ['What would help an attendee understand what happens next?', 'Where can an event handoff lose the purpose of a moment?', 'Do the invitation and the experience promise the same thing?'],
  inputs: {
   conversation: ['A recent permitted example of arriving at, finding or leaving an event activity.', 'A willing attendee or production perspective on what they expected at that moment.'],
   'interface-prototype': ['A fictional invitation, arrival instruction or programme segment.', 'A sketch that answers one question about time, place or participation.'],
   'process-map': ['One imagined event moment from preparation to delivery.', 'The people responsible for the space, information and acknowledgement at each handoff.'],
   'document-review': ['An approved or fictional invitation, programme and production outline.', 'The intended audience, purpose and stated participation or access information.'],
  },
  observations: {
   conversation: ['Where the participant looked for reassurance or an instruction.', 'A difference between what they expected and what the information explained.'],
   'interface-prototype': ['Whether the participant can explain where to go and what to expect.', 'Information that competes with or obscures the one task in the exercise.'],
   'process-map': ['A moment without a clear owner or agreed cue.', 'Instructions that reach the delivery team after the moment they support.'],
   'document-review': ['Promises or timing details that differ between the invitation and programme.', 'Access or participation questions that the available material does not answer.'],
  },
  decisions: {
   conversation: 'Choose one moment to explore from both the attendee and production perspectives.',
   'interface-prototype': 'Revise the information for that moment and repeat the same task before expanding the experience.',
   'process-map': 'Clarify one cue or ownership boundary with the people responsible for delivering it.',
   'document-review': 'Resolve one mismatch between the stated intention and the information people will receive.',
  },
 },
 {
  id: 'research', name: 'Research', context: 'Turning an unfamiliar possibility into a question that can guide a decision.',
  starters: ['Which assumption would most change the next decision?', 'Can someone distinguish an observation from our interpretation?', 'What would make a small experiment worth repeating?'],
  inputs: {
   conversation: ['One assumption stated in plain language, with the decision it affects.', 'A willing participant with a perspective different from the person proposing the idea.'],
   'interface-prototype': ['A small sketch of the idea using invented information.', 'One task and a written expectation of what a participant would understand.'],
   'process-map': ['An outline of the path from question to observation to next decision.', 'The assumptions, owners and evidence needed before moving between those steps.'],
   'document-review': ['A small set of public or approved references related to one question.', 'An evidence table that separates the source, its claim and your interpretation.'],
  },
  observations: {
   conversation: ['An alternative explanation or question that was absent from the original assumption.', 'The distinction between a recalled example and a prediction about future behavior.'],
   'interface-prototype': ['A difference between the participant’s interpretation and the one you expected.', 'Whether that difference concerns the idea itself or only the way it was presented.'],
   'process-map': ['A decision gate with no agreed evidence or owner.', 'An assumption that is being treated as an observation.'],
   'document-review': ['A claim whose source is narrower or less direct than the idea assumes.', 'Conflicting accounts or questions that the current material cannot settle.'],
  },
  decisions: {
   conversation: 'Rewrite the assumption as a narrower question and choose what evidence could change your view.',
   'interface-prototype': 'Decide whether to revise the representation, narrow the question or stop pursuing the idea.',
   'process-map': 'Agree what observation would justify the next step before making the experiment larger.',
   'document-review': 'Choose a narrower question or another method for the uncertainty the references could not resolve.',
  },
 },
];
export const defaultExperiment = { field: 'mobility' as ExperimentFieldId, method: 'process-map' as ExperimentMethodId, starter: 0 };
export function createExperimentOutline(fieldId: string, methodId: string, starter = 0, question = '') {
 const field = experimentFields.find(item => item.id === fieldId) ?? experimentFields[0];
 const method = experimentMethods.find(item => item.id === methodId) ?? experimentMethods[2];
 const starterIndex = Number.isInteger(starter) && starter >= 0 && starter < field.starters.length ? starter : 0;
 return {
  field, method, starter: starterIndex,
  question: question.trim().slice(0, 1000) || field.starters[starterIndex],
  inputs: field.inputs[method.id], observations: field.observations[method.id], decision: field.decisions[method.id],
 };
}
export type ExperimentOutline = ReturnType<typeof createExperimentOutline>;
export function experimentOutlineText(outline: ExperimentOutline) {
 return [
  'Research outline — NRTH Labs',
  `Field: ${outline.field.name}`,
  `Question: ${outline.question}`,
  `Method: ${outline.method.name}`,
  `Purpose: ${outline.method.purpose}`,
  '', 'Start with', ...outline.inputs.map(item => `• ${item}`),
  '', 'Prepare', outline.method.preparation,
  '', 'Try', outline.method.activity,
  '', 'Watch for', ...outline.observations.map(item => `• ${item}`),
  '', 'What this cannot establish', outline.method.limit,
  '', 'Next decision', outline.decision,
  '', 'A planning aid for a bounded investigation. It does not create a research agreement or confirm that NRTH provides a particular service. Use invented, public or appropriately permitted information.',
 ].join('\n');
}
