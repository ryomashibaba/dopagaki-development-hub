import test from 'node:test';
import assert from 'node:assert/strict';
import {generateW9C2G4ENarrow,G4E_POLICY} from '../scripts/p101-w9c2-g4e-narrow-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';

test('G4E-1 candidates are genuine native B48 geometry but NOT gaps/jumps or published',()=>{
 assert.equal(G4E_POLICY.gameRegistered,false);
 assert.equal(G4E_POLICY.noGapYet,true);
 assert.equal(G4E_POLICY.noCrestYet,true);
 const gold=generateP101A13W7Candidate(),before=JSON.stringify(gold);
 for(const kind of ['shoulder','razor']){
  const doc=generateW9C2G4ENarrow(kind);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.equal(doc.stageForge.g4ePhysicalStudy.realB48Collider,true);
  assert.equal(doc.stageForge.g4ePhysicalStudy.approvedSlopeDNAMeters,0);
  assert.equal(doc.stageForge.g4ePhysicalStudy.trueOpenGapImplemented,false);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
  assert.equal(tessellate(doc.surfaces[3]).degenerate,0);
  assert.deepEqual(doc.route,gold.route);
  assert.deepEqual(doc.spawns,gold.spawns);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  for(let i=0;i<7;i++)if(i!==3)assert.deepEqual(doc.surfaces[i],gold.surfaces[i]);
  for(let row=0;row<31;row++){
   assert.deepEqual(doc.surfaces[3].points[row*5+2],gold.surfaces[3].points[row*5+2]);
  }
  let narrower=0;
  for(let u=0;u<=1;u+=1/30){
   const s=doc.surfaces[3],b=gold.surfaces[3];
   const width=t=>Math.hypot(...sample(t,u,0).map((x,k)=>x-sample(t,u,1)[k]));
   assert(width(s)<=width(b)+.0001);
   if(width(s)<width(b)-.5)narrower++;
  }
  assert(narrower>=8);
  assert(doc.stageForge.g4ePhysicalStudy.maximumRealEdgeShiftMeters>3);
 }
 assert.equal(JSON.stringify(gold),before);
});
test('G4E-1 variant validation refuses unapproved shape ids',()=>{
 assert.throws(()=>generateW9C2G4ENarrow('fake'),/declared offline/);
});
