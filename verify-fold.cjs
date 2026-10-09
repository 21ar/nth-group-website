const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{transformSync}=require('esbuild');
const source=fs.readFileSync('src/scripts/fold-geometry.ts','utf8');
const module_={exports:{}};vm.runInNewContext(transformSync(source,{loader:'ts',format:'cjs'}).code,{module:module_,exports:module_.exports,Float32Array,Math});
const {makeSheet,makeIndices,makeSolidSheet,makeSolidIndices,blendWeightedSheet}=module_.exports;
const segments=80,rows=8,count=(segments+1)*(rows+1),checks=[];
function check(value,label){assert.ok(value,label);checks.push(label);}
for(let pose=0;pose<7;pose++)for(let layer=0;layer<3;layer++){
 const face=makeSheet(pose,layer,segments,rows),solid=makeSolidSheet(pose,layer,segments,rows);
 check(face.length===count*3&&solid.length===count*6&&solid.every(Number.isFinite),`Pose ${pose}, sheet ${layer}: stable vertex count and finite geometry.`);
 check([0,Math.floor(count/2),count-1].every(vertex=>Math.abs(Math.hypot(...[0,1,2].map(axis=>solid[vertex*3+axis]-solid[(vertex+count)*3+axis]))-.05)<.00001),`Pose ${pose}, sheet ${layer}: physical thickness is preserved.`);
 if([3,4].includes(pose))check(Array.from({length:rows+1},(_,v)=>[0,1,2].every(axis=>Math.abs(face[v*3+axis]-face[(segments*(rows+1)+v)*3+axis])<.00001)).every(Boolean),`Pose ${pose}, sheet ${layer}: closed surfaces meet without duplicate seam lines.`);
 if([3,4].includes(pose))check(Array.from({length:rows+1},(_,v)=>[0,1,2].every(axis=>Math.abs(solid[v*3+axis]-solid[(segments*(rows+1)+v)*3+axis])<.00001)).every(Boolean),`Pose ${pose}, sheet ${layer}: solid faces and their shading join at the seam.`);
}
for(const [indices,vertices] of [[makeIndices(segments,rows),count],[makeSolidIndices(segments,rows),count*2]]){
 check(indices.length%3===0&&indices.every(index=>Number.isInteger(index)&&index>=0&&index<vertices),'Every triangle references an existing vertex.');
 check(Array.from({length:indices.length/3},(_,i)=>new Set(indices.slice(i*3,i*3+3)).size===3).every(Boolean),'The surface has no repeated-index triangles.');
}
for(let layer=0;layer<3;layer++){
 const poses=Array.from({length:7},(_,pose)=>makeSheet(pose,layer,segments,rows)),output=new Float32Array(poses[0].length);
 blendWeightedSheet(output,poses,0,[0,1,0,0,0,0]);check(output.every((value,i)=>value===poses[0][i]),'Reverse scroll returns exactly to the opening surface.');
 blendWeightedSheet(output,poses,1,[0,1,0,0,0,0]);check(output.every((value,i)=>Math.abs(value-poses[2][i])<.000001),'The settled selection reaches the exact field surface.');
 const weights=[.3,.2,.1,.15,.05,.2];blendWeightedSheet(output,poses,.5,weights);const before=output.slice();blendWeightedSheet(output,poses,.5,weights);check(output.every((value,i)=>value===before[i]),'An interrupted transition preserves the exact current surface mixture.');
 for(let step=0;step<=20;step++)blendWeightedSheet(output,poses,step/20,weights);
 check(output.every(Number.isFinite),'Intermediate scroll and selection geometry remains finite.');
}
console.log(checks.length+' Living Fold geometry checks passed.');
