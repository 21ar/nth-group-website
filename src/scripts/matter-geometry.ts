export const matterForms = ['mineral','dispersed','Mobility','Health','Systems','Materials','Events','Research'] as const;
export type MatterForm = typeof matterForms[number];
/** The extra channels travel with the geometry, including interrupted blends. */
export type MatterPose = {
  position: Float32Array;
  direction: Float32Array;
  size: Float32Array;
  inspection?: Float32Array;
  seam?: Float32Array;
  twist?: Float32Array;
};
export const smooth = (n:number) => {const t=Math.max(0,Math.min(1,n));return t*t*t*(t*(t*6-15)+10);};
const normalize = (x:number,y:number,z:number) => {const d=Math.hypot(x,y,z)||1;return [x/d,y/d,z/d];};
const validCount = (count:number) => {if(!Number.isInteger(count)||count<48||count>2048)throw new RangeError('A matter field needs 48–2048 fragments.');};
export function createPose(count:number):MatterPose {
  return {
    position:new Float32Array(count*3),direction:new Float32Array(count*3),size:new Float32Array(count*3),
    inspection:new Float32Array(count*3),seam:new Float32Array(count),twist:new Float32Array(count),
  };
}

/**
 * The inspector follows authored features, rather than thirds of an instance array.
 * Mobility: three routes (planning, signals, handoffs).
 * Health: entry, information boundary, onward coordination along the pathways.
 * Systems: front interfaces, outer boundaries, inner links that can change.
 * Materials: application-facing, supporting and joining bonds in each cell.
 * Events: shared moment, transition rows, production row.
 * Research: common question, branching investigation, learning at the tips.
 */
export function inspectGroupFor(form:MatterForm,index:number,count:number):number {
  if(form==='Mobility')return index%3;
  if(form==='Health'){
    const u=Math.floor(index/3)/Math.max(1,Math.ceil(count/3)-1);
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

/** A closed, slightly folded ribbon; all layers share a recognizable central core. */
function corePoint(t:number,layer:number):number[] {
  const angle=t*Math.PI*2,phase=layer*Math.PI*2/3;
  const radius=1.06+.18*Math.cos(angle*3+phase);
  const x=Math.cos(angle)*radius,y=Math.sin(angle)*(1.5+.1*Math.sin(angle*2+phase)),z=.44*Math.sin(angle*2+phase);
  const turn=(layer-1)*.66,cos=Math.cos(turn),sin=Math.sin(turn);
  return [x*cos+z*sin,y,z*cos-x*sin];
}

export function createMatter(form:MatterForm,count:number):MatterPose {
  validCount(count);
  const out=createPose(count);
  for(let i=0;i<count;i++){
    let x=0,y=0,z=0,dx=0,dy=1,dz=0,w=.12,l=1,h=.12,seam=i/count,twist=0;
    if(form==='mineral'){
      // Three continuous ribbon surfaces replace the former random pile of rods.
      // A half-slot offset and small overlaps keep the closed seams smooth at low quality.
      const layer=i%3,slot=Math.floor(i/3),steps=Math.floor(count/3)+Number(layer<count%3),u=(slot+.5)/steps;
      const point=corePoint(u,layer),before=corePoint(u-.5/steps,layer),after=corePoint(u+.5/steps,layer);
      [x,y,z]=point;[dx,dy,dz]=normalize(after[0]-before[0],after[1]-before[1],after[2]-before[2]);
      w=.35+.16*Math.sin(u*Math.PI*2+layer*.7)**2;h=.075;
      l=Math.hypot(after[0]-before[0],after[1]-before[1],after[2]-before[2])+.055;
      seam=u;twist=.26*Math.sin(u*Math.PI*2+layer*.7);
    }else if(form==='dispersed'){
      // Evenly ordered trajectories keep the unfolding related to the original ribbon.
      const lane=i%3,slot=Math.floor(i/3),steps=Math.floor(count/3)+Number(lane<count%3),u=slot/Math.max(1,steps-1);
      const angle=u*Math.PI*2+lane*.72;
      x=(u-.5)*4.8;y=Math.sin(angle)*1.45+(lane-1)*.55;z=Math.cos(angle)*.8;
      [dx,dy,dz]=normalize(4.8,Math.cos(angle)*2.1,-Math.sin(angle)*1.1);
      w=.075;l=.18+4.5/steps;h=.075;seam=u;
    }else if(form==='Mobility'){
      const lane=i%3,pt=Math.floor(i/3)/Math.max(1,Math.ceil(count/3)-1),u=pt*2-1;
      x=u*2.45;y=(lane-1)*(.35+1.25*smooth(pt));z=Math.sin(u*1.6+lane*.5)*.72;
      [dx,dy,dz]=normalize(2.45,(lane-1)*1.15,.95*Math.cos(u*1.6+lane*.5));
      w=.18;l=.14+5.5/(count/3);h=.2;seam=pt;
    }else if(form==='Health'){
      // An information journey, not a clinical waveform: three paths meet at a boundary.
      const lane=i%3,steps=Math.ceil(count/3),u=Math.floor(i/3)/Math.max(1,steps-1),angle=u*Math.PI*2;
      x=(u-.5)*5.2;y=(lane-1)*(.4+.55*Math.cos(angle));z=.32*Math.sin(angle+lane*.55);
      [dx,dy,dz]=normalize(5.2,-(lane-1)*.55*Math.PI*2*Math.sin(angle),.32*Math.PI*2*Math.cos(angle+lane*.55));
      w=.145;h=.09;l=5.9/(steps-1)+.04;seam=u;
    }else if(form==='Systems'){
      const edge=i%27,axis=Math.floor(edge/9),cross=edge%9,slot=Math.floor(i/27);
      const steps=Math.floor(count/27)+Number(edge<count%27);
      const u=(slot+.5)/steps*3.05-1.525,a1=(cross%3-1)*1.525,a2=(Math.floor(cross/3)-1)*1.525;
      [x,y,z]=axis===0?[u,a1,a2]:axis===1?[a1,u,a2]:[a1,a2,u];
      [dx,dy,dz]=axis===0?[1,0,0]:axis===1?[0,1,0]:[0,0,1];w=.065;h=.065;l=3.05/steps+.025;seam=(slot+.5)/steps;
    }else if(form==='Materials'){
      const cell=Math.floor(i/6),edge=i%6,layers=Math.ceil(count/54);
      const center=[(cell%3-1)*1.06,(Math.floor(cell/3)%3-1)*1.06,(Math.floor(cell/9)-(layers-1)/2)*1.06];
      const vertices=[[.48,.48,.48],[-.48,-.48,.48],[-.48,.48,-.48],[.48,-.48,-.48]];
      const pairs=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],start=vertices[pairs[edge][0]],end=vertices[pairs[edge][1]];
      x=center[0]+(start[0]+end[0])*.5;y=center[1]+(start[1]+end[1])*.5;z=center[2]+(start[2]+end[2])*.5;
      [dx,dy,dz]=normalize(end[0]-start[0],end[1]-start[1],end[2]-start[2]);w=.055;h=.055;l=1.18;seam=(cell%9)/9+edge/54;
    }else if(form==='Events'){
      const row=i%4,u=Math.floor(i/4)/Math.max(1,Math.ceil(count/4)-1);
      x=(u-.5)*5.2;z=(row-1.5)*.34;l=.22+Math.pow(Math.sin(u*Math.PI),1.6)*(1.05+.8*Math.sin(u*19+row*.3)**2);y=l*.5-.8;
      w=.063;h=.063;seam=u;
    }else{
      const branch=i%9,u=Math.floor(i/9)/Math.max(1,Math.ceil(count/9)-1),angle=branch*Math.PI*2/9;
      const spread=.07+smooth((u-.18)/.72)*1.75;
      x=Math.cos(angle)*spread;y=(u-.5)*3.5;z=Math.sin(angle)*spread;
      const slope=(smooth((u+.012-.18)/.72)-smooth((u-.012-.18)/.72))*1.75/.024;
      [dx,dy,dz]=normalize(Math.cos(angle)*slope,3.5,Math.sin(angle)*slope);w=.07;h=.07;l=.09+3.85/(Math.ceil(count/9)-1);seam=u;
    }
    out.position.set([x,y,z],i*3);out.direction.set([dx,dy,dz],i*3);out.size.set([w,l,h],i*3);
    out.inspection![i*3+inspectGroupFor(form,i,count)]=1;out.seam![i]=seam;out.twist![i]=twist;
  }
  return out;
}

/** Canonical project order: Health, TMS, Telematics, Logistics, Systems, Labs, Chemicals, Fleet, Events. */
export const atlasForms:MatterForm[]=['Health','Mobility','Mobility','Mobility','Systems','Research','Materials','Mobility','Events'];
export function atlasGroupFor(index:number,count:number){return Math.min(8,Math.floor(index*9/count));}

/** Nine compact sculptures retain the original population at the end of the opening. */
export function createAtlas(count:number):MatterPose {
  validCount(count);
  const out=createPose(count),sources=atlasForms.map(form=>createMatter(form,108));
  for(let i=0;i<count;i++){
    const venture=atlasGroupFor(i,count),start=Math.ceil(venture*count/9),end=Math.ceil((venture+1)*count/9),steps=end-start,slot=i-start;
    const source=sources[venture],sample=Math.min(107,Math.floor((slot+.5)/steps*108)),o=i*3,s=sample*3;
    const column=venture%3,row=Math.floor(venture/3),cx=(column-1)*2.15,cy=(1-row)*1.52;
    let x=source.position[s],y=source.position[s+1],z=source.position[s+2];
    // Four movement ventures remain recognizable as separate miniatures.
    if(venture===2){const u=slot/Math.max(1,steps-1),angle=u*Math.PI*2;x=Math.cos(angle)*1.4;y=Math.sin(angle)*1.4;z=slot%3*.12;}
    if(venture===3){x=(slot/Math.max(1,steps-1)-.5)*4.6;y=Math.sin(slot*.85)*.62;z=(slot%2-.5)*.22;}
    if(venture===7){const lane=slot%3;x=(lane-1)*1.65;y=(Math.floor(slot/3)/Math.max(1,Math.ceil(steps/3)-1)-.5)*2.7;z=(lane-1)*.2;}
    out.position.set([cx+x*.27,cy+y*.27,z*.27],o);
    out.direction.set(source.direction.subarray(s,s+3),o);
    out.size.set([Math.max(.035,source.size[s]*.27),Math.max(.065,source.size[s+1]*.27),Math.max(.035,source.size[s+2]*.27)],o);
    out.inspection!.set(source.inspection!.subarray(s,s+3),o);out.seam![i]=slot/Math.max(1,steps-1);out.twist![i]=source.twist![sample];
  }
  return out;
}

export function blendMatter(poses:MatterPose[],weights:number[],out:MatterPose){
  for(let i=0;i<out.position.length;i++){
    let p=0,d=0,s=0,inspection=0;
    for(let k=0;k<poses.length;k++){
      const weight=weights[k]||0,pose=poses[k];
      if(weight){p+=pose.position[i]*weight;d+=pose.direction[i]*weight;s+=pose.size[i]*weight;inspection+=(pose.inspection?.[i]||0)*weight;}
    }
    out.position[i]=p;out.direction[i]=d;out.size[i]=s;if(out.inspection)out.inspection[i]=inspection;
  }
  for(let i=0;i<out.direction.length;i+=3){const d=Math.hypot(out.direction[i],out.direction[i+1],out.direction[i+2]);if(d<.0001){out.direction[i]=0;out.direction[i+1]=1;out.direction[i+2]=0;}else{out.direction[i]/=d;out.direction[i+1]/=d;out.direction[i+2]/=d;}}
  for(let i=0;i<out.position.length/3;i++){
    let seam=0,twist=0;
    for(let k=0;k<poses.length;k++){const weight=weights[k]||0;if(weight){seam+=(poses[k].seam?.[i]||0)*weight;twist+=(poses[k].twist?.[i]||0)*weight;}}
    if(out.seam)out.seam[i]=seam;if(out.twist)out.twist[i]=twist;
  }
}
