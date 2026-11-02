import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7GVisualDocument,G4E7G_STAGES,G4E7G_VIEWPOINTS} from '../scripts/p101-w9c2-g4e7g-visual-stage.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E7FEarlyPhysicalCandidate} from '../scripts/p101-w9c2-g4e7f-real-slope-build.mjs';
import {generateG4E6EarlyGap} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
test('G4E7G private normalized-u real road eye positions preserve originals and no helper collision',()=>{
 const original=generateP101A13W7Candidate(),goldSignature=JSON.stringify(original);
 const gapSignature=JSON.stringify(generateG4E6EarlyGap('C0-55-1'));
 const measuredSignature=JSON.stringify(generateG4E7FEarlyPhysicalCandidate('measured'));
 const docs=['gold','glide'].map(generateG4E7GVisualDocument);
 assert.equal(docs[0].stageForge.recordStageId,G4E7G_STAGES.gold);
 assert.equal(docs[1].stageForge.recordStageId,G4E7G_STAGES.glide);
 const start=original.spawns.length;
 for(const d of docs){
  assert.equal(d.spawns.length,start+2);
  assert.deepEqual(d.spawns.slice(0,start),original.spawns);
  assert.deepEqual(d.movingObstacles,original.movingObstacles);
  assert.deepEqual(d.routeSegments,original.routeSegments);
  assert.equal(d.surfaces.length,7);
  assert.equal(d.stageForge.g4e7gVisualTrial.approvedSlopeDnaMeters,0);
  assert.equal(d.stageForge.productionPromoted,false);
  assert.equal(d.stageForge.nativeScriptedProof,null);
  assert.equal(d.stageForge.humanPlaytest,'NOT_RUN');
  assert.equal(d.stageForge.gameAutoSteering,false);
  for(const [i,p] of G4E7G_VIEWPOINTS.entries()){
   const s=d.spawns[start+i],road=d.surfaces[p.section];
   assert.equal(s.surface,road.id);
   assert.equal(s.u,p.u);assert.equal(s.v,p.v);
   assert.equal(tessellate(road).degenerate,0);
   const r=new Runner(d,compile(d),start+i,52);
   assert.equal(r.startSpeed,52);
   assert.equal(1/DT,240);
  }
 }
 for(let i=0;i<7;i++)assert.deepEqual(docs[0].surfaces[i],original.surfaces[i]);
 assert.deepEqual(docs[0].route,original.route);
 assert.deepEqual(docs[1].surfaces,generateG4E7FEarlyPhysicalCandidate('glide').surfaces);
 for(const v of G4E7G_VIEWPOINTS){
  const p=sample(docs[0].surfaces[v.section],v.u,v.v);
  const q=sample(docs[1].surfaces[v.section],v.u,v.v);
  assert(distance(p,q)>1.0,'G4E7G same-U viewpoints must see genuinely changed physical geometry');
 }
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),goldSignature);
 assert.equal(JSON.stringify(generateG4E6EarlyGap('C0-55-1')),gapSignature);
 assert.equal(JSON.stringify(generateG4E7FEarlyPhysicalCandidate('measured')),measuredSignature);
 assert.throws(()=>generateG4E7GVisualDocument('flow'));
});
