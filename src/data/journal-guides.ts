import {articles,type Article} from './articles';

export type JournalLens = {key:'purpose'|'context'|'continuation';label:string;title:string;text:string};
export type JournalGuide = {
  kind:'health'|'mobility'|'research';
  diagram:'attention'|'movement'|'experiment';
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

export function journalReadingTime(article:Article){
  const words=[article.description,...article.paragraphs,...(article.prompts||[])].join(' ').trim().split(/\s+/).length;
  return Math.max(1,Math.ceil(words/200));
}

export function journalGuide(slug:string){return journalGuides[slug];}

export function journalGuideForArticle(article:Article){
  const original=articles.find(item=>item.slug===article.slug);
  return original&&original.paragraphs.length===article.paragraphs.length&&original.paragraphs.every((text,i)=>text===article.paragraphs[i])?journalGuide(article.slug):undefined;
}
