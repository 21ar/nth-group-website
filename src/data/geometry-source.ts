// Authoring source. Generated geometry is baked before publication, not computed by visitors.
type V=[number,number,number];
const N=192,TAU=Math.PI*2;
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
// Outlines traced from the supplied logo: the R has its signature open counter.
export const glyphs=[
'M-5.01493 1.44776 L-5.01493 -1.13433 C-5.01493 -1.35821 -4.85075 -1.50746 -4.59701 -1.50746 C-4.40299 -1.52239 -4.25373 -1.44776 -4.14925 -1.26866 L-3.07463 0.55224 Q-2.97015 0.71642 -2.97015 0.56716 L-2.97015 -1.46269 Q-2.97015 -1.50746 -2.92537 -1.50746 L-2.47761 -1.50746 Q-2.43284 -1.50746 -2.43284 -1.46269 L-2.43284 1.1194 C-2.43284 1.38806 -2.56716 1.50746 -2.8209 1.50746 C-3.0597 1.50746 -3.1791 1.43284 -3.29851 1.23881 L-4.35821 -0.55224 Q-4.46269 -0.68657 -4.46269 -0.49254 L-4.46269 1.40299 Q-4.46269 1.44776 -4.52239 1.44776 Z',
'M-1.92537 -1.50746 L-0.95522 -1.50746 C-0.40299 -1.50746 0 -1.1194 0 -0.59701 C0 -0.19403 -0.23881 0.1194 -0.62687 0.26866 L0.23881 1.44776 L-0.38806 1.44776 L-1.19403 0.32836 L-1.41791 0.32836 L-1.41791 1.44776 L-1.92537 1.44776 L-1.92537 -0.1791 L-0.95522 -0.1791 C-0.67164 -0.1791 -0.52239 -0.32836 -0.52239 -0.58209 C-0.52239 -0.83582 -0.67164 -0.97015 -0.95522 -0.97015 L-1.92537 -0.97015 Z',
'M0.29851 -1.50746 L2.41791 -1.50746 Q2.46269 -1.50746 2.46269 -1.46269 L2.46269 -1.01493 Q2.46269 -0.97015 2.41791 -0.97015 L1.65672 -0.97015 L1.65672 1.40299 Q1.65672 1.44776 1.61194 1.44776 L1.14925 1.44776 Q1.10448 1.44776 1.10448 1.40299 L1.10448 -0.97015 L0.29851 -0.97015 Q0.25373 -0.97015 0.25373 -1.01493 L0.25373 -1.46269 Q0.25373 -1.50746 0.29851 -1.50746 Z',
'M2.85075 -1.50746 L3.28358 -1.50746 Q3.32836 -1.50746 3.32836 -1.44776 L3.32836 -0.29851 L4.47761 -0.29851 L4.47761 -1.50746 L5.01493 -1.50746 L5.01493 1.40299 Q5.01493 1.44776 4.97015 1.44776 L4.52239 1.44776 Q4.47761 1.44776 4.47761 1.40299 L4.47761 0.22388 L3.32836 0.22388 L3.32836 1.40299 Q3.32836 1.44776 3.28358 1.44776 L2.85075 1.44776 Q2.80597 1.44776 2.80597 1.40299 L2.80597 -1.44776 Q2.80597 -1.50746 2.85075 -1.50746 Z'];
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
 if(state===4){return[c*(2.55+shift*.12)+shift*.25,s*(1.14+shift*.16),shift*.28+.45*s];}
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
