import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BD,BD_DESIGNS} from '../scripts/p101-w9c2-g4e7bd-full-chasm-ribbon.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const road of ['true-pinch','pinch-switch']){
 test('BD authentic CROWN-to-CHASM long-radius B48 roadway '+road,()=>{
  const base=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(base);
  for(const name of Object.keys(BD_DESIGNS)){
   const doc=generateG4E7BD(road,name),m=doc.stageForge.g4e7bdStudy;
   assert(eq(doc,generateG4E7BD(road,name)));
   assert.equal(doc.stageForge.productionPromoted,false);
   assert.equal(m.formalSlope2Meters,0);
   assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
   assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
   assert(eq(doc.surfaces[0],base.surfaces[0]));
   assert(eq(doc.surfaces.slice(2),base.surfaces.slice(2)));
   assert(eq(doc.surfaces[1].points.slice(0,16*5),base.surfaces[1].points.slice(0,16*5)));
   assert(eq(doc.surfaces[1].points.slice(26*5),base.surfaces[1].points.slice(26*5)));
   assert.equal(m.realChangedRows.length,10);
   assert.equal(m.realB51Relocation.length,2);
   assert.equal(tessellate(doc.surfaces[1]).degenerate,0);
   for(const u of [.69,.72,.75,.79]){
    const w=Math.hypot(...sample(doc.surfaces[1],u,0).map((v,i)=>v-sample(doc.surfaces[1],u,1)[i]));
    assert(w>10&&w<19,'actual narrow core '+u+' '+w);
   }
  }
  assert.equal(JSON.stringify(base),frozen);
 });
}
test('BD disallows unsupported roads and shape variants',()=>{
 assert.throws(()=>generateG4E7BD('invalid','longArc'),/invalid physical/);
 assert.throws(()=>generateG4E7BD('true-pinch','invalid'),/invalid physical/);
});
