/** G4E-7DJ: isolated extension of BG time SAMPLING only.
 * The Runner, step function, steering and native camera are unchanged.
 * Original 15/17 frames remain first so CX geometry/landmark selection
 * cannot silently drift. 18.5s is off-road and explicitly diagnostic.
 * This is NOT a human run and is never copied into a public build.
 */
/** BG authentic 240Hz private BC rollDeck camera/speed snapshots.
 * Actual start00 P96 only; NEVER claim these are human play sessions.
 * Samples for visual-only freeze hold, no CCD/steer/spawn modifications.
 */
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
export const BG_SHOTS=Object.freeze([
 Object.freeze({id:'t1400',seconds:14}),
 Object.freeze({id:'t1450',seconds:14.5}),
 Object.freeze({id:'t1500',seconds:15}),
 Object.freeze({id:'t1550',seconds:15.5}),
 Object.freeze({id:'t1600',seconds:16}),
 Object.freeze({id:'t1650',seconds:16.5}),
 Object.freeze({id:'t1700',seconds:17}),
 Object.freeze({id:'t1750',seconds:17.5}),
 Object.freeze({id:'t1800',seconds:18}),
 Object.freeze({id:'t1850',seconds:18.5})
]);
const round=(x,n=4)=>Number(x.toFixed(n));
export function g4e7djNativeStoryboard(){
 const stages={};
 for(const road of AJ_ROADS){
  const doc=generateG4E7BC(road,'rollDeck');
  if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
     doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
     doc.stageForge.g4e7bcStudy?.variant!=='rollDeck'||
     doc.stageForge.g4e7bcStudy.road!==road||
     doc.stageForge.productionPromoted!==false||
     doc.stageForge.g4e7bcStudy.formalSlope2Meters!==0)
    throw Error('BG requires exact original protected BC physics');
  const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
  let camera=createCameraState(r.forward),next=0;
  const frames=[];
  for(let tick=1;tick<=Math.round(19/DT)&&next<BG_SHOTS.length;tick++){
   if(r.status==='failed'||r.status==='finished')break;
   const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
   p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
   camera=advanceCamera(camera,r.forward,DT);
   const goal=BG_SHOTS[next];if(r.time+1e-6<goal.seconds)continue;
   const pose=capturePose(r),view=viewForPose(pose,camera);
   frames.push({id:goal.id,tick,timeSeconds:round(r.time,5),
    source:'ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN',pose,
    velocity:[...r.v],yaw:camera.yaw,eye:[...view.eye],front:[...view.front],
    speedMps:round(Math.hypot(...r.v),3),grounded:r.grounded,
    physicalRoad:r.surface||r.lastSurface,
    nativeSteer:round(steer,6),nativeCollisionCount:r.collisions});
   next++;
  }
  if(frames.length!==BG_SHOTS.length||
     frames.some(f=>f.timeSeconds<14.9||f.speedMps<=52||!f.pose||
       f.source!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'))
    throw Error('BG missing authentic 240Hz camera proof for '+road);
  // Preserve the ORIGINAL CX hero-site selection: the first two camera
  // records are the immutable 15s and 17s. Newly sampled timestamps follow.
  // This reorder changes neither the physics nor any recorded native pose.
  const originalFirst=['t1500','t1700','t1850'];
  const storyboardFrames=[...originalFirst.map(id=>frames.find(f=>f.id===id)),
   ...frames.filter(f=>!originalFirst.includes(f.id))];
  stages[road]={stageId:doc.stageForge.recordStageId,originalStart00:true,
   actualB48:7,actualMovingB51:28,originalGapCell52:true,frames:storyboardFrames};
 }
 return {schema:'dopagaki.g4e7bg-real-BC-rollDeck-visual-native-240hz/1',
  physicsHz:1/DT,initialSpeedMps:52,shots:BG_SHOTS,stages,
  steering:'P96_EARLY_SOFT_DIV4_8_SCRIPTED_NOT_HUMAN',
  camera:'UNCHANGED_ORIGINAL_BALL_RELATIVE_NATIVE',
  actualRenderFrameNotGameplay:true,certifiedSlope2Meters:0,
  humanFairness:'HOLD',artApproval:'HOLD',publication:'HOLD'};
}
