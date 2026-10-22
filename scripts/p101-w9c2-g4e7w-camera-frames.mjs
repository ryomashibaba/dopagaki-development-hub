/**
 * G4E-7W high-speed review: actual canonical start00 physics at 240Hz,
 * ball-locked camera from original game. P96 is scripted research, NOT human.
 */
import {generateG4E7WBlend} from './p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
export const G4E7W_VISUAL_PROFILES=Object.freeze([
 Object.freeze({name:'A065',alpha:.65}),
 Object.freeze({name:'A070',alpha:.7})
]);
export const G4E7W_SHOTS=Object.freeze([
 Object.freeze({id:'approach',seconds:4.75}),
 Object.freeze({id:'lip',seconds:4.9}),
 Object.freeze({id:'flight',seconds:5.15}),
 Object.freeze({id:'landing',seconds:5.45}),
 Object.freeze({id:'post',seconds:5.8})
]);
const fmt=(x,p=5)=>Number(x.toFixed(p));
export function g4e7wNativeCameraFrames(){
 const stages={};
 for(const q of G4E7W_VISUAL_PROFILES){
  const doc=generateG4E7WBlend(q.alpha),r=new Runner(doc,compile(doc),0,52),
   plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
  let state=createCameraState(r.forward),next=0;
  const frames=[];
  for(let tick=1;tick<=6.3/DT&&next<G4E7W_SHOTS.length;tick++){
   if(['failed','finished'].includes(r.status))break;
   const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
   state=advanceCamera(state,r.forward,DT);
   const target=G4E7W_SHOTS[next];
   if(r.time+1e-6>=target.seconds){
    const pose=capturePose(r),view=viewForPose(pose,state);
    frames.push({id:target.id,source:'TRUE_START00_240HZ_P96_NOT_HUMAN',
     tick,seconds:fmt(r.time),timeSeconds:fmt(r.time),
     speedMps:fmt(Math.hypot(...r.v),3),grounded:r.grounded,
     physicalRoad:r.surface||r.lastSurface,
     pose,velocity:[...r.v],yaw:state.yaw,
     eye:[...view.eye],front:[...view.front],
     realCollisionCount:r.collisions});
    next++;
   }
  }
  if(frames.length!==5||frames.some(x=>!Number.isFinite(x.speedMps)||x.speedMps<=0))
   throw Error('W genuine 240Hz camera evidence incomplete: '+q.name);
  stages[q.name]={stageId:doc.stageForge.recordStageId,alpha:q.alpha,frames,
   physicalGap:doc.stageForge.g4e7wStudy.gap,
   movingMachines:28,actualRoads:7,humanFairness:'UNTESTED'};
 }
 return {schema:'dopagaki.g4e7w-real-native-B48-WebGL/1',
  real240Hz:1/DT,initialSpeedMps:52,
  fullNativeControl:'P96_EARLYSOFT_DIV4_8_NONHUMAN',
  camera:'UNCHANGED_RELATIVE_BALL_CAMERA',shotTimings:G4E7W_SHOTS,
  stages,actualStagePhysicsUnmodified:true,
  officialSlope2Meters:0,publish:'HOLD',humanVisibility:'UNREVIEWED'};
}
