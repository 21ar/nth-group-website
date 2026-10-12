import type {Article} from './articles';

export type JournalLens = {key:'purpose'|'context'|'continuation';label:string;title:string;text:string};
export type JournalGuide = {
  kind:'health'|'mobility'|'research'|'systems'|'materials'|'events';
  diagram:'attention'|'movement'|'experiment'|'provenance'|'specification'|'production'|'recovery'|'motion';
  idea:string;
  caption:string;
  sections:{id:string;title:string;startsAt:number}[];
  lenses:JournalLens[];
  application:{title:string;text:string;href:string;link:string};
};


export const journalGuides:Record<string,JournalGuide>={
  'clarity-is-a-design-decision':{
    kind:'health',diagram:'attention',
    idea:'Give the decision a place. Keep the context close. Make the continuation clear.',
    caption:'A conceptual model of attention: the immediate task sits inside its context and connects to the next person.',
    sections:[{id:'decision',title:'Start with the decision.',startsAt:0},{id:'context',title:'Make the condition of information visible.',startsAt:3},{id:'continuation',title:'Review what happens next.',startsAt:6}],
    lenses:[
      {key:'purpose',label:'The decision',title:'What needs attention now?',text:'Name the choice someone needs to make. Give the information that changes that choice a clear place, and keep secondary detail within reach.'},
      {key:'context',label:'The context',title:'What makes the information usable?',text:'Show where the information came from, whether it is current and what remains unconfirmed. Those conditions change how a person can use it.'},
      {key:'continuation',label:'The continuation',title:'Who can move the work forward?',text:'Make the next responsible person and the unresolved question explicit. A useful handoff preserves the reason for the decision, as well as its outcome.'}
    ],
    application:{title:'Review one moment of attention.',text:'Choose a real task. Write down its decision, the evidence a person needs and the context the next person will receive. Use those three descriptions to review a screen or a process.',href:'/projects/nrth-systems',link:'Explore NRTH Systems'}
  },
  'connecting-the-parts-of-movement':{
    kind:'mobility',diagram:'movement',
    idea:'A connected view works when each source keeps its meaning.',
    caption:'Four distinct stories meet at one planning decision. The connections represent context that may need to travel between them.',
    sections:[{id:'perspectives',title:'Keep the perspectives distinct.',startsAt:0},{id:'exception',title:'Follow one exception.',startsAt:3},{id:'handoff',title:'Design the handoff.',startsAt:6}],
    lenses:[
      {key:'purpose',label:'The commitment',title:'Which agreement is the plan trying to satisfy?',text:'The job describes the required movement and its constraints. A changed receiving window is a changed commitment, even when the vehicle has not changed course.'},
      {key:'context',label:'The observation',title:'What does the signal actually establish?',text:'An observation carries a source and a time. Combine it with resource context before treating it as evidence that the current plan can still work.'},
      {key:'continuation',label:'The handoff',title:'Who accepts responsibility for the change?',text:'A shared view needs an agreed continuation. Identify who can approve a revision, who needs to receive it and what acknowledgement means in the actual process.'}
    ],
    application:{title:'Map the exception before the integration.',text:'Take one changed commitment and follow it across a job, an observation, a resource and a handoff. Record where the meaning changes or a person must resolve missing context.',href:'/industries/mobility',link:'Explore the mobility perspective'}
  },
  'making-room-for-experimentation':{
    kind:'research',diagram:'experiment',
    idea:'A smaller question gives a larger ambition a credible next step.',
    caption:'An experiment isolates one uncertainty, observes it under stated conditions and uses that observation to inform the next decision.',
    sections:[{id:'uncertainty',title:'Isolate the uncertainty.',startsAt:0},{id:'method',title:'Choose the method and its limits.',startsAt:3},{id:'learning',title:'Turn the observation into a decision.',startsAt:6}],
    lenses:[
      {key:'purpose',label:'The question',title:'Which uncertainty changes the next decision?',text:'Choose a question whose answer could change your approach. Bound the investigation around that question, while keeping the larger ambition in view.'},
      {key:'context',label:'The observation',title:'What can this method establish?',text:'Describe the task, the conditions and the evidence you expect to observe. A prototype can reveal an interpretation without validating a complete product or operating model.'},
      {key:'continuation',label:'The next decision',title:'What would you do differently afterward?',text:'Set out a supporting observation, a challenging observation and an inconclusive outcome. Each should lead to a reasoned choice about what to investigate next.'}
    ],
    application:{title:'Write an outline you can challenge.',text:'Use the experiment planner to connect a specific question with a method, preparation inputs and the limits of the observation. Bring the outline into a conversation with NRTH Labs.',href:'/research#experiment',link:'Open the experiment planner'}
  }
};

Object.assign(journalGuides,{
 'freshness-is-part-of-the-signal':{
  kind:'mobility',diagram:'provenance',idea:'An observation carries its own moment.',caption:'A synthetic signal timeline separates observation, receipt and the decision made later. The intervals illustrate a relationship rather than a measured service delay.',
  sections:[{id:'moment',title:'Separate the moments.',startsAt:0},{id:'source',title:'Keep the source and condition attached.',startsAt:3},{id:'interruption',title:'Review the interruptions.',startsAt:6}],
  lenses:[{key:'purpose',label:'Observed',title:'What moment does the value describe?',text:'An observation captured at 10:02 describes that moment. Its source and event time remain relevant after it is received.'},{key:'context',label:'Received',title:'When did the information arrive?',text:'Receiving the observation at 10:07 does not refresh its event time. A delayed arrival changes what the receiving team can safely infer.'},{key:'continuation',label:'Interpreted',title:'What does the decision need now?',text:'At 10:08, the decision needs a clear account of what is known and what remains unknown. Freshness depends on the particular question and its consequences.'}],
  application:{title:'Read the signal in its context.',text:'Open the NRTH Telematics visual example. Compare a current observation with an interrupted source, then identify which information the next decision still needs.',href:'/projects/nrth-telematics#nrth-telematics-scenario',link:'Inspect the signal example'}
 },
 'specification-begins-with-the-conditions':{
  kind:'materials',diagram:'specification',idea:'Connect the condition to the evidence.',caption:'An illustrative application envelope surrounds a material direction. Three separate relationships describe requirements, documentation and qualified review; none selects or validates a substance.',
  sections:[{id:'application',title:'Describe the job before selecting an option.',startsAt:0},{id:'documentation',title:'Keep documentation with its conditions.',startsAt:3},{id:'review',title:'Give the review a boundary.',startsAt:6}],
  lenses:[{key:'purpose',label:'Application',title:'What must the material encounter?',text:'Describe the intended job and operating environment. Keep requirements separate from assumptions and name the inputs that require specialist review.'},{key:'context',label:'Evidence',title:'What does the actual document support?',text:'Connect a specification or safety document to the option it describes. Its presence does not establish suitability for every proposed application.'},{key:'continuation',label:'Review',title:'Who can judge the proposed use?',text:'A qualified reviewer can identify missing requirements and the appropriate next evaluation. The diagram organizes a discussion; it does not provide a material recommendation.'}],
  application:{title:'Prepare the application before the answer.',text:'Use the Materials field guide to describe a condition, its associated requirement and the evidence a qualified discussion would need.',href:'/industries/materials',link:'Read the materials field guide'}
 },
 'design-the-transitions-between-people':{
  kind:'events',diagram:'production',idea:'The transitions belong to the experience.',caption:'An illustrative gathering moves through arrival, a shared moment and departure. The connecting spaces carry orientation, participation and continuation rather than simply filling a schedule.',
  sections:[{id:'purpose',title:'Begin with the exchange.',startsAt:0},{id:'transitions',title:'Design the transition as a task.',startsAt:3},{id:'continuation',title:'Leave room for a useful continuation.',startsAt:6}],
  lenses:[{key:'purpose',label:'Arrival',title:'How does someone find their place?',text:'Arrival gives a person the context they need to join: what happens next, where to go and how to ask for help.'},{key:'context',label:'Participation',title:'What supports the intended exchange?',text:'The main moment needs a clear purpose and a usable route into the next conversation. Time, information and production responsibilities work together.'},{key:'continuation',label:'Departure',title:'What should travel beyond the gathering?',text:'A relevant reference, an agreed follow-up or a way to continue the exchange can make departure a meaningful handoff.'}],
  application:{title:'Walk one participant journey.',text:'Describe what a participant knows at arrival, during the first transition and on departure. Use the Events example to examine a programme change from those different perspectives.',href:'/projects/nrth-events#nrth-events-scenario',link:'Explore the events example'}
 },
 'recovery-is-a-design-decision':{
  kind:'systems',diagram:'recovery',idea:'Preserve the work. Make the state clear.',caption:'A prepared request can continue into an accepted state or return through an interruption. The diagram distinguishes a saved draft, an uncertain attempt and an acknowledged result.',
  sections:[{id:'state',title:'Name the state of the work.',startsAt:0},{id:'recovery',title:'Give each interruption a continuation.',startsAt:3},{id:'boundary',title:'Review the boundary and the return.',startsAt:6}],
  lenses:[{key:'purpose',label:'Prepared',title:'Which work is ready to continue?',text:'A prepared message is useful work even before it has been sent. Keep the content available so an interruption does not require starting again.'},{key:'context',label:'Interrupted',title:'What can the system establish?',text:'An interrupted response can leave delivery uncertain. Explain what is known, preserve the draft and distinguish correction from retry.'},{key:'continuation',label:'Acknowledged',title:'What changes responsibility?',text:'An acknowledgement should have an agreed meaning. A request accepted by a service is different from a completed downstream conversation.'}],
  application:{title:'Inspect an awkward case.',text:'Use the NRTH Systems example to examine a missing dependency or a recovery path. Identify the preserved work, the current state and the person who can continue it.',href:'/projects/nrth-systems#nrth-systems-scenario',link:'Inspect the systems example'}
 },
 'motion-should-explain-the-change':{
  kind:'research',diagram:'motion',idea:'Keep identity visible while the relationship changes.',caption:'The same six fragments move between an open arrangement and an ordered relationship. Choosing a perspective reveals the parts, their connection and the resulting structure without requiring animation.',
  sections:[{id:'identity',title:'Give the eye something to follow.',startsAt:0},{id:'meaning',title:'Coordinate the movement with its meaning.',startsAt:3},{id:'control',title:'Let the visitor interrupt and return.',startsAt:6}],
  lenses:[{key:'purpose',label:'Identity',title:'Which parts belong to the same object?',text:'A recognizable population gives the transformation a continuous identity. Changing every visible part at once can make the next state feel unrelated.'},{key:'context',label:'Relationship',title:'What connection does the movement reveal?',text:'The path and grouping should support the explanation. A transition can clarify how separate parts become a shared relationship.'},{key:'continuation',label:'Structure',title:'What does the resulting state help someone do?',text:'The settled form needs a useful consequence: an explanation, a selection or a next step. The content remains available with animation paused.'}],
  application:{title:'Try a transformation, then reverse it.',text:'Use the public visual study to change the structure, adjust the perspective and return to an earlier form. Ask which identity remains clear and which relationship becomes easier to understand.',href:'/research#visual-study',link:'Open the visual study'}
 }
} satisfies Record<string,JournalGuide>);

export function journalReadingTime(article:Article){
  const words=[article.description,...article.paragraphs,...(article.prompts||[])].join(' ').trim().split(/\s+/).length;
  return Math.max(1,Math.ceil(words/200));
}

export function journalGuide(slug:string){return journalGuides[slug];}

export function journalGuideForArticle(article:Article&{editorial?:{diagram?:JournalGuide}}){
  // Illustration identity is an authored contract, not a paragraph checksum.
  // Editing a sentence keeps the conceptual model; editors can replace its
  // sections and lenses explicitly when the argument itself changes.
  const guide=article.editorial?.diagram||journalGuide(article.slug);
  if(!guide)return undefined;
  return {...guide,sections:guide.sections.filter(section=>section.startsAt<article.paragraphs.length)};
}
