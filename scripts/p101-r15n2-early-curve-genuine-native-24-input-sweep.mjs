/**
 * R15N2: original unchanged native game 240Hz steering start-time/bias
 * study BEFORE source B48 CROWN_REVERSAL slip. Isolates steering only.
 * No new runway/collider/teleport. Strict t14 source camera parity.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const ROADS=['true-pinch','pinch-switch'];
const STARTS=[15,15.75,16.25,16.5];
const BIASES=[.18,.35,.52];
const END=22;
const round=(v,n=6)=>Number(v.toFixed(n));
const maxdiff=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
const expected=(r)=>{const t=r.originalFullTimelineFrames.find(x=>x.id==='t1400');assert.ok(t);return t};
function scenario(road,start,bias,ref){
 const doc=generateG4E7BC(road,'rollDeck'),unchanged=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.equal(doc.stageForge.productionPromoted,false);
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
 let cam=createCameraState(r.forward),lastRoad=null,firstLateExit=null,contactFrom17=0,allFrom17=0;
 let at14=false,at16=null;
 let lastRetouch=null;const quarter=[];
 let firstAfter17RoadExit=null,recontactsAfter17=0,wasOnRoad17=false;
 for(let tick=1;tick<=Math.round(END/DT);tick++){
  if(['failed','finished'].includes(r.status))break;
  const original=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  const steer=Math.max(-1,Math.min(1,original+(tick*DT>=start?bias:0)));
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  cam=advanceCamera(cam,r.forward,DT);
  const grounded=Boolean(r.grounded&&r.surface);
  if(tick===Math.round(14/DT)){
   const pose=capturePose(r),view=viewForPose(pose,cam),old=expected(ref);
   assert.ok(maxdiff(pose.position,old.playerPosition)<1e-5);
   assert.ok(maxdiff(view.eye,old.eye)<1e-5);
   assert.ok(maxdiff(view.front,old.front)<1e-5);
   assert.equal(r.surface||r.lastSurface,old.physicalRoad);
   assert.equal(r.collisions,old.collisions);
   at14=true;
  }
  if(tick===Math.round(16/DT)){
   const pose=capturePose(r);
   at16={seconds:16,positionXYZ:pose.position.map(v=>round(v,5)),
    realGrounded:grounded,realB48SourceRoad:r.surface||r.lastSurface};
  }
  if(r.time>=17){
   allFrom17++;
   if(grounded)contactFrom17++;
   if(!grounded&&wasOnRoad17&&firstAfter17RoadExit===null){
    firstAfter17RoadExit={tick,seconds:round(r.time),positionXYZ:r.p.map(v=>round(v))};
   }
   if(grounded&&!wasOnRoad17)recontactsAfter17++;
   wasOnRoad17=grounded;
  }
  if(grounded){
   lastRoad={tick,seconds:round(r.time),road:r.surface,
    positionXYZ:r.p.map(v=>round(v)),speedMps:round(Math.hypot(...r.v),3)};
   if(r.time>17)lastRetouch=lastRoad;
  }
  if(tick%60===0||r.status==='failed'||r.status==='finished'){
   if(r.time>=15){
    quarter.push({tick,seconds:round(r.time),road:r.surface,
      positionXYZ:r.p.map(v=>round(v,4)),grounded,
      input:round(steer,4),speedMps:round(Math.hypot(...r.v),3),
      nativeRunnerStatus:r.status});
   }
  }
 }
 assert.ok(at14);
 assert.equal(JSON.stringify(doc),unchanged);
 assert.ok(r.time>=17&&r.time<=END+.001);
 const lastRoadTime=lastRoad?.seconds??0;
 const res={
  controlStartSeconds:start,additiveRightInput:bias,
  exactSourceNativeT14PoseCameraAndContactParity:true,
  actualOriginalSourceScenarioRoad:road,
  sourceAt16:at16,
  originalSourceRunnerStatusAtEnd:r.status,
  actualOriginalRunnerEndTimeSeconds:round(r.time),
  actuallyCompletedOriginalCourse:r.status==='finished',
  originalEngineFailure:r.failure?{
   reason:r.failure.reason,timeSeconds:round(r.failure.t),worldXYZ:r.failure.position.map(v=>round(v,4))}:null,
  physicalOriginalRoadLastGrounded:lastRoad,
  trueRoadContactShareTicksFrom17:allFrom17?round(contactFrom17/allFrom17,5):null,
  recontactTransitionsAfter17:recontactsAfter17,
  firstRecordedRoadExitAfter17:firstAfter17RoadExit,
  sourceQuarterSecondRoadAndInputEvidence:quarter,
  originalGameSourceModified:false,
  originalPlayerInputHumanControlled:false,
  originalB48B51CollidersChanged:false,
  originalCourseWebGLRendered:false,
  originalSourcePhysicsPassedHumanCert:false,
  officialArt:0,officialSlope2Meters:0};
 return res;
}
export function study(refs){
 const all={};
 for(const road of ROADS){
  const ref=refs[road];assert.equal(ref.sourceBlob,SHA);
  const cases=[];
  for(const start of STARTS)for(const bias of BIASES){
   const q=scenario(road,start,bias,ref);
   cases.push(q);
   console.log('R15N2_ORIGINAL_B48_240HZ_EARLY_STEER_TRUE_STATUS',JSON.stringify({
    road,start,bias:round(bias,3),status:q.originalSourceRunnerStatusAtEnd,
    at:q.actualOriginalRunnerEndTimeSeconds,
    lastContact:q.physicalOriginalRoadLastGrounded?.seconds,
    contactAfter17:q.trueRoadContactShareTicksFrom17,
    failure:q.originalEngineFailure?.reason||null}),);
  }
  assert.equal(cases.length,12);
  cases.sort((a,b)=>(
   (b.physicalOriginalRoadLastGrounded?.seconds??0)-(a.physicalOriginalRoadLastGrounded?.seconds??0)
   || (b.trueRoadContactShareTicksFrom17??0)-(a.trueRoadContactShareTicksFrom17??0)
   || a.controlStartSeconds-b.controlStartSeconds || a.additiveRightInput-b.additiveRightInput));
  all[road]=cases;
 }
 return {
  schema:'dopagaki.r15n2-original-source-native-240hz-earlier-steering-24-matched-input-trials/1',
  sourceBlob:SHA,originalPhysicsHz:240,sourceNativeB48:7,sourceNativeB51:28,
  nativeRoads:ROADS,inputStartVariantsSeconds:STARTS,
  analogRightAdditionVariants:BIASES,
  realOriginalRunnerMaximumObservationSeconds:END,
  sourceEvidenceByRoad:all,
  sourceGameEdited:false,actualNewGameRoadGeometry:false,newGameColliders:0,
  genuineHumanControllerPass:false,actualGameWebGLRendered:false,
  gameplayCompletedCourseUnprovenUnlessNativeStatusFinished:true,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
  INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  officialArt:0,officialSlope2Meters:0};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const argv=process.argv.slice(2),get=k=>{const i=argv.indexOf(k);assert.ok(i>=0,k);return argv[i+1]};
 const refs=Object.fromEntries(ROADS.map(r=>[r,JSON.parse(fs.readFileSync(get('--'+r),'utf8'))]));
 const o=study(refs);const folder=get('--out');fs.mkdirSync(folder,{recursive:true});
 fs.writeFileSync(path.join(folder,'R15N2_24_GENUINE_ORIGINAL_NATIVE_B48_EARLIER_RIGHT_INPUT_TRIALS.json'),JSON.stringify(o,null,2)+'\n');
}
