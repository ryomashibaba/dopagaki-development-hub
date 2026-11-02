import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AJ,AJ_ROADS,AJ_LAYOUTS} from '../../scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {generateG4E7AH} from '../../scripts/p101-w9c2-g4e7ah-narrow-real-b48.mjs';
test('AJ reanchors only 2 original genuine B51-C boxes onto physical 11m B48, 26 unchanged',()=>{
 for(const road of AJ_ROADS){
  const base=generateG4E7AH(road),snapshot=JSON.stringify(base);
  for(const layout of AJ_LAYOUTS){
   const d=generateG4E7AJ(road,layout),m=d.stageForge.g4e7ajStudy;
   assert.deepEqual(d.surfaces,base.surfaces);assert.deepEqual(d.route,base.route);
   assert.deepEqual(d.spawns,base.spawns);
   assert.deepEqual(d.routeSegments,base.routeSegments);
   assert.equal(d.movingObstacles.length,28);
   assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
   assert.deepEqual(d.movingObstacles.slice(0,12),base.movingObstacles.slice(0,12));
   assert.deepEqual(d.movingObstacles.slice(14),base.movingObstacles.slice(14));
   for(const index of [12,13]){
    const b=base.movingObstacles[index],a=d.movingObstacles[index];
    assert.equal(a.id,b.id);assert.equal(a.type,b.type);
    assert.deepEqual(a.size,b.size);assert.equal(a.period,b.period);
    assert.deepEqual(a.collision,b.collision);assert.equal(a.enabled,true);
   }
   assert.equal(m.originalMovingObjects,28);
   assert.equal(m.unchangedMovingObjects,layout==='original'?28:26);
   assert.equal(m.certifiedSlope2Meters,0);assert.equal(m.publish,'HOLD');
  }
  assert.equal(JSON.stringify(base),snapshot);
 }
});
test('AJ never introduces rescue booster or phantom corridors',()=>{
 assert.throws(()=>generateG4E7AJ('true-pinch','auto-steer'),/unknown/);
});
