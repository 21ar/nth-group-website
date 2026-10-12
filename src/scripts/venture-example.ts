import {exampleNodes, exampleCurve, examplePath, type VentureExampleModel, type ExampleNode} from '../data/venture-examples';

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const statusLabel=(status?:string)=>status==='pending'?'Needs confirmation':status==='changed'?'Changed':status==='held'?'Held':'Defined';

document.querySelectorAll<HTMLElement>('[data-worked-example]').forEach(root=>{
  const payload=root.querySelector<HTMLScriptElement>('[data-example-model]');
  const svg=root.querySelector<SVGSVGElement>('[data-example-diagram]');
  if(!payload||!svg)return;
  let model:VentureExampleModel;
  try{model=JSON.parse(payload.textContent||'null');}catch{return;}
  if(!model?.nodes?.length||model.states?.length!==3)return;
  const parts=[...root.querySelectorAll<HTMLDetailsElement>('[data-example-part-record]')];
  const records=[...root.querySelectorAll<HTMLElement>('[data-example-record]')];
  const choices=[...root.querySelectorAll<HTMLButtonElement>('[data-example-choice]')];
  const caption=root.querySelector<HTMLElement>('[data-example-caption]');
  const description=root.querySelector<SVGDescElement>('[data-example-description]');
  const announcement=root.querySelector<HTMLElement>('[data-example-announcement]');
  const dependencyToggle=root.querySelector<HTMLButtonElement>('[data-example-dependencies-toggle]');
  const nodeElements=new Map([...svg.querySelectorAll<SVGGElement>('[data-example-node]')].map(node=>[node.dataset.exampleNode!,node]));
  const edgeElements=new Map([...svg.querySelectorAll<SVGGElement>('[data-example-edge]')].map(edge=>[edge.dataset.exampleEdge!,edge]));
  let current=0, positions=exampleNodes(model,0).map(node=>({x:node.x,y:node.y}));
  let edgeVisibility=new Map([...edgeElements].map(([key])=>[key,model.states[0].edges.some(edge=>`${edge.from}|${edge.to}`===key)?1:0]));
  let frame=0, targetNodes=exampleNodes(model,0), targetEdges=new Map(edgeVisibility), visible=false;
  let paused=document.documentElement.classList.contains('motion-paused');
  let dependencies=false;
  let inspected=model.states[0].focus;
  let updatingParts=false;

  function draw(){
    positions.forEach((point,index)=>nodeElements.get(model.nodes[index].id)?.setAttribute('transform',`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`));
    edgeElements.forEach((element,key)=>{
      const [from,to]=key.split('|');
      const a=positions[model.nodes.findIndex(node=>node.id===from)];
      const b=positions[model.nodes.findIndex(node=>node.id===to)];
      const path=examplePath(exampleCurve(a,b));
      element.querySelectorAll<SVGPathElement>('path').forEach(line=>line.setAttribute('d',path));
      element.setAttribute('opacity',String(edgeVisibility.get(key)||0));
    });
  }
  function settle(){
    cancelAnimationFrame(frame);frame=0;
    positions=targetNodes.map(node=>({x:node.x,y:node.y}));
    edgeVisibility=new Map(targetEdges);
    root.dataset.exampleSettled='true';
    draw();
  }
  function inspect(part:string,open=true){
    inspected=part;root.dataset.examplePart=part;
    const selected=targetNodes.find(node=>node.id===part),label=root.querySelector('[data-example-selected-label]'),detail=root.querySelector('[data-example-selected-detail]');
    if(selected&&label)label.textContent=`${model.nodes.findIndex(node=>node.id===part)+1}. ${selected.label} — ${statusLabel(selected.status)}`;
    if(selected&&detail)detail.textContent=selected.detail;
    nodeElements.forEach((element,id)=>element.classList.toggle('is-inspected',id===part));
    edgeElements.forEach(element=>element.classList.toggle('is-inspected',element.dataset.from===part||element.dataset.to===part));
    if(open){
      updatingParts=true;
      parts.forEach(record=>record.open=record.dataset.examplePartRecord===part);
      updatingParts=false;
    }
  }
  function showDependencies(next:boolean,announce=true){
    dependencies=next;root.dataset.exampleDependencies=String(next);
    dependencyToggle?.setAttribute('aria-pressed',String(next));
    if(dependencyToggle)dependencyToggle.textContent=next?'Hide downstream work':'Trace downstream work';
    if(!next&&model.nodes.find(node=>node.id===inspected)?.dependency)inspect(model.states[current].focus && !model.nodes.find(node=>node.id===model.states[current].focus)?.dependency ? model.states[current].focus:model.nodes[0].id);
    if(announce&&announcement)announcement.textContent=next?'Downstream responsibilities are now shown.':'The core work is shown. Downstream responsibilities are hidden.';
    if(announce)window.dispatchEvent(new CustomEvent('nrth:interaction',{detail:{venture:root.dataset.venture,action:'example_dependencies',example:model.id}}));
  }
  function updateCopy(nodes:ExampleNode[]){
    const state=model.states[current];
    if(caption)caption.textContent=state.caption;
    if(description)description.textContent=`${state.caption} Synthetic example. Numbered parts: ${nodes.map((node,index)=>`${index+1}, ${node.label}, ${statusLabel(node.status)}`).join('; ')}. Responsibilities are described below.`;
    nodes.forEach(node=>{
      const element=nodeElements.get(node.id);
      if(element){element.dataset.status=node.status||'known';const label=element.querySelector('[data-example-node-label]');if(label)label.textContent=node.label;}
      const record=parts.find(part=>part.dataset.examplePartRecord===node.id);
      if(!record)return;
      const set=(selector:string,text:string)=>{const target=record.querySelector(selector);if(target)target.textContent=text;};
      set('[data-example-part-label]',node.label);set('[data-example-part-role]',node.role);set('[data-example-part-detail]',node.detail);set('[data-example-part-status]',statusLabel(node.status));
    });
    records.forEach((record,index)=>{record.classList.toggle('is-active',index===current);record.setAttribute('aria-hidden',String(index!==current));record.inert=index!==current;});
    choices.forEach((choice,index)=>choice.setAttribute('aria-pressed',String(index===current)));
    edgeElements.forEach((element,key)=>{const edge=state.edges.find(edge=>`${edge.from}|${edge.to}`===key);element.dataset.mode=edge?.mode||'known';});
  }
  function choose(index:number,animate=true){
    if(!Number.isInteger(index)||index<0||index>=model.states.length)return;
    const changed=index!==current;
    cancelAnimationFrame(frame);frame=0;
    const from=positions.map(point=>({...point}));
    const fromEdges=new Map(edgeVisibility);
    current=index;root.dataset.exampleState=String(index);
    targetNodes=exampleNodes(model,index);
    targetEdges=new Map([...edgeElements].map(([key])=>[key,model.states[index].edges.some(edge=>`${edge.from}|${edge.to}`===key)?1:0]));
    updateCopy(targetNodes);
    if(targetNodes.find(node=>node.id===model.states[index].focus)?.dependency)showDependencies(true,false);
    inspect(model.states[index].focus);
    if(!animate||!changed||paused||reduced.matches||document.hidden||!visible){settle();return;}
    root.dataset.exampleSettled='false';
    const started=performance.now(),duration=760;
    const tick=(time:number)=>{
      const p=Math.min(1,(time-started)/duration);
      // Quintic easing has zero velocity and acceleration at each end.
      const progress=p*p*p*(p*(p*6-15)+10);
      positions=targetNodes.map((node,i)=>({x:from[i].x+(node.x-from[i].x)*progress,y:from[i].y+(node.y-from[i].y)*progress}));
      edgeVisibility=new Map([...targetEdges].map(([key,value])=>[key,(fromEdges.get(key)||0)+(value-(fromEdges.get(key)||0))*progress]));
      draw();
      if(p<1)frame=requestAnimationFrame(tick);else{frame=0;root.dataset.exampleSettled='true';}
    };
    frame=requestAnimationFrame(tick);
    if(announcement)announcement.textContent=`${model.states[index].title}. ${model.states[index].consequence}`;
    window.dispatchEvent(new CustomEvent('nrth:interaction',{detail:{venture:root.dataset.venture,action:'example_changed',example:model.id,scenario:String(index)}}));
  }

  parts.forEach(part=>part.addEventListener('toggle',()=>{
    if(updatingParts||!part.open||part.dataset.examplePartRecord===inspected)return;
    const id=part.dataset.examplePartRecord!;
    inspect(id);
    window.dispatchEvent(new CustomEvent('nrth:interaction',{detail:{venture:root.dataset.venture,action:'example_inspected',example:model.id,part:id}}));
  }));
  nodeElements.forEach((element,id)=>element.addEventListener('click',()=>{
    inspect(id);
    window.dispatchEvent(new CustomEvent('nrth:interaction',{detail:{venture:root.dataset.venture,action:'example_inspected',example:model.id,part:id}}));
  }));
  dependencyToggle?.addEventListener('click',()=>showDependencies(!dependencies));
  choices.forEach((choice,index)=>choice.addEventListener('click',()=>choose(index)));
  const stories=root.closest<HTMLElement>('[data-venture-stories]');
  stories?.addEventListener('nrth:scenario',event=>choose((event as CustomEvent<{index:number}>).detail.index));
  const initial=stories?[...stories.querySelectorAll('[data-scenario-choice]')].findIndex(choice=>choice.getAttribute('aria-selected')==='true'):0;
  root.classList.add('is-enhanced');
  root.querySelector<HTMLElement>('[data-example-controls]')?.removeAttribute('hidden');
  dependencyToggle?.removeAttribute('hidden');
  choose(initial>=0?initial:0,false);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;root.dataset.exampleVisible=String(visible);if(!visible&&frame)settle();},{rootMargin:'50px'}).observe(root);
  reduced.addEventListener('change',()=>{if(reduced.matches&&frame)settle();});
  window.addEventListener('nrth:motion',event=>{paused=(event as CustomEvent<{paused:boolean}>).detail.paused;if(paused&&frame)settle();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame)settle();});
  window.addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame);});
});
