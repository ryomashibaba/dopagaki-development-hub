import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AY,AY_DESIGNS} from '../scripts/p101-w9c2-g4e7ay-tangent-bridge.mjs';
import {generateG4E7AX} from '../scripts/p101-w9c2-g4e7ax-long-crown.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const road of ['true-pinch','pinch-switch'])test('AY real second-B48 long tangent and preserved two narrow cores '+road,()=>{
 const protectedAX=generateG4E7AX(road,'longLead'),frozen=JSON.stringify(protectedAX);
 for(const design of Object.keys(AY_DESIGNS)){
  const ay=generateG4E7AY(road,design),m=ay.stageForge.g4e7ayStudy;
  assert(eq(ay,generateG4E7AY(road,design)));
  assert.equal(m.id,'crown-tangent-bridge');
  assert.equal(m.sevenRealRoads,true);assert.equal(m.twentyEightRealB51,true);
  assert.equal(m.formalSlope2Meters,0);assert.equal(m.publish,'HOLD');
  assert.equal(ay.stageForge.productionPromoted,false);
  assert.deepEqual(ay.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(tessellate(ay.surfaces[1]).degenerate,0);
  assert(eq(ay.surfaces[0],protectedAX.surfaces[0]));
  assert(eq(ay.surfaces.slice(2),protectedAX.surfaces.slice(2)));
  assert(eq(ay.surfaces[1].points.slice(15*5),protectedAX.surfaces[1].points.slice(15*5)));
  assert(eq(ay.surfaces[1].points.slice(0,6*5),protectedAX.surfaces[1].points.slice(0,6*5)));
  assert(eq(ay.spawns,protectedAX.spawns));
  assert.equal(m.reanchoredRealMoving.length,2);
  assert.equal(m.unchangedMovingCount,26);
  for(const q of m.actualCores){
   assert(q.min>10&&q.max<19&&q.arcMeters>80);
  }
  const widthAt24=Math.hypot(...sample(ay.surfaces[1],.24,0).map((v,i)=>v-sample(ay.surfaces[1],.24,1)[i]));
  assert(widthAt24>28&&widthAt24<55,'true prolonged approach rather than suddenly narrow');
 }
 assert.equal(JSON.stringify(protectedAX),frozen);
});
test('AY rejects invalid design and road',()=>{
 assert.throws(()=>generateG4E7AY('r2-control','tangentDeck'),/unsupported/);
 assert.throws(()=>generateG4E7AY('true-pinch','unknown'),/unsupported/);
});
