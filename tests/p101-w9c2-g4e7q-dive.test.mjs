import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7QPhysical,g4e7qField,G4E7Q_WINDOW} from '../scripts/p101-w9c2-g4e7q-dive-build.mjs';
import {generateG4E7FEarlyPhysicalCandidate} from '../scripts/p101-w9c2-g4e7f-real-slope-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
test('G4E-7Q creates real narrow crest/dive B48 control surfaces, never alters Gold/GLIDE',()=>{
 const gold=JSON.stringify(generateP101A13W7Candidate()),
   glide=generateG4E7FEarlyPhysicalCandidate('glide'),sig=JSON.stringify(glide);
 const a=generateG4E7QPhysical('drop'),b=generateG4E7QPhysical('leap');
 assert.equal(a.surfaces.length,7);assert.equal(b.movingObstacles.length,28);
 for(const doc of [a,b]){
  const m=doc.stageForge.g4e7qStudy;
  assert.equal(m.noExtraRoadOrCatchPlatform,true);
  assert.equal(m.officiallyApprovedSlopeDnaMeters,0);
  assert.equal(m.nativeFinishVerified,false);
  assert(m.maxVerticalPointDeltaMeters>=8);
  assert(m.minimumMeasuredCoreWidthMeters>11&&m.minimumMeasuredCoreWidthMeters<22);
  assert(m.modifiedRows>=6);
  assert.equal(tessellate(doc.surfaces[0]).degenerate,0);
  assert.deepEqual(doc.surfaces.slice(1),glide.surfaces.slice(1));
  assert.deepEqual(doc.routeSegments,glide.routeSegments);
  assert.deepEqual(doc.movingObstacles,glide.movingObstacles);
  assert.deepEqual(doc.spawns,glide.spawns);
  assert.equal(new Runner(doc,compile(doc),0,52).startSpeed,52);
 }
 assert(same(a.surfaces[0].points,b.surfaces[0].points));
 assert.equal(a.surfaces[0].voidLongitudinalCells?.length||0,0);
 assert.equal(b.surfaces[0].voidLongitudinalCells.length,1);
 assert.equal(1/DT,240);
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),gold);
 assert.equal(JSON.stringify(generateG4E7FEarlyPhysicalCandidate('glide')),sig);
});
test('G4E-7Q leap removes actual B48 top/bottom/edge and has no invisible midpoint floor',()=>{
 const a=generateG4E7QPhysical('drop'),b=generateG4E7QPhysical('leap'),
  cut=b.stageForge.g4e7qStudy.gap,road=b.surfaces[0];
 assert(cut.actualB48MissingStrips);
 assert(cut.lengthMeters>2&&cut.lengthMeters<20);
 assert.equal(cut.physicsLandingVerified,false);
 assert.equal(cut.noRideableMidpointSupport,true);
 const intact=tessellate(a.surfaces[0]),missing=tessellate(road);
 assert(missing.topIndexCount<intact.topIndexCount);
 assert(missing.bottomIndexCount<intact.bottomIndexCount);
 const mid=sample(road,(cut.uTakeoff+cut.uLanding)/2,.5);
 assert.equal(contacts(compile(b),[mid[0],mid[1]+.65,mid[2]],.65)
  .filter(x=>x.triangle.rideable).length,0);
 assert.equal(g4e7qField(G4E7Q_WINDOW.u0).weight,0);
 assert.equal(g4e7qField(G4E7Q_WINDOW.u3).weight,0);
 assert.throws(()=>generateG4E7QPhysical('fake'),/declared/);
});
test('G4E-7Q optional inspection spawns cannot replace native start00',()=>{
 const a=generateG4E7QPhysical('leap'),b=generateG4E7QPhysical('leap',{visualSpawns:true});
 assert.equal(b.spawns.length,a.spawns.length+2);
 assert.deepEqual(b.spawns.slice(0,a.spawns.length),a.spawns);
 assert.equal(b.stageForge.g4e7qStudy.originalSpawns,a.spawns.length);
});
