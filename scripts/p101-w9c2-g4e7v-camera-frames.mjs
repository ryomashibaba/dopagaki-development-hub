/**
 * G4E-7V HONEST camera A/B/C: real 240Hz start00 physics positions,
 * speed and existing ball-locked yaw. Frame holding is visual research only.
 */
import {generateG4E7VExit} from './p101-w9c2-g4e7v-exit-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
export const G4E7V_VISUAL_IDS=Object.freeze(['original','exit6','slope6']);
export const G4E7V_FRAMES=Object.freeze([
 Object.freeze({id:'approach',timeSeconds:4.8}),
 Object.freeze({id:'impact',timeSeconds:5}),
 Object.freeze({id:'outbound',timeSeconds:5.4}),
 Object.freeze({id:'lookahead',timeSeconds:6})
]);
const fmt=(x,p=5)=>Number(x.toFixed(p));
export function g4e7vRealCameraFrames(){
 const stages={};
 for(const variant of G4E7V_VISUAL_IDS){
  const doc=generateG4E7VExit(variant),r=new Runner(doc,compile(doc),0,52),
   plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
  let camera=createCameraState(r.forward),next=0,frames=[];
  for(let tick=1;tick<=7/DT&&next<G4E7V_FRAMES.length;tick++){
   if(r.status==='failed'||r.status==='finished')break;
   const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
   camera=advanceCamera(camera,r.forward,DT);
   const target=G4E7V_FRAMES[next];
   if(r.time+1e-6>=target.timeSeconds){
    const pose=capturePose(r),view=viewForPose(pose,camera);
    frames.push({id:target.id,source:'NATIVE_START00_240HZ_P96_NOT_HUMAN',
     tick,timeSeconds:fmt(r.time),speedMps:fmt(Math.hypot(...r.v),3),
     grounded:r.grounded,roadId:r.surface||r.lastSurface,pose,
     velocity:[...r.v],
     yaw:camera.yaw,eye:[...view.eye],front:[...view.front],
     physicalCollisionCount:r.collisions});
    next++;
   }
  }
  if(frames.length!==G4E7V_FRAMES.length||frames.some(f=>f.speedMps<50))
   throw Error('Missing G4E-7V genuine 240Hz frame: '+variant);
  stages[variant]={stageId:doc.stageForge.recordStageId,
   realRoads:7,movingMachines:28,frames,
   actualNarrowWidthMeters:doc.stageForge.g4e7vStudy.realNarrowWidthMeters,
   realGapMeters:doc.stageForge.g4e7vStudy.realGapLengthMeters,
   humanPlayability:'NOT_OBSERVED'};
 }
 return {schema:'dopagaki.g4e7v-honest-native-speed-WebGL/1',
  originalNativeStartSpeedMps:52,physicsHz:1/DT,
  input:'P96_EARLYSOFT_DIV4_8_SCRIPTED_NOT_HUMAN',
  frameTargets:G4E7V_FRAMES,
  comparisonBasis:'SAME_NATURAL_TIME_DIFFERENT_GENUINE_PHYSICS_POSE',
  cameraAlgorithm:'NATIVE_BALL_LOCK_ORIGINAL',
  stages,normalPlayUnchanged:true,
  officialSlope2Meters:0,visualQuality:'UNREVIEWED',publication:'HOLD'};
}
