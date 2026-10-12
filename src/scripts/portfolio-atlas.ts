export {};
for(const root of document.querySelectorAll<HTMLElement>('[data-portfolio-atlas]')){
 const links=[...root.querySelectorAll<HTMLAnchorElement>('[data-atlas-choice]')],panels=[...root.querySelectorAll<HTMLElement>('[data-atlas-panel]')],forms=[...root.querySelectorAll<SVGGElement>('[data-atlas-form]')],filters=[...root.querySelectorAll<HTMLButtonElement>('[data-atlas-field]')];
 let selected=links[0]?.dataset.atlasChoice,movingUntil=0;
 const narrow=matchMedia('(max-width:767px)');
 root.classList.add('atlas-ready');root.querySelector<HTMLElement>('[data-atlas-tools]')!.hidden=false;
 function select(link:HTMLAnchorElement,announce=true,reorganize=true){
  selected=link.dataset.atlasChoice;root.dataset.atlasSelected=selected;
  links.forEach(item=>{item.setAttribute('aria-pressed',String(item===link));item.classList.toggle('is-selected',item===link);});
  panels.forEach(panel=>panel.hidden=panel.dataset.atlasPanel!==selected);
  forms.forEach(form=>form.classList.toggle('is-selected',form.dataset.atlasForm===selected));
  if(reorganize){
   movingUntil=performance.now()+1150;
   const others=links.filter(item=>item!==link);
   links.forEach(item=>{
    const rank=others.indexOf(item),angle=-Math.PI/2+Math.max(0,rank)*Math.PI/4;
    const slot=links.indexOf(item);
    const x=narrow.matches?150+slot%3*300:item===link?450:450+Math.cos(angle)*325,y=narrow.matches?120+Math.floor(slot/3)*260:item===link?365:365+Math.sin(angle)*275;
    item.style.setProperty('--atlas-x',x/9+'%');item.style.setProperty('--atlas-y',y/7.8+'%');
    const form=forms.find(form=>form.dataset.atlasForm===item.dataset.atlasChoice);
    if(form)form.style.transform=`translate(${x}px,${y}px) rotate(-12deg) scale(${narrow.matches?item===link?1.07:1:item===link?1.22:.77})`;
   });
  }
  window.dispatchEvent(new CustomEvent('nrth:venture',{detail:{index:Number(link.dataset.atlasIndex),slug:selected}}));
  if(announce)root.querySelector('[data-atlas-status]')!.textContent='NRTH '+link.firstElementChild!.textContent+' selected. Read its question and open its overview.';
 }
 // Keep real links as the fallback. Enhanced selection is a true button action,
 // followed by a distinct, ordinary link to the selected direction.
 links.forEach(link=>{
  link.setAttribute('role','button');link.setAttribute('aria-pressed','false');link.setAttribute('aria-label','Select NRTH '+link.firstElementChild!.textContent);
  link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();select(link);});
  link.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&performance.now()>movingUntil)select(link,false,false);});
  link.addEventListener('focus',()=>select(link,false,false));
  link.addEventListener('keydown',event=>{
   if(event.key===' '){event.preventDefault();select(link);return;}
   const visible=links.filter(item=>!item.hidden),index=visible.indexOf(link);
   const delta=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:event.key==='ArrowDown'?3:event.key==='ArrowUp'?-3:0;
   const next=event.key==='Home'?0:event.key==='End'?visible.length-1:delta?(index+delta+visible.length)%visible.length:null;
   if(next!==null){event.preventDefault();visible[next]?.focus({preventScroll:true});}
  });
 });
 filters.forEach(filter=>filter.addEventListener('click',()=>{
  const field=filter.dataset.atlasField;filters.forEach(item=>item.setAttribute('aria-pressed',String(item===filter)));
  links.forEach(link=>{const relevant=field==='All'||link.dataset.atlasCategory===field;link.hidden=!relevant;forms.find(form=>form.dataset.atlasForm===link.dataset.atlasChoice)?.classList.toggle('is-distant',!relevant);});
  const current=links.find(link=>link.dataset.atlasChoice===selected&&!link.hidden)||links.find(link=>!link.hidden);if(current)select(current);
 }));
 select(links[0],false,false);
 narrow.addEventListener('change',()=>{const current=links.find(link=>link.dataset.atlasChoice===selected);if(current)select(current,false);});
}
