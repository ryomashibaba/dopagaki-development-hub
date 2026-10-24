import test from 'node:test';
import assert from 'node:assert/strict';
import {AC_R2_FORMS,generateG4E7ACR2} from '../../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
import {generateG4E7AA} from '../../scripts/p101-w9c2-g4e7aa-physical.mjs';
test('R2 real turns do not move known successful B48 lip and rejoin geometry',()=>{
 const source=generateG4E7AA(.7,'landing-soft'),old=JSON.stringify(source);
 for(const cfg of AC_R2_FORMS){
  const doc=generateG4E7ACR2(cfg.id),m=doc.stageForge.g4e7acR2Study;
  assert.deepEqual(doc.surfaces[0].points.slice(16*5,21*5),source.surfaces[0].points.slice(16*5,21*5));
  assert.deepEqual(doc.surfaces.slice(1),source.surfaces.slice(1));
  assert.deepEqual(doc.movingObstacles,source.movingObstacles);
  assert.deepEqual(doc.routeSegments,source.routeSegments);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(m.originalLipLandingExact,true);
  assert.equal(m.certifiedSlope2Meters,0);
  assert.equal(m.publish,'HOLD');
  if(cfg.id!=='frozen-aa'){
   assert(m.maxHorizontalMeters>24);
   assert(m.maxVerticalMeters>9);
  }
 }
 assert.equal(JSON.stringify(source),old);
});
