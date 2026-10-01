export {};
import { geometry } from '../data/geometry-baked';
// One topology, four continuous strands. Every pose is sampled by arc length,
// phase aligned, then drawn as a periodic cubic spline: no image handoff or cuts.
type V=[number,number,number];
const host=document.querySelector<HTMLElement>('[data-hero-scene]');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const N=192,TAU=Math.PI*2;
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{n=clamp(n);return n*n*n*(n*(n*6-15)+10);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const names=['Identity / N–R–T–H','A shared foundation','Infinite possibility','Care / a human connection','Mobility / a way forward','Systems / a shared frame','Materials / a new composition','Events / a gathering place','Labs / a different perspective','The next connection'];
const poses:V[][][]= [];
function prepare(){
 const bytes=Uint8Array.from(atob(geometry),c=>c.charCodeAt(0)),data=new Int16Array(bytes.buffer);
 let offset=0;for(let state=0;state<10;state++){poses[state]=[];for(let strand=0;strand<4;strand++){poses[state][strand]=[];for(let j=0;j<N;j++)poses[state][strand].push([data[offset++]/1000,data[offset++]/1000,data[offset++]/1000]);}}
}
let progress=0,paintedProgress=-1,frame=0,last=0,lastDraw=0,slow=0,quality=1,visible=true,paused=reduced.matches||document.documentElement.classList.contains('motion-paused');
let px=0,py=0,x=0,y=0,w=innerWidth,h=innerHeight;
let chapterEnds:number[]=[];let navTop=0;
let canvas:HTMLCanvasElement|undefined,ctx:CanvasRenderingContext2D|null=null;
function spline(points:V[],start:number,count:number){
 if(!ctx)return;const get=(j:number)=>points[(j+N)%N];const first=get(start);ctx.beginPath();ctx.moveTo(first[0],first[1]);
 for(let j=start;j<start+count;j++){const p0=get(j-1),p1=get(j),p2=get(j+1),p3=get(j+2);ctx.bezierCurveTo(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6,p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6,p2[0],p2[1]);}
}
function draw(time:number,delta:number){
 if(!ctx||!canvas||!host)return;
 const phase=progress*9,index=Math.min(8,Math.floor(phase)),blend=ease(phase-index),travel=ease(clamp(progress/(1/9)));
 const mobile=w<768;
 // Reserve real layout space for copy and controls before placing the sculpture.
 const openingTop=Math.max((chapterEnds[0]||h*.4)+24,h*.49),openingBottom=h-(mobile?120:90);
 const current=Math.min(9,index),next=Math.min(9,index+1);
 const copyBottom=mix(chapterEnds[current]||h*.4,chapterEnds[next]||h*.4,blend);
 const destinationTop=mobile?copyBottom+32:h*.18;
 const destinationBottom=mobile?navTop-38:Math.min(navTop-48,h*.74);
 const move=ease(clamp((phase-.47)/.53));
 const box={left:mix(w*.035,mobile?w*.09:w*.55,move),right:mix(w*.965,mobile?w*.91:w*.94,move),top:mix(openingTop,destinationTop,move),bottom:mix(openingBottom,destinationBottom,move)};
 const cx=(box.left+box.right)/2,cy=(box.top+box.bottom)/2;
 const smoothing=1-Math.exp(-delta/180);x+=(px*.23-x)*smoothing;y+=(py*.15-y)*smoothing;
 const turn=x+Math.sin(time*.00016)*.035*travel,tilt=y+Math.sin(time*.00012)*.035*travel;
 ctx.resetTransform();ctx.clearRect(0,0,canvas.width,canvas.height);
 const chunks:{points:V[];start:number;depth:number}[]=[],curves:V[][]=[];
 for(let i=0;i<4;i++){
 const points=poses[index][i].map((a,j)=>{const b=poses[index+1][i][j];let xx=mix(a[0],b[0],blend),yy=mix(a[1],b[1],blend),zz=mix(a[2],b[2],blend);const tx=xx*Math.cos(turn)+zz*Math.sin(turn),tz=-xx*Math.sin(turn)+zz*Math.cos(turn);const ty=yy*Math.cos(tilt)-tz*Math.sin(tilt);zz=yy*Math.sin(tilt)+tz*Math.cos(tilt);const perspective=1/(1-zz*.05);return[tx*perspective,-ty*perspective,zz] as V;});
 curves.push(points);
 }
 const world=curves.flat(),minX=Math.min(...world.map(p=>p[0])),maxX=Math.max(...world.map(p=>p[0])),minY=Math.min(...world.map(p=>p[1])),maxY=Math.max(...world.map(p=>p[1]));
 const scale=Math.min((box.right-box.left-32)/(maxX-minX),(Math.max(64,box.bottom-box.top)-32)/(maxY-minY));
 const centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
 curves.forEach(points=>{points.forEach(p=>{p[0]=cx+(p[0]-centerX)*scale;p[1]=cy+(p[1]-centerY)*scale;});for(let start=0;start<N;start+=N/4){const depth=points.slice(start,start+N/4).reduce((sum,p)=>sum+p[2],0)/(N/4);chunks.push({points,start,depth});}});
 const all=curves.flat(),left=Math.min(...all.map(p=>p[0]))-16,top=Math.min(...all.map(p=>p[1]))-16;
 const bw=Math.max(...all.map(p=>p[0]))-left+16,bh=Math.max(...all.map(p=>p[1]))-top+16;
 canvas.style.width=`${bw}px`;canvas.style.height=`${bh}px`;canvas.style.translate=`${left}px ${top}px`;
 ctx.setTransform(canvas.width/bw,0,0,canvas.height/bh,-left*canvas.width/bw,-top*canvas.height/bh);
 const metal=ctx.createLinearGradient(cx-scale*3,cy-scale*2,cx+scale*3,cy+scale*2);
 [['0','#565b65'],['.18','#d6d9df'],['.32','#959ba6'],['.43','#f4f4f7'],['.47','#fdfdff'],['.51','#505663'],['.58','#8e95a1'],['.78','#e9ebef'],['1','#555a65']].forEach(([stop,color])=>metal.addColorStop(Number(stop),color));
 const thickness=Math.max(mobile?4.5:6,scale*.068);ctx.lineCap='butt';ctx.lineJoin='round';
 ctx.shadowBlur=0;ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;
 chunks.sort((a,b)=>a.depth-b.depth).forEach(({points,start})=>{
 if(!ctx)return;spline(points,start,N/4);
 ctx.globalAlpha=1;ctx.strokeStyle=metal;ctx.lineWidth=thickness;ctx.stroke();
 });ctx.globalAlpha=1;
 // A travelling point makes the route and orbital connections legible without
 // introducing a separate object or changing topology between chapters.
 const signal=ease(clamp((progress-.25)/.08))*(1-ease(clamp((progress-.93)/.07)));
 if(signal>0)curves.forEach((points,i)=>{if(!ctx)return;const t=(time*.000035+i/4)%1,pos=t*N,j=Math.floor(pos),a=points[j],b=points[(j+1)%N],f=pos-j;ctx.globalAlpha=signal*.75;ctx.beginPath();ctx.arc(mix(a[0],b[0],f),mix(a[1],b[1],f),Math.max(2,thickness*.34),0,TAU);ctx.fillStyle='#fff';ctx.shadowBlur=12;ctx.shadowColor='#d3dcff';ctx.fill();});ctx.globalAlpha=1;ctx.shadowBlur=0;
 const caption=document.querySelector<HTMLElement>('.shape-caption');if(caption)caption.style.opacity=String(ease(clamp((phase-.8)/.2)));
 paintedProgress=progress;
 host.dataset.renderedProgress=progress.toFixed(4);host.dataset.pose=String(Math.round(phase));host.dataset.blend=blend.toFixed(4);host.dataset.renderMs=(performance.now()-time).toFixed(2);
 const number=document.querySelector('[data-shape-number]'),name=document.querySelector('[data-shape-name]');const label=names[Math.round(phase)],count=String(Math.round(phase)+1).padStart(2,'0');if(number&&number.textContent!==count)number.textContent=count;if(name&&name.textContent!==label)name.textContent=label;
}
function resize(){chapterEnds=Array.from(document.querySelectorAll<HTMLElement>('[data-story-chapter]'),el=>el.offsetTop+el.offsetHeight);navTop=document.querySelector<HTMLElement>('.industry-nav')?.offsetTop||innerHeight-160;host?.style.setProperty('--identity-top',`${Math.max((chapterEnds[0]||innerHeight*.4)+24,innerHeight*.49)}px`);w=host?.clientWidth||innerWidth;h=host?.clientHeight||innerHeight;if(canvas){const ratio=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(Math.min(w*ratio,900)*quality);canvas.height=Math.round(Math.min(h*.65*ratio,500)*quality);draw(performance.now(),16);}}
function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;}
function loop(time:number){frame=0;if(paused||!visible||document.hidden)return;const delta=last?Math.min(time-last,100):16;last=time;slow=delta>28?slow+1:Math.max(0,slow-1);if(slow>=4&&quality===1){quality=.82;resize();if(host)host.dataset.quality='adaptive';}if((quality===1||time-lastDraw>=31)&&(progress>.001||progress!==paintedProgress||Math.abs(px*.23-x)+Math.abs(py*.15-y)>.0002)){draw(time,Math.min(time-lastDraw||delta,100));lastDraw=time;}frame=requestAnimationFrame(loop);}
function start(){if(!host||paused)return;if(poses[9]?.length!==4)prepare();if(!canvas){canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');ctx=canvas.getContext('2d');host.querySelector('.scene-canvas')?.append(canvas);resize();}host.dataset.sceneState=ctx?'ready':'fallback';host.dataset.renderer='spline';host.dataset.quality=quality<1?'adaptive':'continuous';if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(loop);}
window.addEventListener('nrth:story',((event:CustomEvent<{progress:number;dark:number}>)=>{progress=event.detail.progress;})as EventListener);
function sync(){paused=reduced.matches||document.documentElement.classList.contains('motion-paused');if(paused){stop();if(host)host.dataset.sceneState='fallback';}else start();}
if(host){new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();},{threshold:.01}).observe(host);host.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;px=e.clientX/w-.5;py=e.clientY/h-.5;});host.addEventListener('pointerleave',()=>{px=py=0;});}
window.addEventListener('nrth:motion',sync);reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',()=>document.hidden?stop():start());window.addEventListener('pagehide',stop);window.addEventListener('pageshow',sync);start();

document.fonts.ready.then(resize);
