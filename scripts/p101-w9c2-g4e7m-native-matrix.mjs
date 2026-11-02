/** Native 240Hz honest G4E-7M physical narrow-road survey (read-only, OFFLINE). */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7FEarlyPhysicalCandidate} from './p101-w9c2-g4e7f-real-slope-build.mjs';
import {generateG4E7MPhysical} from './p101-w9c2-g4e7m-physical-build.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step,p101RoadProgress} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

const fmt=(v,n=3)=>Number(v.toFixed(n));
export function g4e7mNativeRun(variant='GOLD',{maxSeconds=70}={}){
 if(maxSeconds<55||maxSeconds>80)throw Error('G4E7M bounded true physical start00');
 const doc=variant==='GOLD'?generateP101A13W7Candidate():
  variant==='GLIDE'?generateG4E7FEarlyPhysicalCandidate('glide'):
  generateG4E7MPhysical(variant);
 const r=new Runner(doc,compile(doc),0,52),p96=makeP96RoutePlan(doc,r),
   surge=createA13SurgeState(),order=[],visited=new Set(),
   progressMarkers={},samples=[],roadI=doc.surfaces[0].id,roadII=doc.surfaces[1].id;
 const landmarks=[.45,.50,.55,.60,.67],starts={};
 let peak=52,steerTicks=0,airborneTicks=0,overlappingMachines=0;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const steer=p96DodgeSteer(r,p96,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false
  });
  if(Math.abs(steer)>1e-5)steerTicks++;
  if(!r.grounded)airborneTicks++;
  const speed=Math.hypot(...r.v);peak=Math.max(peak,speed);
  const surface=r.surface;
  if(surface&&!visited.has(surface)){visited.add(surface);order.push(surface);
   starts[surface]={t:fmt(r.time),speed:fmt(speed,2)};
  }
  if(surface===roadI||surface===roadII){
   const {u}=p101RoadProgress(r);
   const id=surface===roadI?'skyline':'crown';
   for(const mark of landmarks){
    const key=id+'-'+mark.toFixed(2);
    if(u>=mark&&!Object.hasOwn(progressMarkers,key))
     progressMarkers[key]={time:fmt(r.time),speedMps:fmt(speed,2),grounded:r.grounded};
   }
   if(tick%120===0)samples.push({t:fmt(r.time),part:id,u:fmt(u,4),
    speed:fmt(speed,2),grounded:r.grounded});
  }
 }
 const expected=doc.surfaces.map(s=>s.id);
 const visitedInOrder=expected.every((id,i)=>visited.has(id)&&
  (i===0||order.indexOf(expected[i-1])<order.indexOf(id)));
 const complete=r.status==='finished'&&!r.failure;
 return {variant,source:'TRUE_B48_240HZ_P96_EARLY_SOFT_DIV_4_8_SCRIPTED_NOT_HUMAN',
  revision:doc.stageForge.revision,headless:true,initialSpeedMps:52,hz:1/DT,
  physicsModified:false,originalMovingCount:doc.movingObstacles.length,
  candidatePhysicalMeters:variant==='GOLD'?0:variant==='GLIDE'?300:doc.stageForge.g4e7mRealRoad.totalNominalNarrowCoreMeters,
  approvedSlopeDnaMeters:0,
  gameRegistered:false,playability:'HOLD',
  status:r.status,finished:complete,allSevenInOrder:visitedInOrder,
  visitedRoadCount:expected.filter(id=>visited.has(id)).length,order,
  elapsedSeconds:fmt(r.time),peakSpeedMps:fmt(peak,2),
  airborneSeconds:fmt(airborneTicks*DT),
  movingContactCount:r.events.filter(e=>e.type==='moving-contact').length,
  steerInputTicks:steerTicks,
  firstRoadVisits:starts,progressMarkers,samples,
  failure:r.failure?{...r.failure}:null};
}
export function g4e7mNativeMatrix(){
 const runs=['GOLD','GLIDE','thread','precipice'].map(x=>g4e7mNativeRun(x));
 if(runs.slice(0,2).some(r=>!r.finished||!r.allSevenInOrder||
   r.visitedRoadCount!==7||r.originalMovingCount!==28||r.hz!==240))
  throw Error('G4E7M Gold / G4E7F GLIDE controls failed authentic 240Hz native script');
 return {schema:'dopagaki.w9c2.g4e7m-real-narrow-native/1',
  originalGlideB48Physics300m:300,
  control:{finished:runs[0].finished,time:runs[0].elapsedSeconds,
   roadCount:runs[0].visitedRoadCount,peakMps:runs[0].peakSpeedMps},
  glideControl:{finished:runs[1].finished,time:runs[1].elapsedSeconds,
   roadCount:runs[1].visitedRoadCount,peakMps:runs[1].peakSpeedMps},
  candidates:runs.slice(2).map(x=>({id:x.variant,finished:x.finished,
   status:x.status,visitedOriginalRoadCount:x.visitedRoadCount,
   allSevenInOrder:x.allSevenInOrder,elapsedSeconds:x.elapsedSeconds,
   lossVsGlideSeconds:fmt(x.elapsedSeconds-runs[1].elapsedSeconds),
   physicsWindowMeters:x.candidatePhysicalMeters,peakSpeedMps:x.peakSpeedMps,
   failure:x.failure?x.failure.reason:null,officiallyApprovedSlopeDnaMeters:0,
   humanPlayability:'HOLD'})),
  fullRuns:runs,release:'HOLD',human:'NOT_RUN',approvedSlopeDnaMeters:0};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const result=g4e7mNativeMatrix();
 const destination=process.argv[2];
 if(destination)fs.writeFileSync(destination,JSON.stringify(result,null,2)+'\n');
 console.log('G4E7M_VERDICT '+JSON.stringify({control:result.control,glide:result.glideControl,
  candidates:result.candidates,release:result.release}));
}
