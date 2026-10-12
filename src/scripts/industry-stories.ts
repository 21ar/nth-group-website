export {};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=document.documentElement.classList.contains('motion-paused');
try {paused ||= localStorage.getItem('nrth-motion')==='paused';} catch {}
const animations=new Set<Animation>();
function stopAnimations(){animations.forEach(animation=>animation.cancel());animations.clear();}
window.addEventListener('nrth:motion',event=>{
 paused=Boolean((event as CustomEvent<{paused:boolean}>).detail.paused);
 if(paused)stopAnimations();
});
reduced.addEventListener('change',()=>{if(reduced.matches)stopAnimations();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAnimations();});

for(const explorer of document.querySelectorAll<HTMLElement>('[data-industry-explorer]')){
 const choices=[...explorer.querySelectorAll<HTMLDetailsElement>('[data-industry-choice]')];
 const diagram=explorer.querySelector<HTMLElement>('[data-industry-diagram]')!;
 const selection=explorer.querySelector<HTMLElement>('[data-industry-selection]')!;
 let current=choices.find(choice=>choice.open)?.dataset.industryChoice || '';

 function select(choice?:HTMLDetailsElement){
  const id=choice?.dataset.industryChoice || '';
  const changed=current!==id;
  current=id;
  stopAnimations();
  diagram.dataset.industryContext=id;
  const nodes=new Set(choice?.dataset.industryNodes?.split(',') || []);
  diagram.querySelectorAll<HTMLElement>('[data-industry-node-label]').forEach(label=>{label.dataset.active=String(nodes.has(label.dataset.industryNodeLabel!));});
  diagram.querySelectorAll<SVGGElement>('[data-industry-node]').forEach(node=>{node.dataset.active=String(nodes.has(node.dataset.industryNode!));});
  diagram.querySelectorAll<SVGPathElement>('[data-industry-path]').forEach(path=>{
   const active=path.dataset.industryPath===id;
   path.dataset.active=String(active);
   if(active&&changed&&!paused&&!reduced.matches&&!document.hidden&&path.animate){
    const length=path.getTotalLength();
    const animation=path.animate([{strokeDasharray:String(length),strokeDashoffset:length,opacity:.2},{strokeDasharray:String(length),strokeDashoffset:0,opacity:1}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});
    animations.add(animation);
    animation.addEventListener('finish',()=>animations.delete(animation),{once:true});
    animation.addEventListener('cancel',()=>animations.delete(animation),{once:true});
   }
  });
  const title=choice?.dataset.industryTitle || 'Choose a context to trace its connections.';
  selection.querySelector('strong')!.textContent=title;
  selection.querySelector('span')!.textContent=choice?'Context in view':'Explore the connections';
 }

 choices.forEach(choice=>choice.addEventListener('toggle',()=>{
  if(choice.open){
   // Keep the chosen summary in place as a previously open context collapses.
   // Otherwise a long disclosure above it can move the reader's choice offscreen.
   const summary=choice.querySelector('summary')!;
   const before=summary.getBoundingClientRect().top;
   choices.forEach(other=>{if(other!==choice)other.open=false;});
   const displacement=summary.getBoundingClientRect().top-before;
   if(Math.abs(displacement)>1&&before>=0&&before<innerHeight)window.scrollBy({top:displacement,behavior:'instant'});
   select(choice);
  }else if(choice.dataset.industryChoice===current){
   select(choices.find(other=>other.open));
  }
 }));
 explorer.dataset.industryReady='true';
}
