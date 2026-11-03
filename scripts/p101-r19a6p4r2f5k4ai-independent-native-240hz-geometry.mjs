/** K4AI: independent ORIGINAL camera/physics source-function replay.
 * 2 widths x 721 ORIGINAL 240Hz engine ticks, 7 K4AH GPU-proven anchors each.
 * Geometric proximity is NOT a continuously measured GPU occlusion duration.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {viewForPose,createCameraState} from '../web/drive3d-camera.mjs';
import {DT,RADIUS} from '../private/reference_only/director/physics.js';
const [currentFile,parentFile,outDir]=process.argv.slice(2);
assert.ok(currentFile&&parentFile&&outDir);
const SRC='af076d67492a677d2235e4730aef8cdf4808e106';
const PARENT_SHA='84b4a185fb1c3c37454213b334c3c5db2a8fc6871500dca33d2255ec8a85beb0';
const TICKS=[10680,10800,10920,11040,11160,11280,11400],START=10680,END=11400,N=721;
assert.equal(DT,1/240);assert.equal(RADIUS,.65);
const raw=fs.readFileSync(parentFile);
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),PARENT_SHA);
const parent=JSON.parse(raw),study=JSON.parse(fs.readFileSync(currentFile,'utf8'));
assert.equal(parent.originalSourceBlob,SRC);assert.equal(study.originalSourceBlob,SRC);
assert.equal(study.Hz,240);assert.equal(study.B48,7);assert.equal(study.B51,28);
assert.deepEqual(study.errors,[]);assert.equal(study.sessions.length,2);
assert.equal(study.physicsChanged,false);assert.equal(study.cameraChanged,false);
assert.equal(study.originalSourceGameChanged,false);
assert.equal(study.newModels,0);assert.equal(study.newColliders,0);
assert.equal(study.officialARTAccepted,0);assert.equal(study.slope2DNAMetres,0);
assert.equal(study.ART,'NOT_TESTED_HOLD');
assert.equal(study.RELEASE,'HOLD');assert.equal(study.MERGE,'HOLD');
const near=(x,y,tol=1e-8)=>{assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=tol,
 'SOURCE_VALUE_MISMATCH '+x+' != '+y);};
const same3=(x,y)=>{assert.equal(x.length,3);assert.equal(y.length,3);for(let i=0;i<3;i++)near(x[i],y[i]);};
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function validate(t,desc,mode){
 assert.ok(Number.isSafeInteger(t.nativeTick)&&t.nativeTick>=START&&t.nativeTick<=END);
 near(t.sourceSeconds,t.nativeTick/240,1e-5);
 near(t.originalDisplayPoseTime,t.nativeTick/240,1e-5);
 assert.equal(t.originalB51Id,'p95-hazard-12');
 assert.equal(t.originalB51Type,'piston');
 assert.equal(t.originalRoad,'p93-PRISM_CREST-01');
 assert.equal(t.originalStatus,'running');
 assert.equal(t.sourceStageRecordId,'VB-P101-A13-W9C1-'+mode.toUpperCase());
 assert.equal(t.sourceCollisionResultNOT_MEASURED,true);
 assert.equal(t.originalGPUVisualOcclusionNOT_MEASURED,true);
 assert.deepEqual(JSON.parse(t.originalB51DescriptorJSON),desc);
 near(t.originalSourceBallRadius,RADIUS);
 const pose={position:t.originalSourceBallCenter,forward:t.originalSourceBallForward,time:t.originalDisplayPoseTime};
 const v=viewForPose(pose,createCameraState(pose.forward));
 same3(v.eye,t.originalSourceCameraEye);same3(v.front,t.originalSourceCameraFront);
 same3(v.right,t.originalSourceCameraRight);same3(v.up,t.originalSourceCameraUp);
 const ob=movingObstaclePose(desc,pose.time);
 same3(ob.center,t.originalSourceOBBCenter);same3(ob.halfSize,t.originalSourceOBBHalfSize);
 near(ob.yawRadians,t.originalSourceOBBYawRadians);
 assert.deepEqual(ob.halfSize,[4,1.5,3.75]);
 const ball=sphereBoxSeparation(pose.position,RADIUS,ob);
 const eye=sphereBoxSeparation(v.eye,.001,ob);
 near(ball.separation,t.signedBallSurfaceToOBBMeters);
 near(eye.separation+.001,t.signedEyePointToOBBMeters);
 assert.equal(ball.inside,t.ballInsideOBB);
 assert.equal(eye.inside,t.eyeInsideOBB);
 const delta=ob.center.map((x,i)=>x-v.eye[i]);
 near(Math.hypot(...delta),t.eyeToOBBCenterMeters);
 for(const [name,axis] of [['forward',v.front],['horizontal',v.right],['vertical',v.up]])
  near(dot(delta,axis),t.projectionMeters[name]);
 return {
  mode,tick:t.nativeTick,seconds:t.nativeTick/240,
  signedEyeOBBMeters:eye.separation+.001,signedBallOBBMeters:ball.separation,
  eyeInsideOBB:eye.inside,ballInsideOBB:ball.inside,
  eyeToCenterMeters:Math.hypot(...delta),
  viewForwardCenterMeters:dot(delta,v.front)
 };
}
function intervals(records,yes){
 const items=[];let start=-1;
 for(let i=0;i<=records.length;i++){
  const hit=i<records.length&&yes(records[i]);
  if(hit&&start<0)start=i;
  if(!hit&&start>=0){
   const a=records[start].tick,b=records[i-1].tick;
   items.push({firstTick:a,lastTickInclusive:b,firstSeconds:a/240,
    lastSecondsInclusive:b/240,observedTickCount:i-start,
    observedTickDurationSeconds:(i-start)/240});
   start=-1;
  }
 }
 const total=items.reduce((n,x)=>n+x.observedTickCount,0);
 return {sampleCount:total,observedTickDurationSeconds:total/240,
  interpretation:'GEOMETRIC_NATIVE_TICK_WINDOW_NOT_GPU_VISUAL_DURATION',intervals:items};
}
const outModes=[],flat=[];let negatives=0;
for(const mode of ['ultra','control']){
 const cur=study.sessions.find(x=>x.mode===mode),old=parent.sessions.find(x=>x.mode===mode);
 assert.ok(cur&&old&&cur.frames.length===7&&cur.masks.length===7&&cur.restored.length===7);
 const t=cur.continuousNative240Hz;
 assert.ok(t&&t.ready&&t.records.length===N);
 assert.equal(t.meta.sourceBlob,SRC);
 assert.equal(t.meta.sampleRateHz,240);assert.deepEqual(t.meta.measuredTicks,[START,END]);
 assert.equal(t.meta.sourceNativePhysicsChanged,false);
 assert.equal(t.meta.sourceCollisionChanged,false);
 assert.equal(t.meta.sourceCameraChanged,false);
 assert.equal(t.meta.sourceGPUChanged,false);
 assert.equal(t.meta.cameraModeRequired,'ball-lock-unfiltered-heading');
 const desc=t.meta.originalB51Descriptor;
 assert.ok(desc&&desc.id==='p95-hazard-12');
 assert.equal(desc.type,'piston');assert.deepEqual(desc.size,[8,3,7.5]);
 assert.equal(desc.motion.stroke,8);assert.equal(desc.collision.mode,'push');
 assert.deepEqual(desc,old.frames[0].geometry.obstacleDescriptor);
 const points=t.records.map((q,i)=>{assert.equal(q.nativeTick,START+i);return validate(q,desc,mode);});
 flat.push(...points);
 // Prove the tick-recorder exactly reproduces every previously audited
 // genuine source WebGL + K4AH geometry anchor (not a new simulated path).
 for(let j=0;j<7;j++){
  const a=cur.frames[j],base=old.frames[j],q=t.records[TICKS[j]-START];
  assert.equal(a.tick,TICKS[j]);assert.equal(base.tick,TICKS[j]);
  same3(q.originalSourceBallCenter,base.geometry.ballPosition);
  same3(q.originalSourceCameraEye,base.geometry.camera.eye);
  same3(q.originalSourceOBBCenter,base.geometry.originalMovingObstaclePose.center);
  near(q.signedEyePointToOBBMeters,base.geometry.signedCameraEyePointToOBBMeters);
  near(q.signedBallSurfaceToOBBMeters,base.geometry.signedBallSurfaceToOBBMeters);
  near(a.geometry.signedEyePointToOBBMeters,base.geometry.signedCameraEyePointToOBBMeters);
  near(a.geometry.signedBallSurfaceToOBBMeters,base.geometry.signedBallSurfaceToOBBMeters);
 }
 // Four independent negative controls per width.
 for(const mutation of [
  x=>x.sourceSeconds+=1/60,
  x=>x.originalSourceCameraEye[1]+=.02,
  x=>x.originalSourceOBBCenter[1]+=1,
  x=>x.originalB51DescriptorJSON=JSON.stringify({...desc,size:[8,30,7.5]})
 ]){
  const altered=structuredClone(t.records[0]);mutation(altered);
  let failed=false;try{validate(altered,desc,mode);}catch{failed=true;}
  assert.ok(failed,'K4AI_TAMPERED_GEOMETRY_NOT_REJECTED');negatives++;
 }
 const thresholds={};
 for(const d of [0,1,2,5,10,20,50,100])
  thresholds['signedEyeDistanceAtMost'+d+'m']=intervals(points,x=>x.signedEyeOBBMeters<=d);
 thresholds.eyeInsideOBB=intervals(points,x=>x.eyeInsideOBB);
 thresholds.ballOverlapsOBB=intervals(points,x=>x.signedBallOBBMeters<0);
 const minEye=points.reduce((a,x)=>x.signedEyeOBBMeters<a.signedEyeOBBMeters?x:a);
 const minBall=points.reduce((a,x)=>x.signedBallOBBMeters<a.signedBallOBBMeters?x:a);
 outModes.push({mode,nativeTicksValidated:N,
  sourceOriginalCameraRecomputed:N,sourceOriginalOBBRecomputed:N,
  originalK4AHRealGPUReferenceAnchorsMatched:7,
  minCameraSeparation:minEye,minBallSeparation:minBall,
  geometricProximityWindows:thresholds,
  continuousGPUVisibilityDuration:'NOT_MEASURED_UNKNOWN',
  observedTrueNativeTicks:points});
}
assert.equal(flat.length,1442);assert.equal(negatives,8);
const summary={
 schema:'dopagaki.K4AI.native-240hz-source-camera-B51-geometry-only/1',
 decision:'GEOMETRY_1442_NATIVE_TICKS_SOURCE_TECH_PASS_VISUAL_DURATION_ART_HOLD',
 originalSourceBlob:SRC,pinnedK4AHRawSHA256:PARENT_SHA,
 originalHz:240,measuredNativeWindow:[START,END],
 originalPhysicsTicks:1442,originalCameraReexecutions:1442,originalOBBReexecutions:1442,
 trueGPUVerifiedGeometryAnchorCount:14,independentTamperControls:8,
 continuousGPUVisualMaskCount:0,actualVisualObstructionDuration:'UNKNOWN_NOT_MEASURED',
 originalPhysicsOrCollisionModified:false,
 originalCameraModified:false,newModels:0,newColliders:0,
 officialARTAccepted:0,slope2DNARecognizedMetres:0,
 ART:'NOT_TESTED_HOLD',SAT:'HOLD',CCD:'HOLD',HUMAN:'NOT_TESTED',
 FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 modes:outModes.map(x=>({...x,observedTrueNativeTicks:undefined}))
};
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'K4AI_240HZ_GEOMETRIC_WINDOWS.json'),JSON.stringify(summary,null,2)+'\n');
fs.writeFileSync(path.join(outDir,'K4AI_1442_VERIFIED_NATIVE_SOURCE_TICKS.json'),
 JSON.stringify({...summary,modes:outModes},null,2)+'\n');
const cols=['mode','tick','seconds','signedEyeOBBMeters','signedBallOBBMeters','eyeInsideOBB',
 'ballInsideOBB','eyeToCenterMeters','viewForwardCenterMeters'];
fs.writeFileSync(path.join(outDir,'K4AI_ORIGINAL_NATIVE_1442_TICKS.csv'),
 cols.join(',')+'\n'+flat.map(q=>cols.map(k=>String(q[k])).join(',')).join('\n')+'\n');
const note=[
 '# K4AI — 真正元物理240Hzカメラ・B51-12の連続幾何',
 '',
 '**SOURCE幾何1442点TECH限定PASS。実GPU視界遮蔽が続いた秒数・ART・安全性は未測定／HOLD。**',
 '',
 'K4AHの14真正GPU/原画像アンカーと同じ物理経路で、元Runnerの240Hz固定ステップ721点×2幅を測定し、元カメラ/障害物関数を独立再実行。4改ざん負例×2幅を拒否。',
 '',
 '距離閾値の継続秒数は「条件を満たした元物理tick数÷240」。これは**画面遮蔽の時間**やART可視性とは別の幾何学的近接時間。',
 '',
 '|幾何指標|14m ultra|28m control|','|---|---:|---:|'
];
const metrics=[
 ['眼と障害物最短表面距離(m)',x=>x.minCameraSeparation.signedEyeOBBMeters],
 ['最短時刻(s)',x=>x.minCameraSeparation.seconds],
 ['球と障害物最短表面距離(m)',x=>x.minBallSeparation.signedBallOBBMeters],
 ['眼が障害物内部にあった物理tick数',x=>x.geometricProximityWindows.eyeInsideOBB.sampleCount],
 ['眼と障害物が1m以内の物理tick数',x=>x.geometricProximityWindows.signedEyeDistanceAtMost1m.sampleCount],
 ['眼と障害物が5m以内の物理tick数',x=>x.geometricProximityWindows.signedEyeDistanceAtMost5m.sampleCount],
 ['眼と障害物が10m以内の物理tick数',x=>x.geometricProximityWindows.signedEyeDistanceAtMost10m.sampleCount]
];
for(const [name,get] of metrics){
 const v=outModes.map(get);note.push('|'+name+'|'+v.map(x=>Number.isInteger(x)?String(x):x.toFixed(6)).join('|')+'|');
}
note.push('','## 結論の範囲','',
 'カメラとOBBの幾何的接近は、同じ240Hz時点での真正な物理位置関係。実GPUにその障害物が画面上で占めた面積や、それが何秒続いたかは**未測定**。',
 '深度マスクは別途K4AF 7時点×2幅でのみ真正測定済み。欠けた714時点へGPU遮蔽率を補間しない。',
 '元ゲーム、球、カメラ、240Hz、B48 7、B51 28、main、本番、PR#46は未変更。正式ART 0件、Slope2 DNA 0m、RELEASE/MERGE HOLD。','');
fs.writeFileSync(path.join(outDir,'K4AI_NATIVE_240HZ_GEOMETRY_FINDINGS_JA.md'),note.join('\n'));
console.log('K4AI_PINNED_K4AH_RAW_SHA_PASS');
console.log('K4AI_1442_ORIGINAL_CAMERA_AND_OBB_SOURCE_FUNCTION_PASS');
console.log('K4AI_14_GENUINE_K4AH_GPU_ANCHOR_POSES_MATCH');
console.log('K4AI_8_GEOMETRY_TAMPER_NEGATIVE_CONTROLS_PASS');
console.log('K4AI_28M_MIN_EYE_OBB_M',outModes[1].minCameraSeparation.signedEyeOBBMeters);
console.log('K4AI_28M_EYE_INSIDE_OBB_TICKS',outModes[1].geometricProximityWindows.eyeInsideOBB.sampleCount);
console.log('K4AI_VISUAL_OCCLUSION_DURATION_NOT_MEASURED_ART_HOLD');
