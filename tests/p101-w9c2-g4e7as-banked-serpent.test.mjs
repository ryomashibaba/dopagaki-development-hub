import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AS} from '../scripts/p101-w9c2-g4e7as-banked-serpent.mjs';
import {generateG4E7AP} from '../scripts/p101-w9c2-g4e7ap-temporal-slalom.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,RADIUS,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
for(const road of ['true-pinch','pinch-switch']){
 test('AS '+road+' true banked B48 and actual B51 rotor, original gap protected',()=>{
  const original=generateG4E7AP(road),frozen=JSON.stringify(original);
  const doc=generateG4E7AS(road),m=doc.stageForge.g4e7asStudy;
  assert(eq(doc,generateG4E7AS(road)));
  assert.equal(JSON.stringify(original),frozen);
  assert.equal(m.id,'banked-serpent');
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(m.original7Roads,7);assert.equal(m.actualB51,28);
  assert.equal(m.originalUnchangedB51FromAP,27);
  assert.equal(m.formalSlope2Meters,0);assert.equal(m.publish,'HOLD');
  assert.equal(m.humanFairness,'HOLD');
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(tessellate(doc.surfaces[0]).degenerate,0);
  assert(eq(original.surfaces.slice(1),doc.surfaces.slice(1)));
  assert(eq(original.route.slice(22),doc.route.slice(22)));
  assert(eq(original.spawns,doc.spawns));assert(eq(original.routeSegments,doc.routeSegments));
  assert(eq(original.movingObstacles.filter(o=>o.id!=='a13-machine-02'),
            doc.movingObstacles.filter(o=>o.id!=='a13-machine-02')));
  assert.equal(m.physicallySculptedSpans.length,2);
  for(const span of m.physicallySculptedSpans){
   assert(span.maxSide>=7);assert(span.maxHeight>=6);assert(span.maxBank>=2);
   assert(span.rows>=3);
  }
  const gap=original.stageForge.g4e7acR2Study.gap;
  for(const u of [gap.uTakeoff,gap.uLanding])
   assert(eq(sample(original.surfaces[0],u,.5),sample(doc.surfaces[0],u,.5)));
  for(const u of [.1,.8]){
   const a=sample(doc.surfaces[0],u,0),b=sample(doc.surfaces[0],u,1);
   assert(distance(a,b)>=10&&distance(a,b)<=17);
   assert(Math.abs(a[1]-b[1])>1,'actual B48 banking missing');
   assert(distance(sample(original.surfaces[0],u,.5),sample(doc.surfaces[0],u,.5))>5);
  }
  const rotor=doc.movingObstacles.find(o=>o.id==='a13-machine-02');
  assert.equal(rotor.collision.mode,'push');
  const c=sample(doc.surfaces[0],.8,.5);
  assert(Number.isFinite(sphereBoxSeparation([c[0],c[1]+RADIUS,c[2]],RADIUS,movingObstaclePose(rotor,0)).separation));
  const smoke=[];
  for(const input of [0,-.25,.25]){
   const runner=new Runner(doc,compile(doc),0,52),surge=createA13SurgeState();
   for(let k=0;k<Math.round(3.2/DT)&&['ready','running'].includes(runner.status);k++)
    p101Step(runner,runner.time<.35?0:input,'OVERDRIVE',{
     forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
   assert(runner.time>0&&runner.time<=3.21);
   assert(runner.p.every(Number.isFinite)&&runner.v.every(Number.isFinite));
   smoke.push({input,seconds:+runner.time.toFixed(4),status:runner.status,reason:runner.failure?.reason??null});
  }
  console.log('G4E7AS_NATIVE_SMOKE '+road+' '+JSON.stringify({spans:m.physicallySculptedSpans,smoke,human:'HOLD'}));
 });
}
test('AS unknown stage rejected',()=>assert.throws(()=>generateG4E7AS('r2-control'),/unknown true B48/));
