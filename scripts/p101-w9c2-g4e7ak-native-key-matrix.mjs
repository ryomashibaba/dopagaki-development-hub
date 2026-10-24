/**
 * G4E-7AK gate 1: real 240 Hz B48/B51-C hazard clearance and fixed-key probes.
 * Read-only physical candidates from G4E-7AJ, not a new promoted stage.
 * P96 remains a NONHUMAN baseline; key-window overlays are NONHUMAN tests.
 * Screen-space is a mathematical camera projection, NOT a WebGL screenshot,
 * human visibility verdict, or pixel-accurate occlusion verdict.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7AJ,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample} from '../private/reference_only/director/surface.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';

const focusIds=['a13-machine-01','a13-machine-02'];
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const len=a=>Math.hypot(...a);
const unit=a=>a.map(x=>x/(len(a)||1));
const fix=(x,n=3)=>Number(x.toFixed(n));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const AK_KEY_PROBES=Object.freeze([
 Object.freeze({id:'p96-control',from:0,to:0,delta:0}),
 Object.freeze({id:'left-early',from:2.05,to:2.80,delta:-.38}),
 Object.freeze({id:'right-early',from:2.05,to:2.80,delta:.38}),
 Object.freeze({id:'left-late',from:2.62,to:3.22,delta:-.38}),
 Object.freeze({id:'right-late',from:2.62,to:3.22,delta:.38})
]);
export const AK_FRAME_SECONDS=Object.freeze([1.8,2.2,2.5,2.8,3.2,4.2,5.2,6.0]);

function basis(road,u){
 const mid=sample(road,u,.5),left=sample(road,u,0),right=sample(road,u,1);
 const a=sample(road,Math.max(0,u-.003),.5),b=sample(road,Math.min(1,u+.003),.5);
 const tangent=unit([b[0]-a[0],0,b[2]-a[2]]);
 const axis=unit([-tangent[2],0,tangent[0]]);
 return {mid,tangent,axis,width:len(sub(left,right))};
}
function section(road,u,pose){
 const b=basis(road,u),d=sub(pose.center,b.mid),yaw=pose.yawRadians;
 const x=[Math.cos(yaw),0,-Math.sin(yaw)],z=[Math.sin(yaw),0,Math.cos(yaw)];
 const halfLat=Math.abs(dot(b.axis,x))*pose.halfSize[0]+Math.abs(dot(b.axis,z))*pose.halfSize[2]+RADIUS;
 const halfLong=Math.abs(dot(b.tangent,x))*pose.halfSize[0]+Math.abs(dot(b.tangent,z))*pose.halfSize[2]+RADIUS;
 const longitudinal=dot(d,b.tangent),lateral=dot(d,b.axis);
 const intersects=Math.abs(longitudinal)<=halfLong &&
  Math.abs(d[1])<=pose.halfSize[1]+RADIUS+1.5;
 const usable=b.width-2*RADIUS;
 const left=intersects?clamp(lateral-halfLat+b.width/2-RADIUS,0,usable):usable;
 const right=intersects?clamp(b.width/2-RADIUS-lateral-halfLat,0,usable):usable;
 return {widthM:fix(b.width),longitudinalM:fix(longitudinal),
  lateralM:fix(lateral),intersectsApproxSection:intersects,
  leftFreeM:fix(left),rightFreeM:fix(right),
  bothBelowBallDiameter:intersects&&left<2*RADIUS&&right<2*RADIUS};
}
function projection(view,point){
 const v=sub(point,view.eye),depth=dot(v,view.front);
 const x=depth>.01?1.35*dot(v,view.right)/((16/9)*depth):null;
 const y=depth>.01?1.35*dot(v,view.up)/depth:null;
 return {distanceM:fix(len(v)),depthM:fix(depth),
  ndcX:x===null?null:fix(x,4),ndcY:y===null?null:fix(y,4),
  insideApproxFrame:depth>0&&Math.abs(x)<.98&&Math.abs(y)<.95};
}
function play(doc,probe){
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r);
 const surge=createA13SurgeState(),road=doc.surfaces[0],focused=focusIds.map(id=>
  doc.movingObstacles.find(x=>x.id===id));
 if(focused.some(x=>!x))throw Error('G4E-7AK missing genuine original B51-C');
 const minimum=focused.map(o=>({id:o.id,separationM:Infinity,timeSeconds:null}));
 let camera=createCameraState(r.forward),contacts=[],samples=[],frames=[];
 const targetTicks=AK_FRAME_SECONDS.map(t=>Math.round(t/DT));
 for(let tick=1;tick<=Math.round(9/DT)&&['ready','running'].includes(r.status);tick++){
  const prior=r.events.length,timeBefore=r.time;
  const auto=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  const pulse=timeBefore>=probe.from&&timeBefore<probe.to?probe.delta:0;
  const input=clamp(auto+pulse,-1,1);
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  camera=advanceCamera(camera,r.forward,DT);
  for(const e of r.events.slice(prior))if(e.type==='moving-contact')
   contacts.push({id:e.id,timeSeconds:fix(e.t,5),mode:e.mode});
  for(let i=0;i<focused.length;i++){
   const pose=movingObstaclePose(focused[i],r.time);
   const distance=sphereBoxSeparation(r.p,RADIUS,pose).separation;
   if(distance<minimum[i].separationM){
    minimum[i].separationM=distance;minimum[i].timeSeconds=fix(r.time,5);
   }
  }
  if(tick%48===0){
   samples.push({seconds:fix(r.time,2),status:r.status,
    speedMps:fix(len(r.v)),actualInput:fix(input,4),pulse:fix(pulse,3),
    playerPosition:r.p.map(v=>fix(v)),machines:focused.map((o,i)=>
     ({id:o.id,...section(road,i===0?.32:.80,movingObstaclePose(o,r.time))}))});
  }
  if(probe.id==='p96-control'&&targetTicks.includes(tick)){
   const view=viewForPose(capturePose(r),camera);
   frames.push({seconds:fix(r.time,4),speedMps:fix(len(r.v)),
    cameraSource:'ACTUAL_NATIVE_240HZ_P96_NOT_HUMAN',
    hazards:focused.map(o=>({id:o.id,...projection(view,movingObstaclePose(o,r.time).center)}))});
  }
 }
 return {id:probe.id,steerSource:'P96_AUTOMATED_WITH_FIXED_AD_KEY_WINDOW_NOT_HUMAN',
  keyWindowSeconds:probe.delta?{from:probe.from,to:probe.to,delta:probe.delta}:null,
  status:r.status,endedAtSeconds:fix(r.time,5),failure:r.failure??null,
  collisionEvents:contacts,minimumSeparation:minimum.map(x=>({...x,separationM:fix(x.separationM)})),
  samples,frames,humanReadability:'HOLD',humanFairness:'HOLD'};
}
export function g4e7akIntegrity(){
 return AJ_ROADS.map(road=>{
  const source=generateG4E7AJ(road,'original'),candidate=generateG4E7AJ(road,'reanchor');
  if(source.surfaces.length!==7||candidate.surfaces.length!==7||
    source.movingObstacles.length!==28||candidate.movingObstacles.length!==28||
    source.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
    JSON.stringify(source.surfaces)!==JSON.stringify(candidate.surfaces)||
    JSON.stringify(source.route)!==JSON.stringify(candidate.route)||
    JSON.stringify(source.movingObstacles.slice(0,12))!==JSON.stringify(candidate.movingObstacles.slice(0,12))||
    JSON.stringify(source.movingObstacles.slice(14))!==JSON.stringify(candidate.movingObstacles.slice(14))||
    candidate.stageForge.productionPromoted!==false||
    candidate.stageForge.g4e7ajStudy.certifiedSlope2Meters!==0)
   throw Error('G4E-7AK source provenance/regression failure');
  return {road,realSurfaces:7,realMovingObstacles:28,unchangedOriginalMachines:26,
   actualVoidCells:source.surfaces[0].voidLongitudinalCells,
   minWidthMeters:candidate.stageForge.g4e7ahStudy.widthMinMeters};
 });
}
export function g4e7akMatrix(){
 const integrity=g4e7akIntegrity(),results=[];
 for(const provenance of integrity){
  const stage=generateG4E7AJ(provenance.road,'reanchor');
  results.push({road:provenance.road,stageId:stage.stageForge.recordStageId,
   truePhysicalRoad:provenance,probes:AK_KEY_PROBES.map(p=>play(stage,p))});
 }
 return {schema:'dopagaki.g4e7ak-true-B48-28B51-key-probe-240hz/1',
  physicsHz:1/DT,startSpeedMps:52,actualRoads:7,actualMovers:28,
  source:'G4E7AJ_REANCHOR_NO_STAGE_MUTATION',
  method:'REAL_NATIVE_P96_PLUS_SCRIPTED_AD_WINDOWS_AND_CAMERA_PROJECTION',
  limitation:'NOT_HUMAN_NOT_WEBGL_NOT_OCCLUSION_PROOF_NOT_FAIRNESS_CERTIFICATION',
  interpretation:'LANE_SECTIONS_ARE_APPROXIMATE_3D_OBB_CROSS_SECTIONS_NOT_FREE_PATH_PROOF',
  results,certifiedSlope2Meters:0,humanPlayability:'HOLD',
  artQuality:'HOLD',productionPromotion:false,publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const x=g4e7akMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(x,null,2)+'\n');
 console.log('G4E7AK_NATIVE_KEY_WINDOWS '+JSON.stringify(x.results.map(x=>({road:x.road,
  probes:x.probes.map(p=>({id:p.id,status:p.status,t:p.endedAtSeconds,
   collisions:p.collisionEvents,min:p.minimumSeparation}))}))));
}
