/**
 * R15R: re-run ORIGINAL 240Hz Runner, unchanged P96 early-soft input, for
 * all eight isolated R15Q real B48 physical designs. Capture the EXACT
 * runtime source chase camera at true simulated time; no interpolated,
 * fabricated post-failure camera frames. Verification against independent
 * persisted R15Q quarter-second native contact/position/speed/steering trace.
 * Research ONLY. This is NOT a browser/WebGL, human, or ART certification.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15Q,R15Q_MODES} from './p101-r15q-isolated-b48-scissor-c1-curve-and-narrow-route.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose,cameraTuning} from '../web/drive3d-camera.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const args=process.argv.slice(2);
const get=k=>{const i=args.indexOf(k);assert.ok(i>=0,'missing '+k);return args[i+1]};
const source=JSON.parse(fs.readFileSync(get('--r15q'),'utf8'));
assert.equal(source.originalGameSourceBlob,SHA);
assert.equal(source.trueOriginal240HzFullTrialCount,8);
const roads=['true-pinch','pinch-switch'], modes=Object.keys(R15Q_MODES);
const refs=Object.fromEntries(roads.map(r=>[r,JSON.parse(fs.readFileSync(get('--'+r),'utf8'))]));
const round=(x,n=6)=>Number(x.toFixed(n));
const vec=x=>x.map(v=>round(v));
const near=(a,b,tol=1e-5)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<=tol);
const output={
 schema:'dopagaki.r15r-actual-native-chase-camera-full-8-r15q-physical-source-trials/1',
 originalSourceGameBlob:SHA,sourceEngineHz:240,
 sourceB48PhysicalRoadVariants:roads,sourcePhysicalDesigns:modes,
 nativeSourceCameraImplementation:'web/drive3d-camera.mjs:viewForPose+advanceCamera; 240Hz no browser interpolation',
 nativeCameraTuning:cameraTuning,actualPhysicalTrialCount:8,
 actualNativeCameraResults:{},sourceR15QQuarterSamplesReplayedExactly:true,
 noInventedPostTerminalCamera:true,newGameColliders:0,
 originalGameEdited:false,originalP96SteeringUnchanged:true,originalB51Preserved:true,
 sourceWebGLRendered:false,humanCameraFairnessCertified:false,
 officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
};
for(const road of roads){
 const ref=refs[road];
 assert.equal(ref.sourceBlob,SHA);
 output.actualNativeCameraResults[road]={};
 for(const mode of modes){
  const old=source.nativeScissorRealEditableSurfaceGeometryTrials[road][mode].true240HzOriginalSourcePhysics;
  assert.equal(old.sourceBlob,SHA);
  const course=buildR15Q(road,mode);
  assert.equal(course.movingObstacles.length,28);
  const collider=compile(course);
  const player=new Runner(course,collider,0,52);
  const plan=makeP96RoutePlan(course,player),surge=createA13SurgeState();
  let camera=createCameraState(player.forward);
  let at17=null;
  const frames=[];
  for(let tick=1;tick<=Math.round(32/DT);tick++){
   if(player.status==='failed'||player.status==='finished')break;
   const steer=p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(player,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
   camera=advanceCamera(camera,player.forward,DT);
   if(tick%60===0||player.status==='failed'||player.status==='finished'){
    const view=viewForPose(capturePose(player),camera);
    if(tick===Math.round(17/DT))at17=view;
    if(player.time>=15){
     const expected=old.nativeQuarterSecondSourcePhysicsTrace.find(x=>x.tick===tick);
     assert.ok(expected,'missing independent native source sample '+road+' '+mode+' '+tick);
     assert.ok(near(vec(player.p),expected.playerWorldXYZ), 'original player xyz');
     assert.equal(Boolean(player.grounded&&player.surface),expected.engineGrounded);
     assert.equal(player.surface,expected.sourceRoad);
     assert.equal(round(Math.hypot(...player.v),4),expected.speedMps);
     assert.equal(round(steer,4),expected.steer);
     assert.equal(player.status,expected.nativeStatus);
     const xyz=vec(player.p),eye=vec(view.eye),front=vec(view.front);
     assert.ok(Math.abs(eye[1]-xyz[1]-7)<1e-5);
     assert.ok(Math.abs(Math.hypot(eye[0]-xyz[0],eye[2]-xyz[2])-14)<1e-5);
     assert.ok(Math.abs(Math.hypot(...front)-1)<1e-5);
     frames.push({tick,seconds:round(player.time),
      sourceOriginalGameCameraEyeXYZ:eye,sourceOriginalGameCameraFrontUnitXYZ:front,
      sourceOriginalGameCameraRightUnitXYZ:vec(view.right),
      sourceOriginalGameCameraUpUnitXYZ:vec(view.up),
      trueNativePlayerWorldXYZ:xyz,
      sourceNativeEngineGrounded:expected.engineGrounded,
      sourceNativeContactRoad:expected.sourceRoad,
      sourceNativeSteer:expected.steer,
      sourceNativeSpeedMps:expected.speedMps,
      sourcePlayerStatus:expected.nativeStatus});
    }
   }
  }
  assert.equal(frames.length,old.nativeQuarterSecondSourcePhysicsTrace.length);
  assert.equal(round(player.time),old.originalSourceTerminalTimeSeconds);
  assert.equal(player.status,old.originalSourceStatus);
  assert.notEqual(player.status,'finished','no false finish');
  assert.ok(at17&&near(vec(at17.eye),old.sourceExact17RealPosCam.sourceViewEye),'17s source camera parity');
  assert.ok(near(vec(player.p),frames.at(-1).trueNativePlayerWorldXYZ,1e-1)||player.time>frames.at(-1).seconds);
  output.actualNativeCameraResults[road][mode]={
   nativeOriginalGameReplayMatchingR15QStoredPhysics:true,
   sourceOriginalB51Count:course.movingObstacles.length,
   originalNativeRunnerStatus:player.status,
   originalNativeRunnerTerminalSeconds:round(player.time),
   actualNativeQuarterSecondCameraFrames:frames,
   actualNativeCameraAt17SourceOriginalParity:true,
   cameraFromGameSourceNotBrowserWebGL:true,
   sourceRealRoadWorldChangedOnlyInResearch:true,
   noHumanOrArtOrFinishedCertification:true};
  console.log('R15R_NATIVE_CAMERA_SOURCE_REPLAY',road,mode,
   frames.length,'last',frames.at(-1).seconds,'terminal',round(player.time),
   'lastGrounded',frames.filter(x=>x.sourceNativeEngineGrounded).at(-1)?.seconds);
 }
}
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15R_EIGHT_ACTUAL_NATIVE_CHASE_CAMERA_240HZ_REPLAY.json',JSON.stringify(output,null,2)+'\n');
