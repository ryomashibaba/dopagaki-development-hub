import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7FEarlyPhysicalCandidate,G4E7F_WINDOWS,G4E7F_VARIANTS,g4e7fFieldAt}
 from '../scripts/p101-w9c2-g4e7f-real-slope-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E6EarlyGap} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {sample,tessellate,frame} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,RADIUS,DT} from '../private/reference_only/director/physics.js';

test('G4E7F: two genuinely modified B48 physical road windows, Gold and existing gaps immutable',()=>{
 const gold=generateP101A13W7Candidate(),signature=JSON.stringify(gold),
  gapSignature=JSON.stringify(generateG4E6EarlyGap('C0-55-1'));
 for(const id of Object.keys(G4E7F_VARIANTS)){
  const doc=generateG4E7FEarlyPhysicalCandidate(id);
  const s=doc.stageForge.g4e7fPhysicalStudy;
  assert.equal(s.nominalExperimentalMeters,300);
  assert.equal(s.officiallyApprovedSlopeDnaMeters,0);
  assert.equal(s.claimedNewPlayableMeters,0);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.nativeScriptedProof,null);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.deepEqual(doc.spawns,gold.spawns);
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  assert.deepEqual(doc.route.at(-1),gold.route.at(-1));
  for(let i=0;i<7;i++){
   if(i>=2)assert.deepEqual(doc.surfaces[i],gold.surfaces[i]);
   assert.equal(tessellate(doc.surfaces[i]).degenerate,0);
  }
  for(const w of G4E7F_WINDOWS){
   const road=doc.surfaces[w.section],orig=gold.surfaces[w.section];
   const start=w.startMeters/w.lengthNominalMeters,end=w.endMeters/w.lengthNominalMeters;
   for(let row=0;row<31;row++){
    const u=row/30;
    if(u<=start||u>=end)for(let col=0;col<5;col++)
     assert.deepEqual(road.points[row*5+col],orig.points[row*5+col]);
   }
   assert(s.deltas.find(x=>x.id===w.id).changedControlPoints>=10);
   assert(s.deltas.find(x=>x.id===w.id).maxVerticalDeltaMeters>(['glide','flow'].includes(id)?0.8:4));
   for(let j=0;j<=90;j++){
    const u=j/90,l=sample(road,u,0),r=sample(road,u,1);
    assert(Math.hypot(...l.map((x,k)=>x-r[k]))>12,'Interpolated physical lane collapse');
    const f=frame(road,u,.5);
    assert(f.normal.every(Number.isFinite));
   }
   const middle=(start+end)/2;
   assert(Math.abs(sample(road,middle,.5)[1]-sample(orig,middle,.5)[1])>
    (['glide','flow'].includes(id)?0.7:4),'Real vertical gameplay shape missing');
  }
  const runner=new Runner(doc,compile(doc),0,52);
  assert.equal(runner.startSpeed,52);
  assert.equal(1/DT,240);
  assert.equal(RADIUS,.65);
 }
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),signature);
 assert.equal(JSON.stringify(generateG4E6EarlyGap('C0-55-1')),gapSignature);
 assert.throws(()=>generateG4E7FEarlyPhysicalCandidate('unapproved'));
 assert.throws(()=>g4e7fFieldAt('SKYLINE_THREAD',.5,'unapproved'));
});
