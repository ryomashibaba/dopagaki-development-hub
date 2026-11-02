import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7RPhysical,g4e7rProfile,G4E7R_GEOMETRY} from '../scripts/p101-w9c2-g4e7r-grade-build.mjs';
import {generateG4E7QPhysical} from '../scripts/p101-w9c2-g4e7q-dive-build.mjs';
import {generateG4E7FEarlyPhysicalCandidate} from '../scripts/p101-w9c2-g4e7f-real-slope-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
test('G4E-7R: independent graded B48 crest/descent, Gold, Q, GLIDE intact',()=>{
 const gold=JSON.stringify(generateP101A13W7Candidate()),
  glide=generateG4E7FEarlyPhysicalCandidate('glide'),g=JSON.stringify(glide),
  q=JSON.stringify(generateG4E7QPhysical('leap'));
 const a=generateG4E7RPhysical('sweep'),b=generateG4E7RPhysical('cut');
 assert.equal(a.surfaces.length,7);assert.equal(b.movingObstacles.length,28);
 for(const d of [a,b]){
  const m=d.stageForge.g4e7rStudy;
  assert.equal(m.realB48,true);assert.equal(m.officialSlope2Meters,0);
  assert.equal(m.nativeTakeoffVerified,false);assert.equal(m.nativeLandingVerified,false);
  assert(m.maxVerticalDeltaMeters>5);assert(m.narrowCoreMinWidthMeters>11);
  assert(m.narrowCoreMinWidthMeters<22);assert(m.modifiedRows>=6);
  assert.equal(tessellate(d.surfaces[0]).degenerate,0);
  assert.deepEqual(d.spawns,glide.spawns);
  assert.deepEqual(d.routeSegments,glide.routeSegments);
  assert.deepEqual(d.surfaces.slice(1),glide.surfaces.slice(1));
  assert.deepEqual(d.movingObstacles,glide.movingObstacles);
  assert.equal(new Runner(d,compile(d),0,52).startSpeed,52);
 }
 assert.deepEqual(a.surfaces[0].points,b.surfaces[0].points);
 assert.notDeepEqual(b.surfaces[0].points,generateG4E7QPhysical('leap').surfaces[0].points);
 assert.equal(a.surfaces[0].voidLongitudinalCells?.length||0,0);
 assert.equal(b.surfaces[0].voidLongitudinalCells.length,1);
 assert.equal(1/DT,240);
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),gold);
 assert.equal(JSON.stringify(generateG4E7FEarlyPhysicalCandidate('glide')),g);
 assert.equal(JSON.stringify(generateG4E7QPhysical('leap')),q);
});
test('G4E-7R: real gap missing collision top and underside; downstream deck descends',()=>{
 const full=generateG4E7RPhysical('sweep'),cut=generateG4E7RPhysical('cut');
 const gap=cut.stageForge.g4e7rStudy.gap,road=cut.surfaces[0];
 assert(gap.actualB48MissingCells);
 assert(gap.gapMeters>2&&gap.gapMeters<20);
 assert.equal(gap.missingRideableMidSupport,true);
 assert(gap.verticalChangeMeters<0,'landing must descend below physical takeoff');
 assert(tessellate(road).topIndexCount<tessellate(full.surfaces[0]).topIndexCount);
 assert(tessellate(road).bottomIndexCount<tessellate(full.surfaces[0]).bottomIndexCount);
 const mid=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5);
 assert.equal(contacts(compile(cut),[mid[0],mid[1]+.65,mid[2]],.65)
  .filter(x=>x.triangle.rideable).length,0);
 assert.equal(g4e7rProfile(G4E7R_GEOMETRY.u0).weight,0);
 assert.equal(g4e7rProfile(G4E7R_GEOMETRY.u3).weight,0);
 assert.throws(()=>generateG4E7RPhysical('invented'),/enumerated/);
});
test('G4E-7R optional inspection spawns do not affect start00 or actual road',()=>{
 const base=generateG4E7RPhysical('cut'),candidate=generateG4E7RPhysical('cut',{inspectionSpawns:true});
 assert.equal(candidate.spawns.length,base.spawns.length+2);
 assert.deepEqual(candidate.spawns.slice(0,base.spawns.length),base.spawns);
 assert.deepEqual(candidate.surfaces,base.surfaces);
 assert.equal(candidate.stageForge.g4e7rStudy.officialSlope2Meters,0);
});
