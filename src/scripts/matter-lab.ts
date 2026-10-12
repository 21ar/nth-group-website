import {createMatter,createPose,blendMatter,smooth,type MatterForm} from './matter-geometry';
import {emitDiscovery} from './prepared-inquiry';
const lab=document.querySelector<HTMLElement>('[data-matter-lab]');
if(lab){
 const host=lab.querySelector<HTMLElement>('[data-lab-world]')!;
 const structure=lab.querySelector<HTMLInputElement>('[data-lab-structure]')!;
 const angle=lab.querySelector<HTMLInputElement>('[data-lab-angle]')!;
 const buttons=[...lab.querySelectorAll<HTMLButtonElement>('[data-lab-target]')];
 const panels=[...lab.querySelectorAll<HTMLElement>('[data-lab-panel]')];
 const forms:MatterForm[]=['mineral','Systems','Mobility','Health','Materials','Events','Research'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const status=lab.querySelector<HTMLElement>('[data-lab-status]')!;
 let selected:MatterForm='Systems';
 let renderer:import('./matter-renderer').MatterRenderer|undefined;
 let poses:ReturnType<typeof createMatter>[]=[];
 let output=createPose(0),weights:number[]=[],targetWeights:number[]=[];
 let transitionWeights:number[]=[],transitionStart=0,transitionDuration=0;
 let view=0,targetView=0,frame=0,visible=false,last=0,initializing=false,unavailable=false;
 let drag:{id:number;x:number;angle:number}|undefined;

 function paused(){return reduced.matches||document.documentElement.classList.contains('motion-paused');}
 function desiredWeights(){const amount=smooth(Number(structure.value)/100);return forms.map(form=>form==='mineral'?1-amount:form===selected?amount:0);}
 function draw(force=false){
  if(!renderer||(!visible&&!force)||document.hidden)return;
  blendMatter(poses,weights,output);
  renderer.draw(output,.2,{x:view,y:0},0);
  lab!.dataset.frames=String(renderer.frames);
  lab!.dataset.form=selected;
  lab!.dataset.weights=weights.map(weight=>weight.toFixed(5)).join(',');
 }
 function unsettled(){return transitionDuration>0||Math.abs(view-targetView)>.0002;}
 function tick(now:number){
  frame=0;if(!visible||!renderer||document.hidden)return;
  const elapsed=Math.max(0,Math.min(100,now-last)),ease=1-Math.exp(-elapsed*.008);last=now;
  if(transitionDuration){
   const progress=(now-transitionStart)/transitionDuration,amount=smooth(progress);
   weights=transitionWeights.map((weight,index)=>weight+(targetWeights[index]-weight)*amount);
   if(progress>=1){transitionDuration=0;weights=[...targetWeights];}
  }
  view+=(targetView-view)*ease;
  if(!unsettled()){weights=[...targetWeights];view=targetView;}
  draw();renderer.adapt(elapsed);
  if(unsettled())frame=requestAnimationFrame(tick);
 }
 function wake(){if(!frame&&visible&&renderer&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;}
 function update(duration=800){
  const nextWeights=desiredWeights();
  const changed=nextWeights.some((weight,index)=>weight!==targetWeights[index]);
  targetWeights=nextWeights;
  if(!renderer||paused()){transitionDuration=0;weights=[...targetWeights];}
  else if(changed){
   // An interrupted morph starts with the last rendered arrangement. A timed
   // quintic transition keeps its first frame gentle even on a slow renderer.
   transitionWeights=[...weights];transitionStart=performance.now();transitionDuration=duration;
  }
  // MatterRenderer maps its horizontal pointer to a .24-radian rotation.
  targetView=Number(angle.value)*Math.PI/180/.24;
  lab!.querySelector('[data-lab-structure-value]')!.textContent=structure.value+'%';
  lab!.querySelector('[data-lab-angle-value]')!.textContent=angle.value+'°';
  if(paused()){stop();weights=[...targetWeights];view=targetView;draw();}else wake();
 }
 function select(form:MatterForm,focus=false){
  if(!forms.includes(form)||form==='mineral')return;
  selected=form;
  for(const button of buttons){const active=button.dataset.labTarget===form;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus();}
  for(const panel of panels)panel.hidden=panel.dataset.labPanel!==form;
  const label=buttons.find(button=>button.dataset.labTarget===form)?.textContent?.trim().toLowerCase()||'arrangement';
  structure.setAttribute('aria-label','Structure from mineral to '+label);
  update(1450);
 }
 function numericParameter(name:string,min:number,max:number,fallback:number){const raw=new URLSearchParams(location.search).get(name);if(raw===null||raw.trim()==='')return fallback;const value=Number(raw);return Number.isFinite(value)?Math.round(Math.max(min,Math.min(max,value))):fallback;}
 const initialForm=new URLSearchParams(location.search).get('study') as MatterForm|null;
 structure.value=String(numericParameter('structure',0,100,35));
 angle.value=String(numericParameter('angle',-70,70,0));
 select(initialForm&&forms.includes(initialForm)&&initialForm!=='mineral'?initialForm:'Systems');
 weights=[...targetWeights];view=targetView;

 for(const button of buttons){
  button.addEventListener('click',()=>select(button.dataset.labTarget as MatterForm));
  button.addEventListener('keydown',event=>{
   const index=buttons.indexOf(button);
   const next=event.key==='ArrowRight'?(index+1)%buttons.length:event.key==='ArrowLeft'?(index+buttons.length-1)%buttons.length:event.key==='Home'?0:event.key==='End'?buttons.length-1:-1;
   if(next>=0){event.preventDefault();select(buttons[next].dataset.labTarget as MatterForm,true);}
  });
 }
 structure.addEventListener('input',()=>update());angle.addEventListener('input',()=>update());

 function restorePoster(){
  stop();renderer?.dispose();renderer=undefined;unavailable=true;
  host.querySelector<HTMLElement>('.lab-still')!.hidden=false;
  for(const selector of ['[data-lab-controls]','[data-lab-targets]','[data-lab-actions]','[data-lab-drag-hint]'])lab!.querySelector<HTMLElement>(selector)!.hidden=true;
  host.classList.remove('is-interactive','is-dragging');lab!.dataset.mode='static';
  status.textContent='The interactive study is unavailable. The artwork and observations remain available.';
 }
 async function init(){
  if(renderer||initializing||unavailable)return;initializing=true;
  try{
   const {MatterRenderer}=await import('./matter-renderer');
   renderer=new MatterRenderer(host,true);
   poses=forms.map(form=>createMatter(form,renderer!.count));output=createPose(renderer.count);
   transitionDuration=0;weights=[...targetWeights];view=targetView;draw();
   host.querySelector<HTMLElement>('.lab-still')!.hidden=true;
   for(const selector of ['[data-lab-controls]','[data-lab-targets]','[data-lab-actions]','[data-lab-drag-hint]'])lab!.querySelector<HTMLElement>(selector)!.hidden=false;
   host.classList.add('is-interactive');lab!.dataset.mode='interactive';
   renderer.renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();restorePoster();});
  }catch{restorePoster();}finally{initializing=false;}
 }
 const observer=new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(visible){void init();wake();}else stop();
 },{rootMargin:'0px'});observer.observe(host);

 host.addEventListener('pointerdown',event=>{
  if(!renderer||event.button!==0)return;
  drag={id:event.pointerId,x:event.clientX,angle:Number(angle.value)};
  host.setPointerCapture(event.pointerId);host.classList.add('is-dragging');
 });
 host.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  angle.value=String(Math.round(Math.max(-70,Math.min(70,drag.angle+(event.clientX-drag.x)*.35))));update();
 });
 function finishDrag(event:PointerEvent){if(drag?.id===event.pointerId){drag=undefined;host.classList.remove('is-dragging');if(host.hasPointerCapture(event.pointerId))host.releasePointerCapture(event.pointerId);}}
 host.addEventListener('pointerup',finishDrag);host.addEventListener('pointercancel',finishDrag);host.addEventListener('lostpointercapture',()=>{drag=undefined;host.classList.remove('is-dragging');});

 lab.querySelector('[data-lab-reset]')!.addEventListener('click',()=>{
  structure.value='35';angle.value='0';select('Systems');
  lab!.querySelector<HTMLElement>('[data-lab-share-fallback]')!.hidden=true;
  status.textContent='Study reset to the framework, 35% structure and 0° perspective.';
 });
 lab.querySelector('[data-lab-save]')!.addEventListener('click',()=>{
  if(!renderer)return;
  // Export remains available when the artwork has scrolled above its controls.
  if(!visible){transitionDuration=0;weights=[...targetWeights];view=targetView;}
  draw(true);
  try{const link=document.createElement('a');link.href=renderer.renderer.domElement.toDataURL('image/png');link.download='nrth-structure-study.png';link.click();status.textContent='Arrangement saved as an image.';emitDiscovery('visual_study_saved');}
  catch{status.textContent='The image could not be saved. You can copy a study link to keep this arrangement.';}
 });
 lab.querySelector('[data-lab-share]')!.addEventListener('click',async()=>{
  const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('study',selected);url.searchParams.set('structure',structure.value);url.searchParams.set('angle',angle.value);
  try{await navigator.clipboard.writeText(url.href);lab!.querySelector<HTMLElement>('[data-lab-share-fallback]')!.hidden=true;status.textContent='Study link copied. It opens with this arrangement, structure and perspective.';emitDiscovery('visual_study_shared');}
  catch{const fallback=lab!.querySelector<HTMLElement>('[data-lab-share-fallback]')!,input=lab!.querySelector<HTMLInputElement>('[data-lab-share-link]')!;fallback.hidden=false;input.value=url.href;input.focus();input.select();status.textContent='Your study link is ready to select and copy.';}
 });
 function settle(){if(paused()){stop();transitionDuration=0;weights=[...targetWeights];view=targetView;draw();}else wake();}
 window.addEventListener('nrth:motion',settle);reduced.addEventListener('change',settle);
 window.addEventListener('resize',()=>{renderer?.resize(host);draw();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else wake();});
 window.addEventListener('pagehide',()=>{stop();observer.disconnect();renderer?.dispose();renderer=undefined;});
}
