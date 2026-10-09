export type DemoKind = 'dispatch' | 'telemetry' | 'fleet' | 'sequence' | 'workflow' | 'materials' | 'agenda' | 'lab';
export type DemoStep = {title: string; owner: string; detail: string; action: string};
export type Demo = {kind: DemoKind; title: string; description: string; steps?: DemoStep[]};
export const demos: Record<string, Demo> = {
  'nrth-tms': {kind: 'dispatch', title: 'A shipment, from plan to handoff.', description: 'Choose a route, select a vehicle, and build a sample dispatch plan.'},
  'nrth-telematics': {kind: 'telemetry', title: 'A signal is only the beginning.', description: 'Scrub a sample journey to see how position, activity, and signal freshness change together.'},
  'nrth-fleet': {kind: 'fleet', title: 'Find the vehicle for the work.', description: 'Filter a sample fleet, inspect a vehicle, and understand what needs attention.'},
  'nrth-health': {kind: 'sequence', title: 'A clearer path through care.', description: 'Explore an illustrative information handoff, from a first question to a next step.', steps: [
    {title: 'First question', owner: 'The person seeking care', detail: 'Make the reason for the conversation and the information already available easy to understand.', action: 'Collect the question and agree on the next contact.'},
    {title: 'Preparation', owner: 'The coordinating team', detail: 'Separate information needed for the appointment from details that can wait.', action: 'Share an understandable preparation checklist.'},
    {title: 'Conversation', owner: 'The person and care team', detail: 'Keep the shared context visible so attention can stay on the conversation.', action: 'Record the agreed next steps in plain language.'},
    {title: 'Follow-through', owner: 'The person and coordinating team', detail: 'Make responsibilities, timing, and questions clear after the visit.', action: 'Confirm who owns each next step.'},
  ]},
  'nrth-logistics': {kind: 'sequence', title: 'Make every handoff visible.', description: 'Follow a sample shipment through four responsibilities and inspect what changes at each handoff.', steps: [
    {title: 'Requirements', owner: 'Planning team', detail: 'The origin, destination, handling needs, and timing form the starting brief.', action: 'Agree on the shipment requirements.'},
    {title: 'Preparation', owner: 'Warehouse team', detail: 'Readiness and pickup information become the next handoff.', action: 'Confirm the goods and pickup window.'},
    {title: 'Movement', owner: 'Transport team', detail: 'The shipment has an assigned owner and a clear route for exceptions.', action: 'Track the handoff and raise changes in context.'},
    {title: 'Completion', owner: 'Receiving team', detail: 'Receipt information closes the operational loop.', action: 'Confirm delivery and record any follow-up.'},
  ]},
  'nrth-systems': {kind: 'workflow', title: 'Turn an input into a next action.', description: 'Run sample records through a small workflow and inspect its actual local output.'},
  'nrth-chemicals': {kind: 'materials', title: 'Begin with the application.', description: 'Explore the questions behind an industrial application and prepare a useful conversation brief.'},
  'nrth-events': {kind: 'agenda', title: 'Give a gathering its rhythm.', description: 'Change the duration and format of a sample event to build a balanced agenda.'},
  'nrth-labs': {kind: 'lab', title: 'One form. More than one possibility.', description: 'An original NRTH form study: adjust the connection and perspective to explore a continuous transformation.'},
};
