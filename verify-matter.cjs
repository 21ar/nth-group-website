const assert=require('node:assert/strict');
const {buildSync}=require('esbuild');
const fs=require('node:fs');
fs.mkdirSync('.astro',{recursive:true});
buildSync({entryPoints:['src/scripts/matter-geometry.ts'],bundle:true,platform:'node',format:'cjs',outfile:'.astro/matter-geometry.cjs'});
const {createMatter,createPose,blendMatter,matterForms,smooth,createAtlas,atlasGroupFor,inspectGroupFor}=require('./.astro/matter-geometry.cjs');
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
for(const count of [108,132,192]){
 const poses=matterForms.map(form=>createMatter(form,count));
 for(let k=0;k<poses.length;k++){
  const pose=poses[k];check(pose.position.length===count*3&&pose.size.length===count*3,'Every form retains the shared fragment population.');
  check([...pose.position,...pose.direction,...pose.size].every(Number.isFinite),'Each pose is finite.');
  check([...pose.size].every(value=>value>0),'Each fragment has a physical size.');
  for(let i=0;i<count;i++)assert.ok(Math.abs(Math.hypot(...pose.direction.slice(i*3,i*3+3))-1)<.0001,'Directions are normalized.');
 }
 // Inspector membership is geometry-derived, normalized and independent of array thirds.
 for(const [index,form] of matterForms.entries()){
  const pose=poses[index],groups=new Set();
  check(pose.inspection.length===count*3&&pose.seam.length===count&&pose.twist.length===count,'Every form carries inspection, seam and orientation channels.');
  check([...pose.inspection,...pose.seam,...pose.twist].every(Number.isFinite),'Authored visual channels are finite.');
  for(let i=0;i<count;i++){
   const membership=[...pose.inspection.slice(i*3,i*3+3)];
   assert.equal(membership.reduce((a,b)=>a+b,0),1,'A fragment belongs to exactly one authored feature.');
   const group=membership.indexOf(1);groups.add(group);
   assert.equal(group,inspectGroupFor(form,i,count),'Inspection selects its own geometric feature.');
  }
  check(groups.size===3,'Each form provides three populated inspection features.');
 }
 for(let i=0;i<count;i++){
  assert.equal(inspectGroupFor('Mobility',i,count),i%3,'Planning, signals and handoffs follow complete routes.');
  const row=i%4;assert.equal(inspectGroupFor('Events',i,count),row===1?0:row===3?2:1,'Event inspection follows shared moments, transitions and production.');
 }
 check(poses[2].inspection[0]===1&&poses[2].inspection[4]===1&&poses[2].inspection[8]===1,'Adjacent mobility fragments belong to distinct complete routes.');
 const core=poses[0],again=createMatter('mineral',count);
 check([...core.position,...core.direction,...core.size,...core.twist].every((value,i)=>value===[...again.position,...again.direction,...again.size,...again.twist][i]),'The opening core is authored and reproducible.');
 for(let layer=0;layer<3;layer++){
  const indices=Array.from({length:count},(_,i)=>i).filter(i=>i%3===layer);let maxGap=0,maxTurn=0;
  for(let slot=0;slot<indices.length;slot++){
   const a=indices[slot]*3,b=indices[(slot+1)%indices.length]*3;
   maxGap=Math.max(maxGap,Math.hypot(core.position[a]-core.position[b],core.position[a+1]-core.position[b+1],core.position[a+2]-core.position[b+2]));
   const dot=core.direction[a]*core.direction[b]+core.direction[a+1]*core.direction[b+1]+core.direction[a+2]*core.direction[b+2];maxTurn=Math.max(maxTurn,Math.acos(Math.min(1,Math.max(-1,dot))));
  }
  check(maxGap<.5&&maxTurn<.8,'Each authored ribbon closes with a smooth continuation rather than an isolated jump.');
  const phases=indices.map(i=>core.seam[i]);check(phases.every((value,i)=>i===0||value>phases[i-1])&&phases[0]>0&&phases.at(-1)<1,'The orange seam follows the continuous ribbon in order.');
 }
 const atlas=createAtlas(count),atlasGroups=new Set(Array.from({length:count},(_,i)=>atlasGroupFor(i,count)));
 check(atlasGroups.size===9&&atlas.position.length===count*3,'The final atlas retains one population and nine venture formations.');
 check([...atlas.position,...atlas.direction,...atlas.size,...atlas.inspection,...atlas.seam,...atlas.twist].every(Number.isFinite),'Every atlas channel is finite.');
 check([...atlas.size].every(value=>value>0),'Atlas fragments retain a visible physical size.');
 const centroids=[];
 for(let group=0;group<9;group++){
  const indices=Array.from({length:count},(_,i)=>i).filter(i=>atlasGroupFor(i,count)===group);
  const center=[0,1,2].map(axis=>indices.reduce((sum,i)=>sum+atlas.position[i*3+axis],0)/indices.length);centroids.push(center);
  check(Math.abs(center[0]-(group%3-1)*2.15)<.5&&Math.abs(center[1]-(1-Math.floor(group/3))*1.52)<.5,'Each venture occupies its own atlas position.');
  for(const i of indices)assert.ok(Math.abs(Math.hypot(...atlas.direction.slice(i*3,i*3+3))-1)<.0001,'Atlas fragment directions remain normalized.');
 }
 check(new Set(centroids.map(center=>center.map(v=>v.toFixed(3)).join(','))).size===9,'The nine atlas formations have distinct centers.');
 const atlasBlend=createPose(count);let preceding;
 for(let step=0;step<=60;step++){
  const t=smooth(step/60);blendMatter([poses[7],atlas],[1-t,t],atlasBlend);
  assert.ok([...atlasBlend.position,...atlasBlend.direction,...atlasBlend.size,...atlasBlend.inspection,...atlasBlend.seam,...atlasBlend.twist].every(Number.isFinite),'All atlas transition channels remain finite.');
  if(preceding)assert.ok(Math.max(...atlasBlend.position.map((v,i)=>Math.abs(v-preceding[i])))<.4,'The field-to-atlas handoff remains continuous.');
  preceding=[...atlasBlend.position];
 }
 check([...atlasBlend.position].every((value,i)=>value===atlas.position[i]),'A completed handoff reaches the nine-node atlas.');
 const materials=poses[5];check(new Set(Array.from({length:count},(_,i)=>[...materials.position.slice(i*3,i*3+3)].map(v=>v.toFixed(4)).join(','))).size===count,'Material cells contain no duplicated fragment positions.');
 const output=createPose(count);
 for(let from=0;from<poses.length;from++)for(let to=0;to<poses.length;to++){
  let previous;
  for(let step=0;step<=40;step++){
   const t=smooth(step/40),weights=matterForms.map((_,i)=>(i===from?1-t:0)+(i===to?t:0));blendMatter(poses,weights,output);
   assert.ok([...output.position,...output.direction,...output.size].every(Number.isFinite),'All intermediate geometry remains finite.');
   if(previous)assert.ok(Math.max(...output.position.map((v,i)=>Math.abs(v-previous[i])))<.65,'Position interpolation has no discontinuous step.');
   previous=[...output.position];
  }
 }
 check(true,'Every directed form pair and intermediate transition is continuous.');
 const weights=[.12,.08,.15,.1,.2,.1,.05,.2];blendMatter(poses,weights,output);const displayed=[...output.position];
 const interrupted=weights.map((w,i)=>w+(Number(i===6)-w)*smooth(0));blendMatter(poses,interrupted,output);
 check(displayed.every((v,i)=>v===output.position[i]),'An interrupted morph starts at the exact displayed geometry.');
 const oneHot=matterForms.map((_,i)=>Number(i===4));blendMatter(poses,oneHot,output);check([...poses[4].position].every((v,i)=>v===output.position[i]),'A settled selection reaches its actual geometry.');
 check([...poses[4].inspection].every((v,i)=>v===output.inspection[i])&&[...poses[4].seam].every((v,i)=>v===output.seam[i])&&[...poses[4].twist].every((v,i)=>v===output.twist[i]),'Settled geometry retains its matching inspection, seam and orientation.');
 blendMatter(poses,weights,output);
 for(let i=0;i<count;i++)assert.ok(Math.abs(output.inspection[i*3]+output.inspection[i*3+1]+output.inspection[i*3+2]-1)<.0001,'Semantic memberships interpolate without disappearing.');
 check(true,'Interrupted field mixtures retain normalized semantic membership.');
}
for(const count of [0,1,47,NaN,Infinity,3000]){assert.throws(()=>createMatter('mineral',count),RangeError);assert.throws(()=>createAtlas(count),RangeError);checks++;}
check(smooth(0)===0&&smooth(1)===1&&smooth(.5)===.5,'Easing preserves endpoints and midpoint.');
check(Math.abs(smooth(.0001))<1e-9&&Math.abs(1-smooth(.9999))<1e-9,'Endpoint motion eases without a sharp start or stop.');
console.log(checks+' matter geometry checks passed, including all directed morph pairs.');
