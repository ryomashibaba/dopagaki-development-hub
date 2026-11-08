/** K4CT R80: isolated authentic B48 outer shoulder, road 4 LOWER REVERSAL.
 * RESEARCH ONLY: no art, human gameplay, CCD/SAT or full-course certification.
 * Does not change Game/Runner/Camera/assist, the original stage, 240Hz or any B51.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('node k4ct-r80-lower-turn-real-shoulder.mjs BASE_R79.json NEW_R80.json');
assert.notEqual(path.resolve(input),path.resolve(output),'Never overwrite R79');
assert(!fs.existsSync(output),'Never overwrite an existing research candidate');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const beforeBytes=fs.readFileSync(input);
const parentR79SHA='c523d4f68e728b6fe8f15f5275a2b1255cfe17a3a3f3b93fa2de3777c176bc96';
assert.equal(sha(beforeBytes),parentR79SHA,'R79 source changed, abort');
const source=JSON.parse(beforeBytes),doc=structuredClone(source);
assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
assert.equal(doc.surfaces[3].id,'p93-LOWER_REVERSAL-01');
assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52,53,54]);
const road=doc.surfaces[3],maxOuterExtensionM=24;
const smooth=t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t)};
let edited=0;
for(let i=0;i<31;i++){
 const amount=maxOuterExtensionM*smooth((i-12)/6)*(1-smooth((i-24)/6));
 const p0=road.points[i*5],p4=road.points[i*5+4];
 const across=[p4[0]-p0[0],p4[2]-p0[2]],len=Math.hypot(...across);
 assert(len>1,'Degenerate source road row');
 for(let k=3;k<5;k++){
  const v=road.points[i*5+k],factor=(k-2)/2;
  if(amount>0){v[0]+=across[0]/len*amount*factor;v[2]+=across[1]/len*amount*factor;edited++;}
 }
}
assert.equal(edited,34,'Unexpected modified control points');
for(let i=0;i<doc.surfaces.length;i++){
 if(i!==3)assert.deepEqual(doc.surfaces[i],source.surfaces[i],'Other road mutated');
}
for(let i=0;i<31;i++){
 for(let j=0;j<5;j++){
  const a=source.surfaces[3].points[i*5+j],b=road.points[i*5+j];
  assert.equal(a[1],b[1],'Road elevation changed');
  if(j<=2||i<=12||i===30)assert.deepEqual(a,b,'Road center/edge or seam changed');
 }
}
for(const key of ['route','routeSegments','spawns','fixtures','movingObstacles'])assert.deepEqual(doc[key],source[key],'Protected object changed');
doc.stageForge.r80Study={parentR79SHA256:parentR79SHA,study:'road4 one-sided visible real B48 turning shoulder',maxPhysicalOuterExtensionM:maxOuterExtensionM,originalGameAndAllHazardsHeld:true,claim:'RESEARCH_ONLY'};
const bytes=Buffer.from(JSON.stringify(doc)+'\n');
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,bytes,{flag:'wx'});
console.log(JSON.stringify({status:'R80_SOURCE_GENERATED_LIMITED',parentSHA256:parentR79SHA,stageSHA256:sha(bytes),modifiedRoad:road.id,changedControlPoints:edited,physicalOuterExtensionM:24,originalMovingB51:28,art:'HOLD',human:'HOLD'}));
