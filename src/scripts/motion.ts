const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const story = document.querySelector<HTMLElement>('[data-story]');
const chapters = [...document.querySelectorAll<HTMLElement>('[data-story-chapter]')];
const storyProjects = document.querySelector<HTMLElement>('[data-story-projects]');
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (a: number, b: number, v: number) => { const p = clamp((v-a)/(b-a)); return p*p*(3-2*p); };
let disabled = reduce.matches || root.classList.contains('motion-paused');
let progress = 0;
let target = 0;
let frame = 0;
let currentChapter = -1;
let lastPaint = 0;
let pointerX=0,pointerY=0,pointerTargetX=0,pointerTargetY=0;
let storyStart=0,storyRange=1,galleryTop=0,galleryHeight=1;
let featureMetrics: { element: HTMLElement; top: number; height: number }[]=[];
const features = [...document.querySelectorAll<HTMLElement>('[data-scroll-feature]')];
const gallery = document.querySelector<HTMLElement>('.showcase-section');
function measure(){
 if(story){const box=story.getBoundingClientRect();storyStart=box.top+scrollY;storyRange=Math.max(1,box.height-innerHeight);}
 if(gallery){const box=gallery.getBoundingClientRect();galleryTop=box.top+scrollY;galleryHeight=box.height;}
 featureMetrics=features.map(element=>{const box=element.getBoundingClientRect();return{element,top:box.top+scrollY,height:box.height};});
}

function paint(time: number) {
  frame = 0;
  if (disabled) return;
  const delta = lastPaint ? Math.min(time-lastPaint,160) : 16;
  lastPaint = time;
  progress += (target-progress)*(1-Math.exp(-delta/70));
  if (Math.abs(target-progress)<.0002) progress=target;
  pointerX+=(pointerTargetX-pointerX)*(1-Math.exp(-delta/90));
  pointerY+=(pointerTargetY-pointerY)*(1-Math.exp(-delta/90));
  if (story) {
    const dark = smooth(.145,.19,progress)*(1-smooth(.925,.975,progress));
    story.style.setProperty('--story-dark',String(dark));
    story.style.setProperty('--story-progress',String(progress));
    // Interpolate the entire palette: no threshold-based colour flashes.
    const contrast = dark<.5?0:1;
    const shade=(a:number,b:number)=>Math.round(a+(b-a)*contrast);
    story.style.setProperty('--story-fg',`rgb(${shade(23,244)} ${shade(24,243)} ${shade(28,247)})`);
    story.style.setProperty('--story-muted',`rgb(${shade(93,187)} ${shade(94,190)} ${shade(103,201)})`);
    const phase=progress*9,active=Math.round(phase);
    chapters.forEach((chapter,i)=>{
      const distance=Math.abs(phase-i),weight=(1-smooth(.18,.47,distance))*(1-Math.pow(Math.sin(Math.PI*dark),8));
      chapter.style.opacity=String(weight);
      chapter.style.transform=`translate3d(0,${(phase-i)*-30}px,0)`;
    });
    if(active!==currentChapter){currentChapter=active;chapters.forEach((chapter,i)=>{chapter.inert=i!==active;chapter.setAttribute('aria-hidden',String(i!==active));});story.dataset.chapter=String(active);}
    const nav=story.querySelector<HTMLElement>('.industry-nav');
    if(nav){const shown=smooth(.17,.27,progress);nav.style.opacity=String(shown);nav.inert=shown<.9;nav.setAttribute('aria-hidden',String(shown<.9));nav.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-current',String(active===i+3)));}
    const aside=story.querySelector<HTMLElement>('.brand-aside');if(aside)aside.style.opacity=String(1-smooth(.005,.025,progress));
    const bar=story.querySelector<HTMLElement>('[data-story-progress]');if(bar)bar.style.transform=`scaleX(${progress})`;
    const label=story.querySelector('[data-story-label]');if(label)label.textContent=active<3?'Scroll to discover':active<9?'Explore the connections':'Continue to the ventures';
    story.dataset.motionProgress=progress.toFixed(4);
    window.dispatchEvent(new CustomEvent('nrth:story',{detail:{progress,dark}}));
  }
  const vh=innerHeight;
  if(gallery){const top=galleryTop-scrollY;const entrance=clamp((vh-top)/(vh*.7));gallery.style.setProperty('--gallery-in',String(entrance));gallery.style.setProperty('--gallery-drift',String(clamp((vh-top)/(vh+galleryHeight))));}
  featureMetrics.forEach(({element,top,height})=>{const relativeTop=top-scrollY;if(relativeTop+height<0||relativeTop>vh)return;const p=clamp((vh-relativeTop)/(vh+height));element.style.setProperty('--feature-progress',String(p));});
  if(Math.abs(target-progress)>.0002||Math.abs(pointerTargetX-pointerX)+Math.abs(pointerTargetY-pointerY)>.001)frame=requestAnimationFrame(paint);
}
function update(){
  if(disabled)return;
  if(story)target=clamp((scrollY-storyStart)/storyRange);
  if(!frame)frame=requestAnimationFrame(paint);
}
function sync(){const wasDisabled=disabled; const wasProgress=progress,previousEnd=storyStart+storyRange+innerHeight;disabled=reduce.matches||root.classList.contains('motion-paused');root.classList.toggle('motion-active',!disabled);measure();if(disabled){if(frame)cancelAnimationFrame(frame);frame=0;progress=0;target=0;chapters.forEach((chapter,i)=>{chapter.inert=i!==0;chapter.setAttribute('aria-hidden',String(i!==0));chapter.style.removeProperty('opacity');chapter.style.removeProperty('transform');});if(storyProjects){storyProjects.inert=true;storyProjects.setAttribute('aria-hidden','true');}story?.style.removeProperty('--story-bg');story?.style.removeProperty('--story-dark');story?.style.removeProperty('--story-fg');story?.style.removeProperty('--story-muted');const kicker=story?.querySelector<HTMLElement>('.story-kicker');if(kicker)kicker.style.transform='none';if(!wasDisabled&&wasProgress>.01&&story&&scrollY<previousEnd)window.scrollTo({top:story.offsetTop,behavior:'instant'});}else update();}
window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',()=>{measure();update();});window.addEventListener('nrth:motion',sync);reduce.addEventListener('change',sync);sync();

// Native scroll remains in control. Industry selectors move along the same timeline.
document.querySelectorAll<HTMLButtonElement>('[data-industry]').forEach(button=>{
 button.addEventListener('click',()=>{if(disabled)return;measure();window.scrollTo({top:storyStart+storyRange*(Number(button.dataset.industry)+3)/9,behavior:'smooth'});});
});

// Fine-pointer effects are compositor transforms, always reset on leave or pause.
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const interactive=[...document.querySelectorAll<HTMLElement>('.explorer-image,.project-card-image,.editorial-image,.venture-art')];
interactive.forEach(element=>{
 let id=0,px=0,py=0,x=0,y=0,last=0;
 function tick(time:number){id=0;if(disabled||!fine.matches)return;const delta=last?Math.min(time-last,100):16;last=time;const ease=1-Math.exp(-delta/100);x+=(px-x)*ease;y+=(py-y)*ease;element.style.setProperty('--pointer-x',String(x));element.style.setProperty('--pointer-y',String(y));if(Math.abs(px-x)+Math.abs(py-y)>.002)id=requestAnimationFrame(tick);}
 element.addEventListener('pointermove',event=>{if(disabled||!fine.matches)return;const box=element.getBoundingClientRect();px=clamp((event.clientX-box.left)/box.width,0,1)-.5;py=clamp((event.clientY-box.top)/box.height,0,1)-.5;if(!id)id=requestAnimationFrame(tick);});
 element.addEventListener('pointerleave',()=>{px=0;py=0;if(!id&&!disabled)id=requestAnimationFrame(tick);});
 window.addEventListener('nrth:motion',()=>{if(disabled){if(id)cancelAnimationFrame(id);id=0;x=y=px=py=0;element.style.removeProperty('--pointer-x');element.style.removeProperty('--pointer-y');}});
});
document.querySelectorAll<HTMLElement>('[data-magnetic],.explorer-controls button,.image-open,.editorial-image>span').forEach(element=>{
 element.addEventListener('pointermove',event=>{if(disabled||!fine.matches)return;const box=element.getBoundingClientRect();element.style.translate=`${(event.clientX-box.left-box.width/2)*.16}px ${(event.clientY-box.top-box.height/2)*.22}px`;});
 element.addEventListener('pointerleave',()=>{element.style.translate='0px 0px';});
 window.addEventListener('nrth:motion',()=>{if(disabled)element.style.translate='0px 0px';});
});

// Editorial line reveals retain the actual heading text in the document.
document.querySelectorAll<HTMLElement>('.showcase-heading h2,.connection-heading h2,.lab-copy h2,.editorial-heading h2').forEach(heading=>{
 const lines=heading.innerHTML.split(/<br\s*\/?\s*>/i);if(lines.length<2)return;
 heading.innerHTML=lines.map((line,i)=>`<span class="motion-line"><span style="--line-delay:${i*90}ms">${line}</span></span>`).join('\n');
});

if(story){story.addEventListener('pointermove',event=>{if(disabled||!fine.matches)return;const top=Math.min(0,storyStart+storyRange-scrollY);pointerTargetX=event.clientX/innerWidth-.5;pointerTargetY=(event.clientY-top)/innerHeight-.5;update();});story.addEventListener('pointerleave',()=>{pointerTargetX=pointerTargetY=0;update();});}


measure();document.fonts.ready.then(()=>{measure();update();});const layoutObserver=new ResizeObserver(()=>{measure();update();});if(document.querySelector('main'))layoutObserver.observe(document.querySelector('main')!);

