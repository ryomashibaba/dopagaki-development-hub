import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AJ} from '../scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {generateG4E7AP} from '../scripts/p101-w9c2-g4e7ap-temporal-slalom.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {Runner,RADIUS,DT} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const ids=['a13-machine-01','a13-machine-02'];
function lane(road,u,side){
 const center=sample(road,u,.5),a=sample(road,u,0),b=sample(road,u,1);
 const dx=[b[0]-a[0],0,b[2]-a[2]],width=Math.hypot(...dx);
 return center.map((v,i)=>v+(dx[i]/width)*side*(width/2-RADIUS-.35)+(i===1?RADIUS:0));
}
for(const road of ['true-pinch','pinch-switch']){
 test('AP '+road+' uses native OBB pressure without violating AJ/other 26 movers',()=>{
  const before=generateG4E7AJ(road,'reanchor'),frozen=JSON.stringify(before);
  const doc=generateG4E7AP(road);
  assert(eq(doc,generateG4E7AP(road)));
  assert.equal(JSON.stringify(before),frozen);
  assert(eq(before.surfaces,doc.surfaces));
  assert(eq(before.route,doc.route));
  assert(eq(before.spawns,doc.spawns));
  assert(eq(before.routeSegments,doc.routeSegments));
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert(eq(before.movingObstacles.filter(o=>!ids.includes(o.id)),
           doc.movingObstacles.filter(o=>!ids.includes(o.id))));
  assert.deepEqual(doc.stageForge.g4e7apStudy.changedMovingIds,ids);
  assert.equal(doc.stageForge.g4e7apStudy.publish,'HOLD');
  assert.equal(doc.stageForge.g4e7apStudy.certifiedSlope2Meters,0);
  assert.equal(doc.stageForge.productionPromoted,false);
  const a=doc.movingObstacles.find(o=>o.id===ids[0]),b=doc.movingObstacles.find(o=>o.id===ids[1]);
  assert.equal(a.collision.mode,'fail');
  assert.equal(b.collision.mode,'push');
  assert.equal(b.collision.pushStrength,1);
  assert(a.motion.amplitude>3);
  for(const [ob,u] of [[a,.32],[b,.80]]){
   const c=sample(doc.surfaces[0],u,.5),atCenter=[c[0],c[1]+RADIUS,c[2]];
   let centerCollisions=0,openEdgeSamples=0;
   for(let k=0;k<96;k++){
    const pose=movingObstaclePose(ob,k*ob.period/96);
    const sep=p=>sphereBoxSeparation(p,RADIUS,pose).separation;
    if(sep(atCenter)<=0)centerCollisions++;
    if(sep(lane(doc.surfaces[0],u,-1))>.1||sep(lane(doc.surfaces[0],u,1))>.1)openEdgeSamples++;
   }
   assert(centerCollisions>0,ob.id+' never reaches the true B48 center');
   assert.equal(openEdgeSamples,96,ob.id+' blocks both sampled edge lanes');
  }
  // Native 240Hz smoke only: no P96, no passing human-driver assertion.
  const runner=new Runner(doc,compile(doc),0,52);
  for(let k=0;k<Math.round(2/DT)&&['ready','running'].includes(runner.status);k++)runner.step(0);
  assert(runner.time>0);
  assert(runner.p.every(Number.isFinite));
  console.log('G4E-7AP_NATIVE_NONHUMAN '+road+' '+JSON.stringify({
   t:runner.time,status:runner.status,failure:runner.failure??null,quality:'HOLD'}));
 });
}
test('AP rejects non-real-11m road variants',()=>{
 assert.throws(()=>generateG4E7AP('r2-control'),/unknown narrow B48/);
});
