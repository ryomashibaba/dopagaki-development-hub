/** G4E-7AI: authentic 240Hz native snapshots for the two R2 7/7 candidates.
 * Static frame playback is VISUAL REVIEW ONLY, not automated human steering.
 */
import {generateG4E7AH} from './p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
export const AI_VARIANTS=Object.freeze(['r2-control','true-pinch','pinch-switch']);
export const AI_SHOTS=Object.freeze([
 Object.freeze({id:'t315',seconds:3.15}),
 Object.freeze({id:'t365',seconds:3.65}),
 Object.freeze({id:'t415',seconds:4.15}),
 Object.freeze({id:'t450',seconds:4.50}),
 Object.freeze({id:'t515',seconds:5.15}),
 Object.freeze({id:'t600',seconds:6.00})
]);
const round=(x,d=4)=>Number(x.toFixed(d));
export function g4e7aiNativeFrames(){
 const stages={};
 for(const id of AI_VARIANTS){
  const doc=generateG4E7AH(id),
   r=new Runner(doc,compile(doc),0,52),
   plan=makeP96RoutePlan(doc,r),
   surge=createA13SurgeState();
  let camera=createCameraState(r.forward),next=0;
  const frames=[],road=doc.surfaces[0],gap=doc.stageForge.g4e7ahStudy.gap;
  for(let tick=1;tick<=7/DT&&next<AI_SHOTS.length;tick++){
   if(['failed','finished'].includes(r.status))break;
   const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
   camera=advanceCamera(camera,r.forward,DT);
   const target=AI_SHOTS[next];
   if(r.time+1e-6<target.seconds)continue;
   const pose=capturePose(r),view=viewForPose(pose,camera),
    lip=sample(road,gap.uTakeoff,.5),landing=sample(road,gap.uLanding,.5);
   const distance=p=>Math.hypot(...p.map((x,i)=>x-view.eye[i]));
   frames.push({id:target.id,timeSeconds:round(r.time,5),tick,
    source:'ACTUAL_240HZ_START00_P96_NOT_HUMAN',speedMps:round(Math.hypot(...r.v),3),
    grounded:r.grounded,physicalRoad:r.surface||r.lastSurface,
    pose,velocity:[...r.v],yaw:camera.yaw,
    eye:[...view.eye],front:[...view.front],
    takeoffEyeDistanceMeters:round(distance(lip),2),
    landingEyeDistanceMeters:round(distance(landing),2),
    physicsCollisionCount:r.collisions});
   next++;
  }
  if(frames.length!==AI_SHOTS.length)throw Error('AD genuine 240Hz frames incomplete: '+id);
  if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
     doc.stageForge.g4e7ahStudy.source!=='G4E7AC_R2_APPROACH_ARC_FULL_7_ROAD_SUCCESS'||
     road.voidLongitudinalCells?.join(',')!=='52'||
     doc.stageForge.productionPromoted!==false||
     doc.stageForge.g4e7ahStudy.certifiedSlope2Meters!==0)
    throw Error('AD physical provenance violated');
  stages[id]={stageId:doc.stageForge.recordStageId,frames,
   originalMovingMachines:28,originalRoads:7,realGap:gap,minimumRealWidthMeters:doc.stageForge.g4e7ahStudy.widthMinMeters,
   humanFairness:'HOLD',visualQuality:'UNREVIEWED'};
 }
 return {schema:'dopagaki.g4e7ai-R2-visual-native-240hz/1',
  physicsHz:1/DT,initialSpeedMps:52,
  steer:'P96_RESEARCH_EARLY_SOFT_DIV4_8_NOT_HUMAN',
  camera:'UNCHANGED_BALL_LOCKED_RELATIVE_CAMERA',
  stages,shots:AI_SHOTS,certifiedSlope2Meters:0,
  humanQuality:'HOLD',visualQuality:'UNREVIEWED',publication:'HOLD'};
}
