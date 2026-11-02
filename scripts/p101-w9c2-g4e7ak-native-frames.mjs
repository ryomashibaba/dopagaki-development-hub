/**
 * G4E-7AK gate 2: original 240Hz start00 P96 frame proof with the two
 * actually reanchored B51-C hazards. No visual-only replacement or spoofed pose.
 */
import {generateG4E7AJ,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
const fix=(x,n=4)=>Number(x.toFixed(n));
export const AK_NATIVE_SHOTS=Object.freeze([
 Object.freeze({id:'t220',seconds:2.2}),
 Object.freeze({id:'t250',seconds:2.5}),
 Object.freeze({id:'t280',seconds:2.8}),
 Object.freeze({id:'t320',seconds:3.2}),
 Object.freeze({id:'t520',seconds:5.2}),
 Object.freeze({id:'t690',seconds:6.9})
]);
export function g4e7akNativeFrames(){
 const stages={};
 for(const road of AJ_ROADS){
  const doc=generateG4E7AJ(road,'reanchor'),r=new Runner(doc,compile(doc),0,52);
  const plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
  let camera=createCameraState(r.forward),next=0;
  const frames=[];
  for(let tick=1;tick<=Math.round(7/DT)&&next<AK_NATIVE_SHOTS.length;tick++){
   if(['failed','finished'].includes(r.status))break;
   const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
   camera=advanceCamera(camera,r.forward,DT);
   const goal=AK_NATIVE_SHOTS[next];
   if(r.time+1e-6<goal.seconds)continue;
   const pose=capturePose(r),view=viewForPose(pose,camera);
   frames.push({id:goal.id,timeSeconds:fix(r.time,5),tick,
    source:'ACTUAL_240HZ_START00_REANCHORED_28_B51_P96_NOT_HUMAN',
    speedMps:fix(Math.hypot(...r.v),3),pose,velocity:[...r.v],yaw:camera.yaw,
    eye:[...view.eye],front:[...view.front],grounded:r.grounded,
    physicalRoad:r.surface||r.lastSurface,
    originalMovingPose:doc.movingObstacles.filter(o=>
     ['a13-machine-01','a13-machine-02'].includes(o.id)).map(o=>movingObstaclePose(o,r.time))});
   next++;
  }
  if(frames.length!==AK_NATIVE_SHOTS.length||doc.surfaces.length!==7||
     doc.movingObstacles.length!==28||doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
     doc.stageForge.g4e7ajStudy.id!=='reanchor'||
     doc.stageForge.g4e7ajStudy.certifiedSlope2Meters!==0||
     doc.stageForge.productionPromoted!==false)
   throw Error('G4E-7AK reanchor true 240Hz frames/provenance mismatch');
  stages[road]={stageId:doc.stageForge.recordStageId,frames,
   realRoads:7,realB51C:28,changedB51C:2,
   widthMeters:doc.stageForge.g4e7ahStudy.widthMinMeters,
   missingB48Cell52:true};
 }
 return {schema:'dopagaki.g4e7ak-reanchor-real-native-240hz-frames/1',
  physicsHz:1/DT,initialSpeedMps:52,
  steering:'P96_EARLY_SOFT_DIV4_8_RESEARCH_NOT_HUMAN',
  camera:'UNCHANGED_BALL_RELATIVE',
  stages,shots:AK_NATIVE_SHOTS,
  certifiedSlope2Meters:0,publication:'HOLD',
  humanFairness:'HOLD',visualQuality:'HOLD'};
}
