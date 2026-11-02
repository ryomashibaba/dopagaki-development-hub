import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDy1ApproachPlan,DY1_METRES,DY1_GATES} from '../scripts/p101-w9c2-g4e7dy-r1-approach-plan.mjs';
test('DY R1 actual 240Hz front-facing 360m B48 urban corridor and immutable source',()=>{
 const data=buildDy1ApproachPlan();
 assert.equal(data.originalB48,7);
 assert.equal(data.originalB51,28);
 assert.equal(data.gap52,true);
 assert.equal(data.unchangedPhysics,true);
 assert.equal(data.sourceCXBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
 assert.equal(data.newRoads,0);assert.equal(data.newColliders,0);
 for(const road of ['true-pinch','pinch-switch']){
  const r=data.roads[road];
  assert.equal(r.section,1);
  assert.equal(r.originalMovers,28);
  assert.ok(Math.abs(r.sourceWindowEndArcMetres-r.sourceWindowStartArcMetres-DY1_METRES)<.005);
  assert.equal(r.stations.length,21);
  assert.deepEqual(r.gates.map(x=>x.name),DY1_GATES);
  assert.equal(r.visibility.t1550>=2,true);
  assert.equal(r.visibility.t1600>=2,true);
  assert.ok(r.minRealWidthMetres>=1.3);
  for(const g of r.gates)assert.deepEqual(g.camera.map(x=>x.id),['t1550','t1600','t1650','t1700']);
 }
 assert.equal(data.human,'NOT_TESTED');
 assert.equal(data.nativeWebGL,'NOT_RENDERED');
 assert.equal(data.art,'HOLD');
 assert.equal(data.safety,'NOT_CERTIFIED');
 assert.equal(data.formalSlope2Meters,0);
 assert.equal(data.formalArtAdoption,0);
 assert.equal(data.publish,'HOLD');
 assert.equal(data.merge,'HOLD');
});