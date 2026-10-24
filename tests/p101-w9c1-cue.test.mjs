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

import {createB5ManualAudit,recordB5ManualSample,exportB5ManualAudit} from '../web/p101-b5-manual-qa.mjs';
test('W9-C1 manual exports include optional observed cue samples, without changing B5 schema',()=>{
 const opts={time:2,speed:73,fps:56,frameDelta:.017,input:-1,edge:'caution',surface:'s1',
  grounded:true,hazard:'none',w9c1NoticePhase:'approach',w9c1NoticeEtaSeconds:2.4,w9c1NoticeNominalMeters:145};
 const c1=createB5ManualAudit({stageId:'VB-P101-A13-W9C1-ULTRA'});
 assert.equal(recordB5ManualSample(c1,opts),true);
 const sample=JSON.parse(exportB5ManualAudit(c1)).samples[0];
 assert.equal(sample.w9c1NoticePhase,'approach');
 assert.equal(sample.w9c1EtaAtCurrentSpeedSeconds,2.4);
 assert.equal(sample.w9c1NominalRoadMeters,145);
 const b5=createB5ManualAudit({stageId:'VB-P101-B5'});
 assert.equal(recordB5ManualSample(b5,opts),true);
 assert.equal('w9c1NoticePhase' in JSON.parse(exportB5ManualAudit(b5)).samples[0],false);
});

test('W9-C1 edge strips track actual skins without changing any stage data',()=>{
 for(const kind of ['control','ultra']){
  const doc=generateP101W9C1AbyssCandidate(kind),before=JSON.stringify(doc);
  const marks=w9c1ApproachMarks(doc,sample,frame);
  const baseline=w9c1ApproachMarks(doc,sample,frame,{includeEdges:false});
  assert.deepEqual(marks.vertices.slice(0,marks.edgeVertexStart),baseline.vertices);
  assert.equal(marks.edgeSegments,124);
  assert.equal(marks.edgeVertexCount,744);
  // Every vertex is a physical sample + 34cm normal lift; test actual 3D
  // coordinates, not just metadata or a synthetic flat-road mock.
  let cursor=marks.edgeVertexStart;
  for(let m=90;m<400;m+=5){
   const a=m/600,b=(m+5)/600;
   const band=u=>{
    const width=Math.hypot(...sample(doc.surfaces[0],u,0).map((x,k)=>x-sample(doc.surfaces[0],u,1)[k]));
    return [.015,.015+.6/width];
   };
   const [a0,a1]=band(a),[b0,b1]=band(b);
   for(const side of [0,1]){
    const v=x=>side?1-x:x;
    const points=[[a,v(a0)],[b,v(b0)],[b,v(b1)],[a,v(a0)],[b,v(b1)],[a,v(a1)]];
    const stripWidth=Math.hypot(...sample(doc.surfaces[0],a,v(a0)).map((x,k)=>x-sample(doc.surfaces[0],a,v(a1))[k]));
    assert.ok(stripWidth>.3&&stripWidth<1.2,'physical edge stripe width '+stripWidth);
    for(const [u,vv] of points){
     const p=sample(doc.surfaces[0],u,vv),n=frame(doc.surfaces[0],u,vv).normal;
     const q=p.map((x,k)=>x+(n[1]<0?-1:1)*n[k]*.34);
     assert.ok(Math.hypot(...q.map((x,k)=>x-marks.vertices[cursor+k]))<1e-9);
     cursor+=6;
    }
   }
  }
  assert.equal(cursor,marks.vertices.length);
  assert.equal(JSON.stringify(doc),before,'decor must never mutate physical data');
 }
});
