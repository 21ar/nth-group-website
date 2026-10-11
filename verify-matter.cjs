const assert=require('node:assert/strict');
const {buildSync}=require('esbuild');
const fs=require('node:fs');
fs.mkdirSync('.astro',{recursive:true});
buildSync({entryPoints:['src/scripts/matter-geometry.ts'],bundle:true,platform:'node',format:'cjs',outfile:'.astro/matter-geometry.cjs'});
const {createMatter,createPose,blendMatter,matterForms,smooth}=require('./.astro/matter-geometry.cjs');
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
for(const count of [108,132,192]){
 const poses=matterForms.map(form=>createMatter(form,count));
 for(let k=0;k<poses.length;k++){
  const pose=poses[k];check(pose.position.length===count*3&&pose.size.length===count*3,'Every form retains the shared fragment population.');
  check([...pose.position,...pose.direction,...pose.size].every(Number.isFinite),'Each pose is finite.');
  check([...pose.size].every(value=>value>0),'Each fragment has a physical size.');
  for(let i=0;i<count;i++)assert.ok(Math.abs(Math.hypot(...pose.direction.slice(i*3,i*3+3))-1)<.0001,'Directions are normalized.');
 }
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
}
for(const count of [0,1,47,NaN,Infinity,3000]){assert.throws(()=>createMatter('mineral',count),RangeError);checks++;}
check(smooth(0)===0&&smooth(1)===1&&smooth(.5)===.5,'Easing preserves endpoints and midpoint.');
check(Math.abs(smooth(.0001))<1e-9&&Math.abs(1-smooth(.9999))<1e-9,'Endpoint motion eases without a sharp start or stop.');
console.log(checks+' matter geometry checks passed, including all directed morph pairs.');
