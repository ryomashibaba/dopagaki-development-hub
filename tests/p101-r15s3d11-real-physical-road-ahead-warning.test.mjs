import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {actualOriginalRoadAheadB51Cue} from '../scripts/p101-r15s3d11-source-road-ahead-b51-warning.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const runnerAt=(doc,road,u,time=58)=>({
 p:sample(doc.surfaces[road],u,.5).map((x,i)=>i===1?x+1.1:x),
 surface:doc.surfaces[road].id,time,forward:[0,0,1]});
const cue=(doc,road,u,time)=>actualOriginalRoadAheadB51Cue(doc,runnerAt(doc,road,u,time),
 sample,movingObstaclePose,sphereBoxSeparation);
test('actual 16m real B48 road5 warns 1st original reanchored moving B51 before it is physically close',()=>{
 const doc=buildR15S3D11('true-pinch','B_INNER_CROSSING');
 const freeze=JSON.stringify(doc);
 const r=cue(doc,5,.03,58);
 assert.ok(r,'future B51 must be found on real road5 curve');
 assert.equal(r.sourceRoadIndex,5);
 assert.ok(r.alongActualB48RoadMetres>30&&r.alongActualB48RoadMetres<650);
 assert.equal(r.notPredictedCollision,true);
 assert.equal(r.notPixelVisibilityOrOcclusion,true);
 assert.equal(r.noGuaranteedETA,true);
 assert.ok(r.message.includes('前方B48'));
 assert.ok(!r.message.includes('秒'));
 assert.equal(JSON.stringify(doc),freeze,'HUD source calculation must not move the original solids');
});
test('same real road u=0.42 gives near second relocated B51, no fake route tangent ETA',()=>{
 const doc=buildR15S3D11('pinch-switch','B_INNER_CROSSING');
 const r=cue(doc,5,.415,60);
 assert.ok(r);
 assert.equal(r.sourceRoadIndex,5);
 assert.ok(r.alongActualB48RoadMetres>=0&&r.alongActualB48RoadMetres<650);
 assert.ok(Number.isFinite(r.originalB51AtCurrentTimeSeparationM));
});
test('road6 centerline uses the original real physical final B48, not the misaligned authored route',()=>{
 const doc=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 const r=cue(doc,6,.12,67);
 assert.ok(r);
 assert.equal(r.currentRoadIndex,6);
 assert.equal(r.sourceRoadIndex,6);
 assert.ok(r.alongActualB48RoadMetres>=0&&r.alongActualB48RoadMetres<650);
});
test('without six real moving B51 study there is no speculative danger forecast',()=>{
 const doc=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 delete doc.stageForge.r15s3d11;
 assert.equal(cue(doc,5,.15,58),null);
});
test('off-track original ball does not receive a false authoritative road distance warning',()=>{
 const doc=buildR15S3D11('pinch-switch','B_INNER_CROSSING');
 const r=runnerAt(doc,5,.1,57);
 r.p[0]+=800;
 assert.equal(actualOriginalRoadAheadB51Cue(doc,r,sample,movingObstaclePose,sphereBoxSeparation),null);
});
