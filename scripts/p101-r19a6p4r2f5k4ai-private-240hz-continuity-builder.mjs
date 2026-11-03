/** K4AI / private-only real 240Hz physics-tick camera-to-B51-12 continuity.
 * Extends the K4AH private (not production) renderer; preserves original
 * runner.step, source camera, scripts, stage, steering and source GPU.
 * No interpolation, extrapolation, or guessed visual-occlusion duration.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const originalSource=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const blob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+originalSource.length+'\0'),originalSource])).digest('hex');
assert.equal(blob,'af076d67492a677d2235e4730aef8cdf4808e106');
const from=path.join(root,'dist-private/r19a6p4r2f5k4ah');
const to=path.join(root,'dist-private/r19a6p4r2f5k4ai');
const original=fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8');
let script=original;
function patch(anchor,substitution){
 assert.equal(script.split(anchor).length,2,'K4AI source anchor was changed: '+anchor.slice(0,100));
 script=script.replace(anchor,substitution);
}
const prologue=[
 "const k4aiEnabled=r19a1OptIn&&",
 " ['127.0.0.1','localhost'].includes(location.hostname)&&",
 " new URLSearchParams(location.search).get('k4ai')==='on';",
 "const k4aiNativeTickStart=10680,k4aiNativeTickEnd=11400;",
 "let k4aiNativeRecords=[];",
 "if(k4aiEnabled)window.__k4aiNativeRecords=k4aiNativeRecords;",
 "if(k4aiEnabled)window.__k4aiMetadata={",
 " schema:'dopagaki.K4AI.original-source-240hz-camera-B51-tick-geometry/1',",
 " sourceBlob:'af076d67492a677d2235e4730aef8cdf4808e106',",
 " measuredTicks:[k4aiNativeTickStart,k4aiNativeTickEnd],",
 " sampleRateHz:240,",
 " observationalOnly:true,",
 " cameraModeRequired:'ball-lock-unfiltered-heading',",
 " sourceNativePhysicsChanged:false,sourceCollisionChanged:false,",
 " sourceCameraChanged:false,sourceGPUChanged:false,",
 " ART:'NOT_TESTED_HOLD',RELEASE:'HOLD'",
 "};"
].join('\n');
patch('const k4ahEnabled=r19a1OptIn&&',prologue+'\nconst k4ahEnabled=r19a1OptIn&&');
const sourceTickAnchor='canvas.dataset.r19a1B51=String(doc.movingObstacles.length);';
const tickLogic=[
 "if(k4aiEnabled&&r19a1Ticks>=k4aiNativeTickStart&&r19a1Ticks<=k4aiNativeTickEnd){",
 " if(comparisonMode!=='ball-lock-unfiltered-heading')",
 "  throw Error('K4AI_ORIGINAL_CAMERA_MODE_WAS_CHANGED');",
 " const targets=doc.movingObstacles.filter(x=>x.id==='p95-hazard-12');",
 " if(targets.length!==1||doc.movingObstacles.length!==28)",
 "  throw Error('K4AI_SOURCE_B51_DESCRIPTOR_NOT_UNIQUE_OR_COUNT_DRIFT');",
 " if(!currentPose||!Array.isArray(currentPose.position))",
 "  throw Error('K4AI_ORIGINAL_NATIVE_CURRENT_POSE_MISSING');",
 " const ob=targets[0],obPose=movingObstaclePose(ob,currentPose.time);",
 " if(r19a1Ticks===k4aiNativeTickStart)",
 "  window.__k4aiMetadata.originalB51Descriptor=structuredClone(ob);",
 " const liveView=viewForPose(currentPose,createCameraState(currentPose.forward));",
 " const ballOBB=sphereBoxSeparation(currentPose.position,RADIUS,obPose);",
 " const eyeOBB=sphereBoxSeparation(liveView.eye,0.001,obPose);",
 " const offset=obPose.center.map((v,i)=>v-liveView.eye[i]);",
 " const product=(a,b)=>a.reduce((t,v,i)=>t+v*b[i],0);",
 " const newRecord={",
 "  nativeTick:r19a1Ticks,sourceSeconds:runner.time,",
 "  originalDisplayPoseTime:currentPose.time,",
 "  originalRoad:runner.surface,originalStatus:runner.status,",
 "  originalB51Id:ob.id,originalB51Type:ob.type,",
 "  originalB51DescriptorJSON:JSON.stringify(ob),",
 "  sourceStageRecordId:doc.stageForge.recordStageId,",
 "  originalSourceBallCenter:[...currentPose.position],",
 "  originalSourceBallRadius:RADIUS,",
 "  originalSourceCameraEye:[...liveView.eye],",
 "  originalSourceCameraFront:[...liveView.front],",
 "  originalSourceCameraRight:[...liveView.right],",
 "  originalSourceCameraUp:[...liveView.up],",
 "  originalSourceOBBCenter:[...obPose.center],",
 "  originalSourceOBBHalfSize:[...obPose.halfSize],",
 "  originalSourceOBBYawRadians:obPose.yawRadians,",
 "  signedEyePointToOBBMeters:eyeOBB.separation+0.001,",
 "  signedBallSurfaceToOBBMeters:ballOBB.separation,",
 "  eyeInsideOBB:eyeOBB.inside,ballInsideOBB:ballOBB.inside,",
 "  eyeToOBBCenterMeters:Math.hypot(...offset),",
 "  projectionMeters:{forward:product(offset,liveView.front),",
 "   horizontal:product(offset,liveView.right),",
 "   vertical:product(offset,liveView.up)},",
 "  sourceCollisionResultNOT_MEASURED:true,",
 "  originalGPUVisualOcclusionNOT_MEASURED:true",
 " };",
 " k4aiNativeRecords.push(newRecord);",
 " if(r19a1Ticks===k4aiNativeTickEnd)",
 "  window.__k4aiContinuityReady=true;",
 "}"
].join('\n');
patch(sourceTickAnchor,sourceTickAnchor+'\n'+tickLogic);
assert.ok(script.includes("originalGPUVisualOcclusionNOT_MEASURED:true"));
assert.ok(!original.includes("k4aiNativeRecords"));
assert.ok(script.includes("viewForPose(currentPose,createCameraState(currentPose.forward))"));
fs.rmSync(to,{force:true,recursive:true});
fs.cpSync(from,to,{recursive:true});
fs.writeFileSync(path.join(to,'drive3d.mjs'),script,'utf8');
assert.equal(fs.readFileSync(path.join(from,'drive3d.mjs'),'utf8'),original);
console.log('K4AI_SOURCE_240HZ_CONTINUITY_PRIVATE_ONLY_BUILT',JSON.stringify({
 blob,tickStart:10680,tickEnd:11400,expectedSamplesPerWidth:721,
 originalCameraMode:'ball-lock-unfiltered-heading',
 sourceRendererUnmodified:true,sourceSteeringUnmodified:true,
 sourcePhysicsUnmodified:true,sourceCollidersUnmodified:true,
 sourceGPUUnmodified:true,ART:'NOT_TESTED_HOLD'}));
