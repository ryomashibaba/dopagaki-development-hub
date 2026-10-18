import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidHazardCandidate} from '../scripts/p95-void-hazard-build.mjs';
import {generateP99VariableWidthCandidate,p99WidthScale,P99_LANE_PROFILES,measureP99LaneWidths} from '../scripts/p99-variable-width-build.mjs';
import {validate,sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';

test('P99 7 real B48 curved road skins have wide-narrow-wide widths, not merely paint, shaders or HUD',()=>{
 const original=generateVoidHazardCandidate(),before=JSON.stringify(original),candidate=generateP99VariableWidthCandidate();
 assert.equal(candidate.stageForge.id,'VB-P99');
 assert.equal(candidate.stageForge.variedPhysicalWidths,true);
 assert.equal(candidate.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(candidate.stageForge.priorP96CompletionApplicable,false);
 assert.equal(candidate.stageForge.fullStartToFinish,'P99_NATIVE_240HZ_12_ACTIVE_TWO_PROFILE_FINISH_VERIFIED');
 assert.equal(candidate.surfaces.length,7);
 assert.equal(candidate.movingObstacles.length,12);
 assert.deepEqual(candidate.movingObstacles,original.movingObstacles,
  'each of 12 real B51-C hazards must retain CCD, phase, mode and moving pose');
 assert.deepEqual(candidate.routeSegments,original.routeSegments);
 assert.deepEqual(candidate.spawns,original.spawns);
 assert.equal(candidate.surfaces.every((s,i)=>s.rideable&&s.collidable&&JSON.stringify(s.points)!==JSON.stringify(original.surfaces[i].points)),true);
 const widths=measureP99LaneWidths(candidate);
 for(let i=0;i<7;i++){
  const newRoad=candidate.surfaces[i],oldRoad=original.surfaces[i];
  assert.equal(newRoad.id,oldRoad.id);
  for(const [newPoints,oldPoints] of [[newRoad.points.slice(0,5),oldRoad.points.slice(0,5)],
     [newRoad.points.slice(-5),oldRoad.points.slice(-5)]])
   for(let j=0;j<5;j++)assert(Math.hypot(...newPoints[j].map((v,k)=>v-oldPoints[j][k]))<1e-8,
    'physical chapter seam may not move more than 1e-8m');
  assert(widths[i].samples[0].widthMeters>widths[i].narrowestWidthMeters*1.13);
  assert(widths[i].samples[2].widthMeters>=widths[i].narrowestWidthMeters);
  assert(widths[i].narrowestWidthMeters>=54&&widths[i].narrowestWidthMeters<110);
  for(const u of [0,.1,.25,.35,.5,.65,.8,1]){
   assert(Math.hypot(...sample(newRoad,u,.5).map((v,j)=>v-sample(oldRoad,u,.5)[j]))<.01,
    'road center and steering guides must not teleport');
  }
 }
 assert.equal(JSON.stringify(original),before,'P99 must not edit original P95');
 assert.doesNotThrow(()=>validate(candidate));
});
test('P99 at least three sharp physical lane constrictions and wider exit recovery ramps',()=>{
 assert.equal(P99_LANE_PROFILES.length,7);
 assert(P99_LANE_PROFILES.filter(x=>x.minimumScale<=.7).length>=4);
 for(const p of P99_LANE_PROFILES){
  assert.equal(p99WidthScale(p,0),1);
  assert.equal(p99WidthScale(p,1),1);
  assert(Math.abs(p99WidthScale(p,(p.start+p.end)/2)-p.minimumScale)<1e-8);
  assert(p99WidthScale(p,p.start-p.fade/2)>p.minimumScale);
  assert(p99WidthScale(p,p.end+p.fade/2)>p.minimumScale);
 }
});
test('P99 six native 240Hz physical spawn contacts remain valid and are not auto-fails',()=>{
 const doc=generateP99VariableWidthCandidate(),world=compile(doc);
 assert.equal(DT,1/240);
 for(let i=0;i<doc.spawns.length;i++){
  const r=new Runner(doc,world,i,44);
  for(let tick=0;tick<240&&!['failed','finished'].includes(r.status);tick++)r.step(p94NativeSteer(r,'corrective'));
  assert.notEqual(r.status,'failed','P99 starting chapter unsafe at spawn '+i+' '+JSON.stringify(r.failure));
  assert(r.time>.9);
 }
});
