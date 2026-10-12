function initDecisionLenses(){
 document.querySelectorAll<HTMLElement>('[data-decision-lens]').forEach(root=>{
  if(root.dataset.decisionReady==='true')return;
  root.dataset.decisionReady='true';
  const readings=Array.from(root.querySelectorAll<HTMLDetailsElement>('[data-decision-reading]'));
  let current=readings.find(reading=>reading.open)||readings[0];
  readings.forEach(reading=>reading.addEventListener('toggle',()=>{
   if(!reading.open)return;
   const summary=reading.querySelector('summary');
   const before=summary?.getBoundingClientRect().top;
   root.dataset.decisionActive=reading.dataset.decisionReading;
   const previous=current;
   current=reading;
   readings.forEach(other=>{if(other!==reading&&other.open)other.open=false;});
   if(previous!==reading&&before!==undefined&&summary){
    const after=summary.getBoundingClientRect().top;
    if(Math.abs(after-before)>1)window.scrollBy({top:after-before,behavior:'instant'});
   }
  }));
 });
}
initDecisionLenses();
document.addEventListener('astro:page-load',initDecisionLenses);
