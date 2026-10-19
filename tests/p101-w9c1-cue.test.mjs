import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101W9C1AbyssCandidate} from '../scripts/p101-w9c1-abyss-narrow.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {makeW9C1CueProfile,readW9C1Cue,w9c1ApproachMarks,w9c1ArcAt,W9C1_CUE} from '../web/p101-w9c1-approach-cue.mjs';

test('W9-C1 true B48 arc cue is trial-only, bounded and never authorizes human fairness',()=>{
 const gold=generateP101A13W7Candidate(),frozen=JSON.stringify(gold);
 assert.equal(makeW9C1CueProfile(gold,sample),null);
 assert.deepEqual(w9c1ApproachMarks(gold,sample,frame),{vertices:[],stations:0,nonCollision:true});
 for(const kind of ['control','ultra']){
  const doc=generateP101W9C1AbyssCandidate(kind);
  const profile=makeW9C1CueProfile(doc,sample);
  assert.equal(profile.roadId,doc.surfaces[0].id);
  assert.equal(profile.widthMeters,kind==='ultra'?14:28);
  assert.ok(profile.actualLengthMeters>450);
  const marks=w9c1ApproachMarks(doc,sample,frame);
  assert.equal(marks.nonCollision,true);
  assert.equal(marks.stations,5);
  assert.ok(marks.vertices.length>100);
  assert.ok(marks.vertices.every(Number.isFinite));
  assert.equal(readW9C1Cue(profile,{surfaceId:'a-different-road',u:.3,grounded:true,speedMps:65}),null);
  assert.equal(readW9C1Cue(profile,{surfaceId:profile.roadId,u:89/600,grounded:true,speedMps:65}),null);
  const early=readW9C1Cue(profile,{surfaceId:profile.roadId,u:90/600,grounded:true,speedMps:60});
  assert.equal(early.phase,'approach');assert.ok(early.instantaneousEtaSeconds>2);
  assert.ok(early.physicalDistanceToCoreMeters>0);
  assert.equal(early.humanVisibilityConfirmed,false);
  assert.equal(early.etaIsPrediction,false);
  const core=readW9C1Cue(profile,{surfaceId:profile.roadId,u:340/600,grounded:true,speedMps:85});
  assert.equal(core.phase,'core');assert.equal(core.physicalDistanceToCoreMeters,0);
  assert.equal(readW9C1Cue(profile,{surfaceId:profile.roadId,u:480/600,grounded:true,speedMps:90}),null);
  assert.equal(readW9C1Cue(profile,{surfaceId:profile.roadId,u:160/600,grounded:false,speedMps:80}),null);
  assert.ok(w9c1ArcAt(profile,310/600)>w9c1ArcAt(profile,W9C1_CUE.noticeNominalM/600));
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
 }
 assert.equal(JSON.stringify(gold),frozen);
});
