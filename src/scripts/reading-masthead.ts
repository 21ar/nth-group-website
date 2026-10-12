export {};

const masthead=document.querySelector<HTMLElement>('.masthead');
const bar=masthead?.querySelector<HTMLElement>('.masthead-bar');
const introduction=document.querySelector<HTMLElement>('main > section');
let frame=0;

function updateReadingSurface(){
 frame=0;
 if(!masthead||!bar||!introduction)return;
 const height=bar.getBoundingClientRect().height;
 const opening=introduction.matches('.matter-story')&&!introduction.classList.contains('matter-ready')?introduction.querySelector<HTMLElement>('.matter-stage')||introduction:introduction;
 const reading=opening.getBoundingClientRect().bottom<=height;
 masthead.toggleAttribute('data-reading-surface',reading);
 if(!reading||masthead.querySelector('details[open]'))return;
 const point=Math.min(innerHeight-1,height+2);
 let surface:Element|null=document.elementsFromPoint(innerWidth/2,point).find(element=>!masthead.contains(element)&&!element.closest('.skip-link'))||document.documentElement;
 let color='rgb(237, 237, 233)',channels=[237,237,233];
 while(surface){
  const background=getComputedStyle(surface).backgroundColor;
  const values=background.match(/^rgba?\(([^)]+)\)$/)?.[1].split(',').map(Number);
  if(values&&values.length>=3&&(values.length<4||values[3]===1)){color=background;channels=values.slice(0,3);break;}
  surface=surface.parentElement;
 }
 const luminance=channels.map(value=>{const s=value/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;}).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
 masthead.style.setProperty('--reading-surface',color);
 masthead.style.setProperty('--reading-ink',luminance>.3?'#17181a':'#f2f0e9');
}
function schedule(){if(!frame)frame=requestAnimationFrame(updateReadingSurface);}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
addEventListener('pageshow',schedule);
addEventListener('nrth:motion',schedule);
masthead?.querySelector('details')?.addEventListener('toggle',schedule);
if(introduction)new MutationObserver(schedule).observe(introduction,{attributes:true,attributeFilter:['class','data-mode']});
schedule();
