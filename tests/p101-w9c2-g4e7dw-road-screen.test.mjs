import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDwSiteSearch,planDwCandidates,DW_PORTAL_WIDTH_METRES,DW_PORTAL_HEIGHT_METRES}
 from '../scripts/p101-w9c2-g4e7dw-screen-road-visibility.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
test('DW original B48 edge offset, 6 authentic 240Hz projections, real 56012 triangle/B51 OBB ray gate without claiming gameplay',()=>{
 const original=g4e7djNativeStoryboard();
 const p=planDwCandidates(original);
 assert.equal(p.original.roads,7);
 assert.equal(p.original.moving,28);
 assert.equal(p.original.sourceCXTriangles+p.original.sourceB48Triangles,56012);
 assert.ok(p.candidatesExamined>=400,p.candidatesExamined);
 assert.ok(p.allSixCameraVisibleCount>=0);
 assert.ok(p.preselection.every(c=>c.nativeCameraProjection.length===6));
 assert.equal(DW_PORTAL_WIDTH_METRES,18);
 assert.equal(DW_PORTAL_HEIGHT_METRES,19);
 const a=buildDwSiteSearch(original,{geometryBudget:12});
 assert.equal(a.schema,'dopagaki.g4e7dw-visibility-pixel-and-actual-original-b48-road-candidate-study/1');
 assert.equal(a.nativeCameraFrames.length,3);
 assert.equal(a.exactStaticTrianglesPerRoad,56012);
 assert.equal(a.exactMovingOBBCountPerNativeFrame,28);
 assert.equal(a.candidatesGenerated,p.candidatesExamined);
 assert.equal(a.fullGeometryEvaluated,Math.min(12,p.allSixCameraVisibleCount));
 assert.equal(a.originalDUComparison.exactOriginalRoadClearance3dMeters,64.5252489601258);
 assert.ok(a.candidates.every(c=>c.nativeCameraProjection.length===6));
 for(const c of a.candidates){
  assert.equal(c.sourceRoadVertexIsRealOriginalSample,true);
  assert.equal(c.notProofOfSafeRoadShoulder,true);
  assert.equal(c.realGameplayPathExists,false);
  assert.equal(c.portalWidthMeters,18);
  assert.equal(c.portalHeightMeters,19);
  assert.equal(c.checks.length,6);
  assert.ok(c.checks.every(x=>x.probesTested===4));
  assert.ok(c.outboardOffsetMeters>=12);
  assert.ok(c.verticalRiseMeters>=2);
  assert.ok(c.minimumReadableWidthPixels>0);
  assert.ok(c.minimumHeightPixels>0);
  if(c.combinedStudyGate==='VISUALLY_PLAUSIBLE_ONLY'){
   assert.equal(c.originalWorldPortalRaysAllClear,true);
   assert.equal(c.simpleLiftToPortalCenterlineStaticClear,true);
   assert.ok(c.minimumReadableWidthPixels>=18);
   assert.ok(c.minimumHeightPixels>=16);
  }
 }
 assert.ok(a.retainedProvisionalStudySites.every(x=>a.candidates.some(c=>c.id===x.id)));
 assert.equal(a.noSourceRoadTouched,true);
 assert.equal(a.gamePhysicsChanged,false);
 assert.equal(a.gameColliderAdded,0);
 assert.equal(a.gameWebGL,'NOT_RUN');
 assert.equal(a.formalVisualArtAdoptionCount,0);
 assert.equal(a.art,'HOLD');
 assert.equal(a.human,'HOLD');
 assert.equal(a.publish,'HOLD');
 assert.equal(a.officialSlope2Meters,0);
});
