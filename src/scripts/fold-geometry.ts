/** The same sampled sheet unfolds into every field. No object is swapped on scroll. */
export const foldFields = ['Mobility', 'Health', 'Systems', 'Materials', 'Events', 'Research'] as const;
export type FoldField = typeof foldFields[number];
export const sheetColors = ['#ff7654', '#b4a8e7', '#eee5d6'];
const tau = Math.PI * 2;
export const ease = (v: number) => { const t = Math.max(0, Math.min(1, v)); return t*t*t*(t*(t*6-15)+10); };

function point(pose: number, layer: number, u: number, v: number): number[] {
  const edge=v-.5;
  // Round open sheet corners along their own tangent, including curved endpoints.
  if([0,1,2,5,6].includes(pose)){
    const radius=.018,inset=radius*(1-Math.sqrt(Math.max(0,1-(edge*2)**8)));
    if(u<radius)u+=(1-ease(u/radius))*inset;
    else if(u>1-radius)u-=(1-ease((1-u)/radius))*inset;
  }
  const t=tau*u;
  let x=0, y=0, z=0, nx=0, ny=1, nz=0, width=1;
  if (pose === 0) {
    // Upright sheets share a rounded, sweeping horizon before opening out.
    x=-8.4+16.8*u+(layer===1?1.3:0);
    const arch=ease((u-.035)/.19)*(1-ease((u-.76)/.2));
    const top=layer===0 ? 1.0+1.4*Math.sin(Math.PI*u)+.6*u**4 : layer===1 ? 1.4+5.2*u**3 : 1.6+1.2*Math.sin(Math.PI*u);
    const bottom=-1.8+arch*(layer===1?2.4:layer===0?3.35:3.4);
    y=(top+bottom)/2;
    z=1.45*Math.sin(t*.8+.25)+2.2-layer*2.1;
    width=Math.max(.35,top-bottom); nz=.06*Math.sin(t);
  } else if (pose === 1) {
    x=-7.8+15.6*u; y=-1.8+.7*u+Math.sin(t*.7+layer*.28)*.45;
    z=2.3*Math.sin(t*.8+.2)+layer*.85-1;
    ny=.24+.65*ease((u-.72)/.28); nz=.97*(1-ease((u-.68)/.32)); width=1.1+layer*.1;
    y+=2.3*ease((u-.74)/.26);
  } else if (pose === 2) {
    const a=.15+t*.92+layer*.12, radius=2.6+layer*.38;
    x=3+Math.cos(a)*radius; y=-.1+Math.sin(a)*2.5; z=Math.sin(a+layer*.7)*1.3+layer*.5;
    nx=Math.cos(a); ny=Math.sin(a); nz=.3*Math.sin(a*2); width=.9;
  } else if (pose === 3) {
    const a=t+.1,rx=3.0+layer*.35,ry=2.1+layer*.07;
    const radius=((Math.cos(a)/rx)**4+(Math.sin(a)/ry)**4)**(-.25);
    x=3+radius*Math.cos(a); y=-.1+radius*Math.sin(a); z=layer*.75+.45*Math.sin(t*2);
    nx=(x-3)**3/rx**4; ny=(y+.1)**3/ry**4; nz=.05*Math.cos(t); width=.65;
  } else if (pose === 4) {
    const a=t+.1+layer*.15, radius=2.7+.38*Math.cos(t*3+layer*.25);
    x=3.1+radius*Math.cos(a); y=-.1+(2.15+.35*Math.cos(t*3))*Math.sin(a); z=1.1*Math.sin(t*2+layer*.8);
    nx=Math.cos(a); ny=Math.sin(a); nz=.35*Math.sin(t); width=.85;
  } else if (pose === 5) {
    const a=-.1+t*.95, radius=3.7-layer*.6;
    x=2.8+radius*Math.cos(a); y=-1.4+.4*Math.sin(a)+layer*.3; z=2.4*Math.sin(a)-layer*.35;
    nx=.12*Math.cos(a); ny=1; nz=.12*Math.sin(a); width=1.6;
  } else {
    x=-.3+7.5*u+layer*.35; y=-1.9+Math.sin(Math.PI*u)*(2.6+layer*.6); z=layer*.7+Math.cos(Math.PI*u)*1.5;
    nx=-.25*Math.cos(Math.PI*u); ny=.9; nz=.6*Math.sin(Math.PI*u); width=1.3;
  }
  // Softly rounded corners are part of the surface, not sharp ribbon end caps.
  if(pose>=2)y+=.7;
  const length=Math.hypot(nx,ny,nz);
  return [x+edge*width*nx/length, y+edge*width*ny/length, z+edge*width*nz/length];
}

export function makeSheet(pose: number, layer: number, segments=100, rows=10) {
  const positions=new Float32Array((segments+1)*(rows+1)*3);
  for(let u=0;u<=segments;u++) for(let v=0;v<=rows;v++) positions.set(point(pose,layer,u/segments,v/rows),(u*(rows+1)+v)*3);
  return positions;
}
export function makeIndices(segments: number, rows: number) {
  const indices=[];
  for(let u=0;u<segments;u++) for(let v=0;v<rows;v++) {const a=u*(rows+1)+v,b=a+rows+1;indices.push(a,b,a+1,b,b+1,a+1);}
  return indices;
}
export function makeSolidSheet(pose:number,layer:number,segments:number,rows:number){
  const surface=makeSheet(pose,layer,segments,rows),count=surface.length/3,solid=new Float32Array(surface.length*2);
  for(let u=0;u<=segments;u++)for(let v=0;v<=rows;v++){
    const closed=[3,4].includes(pose),leftU=closed&&u===0?segments-1:Math.max(0,u-1),rightU=closed&&u===segments?1:Math.min(segments,u+1);
    const i=(u*(rows+1)+v)*3,left=(leftU*(rows+1)+v)*3,right=(rightU*(rows+1)+v)*3,low=(u*(rows+1)+Math.max(0,v-1))*3,high=(u*(rows+1)+Math.min(rows,v+1))*3;
    const ax=surface[right]-surface[left],ay=surface[right+1]-surface[left+1],az=surface[right+2]-surface[left+2],bx=surface[high]-surface[low],by=surface[high+1]-surface[low+1],bz=surface[high+2]-surface[low+2];
    const normal=[ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx],length=Math.hypot(...normal)||1;
    for(let axis=0;axis<3;axis++){const offset=normal[axis]/length*.025;solid[i+axis]=surface[i+axis]+offset;solid[count*3+i+axis]=surface[i+axis]-offset;}
  }
  return solid;
}
export function makeSolidIndices(segments:number,rows:number){
  const front=makeIndices(segments,rows),count=(segments+1)*(rows+1),indices=front.slice();
  for(let i=0;i<front.length;i+=3)indices.push(front[i+2]+count,front[i+1]+count,front[i]+count);
  const border=[];for(let u=0;u<=segments;u++)border.push(u*(rows+1));for(let v=1;v<=rows;v++)border.push(segments*(rows+1)+v);for(let u=segments-1;u>=0;u--)border.push(u*(rows+1)+rows);for(let v=rows-1;v>0;v--)border.push(v);
  for(let i=0;i<border.length;i++){const a=border[i],b=border[(i+1)%border.length];indices.push(a,a+count,b,b,a+count,b+count);}
  return indices;
}
export function blendSheet(output: Float32Array, opening: Float32Array, from: Float32Array, to: Float32Array, unfold: number, selection: number) {
  const p=ease(unfold), q=ease(selection);
  for(let i=0;i<output.length;i++) output[i]=opening[i]+(from[i]+(to[i]-from[i])*q-opening[i])*p;
}
export function blendWeightedSheet(output:Float32Array,poses:Float32Array[],unfold:number,weights:number[]){
  const p=ease(unfold);
  for(let i=0;i<output.length;i++){let value=0;for(let j=0;j<weights.length;j++)if(weights[j]>0)value+=poses[j+1][i]*weights[j];output[i]=poses[0][i]+(value-poses[0][i])*p;}
}
