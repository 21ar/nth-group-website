import {ease,foldFields} from './fold-geometry';
import type {FoldFrame,FoldRenderer} from './fold-renderer';

const track=document.querySelector<HTMLElement>('[data-fold-story]');
if(track){
  const host=track.querySelector<HTMLElement>('[data-hero-scene]')!,intro=track.querySelector<HTMLElement>('[data-fold-intro]')!,content=track.querySelector<HTMLElement>('[data-fold-content]')!;
  const buttons=[...track.querySelectorAll<HTMLButtonElement>('[data-fold-field]')],panels=[...track.querySelectorAll<HTMLElement>('[data-fold-panel]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-height: 560px) and (orientation: landscape)');
  let renderer:FoldRenderer|undefined,request=0,visible=true,loading=false,failed=false,previous=0,progress=0,target=0,selection=1,to=0,pointerX=0,pointerY=0;
  let startingWeights=[1,0,0,0,0,0],selectionStarted=0,panelAnimation:Animation|undefined;
  const frame:FoldFrame={progress:0,weights:[1,0,0,0,0,0],pointerX:0,pointerY:0};
  function paused(){return failed||compact.matches||reduced.matches||document.documentElement.classList.contains('motion-paused');}
  function readScroll(){const bounds=track!.getBoundingClientRect();target=Math.max(0,Math.min(1,-bounds.top/Math.max(1,bounds.height-innerHeight)));track!.dataset.progress=target.toFixed(4);schedule();}
  function textState(){
    const outgoing=ease((progress-.1)/.22),incoming=ease((progress-.28)/.2);
    intro.style.opacity=String(1-outgoing);intro.style.transform=`translateY(${-outgoing*70}px)`;intro.inert=outgoing>.95;
    content.style.opacity=String(incoming);content.style.transform=`translateY(${(1-incoming)*65}px)`;content.inert=incoming<.95;
  }
  function schedule(){if(!request&&visible&&!document.hidden&&!paused())request=requestAnimationFrame(tick);}
  function tick(time:number){
    request=0;const dt=Math.min(50,time-(previous||time-16));previous=time;
    progress+=(target-progress)*(1-Math.exp(-dt/85));if(selection<1)selection=Math.min(1,(time-selectionStarted)/920);
    frame.progress=ease((progress-.06)/.86);const blend=ease(selection);frame.weights=startingWeights.map((weight,index)=>weight+((index===to?1:0)-weight)*blend);
    frame.pointerX+=(pointerX-frame.pointerX)*(1-Math.exp(-dt/120));frame.pointerY+=(pointerY-frame.pointerY)*(1-Math.exp(-dt/120));
    textState();
    if(renderer){renderer.draw(frame);host.dataset.sceneState='ready';host.dataset.weights=frame.weights.map(v=>v.toFixed(3)).join(',');host.dataset.frames=String(Number(host.dataset.frames||0)+1);host.classList.add('fold-ready');}
    if(Math.abs(target-progress)>.0001||selection<1||Math.abs(pointerX-frame.pointerX)>.001||Math.abs(pointerY-frame.pointerY)>.001)schedule();
  }
  async function start(){
    if(loading||renderer||failed||paused())return;loading=true;
    try{
      const webgl=await import('./fold-webgl');if(paused()){loading=false;return;}try{renderer=webgl.createFoldWebGL(host);}catch{renderer=undefined;}
      if(!renderer){const fallback=await import('./fold-canvas');if(!paused())renderer=fallback.createFoldCanvas(host);}
      if(!renderer)throw new Error('No graphics context');
      host.dataset.sceneState='ready';schedule();
    }catch{failed=true;host.dataset.sceneState='static';host.dataset.renderer='static';track!.classList.add('fold-static');cancelAnimationFrame(request);request=0;intro.style.removeProperty('opacity');intro.style.removeProperty('transform');intro.inert=false;content.style.removeProperty('opacity');content.style.removeProperty('transform');content.inert=false;}
    finally{loading=false;}
  }
  function sync(){
    track!.classList.toggle('fold-static',failed||compact.matches);
    if(paused()){
      panelAnimation?.cancel();
      cancelAnimationFrame(request);request=0;renderer?.dispose();renderer=undefined;host.classList.remove('fold-ready');host.dataset.renderer='static';host.dataset.sceneState='static';
      intro.style.removeProperty('opacity');intro.style.removeProperty('transform');intro.inert=false;content.style.removeProperty('opacity');content.style.removeProperty('transform');content.inert=false;
    }else{readScroll();void start();}
  }
  buttons.forEach((button,index)=>button.addEventListener('click',()=>{
    // Interrupted selections start from the exact displayed mixture of surfaces.
    startingWeights=frame.weights.slice();to=index;selection=0;selectionStarted=performance.now();track!.dataset.field=foldFields[index];
    if(paused()){frame.weights=startingWeights.map((_,i)=>i===index?1:0);selection=1;}
    buttons.forEach((item,i)=>{item.setAttribute('aria-selected',String(i===index));item.tabIndex=i===index?0:-1;});
    panels.forEach((panel,i)=>{panel.hidden=i!==index;});
    panelAnimation?.cancel();
    if(!paused())panelAnimation=panels[index].animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay:60,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    host.dataset.field=foldFields[index];schedule();
  }));
  buttons.forEach((button,index)=>button.addEventListener('keydown',event=>{
    const next=event.key==='ArrowRight'?(index+1)%buttons.length:event.key==='ArrowLeft'?(index+buttons.length-1)%buttons.length:event.key==='Home'?0:event.key==='End'?buttons.length-1:-1;
    if(next>=0){event.preventDefault();buttons[next].click();buttons[next].focus();buttons[next].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}
  }));
  track.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const bounds=host.getBoundingClientRect();pointerX=(event.clientX/bounds.width-.5)*2;pointerY=(event.clientY/bounds.height-.5)*2;schedule();},{passive:true});
  track.addEventListener('pointerleave',()=>{pointerX=pointerY=0;schedule();});
  window.addEventListener('scroll',readScroll,{passive:true});window.addEventListener('resize',()=>{renderer?.resize();readScroll();schedule();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(request);request=0;}else{previous=0;schedule();}});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){previous=0;readScroll();void start();}else{cancelAnimationFrame(request);request=0;}},{rootMargin:'100px'}).observe(track);
  host.addEventListener('nrth:renderer-lost',async()=>{renderer?.dispose();renderer=undefined;const fallback=await import('./fold-canvas');if(!paused())renderer=fallback.createFoldCanvas(host);schedule();});
  window.addEventListener('nrth:motion',sync);reduced.addEventListener('change',sync);compact.addEventListener('change',sync);
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(request);request=0;renderer?.dispose();renderer=undefined;host.classList.remove('fold-ready');});
  window.addEventListener('pageshow',event=>{if(event.persisted)sync();});
  track.classList.add('fold-enhanced');sync();
}
