import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7MPhysical,G4E7M_VARIANTS,G4E7M_B48_WINDOWS,g4e7mProfile}
 from '../scripts/p101-w9c2-g4e7m-physical-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E7FEarlyPhysicalCandidate} from '../scripts/p101-w9c2-g4e7f-real-slope-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
test('G4E-7M genuine 13-16m plateau B48 collider widths and Gold invariant',()=>{
 const gold=generateP101A13W7Candidate(),sig=JSON.stringify(gold);
 const old=generateG4E7FEarlyPhysicalCandidate('glide'),baseline=JSON.stringify(old);
 for(const id of Object.keys(G4E7M_VARIANTS)){
  const doc=generateG4E7MPhysical(id),metrics=doc.stageForge.g4e7mRealRoad;
  assert.equal(metrics.certifiedSlopeDnaMeters,0);
  assert.equal(metrics.windows.length,2);
  assert(metrics.totalNominalNarrowCoreMeters>100);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.movingObstacles,old.movingObstacles);
  assert.deepEqual(doc.spawns,old.spawns);
  assert.deepEqual(doc.routeSegments,old.routeSegments);
  assert.deepEqual(doc.surfaces.slice(2),old.surfaces.slice(2));
  assert.equal(tessellate(doc.surfaces[0]).degenerate,0);
  assert.equal(tessellate(doc.surfaces[1]).degenerate,0);
  for(const window of G4E7M_B48_WINDOWS){
   const s=doc.surfaces[window.section],prior=old.surfaces[window.section];
   const probe=(window.u1+window.u2)/2;
   const width=Math.hypot(...sample(s,probe,0).map((v,k)=>v-sample(s,probe,1)[k]));
   assert(width>=10&&width<=16,'actual collision width must be within real 10-16m');
   assert(Math.abs(sample(s,probe,.5)[1]-sample(prior,probe,.5)[1])>2,
    'actual vertical road shape not simply scenic');
   for(let r=0;r<31;r++){
    const u=r/30;
    if(u<=window.u0||u>=window.u3)
     for(let j=0;j<5;j++)assert.deepEqual(s.points[r*5+j],prior.points[r*5+j]);
   }
  }
  const r=new Runner(doc,compile(doc),0,52);
  assert.equal(r.startSpeed,52);
  assert.equal(1/DT,240);
  assert.equal(doc.stageForge.productionPromoted,false);
 }
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),sig);
 assert.equal(JSON.stringify(generateG4E7FEarlyPhysicalCandidate('glide')),baseline);
 assert.throws(()=>generateG4E7MPhysical('fake'),/enumerated/);
});
test('G4E-7M private 2 additional visual spawns only when explicitly requested',()=>{
 const ordinary=generateG4E7MPhysical('thread');
 const viewer=generateG4E7MPhysical('thread',{visualSpawns:true});
 assert.equal(viewer.spawns.length,ordinary.spawns.length+2);
 assert.deepEqual(viewer.spawns.slice(0,ordinary.spawns.length),ordinary.spawns);
 assert.equal(viewer.stageForge.g4e7mRealRoad.createdVisualSpawns,2);
 for(const w of G4E7M_B48_WINDOWS){
  assert.equal(g4e7mProfile(w.u0,w),0);
  assert.equal(g4e7mProfile((w.u1+w.u2)/2,w),1);
  assert.equal(g4e7mProfile(w.u3,w),0);
 }
});
