/** G4E-7AU read-only start00-to-road2 + isolated real-road2 240Hz QA.
 * No in-game assist/checkpoint, speed reset, or world edits. An isolated
 * checkpoint is NOT proof the player can reach it from start00.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7AT} from './p101-w9c2-g4e7at-crown-chasm.mjs';
import {generateG4E7AS} from './p101-w9c2-g4e7as-banked-serpent.mjs';
import {AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';

const r=(v,n=4)=>Number.isFinite(v)?Number(v.toFixed(n)):null;
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const len=x=>Math.hypot(...x);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const norm=x=>x.map(v=>v/(len(x)||1));
const diff=(a,b)=>a.map((v,i)=>v-b[i]);
const guideLine=s=>Array.from({length:257},(_,i)=>sample(s,i/256,.5));
function projection(points,p) {
 let closest={distanceMeters:Infinity,u:0};
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],ab=diff(b,a),q=diff(p,a),
   t=clamp(dot(q,ab)/(dot(ab,ab)||1),0,1),d=len(diff(q,ab.map(v=>v*t)));
  if(d<closest.distanceMeters)closest={distanceMeters:d,u:(i+t)/256};
 }
 return closest;
}
function signedMargin(doc,roadIndex,p,u){
 const road=doc.surfaces[roadIndex],
  l=sample(road,u,0),h=sample(road,u,1),edge=diff(h,l),
  fraction=dot(diff(p,l),edge)/(dot(edge,edge)||1);
 return {signedBallMarginMeters:r(Math.min(fraction,1-fraction)*len(edge)-RADIUS),
  localCrossFraction:r(fraction,5),widthMeters:r(len(edge))};
}
function playStart00(doc,seconds){
 const run=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,run),
  surge=createA13SurgeState(),seen=new Set(),sampled=[],
  guide=doc.surfaces.slice(0,2).map(guideLine);
 const roadIds=doc.surfaces.map(x=>x.id),road2=roadIds[1];
 let firstRoad2=null,closestRoad2={meters:Infinity,seconds:null,u:null},
  road2Samples=0,minRoad2Margin=Infinity,minRoad1Margin=Infinity,peak=52,
  eventsCursor=0,events={moving:0,staticFatal:0,air:0};
 for(let k=0;k<Math.round(seconds/DT)&&['ready','running'].includes(run.status);k++){
  const input=clamp(p96DodgeSteer(run,plan,'early-soft',movingObstaclePose).input/4.8,-1,1);
  p101Step(run,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(run,surge),collisionRecovery:false});
  peak=Math.max(peak,len(run.v));
  if(run.surface)seen.add(run.surface);
  if(run.surface===road2&&!firstRoad2)firstRoad2={timeSeconds:r(run.time,5),speedMps:r(len(run.v))};
  for(const e of run.events.slice(eventsCursor)){
   if(e.type==='moving-contact')events.moving++;
   if(e.type==='static-fatal-contact')events.staticFatal++;
   if(e.type==='air')events.air++;
  }
  eventsCursor=run.events.length;
  if(k%24===0||!['ready','running'].includes(run.status)){
   const projections=guide.map(x=>projection(x,run.p));
   if(projections[1].distanceMeters<closestRoad2.meters)
    closestRoad2={meters:projections[1].distanceMeters,seconds:r(run.time,4),u:r(projections[1].u,5)};
   const active=roadIds.indexOf(run.surface);
   if(active===0&&projections[0].distanceMeters<50)
    minRoad1Margin=Math.min(minRoad1Margin,signedMargin(doc,0,run.p,projections[0].u).signedBallMarginMeters);
   if(active===1&&projections[1].distanceMeters<50){
    road2Samples++;const margin=signedMargin(doc,1,run.p,projections[1].u);
    minRoad2Margin=Math.min(minRoad2Margin,margin.signedBallMarginMeters);
    if(sampled.length<80)sampled.push({t:r(run.time,3),u:r(projections[1].u,4),
     marginMeters:margin.signedBallMarginMeters,speedMps:r(len(run.v),2),
     widthMeters:margin.widthMeters,grounded:run.grounded});
   }
  }
 }
 return {method:'REAL_START00_P96_FIXED_PROFILE_DIV4_8_NOT_HUMAN',
  realPhysicsHz:1/DT,maxSeconds:seconds,endedSeconds:r(run.time,5),status:run.status,
  failure:run.failure??null,peakSpeedMps:r(peak,3),
  reachedRoad2:Boolean(firstRoad2),firstRoad2,
  visitedSurfaceIds:roadIds.filter(x=>seen.has(x)),closestRoad2,
  actualRoad2SampleCount:road2Samples,
  minRoad2BallMarginMeters:r(minRoad2Margin),minRoad1BallMarginMeters:r(minRoad1Margin),
  events,road2TrajectorySamples:sampled,
  limitation:'NONE_OF_THIS_PROVES_HUMAN_FAIRNESS_OR_FULL_7_ROAD_COMPLETION'};
}
function checkpoint(doc,u,speed,steer){
 const world=compile(doc),road=doc.surfaces[1],f=frame(road,u,.5),
  normal=f.normal[1]>=0?f.normal:f.normal.map(x=>-x),
  forward=norm(f.forward),position=f.p.map((v,i)=>v+normal[i]*(RADIUS+.025)),
  run=new Runner(doc,world,0,52).resumeAt({position,velocity:forward.map(x=>x*speed),
   forward,normal,surface:road.id,speed});
 // This explicit isolated native trial is not a game spawn, and no assist is enabled.
 run.assist=false;
 const guide=guideLine(road),surge=createA13SurgeState();
 let eventsCursor=0;
 let maxProgress=u,minMargin=Infinity,closestToShoulder=Infinity,moving=0,fatalStatic=0,
  data=[],firstBadMargin=null;
 const seconds=3.4;
 for(let k=0;k<Math.round(seconds/DT)&&['ready','running'].includes(run.status);k++){
  const auto=p94NativeSteer(run,'corrective')/4.8;
  const input=clamp(auto+steer,-1,1);
  p101Step(run,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(run,surge),collisionRecovery:false});
  for(const e of run.events.slice(eventsCursor)){
   if(e.type==='moving-contact')moving++;
   if(e.type==='static-fatal-contact')fatalStatic++;
  }
  eventsCursor=run.events.length;
  if(k%12===0||!['ready','running'].includes(run.status)){
   const proj=projection(guide,run.p),margin=signedMargin(doc,1,run.p,proj.u);
   if(proj.distanceMeters<50){
    maxProgress=Math.max(maxProgress,proj.u);
    minMargin=Math.min(minMargin,margin.signedBallMarginMeters);
    closestToShoulder=Math.min(closestToShoulder,Math.abs(margin.signedBallMarginMeters));
    if(margin.signedBallMarginMeters<0&&!firstBadMargin)firstBadMargin={t:r(run.time,4),u:r(proj.u,5),meters:margin.signedBallMarginMeters};
   }
   if(data.length<24)data.push({t:r(run.time,3),u:r(proj.u,5),m:margin.signedBallMarginMeters,speedMps:r(len(run.v),2)});
  }
 }
 return {method:'ISOLATED_2ND_ROAD_CHECKPOINT_240HZ_NOT_A_NORMAL_START00',
  u,speedMps:speed,offsetInput:steer,real240Hz:true,
  seconds:r(run.time,5),status:run.status,reason:run.failure?.reason??null,
  projectedForwardU:r(maxProgress,5),road2BallMinMarginMeters:r(minMargin),
  closestToShoulderMeters:r(closestToShoulder),firstNegativeMargin:firstBadMargin,
  movingContacts:moving,staticFatalContacts:fatalStatic,
  keySnapshots:data,normalGameplayReachability:'UNPROVEN'};
}
export function g4e7auEvidence({seconds=40}={}){
 if(!Number.isFinite(seconds)||seconds<18||seconds>70)throw Error('AU test seconds bound');
 const results=[];
 for(const road of AJ_ROADS){
  const original=generateG4E7AS(road),frozen=JSON.stringify(original),
   candidate=generateG4E7AT(road),frozenAT=JSON.stringify(candidate);
  const compare=[['AS_BASELINE',original],['AT_CROWN_CHASM',candidate]].map(([id,doc])=>({
   id,start00:playStart00(doc,seconds)
  }));
  const trials=[.18,.70].flatMap(u=>[105,165].map(speed=>checkpoint(candidate,u,speed,0)));
  if(JSON.stringify(original)!==frozen||JSON.stringify(candidate)!==frozenAT)
   throw Error('AU changed source stage');
  results.push({road,compare,isolatedSecondRoad:trials});
 }
 return {schema:'dopagaki.g4e7au-start00-vs-isolated-real-road2/1',
  realB48Roads:7,realB51Moving:28,originalB48VoidCell52:true,
  actualNativeHz:1/DT,records:results,authoredFormalSlope2Meters:0,
  actualHumanPlay:'HOLD',art:'HOLD',publish:'HOLD',promotion:'HOLD',
  interpretation:'START00_REACHABILITY_AND_ISOLATED_SURVIVABILITY_NEVER_CONFLATED'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const d=g4e7auEvidence();
 const out=process.argv[2];
 if(out){fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(d,null,2)+'\n');}
 console.log('G4E7AU_MEASURED '+JSON.stringify(d.records.map(x=>({
  road:x.road,continuous:x.compare.map(c=>({id:c.id,status:c.start00.status,
   sec:c.start00.endedSeconds,roads:c.start00.visitedSurfaceIds.length,
   reached2:c.start00.reachedRoad2,minRoad2Margin:c.start00.minRoad2BallMarginMeters,
   failure:c.start00.failure?.reason??null})),
  checkpoints:x.isolatedSecondRoad.map(c=>({u:c.u,speed:c.speedMps,status:c.status,sec:c.seconds,
   maxU:c.projectedForwardU,margin:c.road2BallMinMarginMeters,reason:c.reason}))
 }))));
}
