import test from 'node:test';
import assert from 'node:assert/strict';
import {AC_FORMS,generateG4E7AC} from '../../scripts/p101-w9c2-g4e7ac-macro-physical.mjs';
import {generateG4E7AA} from '../../scripts/p101-w9c2-g4e7aa-physical.mjs';
import {tessellate} from '../../private/reference_only/director/surface.js';
test('G4E-7AC true large-scale collision geometry isolated from frozen AA',()=>{
 const source=generateG4E7AA(.7,'landing-soft'),frozen=JSON.stringify(source);
 for(const v of AC_FORMS){
  const d=generateG4E7AC(v.id),m=d.stageForge.g4e7acStudy;
  assert.equal(d.surfaces.length,7);
  assert.equal(d.movingObstacles.length,28);
  assert.deepEqual(d.surfaces.slice(1),source.surfaces.slice(1));
  assert.deepEqual(d.movingObstacles,source.movingObstacles);
  assert.deepEqual(d.spawns,source.spawns);
  assert.deepEqual(d.routeSegments,source.routeSegments);
  assert.deepEqual(d.route.slice(22),source.route.slice(22));
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(tessellate(d.surfaces[0]).degenerate,0);
  assert.equal(m.certifiedSlope2Meters,0);
  assert.equal(m.publish,'HOLD');
  assert.equal(d.stageForge.productionPromoted,false);
  if(v.id==='frozen-aa')assert.deepEqual(d.surfaces,source.surfaces);
  else{
   assert(m.maxHorizontalMeters>24);
   assert(m.maxVerticalMeters>9);
   assert(m.alteredRows.length>=12);
   assert.notDeepEqual(d.surfaces[0],source.surfaces[0]);
  }
 }
 assert.equal(JSON.stringify(source),frozen);
});
test('unknown designs cannot be silently selected',()=>{
 assert.throws(()=>generateG4E7AC('auto-boost'),/unknown/);
});
