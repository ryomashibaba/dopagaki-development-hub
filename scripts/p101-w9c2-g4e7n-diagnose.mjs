/** G4E-7N read-only diagnostic: physical side-edge fatal vs over-wide P96 avoidance.
 * All alternative steering modes apply only in this offline diagnostic.
 * Absolutely no writes to production, no new colliders, no human-ready claims.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7MPhysical} from './p101-w9c2-g4e7m-physical-build.mjs';
import {generateG4E7FEarlyPhysicalCandidate} from './p101-w9c2-g4e7f-real-slope-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step,p101RoadProgress} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const fmt=(v,n=3)=>Number(v.toFixed(n));
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const clamp=(x,a,b)=>Math.max(a,Math.min(x,b));
export const G4E7N_STEERS=Object.freeze(['p96-original','route-only','dodge-3m']);
export function g4e7nLocalReadout(doc,r){
 const road=doc.surfaces.find(s=>s.id===(r.surface||r.lastSurface));
 if(!road)return {roadId:null};
 const progress=p101RoadProgress(r),u=clamp(progress.u,0,1);
 const left=sample(road,u,0),right=sample(road,u,1),center=sample(road,u,.5);
 const lateral=sub(right,left),lensq=dot(lateral,lateral);
 const v=clamp(dot(sub(r.p,left),lateral)/(lensq||1),-3,4),width=Math.sqrt(lensq);
 const f=frame(road,u,.5);
 return {roadId:road.id,u:fmt(u,5),v:fmt(v,4),
  widthMeters:fmt(width,3),centerOffsetMeters:fmt(Math.abs(v-.5)*width,3),
  availableHalfWidthMeters:fmt(width/2,3),
  edgeExceedMeters:fmt(Math.max(0,(Math.abs(v-.5)-.5)*width),3),
  ballHeightAboveCenterMeters:fmt(r.p[1]-center[1],3),
  lateralPosition:[...r.p].map(x=>fmt(x,3)),
  frameUp:fmt(f.normal[1],4)};
}
export function g4e7nDiagnosticRun(variant='thread',mode='p96-original',{maxSeconds=70}={}){
 if(!G4E7N_STEERS.includes(mode))throw Error('G4E7N diagnostic mode required');
 const doc=variant==='GLIDE'?generateG4E7FEarlyPhysicalCandidate('glide'):
  generateG4E7MPhysical(variant);
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState();
 let peak=52,steerTicks=0,airborneTicks=0;
 const around=[],sections=[],seen=new Set(),events=[];
 let maxSideRatio=0,highestAbsoluteP96Target=0;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const p96=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
  const route=p94NativeSteer(r,'corrective');
  let steer=p96.input;
  if(mode==='route-only')steer=route;
  if(mode==='dodge-3m')steer=clamp(route+(p96.input-route)*(.12),-1,1);
  steer/=4.8;
  if(p96.station)highestAbsoluteP96Target=Math.max(highestAbsoluteP96Target,Math.abs(p96.desiredOffset));
  if(Math.abs(steer)>1e-5)steerTicks++;
  p101Step(r,steer,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  const speed=Math.hypot(...r.v);peak=Math.max(speed,peak);
  if(!r.grounded)airborneTicks++;
  if(r.surface&&!seen.has(r.surface)){sections.push(r.surface);seen.add(r.surface);}
  const local=g4e7nLocalReadout(doc,r);
  if(local.widthMeters){maxSideRatio=Math.max(maxSideRatio,2*local.centerOffsetMeters/local.widthMeters);}
  if(tick%8===0||r.status==='failed'){
   const q={t:fmt(r.time,5),mode,grounded:r.grounded,velocity:[...r.v].map(x=>fmt(x,3)),
    speed:fmt(speed,2),steerInput:fmt(steer,5),rawP96:fmt(p96.input,4),
    rawCorrective:fmt(route,4),requestedAvoidanceMeters:p96.desiredOffset,
    p96Station:p96.station,leadMeters:p96.leadDistance,
    collisionCount:r.collisions,status:r.status,...local};
   around.push(q);
   if(around.length>38)around.shift();
  }
 }
 const fatal=r.events.filter(e=>e.type==='static-fatal-contact'||e.type==='moving-contact'
   ||e.type==='failure'||e.type==='moving-unsafe').map(e=>structuredClone(e));
 return {variant,mode,source:'P96/4.8, p94 corrective, diagnostic only alternate software controls',
  status:r.status,finished:r.status==='finished'&&!r.failure,
  allSeven:doc.surfaces.every(s=>seen.has(s.id)),
  roadsVisited:sections.length,roadOrder:sections,
  elapsedSeconds:fmt(r.time,5),peakMps:fmt(peak,2),
  collisionCount:r.collisions,airborneSeconds:fmt(airborneTicks*DT),
  steerTicks,highestAbsoluteP96Target,maxCenterOffsetDivHalfWidth:fmt(maxSideRatio,3),
  movingContactCount:r.events.filter(e=>e.type==='moving-contact').length,
  fatal,failure:r.failure??null,finalReadout:g4e7nLocalReadout(doc,r),
  recentLast38Samples:around,officialSlopeMeters:0,humanQA:'NOT_RUN'};
}
export function g4e7nDiagnosticMatrix(){
 const order=[['thread','p96-original'],['thread','route-only'],
  ['thread','dodge-3m'],['precipice','p96-original'],['GLIDE','p96-original']];
 const cases=order.map(([variant,mode])=>g4e7nDiagnosticRun(variant,mode));
 const original=cases[0],precipice=cases[3],glide=cases[4];
 if(original.finished||!original.failure||!original.fatal.some(e=>e.type==='static-fatal-contact')||
  !precipice.finished||!glide.finished||precipice.roadsVisited!==7||glide.roadsVisited!==7)
  throw Error('G4E7N baseline native evidence drift, no honest classification');
 return {schema:'dopagaki.w9c2.g4e7n-thin-road-physical-failure/1',
  cases,diagnosticOnly:true,
  controllerDesignCaveat:'P96 aims for ~25m offset on B48 roads now only 12–16m total wide',
  frozenGoldUntouched:true,existingPrecipiceUnchanged:true,extraCollisionAreaAdded:0,
  inGameSteeringChanged:false,cameraChanged:false,
  autoCompletionIsNotHumanPlayability:true,
  humanQA:'HOLD',release:'HOLD',certifiedSlope2Meters:0};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const data=g4e7nDiagnosticMatrix();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(data,null,2)+'\n');
 console.log('G4E7N_DIAGNOSTIC '+JSON.stringify(data.cases.map(x=>({
  variant:x.variant,mode:x.mode,finish:x.finished,time:x.elapsedSeconds,
  failure:x.failure?.reason,staticFatal:x.fatal.filter(x=>x.type==='static-fatal-contact')
   .map(e=>({part:e.part,surface:e.surface,inwardNormalMps:e.inwardNormalMps})),
  local:x.finalReadout,contacts:x.movingContactCount}))));
}
