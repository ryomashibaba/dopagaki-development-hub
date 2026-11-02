import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101W9C2SCrestCandidate,W9C2_G3B_OFFLINE,W9C2_VARIANTS} from '../scripts/p101-w9c2-s-crest-build.mjs';
import {w9c2CurvatureDiagnostics,runW9C2G3Passage} from '../scripts/p101-w9c2-g3-native-passage.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';

test('G3B lower-curvature experimental roads never rewrite the original two W9-C2 designs or Gold',()=>{
 const gold=generateP101A13W7Candidate(),json=JSON.stringify(gold);
 const original=Object.fromEntries(Object.keys(W9C2_VARIANTS).map(k=>
  [k,JSON.stringify(generateP101W9C2SCrestCandidate(k))]));
 const originalRadius=w9c2CurvatureDiagnostics(generateP101W9C2SCrestCandidate('ribbon')).minimumHorizontalTurnRadiusMeters;
 for(const [kind,settings] of Object.entries(W9C2_G3B_OFFLINE)){
  const doc=generateP101W9C2SCrestCandidate(kind);
  const old=gold.surfaces;
  assert.equal(doc.stageForge.recordStageId,settings.recordStageId);
  assert.equal(doc.stageForge.w9c2PhysicalStudy.g3bOfflineNotSelectable,true);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.nativeScriptedProof,null);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.deepEqual(doc.surfaces.filter((s,i)=>i!==5),old.filter((s,i)=>i!==5));
  assert.equal(tessellate(doc.surfaces[5]).degenerate,0);
  const p=w9c2CurvatureDiagnostics(doc);
  assert(p.minimumRealB48WidthMeters>15);
  assert(p.minimumHorizontalTurnRadiusMeters>originalRadius*1.5,
   'must substantially reduce S-crest heading demand');
 }
 assert.equal(JSON.stringify(gold),json);
 for(const kind of Object.keys(original))
  assert.equal(JSON.stringify(generateP101W9C2SCrestCandidate(kind)),original[kind],
   'G3B altered reviewed G2 trial '+kind);
});
test('G3B uses the exact normal native steering and 240Hz Runner, never a position teleport',()=>{
 const a=runW9C2G3Passage('arc',105,{maxSeconds:5.25});
 assert.equal(a.physicsHz,240);
 assert.equal(a.actualRunner,true);
 assert.equal(a.explicitSyntheticLocalStart,true);
 assert.equal(a.controller,'P94_CORRECTIVE_SCRIPT_NOT_HUMAN');
 assert.equal(a.collisionRecovery,false);
 assert.equal(a.machineBodies,28);
 assert.equal(a.readyOnRealPhysicalRoad,true);
 assert(a.elapsedSeconds>0);
});
