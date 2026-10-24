/**
 * G4E-7S private 240Hz canonical start00 camera evidence.
 * Store real physics snapshots; do NOT infer high-speed view from static spawns,
 * reset velocity, move the ball, or silently enable P96 for human play.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7RPhysical} from './p101-w9c2-g4e7r-grade-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';

export const G4E7S_TARGETS=Object.freeze([
 Object.freeze({id:'approach',u:.75}),
 Object.freeze({id:'lip',u:.805}),
 Object.freeze({id:'flight',u:.833}),
 Object.freeze({id:'rejoin',u:.887})
]);
const round=(x,n=4)=>Number(x.toFixed(n));
const sub=(a,b)=>a.map((v,k)=>v-b[k]),dot=(a,b)=>a.reduce((v,x,k)=>v+x*b[k],0);
function closest(points,p){
 let best={distance:Infinity,u:0};
 for(let i=0;i<points.length-1;i++){
  const a=points[i],v=sub(points[i+1],a),
   t=Math.max(0,Math.min(1,dot(sub(p,a),v)/(dot(v,v)||1))),
   nearest=a.map((x,k)=>x+t*v[k]),dist=Math.hypot(...sub(p,nearest));
  if(dist<best.distance)best={distance:dist,u:(i+t)/(points.length-1)};
 }
 return best;
}
export function generateG4E7SNativeCamera(){
 const doc=generateG4E7RPhysical('cut');
 if(doc.stageForge.g4e7rStudy.officialSlope2Meters!==0||doc.movingObstacles.length!==28)
  throw Error('G4E-7S requires exactly real B48 CUT and all original obstacles');
 const runner=new Runner(doc,compile(doc),0,52);
 const steerPlan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState();
 const road=doc.surfaces[0],path=Array.from({length:257},(_,i)=>sample(road,i/256,.5));
 let camera=createCameraState(runner.forward),next=0,peak=52,air=false,rejoined=false;
 const frames=[];
 for(let tick=0;tick<11/DT&&runner.status!=='failed'&&runner.status!=='finished'&&next<G4E7S_TARGETS.length;tick++){
  const steer=p96DodgeSteer(runner,steerPlan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(runner,steer,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false
  });
  camera=advanceCamera(camera,runner.forward,DT);
  const speed=Math.hypot(...runner.v),proj=closest(path,runner.p);
  peak=Math.max(peak,speed);
  if(proj.u>.81&&!runner.grounded)air=true;
  if(air&&proj.u>.84&&runner.grounded&&runner.surface===road.id)rejoined=true;
  const target=G4E7S_TARGETS[next];
  if(proj.u>=target.u&&proj.distance<22&&
    (runner.surface===road.id||!runner.grounded)&&speed>70){
   const pose=capturePose(runner),view=viewForPose(pose,camera);
   frames.push({id:target.id,source:'CANONICAL_START00_P96_SCRIPTED_NOT_HUMAN',
    tick:tick+1,physicsHz:1/DT,timeSeconds:round(runner.time,5),
    roadU:round(proj.u,6),distanceToRoad:round(proj.distance,3),
    speedMps:round(speed,3),grounded:runner.grounded,
    onOriginalB48:runner.surface===road.id,
    pose,velocity:[...runner.v],yaw:camera.yaw,
    eye:[...view.eye],front:[...view.front],right:[...view.right],up:[...view.up]});
   next++;
  }
 }
 if(frames.length!==G4E7S_TARGETS.length||!air||!rejoined||
   frames.some(f=>f.speedMps<70||f.physicsHz!==240))
  throw Error('G4E-7S incomplete high-speed actual B48 flight/rejoin evidence');
 return {schema:'dopagaki.g4e7s-native-camera/1',variant:'G4E7R-CUT',
  stageId:doc.stageForge.recordStageId,physicsHz:240,spawnIndex:0,
  profile:'OVERDRIVE',startSpeedMps:52,
  steering:'P96_DIV_4_8_SCRIPTED_NOT_HUMAN',
  camera:'P70_BALL_LOCK_GENTLE_HEADING_240HZ_APPROX_RENDER',
  nativeSource:'REAL_START00_240HZ_NOT_MANUAL',peakSpeedMps:round(peak,2),
  observedAir:air,observedRejoin:rejoined,
  originalMovingCount:28,realRoads:7,frames,
  motionNotHuman:true,sceneryNeverCollision:true,
  officialSlopeDnaMeters:0,approval:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const data=generateG4E7SNativeCamera();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(data,null,2)+'\n');
 console.log('G4E7S_NATIVE '+JSON.stringify({count:data.frames.length,
  frames:data.frames.map(f=>({id:f.id,u:f.roadU,speed:f.speedMps,grounded:f.grounded})),
  air:data.observedAir,rejoin:data.observedRejoin,approval:data.approval}));
}
