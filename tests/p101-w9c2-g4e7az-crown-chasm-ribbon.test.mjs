import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AZ,AZ_VERSIONS} from '../scripts/p101-w9c2-g4e7az-crown-chasm-ribbon.mjs';
import {generateG4E7AY} from '../scripts/p101-w9c2-g4e7ay-tangent-bridge.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
for(const road of ['true-pinch','pinch-switch'])test('AZ real 14m late CROWN and preserved physical CHASM '+road,()=>{
 const src=generateG4E7AY(road,'bankedSweep'),frozen=JSON.stringify(src);
 for(const version of Object.keys(AZ_VERSIONS)){
  const doc=generateG4E7AZ(road,version),m=doc.stageForge.g4e7azStudy;
  assert(same(doc,generateG4E7AZ(road,version)));
  assert.equal(m.id,'crown-chasm-ribbon');
  assert.equal(m.real7B48,true);assert.equal(m.real28B51,true);
  assert.equal(m.formalSlope2Meters,0);assert.equal(m.publish,'HOLD');
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(tessellate(doc.surfaces[1]).degenerate,0);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert(same(doc.surfaces[0],src.surfaces[0]));
  assert(same(doc.surfaces.slice(2),src.surfaces.slice(2)));
  assert(same(doc.surfaces[1].points.slice(19*5),src.surfaces[1].points.slice(19*5)));
  assert(same(doc.surfaces[1].points.slice(0,11*5),src.surfaces[1].points.slice(0,11*5)));
  assert(same(doc.spawns,src.spawns));
  assert.equal(m.movedB51.length,2);
  assert.equal(m.unchangedB51,26);
  assert(m.crownCore.min>10&&m.crownCore.max<19);
  assert(m.chasmCore.min>11&&m.chasmCore.max<18);
  for(const u of [.39,.40,.42]){
   const w=Math.hypot(...sample(doc.surfaces[1],u,0).map((x,i)=>x-sample(doc.surfaces[1],u,1)[i]));
   assert(w>10&&w<19);
  }
 }
 assert.equal(JSON.stringify(src),frozen);
});
test('AZ rejects unknown design',()=>{
 assert.throws(()=>generateG4E7AZ('unknown','longGlide'),/unsupported/);
 assert.throws(()=>generateG4E7AZ('true-pinch','unknown'),/unsupported/);
});
