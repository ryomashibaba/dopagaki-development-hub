import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AT,AT_WINDOWS} from '../scripts/p101-w9c2-g4e7at-crown-chasm.mjs';
import {generateG4E7AS} from '../scripts/p101-w9c2-g4e7as-banked-serpent.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const road of ['true-pinch','pinch-switch']){
 test('AT '+road+' genuine second B48 multi-span 14m / 28 B51 / unchanged AS original',()=>{
  const original=generateG4E7AS(road),frozen=JSON.stringify(original),
   doc=generateG4E7AT(road),info=doc.stageForge.g4e7atStudy;
  assert(eq(doc,generateG4E7AT(road)));
  assert.equal(JSON.stringify(original),frozen);
  assert.equal(info.id,'crown-chasm');assert.equal(info.physicalSections,2);
  assert.equal(info.authoredRoads,7);assert.equal(info.totalNativeB51,28);
  assert.equal(info.formalSlope2Meters,0);assert.equal(info.humanQA,'HOLD');
  assert.equal(info.publish,'HOLD');assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(tessellate(doc.surfaces[1]).degenerate,0);
  assert(eq(doc.surfaces[0],original.surfaces[0]));
  assert(eq(doc.surfaces.slice(2),original.surfaces.slice(2)));
  assert(eq(doc.spawns,original.spawns));assert(eq(doc.routeSegments,original.routeSegments));
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.deepEqual(info.moduleSpans.map(w=>w.id),AT_WINDOWS.map(w=>w.id));
  for(const w of info.moduleSpans){
   assert(w.actualCoreWidthMinMeters>=11);
   assert(w.actualCoreWidthMaxMeters<=16.5);
   assert(w.narrowCoreArcMeters>=110,'must build meaningful multi-hundred meter core');
  }
  assert(info.actualMovingObstaclesRelocated.length>=3,'movers must follow actual new road');
  for(const p of info.actualMovingObstaclesRelocated){
   assert(p.positionDeltaMeters>.5);
   assert.notDeepEqual(doc.movingObstacles.find(x=>x.id===p.id),
    original.movingObstacles.find(x=>x.id===p.id));
  }
  const smoke=[];
  for(const input of [0,-.25,.25]){
   const r=new Runner(doc,compile(doc),0,52),surge=createA13SurgeState();
   for(let k=0;k<Math.round(2.4/DT)&&['ready','running'].includes(r.status);k++){
    p101Step(r,r.time<.35?0:input,'OVERDRIVE',{
     forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
   }
   assert(r.time>0);assert(r.p.every(Number.isFinite));
   smoke.push({input,t:Number(r.time.toFixed(4)),status:r.status});
  }
  console.log('G4E7AT_NATIVE_ROAD '+road+' '+JSON.stringify({movers:info.actualMovingObstaclesRelocated.length,
   modules:info.moduleSpans.map(w=>({id:w.id,core:w.narrowCoreArcMeters,
    width:[w.actualCoreWidthMinMeters,w.actualCoreWidthMaxMeters]})),smoke}));
 });
}
test('AT refuses non-AS trial',()=>assert.throws(()=>generateG4E7AT('control'),/unknown physical road/));
