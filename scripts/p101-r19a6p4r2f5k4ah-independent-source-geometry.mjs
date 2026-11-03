/** K4AH: independent re-execution of ORIGINAL source B51 OBB functions. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
const [input,sourceAudit,output]=process.argv.slice(2);
assert.ok(input&&sourceAudit&&output);
const study=JSON.parse(fs.readFileSync(input,'utf8'));
const pixels=JSON.parse(fs.readFileSync(sourceAudit,'utf8'));
const SOURCE='af076d67492a677d2235e4730aef8cdf4808e106';
assert.equal(study.originalSourceBlob,SOURCE);
assert.equal(pixels.originalSourceBlob,SOURCE);
assert.equal(pixels.originalGPUFrameDepthMatchedK4AF,14);
assert.equal(pixels.originalB51GroupMaskDepthMatchedK4AF,14);
assert.equal(pixels.originalRestoreDepthMatched,14);
assert.equal(study.physicsChanged,false);
assert.equal(study.cameraChanged,false);
const near=(a,b,tol=1e-8)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tol;
function vector(a,b,tol=1e-8){
 assert.ok(Array.isArray(a)&&Array.isArray(b)&&a.length===b.length);
 for(let i=0;i<a.length;i++)assert.ok(near(a[i],b[i],tol),
  'K4AH_SOURCE_FUNCTION_VECTOR_MISMATCH index='+i+' expected='+a[i]+' observed='+b[i]);
}
const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const delta=(a,b)=>a.map((x,i)=>x-b[i]);
function verify(frame,mode){
 const g=frame.geometry,d=g.obstacleDescriptor;
 assert.equal(d.id,'p95-hazard-12');
 assert.equal(g.nativeTick,frame.tick);
 assert.equal(g.sourceMask,'none');
 assert.equal(g.originalGameModified,false);
 assert.equal(g.collisionChanged,false);
 assert.equal(d.type,'piston');
 assert.deepEqual(d.size,[8,3,7.5]);
 assert.equal(d.motion.stroke,8);
 assert.equal(d.collision.mode,'push');
 assert.ok(near(g.sourceTimeSeconds,frame.tick/240,1e-5));
 assert.ok(near(g.poseTimeSeconds,frame.tick/240,1e-5));
 const p=movingObstaclePose(d,g.poseTimeSeconds);
 assert.equal(p.id,'p95-hazard-12');
 assert.equal(p.type,'piston');
 vector(p.center,g.originalMovingObstaclePose.center);
 vector(p.halfSize,g.originalMovingObstaclePose.halfSize);
 assert.ok(near(p.yawRadians,g.originalMovingObstaclePose.yawRadians));
 assert.equal(p.enabled,g.originalMovingObstaclePose.enabled);
 assert.deepEqual(p.halfSize,[4,1.5,3.75]);
 const ball=sphereBoxSeparation(g.ballPosition,g.ballRadius,p);
 const eye=sphereBoxSeparation(g.camera.eye,0.001,p);
 assert.ok(near(ball.separation,g.signedBallSurfaceToOBBMeters));
 assert.ok(near(eye.separation+0.001,g.signedCameraEyePointToOBBMeters));
 assert.equal(ball.inside,g.ballInsideOBB);
 assert.equal(eye.inside,g.cameraEyeInsideOBB);
 vector(ball.normal,g.ballSeparationNormal);
 const diff=delta(p.center,g.camera.eye);
 assert.ok(near(Math.hypot(...diff),g.eyeToOBBCenterMeters));
 for(const [axis,unit] of [['horizontal',g.camera.right],
   ['vertical',g.camera.up],['forward',g.camera.front]])
  assert.ok(near(dot(diff,unit),g.eyeToOBBCenterProjection[axis]));
 for(const unit of [g.camera.front,g.camera.right,g.camera.up])
  assert.ok(near(Math.hypot(...unit),1,1e-5));
 return {
  mode,tick:frame.tick,seconds:frame.tick/240,
  originalB51Id:p.id,sourceObstacleType:d.type,collisionMode:d.collision.mode,
  sourcePistonStrokeMeters:d.motion.stroke,
  originalCenterMeters:p.center,halfSizeMeters:p.halfSize,yawRadians:p.yawRadians,
  nativeBallMeters:g.ballPosition,ballRadiusMeters:g.ballRadius,
  nativeEyeMeters:g.camera.eye,nativeFront:g.camera.front,
  signedBallSurfaceToOBBMeters:ball.separation,
  signedEyePointToOBBMeters:eye.separation+0.001,
  ballInsideOBB:ball.inside,eyeInsideOBB:eye.inside,
  eyeToCenterMeters:Math.hypot(...diff),
  viewRelativeMeters:{horizontal:dot(diff,g.camera.right),
   vertical:dot(diff,g.camera.up),forward:dot(diff,g.camera.front)},
  sourceFunctionReexecuted:true,collisionChanged:false,ART:'NOT_TESTED_HOLD'
 };
}
assert.equal(study.sessions.length,2);
const modes=[];
for(const mode of ['ultra','control']){
 const session=study.sessions.find(x=>x.mode===mode);
 assert.ok(session&&session.frames.length===7);
 const frames=session.frames.map(f=>verify(f,mode));
 assert.deepEqual(frames.map(x=>x.tick),[10680,10800,10920,11040,11160,11280,11400]);
 modes.push({mode,frames});
}
const first=study.sessions[0].frames[0];
for(const tamper of [
 q=>q.geometry.originalMovingObstaclePose.center[1]+=1,
 q=>q.geometry.signedCameraEyePointToOBBMeters+=0.7,
 q=>q.geometry.poseTimeSeconds+=1
]){
 const fake=structuredClone(first);tamper(fake);
 let refused=false;try{verify(fake,study.sessions[0].mode);}catch{refused=true;}
 assert.ok(refused,'K4AH_TAMPERED_ORIGINAL_SOURCE_GEOMETRY_WAS_ACCEPTED');
}
const report={
 schema:'dopagaki.K4AH.original-B51-pose-source-function-reexecuted/1',
 status:'ORIGINAL_NATIVE_GEOMETRY_RECOMPUTED_TECH_PASS_ART_HOLD',
 originalSourceBlob:SOURCE,
 independentSourceFunctions:['movingObstaclePose','sphereBoxSeparation'],
 originalNativeFrames:14,sourceP95HazardId:'p95-hazard-12',
 independentNegativeControls:3,
 units:'source_stage_meters_NOT_non_linear_GPU_depth_meters',
 physicalCollisionValidated:false,humanPlaytestValidated:false,
 officialARTAccepted:0,slope2DNAMetres:0,newModels:0,newColliders:0,
 ART:'NOT_TESTED_HOLD',RELEASE:'HOLD',MERGE:'HOLD',modes
};
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'K4AH_SOURCE_FUNCTION_REEXECUTED_GEOMETRY.json'),
 JSON.stringify(report,null,2)+'\n');
const ultra=modes[0].frames.find(x=>x.tick===11280);
const control=modes[1].frames.find(x=>x.tick===11280);
const lines=[
 '# K4AH — 元Road5真正カメラ・球・B51-12 OBB幾何計測',
 '',
 '**SOURCE TECH限定PASS / ART HOLD / 物理・本番不変更。**',
 '',
 '元movingObstaclePoseとsphereBoxSeparationを本物の元描画フレーム内で実行し、別のNode監査で原モジュールから14件再計算。改ざん負例3件も拒否。',
 '',
 'ここでのm単位は元ステージ位置の座標と幾何距離。GPUの非線形深度を距離mに変換した値ではない。',
 '',
 '## 47.0秒の幾何比較',
 '',
 '|指標|14m ultra|28m control|',
 '|---|---:|---:|'
 ];
const metrics=[
 ['カメラeyeとOBB表面の符号付き距離(m)','signedEyePointToOBBMeters'],
 ['球表面とOBB表面の符号付き分離(m)','signedBallSurfaceToOBBMeters'],
 ['カメラeyeとOBB中心の距離(m)','eyeToCenterMeters']
];
for(const [label,key] of metrics)
 lines.push('|'+label+'|'+ultra[key].toFixed(5)+'|'+control[key].toFixed(5)+'|');
for(const [label,key] of [['視線前方のOBB中心投影(m)','forward'],
 ['カメラ水平のOBB中心投影(m)','horizontal'],
 ['カメラ垂直のOBB中心投影(m)','vertical']]){
 lines.push('|'+label+'|'+ultra.viewRelativeMeters[key].toFixed(5)+'|'+
  control.viewRelativeMeters[key].toFixed(5)+'|');
}
lines.push('','## 7時点×2幅のOBBとの符号付き幾何距離','','|秒|14m eye→OBB(m)|28m eye→OBB(m)|14m ball→OBB(m)|28m ball→OBB(m)|','|---:|---:|---:|---:|---:|');
for(let i=0;i<7;i++){
 const a=modes[0].frames[i],b=modes[1].frames[i];
 lines.push('|'+a.seconds.toFixed(1)+'|'+a.signedEyePointToOBBMeters.toFixed(5)+
 '|'+b.signedEyePointToOBBMeters.toFixed(5)+'|'+
 a.signedBallSurfaceToOBBMeters.toFixed(5)+'|'+b.signedBallSurfaceToOBBMeters.toFixed(5)+'|');
}
lines.push('','符号付き値が負である場合は幾何的重なりを示すが、衝突処理のバグや人間ARTの不合格を断言しない。',
 '実衝突判定のタイミング、CCD、プレイ可能性は別工程でのみ審査。',
 '正式採用ART0件・Slope2 DNA 0m、main/本番/PR#46不変更、RELEASE/MERGE HOLD。','');
fs.writeFileSync(path.join(output,'K4AH_ORIGINAL_CAMERA_OBB_FINDINGS_JA.md'),lines.join('\n'));
console.log('K4AH_ORIGINAL_SOURCE_FUNCTION_REEXECUTION_14_OF_14_PASS');
console.log('K4AH_GEOMETRY_TAMPER_NEGATIVE_3_OF_3_PASS');
console.log('K4AH_47S_CONTROL_EYE_TO_OBB_SIGNED_M',control.signedEyePointToOBBMeters);
console.log('K4AH_47S_CONTROL_BALL_TO_OBB_SIGNED_M',control.signedBallSurfaceToOBBMeters);
console.log('K4AH_ART_COLLISION_RELEASE_HOLD');
