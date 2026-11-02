import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AX,AX_LAYOUTS} from '../scripts/p101-w9c2-g4e7ax-long-crown.mjs';
import {generateG4E7AV} from '../scripts/p101-w9c2-g4e7av-crest-shaping.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const road of ['true-pinch','pinch-switch'])test('AX '+road+' physically rebuilt multi-hundred-meter CROWN lead-in',()=>{
 const av=generateG4E7AV(road,'lineSoft'),frozen=JSON.stringify(av);
 for(const profile of Object.keys(AX_LAYOUTS)){
  const ax=generateG4E7AX(road,profile),m=ax.stageForge.g4e7axStudy;
  assert(eq(ax,generateG4E7AX(road,profile)),'determinism');
  assert.equal(m.id,'long-crown-real-b48');
  assert.equal(m.formalSlope2Meters,0);assert.equal(m.humanQA,'HOLD');
  assert.equal(m.publish,'HOLD');assert.equal(ax.stageForge.productionPromoted,false);
  assert.equal(ax.surfaces.length,7);assert.equal(ax.movingObstacles.length,28);
  assert.equal(tessellate(ax.surfaces[1]).degenerate,0);
  assert.deepEqual(ax.surfaces[0].voidLongitudinalCells,[52]);
  assert(eq(ax.surfaces[0],av.surfaces[0]));
  assert(eq(ax.surfaces.slice(2),av.surfaces.slice(2)));
  assert(eq(ax.surfaces[1].points.slice(80),av.surfaces[1].points.slice(80)));
  assert(eq(ax.spawns,av.spawns));assert(eq(ax.routeSegments,av.routeSegments));
  assert.deepEqual(m.entryTransitionU,[.05,.29]);
  assert.equal(m.relocatedPhysicalB51.length,2);
  assert.equal(m.otherPhysicalB51Frozen,26);
  for(const x of m.physicalCoreMeasures){
   assert(x.minMeters>11&&x.maxMeters<18);
   assert(x.physicalArcMeters>100);
  }
  const earlyWidth=Math.hypot(...sample(ax.surfaces[1],.12,0).map((v,i)=>v-sample(ax.surfaces[1],.12,1)[i]));
  assert(earlyWidth>30,'real visual/physical warning before narrow squeeze');
 }
 assert.equal(JSON.stringify(av),frozen,'AT/AV originals may never mutate');
});
test('AX unknown road or variant refused',()=>{
 assert.throws(()=>generateG4E7AX('control','longLead'),/unsupported/);
 assert.throws(()=>generateG4E7AX('true-pinch','control'),/unsupported/);
});
