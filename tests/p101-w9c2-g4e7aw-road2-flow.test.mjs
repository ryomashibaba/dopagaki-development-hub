import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AW,AW_PROFILES} from '../scripts/p101-w9c2-g4e7aw-road2-flow.mjs';
import {generateG4E7AV} from '../scripts/p101-w9c2-g4e7av-crest-shaping.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const road of ['true-pinch','pinch-switch'])test('AW '+road+' independently repairs true narrow B48 road2 without expanding width',()=>{
 const av=generateG4E7AV(road,'lineSoft'),frozen=JSON.stringify(av);
 for(const grade of Object.keys(AW_PROFILES)){
  const aw=generateG4E7AW(road,grade),m=aw.stageForge.g4e7awStudy;
  assert(eq(aw,generateG4E7AW(road,grade)));
  assert.equal(m.id,'physical-road2-flow');
  assert.equal(m.certifiedSlope2Meters,0);assert.equal(m.publish,'HOLD');
  assert.equal(aw.stageForge.productionPromoted,false);
  assert.equal(aw.surfaces.length,7);assert.equal(aw.movingObstacles.length,28);
  assert.deepEqual(aw.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(tessellate(aw.surfaces[1]).degenerate,0);
  assert(eq(aw.surfaces[0],av.surfaces[0]));
  assert(eq(aw.surfaces.slice(2),av.surfaces.slice(2)));
  assert(eq(aw.route.slice(0,22),av.route.slice(0,22)));
  assert(eq(aw.route.slice(44),av.route.slice(44)));
  assert(eq(aw.spawns,av.spawns));
  assert.equal(m.relocatedNativeMovingB51.length,4);
  assert.equal(m.preservedOtherB51Count,24);
  for(const span of m.actualB48CoreWidths){
   assert(span.minMeters>11);assert(span.maxMeters<17.5);
   assert(span.maxWidthDifferenceFromAVMeters<.0001);
  }
  for(const u of [.2,.73])assert(Math.abs(
   Math.hypot(...sample(aw.surfaces[1],u,0).map((v,i)=>v-sample(aw.surfaces[1],u,1)[i]))-
   Math.hypot(...sample(av.surfaces[1],u,0).map((v,i)=>v-sample(av.surfaces[1],u,1)[i])))<.001);
 }
 assert.equal(JSON.stringify(av),frozen);
});
test('AW refuses control or unsupported profile',()=>{
 assert.throws(()=>generateG4E7AW('r2-control','flowSoft'),/unsupported/);
 assert.throws(()=>generateG4E7AW('true-pinch','no'),/unsupported/);
});
