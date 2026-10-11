import {createMatter,createPose,blendMatter,matterForms,smooth,type MatterForm} from './matter-geometry';
const root=document.querySelector<HTMLElement>('[data-matter-story]');
if(root){
  const host=root.querySelector<HTMLElement>('[data-matter-world]')!,stage=root.querySelector<HTMLElement>('.matter-stage')!;
  const opening=root.querySelector<HTMLElement>('[data-matter-opening]')!,connection=root.querySelector<HTMLElement>('[data-matter-connection]')!;
  const explorer=root.querySelector<HTMLElement>('[data-matter-explorer]')!,ending=root.querySelector<HTMLElement>('[data-matter-ending]')!;
  const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-matter-field]')],panels=[...root.querySelectorAll<HTMLElement>('[data-field-panel]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),short=matchMedia('(max-height: 560px) and (orientation: landscape)');
  let active=0,renderer:import('./matter-renderer').MatterRenderer|undefined,poses:ReturnType<typeof createMatter>[]=[],output=createPose(0);
  let current=0,target=0,last=performance.now(),raf=0,visible=true,paused=false,initialized=false;
  let pointer={x:0,y:0},pointerTarget={x:0,y:0};
  let fieldWeights:number[]=matterForms.map((_,i)=>i===2?1:0),fieldFrom=[...fieldWeights],fieldTo=[...fieldWeights],fieldStart=0,fieldMoving=false;
  try{paused=localStorage.getItem('nrth-motion')==='paused';}catch{}
  function allowed(){return !reduced.matches&&!short.matches&&!paused;}
  function choose(index:number,focus=false){
    active=(index+tabs.length)%tabs.length;
    const name=tabs[active].dataset.matterField as MatterForm;
    fieldFrom=[...fieldWeights];fieldTo=matterForms.map(form=>form===name?1:0);fieldStart=performance.now();fieldMoving=allowed();
    if(!fieldMoving)fieldWeights=[...fieldTo];
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===active));tab.tabIndex=i===active?0:-1;});
    panels.forEach((panel,i)=>{panel.hidden=i!==active;if(i===active&&allowed())panel.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});});
    root!.dataset.activeForm=name;
    if(focus)tabs[active].focus({preventScroll:true});wake();
  }
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>choose(i));tab.addEventListener('keydown',e=>{const delta=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(delta){e.preventDefault();choose(active+delta,true);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();choose(e.key==='Home'?0:tabs.length-1,true);}});});
  function content(p:number){
    const first=1-smooth((p-.08)/.14),middle=smooth((p-.17)/.1)*(1-smooth((p-.36)/.1)),fields=smooth((p-.4)/.09)*(1-smooth((p-.79)/.08)),end=smooth((p-.86)/.09);
    opening.style.opacity=String(first);opening.style.transform=`translateY(${-smooth(p/.28)*75}px)`;
    opening.inert=first<.5;
    connection.style.opacity=String(middle);connection.style.transform=`translateY(${(1-middle)*35}px)`;
    explorer.hidden=fields<.01;explorer.style.opacity=String(fields);explorer.inert=fields<.5;
    ending.style.opacity=String(end);ending.style.transform=`translateY(${(1-end)*40}px)`;
    const light=smooth((p-.84)/.16),background=Math.round(10+(237-10)*light),ink=Math.round(237-(237-22)*light);
    stage.style.backgroundColor=`rgb(${background} ${background} ${background+Math.round(3*(1-light))})`;stage.style.color=`rgb(${ink} ${ink} ${ink})`;
    stage.style.setProperty('--accent-text',`rgb(${Math.round(255-70*light)} ${Math.round(116-49*light)} ${Math.round(59-37*light)})`);
    return light;
  }
  function readScroll(){const rect=root!.getBoundingClientRect(),range=root!.offsetHeight-stage.offsetHeight;target=range>0?Math.max(0,Math.min(1,-rect.top/range)):0;wake();}
  function render(now:number){
    raf=0;if(!renderer||!visible||document.hidden||!allowed())return;
    const elapsed=now-last,dt=Math.min(100,elapsed);last=now;renderer.adapt(elapsed);const ease=1-Math.exp(-dt*.007);
    current+=(target-current)*ease;pointer.x+=(pointerTarget.x-pointer.x)*ease;pointer.y+=(pointerTarget.y-pointer.y)*ease;
    if(fieldMoving){const progress=Math.min(1,(now-fieldStart)/1450),mix=smooth(progress);fieldWeights=fieldFrom.map((v,i)=>v+(fieldTo[i]-v)*mix);fieldMoving=progress<1;}
    const weights=new Array(matterForms.length).fill(0),toCloud=smooth(current/.36),toField=smooth((current-.34)/.19),toNext=smooth((current-.84)/.16);
    weights[0]=(1-toCloud)*(1-toNext);weights[1]=toCloud*(1-toField)*(1-toNext);
    fieldWeights.forEach((weight,i)=>{weights[i]+=weight*toField*(1-toNext);});weights[7]+=toNext;
    blendMatter(poses,weights,output);const light=content(current);renderer.draw(output,current,pointer,light);
    root!.dataset.matterProgress=current.toFixed(4);root!.dataset.frames=String(renderer.frames);
    root!.dataset.matterSample=JSON.stringify([...output.position.slice(0,9)]);
    const moving=Math.abs(target-current)>.00015||Math.abs(pointerTarget.x-pointer.x)>.00015||Math.abs(pointerTarget.y-pointer.y)>.00015||fieldMoving;
    if(moving)raf=requestAnimationFrame(render);
  }
  function wake(){if(renderer&&visible&&!document.hidden&&allowed()&&!raf){last=performance.now();raf=requestAnimationFrame(render);}}
  async function init(){
    if(initialized||!allowed())return;initialized=true;
    try{
      const {MatterRenderer}=await import('./matter-renderer');if(!allowed()){initialized=false;return;}
      renderer=new MatterRenderer(host);poses=matterForms.map(form=>createMatter(form,renderer!.count));output=createPose(renderer.count);
      root!.classList.add('matter-ready');root!.dataset.mode='webgl';readScroll();
      blendMatter(poses,[1,0,0,0,0,0,0,0],output);renderer.draw(output,0,pointer,0);host.classList.add('matter-running');
      renderer.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});wake();
    }catch{fallback();}
  }
  function fallback(){if(raf)cancelAnimationFrame(raf);raf=0;renderer?.dispose();renderer=undefined;host.classList.remove('matter-running');root!.classList.remove('matter-ready');root!.dataset.mode='static';stage.removeAttribute('style');opening.removeAttribute('style');opening.inert=false;}
  function sync(){
    if(!allowed()){if(raf)cancelAnimationFrame(raf);raf=0;root!.classList.remove('matter-ready');root!.dataset.mode='static';stage.removeAttribute('style');opening.removeAttribute('style');opening.inert=false;explorer.hidden=true;host.classList.remove('matter-running');}
    else if(renderer){root!.classList.add('matter-ready');root!.dataset.mode='webgl';host.classList.add('matter-running');renderer.resize(host);readScroll();wake();}else void init();
  }
  window.addEventListener('scroll',readScroll,{passive:true});
  window.addEventListener('resize',()=>{renderer?.resize(host);readScroll();wake();});
  stage.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const box=stage.getBoundingClientRect();pointerTarget={x:(e.clientX-box.left)/box.width*2-1,y:1-(e.clientY-box.top)/box.height*2};wake();});
  stage.addEventListener('pointerleave',()=>{pointerTarget={x:0,y:0};wake();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0});observer.observe(root);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
  window.addEventListener('nrth:motion',e=>{paused=(e as CustomEvent).detail.paused;sync();});reduced.addEventListener('change',sync);short.addEventListener('change',sync);
  window.addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);raf=0;});window.addEventListener('pageshow',()=>{if(renderer){renderer.resize(host);readScroll();wake();}});
  root.dataset.activeForm='Mobility';void init();
}
