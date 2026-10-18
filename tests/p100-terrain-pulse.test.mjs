import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP99VariableWidthCandidate} from '../scripts/p99-variable-width-build.mjs';
import {generateP100TerrainPulseCandidate,P100_TERRAIN_PROFILES,p100Displacement,p100HeightRetention} from '../scripts/p100-terrain-pulse-build.mjs';
import {sample,validate} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {P95_HAZARD_SPECS} from '../web/p95-hazard-layout.mjs';
import {voidBreakerGeometry} from '../web/p93-void-breaker-visual.mjs';
import {p100RoadReadGeometry} from '../web/p100-road-read.mjs';
import {frame} from '../private/reference_only/director/surface.js';

test('P100 changes genuine seven B48 collidable 3D skins, not visual props or HUD',()=>{
 const original=generateP99VariableWidthCandidate(),snapshot=JSON.stringify(original);
 const next=generateP100TerrainPulseCandidate();
 assert.equal(next.stageForge.id,'VB-P100');
 assert.equal(next.stageForge.priorP99CompletionApplicable,false);
 assert.equal(next.stageForge.fullStartToFinish,'P100_NATIVE_240HZ_12_ACTIVE_TWO_PROFILE_FINISH_VERIFIED');
 assert.equal(next.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(next.surfaces.length,7);
 assert.deepEqual(next.movingObstacles,original.movingObstacles);
 assert.deepEqual(next.routeSegments,original.routeSegments);
 assert.deepEqual(next.spawns,original.spawns);
 assert.deepEqual(next.fixtures,original.fixtures);
 assert.equal(DT,1/240);
 let significant=0;
 for(let i=0;i<7;i++){
  const old=original.surfaces[i],cur=next.surfaces[i];
  assert(cur.collidable&&cur.rideable);
  assert.equal(cur.id,old.id);
  for(const row of [0,30])for(let c=0;c<5;c++)
   assert.deepEqual(cur.points[row*5+c],old.points[row*5+c],'source seam cannot change');
  const centerShifts=[6,9,12,15,18,21,24].map(row=>
   Math.hypot(...cur.points[row*5+2].map((v,k)=>v-old.points[row*5+2][k])));
  if(Math.max(...centerShifts)>5)significant++;
  for(const u of [0,.2,.4,.6,.8,1]){
   const a=sample(cur,u,0),b=sample(cur,u,1);
   const width=Math.hypot(...a.map((v,k)=>v-b[k]));
   assert(width>48&&width<145,'real collision width must remain traversable');
  }
 }
 assert(significant>=5,'at least five new materially shifted physical corridors');
 assert.equal(JSON.stringify(original),snapshot,'original P99 cannot be mutated');
 assert.doesNotThrow(()=>validate(next));
});
test('P100 centerline offsets are smooth and vanish at exact chapter seams',()=>{
 assert.equal(P100_TERRAIN_PROFILES.length,7);
 for(const p of P100_TERRAIN_PROFILES){
  for(const u of [0,1]){
   const d=p100Displacement(p,u);
   for(const x of Object.values(d))assert(Math.abs(x)<1e-9);
  }
  const near=p100Displacement(p,.00001);
  assert(Math.abs(near.lateral)<.00001);
  assert(Math.abs(near.height)<.00001);
  const middle=[.25,.35,.45,.55,.65].map(x=>p100Displacement(p,x));
  assert(middle.some(x=>Math.abs(x.lateral)>4));
 }
});
test('P100 independent physical spawn contacts remain legal at native 240Hz',()=>{
 const doc=generateP100TerrainPulseCandidate(),world=compile(doc);
 for(let i=0;i<doc.spawns.length;i++){
  const r=new Runner(doc,world,i,44);
  for(let t=0;t<240&&!['failed','finished'].includes(r.status);t++)r.step(p94NativeSteer(r,'corrective'));
  assert.notEqual(r.status,'failed','P100 invalid spawn '+i+' '+JSON.stringify(r.failure));
  assert(r.time>.9);
 }
});

test('P100 meaningful vertical terrain pulses do not bury or levitate the twelve genuine moving machines',()=>{
 const p99=generateP99VariableWidthCandidate(),p100=generateP100TerrainPulseCandidate();
 const expectedHeights={slider:3,rotator:2.3,piston:6.4};
 assert.equal(P95_HAZARD_SPECS.length,12);
 for(const [index,[section,u]] of P95_HAZARD_SPECS.entries()){
  assert.equal(p100HeightRetention(section,u),0,'hazard center must retain original authored road height');
  const before=sample(p99.surfaces[section],u,.5),after=sample(p100.surfaces[section],u,.5);
  assert(Math.abs(before[1]-after[1])<2.4,'P100 highway crests may not bury/float hazard '+index);
  const center=p100.movingObstacles[index].position;
  const clearance=center[1]-after[1];
  assert(Math.abs(clearance-expectedHeights[p100.movingObstacles[index].type])<2.4,
   'B51-C authored machine clearance drift at '+index+': '+clearance);
 }
 assert.equal(p100HeightRetention(0,.5),1);
 assert.equal(p100HeightRetention(6,.5),1);
});

test('P100 road readability uses authentic B48 skin, open skyline and P99 frozen art',()=>{
 const original=generateP99VariableWidthCandidate(),before=JSON.stringify(original),stage=generateP100TerrainPulseCandidate();
 const city=voidBreakerGeometry(stage,sample),previous=voidBreakerGeometry(original,sample);
 assert.equal(city.sections.reduce((n,s)=>n+s.portalCount,0),28);
 assert(city.sections.every(s=>s.exteriorClearanceMeters===56));
 assert.equal(previous.sections.reduce((n,s)=>n+s.portalCount,0),42);
 assert(previous.sections.every(s=>s.exteriorClearanceMeters===26));
 const visual=p100RoadReadGeometry(stage,sample,frame);
 assert(visual.vertices.length>20000&&visual.vertices.length<115000);
 assert.equal(visual.stripes,7*4*52);
 assert.equal(visual.flowBars,7*2*19);
 assert(visual.vertices.every(Number.isFinite));
 assert.equal(p100RoadReadGeometry(original,sample,frame).vertices.length,0);
 assert.equal(JSON.stringify(original),before);
});
