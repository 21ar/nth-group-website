export const matterForms = ['mineral','dispersed','Mobility','Health','Systems','Materials','Events','Research'] as const;
export type MatterForm = typeof matterForms[number];
export type MatterPose = {position: Float32Array; direction: Float32Array; size: Float32Array; inspection:Float32Array};
export const smooth = (n:number) => {const t=Math.max(0,Math.min(1,n));return t*t*t*(t*(t*6-15)+10);};
const random = (i:number,k:number) => {const n=Math.sin(i*127.1+k*311.7)*43758.5453;return n-Math.floor(n);};
const normalize = (x:number,y:number,z:number) => {const d=Math.hypot(x,y,z)||1;return [x/d,y/d,z/d];};
export function createPose(count:number):MatterPose{return {position:new Float32Array(count*3),direction:new Float32Array(count*3),size:new Float32Array(count*3),inspection:new Float32Array(count*3)};}
/** Features follow real routes, boundaries, bonds and moments instead of array thirds. */
export function inspectGroupFor(form:MatterForm,index:number,count:number):number {
  if(form==='Mobility')return index%3;
  if(form==='Health'){
    const u=Math.floor(index/2)/Math.max(1,Math.ceil(count/2)-1);
    return u<.3?0:u<.7?1:2;
  }
  if(form==='Systems'){
    const edge=index%27,axis=Math.floor(edge/9),cross=edge%9;
    if(axis<2&&Math.floor(cross/3)===2)return 0;
    return cross%3!==1&&Math.floor(cross/3)!==1?1:2;
  }
  if(form==='Materials'){const edge=index%6;return edge<3?0:edge<5?1:2;}
  if(form==='Events'){const row=index%4;return row===1?0:row===3?2:1;}
  if(form==='Research'){
    const u=Math.floor(index/9)/Math.max(1,Math.ceil(count/9)-1);
    return u<.25?0:u<.72?1:2;
  }
  return index%3;
}
export function createMatter(form:MatterForm,count:number):MatterPose {
  if(!Number.isInteger(count)||count<48||count>2048)throw new RangeError('A matter field needs 48–2048 fragments.');
  const out=createPose(count);
  const waveform=[[-1,.04],[-.48,.04],[-.35,-.08],[-.23,.72],[-.08,-.55],[.05,.25],[.22,.04],[1,.04]];
  const careline=waveform.map(([x,y])=>[x*2.6,y*2.1]);
  const lengths=[0];for(let j=1;j<careline.length;j++)lengths.push(lengths[j-1]+Math.hypot(careline[j][0]-careline[j-1][0],careline[j][1]-careline[j-1][1]));
  const careLength=lengths[lengths.length-1];
  for(let i=0;i<count;i++){
    const a=random(i,1),b=random(i,2),c=random(i,3);
    let x=0,y=0,z=0,dx=0,dy=1,dz=0,w=.12,l=1,h=.12;
    if(form==='mineral'){
      const angle=a*Math.PI*2,vertical=b*2-1,radial=Math.sqrt(1-vertical*vertical);
      const r=.28+Math.pow(c,.65)*1.05;
      x=Math.cos(angle)*radial*r;y=vertical*r*1.12;z=Math.sin(angle)*radial*r;
      const axis=i%5;
      [dx,dy,dz]=normalize(axis<3?.35+(a-.5)*.65:axis===3?1:-.55,axis<3?1+(b-.5)*.4:axis===3?.15:.7,axis<3?.25+(c-.5)*.65:axis===3?-.3:1);
      w=.11+random(i,5)*.09;h=w;l=.58+random(i,6)*1.12;
      if(i%17===0){x*=1.72;y*=1.72;z*=1.35;l*=.64;w*=.7;h=w;}
    }else if(form==='dispersed'){
      x=a*4.2-.55;y=(b-.5)*4.8;z=(c-.5)*3.2;
      [dx,dy,dz]=normalize(a-.5,b-.5,c-.5);w=.055;l=.2+random(i,6)*.38;h=w;
    }else if(form==='Mobility'){
      const lane=i%3,pt=Math.floor(i/3)/(Math.ceil(count/3)-1),u=pt*2-1;
      x=u*2.45;y=(lane-1)*(.35+1.25*smooth(pt));z=Math.sin(u*1.6+lane*.5)*.72;
      [dx,dy,dz]=normalize(2.45,(lane-1)*1.15,.95*Math.cos(u*1.6+lane*.5));
      w=.18;l=.14+5.5/(count/3);h=.2;
    }else if(form==='Health'){
      const lane=i%2,steps=Math.ceil(count/2),distance=Math.floor(i/2)/(steps-1)*careLength;
      let segment=0;while(segment<careline.length-2&&distance>lengths[segment+1])segment++;
      const [start,end]=[careline[segment],careline[segment+1]],ratio=(distance-lengths[segment])/(lengths[segment+1]-lengths[segment]);
      x=start[0]+ratio*(end[0]-start[0]);y=start[1]+ratio*(end[1]-start[1]);z=(lane-.5)*.38;
      [dx,dy,dz]=normalize(end[0]-start[0],end[1]-start[1],0);
      w=.075;h=.09;l=.025+careLength/(steps-1);
    }else if(form==='Systems'){
      const edge=i%27,axis=Math.floor(edge/9),cross=edge%9,slot=Math.floor(i/27);
      const steps=Math.floor(count/27)+Number(edge<count%27);
      const u=(slot+.5)/steps*3.05-1.525,a1=(cross%3-1)*1.525,a2=(Math.floor(cross/3)-1)*1.525;
      [x,y,z]=axis===0?[u,a1,a2]:axis===1?[a1,u,a2]:[a1,a2,u];
      [dx,dy,dz]=axis===0?[1,0,0]:axis===1?[0,1,0]:[0,0,1];w=.065;h=.065;l=3.05/steps+.025;
    }else if(form==='Materials'){
      const cell=Math.floor(i/6),edge=i%6,layers=Math.ceil(count/54);
      const center=[(cell%3-1)*1.06,(Math.floor(cell/3)%3-1)*1.06,(Math.floor(cell/9)-(layers-1)/2)*1.06];
      const vertices=[[.48,.48,.48],[-.48,-.48,.48],[-.48,.48,-.48],[.48,-.48,-.48]];
      const pairs=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],start=vertices[pairs[edge][0]],end=vertices[pairs[edge][1]];
      x=center[0]+(start[0]+end[0])*.5;y=center[1]+(start[1]+end[1])*.5;z=center[2]+(start[2]+end[2])*.5;
      [dx,dy,dz]=normalize(end[0]-start[0],end[1]-start[1],end[2]-start[2]);w=.055;h=.055;l=1.18;
    }else if(form==='Events'){
      const row=i%4,u=Math.floor(i/4)/(Math.ceil(count/4)-1);
      x=(u-.5)*5.2;z=(row-1.5)*.34;l=.22+Math.pow(Math.sin(u*Math.PI),1.6)*(1.05+.8*Math.sin(u*19+row*.3)**2);y=l*.5-.8;
      w=.063;h=.063;
    }else{
      const branch=i%9,u=Math.floor(i/9)/(Math.ceil(count/9)-1),angle=branch*Math.PI*2/9;
      const spread=.18+Math.pow(u,1.1)*1.75;
      x=Math.cos(angle)*spread;y=(u-.5)*3.5;z=Math.sin(angle)*spread;
      [dx,dy,dz]=normalize(Math.cos(angle)*1.5,2.3,Math.sin(angle)*1.5);w=.06;h=.06;l=.22+u*.35;
    }
    out.position.set([x,y,z],i*3);out.direction.set([dx,dy,dz],i*3);out.size.set([w,l,h],i*3);
    out.inspection[i*3+inspectGroupFor(form,i,count)]=1;
  }
  return out;
}
export function blendMatter(poses:MatterPose[],weights:number[],out:MatterPose){
  for(let i=0;i<out.position.length;i++){
    let p=0,d=0,s=0,inspection=0;
    for(let k=0;k<poses.length;k++){const weight=weights[k]||0;if(weight){p+=poses[k].position[i]*weight;d+=poses[k].direction[i]*weight;s+=poses[k].size[i]*weight;inspection+=poses[k].inspection[i]*weight;}}
    out.position[i]=p;out.direction[i]=d;out.size[i]=s;out.inspection[i]=inspection;
  }
  for(let i=0;i<out.direction.length;i+=3){const d=Math.hypot(out.direction[i],out.direction[i+1],out.direction[i+2]);if(d<.0001){out.direction[i]=0;out.direction[i+1]=1;out.direction[i+2]=0;}else{out.direction[i]/=d;out.direction[i+1]/=d;out.direction[i+2]/=d;}}
}
