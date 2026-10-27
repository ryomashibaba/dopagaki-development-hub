import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDvRoadEntrySurvey} from '../scripts/p101-w9c2-g4e7dv-road-entrance-survey.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
import {DU_CORRIDOR} from '../scripts/p101-w9c2-g4e7du-exact-sightline.mjs';
test('DV original game B48 top triangles vs DU entrance all 7 roads - explicit path noncertification',()=>{
 const native=g4e7djNativeStoryboard();const audits=[];
 for(const road of ['true-pinch','pinch-switch']){
  const q=buildDvRoadEntrySurvey(road,native);audits.push(q);
  assert.equal(q.schema,'dopagaki.g4e7dv-road-to-civic-entrance-survey/1');
  assert.equal(q.realB48Surfaces,7);assert.equal(q.realB51Movers,28);
  assert.equal(q.originalGapCell52,true);
  assert.equal(q.targetAudits.length,6);
  assert.deepEqual(q.duCorridor,DU_CORRIDOR);
  assert.equal(q.obstacleSnapshotNearby.length,3);
  for(const item of q.targetAudits){
   const n=item.nearestActualPhysicsTop;
   assert.ok(n.distanceMeters>=0&&Number.isFinite(n.distanceMeters));
   assert.ok(n.horizontalDistanceMeters>=0&&Number.isFinite(n.horizontalDistanceMeters));
   assert.ok(Number.isFinite(n.elevationDeltaMeters));
   assert.equal(n.point.length,3);
   assert.ok(n.triangle>=0);
   assert.ok(n.isGameExistingSurface);
   assert.equal(item.originalFloorAtTargetExists,n.distanceMeters<.25);
   assert.equal(item.plannedPublicAccessColliderAdded,false);
  }
  assert.equal(q.roadContactFromEntryTest,'EXACT_B48_TRIANGLE_NEAREST_POINT');
  assert.equal(q.realPlayableConnectionCreated,false);
  assert.equal(q.connectionClaim,'NOT_ESTABLISHED');
  assert.equal(q.actualGamePhysicsModified,false);
  assert.equal(q.additionalGameColliders,0);
  assert.equal(q.realWebGL,'NOT_RENDERED');assert.equal(q.art,'HOLD');
  assert.equal(q.officialSlope2Meters,0);
 }
 assert.notDeepEqual(audits[0].originalSourceStageId,audits[1].originalSourceStageId);
 assert.throws(()=>buildDvRoadEntrySurvey('invented-slope',native),/requires original B48 road/);
});