import test from 'node:test';
import assert from 'node:assert/strict';
import {sample,tessellate} from '../../private/reference_only/director/surface.js';
import {AH_VARIANTS,generateG4E7AH} from '../../scripts/p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {generateG4E7ACR2} from '../../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
test('AH real 10-13.5m B48 roads maintain the proven R2 jump/lip/landing and 28 moving hazards',()=>{
 const base=generateG4E7ACR2('approach-arc'),frozen=JSON.stringify(base);
 for(const v of AH_VARIANTS){
  const d=generateG4E7AH(v.id),m=d.stageForge.g4e7ahStudy;
  assert.deepEqual(d.surfaces.slice(1),base.surfaces.slice(1));
  assert.deepEqual(d.movingObstacles,base.movingObstacles);
  assert.deepEqual(d.spawns,base.spawns);
  assert.deepEqual(d.routeSegments,base.routeSegments);
  assert.deepEqual(d.surfaces[0].points.slice(15*5,22*5),base.surfaces[0].points.slice(15*5,22*5));
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(tessellate(d.surfaces[0]).degenerate,0);
  assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
  assert.equal(m.formalSlope2LengthMeters,0);assert.equal(m.certifiedSlope2Meters,0);
  assert.equal(m.publish,'HOLD');assert.equal(d.stageForge.productionPromoted,false);
  assert.equal(m.originalLipLandingExact,true);
  const a=base.stageForge.g4e7acR2Study.gap;
  for(const u of [a.uTakeoff,a.uLanding])
   assert.deepEqual(sample(d.surfaces[0],u,.5),sample(base.surfaces[0],u,.5));
  if(v.id==='r2-control')assert.deepEqual(d.surfaces,base.surfaces);
  else{
   assert(m.widthMinMeters>=10&&m.widthMinMeters<=13.5);
   assert(m.physicalWidthReductionMeters>2);
   assert(m.changedRows.length>=9);
   if(v.id==='pinch-switch')assert(m.centerShiftMeters>=5);
  }
 }
 assert.equal(JSON.stringify(base),frozen);
});
test('AH never recognizes arbitrary jump/booster corridor names',()=>{
 assert.throws(()=>generateG4E7AH('center-rescue-autosteer'),/unknown/);
});
