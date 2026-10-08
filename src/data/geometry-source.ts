// Authoring source. Generated geometry is baked before publication, not computed by visitors.
type V=[number,number,number];
const N=192,TAU=Math.PI*2;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
// Outlines traced from the supplied logo: the R has its signature open counter.
import { glyphs } from './brand';
export { glyphs } from './brand';

function arc(points:V[]):V[]{
 const distances=[0];for(let j=1;j<=points.length;j++){const a=points[j-1],b=points[j%points.length];distances.push(distances[j-1]+Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]));}
 let j=0;return Array.from({length:N},(_,i)=>{const distance=i/N*distances[distances.length-1];while(j<points.length-1&&distances[j+1]<distance)j++;const a=points[j],b=points[(j+1)%points.length],t=(distance-distances[j])/(distances[j+1]-distances[j]||1);return a.map((v,k)=>mix(v,b[k],t)) as V;});
}
function pathSamples(d:string,offset=0,scale=1):V[]{const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);const length=path.getTotalLength();return Array.from({length:N},(_,j)=>{const p=path.getPointAtLength(j/N*length);return[p.x*scale+offset,(-p.y+.3)*scale,0];});}
function letter(i:number):V[]{return pathSamples(glyphs[i]).map(p=>[p[0],p[1]-.3,p[2]]);}
function heart(i:number):V[]{return pathSamples('M-.2 -.6 C-1.8 -2.7 -3.8 -.1 -1.6 1.8 C-.6 2.7 -.2 3 0 3 C.2 3 .6 2.7 1.6 1.8 C3.8 -.1 1.8 -2.7 .2 -.6 Q0 -.3 -.2 -.6 Z',0,1-i*.19).map(p=>[p[0],p[1],(i-1.5)*.35]);}
function form(a:number,i:number,state:number):V{
 const c=Math.cos(a),s=Math.sin(a),shift=(i-1.5);
 if(state===1)return[c*.91+shift*2.12,s*.91,.12*shift];
 if(state===2||state===9){const d=1+s*s,r=1+shift*.075;return[4*c/d*r,3.6*s*c/d*r,.48*s+shift*.22];}
 if(state===3){const r=1-i*.19;return[.155*16*s*s*s*r,(.155*(13*c-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))+.3)*r,shift*.35+.3*s];}
 // Four distinct closed routes share two junctions, rather than nested ovals.
 if(state===4){return[2.65*c+.18*s,1.08*s+shift*.4*s*s+.32*Math.sin(2*a)*(i%2?1:-1),shift*.18+.48*s];}
 if(state===5){const x=2.05*Math.sign(c)*Math.pow(Math.abs(c),.35),y=1.65*Math.sign(s)*Math.pow(Math.abs(s),.35),angle=shift*.24;return[x*Math.cos(angle)-y*Math.sin(angle)+shift*.32,x*Math.sin(angle)+y*Math.cos(angle)+shift*.12,shift*.3];}
 // Three distinct orbital planes surround a fourth, small nucleus ring.
 // The previous fourth orbit duplicated the first at a 180-degree rotation.
 if(state===6){if(i===3)return[.43*c,.43*s,.12];const angle=i*Math.PI/3;return[2.65*c*Math.cos(angle)-.72*s*Math.sin(angle),2.65*c*Math.sin(angle)+.72*s*Math.cos(angle),1.05*s];}
 if(state===7){const r=2.4-i*.42;return[r*c,(s>=0?s*2.2:s*.4)+(i-1.5)*.12,.3*c+shift*.32];}
 return[c*(2.5-i*.4),s*(2.5-i*.4),.65*s*Math.sin(i*.7)+shift*.32];
}
const poses:V[][][]= [];
export async function buildGeometry(){
 // Yield between strands to keep the authoring browser responsive.
 for(let state=0;state<10;state++){
  poses[state]=[];
  for(let i=0;i<4;i++){
   let next=state===0?letter(i):state===3?heart(i):arc(Array.from({length:768},(_,j)=>form(j/768*TAU,i,state)));
   // SVG letter outlines use screen coordinates. Align their winding with
   // the circular poses before phase matching so interpolation cannot fold.
   const area=next.reduce((sum,a,j)=>{const b=next[(j+1)%N];return sum+a[0]*b[1]-b[0]*a[1];},0);
   if(area<-.001)next.reverse();
   let phase=0;
   if(state>0){const previous=poses[state-1][i];let best=Infinity;
    for(let offset=0;offset<N;offset++){let distance=0;for(let j=0;j<N;j+=4){const a=previous[j],b=next[(j+offset)%N];distance+=(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;}if(distance<best){best=distance;phase=offset;}}
   }
   poses[state][i]=next.map((_,j)=>next[(j+phase)%N]);
   const scheduler=(globalThis as unknown as {scheduler?:{yield:()=>Promise<void>}}).scheduler;
   await(scheduler?scheduler.yield():new Promise<void>(resolve=>setTimeout(resolve,0)));
  }
 }
 return poses;
}
