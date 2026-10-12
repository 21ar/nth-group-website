const assert=require('node:assert/strict');
const {buildSync}=require('esbuild');
const fs=require('node:fs');
fs.mkdirSync('.astro',{recursive:true});
buildSync({entryPoints:['src/scripts/matter-geometry.ts'],bundle:true,platform:'node',format:'cjs',outfile:'.astro/matter-geometry.cjs'});
const {createMatter,createPose,blendMatter,matterForms,smooth,inspectGroupFor}=require('./.astro/matter-geometry.cjs');
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
for(const count of [108,132,192]){
 const poses=matterForms.map(form=>createMatter(form,count));
 for(let k=0;k<poses.length;k++){
  const pose=poses[k];check(pose.position.length===count*3&&pose.size.length===count*3,'Every form retains the shared fragment population.');
  check([...pose.position,...pose.direction,...pose.size].every(Number.isFinite),'Each pose is finite.');
  check([...pose.size].every(value=>value>0),'Each fragment has a physical size.');
  for(let i=0;i<count;i++)assert.ok(Math.abs(Math.hypot(...pose.direction.slice(i*3,i*3+3))-1)<.0001,'Directions are normalized.');
 }
 for(const [index,form] of matterForms.entries()){
  const pose=poses[index],groups=new Set();
  check(pose.inspection.length===count*3&&[...pose.inspection].every(Number.isFinite),'Every form retains a finite inspection channel.');
  for(let i=0;i<count;i++){
   const membership=[...pose.inspection.slice(i*3,i*3+3)];
   assert.equal(membership.reduce((a,b)=>a+b,0),1,'A fragment belongs to exactly one authored feature.');
   const group=membership.indexOf(1);groups.add(group);
   assert.equal(group,inspectGroupFor(form,i,count),'Inspection selects its matching geometric feature.');
  }
  check(groups.size===3,'Each form provides three populated inspection features.');
 }
 for(let i=0;i<count;i++){
  assert.equal(inspectGroupFor('Mobility',i,count),i%3,'Planning, signals and handoffs follow complete routes.');
  const row=i%4;assert.equal(inspectGroupFor('Events',i,count),row===1?0:row===3?2:1,'Event inspection follows shared moments, transitions and production.');
 }
 const mineral=poses[0];
 check([...mineral.size].filter((value,i)=>i%3===1&&value>.9).length>count*.45,'The preferred mineral retains its substantial polished fragments.');
 const spans=[0,1,2].map(axis=>{const coordinates=Array.from({length:count},(_,i)=>mineral.position[i*3+axis]);return Math.max(...coordinates)-Math.min(...coordinates);});
 check(spans.every(span=>span>2),'The opening retains its three-dimensional mineral volume.');
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
 check([...poses[4].inspection].every((value,i)=>value===output.inspection[i]),'Settled geometry retains its matching inspection feature.');
 blendMatter(poses,weights,output);
 for(let i=0;i<count;i++)assert.ok(Math.abs(output.inspection[i*3]+output.inspection[i*3+1]+output.inspection[i*3+2]-1)<.0001,'Semantic memberships interpolate without disappearing.');
 check(true,'Interrupted field mixtures retain normalized semantic membership.');
}
for(const count of [0,1,47,NaN,Infinity,3000]){assert.throws(()=>createMatter('mineral',count),RangeError);checks++;}
check(smooth(0)===0&&smooth(1)===1&&smooth(.5)===.5,'Easing preserves endpoints and midpoint.');
check(Math.abs(smooth(.0001))<1e-9&&Math.abs(1-smooth(.9999))<1e-9,'Endpoint motion eases without a sharp start or stop.');
console.log(checks+' matter geometry checks passed, including all directed morph pairs.');
